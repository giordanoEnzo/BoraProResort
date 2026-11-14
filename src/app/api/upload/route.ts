
import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: Request) {
    const formData = await request.formData()
    const files = formData.getAll('file') as File[]

    if (!files || files.length === 0) {
        return NextResponse.json({ error: 'No files uploaded' }, { status: 400 })
    }

    const uploadDir = path.join(process.cwd(), 'public/uploads')
    const urls: string[] = []

    try {
        // Ensure directory exists
        await mkdir(uploadDir, { recursive: true })

        for (const file of files) {
            const buffer = Buffer.from(await file.arrayBuffer())
            const filename = Date.now() + '_' + Math.random().toString(36).substring(7) + '_' + file.name.replace(/\s+/g, '_')
            await writeFile(path.join(uploadDir, filename), buffer)
            urls.push(`/uploads/${filename}`)
        }

        return NextResponse.json({ 
            url: urls[0], 
            urls: urls 
        })
    } catch (error) {
        console.error('Error saving files:', error)
        return NextResponse.json({ error: 'Error saving files' }, { status: 500 })
    }
}
