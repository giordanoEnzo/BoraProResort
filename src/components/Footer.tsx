'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Mail, Phone, ShieldCheck, MapPin, ChevronRight } from 'lucide-react'

const Footer = () => {
    return (
        <footer className="footer-section" style={{ background: '#0a0a0a', color: 'white', padding: '5rem 0 2rem' }}>
            <div className="container">
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                    gap: '4rem',
                    marginBottom: '4rem'
                }}>
                    {/* Column 1: Brand & About */}
                    <div style={{ textAlign: 'left' }}>
                        <Link href="/" style={{ display: 'inline-block', marginBottom: '1.5rem' }}>
                            <Image
                                src="/logo.png"
                                alt="Bora Pro Resort"
                                width={180}
                                height={60}
                                style={{ objectFit: 'contain' }}
                            />
                        </Link>
                        <p style={{ opacity: 0.7, fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                            Especialistas em conectar você aos melhores destinos e multipropriedades exclusivas no interior de São Paulo.
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.6, fontSize: '0.85rem' }}>
                            <ShieldCheck size={16} color="var(--color-secondary)" />
                            <span>CNPJ: 62.838.943/0001-45</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.6, fontSize: '0.85rem', marginTop: '0.5rem' }}>
                            <Image
                                src="/cadastur-certificado.png"
                                alt="Certificado Cadastur"
                                width={180}
                                height={127}
                                style={{ objectFit: 'contain', opacity: 0.9 }}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.6, fontSize: '0.85rem', marginTop: '0.5rem' }}>
                            <MapPin size={16} color="var(--color-secondary)" />
                            <span>Agência On-line</span>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div style={{ textAlign: 'left' }}>
                        <h4 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '2rem', position: 'relative', paddingBottom: '0.75rem' }}>
                            Explorar
                            <span style={{ position: 'absolute', bottom: 0, left: 0, width: '40px', height: '2px', background: 'var(--color-primary)' }}></span>
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {[
                                { label: 'Início', href: '/' },
                                { label: 'Resorts', href: '/#resorts' },
                                { label: 'Parques', href: '/#parques' },
                                { label: 'Avaliações', href: '/#avaliacoes' },
                                { label: 'Políticas de Privacidade', href: '/privacidade' }
                            ].map((link) => (
                                <li key={link.label} style={{ marginBottom: '1rem' }}>
                                    <Link href={link.href} style={{ 
                                        opacity: 0.7, 
                                        transition: 'all 0.3s ease',
                                        fontSize: '0.95rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }} className="footer-link">
                                        <ChevronRight size={14} color="var(--color-primary)" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Contact & Social */}
                    <div style={{ textAlign: 'left' }}>
                        <h4 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '2rem', position: 'relative', paddingBottom: '0.75rem' }}>
                            Atendimento
                            <span style={{ position: 'absolute', bottom: 0, left: 0, width: '40px', height: '2px', background: 'var(--color-primary)' }}></span>
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <a href="https://wa.me/5511997468489" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '1rem', opacity: 0.8, transition: 'all 0.3s ease' }} className="footer-contact">
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center' }}>
                                    <Phone size={18} color="var(--color-secondary)" />
                                </div>
                                <span style={{ fontSize: '0.95rem' }}>(11) 99746-8489</span>
                            </a>
                            <a href="mailto:contato@boraproresort.com.br" style={{ display: 'flex', alignItems: 'center', gap: '1rem', opacity: 0.8, transition: 'all 0.3s ease' }} className="footer-contact">
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Mail size={18} color="var(--color-secondary)" />
                                </div>
                                <span style={{ fontSize: '0.95rem' }}>contato@boraproresort.com.br</span>
                            </a>
                            <a href="https://www.instagram.com/boraproresort/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '1rem', opacity: 0.8, transition: 'all 0.3s ease' }} className="footer-contact">
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Instagram size={18} color="var(--color-secondary)" />
                                </div>
                                <span style={{ fontSize: '0.95rem' }}>@boraproresort</span>
                            </a>
                            <a href="https://www.instagram.com/boraprodestino/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '1rem', opacity: 0.8, transition: 'all 0.3s ease' }} className="footer-contact">
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Instagram size={18} color="var(--color-secondary)" />
                                </div>
                                <span style={{ fontSize: '0.95rem' }}>@boraprodestino</span>
                            </a>
                        </div>
                    </div>
                </div>

                <div style={{ 
                    borderTop: '1px solid rgba(255,255,255,0.05)', 
                    paddingTop: '2rem', 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    gap: '1.5rem'
                }}>
                    <p style={{ opacity: 0.5, fontSize: '0.85rem' }}>
                        © 2026 Bora Pro Resort. Todos os direitos reservados.
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', opacity: 0.6 }}>
                        <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Desenvolvido por</span>
                        <a href="https://hareware.com.br" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', transition: 'opacity 0.2s', opacity: 0.9 }}>
                            <Image
                                src="/hareware-logo.png"
                                alt="Hareware"
                                width={90}
                                height={22}
                                style={{ objectFit: 'contain' }}
                            />
                        </a>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .footer-link:hover {
                    opacity: 1 !important;
                    color: var(--color-primary);
                    transform: translateX(5px);
                }
                .footer-contact:hover {
                    opacity: 1 !important;
                    color: var(--color-secondary);
                }
                .footer-contact:hover div {
                    background: rgba(255,255,255,0.1) !important;
                    transform: scale(1.1);
                }
            `}</style>
        </footer>
    )
}

export default Footer
