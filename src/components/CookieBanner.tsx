'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieBanner() {
    const [showBanner, setShowBanner] = useState(false)

    useEffect(() => {
        // Don't show on admin pages
        if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
            return // Do not show banner on admin pages
        }

        const consent = typeof window !== 'undefined' ? localStorage.getItem('cookie_consent') : null
        if (!consent) {
            // Defer to avoid cascading renders warning
            setTimeout(() => {
                setShowBanner(true)
            }, 0)
        }
    }, [])

    const handleAccept = () => {
        localStorage.setItem('cookie_consent', 'accepted')
        setShowBanner(false)
        // Reload to initialize tracker
        window.location.reload()
    }

    const handleDecline = () => {
        localStorage.setItem('cookie_consent', 'declined')
        setShowBanner(false)
    }

    if (!showBanner) return null

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            background: '#333',
            color: '#fff',
            padding: '1.5rem',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1.5rem',
            boxShadow: '0 -4px 10px rgba(0,0,0,0.2)',
            flexWrap: 'wrap'
        }}>
            <div style={{ maxWidth: '800px', fontSize: '0.9rem', lineHeight: '1.4' }}>
                <strong style={{ display: 'block', marginBottom: '8px', color: '#ffca48' }}>Nós respeitamos a sua privacidade!</strong>
                Utilizamos cookies e tecnologias semelhantes para entender como você interage com o nosso site,
                melhorar a sua experiência e guardar estatísticas anônimas de desempenho (como páginas mais visitadas e cliques).
                Isso nos ajuda a oferecer os melhores resorts e serviços para você. Você pode ler os nossos
                <Link href="/privacidade" style={{ color: '#ffca48', textDecoration: 'underline', marginLeft: '5px' }}>Termos de Privacidade</Link> para saber mais detalhes.
                Sinta-se livre para aceitar ou não participar.
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
                <button
                    onClick={handleAccept}
                    style={{ background: '#2e7d32', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Aceitar
                </button>
                <button
                    onClick={handleDecline}
                    style={{ background: 'transparent', color: '#ccc', border: '1px solid #666', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>
                    Recusar
                </button>
            </div>
        </div>
    )
}
