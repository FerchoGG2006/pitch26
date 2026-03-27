'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PlayerCard, PlayerCardType } from '@/components/cards/PlayerCard'
import { Swords, Search, Zap, Trophy, Coins, ChevronLeft, ChevronRight } from 'lucide-react'
import { DuelResult } from '@/lib/duels'

// Mock de cartas del usuario (Normalmente vendrían de la DB)
const USER_COLLECTION: PlayerCardType[] = [
    {
        id: '1',
        playerId: 'p-messi',
        playerName: 'MESSI',
        imageUrl: '/players/julian_alvarez.png',
        position: 'FWD',
        nationality: 'Argentina', flag: '🇦🇷', tier: 'LEGEND', rating: 99,
        stats: { rit: 99, tir: 99, vis: 99, dri: 99, pas: 98, fis: 78 },
        evolution: { deltaToday: 3, deltaTournament: 5, lastEvent: 'GOL' }
    },
    {
        id: '2',
        playerId: 'p-mbappe',
        playerName: 'MBAPPÉ',
        imageUrl: '/players/mbappe.png',
        position: 'FWD',
        nationality: 'Francia', flag: '🇫🇷', tier: 'MOMENTO', rating: 97,
        stats: { rit: 99, tir: 96, vis: 91, dri: 88, pas: 87, fis: 85 },
        evolution: { deltaToday: 5, deltaTournament: 8, lastEvent: 'GOL' },
        momento: { isExpired: false }
    }
]

type DuelState = 'IDLE' | 'SEARCHING' | 'FOUND' | 'BATTLING' | 'RESULT'

export default function PlayPage() {
    const [state, setState] = useState<DuelState>('IDLE')
    const [selectedCard, setSelectedCard] = useState<PlayerCardType>(USER_COLLECTION[0])
    const [opponent, setOpponent] = useState<PlayerCardType | null>(null)
    const [duelResult, setDuelResult] = useState<DuelResult | null>(null)
    const [activeComparisonIdx, setActiveComparisonIdx] = useState(-1)

    const startMatchmaking = async () => {
        setState('SEARCHING')
        
        // Simular búsqueda de 3 segundos
        setTimeout(async () => {
            const res = await fetch('/api/duels/match', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ playerCard: selectedCard })
            })
            const data = await res.json()
            
            if (data.success) {
                setOpponent(data.opponent)
                setDuelResult(data.battleResult)
                setState('FOUND')
                
                // Pasar a batalla tras 2.5s de ver al oponente
                setTimeout(() => {
                    setState('BATTLING')
                    startBattleSequence(data.battleResult)
                }, 2500)
            }
        }, 3000)
    }

    const startBattleSequence = (result: DuelResult) => {
        setActiveComparisonIdx(-1)
        // Revelar cada estadística cada 1.5s
        result.comparisons.forEach((_, i) => {
            setTimeout(() => {
                setActiveComparisonIdx(i)
                if (i === result.comparisons.length - 1) {
                    // Mostrar resultado final un poco después del último stat
                    setTimeout(() => setState('RESULT'), 2000)
                }
            }, (i + 1) * 1500)
        })
    }

    const resetDuel = () => {
        setState('IDLE')
        setOpponent(null)
        setDuelResult(null)
        setActiveComparisonIdx(-1)
    }

    return (
        <div className="min-h-screen py-10 px-4">
            <AnimatePresence mode="wait">
                
                {state === 'IDLE' && (
                    <motion.div 
                        key="idle"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-4">
                                <Swords className="w-10 h-10 text-gold" />
                                <h1 className="text-4xl font-display font-black italic tracking-[2px] uppercase">DUELOS 1V1</h1>
                            </div>
                            <button 
                                onClick={() => window.location.href = '/coleccion'}
                                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="bg-panel/40 backdrop-blur-xl border border-white/5 rounded-3xl p-10 shadow-2xl">
                             <h2 className="text-xs font-black tracking-[4px] text-txt2 uppercase mb-8 border-b border-white/5 pb-2">Selecciona tu CAMPEÓN</h2>
                             
                             <div className="flex gap-10 overflow-x-auto pb-10 no-scrollbar snap-x">
                                {USER_COLLECTION.map(card => (
                                    <div 
                                        key={card.id} 
                                        className={`snap-center transition-all duration-300 ${selectedCard.id === card.id ? 'scale-105 contrast-125 brightness-110' : 'opacity-40 grayscale-[0.8]'}`}
                                        onClick={() => setSelectedCard(card)}
                                    >
                                        <PlayerCard card={card} />
                                    </div>
                                ))}
                             </div>

                             <div className="flex flex-col items-center mt-6">
                                <button 
                                    onClick={startMatchmaking}
                                    className="bg-gold hover:bg-gold-dark text-void font-display font-black px-16 py-5 rounded-full text-lg shadow-[0_0_40px_rgba(242,196,65,0.3)] hover:shadow-gold/50 active:scale-95 transition-all flex items-center gap-3"
                                >
                                    <Zap className="fill-current w-5 h-5" />
                                    BUSCAR OPONENTE
                                </button>
                                <span className="text-[11px] font-bold text-txt3 mt-4 tracking-widest uppercase">Entra a la Arena Mundial</span>
                             </div>
                        </div>
                    </motion.div>
                )}

                {state === 'SEARCHING' && (
                    <motion.div 
                        key="searching"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-void"
                    >
                        <div className="relative w-64 h-64 flex items-center justify-center">
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                className="absolute inset-0 border-t-2 border-ice/40 rounded-full"
                            />
                            <motion.div 
                                animate={{ rotate: -360 }}
                                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                                className="absolute inset-4 border-b-2 border-purple/40 rounded-full"
                            />
                            <Search className="w-16 h-16 text-white/20 animate-pulse" />
                        </div>
                        <h2 className="mt-10 text-2xl font-display font-black italic tracking-[4px] text-ice animate-pulse uppercase">BUSCANDO OPONENTE...</h2>
                        <span className="text-xs font-bold text-txt2 mt-4 tracking-tighter">Escaneando Arena Regional (Latam Norte)</span>
                    </motion.div>
                )}

                {state === 'FOUND' && opponent && (
                    <motion.div 
                        key="found"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-void/80 backdrop-blur-3xl"
                    >
                        <h2 className="text-5xl font-display font-black italic text-gold uppercase mb-12 animate-bounce">OPONENTE ENCONTRADO</h2>
                        <div className="transform scale-110">
                            <PlayerCard card={opponent} />
                        </div>
                        <div className="mt-10 flex flex-col items-center">
                            <span className="text-ice font-black tracking-widest uppercase text-xl">¿ESTÁS LISTO?</span>
                            <div className="w-64 h-1 bg-white/10 mt-4 overflow-hidden rounded-full">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 2.5 }}
                                    className="h-full bg-gold"
                                />
                            </div>
                        </div>
                    </motion.div>
                )}

                {(state === 'BATTLING' || state === 'RESULT') && opponent && duelResult && (
                    <motion.div 
                        key="battle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-[100] bg-void flex flex-col items-center justify-center p-10 overflow-hidden"
                    >
                        {/* Battle Background Sparks (Opt-in) */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,217,245,0.05)_0%,transparent_70%)] pointer-events-none" />

                        <div className="flex items-center justify-center gap-20 w-full max-w-7xl relative">
                            {/* Player Card */}
                            <motion.div 
                                animate={state === 'RESULT' && duelResult.score[0] > duelResult.score[1] ? { y: [-10, 10, -10], rotate: [0, 1, -1, 0] } : {}}
                                transition={{ duration: 2, repeat: Infinity }}
                                className={`relative z-10 scale-90 md:scale-100 ${state === 'RESULT' && duelResult.score[0] < duelResult.score[1] ? 'opacity-30 blur-sm grayscale' : ''}`}
                            >
                                <PlayerCard card={selectedCard} />
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-ice font-black text-2xl tracking-widest italic uppercase">TÚ</div>
                            </motion.div>

                            {/* Versus / Score Overlay */}
                            <div className="flex flex-col items-center justify-center gap-10">
                                <div className="bg-panel/80 border-2 border-white/10 p-10 rounded-full w-48 h-48 flex flex-col items-center justify-center shadow-[0_0_60px_rgba(0,0,0,0.8)] relative overflow-hidden">
                                     <div className="absolute inset-0 bg-void opacity-40" />
                                     <div className="relative z-10 flex flex-col items-center">
                                         <span className="text-[10px] font-black text-txt3 tracking-[4px] mb-2">MARCADOR</span>
                                         <div className="flex items-center gap-4 text-6xl font-display font-black italic">
                                            <motion.span layoutId="scoreP">{duelResult.score[0]}</motion.span>
                                            <span className="text-white/20">—</span>
                                            <motion.span layoutId="scoreO">{duelResult.score[1]}</motion.span>
                                         </div>
                                     </div>
                                </div>

                                {/* Stats Clash Visualization */}
                                <div className="flex flex-col gap-3 w-64">
                                    {duelResult.comparisons.map((c, i) => (
                                        <motion.div 
                                            key={i}
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={activeComparisonIdx >= i ? { x: 0, opacity: 1 } : { opacity: 0 }}
                                            className={`grid grid-cols-3 items-center py-2 px-4 rounded-lg bg-panel border-l-4 ${c.winner === 'PLAYER' ? 'border-emerald' : c.winner === 'OPPONENT' ? 'border-fire' : 'border-txt3'}`}
                                        >
                                            <span className={`text-[12px] font-black ${c.winner === 'PLAYER' ? 'text-emerald' : 'text-white/20'}`}>{c.playerValue}</span>
                                            <span className="text-[9px] font-bold text-txt3 text-center tracking-widest">{c.stat}</span>
                                            <span className={`text-[12px] font-black text-right ${c.winner === 'OPPONENT' ? 'text-fire' : 'text-white/20'}`}>{c.opponentValue}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Opponent Card */}
                            <motion.div 
                                animate={state === 'RESULT' && duelResult.score[1] > duelResult.score[0] ? { y: [-10, 10, -10], rotate: [0, 1, -1, 0] } : {}}
                                transition={{ duration: 2, repeat: Infinity }}
                                className={`relative z-10 scale-90 md:scale-100 ${state === 'RESULT' && duelResult.score[1] < duelResult.score[0] ? 'opacity-30 blur-sm grayscale' : ''}`}
                            >
                                <PlayerCard card={opponent} />
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-fire font-black text-2xl tracking-widest italic uppercase">OPONENTE</div>
                            </motion.div>
                        </div>

                        {/* Result Overlay (Final Step) */}
                        <AnimatePresence>
                            {state === 'RESULT' && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.5, y: 100 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    className="absolute inset-0 z-[110] bg-void/95 flex flex-col items-center justify-center p-6 text-center"
                                >
                                    <h3 className={`text-6xl md:text-8xl font-display font-black italic tracking-[4px] uppercase ${duelResult.score[0] > duelResult.score[1] ? 'text-emerald' : 'text-fire'}`}>
                                        {duelResult.score[0] > duelResult.score[1] ? 'VICTORIA' : 'DERROTA'}
                                    </h3>
                                    
                                    <div className="flex gap-4 mt-8 bg-panel/60 p-6 rounded-3xl border border-white/5 backdrop-blur-3xl">
                                        <div className="flex flex-col items-center min-w-[100px]">
                                            <div className="w-10 h-10 rounded-full bg-ice/20 border border-ice/40 flex items-center justify-center text-ice text-lg mb-1">⚡</div>
                                            <span className="text-[8px] font-black text-txt3 uppercase tracking-[2px]">XP GANADA</span>
                                            <span className="text-2xl font-display font-black text-ice">+{duelResult.rewards.xp}</span>
                                        </div>
                                        <div className="w-[1px] bg-white/10" />
                                        <div className="flex flex-col items-center min-w-[100px]">
                                            <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-gold text-lg mb-1">
                                                <Coins className="w-5 h-5" />
                                            </div>
                                            <span className="text-[8px] font-black text-txt3 uppercase tracking-[2px]">MONEDAS</span>
                                            <span className="text-2xl font-display font-black text-gold">+{duelResult.rewards.coins}</span>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={resetDuel}
                                        className="mt-10 bg-gold text-void font-display font-black px-12 py-4 rounded-full text-lg shadow-[0_0_30px_rgba(242,196,65,0.4)] hover:shadow-gold transition-all active:scale-90"
                                    >
                                        CONTINUAR
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
