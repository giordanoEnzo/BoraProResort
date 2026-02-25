import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { eventType, path, targetId, targetText, duration, sessionId } = body

        if (!eventType || !path) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const event = await prisma.analyticsEvent.create({
            data: {
                eventType,
                path,
                targetId: targetId || null,
                targetText: targetText || null,
                duration: duration || null,
                sessionId: sessionId || null,
            }
        })

        return NextResponse.json(event)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function GET(request: Request) {
    try {
        const urlParams = new URL(request.url).searchParams
        const type = urlParams.get('type') // Optional filter by type
        const isExport = urlParams.get('export') === 'true'
        const page = parseInt(urlParams.get('page') || '1', 10)
        const limit = parseInt(urlParams.get('limit') || '50', 10)
        const startDate = urlParams.get('startDate')
        const endDate = urlParams.get('endDate')

        const whereClause: any = type && type !== 'all' ? { eventType: type } : {}

        if (startDate || endDate) {
            whereClause.createdAt = {}
            if (startDate) {
                const start = new Date(startDate)
                if (!isNaN(start.getTime())) {
                    whereClause.createdAt.gte = start
                }
            }
            if (endDate) {
                const end = new Date(endDate)
                if (!isNaN(end.getTime())) {
                    end.setHours(23, 59, 59, 999)
                    whereClause.createdAt.lte = end
                }
            }
        }

        if (isExport) {
            const allEvents = await prisma.analyticsEvent.findMany({
                where: whereClause,
                orderBy: { createdAt: 'desc' }
            })
            return NextResponse.json({ events: allEvents })
        }

        const skip = (page - 1) * limit

        const [events, totalEvents] = await Promise.all([
            prisma.analyticsEvent.findMany({
                where: whereClause,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.analyticsEvent.count({
                where: whereClause
            })
        ])

        // Also compile some basic stats
        const dateWhereClause = whereClause.createdAt ? { createdAt: whereClause.createdAt } : {}

        const groupByType = await prisma.analyticsEvent.groupBy({
            by: ['eventType'],
            where: dateWhereClause,
            _count: {
                id: true
            }
        })

        const topPages = await prisma.analyticsEvent.groupBy({
            by: ['path'],
            where: { ...dateWhereClause, eventType: 'pageview' },
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
            take: 5
        })

        const topClicks = await prisma.analyticsEvent.groupBy({
            by: ['targetText', 'path'],
            where: { ...dateWhereClause, eventType: 'click', targetText: { not: null } },
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
            take: 5
        })

        return NextResponse.json({
            events,
            totalEvents,
            totalPages: Math.ceil(totalEvents / limit),
            currentPage: page,
            stats: { groupByType, topPages, topClicks }
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
