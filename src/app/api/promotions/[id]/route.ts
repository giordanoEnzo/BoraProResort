
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Props = {
    params: Promise<{ id: string }>
}

export async function GET(request: Request, props: Props) {
    const params = await props.params;
    try {
        const promotion = await prisma.promotion.findUnique({
            where: { id: params.id }
        })
        if (!promotion) return NextResponse.json({ error: 'Promotion not found' }, { status: 404 })
        return NextResponse.json(promotion)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch promotion' }, { status: 500 })
    }
}

export async function PUT(request: Request, props: Props) {
    const params = await props.params;
    try {
        const body = await request.json()
        const { title, price, duration, hotel, peopleCount, flightInfo, serviceInfo, description, imageUrl, breakfast, lunch, dinner } = body

        const updated = await prisma.promotion.update({
            where: { id: params.id },
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

        return NextResponse.json(updated)
    } catch (error) {
        console.error('Error updating promotion:', error)
        return NextResponse.json({ error: 'Failed to update promotion' }, { status: 500 })
    }
}

export async function DELETE(request: Request, props: Props) {
    const params = await props.params;
    try {
        await prisma.promotion.delete({
            where: { id: params.id }
        })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting promotion:', error)
        return NextResponse.json({ error: 'Failed to delete promotion' }, { status: 500 })
    }
}
