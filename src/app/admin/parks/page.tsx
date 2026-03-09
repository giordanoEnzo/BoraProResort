'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Park {
    id: string
    name: string
    city: string
    imageUrl: string
}

export default function ParkList() {
    const [parks, setParks] = useState<Park[]>([])
    const [loading, setLoading] = useState(true)

    const fetchParks = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/parks')
            const data = await res.json()
            if (Array.isArray(data)) {
                setParks(data)
            } else {
                console.error('Invalid data format:', data)
                setParks([])
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchParks()
    }, [])

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este parque?')) return

        try {
            const res = await fetch(`/api/parks/${id}`, { method: 'DELETE' })
            if (res.ok) {
                fetchParks()
            } else {
                alert('Erro ao excluir parque')
            }
        } catch (error) {
            console.error(error)
            alert('Erro ao excluir parque')
        }
    }

    return (
        <div className="section" style={{ background: '#f5f5f5', minHeight: '100vh' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Gerenciar Parques</h2>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <Link href="/admin/dashboard" className="btn btn-secondary" style={{ flexGrow: 1, textAlign: 'center' }}>Voltar ao Painel</Link>
                        <Link href="/admin/parks/new" className="btn btn-primary" style={{ flexGrow: 1, textAlign: 'center' }}>Novo Parque</Link>
                    </div>
                </div>

                <div className="grid-responsive">
                    {loading ? (
                        <p>Carregando...</p>
                    ) : parks.length === 0 ? (
                        <p>Nenhum parque cadastrado.</p>
                    ) : (
                        parks.map(park => (
                            <div key={park.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                                <div style={{ height: '200px', position: 'relative' }}>
                                    <Image
                                        src={park.imageUrl || '/placeholder.jpg'}
                                        alt={park.name}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                                <div style={{ padding: '1.5rem' }}>
                                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{park.name}</h3>
                                    <p style={{ color: '#666', marginBottom: '1rem' }}>{park.city}</p>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <Link href={`/admin/parks/${park.id}`} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
                                            Editar
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(park.id)}
                                            className="btn"
                                            style={{ background: '#d32f2f', color: 'white', padding: '8px 16px', fontSize: '0.8rem' }}
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
