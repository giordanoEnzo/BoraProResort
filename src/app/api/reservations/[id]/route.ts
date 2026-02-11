
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { status } = await request.json()
        const { id } = await params

        if (!['CONFIRMED', 'PENDING', 'CANCELLED'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
        }

        const reservation = await prisma.reservation.findUnique({ where: { id } })
        if (!reservation) {
            return NextResponse.json({ error: 'Reservation not found' }, { status: 404 })
        }

        if (status === 'CONFIRMED') {
            // Check for overlap with other CONFIRMED reservations
            const overlap = await prisma.reservation.findFirst({
                where: {
                    resortId: reservation.resortId,
                    status: 'CONFIRMED',
                    id: { not: id },
                    startDate: { lte: reservation.endDate },
                    endDate: { gte: reservation.startDate }
                }
            })

            if (overlap) {
                return NextResponse.json({ error: 'Cannot confirm: Dates are occupied by another confirmed reservation' }, { status: 409 })
            }
        }

        const updated = await prisma.reservation.update({
            where: { id },
            data: { status }
        })

        return NextResponse.json(updated)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
