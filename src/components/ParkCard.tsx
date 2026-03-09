'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ParkCardProps {
    park: {
        id: string
        name: string
        city: string
        slug: string
        description: string
        attractionsDetails: string
        imageUrl: string
        images: { url: string }[]
    }
}

export default function ParkCard({ park }: ParkCardProps) {
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    const allImages = [park.imageUrl, ...(park.images?.map(i => i.url) || [])]

    const openLightbox = (index: number) => {
        setCurrentImageIndex(index)
        setLightboxOpen(true)
    }

    const closeLightbox = () => {
        setLightboxOpen(false)
    }

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
    }

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
    }

    return (
        <div className="card" style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
            {/* Capa Principal */}
            <div
                style={{ position: 'relative', width: '100%', height: '300px', cursor: 'pointer' }}
                onClick={() => openLightbox(0)}
            >
                <Image
                    src={park.imageUrl}
                    alt={park.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 1000px"
                />
                <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    background: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                }}>
                    <span>🔍</span> Ampliar Foto
                </div>
            </div>

            <div style={{ padding: '1.5rem' }}>
                <h2 style={{ fontSize: '1.8rem', color: '#e33537', marginBottom: '0.2rem' }}>{park.name}</h2>
                <h4 style={{ color: '#666', marginBottom: '1rem', fontWeight: 'normal' }}>{park.city}</h4>
                <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{park.description}</p>
                </div>

                {park.attractionsDetails && (
                    <div style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #81c784', marginBottom: '1.5rem' }}>
                        <h4 style={{ marginBottom: '0.5rem', color: '#2e7d32' }}>Detalhes de Atrações</h4>
                        <p style={{ whiteSpace: 'pre-wrap', fontSize: '0.95rem', lineHeight: '1.5' }}>{park.attractionsDetails}</p>
                    </div>
                )}
            </div>

            {/* Galeria */}
            <div style={{ background: '#f5f5f5', padding: '1rem' }}>
                <h4 style={{ marginBottom: '1rem', paddingLeft: '0.5rem' }}>Galeria de Fotos</h4>
                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
                    {allImages.map((img, i) => (
                        <div
                            key={i}
                            onClick={() => openLightbox(i)}
                            className="park-gallery-img"
                            style={{
                                position: 'relative',
                                minWidth: '150px',
                                height: '100px',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                            }}
                        >
                            <Image
                                src={img}
                                alt={`${park.name} foto ${i + 1}`}
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'rgba(0,0,0,0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: 0,
                                transition: 'opacity 0.2s',
                            }}
                                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                            >
                                <span style={{ color: 'white', fontSize: '1.5rem' }}>🔍</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Lightbox */}
            {lightboxOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, width: '100vw', height: '100vh',
                    background: 'rgba(0,0,0,0.9)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <button
                        onClick={closeLightbox}
                        style={{ position: 'absolute', top: '20px', right: '30px', background: 'none', border: 'none', color: 'white', fontSize: '3rem', cursor: 'pointer' }}
                    >
                        &times;
                    </button>

                    <button
                        onClick={prevImage}
                        style={{ position: 'absolute', left: '20px', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', fontSize: '2rem', padding: '1rem', borderRadius: '50%', cursor: 'pointer' }}
                    >
                        &lsaquo;
                    </button>

                    <div style={{ position: 'relative', width: '80vw', height: '80vh' }}>
                        <Image
                            src={allImages[currentImageIndex]}
                            alt={`${park.name} zoom foto`}
                            fill
                            style={{ objectFit: 'contain' }}
                        />
                    </div>

                    <button
                        onClick={nextImage}
                        style={{ position: 'absolute', right: '20px', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', fontSize: '2rem', padding: '1rem', borderRadius: '50%', cursor: 'pointer' }}
                    >
                        &rsaquo;
                    </button>
                </div>
            )}
        </div>
    )
}
