'use client'

import { useState, useEffect, useCallback } from 'react'
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

    const [page, setPage] = useState(1)
    const [limit] = useState(50)
    const [eventType, setEventType] = useState('all')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [totalEvents, setTotalEvents] = useState(0)
    const [totalPages, setTotalPages] = useState(1)

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/analytics?page=${page}&limit=${limit}&type=${eventType}&startDate=${startDate}&endDate=${endDate}`)
            const data = await res.json()
            setEvents(data.events || [])
            if (data.stats) setStats(data.stats)
            if (data.totalEvents !== undefined) setTotalEvents(data.totalEvents)
            if (data.totalPages !== undefined) setTotalPages(data.totalPages)
        } catch (error) {
            console.error(error)
        }
        setLoading(false)
    }, [page, limit, eventType, startDate, endDate])

    const exportData = async () => {
        try {
            const res = await fetch(`/api/analytics?export=true&type=${eventType}&startDate=${startDate}&endDate=${endDate}`)
            const data = await res.json()
            const allEvents = data.events || []

            if (allEvents.length === 0) {
                alert('Nenhum dado para exportar.')
                return
            }

            const header = ['ID', 'Tipo', 'Caminho', 'Data', 'ID do Alvo', 'Texto do Alvo', 'Duração (s)']
            const rows = allEvents.map((ev: Event) => [
                ev.id,
                ev.eventType,
                ev.path,
                format(new Date(ev.createdAt), 'dd/MM/yyyy HH:mm:ss'),
                ev.targetId || '',
                ev.targetText || '',
                ev.duration || ''
            ])

            const csvContent = [
                header.join(';'),
                ...rows.map((r: (string | number)[]) => r.map((c: string | number) => `"${String(c).replace(/"/g, '""')}"`).join(';'))
            ].join('\n')

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.setAttribute('href', url)
            link.setAttribute('download', `sensores_${format(new Date(), 'dd-MM-yyyy_HH-mm')}.csv`)
            link.style.visibility = 'hidden'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (error) {
            console.error(error)
            alert('Erro ao exportar dados.')
        }
    }

    useEffect(() => {
        // Defer to avoid cascading renders warning
        const timer = setTimeout(() => {
            fetchData()
        }, 0)
        const interval = setInterval(() => { // Wrap setInterval's fetchData call in a setTimeout
            setTimeout(() => {
                fetchData()
            }, 0);
        }, 30000) // update every 30s
        return () => {
            clearTimeout(timer)
            clearInterval(interval)
        }
    }, [fetchData])

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
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                                <h3 style={{ margin: 0 }}>Tabela Bruta de Eventos</h3>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                    <input
                                        type="date"
                                        title="Data de Início"
                                        value={startDate}
                                        onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
                                        style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                    />
                                    <input
                                        type="date"
                                        title="Data de Término"
                                        value={endDate}
                                        onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
                                        style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                    />
                                    <select
                                        value={eventType}
                                        onChange={(e) => { setEventType(e.target.value); setPage(1); }}
                                        style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                    >
                                        <option value="all">Todos os tipos</option>
                                        <option value="pageview">Pageview</option>
                                        <option value="click">Click</option>
                                        <option value="read">Read</option>
                                    </select>

                                    <button
                                        onClick={exportData}
                                        style={{ padding: '0.5rem 1rem', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                    >
                                        Exportar Planilha (CSV)
                                    </button>
                                </div>
                            </div>

                            <p style={{ marginBottom: '1rem', color: '#666', fontSize: '0.9rem' }}>Mostrando {events.length} de {totalEvents} registros.</p>

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

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        style={{ padding: '0.5rem 1rem', background: page === 1 ? '#ccc' : '#1565c0', color: 'white', border: 'none', borderRadius: '4px', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
                                    >
                                        Anterior
                                    </button>
                                    <span style={{ fontSize: '0.9rem', color: '#666' }}>Página {page} de {totalPages}</span>
                                    <button
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        style={{ padding: '0.5rem 1rem', background: page === totalPages ? '#ccc' : '#1565c0', color: 'white', border: 'none', borderRadius: '4px', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
                                    >
                                        Próxima
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
