'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface PromotionProps {
    id: string
    title: string
    price: string
    hotel: string
    duration: string
    imageUrl: string
    peopleCount?: string | number
    flightInfo?: string | null
    serviceInfo?: string | null
    description?: string | null
    breakfast?: boolean
    lunch?: boolean
    dinner?: boolean
}

export default function PromotionCard(props: PromotionProps) {
    const { id, title, price, hotel, duration, imageUrl, peopleCount, flightInfo, serviceInfo, description, breakfast, lunch, dinner } = props
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Helper text for WhatsApp
    const whatsAppUrl = `https://wa.me/5511999999999?text=Olá, gostaria de saber mais sobre a promoção: ${title}`

    return (
        <>
            {/* The Card */}
            <div
                className="card hover-effect"
                style={{ cursor: 'pointer', position: 'relative' }}
                onClick={() => setIsModalOpen(true)}
            >
                <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#e33537', color: 'white', padding: '4px 10px', borderRadius: '4px', zIndex: 1, fontWeight: 'bold' }}>
                    Promoção
                </div>
                <div className="promotion-card-image" style={{ position: 'relative', height: '200px' }}>
                    <Image
                        src={imageUrl || '/placeholder.jpg'}
                        alt={title}
                        fill
                        style={{ objectFit: 'cover', borderRadius: '8px 8px 0 0' }}
                    />
                </div>
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>{title}</h3>
                    <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: 'auto' }}>{hotel} • {duration}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                        <div>
                            <span style={{ fontSize: '0.8rem', color: '#666' }}>A partir de</span>
                            <div style={{ color: '#2e7d32', fontWeight: 'bold', fontSize: '1.4rem' }}>{price}</div>
                        </div>
                        <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                            Ver Mais
                        </button>
                    </div>
                </div>
            </div>

            {/* The Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.7)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    zIndex: 9999, padding: '1rem'
                }} onClick={() => setIsModalOpen(false)}>

                    <div style={{
                        background: 'white', borderRadius: '12px', overflow: 'hidden',
                        maxWidth: '800px', width: '100%', maxHeight: '90vh',
                        display: 'flex', flexDirection: 'column', position: 'relative'
                    }} onClick={(e) => e.stopPropagation()}>

                        {/* Close Button */}
                        <button
                            onClick={() => setIsModalOpen(false)}
                            style={{
                                position: 'absolute', top: '10px', right: '10px', background: 'white',
                                border: 'none', borderRadius: '50%', width: '36px', height: '36px',
                                fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', zIndex: 10,
                                boxShadow: '0 2px 10px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                        >
                            ✕
                        </button>

                        <div style={{ position: 'relative', height: '300px', flexShrink: 0 }}>
                            <Image src={imageUrl || '/placeholder.jpg'} alt={title} fill style={{ objectFit: 'cover' }} />
                            <div style={{
                                position: 'absolute', bottom: 0, left: 0, right: 0,
                                background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                                padding: '2rem 1.5rem 1.5rem', color: 'white'
                            }}>
                                <h2 style={{ fontSize: '2rem', margin: 0, color: 'white' }}>{title}</h2>
                                <p style={{ margin: '0.5rem 0 0', opacity: 0.9 }}>{hotel}</p>
                            </div>
                        </div>

                        <div style={{ padding: '2rem', overflowY: 'auto' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                                <div>
                                    <h4 style={{ color: '#888', fontSize: '0.9rem', marginBottom: '0.2rem', textTransform: 'uppercase' }}>Duração</h4>
                                    <div style={{ fontWeight: 'bold' }}>{duration}</div>
                                </div>
                                {peopleCount && (
                                    <div>
                                        <h4 style={{ color: '#888', fontSize: '0.9rem', marginBottom: '0.2rem', textTransform: 'uppercase' }}>Para</h4>
                                        <div style={{ fontWeight: 'bold' }}>{peopleCount} Pessoa(s)</div>
                                    </div>
                                )}
                                <div>
                                    <h4 style={{ color: '#888', fontSize: '0.9rem', marginBottom: '0.2rem', textTransform: 'uppercase' }}>Valor</h4>
                                    <div style={{ fontWeight: 'bold', color: '#2e7d32', fontSize: '1.2rem' }}>{price}</div>
                                </div>
                            </div>

                            <div style={{ marginBottom: '2rem' }}>
                                <h3 style={{ marginBottom: '1rem', borderBottom: '2px solid #f0f0f0', paddingBottom: '0.5rem' }}>Geral</h3>
                                <p style={{ lineHeight: '1.6', color: '#444', whiteSpace: 'pre-wrap' }}>{description || 'Sem descrição detalhada.'}</p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                                <div>
                                    <h3 style={{ marginBottom: '1rem', borderBottom: '2px solid #f0f0f0', paddingBottom: '0.5rem' }}>O que inclui</h3>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#444' }}>
                                        {flightInfo && <li style={{ marginBottom: '0.5rem' }}>✈️ {flightInfo}</li>}
                                        {serviceInfo && <li style={{ marginBottom: '0.5rem' }}>🏨 {serviceInfo}</li>}
                                        {breakfast && <li style={{ marginBottom: '0.5rem' }}>☕ Café da manhã</li>}
                                        {lunch && <li style={{ marginBottom: '0.5rem' }}>🍽️ Almoço</li>}
                                        {dinner && <li style={{ marginBottom: '0.5rem' }}>🍷 Jantar</li>}
                                    </ul>
                                </div>
                            </div>

                            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                                <Link
                                    href={whatsAppUrl}
                                    target="_blank"
                                    className="btn btn-primary"
                                    style={{ padding: '12px 32px', fontSize: '1.1rem', background: '#25D366', color: 'white', fontWeight: 'bold', display: 'inline-block' }}
                                >
                                    Solicitar no WhatsApp
                                </Link>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
