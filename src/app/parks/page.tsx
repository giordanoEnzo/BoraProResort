import { prisma } from '@/lib/prisma'
import ParkList from '@/components/ParkList'

export const metadata = {
    title: 'Parques - Bora Pro Resort',
    description: 'Conheça nossos parques incríveis para você e sua família.',
}

export default async function ParksPage() {
    const parks = await prisma.park.findMany({
        include: { images: true },
        orderBy: { name: 'asc' }
    })

    return (
        <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, background: '#f9f9f9', padding: '4rem 0' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h1 style={{ fontSize: '2.5rem', color: '#e33537', marginBottom: '1rem' }}>Nossos Parques</h1>
                        <p style={{ color: '#666', fontSize: '1.1rem', maxWidth: '800px', margin: '0 auto' }}>
                            Explore as melhores opções de lazer e diversão. Conheça as principais atrações de cada parque e planeje seu passeio.
                        </p>
                    </div>

                    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                        {parks.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '2rem', background: 'white', borderRadius: '12px' }}>
                                Nenhum parque cadastrado no momento.
                            </div>
                        ) : (
                            <ParkList parks={parks} />
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}
