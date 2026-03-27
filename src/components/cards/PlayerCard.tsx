'use client'

import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

type CardTier = 'LEGEND' | 'ELITE' | 'MOMENTO' | 'RISING' | 'BASE';

export interface PlayerCardType {
    id: string;
    playerId: string;
    playerName: string;
    imageUrl?: string;
    position: 'FWD' | 'MID' | 'DEF' | 'GK';
    nationality: string;
    flag: string;
    tier: CardTier;
    rating: number;
    stats: {
        rit: number;
        tir: number;
        vis: number;
        dri: number;
        pas: number;
        fis: number;
    };
    evolution: {
        deltaToday: number;
        deltaTournament: number;
        lastEvent: string;
    };
    momento?: {
        isExpired: boolean;
    };
}

const TIER_CONFIG = {
    LEGEND: { color: '#F2C441', glow: 'rgba(242,196,65, 0.45)', tag: 'bg-gold text-black' },
    ELITE: { color: '#C8C8C8', glow: 'rgba(200,200,200, 0.25)', tag: 'bg-white/20 text-white' },
    MOMENTO: { color: '#A070FF', glow: 'rgba(160,112,255, 0.45)', tag: 'bg-purple text-white' },
    RISING: { color: '#00DFA0', glow: 'rgba(0,223,160, 0.3)', tag: 'bg-emerald text-black' },
    BASE: { color: '#8492A6', glow: 'rgba(255,255,255, 0.05)', tag: 'bg-white/10 text-white/40' },
}

export function PlayerCard({ card, onPress }: { 
    card: PlayerCardType; 
    onPress?: () => void;
}) {
    const config = TIER_CONFIG[card.tier] || TIER_CONFIG.BASE
    const isLive = card.tier === 'MOMENTO' && !card.momento?.isExpired
    const stats = card.stats
    const evolution = card.evolution

    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const mouseXSpring = useSpring(x)
    const mouseYSpring = useSpring(y)
    
    // Smooth Tilt for Mobile Interaction
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [8, -8])
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-8, 8])

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const xPct = (e.clientX - rect.left) / rect.width - 0.5
        const yPct = (e.clientY - rect.top) / rect.height - 0.5
        x.set(xPct)
        y.set(yPct)
    }

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
    }

    return (
        <motion.div
            className="relative select-none cursor-pointer group no-tap-highlight"
            onClick={onPress}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ 
                rotateX, 
                rotateY, 
                transformStyle: 'preserve-3d',
                perspective: '1000px'
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
            {/* Mobile-Native Dimensions: 220x310px centered for 430px chassis */}
            <div className="relative w-[220px] h-[310px] rounded-[1.8rem] bg-[#0A1422] overflow-hidden border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.6)] group-active:border-white/30 transition-all duration-300">
                
                {/* Advanced Glass Backdrop */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />

                {/* Content Layer (UI Oriented) */}
                <div className="absolute inset-0 z-20 flex flex-col p-4">
                    
                    {/* Header: Rating & Identity */}
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex flex-col">
                            <span className={`px-2 py-0.5 rounded-md text-[7px] font-black tracking-[1.5px] uppercase mb-1 shadow-sm ${config.tag}`}>
                                {card.tier}
                            </span>
                            <div className="font-display font-black text-4xl italic leading-none" style={{ color: config.color }}>{card.rating}</div>
                            <span className="text-[9px] font-black text-txt2 uppercase mt-1 tracking-tighter opacity-80">{card.position}</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-xl drop-shadow-md">{card.flag}</span>
                            {isLive && (
                                <div className="mt-2 bg-fire text-white text-[7px] font-black px-1.5 py-0.5 rounded-full animate-blink uppercase tracking-[1px] border border-fire/40">
                                    LIVE
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Image Shield (Cinematic) - Mobile Balanced */}
                    <div className="relative flex-1 -mt-2 mb-2">
                        <div className="relative w-full h-full pcard-shield-v2 overflow-hidden">
                             {card.imageUrl && (
                                <img 
                                    src={card.imageUrl} 
                                    alt={card.playerName}
                                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                                />
                            )}
                             <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0A1422] via-[#0A1422]/70 to-transparent" />
                        </div>
                    </div>

                    {/* Footer: Name & Dense Stats */}
                    <div className="mt-auto">
                        <h2 className="text-xl font-display font-black tracking-[1.5px] uppercase italic truncate mb-2 text-center border-b border-white/5 pb-1">
                            {card.playerName}
                        </h2>

                        {/* Mobile Optimized Stats (3x2) */}
                        <div className="grid grid-cols-3 gap-y-2 mb-2 px-1">
                            {[
                                { k: 'RIT', v: stats.rit }, { k: 'TIR', v: stats.tir }, { k: 'VIS', v: stats.vis },
                                { k: 'DRI', v: stats.dri }, { k: 'PAS', v: stats.pas }, { k: 'FIS', v: stats.fis }
                            ].map(s => (
                                <div key={s.k} className="flex flex-col items-center">
                                    <span className="text-[7px] font-black text-txt3 tracking-[1px] uppercase opacity-60">{s.k}</span>
                                    <span className="text-[11px] font-black leading-none" style={{ color: config.color }}>{s.v}</span>
                                </div>
                            ))}
                        </div>

                        {/* Event Feed - Mobile Rail */}
                        <div className="flex items-center justify-between text-[8px] font-bold px-3 py-1.5 bg-white/[0.04] rounded-lg border border-white/5">
                            <span className="text-txt2 uppercase truncate max-w-[100px] tracking-tight">{evolution.lastEvent}</span>
                            <span className={evolution.deltaToday >= 0 ? 'text-emerald' : 'text-fire'}>
                                {evolution.deltaToday >= 0 ? `▲+${evolution.deltaToday}` : `▼${evolution.deltaToday}`}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Refined Holographic Glare */}
                <div className="absolute inset-0 z-30 pointer-events-none opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-tr from-transparent via-white/30 to-transparent" />
            </div>

            <style jsx>{`
                .pcard-shield-v2 {
                    clip-path: polygon(0 0, 100% 0, 100% 88%, 50% 100%, 0 88%);
                }
                .no-tap-highlight {
                    -webkit-tap-highlight-color: transparent;
                }
            `}</style>
        </motion.div>
    );
}
