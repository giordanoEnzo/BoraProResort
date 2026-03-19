import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import Hero from '@/components/Hero'
import ResortCard from '@/components/ResortCard'
import ParkPreviewCard from '@/components/ParkPreviewCard'
import PromotionCard from '@/components/PromotionCard'
import Testimonials from '@/components/Testimonials'

export const dynamic = 'force-dynamic'

export default async function Home() {
  // @ts-ignore
  const resorts = await prisma.resort.findMany({
    orderBy: [
      { isPinned: 'desc' },
      { name: 'asc' }
    ],
    take: 4
  })
  // @ts-ignore
  const parks = await prisma.park.findMany({ 
    orderBy: [
      { isPinned: 'desc' },
      { name: 'asc' }
    ],
    take: 4
  })
  // @ts-ignore - Prisma might complain about new model not being in types yet if not regenerated
  const promotions = await prisma.promotion.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <>
      <Hero />

      <section className="section" id="sobre">
        <div className="container text-center">
          <p className="subtitle" style={{ color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>Quem Somos</p>
          <h2>Sua próxima experiência inesquecível começa aqui</h2>
          
          <div style={{ maxWidth: '900px', margin: '2rem auto 0', textAlign: 'left', lineHeight: '1.8' }}>
            <p className="mb-2">
              A <strong>BoraProResort</strong> nasceu do desejo de transformar viagens em experiências inesquecíveis. Sempre acreditamos que viajar vai muito além de escolher um destino, é sobre criar memórias, viver momentos únicos e realizar sonhos.
            </p>
            <p className="mb-2">
              Com experiência no mercado de multipropriedade, hoje ajudamos famílias, casais e viajantes a planejarem suas viagens com praticidade, segurança e atendimento personalizado humanizado. Trabalhamos com resorts, cruzeiros, passagens aéreas e pacotes completos, sempre buscando as melhores opções para cada cliente.
            </p>
            <p className="mb-2">
              Nosso diferencial está no cuidado em cada detalhe: desde o primeiro atendimento até o retorno da viagem. Aqui, você não compra apenas uma viagem, você conta com uma assessoria completa para viajar com tranquilidade.
            </p>
            <p className="mb-2">
              Seja para um final de semana em família ou aquela viagem dos sonhos, a <strong>BoraProResort</strong> está pronta para te ajudar.
            </p>
            
            <div className="text-center mt-4">
              <Link 
                href="https://wa.me/5511997468489?text=Olá, vim pelo site e gostaria de planejar minha próxima viagem!" 
                target="_blank"
                className="btn btn-primary flex-center-gap"
                style={{ display: 'inline-flex', padding: '15px 30px' }}
              >
                📲 Fale com a gente e comece a planejar hoje mesmo
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'white' }} id="resorts">
        <div className="container">
          <div className="text-center mb-4">
            <h2>Resorts Parceiros</h2>
            <p className="subtitle">Escolha seu destino ideal</p>
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

          <div className="text-center mt-4">
            <Link href="/resorts" className="btn btn-primary">Ver Mais Resorts</Link>
          </div>
        </div>
      </section>

      {/* Parks Section */}
      {parks.length > 0 && (
        <section className="section" style={{ background: '#f5f5f5' }} id="parques">
          <div className="container">
            <div className="text-center mb-4">
              <h2>Parques e Atrações</h2>
              <p className="subtitle">Diversão garantida para toda a família</p>
            </div>

            <div className="grid-responsive">
              {parks.map(park => (
                <ParkPreviewCard
                  key={park.id}
                  id={park.id}
                  slug={park.slug}
                  name={park.name}
                  city={park.city}
                  imageUrl={park.imageUrl}
                />
              ))}
            </div>

            <div className="text-center mt-4">
              <Link href="/parks" className="btn btn-secondary">Ver Mais Parques</Link>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      <Testimonials />

      {/* Promotions Section */}
      <section className="section" id="promocoes" style={{ background: '#e33537', padding: '4rem 0' }}>
        <div className="container">
          <div className="text-center mb-4" style={{ color: 'white' }}>
            <h2 style={{ color: 'white', marginBottom: '0.5rem' }}>Ofertas Imperdíveis</h2>
            <p style={{ opacity: 0.9 }}>Pacotes exclusivos selecionados para você</p>
          </div>

          <div className="grid-responsive">
            {promotions.map(promo => (
              <PromotionCard
                key={promo.id}
                id={promo.id}
                title={promo.title}
                price={promo.price}
                hotel={promo.hotel}
                duration={promo.duration}
                imageUrl={promo.imageUrl}
                peopleCount={promo.peopleCount}
                flightInfo={promo.flightInfo}
                serviceInfo={promo.serviceInfo}
                description={promo.description}
                breakfast={promo.breakfast}
                lunch={promo.lunch}
                dinner={promo.dinner}
              />
            ))}
          </div>
          {promotions.length === 0 && (
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>Nenhuma promoção ativa no momento.</p>
          )}
        </div>
      </section>
    </>
  )
}
