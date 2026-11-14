import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const testimonials = await prisma.testimonial.findMany({
            where: {
                status: 'APPROVED'
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        return NextResponse.json(testimonials)
    } catch (error) {
        console.error('Error fetching testimonials:', error)
        return NextResponse.json({ error: 'Erro ao buscar depoimentos' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { author, text, rating, cpf } = body

        if (!author || !text || !rating || !cpf) {
            return NextResponse.json({ error: 'Todos os campos são obrigatórios' }, { status: 400 })
        }

        // Basic CPF validation (only digits and length)
        const cleanCpf = cpf.replace(/\D/g, '')
        if (cleanCpf.length !== 11) {
            return NextResponse.json({ error: 'CPF inválido' }, { status: 400 })
        }

        // Check if CPF already has a testimonial
        const existing = await prisma.testimonial.findUnique({
            where: { cpf: cleanCpf }
        })

        if (existing) {
            return NextResponse.json({ error: 'Já existe um depoimento cadastrado para este CPF' }, { status: 400 })
        }

        const testimonial = await prisma.testimonial.create({
            data: {
                author,
                text,
                rating: Number(rating),
                cpf: cleanCpf,
                status: 'PENDING'
            }
        })

        return NextResponse.json(testimonial, { status: 201 })
    } catch (error) {
        console.error('Error creating testimonial:', error)
        return NextResponse.json({ error: 'Erro ao cadastrar depoimento' }, { status: 500 })
    }
}
