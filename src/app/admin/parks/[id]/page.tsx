import { prisma } from '@/lib/prisma'
import ParkForm from '@/components/ParkForm'

export default async function EditParkPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const park = await prisma.park.findUnique({
        where: { id },
        include: { images: true }
    })

    if (!park) return <div style={{ padding: '2rem', textAlign: 'center' }}>Parque não encontrado.</div>

    return (
        <div style={{ background: '#f5f5f5', minHeight: '100vh', padding: '2rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>Editar Parque</h1>
            <ParkForm initialData={park} />
        </div>
    )
}
