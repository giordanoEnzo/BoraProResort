
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const promotions = await prisma.promotion.findMany({
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json(promotions)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch promotions' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { title, price, duration, hotel, peopleCount, flightInfo, serviceInfo, description, imageUrl, breakfast, lunch, dinner } = body

        const promotion = await prisma.promotion.create({
            data: {
                title,
                price,
                duration,
                hotel,
                peopleCount,
                flightInfo,
                serviceInfo,
                description,
                imageUrl,
                breakfast: Boolean(breakfast),
                lunch: Boolean(lunch),
                dinner: Boolean(dinner),
            }
        })

        return NextResponse.json(promotion)
    } catch (error) {
        console.error('Error creating promotion:', error)
        return NextResponse.json({ error: 'Failed to create promotion' }, { status: 500 })
    }
}
