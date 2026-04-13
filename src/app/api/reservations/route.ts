
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        console.log('RESERVATION BODY:', body)
        const { resortId, startDate, endDate, name, email, phone, guests, adults, children, babies, guestBirthDates, boardType, parkTickets, parkName, parkAdults, parkChildren, parkBabies, parkGuestBirthDates, notes } = body

        if (!resortId || !startDate || !endDate || !name || !email || !phone) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const reservation = await prisma.reservation.create({
            data: {
                resortId,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                name,
                email,
                phone,
                guests: Math.max(1, Number(guests) || 1),
                adults: Math.max(1, Number(adults) || 1),
                children: Math.max(0, Number(children) || 0),
                babies: Math.max(0, Number(babies) || 0),
                guestBirthDates: guestBirthDates || null,
                boardType: boardType || null,
                parkTickets: Boolean(parkTickets),
                parkName: parkName || null,
                parkAdults: Math.max(0, Number(parkAdults) || 0),
                parkChildren: Math.max(0, Number(parkChildren) || 0),
                parkBabies: Math.max(0, Number(parkBabies) || 0),
                parkGuestBirthDates: parkGuestBirthDates || null,
                notes,
                status: 'PENDING'
            }
        })

        return NextResponse.json(reservation)
    } catch (error: any) {
        console.error('RESERVATION ERROR DETAILS:', error)
        return NextResponse.json({ 
            error: 'Internal Server Error', 
            details: error instanceof Error ? error.message : String(error) 
        }, { status: 500 })
    }
}

export async function GET(request: Request) {
    // Admin fetch
    const { searchParams } = new URL(request.url)
    const resortId = searchParams.get('resortId')
    const status = searchParams.get('status')
    const createdAtStart = searchParams.get('createdAtStart')
    const createdAtEnd = searchParams.get('createdAtEnd')

    const where: {
        resortId?: string;
        status?: string;
        createdAt?: {
            gte?: Date;
            lte?: Date;
        };
    } = {}
    if (resortId) where.resortId = resortId
    if (status) where.status = status

    if (createdAtStart || createdAtEnd) {
        where.createdAt = {}
        if (createdAtStart) {
            const start = new Date(createdAtStart)
            if (!isNaN(start.getTime())) {
                where.createdAt.gte = start
            }
        }
        if (createdAtEnd) {
            const end = new Date(createdAtEnd)
            if (!isNaN(end.getTime())) {
                end.setHours(23, 59, 59, 999)
                where.createdAt.lte = end
            }
        }
    }

    const reservations = await prisma.reservation.findMany({
        where,
        include: { resort: true },
        orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(reservations)
}
