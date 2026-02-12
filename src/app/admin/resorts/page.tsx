
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Resort {
    id: string
    name: string
    city: string
    imageUrl: string
}

export default function ResortList() {
    const [resorts, setResorts] = useState<Resort[]>([])
    const [loading, setLoading] = useState(true)

    const fetchResorts = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/resorts')
            const data = await res.json()
            if (Array.isArray(data)) {
                setResorts(data)
            } else {
                console.error('Invalid data format:', data)
                setResorts([])
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchResorts()
    }, [])

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este resort?')) return

        try {
            const res = await fetch(`/api/resorts/${id}`, { method: 'DELETE' })
            if (res.ok) {
                fetchResorts()
            } else {
                alert('Erro ao excluir resort')
            }
        } catch (error) {
            console.error(error)
            alert('Erro ao excluir resort')
        }
    }

    return (
        <div className="section" style={{ background: '#f5f5f5', minHeight: '100vh' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Gerenciar Resorts</h2>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <Link href="/admin/dashboard" className="btn btn-secondary" style={{ flexGrow: 1, textAlign: 'center' }}>Voltar ao Painel</Link>
                        <Link href="/admin/resorts/new" className="btn btn-primary" style={{ flexGrow: 1, textAlign: 'center' }}>Novo Resort</Link>
                    </div>
                </div>

                <div className="grid grid-cols-3">
                    {loading ? (
                        <p>Carregando...</p>
                    ) : resorts.length === 0 ? (
                        <p>Nenhum resort cadastrado.</p>
                    ) : (
                        resorts.map(resort => (
                            <div key={resort.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                                <div style={{ height: '200px', position: 'relative' }}>
                                    <Image
                                        src={resort.imageUrl || '/placeholder.jpg'}
                                        alt={resort.name}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                                <div style={{ padding: '1.5rem' }}>
                                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{resort.name}</h3>
                                    <p style={{ color: '#666', marginBottom: '1rem' }}>{resort.city}</p>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <Link href={`/admin/resorts/${resort.id}`} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
                                            Editar
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(resort.id)}
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
