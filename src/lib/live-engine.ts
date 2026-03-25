import { prisma } from './prisma'
import { redis } from './redis'
import { calculateRatingDelta, MatchEventType } from './ratings'
import { EventEmitter } from 'events'

// Emisor de eventos global para SSE en desarrollo
export const liveEvents = new EventEmitter()

export interface LiveSimulationResult {
    playerId: string;
    playerName: string;
    event: MatchEventType;
    delta: number;
    newRating: number;
}

/**
 * Simula un evento de partido para un jugador específico.
 * Actualiza el rating en caliente (Redis) y en la base de datos (Prisma).
 */
export async function simulateMatchEvent(playerId: string, eventType: MatchEventType): Promise<LiveSimulationResult> {
    // 1. Encontrar al jugador en el catálogo
    const player = await prisma.player.findUnique({
        where: { id: playerId }
    })

    if (!player) throw new Error(`Player ${playerId} not found`)

    // 2. Calcular el cambio de rating
    const delta = calculateRatingDelta({ playerId, type: eventType })

    // 3. Actualizar la base de datos (Persistencia real)
    // En PITCH 26, el rating de las cartas maestras (PlayerCard) escala con el rendimiento real.
    const updatedCards = await prisma.playerCard.updateMany({
        where: { playerId: playerId },
        data: {
            rating: { increment: delta },
            deltaToday: { increment: delta },
            lastEvent: eventType
        }
    })

    // 4. Actualizar Hot Cache (Redis) para acceso ultra-rápido en tiempo real
    const currentHotRating = await redis.hget(`hot_ratings:${playerId}`, 'delta') || 0
    const newHotDelta = Number(currentHotRating) + delta
    
    await redis.hset(`hot_ratings:${playerId}`, {
        delta: newHotDelta,
        lastEvent: eventType,
        timestamp: Date.now()
    })

    const result = {
        playerId,
        playerName: player.name,
        event: eventType,
        delta,
        newRating: player.baseRating + newHotDelta // Simplificado para simulación
    }

    // 5. Emitir evento para el broadcaster SSE
    liveEvents.emit('update', result)

    return result
}
