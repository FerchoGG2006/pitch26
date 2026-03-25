'use client'

import React, { useEffect, useState } from 'react'
import { animate, motion } from 'framer-motion'
import { useLiveUpdates } from '@/hooks/useLiveUpdates'

const DEFAULT_MATCHES = [
    { teams: 'ARG 2 - 0 FRA', time: "45'" },
    { teams: 'BRA 1 - 1 ENG', time: "82'" },
    { teams: 'ESP 3 - 0 POR', time: 'F' }
]

export function LiveTicker() {
    const { lastUpdate } = useLiveUpdates()
    const [hotEvent, setHotEvent] = useState<string | null>(null)

    useEffect(() => {
        if (lastUpdate) {
            setHotEvent(`⚽ ¡GOL DE ${lastUpdate.playerName.toUpperCase()}! (+${lastUpdate.delta} RATING)`)
            const timer = setTimeout(() => setHotEvent(null), 8000)
            return () => clearTimeout(timer)
        }
    }, [lastUpdate])

    return (
        <div className="h-8 bg-panel flex items-center px-4 overflow-hidden border-b border-rim z-10 flex-shrink-0">
            <div className="text-[11px] font-mono text-txt2 tracking-widest whitespace-nowrap overflow-hidden relative w-full flex items-center">
                <motion.div 
                    initial={{ x: '100%' }}
                    animate={{ x: '-100%' }}
                    transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                    className="inline-block whitespace-nowrap"
                >
                    <span className="text-fire font-bold">● VIVO</span>
                    {DEFAULT_MATCHES.map((m, i) => (
                        <span key={i}>
                            &nbsp;&nbsp;{m.teams} {m.time} &nbsp;&nbsp;|&nbsp;&nbsp;
                        </span>
                    ))}
                    {/* Repetir para que el scroll sea infinito y fluido si es muy largo */}
                    <span className="text-fire font-bold">● VIVO</span>
                    {DEFAULT_MATCHES.map((m, i) => (
                        <span key={`dup-${i}`}>
                            &nbsp;&nbsp;{m.teams} {m.time} &nbsp;&nbsp;|&nbsp;&nbsp;
                        </span>
                    ))}
                </motion.div>

                {/* Overlay para Eventos "Hot" */}
                {hotEvent && (
                    <motion.div 
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -30, opacity: 0 }}
                        className="absolute inset-x-0 h-full bg-gold flex items-center justify-center text-void font-display font-black italic text-[12px] z-20"
                    >
                        {hotEvent}
                    </motion.div>
                )}
            </div>
        </div>
    )
}
