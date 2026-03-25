import { PrismaClient, Position, CardTier } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding initial players...')

    // 1. Crear Jugadores Base
    const players = [
        { id: 'p-messi', externalId: 'sr:player:123', name: 'MESSI', nationality: 'AR', flag: '🇦🇷', position: Position.FWD },
        { id: 'p-julian', externalId: 'sr:player:456', name: 'JULIÁN ÁLVAREZ', nationality: 'AR', flag: '🇦🇷', position: Position.FWD },
        { id: 'p-vini', externalId: 'sr:player:789', name: 'VINÍCIUS JR', nationality: 'BR', flag: '🇧🇷', position: Position.FWD },
        { id: 'p-mbappe', externalId: 'sr:player:101', name: 'MBAPPÉ', nationality: 'FR', flag: '🇫🇷', position: Position.FWD },
        { id: 'p-valverde', externalId: 'sr:player:202', name: 'VALVERDE', nationality: 'UY', flag: '🇺🇾', position: Position.MID },
        { id: 'p-gavi', externalId: 'sr:player:303', name: 'GAVI', nationality: 'ES', flag: '🇪🇸', position: Position.MID },
    ]

    for (const p of players) {
        await prisma.player.upsert({
            where: { id: p.id },
            update: p,
            create: p
        })
    }

    // 2. Crear Cartas Maestras (PlayerCard)
    // Para que la simulación funcione, necesitamos que existan PlayerCards asociadas a estos jugadores
    const masterCards = [
        { id: 'c-julian-elite', playerId: 'p-julian', tier: CardTier.ELITE, rating: 88 },
        { id: 'c-vini-elite', playerId: 'p-vini', tier: CardTier.ELITE, rating: 88 },
        { id: 'c-mbappe-elite', playerId: 'p-mbappe', tier: CardTier.ELITE, rating: 88 },
        { id: 'c-messi-legend', playerId: 'p-messi', tier: CardTier.LEGEND, rating: 99 },
    ]

    for (const c of masterCards) {
        await prisma.playerCard.upsert({
            where: { id: c.id },
            update: c,
            create: c
        })
    }

    console.log('Seed completed successfully!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
