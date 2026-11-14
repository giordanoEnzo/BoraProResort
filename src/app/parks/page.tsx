import { prisma } from '@/lib/prisma'
import ParksContent from '@/components/ParksContent'

export const dynamic = 'force-dynamic'

export default async function ParksPage() {
    const parks = await prisma.park.findMany({
        orderBy: { name: 'asc' }
    })

    const cities = Array.from(new Set(parks.map(p => p.city))).filter(Boolean).sort()

    return <ParksContent initialParks={parks} cities={cities} />
}
