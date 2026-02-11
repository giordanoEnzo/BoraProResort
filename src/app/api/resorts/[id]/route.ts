
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const resort = await prisma.resort.findUnique({
            where: { id: params.id },
            include: { images: true }
        })
        if (!resort) return NextResponse.json({ error: 'Resort not found' }, { status: 404 })
        return NextResponse.json(resort)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch resort' }, { status: 500 })
    }
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const body = await request.json()
        const { name, slug, city, description, imageUrl, images } = body

        // If updating slug, check unique
        if (slug) {
            const existing = await prisma.resort.findUnique({ where: { slug } })
            if (existing && existing.id !== params.id) {
                return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
            }
        }

        // To update images: delete existing and create new ones (simplest approach for full replace)
        // Or handle add/remove more granularly.
        // For simplicity: If 'images' array is provided, we replace the gallery.

        const updateData: any = {
            name,
            slug,
            city,
            description,
            imageUrl
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

        return NextResponse.json(updatedResort)
    } catch (error) {
        console.error('Error updating resort:', error)
        return NextResponse.json({ error: 'Failed to update resort' }, { status: 500 })
    }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        // Manually delete related reservations first as schema does not cascade
        await prisma.reservation.deleteMany({
            where: { resortId: params.id }
        })

        await prisma.resort.delete({
            where: { id: params.id }
        })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting resort:', error)
        return NextResponse.json({ error: 'Failed to delete resort' }, { status: 500 })
    }
}
