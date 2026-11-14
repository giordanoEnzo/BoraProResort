'use client'

import { useState, useMemo } from 'react'
import ParkPreviewCard from '@/components/ParkPreviewCard'
import FilterBar from '@/components/FilterBar'
import Link from 'next/link'

interface Park {
    id: string
    slug: string
    name: string
    city: string
    imageUrl: string
}

interface ParksContentProps {
    initialParks: Park[]
    cities: string[]
}

export default function ParksContent({ initialParks, cities }: ParksContentProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCity, setSelectedCity] = useState('')

    const filteredParks = useMemo(() => {
        return initialParks.filter(park => {
            const matchesSearch = park.name.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesCity = selectedCity === '' || park.city === selectedCity
            return matchesSearch && matchesCity
        })
    }, [searchTerm, selectedCity, initialParks])

    return (
        <div className="section" style={{ minHeight: '100vh', background: '#f5f5f5' }}>
            <div className="container">
                <div style={{ marginBottom: '3rem' }}>
                    <Link href="/" style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>
                        ← Voltar para Home
                    </Link>
                    <h1>Parques e Atrações</h1>
                    <p className="subtitle">Confira todas as opções de diversão para sua família</p>
                </div>

                <FilterBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedCity={selectedCity}
                    setSelectedCity={setSelectedCity}
                    cities={cities}
                    placeholder="Buscar por nome do parque..."
                />

                {filteredParks.length > 0 ? (
                    <div className="grid-responsive">
                        {filteredParks.map(park => (
                            <ParkPreviewCard
                                key={park.id}
                                id={park.id}
                                slug={park.slug}
                                name={park.name}
                                city={park.city}
                                imageUrl={park.imageUrl}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center" style={{ padding: '3rem', background: 'white', borderRadius: '12px' }}>
                        <p style={{ color: '#666', fontSize: '1.2rem' }}>Nenhum parque encontrado com os filtros selecionados.</p>
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
