
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ConfirmModal from '@/components/ConfirmModal'

interface Promotion {
    id: string
    title: string
    price: string
    imageUrl: string
}

export default function PromotionList() {
    const [promotions, setPromotions] = useState<Promotion[]>([])
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [promoToDelete, setPromoToDelete] = useState<string | null>(null)

    const fetchPromotions = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/promotions')
            const data = await res.json()
            if (Array.isArray(data)) {
                setPromotions(data)
            } else {
                setPromotions([])
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPromotions()
    }, [])

    const handleDeleteClick = (id: string) => {
        setPromoToDelete(id)
        setModalOpen(true)
    }

    const confirmDelete = async () => {
        if (!promoToDelete) return

        try {
            const res = await fetch(`/api/promotions/${promoToDelete}`, { method: 'DELETE' })
            if (res.ok) {
                fetchPromotions()
            } else {
                alert('Erro ao excluir')
            }
        } catch (error) {
            console.error(error)
            alert('Erro ao excluir')
        } finally {
            setModalOpen(false)
            setPromoToDelete(null)
        }
    }

    return (
        <div className="section" style={{ background: '#f5f5f5', minHeight: '100vh' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Gerenciar Promoções</h2>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <Link href="/admin/dashboard" className="btn btn-secondary" style={{ flexGrow: 1, textAlign: 'center' }}>Voltar ao Painel</Link>
                        <Link href="/admin/promotions/new" className="btn btn-primary" style={{ flexGrow: 1, textAlign: 'center' }}>Nova Promoção</Link>
                    </div>
                </div>

                <div className="grid-responsive">
                    {loading ? (
                        <p>Carregando...</p>
                    ) : promotions.length === 0 ? (
                        <p>Nenhuma promoção cadastrada.</p>
                    ) : (
                        promotions.map(promo => (
                            <div key={promo.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                                <div style={{ height: '200px', position: 'relative' }}>
                                    <Image
                                        src={promo.imageUrl || '/placeholder.jpg'}
                                        alt={promo.title}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                                <div style={{ padding: '1.5rem' }}>
                                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{promo.title}</h3>
                                    <p style={{ color: '#2e7d32', fontWeight: 'bold', fontSize: '1.2rem' }}>{promo.price}</p>
                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                        <Link href={`/admin/promotions/${promo.id}`} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
                                            Editar
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteClick(promo.id)}
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

            <ConfirmModal 
                isOpen={modalOpen}
                title="Excluir Promoção"
                message="Tem certeza que deseja excluir esta promoção? Esta ação não pode ser desfeita."
                onConfirm={confirmDelete}
                onCancel={() => setModalOpen(false)}
                confirmText="Excluir"
                cancelText="Cancelar"
            />
        </div>
    )
}
