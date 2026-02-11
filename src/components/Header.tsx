
import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
    return (
        <header className="header">
            <div className="container nav-container">
                <Link href="/" className="logo">
                    <div style={{ position: 'relative', width: '220px', height: '80px', overflow: 'hidden' }}>
                        <Image
                            src="/logo.png"
                            alt="Bora Pro Resort"
                            fill
                            style={{ objectFit: 'contain', transform: 'scale(1.4)' }}
                            priority
                            sizes="(max-width: 768px) 150px, 220px"
                        />
                    </div>
                </Link>
                <nav className="nav-links">
                    <Link href="/" className="nav-link">Início</Link>
                    <Link href="/#resorts" className="nav-link">Resorts</Link>
                    <Link href="/#promocoes" className="nav-link">Promoções</Link>
                </nav>
            </div>
        </header>
    )
}
