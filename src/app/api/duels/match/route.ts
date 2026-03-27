import { NextRequest, NextResponse } from 'next/server'
import { resolveDuel, generateOpponentCard } from '@/lib/duels'
import { prisma } from '@/lib/prisma'

/**
 * Simulador de Matchmaking y Resolución de Duelos.
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { playerCard } = body

        if (!playerCard) {
            return NextResponse.json({ error: 'Missing playerCard' }, { status: 400 })
        }

        // 1. Simular búsqueda de oponente (delay de 2s en el cliente)
        const opponentCard = generateOpponentCard()

        // 2. Resolver duelo usando el motor de lib/duels
        const result = await resolveDuel(playerCard, opponentCard)

        // 3. Devolver resultado junto con la carta del oponente para la UI
        return NextResponse.json({
            success: true,
            opponent: opponentCard,
            battleResult: result
        })

    } catch (error: any) {
        console.error('Duel API Error:', error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
