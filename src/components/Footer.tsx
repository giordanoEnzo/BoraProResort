import Link from 'next/link'
import Image from 'next/image'

const Footer = () => {
    return (
        <footer className="footer-section" style={{ background: '#000000', color: 'white', padding: '4rem 0 2rem', textAlign: 'center' }}>
            <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Bora Pro Resort</h3>
                <p style={{ marginBottom: '1.5rem', opacity: 0.9 }}>Experiências memoráveis em multipropriedades exclusivas.</p>

                <div className="footer-info" style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '2rem', 
                    width: '100%', 
                    maxWidth: '1000px',
                    marginBottom: '3rem',
                    textAlign: 'center'
                }}>
                    <div>
                        <h4 style={{ color: 'var(--color-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem', textTransform: 'uppercase' }}>Contato</h4>
                        <p style={{ fontSize: '0.95rem', margin: '0.2rem 0' }}>WhatsApp: (11) 99746-8489</p>
                        <p style={{ fontSize: '0.95rem', margin: '0.2rem 0' }}>E-mail: contato@boraproresort.com.br</p>
                    </div>
                    <div>
                        <h4 style={{ color: 'var(--color-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem', textTransform: 'uppercase' }}>Siga-nos</h4>
                        <p style={{ fontSize: '0.95rem', margin: '0.2rem 0' }}>Instagram: @boraproresort</p>
                    </div>
                    <div>
                        <h4 style={{ color: 'var(--color-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem', textTransform: 'uppercase' }}>Sobre</h4>
                        <p style={{ fontSize: '0.95rem', margin: '0.2rem 0' }}>CNPJ: 62.838.943/0001-45</p>
                        <p style={{ fontSize: '0.95rem', margin: '0.2rem 0' }}>Agência On-line</p>
                    </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', width: '100%', paddingTop: '2rem', opacity: 0.7 }}>
                    <p>© 2026 Bora Pro Resort. Todos os direitos reservados.</p>
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.8 }}>
                    <span style={{ fontSize: '0.75rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Desenvolvido por</span>
                    <a href="https://hareware.com.br" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', transition: 'opacity 0.2s', opacity: 0.9 }}>
                        <Image
                            src="/hareware-logo.png"
                            alt="Hareware"
                            width={100}
                            height={25}
                            style={{ objectFit: 'contain' }}
                        />
                    </a>
                </div>
            </div>
        </footer>
    )
}

export default Footer
