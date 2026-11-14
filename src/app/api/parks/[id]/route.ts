import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const park = await prisma.park.findUnique({
            where: { id: params.id },
            include: { images: true }
        })
        if (!park) return NextResponse.json({ error: 'Park not found' }, { status: 404 })
        return NextResponse.json(park)
    } catch {
        return NextResponse.json({ error: 'Failed to fetch park' }, { status: 500 })
    }
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const body = await request.json()
        const { name, slug, city, description, attractionsDetails, imageUrl, isPinned, ticketLink, images } = body

        if (slug) {
            const existing = await prisma.park.findUnique({ where: { slug } })
            if (existing && existing.id !== params.id) {
                return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
            }
        }

        const updateData: any = {
            name,
            slug,
            city,
            description,
            attractionsDetails,
            imageUrl,
            isPinned,
            ticketLink
        }

        if (images) {
            await prisma.parkImage.deleteMany({ where: { parkId: params.id } })
            updateData.images = {
                create: images.map((url: string) => ({ url }))
            }
        }

        const updatedPark = await prisma.park.update({
            where: { id: params.id },
            data: updateData,
            include: { images: true }
        })

        revalidatePath('/')
        revalidatePath(`/parks/${updatedPark.slug}`)

        return NextResponse.json(updatedPark)
    } catch (error) {
        console.error('Error updating park:', error)
        return NextResponse.json({ error: 'Failed to update park' }, { status: 500 })
    }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        // Find the park first to get the slug for revalidation if needed
        const park = await prisma.park.findUnique({ where: { id: params.id } })
        if (!park) return NextResponse.json({ error: 'Park not found' }, { status: 404 })

        await prisma.park.delete({
            where: { id: params.id }
        })

        revalidatePath('/')
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting park:', error)
        return NextResponse.json({ error: 'Failed to delete park' }, { status: 500 })
    }
}
