import Image from 'next/image'
import Link from 'next/link'

interface ParkPreviewCardProps {
    id: string
    name: string
    city: string
    imageUrl: string
}

export default function ParkPreviewCard({ name, city, imageUrl }: ParkPreviewCardProps) {
    return (
        <div className="card resort-card">
            <div className="resort-card-image">
                <Image
                    src={imageUrl}
                    alt={name}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>
            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{
                    fontSize: '0.9rem',
                    color: 'var(--color-primary)',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }}>
                    {city}
                </span>
                <h3 style={{ margin: '0.5rem 0 1rem', fontSize: '1.5rem', flex: 1 }}>{name}</h3>
                <Link href={`/parks`} className="btn btn-secondary" style={{ width: '100%', textAlign: 'center', display: 'block' }}>
                    Ver Parques
                </Link>
            </div>
        </div>
    )
}
