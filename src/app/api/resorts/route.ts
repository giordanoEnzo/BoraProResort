
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const resorts = await prisma.resort.findMany({
            include: { images: true },
            orderBy: { name: 'asc' }
        })
        return NextResponse.json(resorts)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch resorts' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, slug, city, description, imageUrl, images } = body

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
                images: {
                    create: (images || []).map((url: string) => ({ url }))
                }
            },
            include: { images: true }
        })

        return NextResponse.json(resort)
    } catch (error) {
        console.error('Error creating resort:', error)
        return NextResponse.json({ error: 'Failed to create resort' }, { status: 500 })
    }
}
