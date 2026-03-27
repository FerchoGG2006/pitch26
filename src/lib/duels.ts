import { prisma } from './prisma'
import { PlayerCardType } from '@/components/cards/PlayerCard'

export interface DuelStatComparison {
    stat: string;
    playerValue: number;
    opponentValue: number;
    winner: 'PLAYER' | 'OPPONENT' | 'DRAW';
}

export interface DuelResult {
    success: boolean;
    winnerId: string | 'DRAW';
    score: [number, number]; // [Player, Opponent]
    comparisons: DuelStatComparison[];
    rewards: {
        xp: number;
        coins: number;
    };
}

const STAT_KEYS = ['rit', 'tir', 'vis', 'dri', 'pas', 'fis'] as const;

/**
 * Resuelve un duelo 1v1 entre dos cartas.
 * Elige 3 estadísticas aleatorias y compara los valores.
 */
export async function resolveDuel(playerCard: PlayerCardType, opponentCard: PlayerCardType): Promise<DuelResult> {
    const comparisons: DuelStatComparison[] = []
    let playerScore = 0
    let opponentScore = 0

    // Seleccionar 3 estadísticas únicas al azar
    const selectedStats = [...STAT_KEYS].sort(() => 0.5 - Math.random()).slice(0, 3)

    for (const statKey of selectedStats) {
        // @ts-ignore
        const pVal = playerCard.stats[statKey] || 0
        // @ts-ignore
        const oVal = opponentCard.stats[statKey] || 0

        let winner: 'PLAYER' | 'OPPONENT' | 'DRAW' = 'DRAW'
        if (pVal > oVal) {
            winner = 'PLAYER'
            playerScore++
        } else if (oVal > pVal) {
            winner = 'OPPONENT'
            opponentScore++
        }

        comparisons.push({
            stat: statKey.toUpperCase(),
            playerValue: pVal,
            opponentValue: oVal,
            winner
        })
    }

    // Determinar ganador final
    let winnerId: string | 'DRAW' = 'DRAW'
    if (playerScore > opponentScore) winnerId = playerCard.id
    if (opponentScore > playerScore) winnerId = 'OPPONENT_ID' // Placeholder

    // Calcular Recompensas
    const rewards = {
        xp: playerScore > opponentScore ? 100 : (playerScore === opponentScore ? 50 : 25),
        coins: playerScore > opponentScore ? 50 : 10
    }

    // Persistir resultado (Simulado por ahora para no romper si no hay usuario logueado en el test)
    try {
        const user = await prisma.user.findFirst()
        if (user) {
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    xp: { increment: rewards.xp },
                    coins: { increment: rewards.coins }
                }
            })
        }
    } catch (e) {
        console.error('Failed to update user rewards:', e)
    }

    return {
        success: true,
        winnerId,
        score: [playerScore, opponentScore],
        comparisons,
        rewards
    }
}

/**
 * Genera un oponente aleatorio para el matchmaking.
 */
export function generateOpponentCard(): PlayerCardType {
    const names = ['HAALAND', 'VINICIUS', 'KANE', 'SALAH', 'DE BRUYNE', 'BELLINGHAM']
    const name = names[Math.floor(Math.random() * names.length)]
    
    return {
        id: `opp-${Math.random().toString(36).substr(2, 9)}`,
        playerId: 'opp-p',
        playerName: name,
        position: 'FWD',
        nationality: 'World',
        flag: '🌍',
        tier: Math.random() > 0.7 ? 'ELITE' : 'BASE',
        rating: 85 + Math.floor(Math.random() * 12),
        stats: {
            rit: 80 + Math.floor(Math.random() * 19),
            tir: 80 + Math.floor(Math.random() * 19),
            vis: 75 + Math.floor(Math.random() * 20),
            dri: 82 + Math.floor(Math.random() * 16),
            pas: 78 + Math.floor(Math.random() * 18),
            fis: 70 + Math.floor(Math.random() * 25)
        },
        evolution: { deltaToday: 0, deltaTournament: 0, lastEvent: 'BUSCANDO...' }
    }
}
