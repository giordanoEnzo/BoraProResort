
import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(request: Request) {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = Date.now() + '_' + file.name.replace(/\s+/g, '_')
    const uploadDir = path.join(process.cwd(), 'public/uploads')

    try {
        await writeFile(path.join(uploadDir, filename), buffer)
        return NextResponse.json({ url: `/uploads/${filename}` })
    } catch (error) {
        console.error('Error saving file:', error)
        return NextResponse.json({ error: 'Error saving file' }, { status: 500 })
    }
}
