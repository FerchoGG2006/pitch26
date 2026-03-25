'use client'

import React from 'react';

type CardTier = 'LEGEND' | 'ELITE' | 'MOMENTO' | 'RISING' | 'BASE';

export interface PlayerCardType {
    id: string;
    playerId: string;
    playerName: string;
    imageUrl?: string; // Nuevo
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

import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

export function PlayerCard({ card, onPress, isUpgrading }: { 
    card: PlayerCardType; 
    onPress?: () => void;
    isUpgrading?: boolean;
}) {
    const colors = TIER_COLORS[card.tier]
    const isLive = card.tier === 'MOMENTO' && !card.momento?.isExpired

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
            
            {/* El marco superior (Border Top) */}
            <div className={`pcard-tb ${colors.border} z-40`} />

            {/* Animación de Subida de Nivel */}
            <AnimatePresence>
                {isUpgrading && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1.2 }}
                        exit={{ opacity: 0, y: -40 }}
                        className="absolute inset-0 z-[60] flex items-center justify-center pointer-events-none"
                    >
                        <div className="bg-gold text-void font-display font-black text-xl px-4 py-1 rounded shadow-[0_0_20px_#F0C040] uppercase italic tracking-tighter">
                            ¡UPGRADE!
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Efecto de resplandor cuando sube de nivel */}
            <motion.div 
                className="absolute inset-x-0 top-0 h-1/2 bg-gold/20 blur-2xl z-30 pointer-events-none"
                animate={isUpgrading ? { opacity: [0, 1, 0] } : { opacity: 0 }}
                transition={{ duration: 0.8 }}
            />

            <div className="pcard-head overflow-hidden relative">
                {/* Fondo con brillo dinámico */}
                <div className="pcard-glow" style={{ background: `radial-gradient(circle, ${colors.rating}, transparent)` }} />
                
                {/* Imagen del Jugador */}
                {card.imageUrl && (
                    <img 
                        src={card.imageUrl} 
                        alt={card.playerName} 
                        className="absolute bottom-0 w-[110%] h-[110%] object-cover z-10 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                        style={{ 
                            left: '50%',
                            transform: 'translateX(-50%)',
                            maskImage: 'linear-gradient(to top, black 70%, transparent 100%)',
                            WebkitMaskImage: 'linear-gradient(to top, black 70%, transparent 100%)'
                        }}
                    />
                )}

                <div className={`pcard-tier ${colors.tag} z-20`}>{card.tier}</div>
                
                <motion.div 
                    className="pcard-rating z-20" 
                    style={{ color: colors.rating }}
                    animate={isUpgrading ? { scale: [1, 1.4, 1] } : {}}
                >
                    {card.rating}
                </motion.div>
                
                <div className="pcard-flag z-20 bg-void/60 p-1 rounded-sm border border-white/10 backdrop-blur-sm">
                    <img 
                        src={`https://flagcdn.com/w40/${card.nationality.toLowerCase()}.png`} 
                        alt={card.nationality}
                        className="w-6 h-4 object-cover"
                    />
                </div>

                {isLive && <div className="live-badge-card z-20">● VIVO</div>}
            </div>

            <div className="pcard-body relative z-20">
                <div className={`evo-tag ${card.evolution.deltaToday < 0 ? 'neg' : ''}`}>
                    {card.evolution.deltaToday >= 0 ? '▲' : '▼'} {Math.abs(card.evolution.deltaToday)} hoy
                </div>
                <div className="pcard-name">{card.playerName}</div>
                <div className="pcard-pos">{card.position}</div>
                <div className="pcard-stats">
                    {Object.entries(card.stats).slice(0, 3).map(([key, val]) => (
                        <div key={key} className="pstat">
                            <div className="pstat-v" style={{ color: colors.rating }}>{val}</div>
                            <div className="pstat-k">{key.toUpperCase()}</div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}

