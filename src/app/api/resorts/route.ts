
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const resorts = await prisma.resort.findMany({
            include: { images: true },
            orderBy: { name: 'asc' }
        })
        return NextResponse.json(resorts)
    } catch {
        return NextResponse.json({ error: 'Failed to fetch resorts' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, slug, city, description, imageUrl, isPinned, images } = body

        // Validate unique slug
        const existing = await prisma.resort.findUnique({ where: { slug } })
        if (existing) {
            return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
        }

        const resort = await prisma.resort.create({
            data: {
                name,
                slug,
                city,
                description,
                imageUrl, // Main image
                isPinned,
                images: {
                    create: (images || []).map((url: string) => ({ url }))
                }
            },
            include: { images: true }
        })

        revalidatePath('/')

        return NextResponse.json(resort)
    } catch (error) {
        console.error('Error creating resort:', error)
        return NextResponse.json({ error: 'Failed to create resort' }, { status: 500 })
    }
}
