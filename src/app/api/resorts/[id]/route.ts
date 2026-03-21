
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const resort = await prisma.resort.findUnique({
            where: { id: params.id },
            include: { images: true }
        })
        if (!resort) return NextResponse.json({ error: 'Resort não encontrado' }, { status: 404 })
        return NextResponse.json(resort)
    } catch {
        return NextResponse.json({ error: 'Erro ao buscar resort' }, { status: 500 })
    }
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const user = await getSessionUser()
        if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

        const resort = await prisma.resort.findUnique({
            where: { id: params.id },
            include: { user: true }
        })

        if (!resort) return NextResponse.json({ error: 'Resort não encontrado' }, { status: 404 })
        
        // Authorization check: User must be owner or ADMIN
        const currentUser = await prisma.user.findUnique({ where: { id: user.id } })
        if (resort.userId !== user.id && currentUser?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Sem permissão para editar este resort' }, { status: 403 })
        }

        const body = await request.json()
        const { name, slug, city, description, imageUrl, isPinned, images } = body

        // If updating slug, check unique
        if (slug) {
            const existing = await prisma.resort.findUnique({ where: { slug } })
            if (existing && existing.id !== params.id) {
                return NextResponse.json({ error: 'Slug já existe' }, { status: 400 })
            }
        }

        const updateData: any = {
            name,
            slug,
            city,
            description,
            imageUrl,
            isPinned
        }

        if (images) {
            // Delete old images
            await prisma.resortImage.deleteMany({ where: { resortId: params.id } })
            // Create new ones
            updateData.images = {
                create: images.map((url: string) => ({ url }))
            }
        }

        const updatedResort = await prisma.resort.update({
            where: { id: params.id },
            data: updateData,
            include: { images: true }
        })

        revalidatePath('/')
        revalidatePath(`/resorts/${updatedResort.slug}`)

        return NextResponse.json(updatedResort)
    } catch (error) {
        console.error('Error updating resort:', error)
        return NextResponse.json({ error: 'Erro ao atualizar resort' }, { status: 500 })
    }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const user = await getSessionUser()
        if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

        const resort = await prisma.resort.findUnique({
            where: { id: params.id }
        })

        if (!resort) return NextResponse.json({ error: 'Resort não encontrado' }, { status: 404 })

        // Authorization check
        const currentUser = await prisma.user.findUnique({ where: { id: user.id } })
        if (resort.userId !== user.id && currentUser?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Sem permissão para excluir este resort' }, { status: 403 })
        }

        // Manually delete related reservations first as schema does not cascade
        await prisma.reservation.deleteMany({
            where: { resortId: params.id }
        })

        await prisma.resort.delete({
            where: { id: params.id }
        })
        revalidatePath('/')

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting resort:', error)
        return NextResponse.json({ error: 'Erro ao excluir resort' }, { status: 500 })
    }
}
