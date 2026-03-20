import React from 'react'

const testimonials = [
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
    return (
        <section className="section" id="avaliacoes" style={{ background: '#f9f9f9' }}>
            <div className="container">
                <div className="text-center mb-4">
                    <p className="subtitle" style={{ color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>Feedback dos Clientes</p>
                    <h2>O que dizem sobre nós</h2>
                </div>

                <div className="grid-responsive" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {testimonials.map((t, index) => (
                        <div key={index} style={{ 
                            background: 'white', 
                            padding: '2rem', 
                            borderRadius: '12px', 
                            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%'
                        }}>
                            <div style={{ color: '#FFD700', fontSize: '1.2rem', marginBottom: '1rem' }}>
                                {'★'.repeat(t.rating)}
                            </div>
                            <p style={{ fontStyle: 'italic', marginBottom: '1.5rem', flexGrow: 1, color: '#444', lineHeight: '1.6' }}>
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
                                    fontSize: '1.2rem'
                                }}>
                                    {t.author.charAt(0)}
                                </div>
                                <span style={{ fontWeight: '600', color: '#1a1a1a' }}>{t.author}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Testimonials
