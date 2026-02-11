
'use client'

import ResortForm from '@/components/ResortForm'

export default function NewResortPage() {
    return (
        <div style={{ background: '#f5f5f5', minHeight: '100vh', padding: '2rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>Adicionar Novo Resort</h1>
            <ResortForm />
        </div>
    )
}
