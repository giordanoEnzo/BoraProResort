import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  await prisma.resort.create({
    data: {
      name: 'Wyndham Olímpia Royal Hotels',
      city: 'Olímpia',
      description: 'Test',
      slug: 'Wyndham-Olímpia-Royal-Hotels',
      imageUrl: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&auto=format&fit=crop&q=60'
    }
  })
  console.log('Created!')
}
main().finally(() => prisma.$disconnect())
