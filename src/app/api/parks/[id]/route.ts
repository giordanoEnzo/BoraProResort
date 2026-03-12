import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

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
            return NextResponse.json({ error: 'Park not found' }, { status: 404 })
        }

        return NextResponse.json(park)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch park' }, { status: 500 })
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()
        const { name, slug, city, description, attractionsDetails, imageUrl, images } = body

        // First, recreate images
        await prisma.parkImage.deleteMany({
            where: { parkId: id }
        })

        const park = await prisma.park.update({
            where: { id },
            data: {
                name,
                slug,
                city,
                description,
                attractionsDetails,
                imageUrl,
                images: {
                    create: (images || []).map((url: string) => ({ url }))
                }
            },
            include: { images: true }
        })

        return NextResponse.json(park)
    } catch (error) {
        console.error('Error updating park:', error)
        return NextResponse.json({ error: 'Failed to update park' }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        await prisma.park.delete({
            where: { id }
        })
        revalidatePath('/')
        revalidatePath('/parks')

        return new NextResponse(null, { status: 204 })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete park' }, { status: 500 })
    }
}
