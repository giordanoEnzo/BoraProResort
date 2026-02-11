
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface ResortFormProps {
    initialData?: {
        id?: string
        name: string
        city: string
        slug: string
        description: string
        imageUrl: string
        images: { url: string }[]
    }
}

export default function ResortForm({ initialData }: ResortFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        city: initialData?.city || '',
        slug: initialData?.slug || '',
        description: initialData?.description || '',
        imageUrl: initialData?.imageUrl || '',
    })
    const [gallery, setGallery] = useState<string[]>(initialData?.images?.map(i => i.url) || [])

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isMain: boolean) => {
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
                if (isMain) {
                    setFormData({ ...formData, imageUrl: json.url })
                } else {
                    setGallery([...gallery, json.url])
                }
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

    const removeGalleryImage = (index: number) => {
        setGallery(gallery.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const payload = {
            ...formData,
            images: gallery
        }

        try {
            const url = initialData?.id ? `/api/resorts/${initialData.id}` : '/api/resorts'
            const method = initialData?.id ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (res.ok) {
                router.push('/admin/resorts')
                router.refresh()
            } else {
                const err = await res.json()
                alert(`Erro: ${err.error}`)
            }
        } catch (error) {
            console.error(error)
            alert('Erro ao salvar resort')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '800px', margin: '0 auto', background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <div className="grid grid-cols-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Nome do Resort</label>
                    <input
                        type="text" required
                        value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                        style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #ccc' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Cidade</label>
                    <input
                        type="text" required
                        value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })}
                        style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #ccc' }}
                    />
                </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Slug (URL Amigável)</label>
                <input
                    type="text" required
                    value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })}
                    style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #ccc' }}
                />
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Descrição Completa</label>
                <textarea
                    required
                    value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                    style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #ccc', minHeight: '150px' }}
                />
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Imagem Principal (Capa)</label>
                <input type="file" onChange={e => handleImageUpload(e, true)} accept="image/*" />
                {formData.imageUrl && (
                    <div style={{ marginTop: '1rem', position: 'relative', width: '100%', height: '200px' }}>
                        <Image src={formData.imageUrl} alt="Capa" fill style={{ objectFit: 'cover', borderRadius: '8px' }} />
                    </div>
                )}
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Galeria de Fotos (Carrossel)</label>
                <input type="file" onChange={e => handleImageUpload(e, false)} accept="image/*" />
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                    {gallery.map((url, i) => (
                        <div key={i} style={{ position: 'relative', width: '100px', height: '100px' }}>
                            <Image src={url} alt={`Gallery ${i}`} fill style={{ objectFit: 'cover', borderRadius: '8px' }} />
                            <button
                                type="button"
                                onClick={() => removeGalleryImage(i)}
                                style={{ position: 'absolute', top: -10, right: -10, background: 'red', color: 'white', borderRadius: '50%', width: '24px', height: '24px', border: 'none', cursor: 'pointer' }}
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" onClick={() => router.back()} className="btn btn-secondary">Cancelar</button>
                <button type="submit" disabled={loading} className="btn btn-primary">
                    {loading ? 'Salvando...' : 'Salvar Resort'}
                </button>
            </div>
        </form>
    )
}
