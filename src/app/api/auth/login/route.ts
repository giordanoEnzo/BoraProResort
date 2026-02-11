
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
    const { password } = await request.json()

    if (password === 'boraproresort@2026@Admin') {
        const response = NextResponse.json({ success: true })
        const cookieStore = await cookies()
        cookieStore.set('admin_session', 'authenticated', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 // 1 day
        })
        return response
    }

    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
}
