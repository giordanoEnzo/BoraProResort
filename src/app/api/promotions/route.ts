
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'

export async function GET() {
    try {
        const promotions = await prisma.promotion.findMany({
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json(promotions)
    } catch {
        return NextResponse.json({ error: 'Erro ao buscar promoções' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const user = await getSessionUser()
        if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

        const body = await request.json()
        const { title, city, price, duration, hotel, peopleCount, flightInfo, serviceInfo, description, imageUrl, breakfast, lunch, dinner } = body

        const promotion = await prisma.promotion.create({
            data: {
                title,
                city,
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
                userId: user.id
            }
        })

        revalidatePath('/')

        return NextResponse.json(promotion)
    } catch (error) {
        console.error('Error creating promotion:', error)
        return NextResponse.json({ error: 'Erro ao criar promoção' }, { status: 500 })
    }
}
