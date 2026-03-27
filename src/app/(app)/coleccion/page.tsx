'use client';

import React, { useState, useEffect } from 'react';
import { PlayerCard, PlayerCardType } from '@/components/cards/PlayerCard';
import { useLiveUpdates } from '@/hooks/useLiveUpdates';
import { motion } from 'framer-motion';

const INITIAL_CARDS: PlayerCardType[] = [
    {
        id: '1',
        playerId: 'p-messi',
        playerName: 'MESSI',
        imageUrl: '/players/julian_alvarez.png',
        position: 'FWD',
        nationality: 'Argentina', flag: '🇦🇷', tier: 'LEGEND', rating: 99,
        stats: { rit: 99, tir: 99, vis: 99, dri: 99, pas: 98, fis: 78 },
        evolution: { deltaToday: 3, deltaTournament: 5, lastEvent: 'Hat-trick vs ESP' }
    },
    {
        id: '2',
        playerId: 'p-mbappe',
        playerName: 'MBAPPÉ',
        imageUrl: '/players/mbappe.png',
        position: 'FWD',
        nationality: 'Francia', flag: '🇫🇷', tier: 'MOMENTO', rating: 97,
        stats: { rit: 99, tir: 96, vis: 91, dri: 88, pas: 87, fis: 85 },
        evolution: { deltaToday: 6, deltaTournament: 8, lastEvent: 'Gol de chilena' },
        momento: { isExpired: false }
    },
    {
        id: '3',
        playerId: 'p-yamal',
        playerName: 'YAMAL',
        imageUrl: '/players/julian_alvarez.png',
        position: 'FWD',
        nationality: 'España', flag: '🇪🇸', tier: 'RISING', rating: 88,
        stats: { rit: 91, tir: 86, vis: 84, dri: 95, pas: 79, fis: 82 },
        evolution: { deltaToday: 11, deltaTournament: 11, lastEvent: 'Rising del torneo' }
    }
]

export default function ColeccionPage() {
    const [cards, setCards] = useState(INITIAL_CARDS)
    const { lastUpdate } = useLiveUpdates()
    const [claimerCount, setClaimerCount] = useState(18342)

    useEffect(() => {
        const interval = setInterval(() => {
            setClaimerCount(prev => prev + Math.floor(Math.random() * 5 + 1))
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (lastUpdate) {
            setCards(prev => prev.map(c => {
                if (c.playerId === lastUpdate.playerId) {
                    return { ...c, rating: lastUpdate.newRating }
                }
                return c
            }))
        }
    }, [lastUpdate])

    return (
        <div className="relative min-h-screen px-6 pb-32 pt-4 flex flex-col gap-8">
            
            {/* Moment Alert (Mobile Stacked) */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden bg-gradient-to-r from-purple/30 via-ice/20 to-purple/30 p-[1.5px] rounded-3xl"
            >
                <div className="bg-[#111C2E]/95 backdrop-blur-2xl p-6 rounded-[22px] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple/10 to-transparent pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col items-center text-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-purple/20 border border-purple/40 px-3 py-1 rounded-full text-[8px] font-black tracking-[3px] text-purple uppercase">
                                ✦ MOMENTO VIVO
                            </div>
                            <div className="w-1.5 h-1.5 rounded-full bg-purple animate-ping" />
                        </div>
                        <h3 className="font-display font-black text-2xl tracking-[1px] italic text-white uppercase leading-tight drop-shadow-lg">
                            GOL DE MESSI · SEMIFINALES
                        </h3>
                        <div className="flex items-center justify-center gap-6 my-1">
                             <div className="flex flex-col">
                                <span className="text-[10px] text-txt2 font-extrabold uppercase tracking-widest">TIEMPO</span>
                                <span className="text-3xl font-mono font-black text-white/90">27:45</span>
                             </div>
                             <div className="w-[1px] h-10 bg-white/10" />
                             <div className="flex flex-col">
                                <span className="text-[10px] text-txt2 font-extrabold uppercase tracking-widest">RANKING</span>
                                <span className="text-3xl font-mono font-black text-gold">#1</span>
                             </div>
                        </div>
                        <button className="w-full bg-gradient-to-r from-purple to-ice text-void text-[12px] font-black uppercase py-4 rounded-2xl shadow-[0_0_20px_rgba(160,112,255,0.3)] active:scale-95 transition-all">
                            RECLAMAR CARTA
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Collection Section (Mobile Rail) */}
            <section className="flex flex-col gap-4">
                <div className="flex items-center justify-between px-2">
                    <div className="flex flex-col">
                        <h2 className="text-[11px] font-black tracking-[4px] text-txt2 uppercase">
                            Mi Colección
                        </h2>
                        <span className="text-[8px] font-bold text-white/10 tracking-widest mt-1 uppercase">Cyber-Premium V6.0 Standalone</span>
                    </div>
                    <button className="bg-gold/10 border border-gold/30 px-4 py-1.5 rounded-full text-[9px] font-black text-gold uppercase hover:bg-gold/20 transition-colors">Ver Todo</button>
                </div>
                
                {/* Horizontal Rail: Center point snap */}
                <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar snap-x snap-mandatory -mx-6 px-6">
                    {cards.map(card => (
                        <div key={card.id} className="snap-center shrink-0">
                            <PlayerCard card={card} />
                        </div>
                    ))}
                    <div className="shrink-0 w-8" />
                </div>
            </section>

            {/* Tactical Field (Mobile Scaled) */}
            <section className="flex flex-col gap-4">
                 <div className="bg-panel/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-white/2">
                        <span className="text-[10px] font-black tracking-[2px] text-txt2 uppercase">TÁCTICA XI · 4-3-3</span>
                        <span className="text-[11px] font-black text-emerald tracking-[1px] uppercase">100% QUÍMICA</span>
                    </div>

                    <div className="relative h-[420px] bg-[#0A1A14] m-4 rounded-xl border border-white/10 overflow-hidden shadow-inner flex items-center justify-center">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,229,160,0.1)_0%,transparent_70%)]" />
                        
                        {/* Pitch Lines (Scaled) */}
                        <div className="absolute inset-x-0 top-0 bottom-0 repeating-linear-gradient-pitch opacity-20" />
                        <div className="absolute inset-6 border border-white/10 rounded-lg" />
                        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/10 -translate-y-1/2" />
                        <div className="absolute top-1/2 left-1/2 w-32 h-32 border border-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />

                        {/* Player Dots (Scale for Mobile) */}
                        <SquadDot pos="50% 88%" type="GK" emoji="🧤" name="COURTOIS" />
                        <SquadDot pos="15% 72%" type="DEF" emoji="🛡️" name="MILITAO" />
                        <SquadDot pos="50% 75%" type="DEF" emoji="🛡️" name="DIAS" />
                        <SquadDot pos="85% 72%" type="DEF" emoji="🛡️" name="HERN" />
                        <SquadDot pos="20% 48%" type="MID" emoji="⚙️" name="VALVERDE" image="/players/valverde.png" />
                        <SquadDot pos="50% 45%" type="MID" emoji="⚙️" name="PEDRI" />
                        <SquadDot pos="80% 48%" type="MID" emoji="⚙️" name="DEBRUY" />
                        <SquadDot pos="15% 18%" type="FWD" emoji="★" name="YAMAL" image="/players/julian_alvarez.png" />
                        <SquadDot pos="50% 12%" type="FWD" emoji="👑" name="MESSI" image="/players/julian_alvarez.png" isGold />
                        <SquadDot pos="85% 18%" type="FWD" emoji="★" name="MBAPPÉ" image="/players/mbappe.png" />
                    </div>
                    
                    <div className="p-4 pt-0">
                         <button className="w-full bg-void/60 border border-white/5 py-4 rounded-2xl text-[11px] font-black text-white/50 uppercase tracking-[2px]">Administrar Alineación</button>
                    </div>
                 </div>
            </section>

            <style jsx>{`
                .repeating-linear-gradient-pitch {
                    background: repeating-linear-gradient(
                        180deg,
                        rgba(255, 255, 255, 0.05) 0,
                        rgba(255, 255, 255, 0.05) 20px,
                        transparent 20px,
                        transparent 40px
                    );
                }
            `}</style>
        </div>
    );
}

function SquadDot({ pos, type, emoji, name, isGold, image }: { pos: string, type: string, emoji: string, name: string, isGold?: boolean, image?: string }) {
    const colors = {
        GK: 'bg-ice',
        DEF: 'bg-emerald',
        MID: 'bg-purple',
        FWD: 'bg-gold'
    }[type] || 'bg-txt'

    return (
        <div 
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer transition-all duration-300 active:scale-125 z-30" 
            style={{ left: pos.split(' ')[0], top: pos.split(' ')[1] }}
        >
            <div className={`w-12 h-12 rounded-full border-[3px] border-white/30 flex items-center justify-center text-[12px] shadow-2xl overflow-hidden ${isGold ? 'bg-gold ring-4 ring-gold/30' : colors}`}>
                {image ? (
                    <img src={image} className="w-full h-full object-cover transition-all" alt="" />
                ) : (
                    <span className="drop-shadow-md text-xl">{emoji}</span>
                )}
            </div>
            <span className={`text-[8px] font-black mt-1.5 text-white uppercase tracking-[1px] p-0.5 px-2 rounded bg-void/60 backdrop-blur-md border border-white/5 ${isGold ? 'text-gold' : ''}`}>
                {name}
            </span>
        </div>
    )
}
