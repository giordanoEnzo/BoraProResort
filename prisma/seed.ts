
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        },
    },
})

// Curated Images for Demo (from Unsplash)
const OLIMPIA_IMAGES = [
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop&q=60'
]

const SAO_PEDRO_IMAGES = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1623718649591-311775a30c43?w=800&auto=format&fit=crop&q=60'
]

const BARRETOS_IMAGES = [
    'https://images.unsplash.com/photo-1571896349842-6e5a51335022?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&auto=format&fit=crop&q=60'
]

async function main() {
    const resorts = [
        {
            name: 'Bora Pro Resort Olímpia',
            slug: 'olimpia',
            city: 'Olímpia',
            description: 'Localizado na capital nacional do folclore e das águas quentes, o Bora Pro Resort Olímpia oferece acesso exclusivo ao Thermas dos Laranjais via transfer privativo. Ideal para famílias.',
            imageUrl: OLIMPIA_IMAGES[0],
            gallery: OLIMPIA_IMAGES
        },
        {
            name: 'Bora Pro Resort São Pedro',
            slug: 'sao-pedro',
            city: 'São Pedro',
            description: 'O refúgio perfeito ao pé da Serra do Itaqueri. Aproveite as águas terapêuticas e o clima ameno, com infraestrutura de lazer completa e vistas deslumbrantes.',
            imageUrl: SAO_PEDRO_IMAGES[0],
            gallery: SAO_PEDRO_IMAGES
        },
        {
            name: 'Bora Pro Resort Barretos',
            slug: 'barretos',
            city: 'Barretos',
            description: 'Viva a emoção da terra do peão com o conforto de um resort 5 estrelas. Piscinas de ondas, fazendinha e gastronomia típica para uma experiência autêntica.',
            imageUrl: BARRETOS_IMAGES[0],
            gallery: BARRETOS_IMAGES
        },
    ]

    for (const resort of resorts) {
        // Find existing or create
        await prisma.resort.upsert({
            where: { slug: resort.slug },
            update: {
                imageUrl: resort.imageUrl,
                description: resort.description,
                // Also update gallery images?
            },
            create: {
                name: resort.name,
                slug: resort.slug,
                city: resort.city,
                description: resort.description,
                imageUrl: resort.imageUrl,
            },
        })

        // Add gallery images to existing resort
        const dbResort = await prisma.resort.findUnique({ where: { slug: resort.slug } })
        if (dbResort) {
            // Clear existing images first to avoid duplicates on re-seed
            await prisma.resortImage.deleteMany({ where: { resortId: dbResort.id } })

            // Create new ones
            await prisma.resortImage.createMany({
                data: resort.gallery.map(url => ({
                    resortId: dbResort.id,
                    url
                }))
            })
        }
    }

    console.log('Seed updated with gallery images.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
