import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const resorts = await prisma.resort.findMany({ select: { slug: true, name: true } })
  console.log(JSON.stringify(resorts, null, 2))
}
main().finally(() => prisma.$disconnect())
