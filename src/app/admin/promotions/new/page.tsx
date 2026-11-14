
'use client'

import PromotionForm from '@/components/PromotionForm'

export default function NewPromotionPage() {
    return (
        <div style={{ background: '#f5f5f5', minHeight: '100vh', padding: '2rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>Adicionar Promoção</h1>
            <PromotionForm />
        </div>
    )
}
