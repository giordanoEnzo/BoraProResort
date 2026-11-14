'use client'

import { useState, useMemo } from 'react'
import ResortCard from '@/components/ResortCard'
import FilterBar from '@/components/FilterBar'
import Link from 'next/link'

interface Resort {
    id: string
    name: string
    slug: string
    city: string
    imageUrl: string
}

interface ResortsContentProps {
    initialResorts: Resort[]
    cities: string[]
}

export default function ResortsContent({ initialResorts, cities }: ResortsContentProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCity, setSelectedCity] = useState('')

    const filteredResorts = useMemo(() => {
        return initialResorts.filter(resort => {
            const matchesSearch = resort.name.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesCity = selectedCity === '' || resort.city === selectedCity
            return matchesSearch && matchesCity
        })
    }, [searchTerm, selectedCity, initialResorts])

    return (
        <div className="section" style={{ minHeight: '100vh', background: 'white' }}>
            <div className="container">
                <div style={{ marginBottom: '3rem' }}>
                    <Link href="/" style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>
                        ← Voltar para Home
                    </Link>
                    <h1>Nossos Resorts Parceiros</h1>
                    <p className="subtitle">Explore todos os destinos de lazer e multipropriedades</p>
                </div>

                <FilterBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedCity={selectedCity}
                    setSelectedCity={setSelectedCity}
                    cities={cities}
                    placeholder="Buscar por nome do resort..."
                />

                {filteredResorts.length > 0 ? (
                    <div className="grid-responsive">
                        {filteredResorts.map(resort => (
                            <ResortCard
                                key={resort.id}
                                id={resort.id}
                                name={resort.name}
                                slug={resort.slug}
                                city={resort.city}
                                imageUrl={resort.imageUrl}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center" style={{ padding: '3rem', background: '#f5f5f5', borderRadius: '12px' }}>
                        <p style={{ color: '#666', fontSize: '1.2rem' }}>Nenhum resort encontrado com os filtros selecionados.</p>
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
