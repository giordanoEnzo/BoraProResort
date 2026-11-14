'use client'

import { Search, X, MapPin } from 'lucide-react'

interface FilterBarProps {
    searchTerm: string
    setSearchTerm: (value: string) => void
    selectedCity: string
    setSelectedCity: (value: string) => void
    cities: string[]
    placeholder?: string
}

export default function FilterBar({
    searchTerm,
    setSearchTerm,
    selectedCity,
    setSelectedCity,
    cities,
    placeholder = "Buscar por nome..."
}: FilterBarProps) {
    const hasFilters = searchTerm !== '' || selectedCity !== ''

    const clearFilters = () => {
        setSearchTerm('')
        setSelectedCity('')
    }

    return (
        <div className="filter-bar" style={{ 
            background: 'white', 
            padding: '1.5rem', 
            borderRadius: '12px', 
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
            marginBottom: '2.5rem',
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            alignItems: 'center'
        }}>
            {/* Search Input */}
            <div style={{ position: 'relative', flex: '1', minWidth: '250px' }}>
                <Search size={20} style={{ 
                    position: 'absolute', 
                    left: '12px', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    color: '#999' 
                }} />
                <input
                    type="text"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '10px 15px 10px 40px',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                        fontSize: '1rem',
                        outline: 'none',
                        transition: 'border-color 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                    onBlur={(e) => e.target.style.borderColor = '#ddd'}
                />
            </div>

            {/* City Select */}
            <div style={{ position: 'relative', minWidth: '200px' }}>
                <MapPin size={20} style={{ 
                    position: 'absolute', 
                    left: '12px', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    color: '#999',
                    pointerEvents: 'none'
                }} />
                <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '10px 15px 10px 40px',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                        fontSize: '1rem',
                        outline: 'none',
                        cursor: 'pointer',
                        appearance: 'none',
                        background: 'white'
                    }}
                >
                    <option value="">Todas as Cidades</option>
                    {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                    ))}
                </select>
                <div style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    borderLeft: '5px solid transparent',
                    borderRight: '5px solid transparent',
                    borderTop: '5px solid #999'
                }}></div>
            </div>

            {/* Clear Button */}
            {hasFilters && (
                <button
                    onClick={clearFilters}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'none',
                        border: 'none',
                        color: '#666',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        transition: 'background 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f0f0f0'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                >
                    <X size={16} /> Limpar Filtros
                </button>
            )}
        </div>
    )
}
