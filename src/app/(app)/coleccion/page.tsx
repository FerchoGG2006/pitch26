'use client';

import React, { useState, useEffect } from 'react';
import { PlayerCard, PlayerCardType } from '@/components/cards/PlayerCard';
import { useLiveUpdates } from '@/hooks/useLiveUpdates';

const INITIAL_CARDS: PlayerCardType[] = [
    {
        id: '1',
        playerId: 'p-messi',
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
        playerId: 'p-mbappe',
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
        playerId: 'p-julian',
        playerName: 'JULIÁN ÁLVAREZ',
        imageUrl: '/players/julian_alvarez.png',
        position: 'FWD',
        nationality: 'AR',
        flag: '🇦🇷',
        tier: 'ELITE',
        rating: 88,
        stats: { rit: 84, tir: 88, vis: 90, dri: 89, pas: 90, fis: 88 },
        evolution: { deltaToday: 1, deltaTournament: 3, lastEvent: 'Asistencia' }
    }
]

export default function ColeccionPage() {
    const [cards, setCards] = useState(INITIAL_CARDS)
    const [upgradingId, setUpgradingId] = useState<string | null>(null)
    const { lastUpdate } = useLiveUpdates()

    // Manejar actualizaciones en tiempo real
    useEffect(() => {
        if (lastUpdate) {
            setCards(prev => prev.map(c => {
                if (c.playerId === lastUpdate.playerId) {
                    setUpgradingId(c.id)
                    // Limpiar animación después de un tiempo
                    setTimeout(() => setUpgradingId(null), 2000)
                    
                    return {
                        ...c,
                        rating: lastUpdate.newRating,
                        evolution: {
                            ...c.evolution,
                            deltaToday: c.evolution.deltaToday + lastUpdate.delta,
                            lastEvent: lastUpdate.event
                        }
                    }
                }
                return c
            }))
        }
    }, [lastUpdate])

    // Función para simular un evento (Para pruebas)
    const simulateGoal = async (pid: string) => {
        await fetch('/api/live/simulate', {
            method: 'POST',
            body: JSON.stringify({ playerId: pid, eventType: 'GOAL' })
        })
    }

    const simulateMessiGoal = () => simulateGoal('p-messi');

    return (
        <div className="relative min-h-screen pt-4 px-4 pb-20 overflow-x-hidden">
            <header className="flex justify-between items-end mb-8 mt-2">
                <div>
                    <h1 className="text-4xl font-display font-black tracking-tighter uppercase italic leading-tight">
                        MI <span className="text-gold">COLECCIÓN</span>
                    </h1>
                    <p className="text-[10px] font-mono text-txt2 tracking-widest uppercase">PITCH 26 · WORLD CUP EDITION</p>
                </div>
                
                <button 
                    onClick={simulateMessiGoal}
                    className="bg-fire/20 hover:bg-fire/40 border border-fire/50 text-fire text-[10px] font-black px-4 py-2 rounded-lg flex items-center gap-2 transition-all active:scale-95"
                >
                    <div className="w-2 h-2 bg-fire rounded-full animate-pulse" />
                    SIM GOAL (MESSI)
                </button>
            </header>

            <div className="flex gap-6 overflow-x-auto pb-12 pt-4 px-2 snap-x snap-mandatory scrollbar-hide no-scrollbar" style={{ perspective: '1000px' }}>
                {cards.map(card => (
                    <div key={card.id} className="snap-center shrink-0">
                        <PlayerCard 
                            card={card} 
                            isUpgrading={upgradingId === card.id}
                        />
                    </div>
                ))}
                <div className="snap-center shrink-0 w-8" />
            </div>

            {/* Hint de Live Status */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-void/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-rim">
                <div className="w-2 h-2 bg-emerald rounded-full animate-pulse" />
                <span className="text-[10px] font-mono text-emerald font-bold uppercase tracking-widest">Live Engine Connected</span>
            </div>
        </div>
    );
}

