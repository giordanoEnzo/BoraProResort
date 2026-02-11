
import Link from 'next/link'

const Footer = () => {
    return (
        <footer className="footer-section" style={{ background: '#000000', color: 'white', padding: '3rem 0', textAlign: 'center' }}>
            <div className="container">
                <h3>Bora Pro Resort</h3>
                <p>Experiências memoráveis em multipropriedades exclusivas.</p>
                <div style={{ marginTop: '1rem', opacity: 0.7 }}>
                    <p>© 2026 Bora Pro Resort. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
