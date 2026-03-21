import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'

export async function GET() {
    try {
        const parks = await prisma.park.findMany({
            include: { images: true },
            orderBy: { name: 'asc' }
        })
        return NextResponse.json(parks)
    } catch {
        return NextResponse.json({ error: 'Erro ao buscar parques' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const user = await getSessionUser()
        if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

        const body = await request.json()
        const { name, slug, city, description, attractionsDetails, imageUrl, isPinned, ticketLink, images } = body

        const existing = await prisma.park.findUnique({ where: { slug } })
        if (existing) {
            return NextResponse.json({ error: 'Slug já existe' }, { status: 400 })
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
                userId: user.id,
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
        return NextResponse.json({ error: 'Erro ao criar parque' }, { status: 500 })
    }
}
