
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ResortCarousel from '@/components/ResortCarousel'

type ParkParams = Promise<{ slug: string }>

export default async function ParkPage({ params }: { params: ParkParams }) {
    const { slug } = await params
    const decodedSlug = decodeURIComponent(slug)

    const parkData = await prisma.park.findUnique({
        where: { slug: decodedSlug },
        include: {
            images: true
        },
    })

    if (!parkData) {
        notFound()
    }

    // Prepare images for carousel
    const carouselImages = parkData.images.map(img => img.url)
    if (carouselImages.length === 0 && parkData.imageUrl) {
        carouselImages.push(parkData.imageUrl)
    }

    const whatsappNumber = "5517997311102"
    const whatsappMessage = encodeURIComponent(`Olá! Gostaria de mais informações sobre o parque ${parkData.name}.`)
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

    return (
        <div className="resort-page">
            <ResortCarousel
                images={carouselImages}
                title={parkData.name}
                subtitle={parkData.city}
            />

            <div className="container" style={{ marginTop: '4rem', marginBottom: '4rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <Link href="/parks" style={{ color: 'var(--color-primary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        ← Voltar para Parques
                    </Link>
                </div>

                <div className="grid grid-cols-2">
                    <div>
                        <h2>Sobre o Parque</h2>
                        <p style={{ lineHeight: '1.6', whiteSpace: 'pre-wrap', marginBottom: '2rem' }}>{parkData.description}</p>
                        
                        {parkData.attractionsDetails && (
                            <>
                                <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Atrações e Detalhes</h3>
                                <p style={{ lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{parkData.attractionsDetails}</p>
                            </>
                        )}
                    </div>

                    <div>
                        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                            <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Garanta seu Ingresso</h2>
                            <p style={{ marginBottom: '2rem' }}>Escolha a melhor forma de garantir sua diversão no <strong>{parkData.name}</strong>:</p>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {parkData.ticketLink && (
                                    <a 
                                        href={parkData.ticketLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-primary"
                                        style={{ width: '100%', display: 'block', padding: '1rem', background: '#2e7d32', borderColor: '#2e7d32' }}
                                    >
                                        Comprar Ingresso Online
                                    </a>
                                )}
                                
                                <a 
                                    href={whatsappLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary"
                                    style={{ width: '100%', display: 'block', padding: '1rem' }}
                                >
                                    Falar no WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
