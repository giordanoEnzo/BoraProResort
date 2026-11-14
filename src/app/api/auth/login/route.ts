import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
    try {
        const { password } = await request.json()

        if (password === 'boraproresort@2026@Admin') {
            const response = NextResponse.json({ success: true })
            
            // Re-set session status cookie
            response.cookies.set('admin_session', 'authenticated', {
                httpOnly: true,
                path: '/',
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 // 1 day
            })

            return response
        }

        return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json({ error: 'Erro no servidor' }, { status: 500 })
    }
}
