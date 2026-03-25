'use client'

import { useEffect, useState } from 'react'

export interface LiveUpdate {
    playerId: string;
    playerName: string;
    event: string;
    delta: number;
    newRating: number;
    type?: string; 
    card?: any; // Para eventos de tipo MOMENTO
}

/**
 * Hook para suscribirse a las actualizaciones de rating en tiempo real (SSE).
 */
export function useLiveUpdates() {
    const [lastUpdate, setLastUpdate] = useState<LiveUpdate | null>(null)
    const [activeMomento, setActiveMomento] = useState<any | null>(null)

    useEffect(() => {
        // Conectar al endpoint de SSE
        const eventSource = new EventSource('/api/live/updates')

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data)
                console.log('⚽ Live Update Received:', data)

                if (data.type === 'MOMENTO_SPAWNED') {
                    setActiveMomento(data.card)
                } else {
                    setLastUpdate(data)
                }
            } catch (err) {
                console.error('Error parsing SSE message:', err)
            }
        }

        eventSource.onerror = (err) => {
            console.error('SSE Connection Error:', err)
        }

        return () => {
            eventSource.close()
        }
    }, [])

    return { lastUpdate, activeMomento, clearMomento: () => setActiveMomento(null) }
}
