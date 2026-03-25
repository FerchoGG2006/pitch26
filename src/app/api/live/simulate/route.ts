import { simulateMatchEvent, triggerSpecialMomento } from '@/lib/live-engine'
import { MatchEventType } from '@/lib/ratings'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Admin Endpoint para simular eventos en tiempo real.
 * En producción esto estaría protegido por un API Key o Auth.
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { playerId, eventType } = body

        if (!playerId || !eventType) {
            return NextResponse.json({ error: 'Missing playerId or eventType' }, { status: 400 })
        }

        let result;
        if (eventType === 'MOMENTO') {
            result = await triggerSpecialMomento(playerId, '¡GOL AL MINUTO 120 DE LA FINAL!')
        } else {
            result = await simulateMatchEvent(playerId, eventType as MatchEventType)
        }

        return NextResponse.json({ 
            success: true, 
            message: `Event ${eventType} simulated for ${playerId}`,
            result 
        })
    } catch (error: any) {
        console.error('Simulation error:', error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
