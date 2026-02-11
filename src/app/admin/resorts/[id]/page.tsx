
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ResortForm from '@/components/ResortForm'

export default function EditResortPage() {
    const { id } = useParams()
    const [resort, setResort] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchResort = async () => {
            try {
                const res = await fetch(`/api/resorts/${id}`)
                if (res.ok) {
                    const data = await res.json()
                    setResort(data)
                }
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        if (id) fetchResort()
    }, [id])

    if (loading) return <div>Carregando...</div>
    if (!resort) return <div>Resort não encontrado</div>

    return (
        <div style={{ background: '#f5f5f5', minHeight: '100vh', padding: '2rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>Editar Resort</h1>
            <ResortForm initialData={resort} />
        </div>
    )
}
