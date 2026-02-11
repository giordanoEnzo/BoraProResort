
import Image from 'next/image'
import Link from 'next/link'

interface ResortCardProps {
    id: string
    name: string
    city: string
    imageUrl: string
    slug: string
}

export default function ResortCard({ name, city, imageUrl, slug }: ResortCardProps) {
    return (
        <div className="card resort-card" style={{ transition: 'transform 0.3s' }}>
            <div style={{ position: 'relative', height: '250px' }}>
                <Image
                    src={imageUrl}
                    alt={name}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>
            <div style={{ padding: '1.5rem' }}>
                <span style={{
                    fontSize: '0.9rem',
                    color: 'var(--color-primary)',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }}>
                    {city}
                </span>
                <h3 style={{ margin: '0.5rem 0 1rem', fontSize: '1.5rem' }}>{name}</h3>
                <Link href={`/resorts/${slug}`} className="btn btn-secondary" style={{ width: '100%', textAlign: 'center' }}>
                    Ver Disponibilidade
                </Link>
            </div>
        </div>
    )
}
