'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { MessageCircle, X, Send } from 'lucide-react'

export default function WhatsAppFloatingButton() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        inquiry: ''
    })

    // Don't show on admin pages
    if (pathname?.startsWith('/admin')) return null

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        
        const phoneNumber = '5511997468489' // WhatsApp: (11) 99746-8489
        const message = `Olá, sou ${formData.name} e estou em busca de ${formData.inquiry}.`
        const encodedMessage = encodeURIComponent(message)
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
        
        window.open(whatsappUrl, '_blank')
        setIsOpen(false)
        setFormData({ name: '', inquiry: '' })
    }

    return (
        <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000 }}>
            {/* Form Popover */}
            {isOpen && (
                <div style={{
                    position: 'absolute',
                    bottom: '80px',
                    right: '0',
                    width: '300px',
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                    padding: '1.5rem',
                    animation: 'slideUp 0.3s ease-out'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1.1rem', margin: 0, color: '#075E54' }}>Nos chame no WhatsApp</h3>
                        <button 
                            onClick={() => setIsOpen(false)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}
                        >
                            <X size={20} />
                        </button>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '0.3rem' }}>Seu Nome</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Como podemos te chamar?"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '6px',
                                    border: '1px solid #ddd',
                                    fontSize: '0.9rem',
                                    outline: 'none'
                                }}
                            />
                        </div>
                        <div style={{ marginBottom: '1.2rem' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '0.3rem' }}>O que você busca?</label>
                            <textarea
                                required
                                value={formData.inquiry}
                                onChange={e => setFormData({ ...formData, inquiry: e.target.value })}
                                placeholder="Ex: Resort em Olímpia para Julho"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '6px',
                                    border: '1px solid #ddd',
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    minHeight: '80px',
                                    resize: 'none'
                                }}
                            />
                        </div>
                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: '#25D366',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                transition: 'background 0.3s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#128C7E'}
                            onMouseLeave={e => e.currentTarget.style.background = '#25D366'}
                        >
                            <Send size={18} /> Enviar Mensagem
                        </button>
                    </form>
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: '#25D366',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(37, 211, 102, 0.4)',
                    transition: 'transform 0.3s ease, background 0.3s ease',
                    position: 'relative'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                aria-label="Contact on WhatsApp"
            >
                {isOpen ? <X size={30} /> : <MessageCircle size={32} />}
            </button>

            <style jsx>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    )
}
