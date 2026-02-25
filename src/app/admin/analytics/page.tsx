'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'

interface Event {
    id: string
    eventType: string
    path: string
    targetId: string | null
    targetText: string | null
    duration: number | null
    createdAt: string
}

interface Stats {
    groupByType: { eventType: string, _count: { id: number } }[]
    topPages: { path: string, _count: { id: number } }[]
    topClicks: { targetText: string, path: string, _count: { id: number } }[]
}

export default function AnalyticsDashboard() {
    const [events, setEvents] = useState<Event[]>([])
    const [stats, setStats] = useState<Stats | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/analytics')
            const data = await res.json()
            setEvents(data.events || [])
            setStats(data.stats || null)
        } catch (error) {
            console.error(error)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchData()
        const interval = setInterval(fetchData, 30000) // update every 30s
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="section" style={{ background: '#f5f5f5', minHeight: '100vh' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Métricas & Sensores</h2>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <Link href="/admin/dashboard" className="btn btn-secondary" style={{ flexGrow: 1, textAlign: 'center' }}>Voltar ao Painel</Link>
                    </div>
                </div>

                {loading && !stats ? <p>Carregando sensores...</p> : (
                    <>
                        <div className="grid grid-cols-3" style={{ marginBottom: '2rem', gap: '1.5rem' }}>
                            <div className="card" style={{ padding: '1.5rem', borderLeft: '5px solid #2e7d32' }}>
                                <h4 style={{ color: '#666', marginBottom: '0.5rem', fontSize: '1rem' }}>Top Páginas</h4>
                                {stats?.topPages.map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                        <span title={item.path} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px' }}>{item.path}</span>
                                        <strong>{item._count.id} views</strong>
                                    </div>
                                ))}
                                {(!stats?.topPages || stats.topPages.length === 0) && <small>Nenhum dado.</small>}
                            </div>

                            <div className="card" style={{ padding: '1.5rem', borderLeft: '5px solid #1565c0' }}>
                                <h4 style={{ color: '#666', marginBottom: '0.5rem', fontSize: '1rem' }}>Top Cliques</h4>
                                {stats?.topClicks.map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                        <span title={item.targetText} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px' }}>{item.targetText || 'Link'}</span>
                                        <strong style={{ color: '#666' }}>{item._count.id}</strong>
                                    </div>
                                ))}
                                {(!stats?.topClicks || stats.topClicks.length === 0) && <small>Nenhum dado.</small>}
                            </div>

                            <div className="card" style={{ padding: '1.5rem', borderLeft: '5px solid #fbc02d' }}>
                                <h4 style={{ color: '#666', marginBottom: '0.5rem', fontSize: '1rem' }}>Resumo Geral</h4>
                                {stats?.groupByType.map(g => (
                                    <div key={g.eventType} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', marginTop: '10px' }}>
                                        <span style={{ textTransform: 'capitalize' }}>{g.eventType}:</span>
                                        <strong>{g._count.id} logs</strong>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card" style={{ padding: '1.5rem' }}>
                            <h3 style={{ marginBottom: '1rem' }}>Tabela Bruta de Eventos (Últimos 200)</h3>
                            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                                <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                    <thead>
                                        <tr style={{ background: '#f5f5f5', textAlign: 'left', borderBottom: '2px solid #ddd' }}>
                                            <th style={{ padding: '1rem' }}>Data</th>
                                            <th style={{ padding: '1rem' }}>Evento</th>
                                            <th style={{ padding: '1rem' }}>Página</th>
                                            <th style={{ padding: '1rem' }}>Detalhe</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {events.map((ev) => (
                                            <tr key={ev.id} style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={{ padding: '1rem' }}>{format(new Date(ev.createdAt), 'dd/MM/yy HH:mm:ss')}</td>
                                                <td style={{ padding: '1rem' }}>
                                                    <span style={{
                                                        padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem',
                                                        background: ev.eventType === 'pageview' ? '#e3f2fd' : ev.eventType === 'click' ? '#fff9c4' : '#e8f5e9'
                                                    }}>
                                                        {ev.eventType}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1rem' }}>{ev.path}</td>
                                                <td style={{ padding: '1rem' }}>
                                                    {ev.duration ? `${ev.duration} segundos lidos.` : ev.targetText ? `Clicou em: "${ev.targetText}"` : '-'}
                                                </td>
                                            </tr>
                                        ))}
                                        {events.length === 0 && <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center' }}>Nenhum evento registrado.</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
