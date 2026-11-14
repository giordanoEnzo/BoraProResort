
'use client'

import { useState, useEffect, useCallback } from 'react'
import { format, isToday } from 'date-fns'
import Link from 'next/link'
import ConfirmModal from '@/components/ConfirmModal'

interface Reservation {
// ... existing interface ...
    id: string
    name: string
    email: string
    phone: string
    startDate: string
    endDate: string
    guests: number
    adults: number
    children: number
    babies: number
    boardType: string | null
    parkTickets: boolean
    parkName: string | null
    parkAdults: number
    parkChildren: number
    parkBabies: number
    guestBirthDates: string | null
    parkGuestBirthDates: string | null
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
    const [filterResort] = useState('')
    const [filterStatus, setFilterStatus] = useState('')
    const [filterDateStart, setFilterDateStart] = useState('')
    const [filterDateEnd, setFilterDateEnd] = useState('')
    const [loading, setLoading] = useState(true)

    // Modal state
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        type: 'danger' | 'warning' | 'info';
        confirmText?: string;
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {},
        type: 'danger'
    });

    const fetchReservations = useCallback(async () => {
        setLoading(true)
        let url = '/api/reservations'
        const params = new URLSearchParams()
        if (filterResort) params.append('resortId', filterResort)
        if (filterStatus) params.append('status', filterStatus)
        if (filterDateStart) params.append('createdAtStart', filterDateStart)
        if (filterDateEnd) params.append('createdAtEnd', filterDateEnd)
        if (params.toString()) url += `?${params.toString()}`

        try {
            const res = await fetch(url)
            const data = await res.json()
            setReservations(data)
        } catch (error) {
            console.error(error)
        }
        setLoading(false)
    }, [filterResort, filterStatus, filterDateStart, filterDateEnd])

    const fetchStats = useCallback(async () => {
        try {
            const res = await fetch('/api/dashboard/stats')
            const data = await res.json()
            setStats(data)
        } catch (error) {
            console.error(error)
        }
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchReservations()
            fetchStats()
        }, 0)
        return () => clearTimeout(timer)
    }, [fetchReservations, fetchStats])

    const handleStatusChange = (id: string, newStatus: string) => {
        setModalConfig({
            isOpen: true,
            title: 'Alterar Status',
            message: `Deseja realmente alterar o status desta reserva para ${newStatus === 'CONFIRMED' ? 'Confirmada' : 'Cancelada'}?`,
            type: 'info',
            confirmText: 'Alterar',
            onConfirm: () => performStatusUpdate(id, newStatus)
        })
    }

    const performStatusUpdate = async (id: string, newStatus: string) => {
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
                fetchStats()
            } else {
                const err = await res.json()
                alert(`Erro: ${err.error}`)
            }
        } catch (error) {
            console.error(error)
            alert("Erro ao atualizar status.")
        } finally {
            setModalConfig(prev => ({ ...prev, isOpen: false }))
        }
    }

    const handleDelete = (id: string) => {
        setModalConfig({
            isOpen: true,
            title: 'Apagar Reserva',
            message: 'Você tem ABSOLUTA certeza que deseja apagar esta reserva permanentemente? Esta ação não pode ser desfeita.',
            type: 'danger',
            confirmText: 'Apagar',
            onConfirm: () => performDelete(id)
        })
    }

    const performDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/reservations/${id}`, {
                method: 'DELETE',
            })

            if (res.ok) {
                fetchReservations()
                fetchStats()
            } else {
                const err = await res.json()
                alert(`Erro: ${err.error}`)
            }
        } catch (error) {
            console.error(error)
            alert("Erro ao apagar reserva.")
        } finally {
            setModalConfig(prev => ({ ...prev, isOpen: false }))
        }
    }

    const maxSales = stats?.salesPerMonth?.reduce((acc, curr) => Math.max(acc, curr.count), 0) || 1

    const renderBirthDates = (jsonStr: string | null) => {
        if (!jsonStr) return null
        try {
            const data = JSON.parse(jsonStr)
            const hasAdults = data.adults?.some((d: string) => d)
            const hasChildren = data.children?.some((d: string) => d)
            const hasBabies = data.babies?.some((d: string) => d)

            if (!hasAdults && !hasChildren && !hasBabies) return null

            return (
                <div style={{ marginTop: '5px', padding: '4px 8px', background: '#f0f0f0', borderRadius: '4px', fontSize: '0.75rem' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '2px', borderBottom: '1px solid #ddd' }}>Nascimentos:</div>
                    {data.adults?.filter((d: string) => d).map((d: string, i: number) => (
                        <div key={`ad-${i}`}>Ad {i+1}: {format(new Date(d + 'T00:00:00'), 'dd/MM/yyyy')}</div>
                    ))}
                    {data.children?.filter((d: string) => d).map((d: string, i: number) => (
                        <div key={`cr-${i}`}>Cr {i+1}: {format(new Date(d + 'T00:00:00'), 'dd/MM/yyyy')}</div>
                    ))}
                    {data.babies?.filter((d: string) => d).map((d: string, i: number) => (
                        <div key={`bb-${i}`}>Bb {i+1}: {format(new Date(d + 'T00:00:00'), 'dd/MM/yyyy')}</div>
                    ))}
                </div>
            )
        } catch (e) {
            return null
        }
    }

    return (
        <div className="section" style={{ background: '#f5f5f5', minHeight: '100vh' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Painel Administrativo</h2>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <Link href="/admin/analytics" className="btn btn-secondary" style={{ background: '#e1bee7', color: '#4a148c', flexGrow: 1, textAlign: 'center' }}>Sensores</Link>
                        <Link href="/admin/promotions" className="btn btn-secondary" style={{ background: '#fbc02d', flexGrow: 1, textAlign: 'center' }}>Gerenciar Promoções</Link>
                        <Link href="/admin/testimonials" className="btn btn-secondary" style={{ background: '#ffccbc', color: '#bf360c', flexGrow: 1, textAlign: 'center' }}>Gerenciar Depoimentos</Link>
                        <Link href="/admin/parks" className="btn btn-secondary" style={{ background: '#81c784', flexGrow: 1, textAlign: 'center' }}>Gerenciar Parques</Link>
                        <Link href="/admin/resorts" className="btn btn-primary" style={{ flexGrow: 1, textAlign: 'center' }}>Gerenciar Resorts</Link>
                        <Link href="/" className="btn btn-secondary" style={{ flexGrow: 1, textAlign: 'center' }}>Voltar ao Site</Link>
                    </div>
                </div>

                {/* KPI Cards */}
                {stats && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                        <div className="card" style={{ padding: '1.5rem', borderLeft: '5px solid #fbc02d' }}>
                            <h4 style={{ color: '#666', marginBottom: '0.5rem', fontSize: '1rem' }}>Em Negociação</h4>
                            <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{stats.kpi.pending}</div>
                            <small>Reservas Pendentes</small>
                        </div>
                        <div className="card" style={{ padding: '1.5rem', borderLeft: '5px solid #2e7d32' }}>
                            <h4 style={{ color: '#666', marginBottom: '0.5rem', fontSize: '1rem' }}>Confirmadas</h4>
                            <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{stats.kpi.confirmed}</div>
                            <small>Vendas Completas</small>
                        </div>
                        <div className="card" style={{ padding: '1.5rem', borderLeft: '5px solid #1565c0' }}>
                            <h4 style={{ color: '#666', marginBottom: '0.5rem', fontSize: '1rem' }}>Este Mês</h4>
                            <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{stats.kpi.closedThisMonth}</div>
                            <small>Performance Mensal</small>
                        </div>
                    </div>
                )}

                {/* Charts Section */}
                {stats && (
                    <div className="grid-responsive" style={{ marginBottom: '2rem' }}>
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '10px' }}>
                        <h4>Todas as Reservas</h4>
                        <div style={{ display: 'flex', gap: '1rem', width: '100%', flexWrap: 'wrap' }}>
                            <input
                                type="date"
                                title="Data de Início da Solicitação"
                                value={filterDateStart}
                                onChange={e => setFilterDateStart(e.target.value)}
                                style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                            <input
                                type="date"
                                title="Data de Término da Solicitação"
                                value={filterDateEnd}
                                onChange={e => setFilterDateEnd(e.target.value)}
                                style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                            <select
                                value={filterStatus}
                                onChange={e => setFilterStatus(e.target.value)}
                                style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', flexGrow: 1 }}
                            >
                                <option value="">Status: Todos</option>
                                <option value="PENDING">Pendentes</option>
                                <option value="CONFIRMED">Confirmados</option>
                                <option value="CANCELLED">Cancelados</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                        <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
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
                                        <tr key={res.id} style={{ borderBottom: '1px solid #eee', background: isToday(new Date(res.createdAt)) ? '#e1f5fe' : 'transparent' }}>
                                            <td style={{ padding: '1rem' }}>{format(new Date(res.createdAt), 'dd/MM/yy HH:mm')}</td>
                                            <td style={{ padding: '1rem' }}>
                                                <strong>{res.name}</strong><br />
                                                <a href={`mailto:${res.email}`} style={{ color: '#666' }}>{res.email}</a><br />
                                                {res.phone}
                                                {renderBirthDates(res.guestBirthDates)}
                                                <div style={{ color: '#888', fontSize: '0.8rem', marginTop: '4px' }}>
                                                    {res.adults} Ad, {res.children} Cr, {res.babies} Bb<br />
                                                    <strong>{res.boardType ? `${res.boardType}` : 'Sem pensao'}</strong>
                                                    {res.parkTickets && (
                                                        <div style={{ marginTop: '4px', color: '#1565c0' }}>
                                                            Parque: <strong>{res.parkName}</strong> ({res.parkAdults} Ad, {res.parkChildren} Cr, {res.parkBabies} Bb)
                                                            {renderBirthDates(res.parkGuestBirthDates)}
                                                        </div>
                                                    )}
                                                </div>
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
                                                    <button
                                                        onClick={() => handleDelete(res.id)}
                                                        title="Apagar reserva"
                                                        style={{ background: '#d32f2f', color: 'white', border: 'none', padding: '6px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', marginTop: '4px' }}
                                                    >
                                                        Apagar
                                                    </button>
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

            <ConfirmModal 
                isOpen={modalConfig.isOpen}
                title={modalConfig.title}
                message={modalConfig.message}
                onConfirm={modalConfig.onConfirm}
                onCancel={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                type={modalConfig.type}
                confirmText={modalConfig.confirmText}
                cancelText="Voltar"
            />
        </div>
    )
}
