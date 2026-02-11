
'use client'

import { useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, isBefore, isAfter, isSameDay, isWithinInterval, startOfToday, addDays, differenceInCalendarDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// We don't need reservation status from props for blocking anymore, 
// strictly for high season/holiday logic.
interface CalendarSystemProps {
    resortId: string
    reservations: any[] // Kept for interface compatibility but ignored for blocking
}

type DayType = 'disabled' | 'highSeason' | 'holiday' | 'available'

export default function CalendarSystem({ resortId }: CalendarSystemProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [selection, setSelection] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null })
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', guests: 1, notes: '' })
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

    // Configuration
    const today = startOfToday()

    const isHighSeason = (date: Date) => {
        const month = date.getMonth()
        // Jan(0), Feb(1), Jul(6), Dec(11)
        return [0, 1, 6, 11].includes(month)
    }

    const isHoliday = (date: Date) => {
        const d = date.getDate()
        const m = date.getMonth() // 0-indexed

        // Fixed holidays (Day-MonthIndex)
        // 1/1, 21/4, 1/5, 7/9, 12/10, 2/11, 15/11, 25/12
        const holidays = [
            "1-0", "21-3", "1-4", "7-8", "12-9", "2-10", "15-10", "25-11"
        ]
        // Add specific variable dates for 2026/2027 if needed, keeping simple for now
        return holidays.includes(`${d}-${m}`)
    }

    const getDayType = (date: Date): DayType => {
        if (isBefore(date, addDays(today, 1))) return 'disabled'
        if (isHoliday(date)) return 'holiday'
        if (isHighSeason(date)) return 'highSeason'
        return 'available'
    }

    const handleDateClick = (date: Date) => {
        const type = getDayType(date)
        if (type === 'disabled') return

        if (!selection.start || (selection.start && selection.end)) {
            // Start new selection
            setSelection({ start: date, end: null })
            setShowForm(false)
        } else {
            // Complete selection
            let start = selection.start
            let end = date
            if (isBefore(end, start)) {
                [start, end] = [end, start]
            }

            // Min days validation
            const range = eachDayOfInterval({ start, end })
            const hasHighDemand = range.some(d => isHighSeason(d) || isHoliday(d))
            const dayCount = differenceInCalendarDays(end, start) + 1 // Inclusive count

            if (hasHighDemand && dayCount < 3) {
                alert('Em períodos de Alta Temporada ou Feriados, o mínimo de estadia é de 3 dias.')
                // Keep start, reset end
                return
            }

            setSelection({ start, end })
            setShowForm(true)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selection.start || !selection.end) return

        setSubmitStatus('loading')

        try {
            const res = await fetch('/api/reservations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    resortId,
                    startDate: selection.start,
                    endDate: selection.end,
                    ...formData,
                }),
            })

            if (!res.ok) throw new Error('Failed to submit')

            setSubmitStatus('success')
            setSelection({ start: null, end: null })
            setShowForm(false)
            setFormData({ name: '', email: '', phone: '', guests: 1, notes: '' })
        } catch (error) {
            console.error(error)
            setSubmitStatus('error')
        }
    }

    const renderMonth = (month: Date) => {
        const start = startOfMonth(month)
        const end = endOfMonth(month)
        const days = eachDayOfInterval({ start, end })
        const startDayOfWeek = getDay(start) // 0 is Sunday

        return (
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <button onClick={() => setCurrentMonth(addMonths(currentMonth, -1))} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', padding: '0 10px' }}>&lsaquo;</button>
                    <h3 style={{ textTransform: 'capitalize', margin: 0 }}>{format(month, 'MMMM yyyy', { locale: ptBR })}</h3>
                    <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', padding: '0 10px' }}>&rsaquo;</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px' }}>
                    {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => (
                        <div key={d} style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '0.9rem', color: '#666', paddingBottom: '0.5rem' }}>{d}</div>
                    ))}

                    {Array.from({ length: startDayOfWeek }).map((_, i) => <div key={`empty-${i}`} />)}

                    {days.map(day => {
                        const type = getDayType(day)
                        const isSelected = selection.start && selection.end
                            ? isWithinInterval(day, { start: selection.start, end: selection.end })
                            : selection.start && isSameDay(day, selection.start)

                        let bg = '#f5f5f5'
                        let color = '#333'
                        let cursor = 'pointer'
                        let border = 'none'

                        if (type === 'disabled') {
                            bg = '#eee';
                            color = '#ccc';
                            cursor = 'not-allowed';
                        } else if (type === 'holiday') {
                            bg = '#e1bee7'; // Purple-ish
                            color = '#4a148c';
                        } else if (type === 'highSeason') {
                            bg = '#fff9c4'; // Yellow
                            color = '#f57f17';
                        } else {
                            // Available standard
                            bg = '#e8f5e9';
                            color = '#1b5e20';
                        }

                        if (isSelected) {
                            bg = '#e33537';
                            color = 'white';
                        }

                        // Start date indicator style if only start selected
                        if (selection.start && isSameDay(day, selection.start) && !selection.end) {
                            bg = '#e33537';
                            color = 'white';
                        }

                        return (
                            <div
                                key={day.toISOString()}
                                onClick={() => handleDateClick(day)}
                                style={{
                                    background: bg,
                                    color: color,
                                    padding: '10px 0',
                                    textAlign: 'center',
                                    cursor: cursor,
                                    borderRadius: '4px',
                                    fontSize: '0.9rem',
                                    fontWeight: isSelected || type === 'holiday' ? 'bold' : 'normal',
                                    border: border,
                                    position: 'relative'
                                }}
                                title={type === 'holiday' ? 'Feriado' : type === 'highSeason' ? 'Alta Temporada' : 'Disponível'}
                            >
                                {format(day, 'd')}
                                {type === 'holiday' && !isSelected && <div style={{ position: 'absolute', bottom: '2px', left: '50%', transform: 'translateX(-50%)', width: '4px', height: '4px', background: '#4a148c', borderRadius: '50%' }}></div>}
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }

    if (submitStatus === 'success') {
        return (
            <div style={{ textAlign: 'center', padding: '2rem', background: '#d4edda', color: '#155724', borderRadius: '12px' }}>
                <h3 style={{ marginBottom: '1rem', color: '#155724' }}>Solicitação Enviada!</h3>
                <p>Recebemos seu pedido de orçamento. Em breve nossa equipe entrará em contato com os valores.</p>
                <div style={{ marginTop: '2rem' }}>
                    <button onClick={() => setSubmitStatus('idle')} className="btn btn-primary">Fazer nova cotação</button>
                </div>
            </div>
        )
    }

    return (
        <div>
            {renderMonth(currentMonth)}

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', fontSize: '0.75rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: 12, height: 12, background: '#e8f5e9', borderRadius: '2px' }}></span> Normal</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: 12, height: 12, background: '#fff9c4', borderRadius: '2px' }}></span> Alta Temporada</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: 12, height: 12, background: '#e1bee7', borderRadius: '2px' }}></span> Feriado</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: 12, height: 12, background: '#eee', borderRadius: '2px' }}></span> Indisponível</div>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="animate-fade-in" style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '12px', border: '1px solid #eee' }}>
                    <h4 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Dados para Orçamento</h4>
                    <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#666', marginBottom: '1.5rem' }}>
                        Período: <strong>{format(selection.start!, 'dd/MM/yyyy')}</strong> até <strong>{format(selection.end!, 'dd/MM/yyyy')}</strong>
                        <br />
                        ({differenceInCalendarDays(selection.end!, selection.start!) + 1} diárias)
                    </p>

                    <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: '#666' }}>Nome Completo</label>
                            <input
                                type="text" required
                                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: '#666' }}>E-mail</label>
                            <input
                                type="email" required
                                value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: '#666' }}>Telefone / WhatsApp</label>
                            <input
                                type="tel" required
                                value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: '#666' }}>Qtd. Pessoas</label>
                            <input
                                type="number" min="1" required
                                value={formData.guests} onChange={e => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: '#666' }}>Observações</label>
                        <textarea
                            placeholder="Alguma necessidade especial?"
                            value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })}
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', minHeight: '80px' }}
                        />
                    </div>

                    <button type="submit" disabled={submitStatus === 'loading'} className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', borderRadius: '8px' }}>
                        {submitStatus === 'loading' ? 'Enviando...' : 'Solicitar Orçamento'}
                    </button>
                </form>
            )}
        </div>
    )
}
