import Link from 'next/link'
import Image from 'next/image'

const Footer = () => {
    return (
        <footer className="footer-section" style={{ background: '#000000', color: 'white', padding: '3rem 0', textAlign: 'center' }}>
            <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h3>Bora Pro Resort</h3>
                <p>Experiências memoráveis em multipropriedades exclusivas.</p>

                <div style={{ marginTop: '1rem', opacity: 0.7 }}>
                    <p>© 2026 Bora Pro Resort. Todos os direitos reservados.</p>
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.8 }}>
                    <span style={{ fontSize: '0.85rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Desenvolvido por</span>
                    <a href="https://hareware.com.br" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', transition: 'opacity 0.2s', opacity: 0.9 }}>
                        <Image
                            src="/hareware-logo.png"
                            alt="Hareware"
                            width={120}
                            height={30}
                            style={{ objectFit: 'contain' }}
                        />
                    </a>
                </div>
            </div>
        </footer>
    )
}

export default Footer
