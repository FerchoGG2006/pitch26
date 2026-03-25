'use client'

import { useEffect, useState } from 'react'

export interface LiveUpdate {
    playerId: string;
    playerName: string;
    event: string;
    delta: number;
    newRating: number;
}

/**
 * Hook para suscribirse a las actualizaciones de rating en tiempo real (SSE).
 */
export function useLiveUpdates() {
    const [lastUpdate, setLastUpdate] = useState<LiveUpdate | null>(null)

    useEffect(() => {
        // Conectar al endpoint de SSE
        const eventSource = new EventSource('/api/live/updates')

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data)
                console.log('⚽ Live Update Received:', data)
                setLastUpdate(data)
            } catch (err) {
                console.error('Error parsing SSE message:', err)
            }
        }

        eventSource.onerror = (err) => {
            console.error('SSE Connection Error:', err)
            // EventSource reconectará automáticamente por defecto
        }

        return () => {
            eventSource.close()
        }
    }, [])

    return { lastUpdate }
}
