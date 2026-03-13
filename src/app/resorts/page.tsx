import { prisma } from '@/lib/prisma'
import ResortCard from '@/components/ResortCard'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ResortsPage() {
    const resorts = await prisma.resort.findMany({
        orderBy: { name: 'asc' }
    })

    return (
        <div className="section" style={{ minHeight: '100vh', background: 'white' }}>
            <div className="container">
                <div style={{ marginBottom: '3rem' }}>
                    <Link href="/" style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>
                        ← Voltar para Home
                    </Link>
                    <h1>Nossos Resorts Parceiros</h1>
                    <p className="subtitle">Explore todos os destinos de lazer e multipropriedades</p>
                </div>

                <div className="grid-responsive">
                    {resorts.map(resort => (
                        <ResortCard
                            key={resort.id}
                            id={resort.id}
                            name={resort.name}
                            slug={resort.slug}
                            city={resort.city}
                            imageUrl={resort.imageUrl}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
