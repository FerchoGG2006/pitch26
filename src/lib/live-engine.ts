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

    const result: LiveSimulationResult = {
        playerId,
        playerName: player.name,
        event: eventType,
        delta,
        newRating: 0 // Se delegará al cliente o se sacará de la DB si es necesario
    }

    // 5. Emitir evento para el broadcaster SSE
    liveEvents.emit('update', result)

    return result
}

/**
 * Genera un "MOMENTO" especial basado en una jugada histórica.
 * Crea una carta única con ventana de reclamo de 30 minutos.
 */
export async function triggerSpecialMomento(playerId: string, matchEvent: string) {
    const player = await prisma.player.findUnique({ where: { id: playerId }})
    if (!player) throw new Error('Player not found')

    const expiry = new Date(Date.now() + 30 * 60000) // 30 minutos

    // Crear la carta maestra del Momento
    const momentoCard = await prisma.playerCard.create({
        data: {
            playerId: player.id,
            tier: 'MOMENTO',
            rating: 95, // Rating base alto para momentos
            isMomento: true,
            momentoExpiry: expiry,
            momentoMatch: matchEvent,
            lastEvent: 'SPECIAL_GOAL'
        }
    })

    const eventData = {
        type: 'MOMENTO_SPAWNED',
        card: {
            ...momentoCard,
            playerName: player.name,
            nationality: player.nationality,
            flag: player.flag,
            position: player.position
        }
    }

    // Notificar a todos los clientes vía SSE
    liveEvents.emit('momento', eventData)

    return eventData
}
