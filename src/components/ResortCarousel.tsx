
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface ResortCarouselProps {
    images: string[]
    title: string
    subtitle: string
}

export default function ResortCarousel({ images, title, subtitle }: ResortCarouselProps) {
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        if (images.length <= 1) return

        const timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % images.length)
        }, 5000)

        return () => clearInterval(timer)
    }, [images.length])

    const next = () => setCurrent((current + 1) % images.length)
    const prev = () => setCurrent((current - 1 + images.length) % images.length)

    if (images.length === 0) return null

    return (
        <div className="resort-hero" style={{ position: 'relative', height: '60vh', overflow: 'hidden' }}>
            {images.map((img, index) => (
                <div
                    key={index}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: index === current ? 1 : 0,
                        transition: 'opacity 1s ease-in-out',
                        zIndex: index === current ? 1 : 0
                    }}
                >
                    <Image
                        src={img}
                        alt={`${title} - Image ${index + 1}`}
                        fill
                        style={{ objectFit: 'cover' }}
                        priority={index === 0}
                    />
                </div>
            ))}

            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                padding: '4rem 0 2rem',
                color: 'white',
                textAlign: 'center',
                zIndex: 2
            }}>
                <h1 className="hero-title">{title}</h1>
                <p className="hero-subtitle">{subtitle}</p>
            </div>

            {images.length > 1 && (
                <>
                    <button
                        onClick={prev}
                        style={{
                            position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)',
                            background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none',
                            fontSize: '2rem', padding: '1rem', cursor: 'pointer', zIndex: 3, borderRadius: '50%'
                        }}
                    >
                        &lsaquo;
                    </button>
                    <button
                        onClick={next}
                        style={{
                            position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)',
                            background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none',
                            fontSize: '2rem', padding: '1rem', cursor: 'pointer', zIndex: 3, borderRadius: '50%'
                        }}
                    >
                        &rsaquo;
                    </button>

                    <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px', zIndex: 3 }}>
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrent(idx)}
                                style={{
                                    width: '12px', height: '12px', borderRadius: '50%', border: 'none',
                                    background: idx === current ? 'white' : 'rgba(255,255,255,0.5)',
                                    cursor: 'pointer'
                                }}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
