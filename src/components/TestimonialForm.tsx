'use client'

import React, { useState } from 'react'

interface TestimonialFormProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export default function TestimonialForm({ isOpen, onClose, onSuccess }: TestimonialFormProps) {
    const [formData, setFormData] = useState({
        author: '',
        text: '',
        rating: 5,
        cpf: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    if (!isOpen) return null

    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '')
        if (value.length > 11) value = value.slice(0, 11)
        
        // Apply mask: 000.000.000-00
        let formatted = value
        if (value.length > 3) formatted = value.slice(0, 3) + '.' + value.slice(3)
        if (value.length > 6) formatted = formatted.slice(0, 7) + '.' + formatted.slice(7)
        if (value.length > 9) formatted = formatted.slice(0, 11) + '-' + formatted.slice(11)
        
        setFormData({ ...formData, cpf: formatted })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/testimonials', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    rating: Number(formData.rating)
                })
            })

            const data = await res.json()

            if (res.ok) {
                alert('Depoimento enviado com sucesso! Ele aparecerá no site após a aprovação do administrador.')
                onSuccess()
                onClose()
                setFormData({ author: '', text: '', rating: 5, cpf: '' })
            } else {
                setError(data.error || 'Erro ao enviar depoimento')
            }
        } catch (err) {
            setError('Erro de conexão. Tente novamente.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10001,
            padding: '20px'
        }} onClick={onClose}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '2rem',
                maxWidth: '500px',
                width: '100%',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                position: 'relative'
            }} onClick={e => e.stopPropagation()}>
                <button 
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1.5rem',
                        right: '1.5rem',
                        background: 'none',
                        border: 'none',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        color: '#666'
                    }}
                >
                    &times;
                </button>

                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', color: 'var(--color-primary)' }}>
                    Deixe seu Depoimento
                </h3>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>Seu Nome</label>
                        <input
                            type="text"
                            required
                            placeholder="Como deseja ser identificado"
                            value={formData.author}
                            onChange={e => setFormData({ ...formData, author: e.target.value })}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
                        />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>CPF (Apenas para validação, não será exibido)</label>
                        <input
                            type="text"
                            required
                            placeholder="000.000.000-00"
                            value={formData.cpf}
                            onChange={handleCpfChange}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
                        />
                        <small style={{ color: '#888' }}>Apenas 1 depoimento por CPF.</small>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>Sua Nota</label>
                        <div style={{ display: 'flex', gap: '0.5rem', fontSize: '1.5rem' }}>
                            {[1, 2, 3, 4, 5].map(star => (
                                <span
                                    key={star}
                                    onClick={() => setFormData({ ...formData, rating: star })}
                                    style={{ cursor: 'pointer', color: star <= formData.rating ? '#FFD700' : '#ddd' }}
                                >
                                    {star <= formData.rating ? '★' : '☆'}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>Sua Mensagem</label>
                        <textarea
                            required
                            rows={4}
                            placeholder="Conte sua experiência com a nossa agência..."
                            value={formData.text}
                            onChange={e => setFormData({ ...formData, text: e.target.value })}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', resize: 'none' }}
                        />
                    </div>

                    {error && (
                        <div style={{ marginBottom: '1rem', color: 'var(--color-error)', fontSize: '0.9rem', padding: '0.5rem', background: '#fff5f5', borderRadius: '4px' }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '1rem', borderRadius: '8px', opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? 'Enviando...' : 'Enviar Depoimento'}
                    </button>
                </form>
            </div>
        </div>
    )
}
