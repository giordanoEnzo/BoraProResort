
'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import Link from 'next/link'

interface Reservation {
    id: string
    name: string
    email: string
    phone: string
    startDate: string
    endDate: string
    guests: number
    status: string
    resort: {
        name: string
    }
    createdAt: string
}

interface KPI {
    pending: number
    confirmed: number
    closedThisMonth: number
}

interface SalesData {
    date: string
    count: number
}

interface DayStats {
    month: string
    days: { day: string; count: number }[]
}

export default function AdminDashboard() {
    const [reservations, setReservations] = useState<Reservation[]>([])
    const [stats, setStats] = useState<{ kpi: KPI, salesPerMonth: SalesData[], mostRequestedDays: DayStats[] } | null>(null)
    const [filterResort, setFilterResort] = useState('')
    const [filterStatus, setFilterStatus] = useState('')
    const [loading, setLoading] = useState(true)

    const fetchReservations = async () => {
        setLoading(true)
        let url = '/api/reservations'
        const params = new URLSearchParams()
        if (filterResort) params.append('resortId', filterResort)
        if (filterStatus) params.append('status', filterStatus)
        if (params.toString()) url += `?${params.toString()}`

        try {
            const res = await fetch(url)
            const data = await res.json()
            setReservations(data)
        } catch (error) {
            console.error(error)
        }
        setLoading(false)
    }

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/dashboard/stats')
            const data = await res.json()
            setStats(data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchReservations()
        fetchStats()
    }, [filterResort, filterStatus])

    const handleStatusChange = async (id: string, newStatus: string) => {
        if (!confirm(`Alterar status para ${newStatus}?`)) return

        try {
            const res = await fetch(`/api/reservations/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus }),
            })

            if (res.ok) {
                fetchReservations()
                fetchStats() // Refresh stats too
            } else {
                const err = await res.json()
                alert(`Erro: ${err.error}`)
            }
        } catch (error) {
            console.error(error)
            alert("Erro ao atualizar status.")
        }
    }

    const maxSales = stats?.salesPerMonth?.reduce((acc, curr) => Math.max(acc, curr.count), 0) || 1

    return (
        <div className="section" style={{ background: '#f5f5f5', minHeight: '100vh' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Painel Administrativo</h2>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Link href="/admin/promotions" className="btn btn-secondary" style={{ background: '#fbc02d' }}>Gerenciar Promoções</Link>
                        <Link href="/admin/resorts" className="btn btn-primary">Gerenciar Resorts</Link>
                        <Link href="/" className="btn btn-secondary">Voltar ao Site</Link>
                    </div>
                </div>

                {/* KPI Cards */}
                {stats && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                        <div className="card" style={{ padding: '1.5rem', borderLeft: '5px solid #fbc02d' }}>
                            <h4 style={{ color: '#666', marginBottom: '0.5rem' }}>Em Negociação</h4>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.kpi.pending}</div>
                            <small>Reservas Pendentes</small>
                        </div>
                        <div className="card" style={{ padding: '1.5rem', borderLeft: '5px solid #2e7d32' }}>
                            <h4 style={{ color: '#666', marginBottom: '0.5rem' }}>Confirmadas Total</h4>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.kpi.confirmed}</div>
                            <small>Vendas Completas</small>
                        </div>
                        <div className="card" style={{ padding: '1.5rem', borderLeft: '5px solid #1565c0' }}>
                            <h4 style={{ color: '#666', marginBottom: '0.5rem' }}>Fechadas Este Mês</h4>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.kpi.closedThisMonth}</div>
                            <small>Performance Mensal</small>
                        </div>
                    </div>
                )}

                {/* Charts Section */}
                {stats && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                        {/* Sales Chart */}
                        <div className="card" style={{ padding: '1.5rem' }}>
                            <h4 style={{ marginBottom: '1.5rem' }}>Vendas por Mês</h4>
                            <div style={{
                                display: 'flex',
                                alignItems: 'flex-end',
                                gap: '1rem',
                                height: '200px',
                                overflowX: 'auto',
                                paddingBottom: '10px'
                            }}>
                                {stats.salesPerMonth.map((item) => (
                                    <div key={item.date} style={{ textAlign: 'center', minWidth: '40px' }}>
                                        <div
                                            style={{
                                                height: `${(item.count / maxSales) * 150}px`,
                                                background: '#4caf50',
                                                borderRadius: '4px 4px 0 0',
                                                marginBottom: '5px'
                                            }}
                                            title={`${item.count} vendas`}
                                        ></div>
                                        <div style={{ fontSize: '0.7rem', color: '#666' }}>{item.date}</div>
                                    </div>
                                ))}
                                {stats.salesPerMonth.length === 0 && <p style={{ color: '#888' }}>Sem dados de vendas.</p>}
                            </div>
                        </div>

                        {/* Most Requested Days */}
                        <div className="card" style={{ padding: '1.5rem', maxHeight: '300px', overflowY: 'auto' }}>
                            <h4 style={{ marginBottom: '1rem' }}>Dias Mais Solicitados (Top 5)</h4>
                            <div>
                                {stats.mostRequestedDays.map((monthData) => (
                                    <div key={monthData.month} style={{ marginBottom: '1rem' }}>
                                        <h5 style={{ borderBottom: '1px solid #eee', paddingBottom: '5px', marginBottom: '5px' }}>
                                            {monthData.month}
                                        </h5>
                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                            {monthData.days.map((d, i) => (
                                                <span key={i} style={{
                                                    background: '#e3f2fd',
                                                    color: '#1565c0',
                                                    padding: '2px 8px',
                                                    borderRadius: '12px',
                                                    fontSize: '0.8rem'
                                                }}>
                                                    Dia {d.day}: <strong>{d.count}</strong>
                                                </span>
                                            ))}
                                            {monthData.days.length === 0 && <small style={{ color: '#aaa' }}>Sem dados</small>}
                                        </div>
                                    </div>
                                ))}
                                {stats.mostRequestedDays.length === 0 && <p style={{ color: '#888' }}>Sem dados de frequencia.</p>}
                            </div>
                        </div>
                    </div>
                )}


                <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h4>Todas as Reservas</h4>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <select
                                value={filterStatus}
                                onChange={e => setFilterStatus(e.target.value)}
                                style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                            >
                                <option value="">Status: Todos</option>
                                <option value="PENDING">Pendentes</option>
                                <option value="CONFIRMED">Confirmados</option>
                                <option value="CANCELLED">Cancelados</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                            <thead>
                                <tr style={{ background: '#f5f5f5', textAlign: 'left', borderBottom: '2px solid #ddd' }}>
                                    <th style={{ padding: '1rem' }}>Data Solicitação</th>
                                    <th style={{ padding: '1rem' }}>Cliente</th>
                                    <th style={{ padding: '1rem' }}>Resort</th>
                                    <th style={{ padding: '1rem' }}>Período</th>
                                    <th style={{ padding: '1rem' }}>Valores</th>
                                    <th style={{ padding: '1rem' }}>Status</th>
                                    <th style={{ padding: '1rem' }}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={7} style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</td></tr>
                                ) : reservations.length === 0 ? (
                                    <tr><td colSpan={7} style={{ padding: '2rem', textAlign: 'center' }}>Nenhuma reserva encontrada.</td></tr>
                                ) : (
                                    reservations.map(res => (
                                        <tr key={res.id} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '1rem' }}>{format(new Date(res.createdAt), 'dd/MM/yy HH:mm')}</td>
                                            <td style={{ padding: '1rem' }}>
                                                <strong>{res.name}</strong><br />
                                                <a href={`mailto:${res.email}`} style={{ color: '#666' }}>{res.email}</a><br />
                                                {res.phone} <span style={{ color: '#888' }}>({res.guests} pax)</span>
                                            </td>
                                            <td style={{ padding: '1rem' }}>{res.resort.name}</td>
                                            <td style={{ padding: '1rem' }}>
                                                {format(new Date(res.startDate), 'dd/MM/yy')} <br />
                                                até <br />
                                                {format(new Date(res.endDate), 'dd/MM/yy')}
                                            </td>
                                            <td style={{ padding: '1rem', color: '#666', fontStyle: 'italic' }}>
                                                Use WhatsApp
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{
                                                    padding: '6px 10px',
                                                    borderRadius: '20px',
                                                    fontWeight: 'bold',
                                                    fontSize: '0.75rem',
                                                    color: res.status === 'CONFIRMED' ? '#1b5e20' : res.status === 'PENDING' ? '#f57f17' : '#b71c1c',
                                                    background: res.status === 'CONFIRMED' ? '#e8f5e9' : res.status === 'PENDING' ? '#fffde7' : '#ffebee',
                                                    border: `1px solid ${res.status === 'CONFIRMED' ? '#c8e6c9' : res.status === 'PENDING' ? '#fff9c4' : '#ffcdd2'}`
                                                }}>
                                                    {res.status === 'PENDING' ? 'EM NEGOCIAÇÃO' : res.status === 'CONFIRMED' ? 'CONFIRMADA' : 'CANCELADA'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
                                                    {res.status !== 'CONFIRMED' && (
                                                        <button
                                                            onClick={() => handleStatusChange(res.id, 'CONFIRMED')}
                                                            title="Confirmar Reserva"
                                                            style={{ background: '#4caf50', color: 'white', border: 'none', padding: '6px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                                                        >
                                                            Confirmar
                                                        </button>
                                                    )}
                                                    {res.status !== 'CANCELLED' && (
                                                        <button
                                                            onClick={() => handleStatusChange(res.id, 'CANCELLED')}
                                                            title="Cancelar Reserva"
                                                            style={{ background: '#ef5350', color: 'white', border: 'none', padding: '6px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                                                        >
                                                            Cancelar
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
