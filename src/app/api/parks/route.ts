import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const parks = await prisma.park.findMany({
            include: { images: true },
            orderBy: { name: 'asc' }
        })
        return NextResponse.json(parks)
    } catch {
        return NextResponse.json({ error: 'Failed to fetch parks' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, slug, city, description, attractionsDetails, imageUrl, isPinned, ticketLink, images } = body

        const existing = await prisma.park.findUnique({ where: { slug } })
        if (existing) {
            return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
        }

        const park = await prisma.park.create({
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

        return NextResponse.json(park)
    } catch (error) {
        console.error('Error creating park:', error)
        return NextResponse.json({ error: 'Failed to create park' }, { status: 500 })
    }
}
