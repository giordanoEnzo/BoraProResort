'use client'

import { useState } from 'react'
import ParkCard from './ParkCard'

interface ParkListProps {
    parks: {
        id: string
        name: string
        city: string
        slug: string
        description: string
        attractionsDetails: string
        imageUrl: string
        images: { url: string }[]
    }[]
}

export default function ParkList({ parks }: ParkListProps) {
    const [searchTerm, setSearchTerm] = useState('')

    const filteredParks = parks.filter(park => {
        const term = searchTerm.toLowerCase()
        return park.name.toLowerCase().includes(term) || park.city.toLowerCase().includes(term)
    })

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <input
                    type="text"
                    placeholder="Buscar parque pelo nome ou cidade..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        fontSize: '1.05rem',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                        outline: 'none',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                    }}
                />
            </div>

            {filteredParks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', background: 'white', borderRadius: '12px', color: '#666' }}>
                    Nenhum parque encontrado para "{searchTerm}".
                </div>
            ) : (
                filteredParks.map((park) => (
                    <ParkCard key={park.id} park={park} />
                ))
            )}
        </div>
    )
}
