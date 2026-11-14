'use client'

import ParkForm from '@/components/ParkForm'

export default function NewParkPage() {
    return (
        <div style={{ background: '#f5f5f5', minHeight: '100vh', padding: '2rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>Adicionar Novo Parque</h1>
            <ParkForm />
        </div>
    )
}
