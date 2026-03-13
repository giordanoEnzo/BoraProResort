import { prisma } from '@/lib/prisma'
import PromotionsContent from '@/components/PromotionsContent'

export const dynamic = 'force-dynamic'

export default async function PromotionsPage() {
    const promotions = await prisma.promotion.findMany({
        orderBy: { createdAt: 'desc' }
    })

    // @ts-ignore
    const cities = Array.from(new Set(promotions.map(p => p.city))).filter(Boolean).sort()

    // @ts-ignore
    return <PromotionsContent initialPromotions={promotions} cities={cities} />
}
