'use client'

import { useState, useEffect, useCallback } from 'react'
import { format } from 'date-fns'
import Link from 'next/link'
import ConfirmModal from '@/components/ConfirmModal'

interface Testimonial {
    id: string
    author: string
    text: string
    rating: number
    cpf: string
    status: string
    createdAt: string
}

export default function AdminTestimonials() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([])
    const [loading, setLoading] = useState(true)
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        type: 'danger' | 'warning' | 'info';
        confirmText?: string;
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {},
        type: 'danger'
    });

    const fetchTestimonials = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/admin/testimonials')
            const data = await res.json()
            setTestimonials(data)
        } catch (error) {
            console.error(error)
        }
        setLoading(false)
    }, [])

    useEffect(() => {
        fetchTestimonials()
    }, [fetchTestimonials])

    const handleUpdateStatus = (id: string, author: string, newStatus: string) => {
        const action = newStatus === 'APPROVED' ? 'Aprovar' : 'Rejeitar'
        setModalConfig({
            isOpen: true,
            title: `${action} Depoimento`,
            message: `Deseja realmente ${action.toLowerCase()} o depoimento de ${author}?`,
            type: 'info',
            confirmText: action,
            onConfirm: () => performStatusUpdate(id, newStatus)
        })
    }

    const performStatusUpdate = async (id: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/admin/testimonials/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            })

            if (res.ok) {
                fetchTestimonials()
            } else {
                const err = await res.json()
                alert(`Erro: ${err.error}`)
            }
        } catch (error) {
            console.error(error)
            alert("Erro ao atualizar depoimento.")
        } finally {
            setModalConfig(prev => ({ ...prev, isOpen: false }))
        }
    }

    const handleDelete = (id: string, author: string) => {
        setModalConfig({
            isOpen: true,
            title: 'Apagar Depoimento',
            message: `Você tem certeza que deseja apagar permanentemente o depoimento de ${author}?`,
            type: 'danger',
            confirmText: 'Apagar',
            onConfirm: () => performDelete(id)
        })
    }

    const performDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/testimonials/${id}`, {
                method: 'DELETE',
            })

            if (res.ok) {
                fetchTestimonials()
            } else {
                const err = await res.json()
                alert(`Erro: ${err.error}`)
            }
        } catch (error) {
            console.error(error)
            alert("Erro ao apagar depoimento.")
        } finally {
            setModalConfig(prev => ({ ...prev, isOpen: false }))
        }
    }

    return (
        <div className="section" style={{ background: '#f5f5f5', minHeight: '100vh' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Gerenciar Depoimentos</h2>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Link href="/admin/dashboard" className="btn btn-secondary">Voltar ao Painel</Link>
                    </div>
                </div>

                <div className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                            <thead>
                                <tr style={{ background: '#f5f5f5', textAlign: 'left', borderBottom: '2px solid #ddd' }}>
                                    <th style={{ padding: '1rem' }}>Data</th>
                                    <th style={{ padding: '1rem' }}>Autor / CPF</th>
                                    <th style={{ padding: '1rem' }}>Depoimento</th>
                                    <th style={{ padding: '1rem' }}>Nota</th>
                                    <th style={{ padding: '1rem' }}>Status</th>
                                    <th style={{ padding: '1rem' }}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</td></tr>
                                ) : testimonials.length === 0 ? (
                                    <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center' }}>Nenhum depoimento encontrado.</td></tr>
                                ) : (
                                    testimonials.map(t => (
                                        <tr key={t.id} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '1rem' }}>{format(new Date(t.createdAt), 'dd/MM/yy HH:mm')}</td>
                                            <td style={{ padding: '1rem' }}>
                                                <strong>{t.author}</strong><br />
                                                <small style={{ color: '#666' }}>{t.cpf}</small>
                                            </td>
                                            <td style={{ padding: '1rem', maxWidth: '300px' }}>
                                                <p style={{ margin: 0, fontSize: '0.85rem' }}>&quot;{t.text}&quot;</p>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ color: '#FFD700' }}>{'★'.repeat(t.rating)}</div>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{
                                                    padding: '4px 8px',
                                                    borderRadius: '12px',
                                                    fontSize: '0.7rem',
                                                    fontWeight: 'bold',
                                                    background: t.status === 'APPROVED' ? '#e8f5e9' : t.status === 'PENDING' ? '#fffde7' : '#ffebee',
                                                    color: t.status === 'APPROVED' ? '#2e7d32' : t.status === 'PENDING' ? '#f57f17' : '#c62828',
                                                    border: `1px solid ${t.status === 'APPROVED' ? '#c8e6c9' : t.status === 'PENDING' ? '#fff9c4' : '#ffcdd2'}`
                                                }}>
                                                    {t.status === 'APPROVED' ? 'APROVADO' : t.status === 'PENDING' ? 'PENDENTE' : 'REJEITADO'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
                                                    {t.status !== 'APPROVED' && (
                                                        <button
                                                            onClick={() => handleUpdateStatus(t.id, t.author, 'APPROVED')}
                                                            style={{ background: '#4caf50', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}
                                                        >
                                                            Aprovar
                                                        </button>
                                                    )}
                                                    {t.status !== 'REJECTED' && (
                                                        <button
                                                            onClick={() => handleUpdateStatus(t.id, t.author, 'REJECTED')}
                                                            style={{ background: '#ff9800', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}
                                                        >
                                                            Rejeitar
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(t.id, t.author)}
                                                        style={{ background: '#f44336', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}
                                                    >
                                                        Apagar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <ConfirmModal 
                isOpen={modalConfig.isOpen}
                title={modalConfig.title}
                message={modalConfig.message}
                onConfirm={modalConfig.onConfirm}
                onCancel={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                type={modalConfig.type}
                confirmText={modalConfig.confirmText}
                cancelText="Voltar"
            />
        </div>
    )
}
