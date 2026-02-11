
import Image from 'next/image'
import Link from 'next/link'

interface PromotionProps {
    id: string
    title: string
    price: string
    hotel: string
    duration: string
    imageUrl: string
}

export default function PromotionCard({ id, title, price, hotel, duration, imageUrl }: PromotionProps) {
    return (
        <div className="card" style={{ padding: '0', overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#e33537', color: 'white', padding: '4px 10px', borderRadius: '4px', zIndex: 1, fontWeight: 'bold' }}>
                Promoção
            </div>
            <div style={{ height: '220px', position: 'relative' }}>
                <Image
                    src={imageUrl || '/placeholder.jpg'}
                    alt={title}
                    fill
                    style={{ objectFit: 'cover' }}
                />
            </div>
            <div style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>{title}</h3>
                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{hotel} • {duration}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                    <div>
                        <span style={{ fontSize: '0.8rem', color: '#666' }}>A partir de</span>
                        <div style={{ color: '#2e7d32', fontWeight: 'bold', fontSize: '1.4rem' }}>{price}</div>
                    </div>
                    {/* Link to whatsapp for now as we don't have a promotion detail page yet, or could link to contact */}
                    <Link href={`https://wa.me/5511999999999?text=Olá, gostaria de saber mais sobre a promoção: ${title}`} target="_blank" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                        Eu Quero
                    </Link>
                </div>
            </div>
        </div>
    )
}
