
import Link from 'next/link'

export default function Hero() {
    return (
        <section className="hero" style={{
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1920&q=80)',
        }}>
            <div className="container animate-fade-in">
                <h1 className="hero-title">Viva experiências de verão memoráveis</h1>
                <p className="hero-subtitle">Multipropriedades exclusivas em Olímpia, São Pedro e Barretos.</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <Link href="#resorts" className="btn btn-primary">
                        Ver Disponibilidade
                    </Link>
                    <Link
                        href="https://wa.me/5511997468489?text=Olá, gostaria de saber mais sobre as multipropriedades!"
                        target="_blank"
                        className="btn"
                        style={{ background: '#25D366', color: 'white' }}
                    >
                        Fale Conosco
                    </Link>
                </div>
            </div>
        </section>
    )
}
