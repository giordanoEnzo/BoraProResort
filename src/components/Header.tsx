'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

    return (
        <header>
            <div className="container nav-container">
                <Link href="/" className="logo">
                    <div style={{ position: 'relative', width: '320px', height: '90px', transform: 'translateX(-10px)' }}>
                        <Image
                            src="/logo.png"
                            alt="Bora Pro Resort"
                            fill
                            style={{ objectFit: 'contain', objectPosition: 'left center' }}
                            priority
                            sizes="(max-width: 768px) 240px, 320px"
                        />
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="nav-links">
                    <Link href="/" className="nav-link">Início</Link>
                    <Link href="/resorts" className="nav-link">Resorts</Link>
                    <Link href="/promotions" className="nav-link">Promoções</Link>
                    <Link href="/parks" className="nav-link">Parques</Link>
                </nav>

                {/* Mobile Menu Button */}
                <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle Menu">
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                {/* Mobile Nav Overlay */}
                <div className={`mobile-nav ${isMenuOpen ? 'open' : ''}`} style={isMenuOpen ? { transform: 'translateX(0)' } : {}}>
                    <Link href="/" className="nav-link" onClick={toggleMenu}>Início</Link>
                    <Link href="/resorts" className="nav-link" onClick={toggleMenu}>Resorts</Link>
                    <Link href="/promotions" className="nav-link" onClick={toggleMenu}>Promoções</Link>
                    <Link href="/parks" className="nav-link" onClick={toggleMenu}>Parques</Link>
                </div>
            </div>
        </header>
    )
}
