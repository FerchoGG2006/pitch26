'use client'

import React from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

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

const TIER_COLORS = {
    LEGEND: { border: 'tb-gold', rating: '#FFD700', tag: 'pt-legend' },
    ELITE: { border: 'tb-silver', rating: '#C0C0C0', tag: 'pt-elite' },
    MOMENTO: { border: 'tb-purple', rating: '#9D6FFF', tag: 'pt-moment' },
    RISING: { border: 'tb-teal', rating: '#00E5A0', tag: 'pt-rising' },
    BASE: { border: 'tb-base', rating: '#7A8A9A', tag: 'pt-base' },
}

export function PlayerCard({ card, onPress, isUpgrading }: { 
    card: PlayerCardType; 
    onPress?: () => void;
    isUpgrading?: boolean;
}) {
    // Fallbacks
    const colors = TIER_COLORS[card.tier] || TIER_COLORS.BASE
    const isLive = card.tier === 'MOMENTO' && !card.momento?.isExpired
    const stats = card.stats || { rit: 0, tir: 0, vis: 0, dri: 0, pas: 0, fis: 0 }
    const evolution = card.evolution || { deltaToday: 0, deltaTournament: 0, lastEvent: '-' }

    // 3D Tilt Logic
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const mouseXSpring = useSpring(x)
    const mouseYSpring = useSpring(y)
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['10deg', '-10deg'])
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-10deg', '10deg'])

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const width = rect.width
        const height = rect.height
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top
        const xPct = mouseX / width - 0.5
        const yPct = mouseY / height - 0.5
        x.set(xPct)
        y.set(yPct)
    }

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
    }

    return (
        <motion.div
            className="pcard shrink-0 relative"
            onClick={onPress}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ 
                rotateX, 
                rotateY, 
                transformStyle: 'preserve-3d',
                userSelect: 'none' 
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
            <div className="pcard-shine z-50 rounded-xl" />
            
            <AnimatePresence>
                {isUpgrading && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1.2 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-x-0 -top-4 z-[60] flex flex-col items-center pointer-events-none"
                    >
                        <div className="bg-fire text-void text-[10px] font-black px-3 py-1 rounded-full shadow-lg shadow-fire/50 animate-bounce uppercase">
                            ¡UPGRADE!
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className={`pcard-inner ${colors.border}`}>
                <div className="flex justify-between items-start mb-1">
                    <div className="flex flex-col">
                        <span className="pcard-rating text-3xl font-black" style={{ color: colors.rating }}>{card.rating}</span>
                        <span className="pcard-pos text-[10px] font-bold opacity-70 uppercase tracking-tighter">{card.position}</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-lg leading-none">{card.flag}</span>
                        <div className={`mt-1 h-3 px-1 rounded-sm text-[8px] font-black flex items-center ${colors.tag} uppercase`}>
                            {card.tier}
                        </div>
                    </div>
                </div>

                <div className="relative w-full aspect-[4/5] -mt-2 mb-1 overflow-hidden">
                    {card.imageUrl && (
                        <img 
                            src={card.imageUrl} 
                            alt={card.playerName}
                            className="w-full h-full object-contain relative z-10 pcard-player-img" 
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-panel/90 to-transparent z-0" />
                    
                    {isLive && (
                        <div className="absolute top-2 right-0 bg-fire text-void text-[7px] font-black px-1.5 py-0.5 rounded-l-md z-20 animate-pulse">
                            ● VIVO
                        </div>
                    )}
                </div>

                <div className="text-center mb-2 px-1">
                    <h3 className="text-base font-display font-black tracking-tighter uppercase italic truncate leading-none">
                        {card.playerName}
                    </h3>
                </div>

                <div className="grid grid-cols-3 gap-y-1 gap-x-2 border-t border-rim/30 pt-2 mb-2">
                    <div className="flex flex-col items-center">
                        <span className="text-[7px] opacity-40 font-bold tracking-tighter">RIT</span>
                        <span className="text-[10px] font-black">{stats.rit}</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-[7px] opacity-40 font-bold tracking-tighter">TIR</span>
                        <span className="text-[10px] font-black">{stats.tir}</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-[7px] opacity-40 font-bold tracking-tighter">VIS</span>
                        <span className="text-[10px] font-black">{stats.vis}</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-[7px] opacity-40 font-bold tracking-tighter">DRI</span>
                        <span className="text-[10px] font-black">{stats.dri}</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-[7px] opacity-40 font-bold tracking-tighter">PAS</span>
                        <span className="text-[10px] font-black">{stats.pas}</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-[7px] opacity-40 font-bold tracking-tighter">FIS</span>
                        <span className="text-[10px] font-black">{stats.fis}</span>
                    </div>
                </div>

                <div className="mt-auto px-1 py-1 bg-void/30 rounded border border-rim/20">
                    <div className="flex items-center justify-between gap-1 overflow-hidden">
                        <span className={`text-[8px] font-bold truncate uppercase ${isLive ? 'text-fire' : 'text-txt2'}`}>
                            {evolution.lastEvent}
                        </span>
                        <span className={`text-[8px] font-black shrink-0 ${evolution.deltaToday > 0 ? 'text-emerald' : 'text-txt2'}`}>
                            {evolution.deltaToday >= 0 ? `+${evolution.deltaToday}` : evolution.deltaToday}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
