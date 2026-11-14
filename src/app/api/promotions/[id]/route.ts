import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const promotion = await prisma.promotion.findUnique({
            where: { id: params.id }
        })
        if (!promotion) return NextResponse.json({ error: 'Promotion not found' }, { status: 404 })
        return NextResponse.json(promotion)
    } catch {
        return NextResponse.json({ error: 'Failed to fetch promotion' }, { status: 500 })
    }
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const body = await request.json()
        const promotion = await prisma.promotion.update({
            where: { id: params.id },
            data: body
        })
        revalidatePath('/')
        return NextResponse.json(promotion)
    } catch {
        return NextResponse.json({ error: 'Failed to update promotion' }, { status: 500 })
    }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await prisma.promotion.delete({
            where: { id: params.id }
        })
        revalidatePath('/')
        return NextResponse.json({ success: true })
    } catch {
        return NextResponse.json({ error: 'Failed to delete promotion' }, { status: 500 })
    }
}
