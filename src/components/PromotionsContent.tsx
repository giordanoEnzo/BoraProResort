'use client'

import { useState, useMemo } from 'react'
import PromotionCard from '@/components/PromotionCard'
import FilterBar from '@/components/FilterBar'
import Link from 'next/link'

interface Promotion {
    id: string
    title: string
    city: string
    price: string
    duration: string
    hotel: string
    peopleCount: string
    flightInfo: string | null
    serviceInfo: string | null
    description: string | null
    imageUrl: string
    breakfast: boolean
    lunch: boolean
    dinner: boolean
}

interface PromotionsContentProps {
    initialPromotions: Promotion[]
    cities: string[]
}

export default function PromotionsContent({ initialPromotions, cities }: PromotionsContentProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCity, setSelectedCity] = useState('')

    const filteredPromotions = useMemo(() => {
        return initialPromotions.filter(promo => {
            const matchesSearch = promo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 promo.hotel.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesCity = selectedCity === '' || promo.city === selectedCity
            return matchesSearch && matchesCity
        })
    }, [searchTerm, selectedCity, initialPromotions])

    return (
        <div className="section" style={{ minHeight: '100vh', background: '#f5f5f5' }}>
            <div className="container">
                <div style={{ marginBottom: '3rem' }}>
                    <Link href="/" style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>
                        ← Voltar para Home
                    </Link>
                    <h1>Ofertas Imperdíveis</h1>
                    <p className="subtitle">Confira nossos melhores pacotes e promoções exclusivas</p>
                </div>

                <FilterBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedCity={selectedCity}
                    setSelectedCity={setSelectedCity}
                    cities={cities}
                    placeholder="Buscar por destino ou hotel..."
                />

                {filteredPromotions.length > 0 ? (
                    <div className="grid-responsive">
                        {filteredPromotions.map(promo => (
                            <PromotionCard
                                key={promo.id}
                                id={promo.id}
                                title={promo.title}
                                price={promo.price}
                                hotel={promo.hotel}
                                duration={promo.duration}
                                imageUrl={promo.imageUrl}
                                peopleCount={promo.peopleCount}
                                flightInfo={promo.flightInfo}
                                serviceInfo={promo.serviceInfo}
                                description={promo.description}
                                breakfast={promo.breakfast}
                                lunch={promo.lunch}
                                dinner={promo.dinner}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center" style={{ padding: '3rem', background: 'white', borderRadius: '12px' }}>
                        <p style={{ color: '#666', fontSize: '1.2rem' }}>Nenhuma promoção encontrada com os filtros selecionados.</p>
                        <button 
                            onClick={() => { setSearchTerm(''); setSelectedCity(''); }}
                            style={{ 
                                marginTop: '1rem', 
                                background: 'none', 
                                border: '1px solid var(--color-primary)', 
                                color: 'var(--color-primary)',
                                padding: '8px 20px',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}
                        >
                            Limpar Filtros
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
