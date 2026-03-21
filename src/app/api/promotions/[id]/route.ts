
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'

type Props = {
    params: Promise<{ id: string }>
}

export async function GET(request: Request, props: Props) {
    const params = await props.params;
    try {
        const promotion = await prisma.promotion.findUnique({
            where: { id: params.id }
        })
        if (!promotion) return NextResponse.json({ error: 'Promoção não encontrada' }, { status: 404 })
        return NextResponse.json(promotion)
    } catch {
        return NextResponse.json({ error: 'Erro ao buscar promoção' }, { status: 500 })
    }
}

export async function PUT(request: Request, props: Props) {
    const params = await props.params;
    try {
        const user = await getSessionUser()
        if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

        const promotion = await prisma.promotion.findUnique({
            where: { id: params.id }
        })

        if (!promotion) return NextResponse.json({ error: 'Promoção não encontrada' }, { status: 404 })

        const currentUser = await prisma.user.findUnique({ where: { id: user.id } })
        if (promotion.userId !== user.id && currentUser?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Sem permissão para editar esta promoção' }, { status: 403 })
        }

        const body = await request.json()
        const { title, city, price, duration, hotel, peopleCount, flightInfo, serviceInfo, description, imageUrl, breakfast, lunch, dinner } = body

        const updated = await prisma.promotion.update({
            where: { id: params.id },
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
            }
        })

        revalidatePath('/')

        return NextResponse.json(updated)
    } catch (error) {
        console.error('Error updating promotion:', error)
        return NextResponse.json({ error: 'Erro ao atualizar promoção' }, { status: 500 })
    }
}

export async function DELETE(request: Request, props: Props) {
    const params = await props.params;
    try {
        const user = await getSessionUser()
        if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

        const promotion = await prisma.promotion.findUnique({
            where: { id: params.id }
        })

        if (!promotion) return NextResponse.json({ error: 'Promoção não encontrada' }, { status: 404 })

        const currentUser = await prisma.user.findUnique({ where: { id: user.id } })
        if (promotion.userId !== user.id && currentUser?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Sem permissão para excluir esta promoção' }, { status: 403 })
        }

        await prisma.promotion.delete({
            where: { id: params.id }
        })
        revalidatePath('/')

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting promotion:', error)
        return NextResponse.json({ error: 'Erro ao excluir promoção' }, { status: 500 })
    }
}
