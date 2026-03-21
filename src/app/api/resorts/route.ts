
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    try {
        if (slug) {
            const resort = await prisma.resort.findUnique({
                where: { slug },
                include: { images: true }
            })
            return NextResponse.json(resort)
        }

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

        if (!name || !slug) {
            return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 })
        }

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
                imageUrl,
                isPinned,
                images: {
                    create: images ? images.map((url: string) => ({ url })) : []
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
