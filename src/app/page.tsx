import { prisma } from '@/lib/prisma'
import Hero from '@/components/Hero'
import ResortCard from '@/components/ResortCard'
import PromotionCard from '@/components/PromotionCard'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const resorts = await prisma.resort.findMany()
  // @ts-ignore - Prisma might complain about new model not being in types yet if not regenerated
  const promotions = await prisma.promotion.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <>
      <Hero />

      <section className="section" id="sobre">
        <div className="container text-center">
          <p className="subtitle" style={{ color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>Sobre Nós</p>
          <h2>O seu refúgio de verão</h2>
          <div className="grid grid-cols-2 text-left" style={{ maxWidth: '900px', margin: '2rem auto 0' }}>
            <div>
              <p>
                A <strong>Bora Pro Resort</strong> é especializada em conectar você aos melhores destinos de águas quentes e lazer do interior de São Paulo. Nossa missão é proporcionar momentos de alegria, conforto sofisticado e aventura.
              </p>
            </div>
            <div>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {['Tropicalidade vibrante', 'Estilo de vida premium', 'Aventura para a família', 'Conforto e sofisticação'].map(item => (
                  <li key={item} className="mb-1 flex-center-gap">
                    <span style={{ color: 'var(--color-secondary)', fontSize: '1.5rem' }}>☀</span> {item}
                  </li>
                ))}
              </ul>
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

          <div className="grid grid-cols-3">
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
      </section>

      {/* Promotions Section */}
      <section className="section" id="promocoes" style={{ background: '#e33537', padding: '4rem 0' }}>
        <div className="container">
          <div className="text-center mb-4" style={{ color: 'white' }}>
            <h2 style={{ color: 'white', marginBottom: '0.5rem' }}>Ofertas Imperdíveis</h2>
            <p style={{ opacity: 0.9 }}>Pacotes exclusivos selecionados para você</p>
          </div>

          <div className="grid grid-cols-3">
            {promotions.map(promo => (
              <PromotionCard
                key={promo.id}
                id={promo.id}
                title={promo.title}
                price={promo.price}
                hotel={promo.hotel}
                duration={promo.duration}
                imageUrl={promo.imageUrl}
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
