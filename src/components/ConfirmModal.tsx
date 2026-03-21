'use client'

import React from 'react'

interface ConfirmModalProps {
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
    onCancel: () => void
    confirmText?: string
    cancelText?: string
    type?: 'danger' | 'warning' | 'info'
}

export default function ConfirmModal({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    type = 'danger'
}: ConfirmModalProps) {
    if (!isOpen) return null

    const getPrimaryColor = () => {
        switch (type) {
            case 'danger': return 'var(--color-error)'
            case 'warning': return 'var(--color-warning)'
            default: return 'var(--color-primary)'
        }
    }

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '20px',
            animation: 'fadeIn 0.2s ease-out'
        }} onClick={onCancel}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '2rem',
                maxWidth: '450px',
                width: '100%',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                transform: 'scale(1)',
                animation: 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                position: 'relative'
            }} onClick={e => e.stopPropagation()}>
                <h3 style={{ 
                    marginTop: 0, 
                    color: getPrimaryColor(),
                    fontSize: '1.5rem',
                    marginBottom: '1rem'
                }}>{title}</h3>
                
                <p style={{ 
                    color: '#4B5563', 
                    fontSize: '1rem', 
                    lineHeight: '1.5',
                    marginBottom: '2rem'
                }}>{message}</p>
                
                <div style={{ 
                    display: 'flex', 
                    gap: '12px', 
                    justifyContent: 'flex-end' 
                }}>
                    <button 
                        onClick={onCancel}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '8px',
                            border: '1px solid #E5E7EB',
                            backgroundColor: 'white',
                            color: '#374151',
                            cursor: 'pointer',
                            fontWeight: '600',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={e => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                        onMouseOut={e => (e.currentTarget.style.backgroundColor = 'white')}
                    >
                        {cancelText}
                    </button>
                    <button 
                        onClick={onConfirm}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: getPrimaryColor(),
                            color: 'white',
                            cursor: 'pointer',
                            fontWeight: '600',
                            transition: 'all 0.2s',
                            boxShadow: `0 4px 6px -1px ${getPrimaryColor()}44`
                        }}
                        onMouseOver={e => (e.currentTarget.style.filter = 'brightness(0.9)')}
                        onMouseOut={e => (e.currentTarget.style.filter = 'none')}
                    >
                        {confirmText}
                    </button>
                </div>

                <style jsx>{`
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes scaleIn {
                        from { opacity: 0; transform: scale(0.95); }
                        to { opacity: 1; transform: scale(1); }
                    }
                `}</style>
            </div>
        </div>
    )
}
