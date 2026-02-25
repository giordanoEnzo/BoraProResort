import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Política de Privacidade | Bora Pro Resort',
    description: 'Como tratamos seus dados.',
}

export default function Privacidade() {
    return (
        <div className="section" style={{ background: '#f5f5f5', minHeight: '80vh', padding: '4rem 2rem' }}>
            <div className="container" style={{ background: 'white', padding: '3rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <h1 style={{ marginBottom: '2rem', borderBottom: '2px solid #e33537', paddingBottom: '1rem' }}>Política de Privacidade</h1>

                <p>
                    A sua privacidade é uma prioridade para a <strong>Bora Pro Resort</strong>. Nossa política de tratamento de dados foi desenvolvida
                    para assegurar transparência sobre as informações que coletamos para otimizar sua experiência conosco.
                </p>

                <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>1. Uso de Cookies e Sensores</h3>
                <p>
                    Quando você acessa o nosso site, utilizamos cookies e pequenas tecnologias de rastreamento (sensores) para
                    recolher dados estatísticos anônimos.
                    <strong>Nenhum dado é coletado sem o seu consentimento explícito, aceito na nossa faixa de avisos.</strong>
                </p>

                <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>2. O que exatamente nós coletamos?</h3>
                <p>
                    Caso aceite, nosso sistema anota informações meramente técnicas como:
                    <ul style={{ paddingLeft: '2rem', marginTop: '1rem', listStyleType: 'disc' }}>
                        <li>As páginas que você visitou dentro do nosso site.</li>
                        <li>Onde você clicou (botões de ofertas e links).</li>
                        <li>Quanto tempo você permaneceu lendo sobre um resort ou promoção.</li>
                    </ul>
                </p>

                <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>3. Como essas informações são utilizadas?</h3>
                <p>
                    Esses dados abastecem nosso painel administrativo numérico. Assim, nossa equipe visualiza de forma agregada quais
                    destinos estão sendo mais procurados, botões que recebem mais atenção e onde precisamos melhorar o layout do
                    site. Não vinculamos os seus cliques ao seu nome ou documento pessoal. Seus cliques são agrupados em métricas gerais.
                </p>

                <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>4. Seus Direitos (LGPD)</h3>
                <p>
                    Em respeito ao seu direito individual, fornecemos as opções de Aceitar ou Recusar o rastreamento ao entrar no site.
                    Caso você tenha fornecido dados explicitamente no formulário de contato, eles são mantidos em segurança exclusivamente
                    para contato comercial da sua reserva. Você pode solicitar a remoção permanente da sua base a qualquer instante via email
                    oficial no rodapé.
                </p>

                <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #eee', textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
                    Última atualização: Fevereiro de 2026
                </div>
            </div>
        </div>
    )
}
