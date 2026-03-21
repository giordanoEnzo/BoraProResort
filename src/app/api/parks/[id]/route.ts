import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const park = await prisma.park.findUnique({
            where: { id },
            include: { images: true }
        })

        if (!park) {
            return NextResponse.json({ error: 'Parque não encontrado' }, { status: 404 })
        }

        return NextResponse.json(park)
    } catch {
        return NextResponse.json({ error: 'Erro ao buscar parque' }, { status: 500 })
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getSessionUser()
        if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

        const { id } = await params
        const park = await prisma.park.findUnique({ where: { id } })

        if (!park) return NextResponse.json({ error: 'Parque não encontrado' }, { status: 404 })

        const currentUser = await prisma.user.findUnique({ where: { id: user.id } })
        if (park.userId !== user.id && currentUser?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Sem permissão para editar este parque' }, { status: 403 })
        }

        const body = await request.json()
        const { name, slug, city, description, attractionsDetails, imageUrl, isPinned, ticketLink, images } = body

        // First, recreate images
        await prisma.parkImage.deleteMany({
            where: { parkId: id }
        })

        const updatedPark = await prisma.park.update({
            where: { id },
            data: {
                name,
                slug,
                city,
                description,
                attractionsDetails,
                imageUrl,
                isPinned,
                ticketLink,
                images: {
                    create: (images || []).map((url: string) => ({ url }))
                }
            },
            include: { images: true }
        })

        revalidatePath('/')
        revalidatePath('/parks')

        return NextResponse.json(updatedPark)
    } catch (error) {
        console.error('Error updating park:', error)
        return NextResponse.json({ error: 'Erro ao atualizar parque' }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getSessionUser()
        if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

        const { id } = await params
        const park = await prisma.park.findUnique({ where: { id } })

        if (!park) return NextResponse.json({ error: 'Parque não encontrado' }, { status: 404 })

        const currentUser = await prisma.user.findUnique({ where: { id: user.id } })
        if (park.userId !== user.id && currentUser?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Sem permissão para excluir este parque' }, { status: 403 })
        }

        await prisma.park.delete({
            where: { id }
        })
        revalidatePath('/')
        revalidatePath('/parks')

        return new NextResponse(null, { status: 204 })
    } catch {
        return NextResponse.json({ error: 'Erro ao excluir parque' }, { status: 500 })
    }
}
