
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface PromotionFormProps {
    initialData?: {
        id?: string
        title: string
        price: string
        duration: string
        hotel: string
        peopleCount: string
        flightInfo?: string
        serviceInfo?: string
        description?: string
        imageUrl: string
        breakfast: boolean
        lunch: boolean
        dinner: boolean
    }
}

export default function PromotionForm({ initialData }: PromotionFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        price: initialData?.price || '',
        duration: initialData?.duration || '',
        hotel: initialData?.hotel || '',
        peopleCount: initialData?.peopleCount || '',
        flightInfo: initialData?.flightInfo || '',
        serviceInfo: initialData?.serviceInfo || '',
        description: initialData?.description || '',
        imageUrl: initialData?.imageUrl || '',
        breakfast: initialData?.breakfast || false,
        lunch: initialData?.lunch || false,
        dinner: initialData?.dinner || false,
    })

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return

        setLoading(true)
        const file = e.target.files[0]
        const data = new FormData()
        data.append('file', file)

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: data
            })
            const json = await res.json()

            if (json.url) {
                setFormData({ ...formData, imageUrl: json.url })
            } else {
                alert('Erro ao enviar imagem')
            }
        } catch (error) {
            console.error(error)
            alert('Erro ao enviar imagem')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const url = initialData?.id ? `/api/promotions/${initialData.id}` : '/api/promotions'
            const method = initialData?.id ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                router.push('/admin/promotions')
                router.refresh()
            } else {
                const err = await res.json()
                alert(`Erro: ${err.error}`)
            }
        } catch (error) {
            console.error(error)
            alert('Erro ao salvar promoção')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '800px', margin: '0 auto', background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <div className="grid grid-cols-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Destino (Título)</label>
                    <input
                        type="text" required
                        value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                        style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #ccc' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Preço</label>
                    <input
                        type="text" required
                        placeholder="Ex: R$ 1.200,00"
                        value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })}
                        style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #ccc' }}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Duração</label>
                    <input
                        type="text" required
                        placeholder="Ex: 7 Dias"
                        value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })}
                        style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #ccc' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Hotel</label>
                    <input
                        type="text" required
                        placeholder="Nome do Hotel"
                        value={formData.hotel} onChange={e => setFormData({ ...formData, hotel: e.target.value })}
                        style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #ccc' }}
                    />
                </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Refeições Inclusas</label>
                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input type="checkbox" checked={formData.breakfast} onChange={e => setFormData({ ...formData, breakfast: e.target.checked })} />
                        Café da Manhã
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input type="checkbox" checked={formData.lunch} onChange={e => setFormData({ ...formData, lunch: e.target.checked })} />
                        Almoço
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input type="checkbox" checked={formData.dinner} onChange={e => setFormData({ ...formData, dinner: e.target.checked })} />
                        Jantar
                    </label>
                </div>
            </div>

            <div className="grid grid-cols-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Informações do Aéreo</label>
                    <input
                        type="text"
                        placeholder="Cia Aérea, Horários, etc."
                        value={formData.flightInfo} onChange={e => setFormData({ ...formData, flightInfo: e.target.value })}
                        style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #ccc' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Informações de Serviços</label>
                    <input
                        type="text"
                        placeholder="Passeios, Transfers, etc."
                        value={formData.serviceInfo} onChange={e => setFormData({ ...formData, serviceInfo: e.target.value })}
                        style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #ccc' }}
                    />
                </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Quantidade de Pessoas</label>
                <input
                    type="text" required
                    placeholder="Ex: 2 Pessoas"
                    value={formData.peopleCount} onChange={e => setFormData({ ...formData, peopleCount: e.target.value })}
                    style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #ccc' }}
                />
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Descrição</label>
                <textarea
                    value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                    style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #ccc', minHeight: '100px' }}
                />
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Imagem</label>
                <input type="file" onChange={handleImageUpload} accept="image/*" />
                {formData.imageUrl && (
                    <div style={{ marginTop: '1rem', position: 'relative', width: '100%', height: '200px' }}>
                        <Image src={formData.imageUrl} alt="Capa" fill style={{ objectFit: 'cover', borderRadius: '8px' }} />
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', flexWrap: 'wrap' }}>
                <button type="button" onClick={() => router.back()} className="btn btn-secondary">Cancelar</button>
                <button type="submit" disabled={loading} className="btn btn-primary">
                    {loading ? 'Salvando...' : 'Salvar'}
                </button>
            </div>
        </form>
    )
}
