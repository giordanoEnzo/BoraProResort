'use client'

import React, { useState, useEffect } from 'react'
import TestimonialForm from './TestimonialForm'

interface Testimonial {
    id?: string
    author: string
    text: string
    rating: number
}

const staticTestimonials = [
    {
        author: 'Patrícia',
        text: 'Priscila sempre muito prestativa. O apartamento muito bom! voltaremos mais vezes com certeza.',
        rating: 5
    },
    {
        author: 'Cristiane',
        text: 'A Priscila foi incrível desde o primeiro contato até o dia que fui embora. Me indicou lugares incríveis e com bom preço. Só tenho que agradecer …em breve voltarei e será com ela . Obrigada Pri ❤️\uD83D\uDE4F\uD83C\uDFFB\uD83D\uDE18\uD83D\uDE18',
        rating: 5
    },
    {
        author: 'Sidnei',
        text: 'eu e minha família amamos a estadia a Priscila sempre respondeu com rapidez e auxiliando voltaremos mais vezes pois adoramos',
        rating: 5
    },
    {
        author: 'Joice',
        text: 'Amamos o lugar , !!!, a Priscila sempre atenciosa, deu várias dicas de restaurantes legais ! Obg pri Deus abençoe',
        rating: 5
    },
    {
        author: 'Fernanda',
        text: 'Apartamento muito confortável, exatamente como descrito',
        rating: 5
    },
    {
        author: 'Maria',
        text: 'Desde o primeiro momento a Priscila foi muito simpática e prestativa. Gostei muito mesmo , só tenho a agradecer!',
        rating: 5
    }
]

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([])
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [loading, setLoading] = useState(true)

    const fetchTestimonials = async () => {
        try {
            const res = await fetch('/api/testimonials')
            if (res.ok) {
                const data = await res.json()
                if (data.length > 0) {
                    setTestimonials(data)
                } else {
                    setTestimonials(staticTestimonials)
                }
            }
        } catch (error) {
            console.error('Error fetching testimonials:', error)
            setTestimonials(staticTestimonials)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTestimonials()
    }, [])

    return (
        <section className="section" id="avaliacoes" style={{ background: '#f9f9f9' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
                    <div>
                        <p className="subtitle" style={{ color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold', marginBottom: '0.5rem' }}>Feedback dos Clientes</p>
                        <h2 style={{ margin: 0 }}>O que dizem sobre nós</h2>
                    </div>
                    <button 
                        onClick={() => setIsFormOpen(true)}
                        className="btn btn-primary"
                        style={{ padding: '0.8rem 1.5rem', borderRadius: '30px', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(var(--color-primary-rgb), 0.3)' }}
                    >
                        Deixar um Depoimento
                    </button>
                </div>

                <div className="grid-responsive" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {loading ? (
                        <p>Carregando avaliações...</p>
                    ) : (
                        testimonials.map((t, index) => (
                            <div key={t.id || index} style={{ 
                                background: 'white', 
                                padding: '2rem', 
                                borderRadius: '12px', 
                                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                                transition: 'transform 0.3s ease',
                                border: '1px solid #f0f0f0'
                            }}>
                                <div style={{ color: '#FFD700', fontSize: '1.2rem', marginBottom: '1rem' }}>
                                    {'★'.repeat(t.rating)}
                                    {'☆'.repeat(5 - t.rating)}
                                </div>
                                <p style={{ fontStyle: 'italic', marginBottom: '1.5rem', flexGrow: 1, color: '#444', lineHeight: '1.6', fontSize: '1rem' }}>
                                    &quot;{t.text}&quot;
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ 
                                        width: '40px', 
                                        height: '40px', 
                                        background: 'var(--color-primary)', 
                                        borderRadius: '50%', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: '1.1rem'
                                    }}>
                                        {t.author.charAt(0)}
                                    </div>
                                    <span style={{ fontWeight: '600', color: '#1a1a1a' }}>{t.author}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <TestimonialForm 
                isOpen={isFormOpen} 
                onClose={() => setIsFormOpen(false)} 
                onSuccess={fetchTestimonials}
            />
        </section>
    )
}

export default Testimonials
