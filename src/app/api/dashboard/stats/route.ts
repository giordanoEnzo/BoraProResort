
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { startOfMonth, endOfMonth, eachDayOfInterval, format, parseISO } from 'date-fns'

export async function GET() {
    try {
        const now = new Date()
        const startOfCurrentMonth = startOfMonth(now)
        const endOfCurrentMonth = endOfMonth(now)

        // 1. KPIs
        const pendingCount = await prisma.reservation.count({
            where: { status: 'PENDING' }
        })

        const confirmedCount = await prisma.reservation.count({
            where: { status: 'CONFIRMED' }
        })

        const closedThisMonth = await prisma.reservation.count({
            where: {
                status: 'CONFIRMED',
                createdAt: {
                    gte: startOfCurrentMonth,
                    lte: endOfCurrentMonth
                }
            }
        })

        // 2. Sales per Month (from all time? or last year? Let's do all time or specific year range. 
        // For simplicity and "each month of each year", we fetch all CONFIRMED and group by month-year).
        const allConfirmed = await prisma.reservation.findMany({
            where: { status: 'CONFIRMED' },
            select: { createdAt: true },
            orderBy: { createdAt: 'asc' }
        })

        const salesPerMonthMap = new Map<string, number>()
        allConfirmed.forEach(res => {
            const monthYear = format(res.createdAt, 'yyyy-MM')
            salesPerMonthMap.set(monthYear, (salesPerMonthMap.get(monthYear) || 0) + 1)
        })

        const salesPerMonth = Array.from(salesPerMonthMap.entries()).map(([date, count]) => ({
            date, // "2024-01"
            count
        })).sort((a, b) => a.date.localeCompare(b.date))

        // 3. Most requested days per month
        // We consider PENDING and CONFIRMED as "requested".
        const allRequested = await prisma.reservation.findMany({
            where: {
                status: { in: ['PENDING', 'CONFIRMED'] }
            },
            select: { startDate: true, endDate: true }
        })

        // Map: "yyyy-MM" -> { "01": count, "02": count, ... }
        const daysFrequency: Record<string, Record<string, number>> = {}

        allRequested.forEach(res => {
            // Iterate days between start and end
            try {
                const interval = eachDayOfInterval({ start: res.startDate, end: res.endDate })
                interval.forEach(date => {
                    const monthKey = format(date, 'yyyy-MM')
                    const dayKey = format(date, 'dd')

                    if (!daysFrequency[monthKey]) {
                        daysFrequency[monthKey] = {}
                    }
                    if (!daysFrequency[monthKey][dayKey]) {
                        daysFrequency[monthKey][dayKey] = 0
                    }
                    daysFrequency[monthKey][dayKey]++
                })
            } catch (e) {
                // Invalid dates might throw, ignore
            }
        })

        // Format for frontend: "yyyy-MM" -> Top 5 days
        const mostRequestedDays = Object.entries(daysFrequency).map(([month, days]) => {
            const sortedDays = Object.entries(days)
                .sort(([, countA], [, countB]) => countB - countA)
                .slice(0, 5) // Top 5
                .map(([day, count]) => ({ day, count }))

            return {
                month,
                days: sortedDays
            }
        }).sort((a, b) => a.month.localeCompare(b.month))

        return NextResponse.json({
            kpi: {
                pending: pendingCount,
                confirmed: confirmedCount,
                closedThisMonth
            },
            salesPerMonth,
            mostRequestedDays
        })

    } catch (error) {
        console.error('Stats error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
