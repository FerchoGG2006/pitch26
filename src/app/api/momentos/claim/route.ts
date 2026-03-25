import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Endpoint para reclamar un MOMENTO activo.
 * Valida la ventana de 30 minutos y previene duplicados.
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { cardId } = body

        if (!cardId) {
            return NextResponse.json({ error: 'Missing cardId' }, { status: 400 })
        }

        // 1. Verificar que la carta Momento existe y es válida
        const card = await prisma.playerCard.findUnique({
            where: { id: cardId }
        })

        if (!card || !card.isMomento) {
            return NextResponse.json({ error: 'Invalid Momento card' }, { status: 404 })
        }

        // 2. Validar ventana de tiempo (30 min)
        if (card.momentoExpiry && new Date() > card.momentoExpiry) {
            return NextResponse.json({ error: 'Momento has expired' }, { status: 410 })
        }

        // 3. Obtener usuario (Mock: Usamos el primero hasta integrar NextAuth completo)
        const user = await prisma.user.findFirst()
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // 4. Verificar si ya la tiene
        const existing = await prisma.userCard.findUnique({
            where: {
                userId_cardId: {
                    userId: user.id,
                    cardId: card.id
                }
            }
        })

        if (existing) {
            return NextResponse.json({ error: 'Already claimed' }, { status: 409 })
        }

        // 5. Vincular carta al usuario y dar recompensas (XP)
        const userCard = await prisma.$transaction([
            prisma.userCard.create({
                data: {
                    userId: user.id,
                    cardId: card.id,
                    obtainedAt: new Date()
                }
            }),
            prisma.user.update({
                where: { id: user.id },
                data: {
                    xp: { increment: 150 }, // Recompensa por Momento
                    coins: { increment: 50 }
                }
            })
        ])

        return NextResponse.json({ 
            success: true, 
            message: 'Momento claimed successfully!',
            userCard: userCard[0]
        })

    } catch (error: any) {
        console.error('Claim error:', error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
