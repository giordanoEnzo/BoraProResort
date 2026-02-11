
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import ResortCarousel from '@/components/ResortCarousel'
import CalendarSystem from '@/components/CalendarSystem'

// Type definition for Page Params in Next.js 15+
type ResortParams = Promise<{ slug: string }>

export default async function ResortPage({ params }: { params: ResortParams }) {
    const { slug } = await params

    const resortData = await prisma.resort.findUnique({
        where: { slug },
        include: {
            images: true,
            reservations: {
                select: {
                    startDate: true,
                    endDate: true,
                    status: true,
                },
            },
        },
    })

    if (!resortData) {
        notFound()
    }

    // Prepare images for carousel
    const carouselImages = resortData.images.map(img => img.url)
    if (carouselImages.length === 0 && resortData.imageUrl) {
        carouselImages.push(resortData.imageUrl)
    }

    // Serialize dates for Client Component
    const reservations = resortData.reservations.map(r => ({
        startDate: r.startDate.toISOString(),
        endDate: r.endDate.toISOString(),
        status: r.status as 'CONFIRMED' | 'PENDING' | 'CANCELLED'
    }))

    return (
        <div className="resort-page">
            <ResortCarousel
                images={carouselImages}
                title={resortData.name}
                subtitle={resortData.city}
            />

            <div className="container" style={{ marginTop: '4rem', marginBottom: '4rem' }}>
                <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                    <div>
                        <h2 style={{ fontSize: '2rem' }}>Sobre o Resort</h2>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>{resortData.description}</p>
                        <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#fff3cd', borderRadius: '8px' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Informações Importantes</h3>
                            <ul style={{ paddingLeft: '20px' }}>
                                <li>Check-in: 14:00</li>
                                <li>Check-out: 11:00</li>
                                <li>Pets: Sob consulta</li>
                            </ul>
                        </div>
                    </div>

                    <div>
                        <div className="card" style={{ padding: '2rem' }}>
                            <h2 style={{ fontSize: '1.8rem', textAlign: 'center', marginBottom: '2rem' }}>Solicitar Orçamento</h2>
                            <CalendarSystem resortId={resortData.id} reservations={reservations} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
