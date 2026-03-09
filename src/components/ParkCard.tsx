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
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    const allImages = [park.imageUrl, ...(park.images?.map(i => i.url) || [])]

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
    }

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
    }

    return (
        <div className="card" style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
            {/* Capa Principal - Carrossel Embutido */}
            <div style={{ position: 'relative', width: '100%', height: '350px', backgroundColor: '#000', overflow: 'hidden' }}>
                <div style={{
                    display: 'flex',
                    transition: 'transform 0.4s ease-in-out',
                    transform: `translateX(-${currentImageIndex * 100}%)`,
                    height: '100%',
                    width: '100%'
                }}>
                    {allImages.map((src, idx) => (
                        <div key={idx} style={{ flexShrink: 0, width: '100%', height: '100%', position: 'relative' }}>
                            <Image
                                src={src}
                                alt={`${park.name} foto ${idx + 1}`}
                                fill
                                style={{ objectFit: 'cover' }}
                                sizes="(max-width: 768px) 100vw, 1000px"
                            />
                        </div>
                    ))}
                </div>

                {/* Controles do Carrossel */}
                {allImages.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            style={{
                                position: 'absolute', top: '50%', left: '15px', transform: 'translateY(-50%)',
                                background: 'rgba(255,255,255,0.8)', color: '#333', border: 'none',
                                width: '40px', height: '40px', borderRadius: '50%', fontSize: '1.5rem',
                                cursor: 'pointer', zIndex: 2, display: 'flex', alignItems: 'center',
                                justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                            }}
                        >
                            &lsaquo;
                        </button>
                        <button
                            onClick={nextImage}
                            style={{
                                position: 'absolute', top: '50%', right: '15px', transform: 'translateY(-50%)',
                                background: 'rgba(255,255,255,0.8)', color: '#333', border: 'none',
                                width: '40px', height: '40px', borderRadius: '50%', fontSize: '1.5rem',
                                cursor: 'pointer', zIndex: 2, display: 'flex', alignItems: 'center',
                                justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                            }}
                        >
                            &rsaquo;
                        </button>
                    </>
                )}
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

            {/* Galeria de Miniaturas */}
            {allImages.length > 1 && (
                <div style={{ background: '#f5f5f5', padding: '1.5rem 1rem' }}>
                    <h4 style={{ marginBottom: '1rem', paddingLeft: '0.5rem', fontSize: '1rem', color: '#555' }}>Mais Fotos</h4>
                    <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '10px' }}>
                        {allImages.map((img, i) => (
                            <div
                                key={i}
                                onClick={() => setCurrentImageIndex(i)}
                                style={{
                                    position: 'relative',
                                    minWidth: '100px',
                                    height: '75px',
                                    borderRadius: '6px',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    boxShadow: currentImageIndex === i ? '0 0 0 3px #e33537' : '0 1px 3px rgba(0,0,0,0.1)',
                                    opacity: currentImageIndex === i ? 1 : 0.6,
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <Image
                                    src={img}
                                    alt={`${park.name} miniatura ${i + 1}`}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
