import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()
        const { status } = body

        if (!['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
            return NextResponse.json({ error: 'Status inválido' }, { status: 400 })
        }

        const testimonial = await prisma.testimonial.update({
            where: { id },
            data: { status }
        })

        return NextResponse.json(testimonial)
    } catch (error) {
        console.error('Error updating testimonial status:', error)
        return NextResponse.json({ error: 'Erro ao atualizar depoimento' }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        await prisma.testimonial.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting testimonial:', error)
        return NextResponse.json({ error: 'Erro ao apagar depoimento' }, { status: 500 })
    }
}
