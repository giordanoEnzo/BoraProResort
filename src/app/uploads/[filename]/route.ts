
import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { existsSync } from 'fs'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ filename: string }> }
) {
    const { filename } = await params

    // Prevent directory traversal
    if (filename.includes('..') || filename.includes('/')) {
        return new NextResponse('Invalid filename', { status: 400 })
    }

    const filePath = path.join(process.cwd(), 'public/uploads', filename)

    if (!existsSync(filePath)) {
        return new NextResponse('File not found', { status: 404 })
    }

    try {
        const fileBuffer = await fs.readFile(filePath)
        const ext = path.extname(filename).toLowerCase()

        let contentType = 'application/octet-stream'
        if (ext === '.png') contentType = 'image/png'
        else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg'
        else if (ext === '.gif') contentType = 'image/gif'
        else if (ext === '.svg') contentType = 'image/svg+xml'
        else if (ext === '.webp') contentType = 'image/webp'

        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        })
    } catch (error) {
        console.error('Error serving file:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
