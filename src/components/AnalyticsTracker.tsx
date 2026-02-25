'use client'

import { useEffect, useState, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

function InnerTracker() {
    const pathname = usePathname()
    // Resolving useSearchParams bailout issue
    const searchParams = useSearchParams()
    const [sessionId, setSessionId] = useState<string | null>(null)

    // Check if user has consented
    useEffect(() => {
        const consent = localStorage.getItem('cookie_consent')
        if (consent === 'accepted') {
            let session = sessionStorage.getItem('analytics_session_id')
            if (!session) {
                session = crypto.randomUUID()
                sessionStorage.setItem('analytics_session_id', session)
            }
            setSessionId(session)
        }
    }, [])

    // Track Pageview and Time on Page
    useEffect(() => {
        if (!sessionId) return // Only track if consented
        if (pathname.startsWith('/admin')) return // Não rastrear áreas do painel administrador

        const startTime = Date.now()
        const currentPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')

        // Send Pageview
        fetch('/api/analytics', {
            method: 'POST',
            body: JSON.stringify({
                eventType: 'pageview',
                path: currentPath,
                sessionId
            })
        }).catch(console.error)

        // Send Time on Page when unmounting or navigating away
        const trackTime = () => {
            const duration = Math.floor((Date.now() - startTime) / 1000)
            if (duration > 0) {
                const data = JSON.stringify({
                    eventType: 'time_on_page',
                    path: currentPath,
                    duration,
                    sessionId
                })
                // Use beacon so it sends even when page unloads
                navigator.sendBeacon('/api/analytics', data)
            }
        }

        window.addEventListener('beforeunload', trackTime)

        return () => {
            trackTime()
            window.removeEventListener('beforeunload', trackTime)
        }
    }, [pathname, searchParams, sessionId])

    // Track Global Clicks
    useEffect(() => {
        if (!sessionId) return

        const handleGlobalClick = (e: MouseEvent) => {
            if (window.location.pathname.startsWith('/admin')) return // Evitar rastreamento de botões no Admin

            const target = e.target as HTMLElement
            // Limit to actionable items to avoid flooding the DB
            const isClickable = target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')

            if (isClickable) {
                const element = target.closest('a') || target.closest('button') || target
                const targetText = element.textContent?.trim().slice(0, 100) || element.getAttribute('aria-label') || 'Sem texto'
                const targetId = element.id || null

                fetch('/api/analytics', {
                    method: 'POST',
                    body: JSON.stringify({
                        eventType: 'click',
                        path: window.location.pathname,
                        targetId,
                        targetText,
                        sessionId
                    })
                }).catch(console.error)
            }
        }

        document.addEventListener('click', handleGlobalClick, { capture: true })

        return () => {
            document.removeEventListener('click', handleGlobalClick, { capture: true })
        }
    }, [sessionId])

    return null
}

export default function AnalyticsTracker() {
    return (
        <Suspense fallback={null}>
            <InnerTracker />
        </Suspense>
    )
}
