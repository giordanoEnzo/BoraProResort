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

        const whereClause = type ? { eventType: type } : {}

        const events = await prisma.analyticsEvent.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            take: 200 // Limit for dashboard view
        })

        // Also compile some basic stats
        const groupByType = await prisma.analyticsEvent.groupBy({
            by: ['eventType'],
            _count: {
                id: true
            }
        })

        const topPages = await prisma.analyticsEvent.groupBy({
            by: ['path'],
            where: { eventType: 'pageview' },
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
            take: 5
        })

        const topClicks = await prisma.analyticsEvent.groupBy({
            by: ['targetText', 'path'],
            where: { eventType: 'click', targetText: { not: null } },
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
            take: 5
        })

        return NextResponse.json({ events, stats: { groupByType, topPages, topClicks } })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
