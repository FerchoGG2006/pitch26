'use client'

import React from 'react';
import { PlayerCard, PlayerCardType } from '@/components/cards/PlayerCard';

const mockCards: PlayerCardType[] = [
    {
        id: '1',
        playerId: 'p1',
        playerName: 'MESSI',
        imageUrl: '/players/julian_alvarez.png', // Usando Julian como placeholder premium de AR
        position: 'FWD',
        nationality: 'AR',
        flag: '🇦🇷',
        tier: 'LEGEND',
        rating: 99,
        stats: { rit: 90, tir: 96, vis: 98, dri: 95, pas: 94, fis: 70 },
        evolution: { deltaToday: 2, deltaTournament: 5, lastEvent: 'Gol al min 15' }
    },
    {
        id: '2',
        playerId: 'p2',
        playerName: 'MBAPPÉ',
        imageUrl: '/players/mbappe.png',
        position: 'FWD',
        nationality: 'FR',
        flag: '🇫🇷',
        tier: 'MOMENTO',
        rating: 98,
        stats: { rit: 99, tir: 94, vis: 85, dri: 97, pas: 82, fis: 86 },
        evolution: { deltaToday: 5, deltaTournament: 8, lastEvent: 'Hat trick vs ENG' },
        momento: { isExpired: false }
    },
    {
        id: '3',
        playerId: 'p3',
        playerName: 'BELLINGHAM',
        imageUrl: '/players/vinicius_jr.png', // Usando Vini como placeholder premium
        position: 'MID',
        nationality: 'BR',
        flag: '🇧🇷',
        tier: 'RISING',
        rating: 90,
        stats: { rit: 84, tir: 88, vis: 90, dri: 89, pas: 90, fis: 88 },
        evolution: { deltaToday: 1, deltaTournament: 3, lastEvent: 'Asistencia' }
    }
]

export default function ColeccionPage() {
    return (
        <div className="p-4 h-full flex flex-col">
            <h1 className="text-3xl font-display font-black text-white mb-6 uppercase tracking-tight">Mi Colección</h1>

            <div className="flex-1 flex items-center w-full overflow-hidden">
                <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory py-8 px-4 -mx-4 items-center" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {mockCards.map(card => (
                        <div key={card.id} className="snap-center shrink-0">
                            <PlayerCard card={card} />
                        </div>
                    ))}
                    <div className="snap-center shrink-0 w-8" />
                </div>
            </div>
        </div>
    );
}
