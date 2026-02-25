
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { resortId, startDate, endDate, name, email, phone, guests, adults, children, babies, boardType, parkTickets, parkName, parkAdults, parkChildren, parkBabies, notes } = body

        // Validation
        // Overlap check removed as per requirement: multiple reservations can exist on same dates.

        const reservation = await prisma.reservation.create({
            data: {
                resortId,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                name,
                email,
                phone,
                guests: Number(guests),
                adults: Number(adults) || 1,
                children: Number(children) || 0,
                babies: Number(babies) || 0,
                boardType: boardType || null,
                parkTickets: Boolean(parkTickets),
                parkName: parkName || null,
                parkAdults: Number(parkAdults) || 0,
                parkChildren: Number(parkChildren) || 0,
                parkBabies: Number(parkBabies) || 0,
                notes,
                status: 'PENDING'
            }
        })

        return NextResponse.json(reservation)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function GET(request: Request) {
    // Admin fetch
    const { searchParams } = new URL(request.url)
    const resortId = searchParams.get('resortId')
    const status = searchParams.get('status')

    const where: any = {}
    if (resortId) where.resortId = resortId
    if (status) where.status = status

    const reservations = await prisma.reservation.findMany({
        where,
        include: { resort: true },
        orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(reservations)
}
