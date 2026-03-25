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

export function PlayerCard({ card, onPress }: { card: PlayerCardType; onPress?: () => void }) {
    const colors = TIER_COLORS[card.tier]
    const isLive = card.tier === 'MOMENTO' && !card.momento?.isExpired

    return (
        <div
            className="pcard shrink-0"
            onClick={onPress}
            style={{ userSelect: 'none' }}
        >
            <div className="pcard-shine" />
            <div className={`pcard-tb ${colors.border}`} />

            <div className="pcard-head overflow-hidden">
                <div className="pcard-glow" style={{ background: `radial-gradient(circle, ${colors.rating}, transparent)` }} />
                
                {/* Imagen del Jugador */}
                {card.imageUrl && (
                    <img 
                        src={card.imageUrl} 
                        alt={card.playerName} 
                        className="absolute bottom-0 w-[90%] h-auto object-contain z-10 filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]"
                    />
                )}

                <div className={`pcard-tier ${colors.tag} z-20`}>{card.tier}</div>
                <div className="pcard-rating z-20" style={{ color: colors.rating }}>{card.rating}</div>
                
                <div className="pcard-flag z-20 bg-void/50 p-1 rounded-sm border border-white/10">
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
        </div>
    )
}

