import { cookies } from 'next/headers'

export async function getSessionUser() {
    const cookieStore = await cookies()
    const userId = cookieStore.get('user_id')?.value
    return userId ? { id: userId } : null
}
