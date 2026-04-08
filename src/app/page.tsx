import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import Hero from '@/components/Hero'
import ResortCard from '@/components/ResortCard'
import ParkPreviewCard from '@/components/ParkPreviewCard'
import PromotionCard from '@/components/PromotionCard'
import Testimonials from '@/components/Testimonials'
import MaintenanceNotice from '@/components/MaintenanceNotice'

import { cookies } from 'next/headers'

import { MAINTENANCE_MODE } from '@/lib/constants'


export const dynamic = 'force-dynamic'

export default async function Home() {
  const cookieStore = await cookies()
  const isAdmin = cookieStore.get('admin_session')?.value === 'authenticated'

  const resorts = await prisma.resort.findMany({
    orderBy: [
      { isPinned: 'desc' },
      { name: 'asc' }
    ],
    take: 4
  })
  const parks = await prisma.park.findMany({ 
    orderBy: [
      { isPinned: 'desc' },
      { name: 'asc' }
    ],
    take: 4
  })
  const promotions = await prisma.promotion.findMany({ orderBy: { createdAt: 'desc' } })

  if (MAINTENANCE_MODE && !isAdmin) {
    return <MaintenanceNotice />
  }

  return (
    <>
      <Hero />

      <section className="section" id="sobre">
        <div className="container text-center">
          <p className="subtitle" style={{ color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>Quem Somos</p>
          <h2>Bora Pro Resort: Sua próxima experiência inesquecível começa aqui</h2>
          
          <div style={{ maxWidth: '1000px', margin: '2rem auto 0', textAlign: 'left', lineHeight: '1.8' }}>
            <p className="mb-4">
              O <strong>Bora Pro Resort</strong> nasceu do desejo de transformar viagens em experiências inesquecíveis. Acreditamos que viajar vai muito além de escolher um destino, é sobre criar memórias, viver momentos únicos e realizar sonhos. Para isso, contamos com duas marcas especializadas para atender todas as suas necessidades:
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                <div style={{ background: '#f9f9f9', padding: '2rem', borderRadius: '12px', borderLeft: '4px solid var(--color-primary)' }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>Bora Pro Resort</h3>
                    <p>Somos os especialistas oficiais em <strong>Resorts</strong> e no mercado de multipropriedade. Nosso foco é conectar você às melhores experiências de lazer, conforto e infraestrutura completa que só os grandes resorts podem oferecer.</p>
                </div>
                <div style={{ background: '#f9f9f9', padding: '2rem', borderRadius: '12px', borderLeft: '4px solid #ffc847' }}>
                    <h3 style={{ marginBottom: '1rem', color: '#333' }}>Bora Pro Destino</h3>
                    <p>Nossa <strong>agência de viagens completa</strong>. Especializada em promoções de viagens, passagens aéreas, cruzeiros e pacotes para qualquer lugar do mundo. Sua assessoria completa para viajar com tranquilidade.</p>
                </div>
            </div>
            
            <p className="mb-2">
              Nosso diferencial está no cuidado em cada detalhe: desde o primeiro atendimento até o retorno da viagem. Aqui, você não compra apenas uma viagem, você conta com uma assessoria personalizada e humanizada.
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

      {/* Yellow Brand Section: Bora Pro Destino */}
      <section className="section" style={{ background: '#ffc847', padding: '5rem 0' }} id="bora-pro-destino">
        <div className="container">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            alignItems: 'center', 
            gap: '3rem' 
          }}>
            <div style={{ background: 'white', padding: '2rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', textAlign: 'center' }}>
              <div style={{ position: 'relative', height: '120px', width: '100%', marginBottom: '1rem' }}>
                <Image 
                  src="/bora-pro-destino-horizontal.png" 
                  alt="Bora Pro Destino" 
                  fill 
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <p style={{ fontWeight: 'bold', color: '#e33537', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Sessão Especializada em Promoções
              </p>
            </div>
            
            <div style={{ color: '#333' }}>
              <h2 style={{ color: '#333', fontSize: '2.5rem', marginBottom: '1.5rem' }}>Conheça a Bora Pro Destino</h2>
              <p style={{ fontSize: '1.2rem', lineHeight: '1.7', marginBottom: '2rem' }}>
                Mais do que apenas resorts, nossa agência de viagens oferece as melhores tarifas e pacotes exclusivos para destinos nacionais e internacionais.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                <Link href="#promocoes" className="btn" style={{ background: '#e33537', color: 'white', padding: '15px 30px' }}>
                  Conferir Promoções
                </Link>
                <Link 
                  href="https://wa.me/5511997468489?text=Olá, gostaria de saber mais sobre as promoções da Bora Pro Destino!" 
                  target="_blank"
                  className="btn" 
                  style={{ background: 'white', color: '#333', padding: '15px 30px' }}
                >
                  Falar no WhatsApp
                </Link>
              </div>
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
