
import Link from 'next/link'

export default function Hero() {
    return (
        <section className="hero" style={{
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            color: 'white',
            marginTop: '-76px', // Compense header height for transparent effect if desired, but here we keep simple
            paddingTop: '76px'
        }}>
            <div className="container animate-fade-in">
                <h1 style={{ fontSize: '3rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)', color: 'white' }}>Viva experiências de verão memoráveis</h1>
                <p style={{ fontSize: '1.5rem', margin: '1rem 0 2rem', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>Multipropriedades exclusivas em Olímpia, São Pedro e Barretos.</p>
                <Link href="#resorts" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem', marginRight: '1rem' }}>
                    Ver Disponibilidade
                </Link>
                <Link
                    href="https://wa.me/5511997468489?text=Olá, gostaria de saber mais sobre as multipropriedades!"
                    target="_blank"
                    className="btn"
                    style={{ fontSize: '1.1rem', padding: '1rem 2rem', background: '#25D366', color: 'white' }}
                >
                    Fale Conosco
                </Link>
            </div>
        </section>
    )
}
