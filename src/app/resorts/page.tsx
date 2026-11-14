import { prisma } from '@/lib/prisma'
import ResortsContent from '@/components/ResortsContent'

export const dynamic = 'force-dynamic'

export default async function ResortsPage() {
    const resorts = await prisma.resort.findMany({
        orderBy: { name: 'asc' }
    })

    const cities = Array.from(new Set(resorts.map(r => r.city))).filter(Boolean).sort()

    return <ResortsContent initialResorts={resorts} cities={cities} />
}
