
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json()

        // For this simple implementation, we'll check if a default admin exists
        // and create it if not. In a production app, this would be done via migrations/seeds.
        let user = await prisma.user.findUnique({
            where: { email: email || 'admin@boraproresort.com.br' }
        })

        if (!user && (email === 'admin@boraproresort.com.br' || !email) && password === 'boraproresort@2026@Admin') {
            user = await prisma.user.create({
                data: {
                    email: 'admin@boraproresort.com.br',
                    password: 'boraproresort@2026@Admin', // Should be hashed in production
                    name: 'Administrador',
                    role: 'ADMIN'
                }
            })
        }

        if (user && user.password === password) {
            const response = NextResponse.json({ 
                success: true, 
                user: { id: user.id, email: user.email, role: user.role } 
            })
            const cookieStore = await cookies()
            
            // Set session status
            cookieStore.set('admin_session', 'authenticated', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 // 1 day
            })

            // Set user ID for authorization checks
            cookieStore.set('user_id', user.id, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24
            })

            return response
        }

        return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json({ error: 'Erro no servidor' }, { status: 500 })
    }
}
