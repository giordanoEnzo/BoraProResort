import { prisma } from '@/lib/prisma'
import ParkPreviewCard from '@/components/ParkPreviewCard'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ParksPage() {
    const parks = await prisma.park.findMany({
        orderBy: { name: 'asc' }
    })

    return (
        <div className="section" style={{ minHeight: '100vh', background: '#f5f5f5' }}>
            <div className="container">
                <div style={{ marginBottom: '3rem' }}>
                    <Link href="/" style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>
                        ← Voltar para Home
                    </Link>
                    <h1>Parques e Atrações</h1>
                    <p className="subtitle">Confira todas as opções de diversão para sua família</p>
                </div>

                <div className="grid-responsive">
                    {parks.map(park => (
                        <ParkPreviewCard
                            key={park.id}
                            id={park.id}
                            name={park.name}
                            city={park.city}
                            imageUrl={park.imageUrl}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
