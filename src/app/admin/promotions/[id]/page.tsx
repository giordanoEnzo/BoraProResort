
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import PromotionForm from '@/components/PromotionForm'

export default function EditPromotionPage() {
    const { id } = useParams()
    const [promotion, setPromotion] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPromo = async () => {
            try {
                const res = await fetch(`/api/promotions/${id}`)
                if (res.ok) {
                    const data = await res.json()
                    setPromotion(data)
                }
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        if (id) fetchPromo()
    }, [id])

    if (loading) return <div>Carregando...</div>
    if (!promotion) return <div>Promoção não encontrada</div>

    return (
        <div style={{ background: '#f5f5f5', minHeight: '100vh', padding: '2rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>Editar Promoção</h1>
            <PromotionForm initialData={promotion} />
        </div>
    )
}
