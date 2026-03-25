'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PlayerCard } from '../cards/PlayerCard'
import { Zap, Clock, ShieldCheck } from 'lucide-react'

interface MomentoClaimProps {
    card: any;
    onClaim: (id: string) => void;
    onClose: () => void;
}

export function MomentoClaim({ card, onClaim, onClose }: MomentoClaimProps) {
    const [timeLeft, setTimeLeft] = useState(0)
    const [isClaiming, setIsClaiming] = useState(false)
    const [claimed, setClaimed] = useState(false)

    useEffect(() => {
        const updateTimer = () => {
            const now = Date.now()
            const expiry = new Date(card.momentoExpiry).getTime()
            setTimeLeft(Math.max(0, Math.floor((expiry - now) / 1000)))
        }

        updateTimer()
        const interval = setInterval(updateTimer, 1000)
        return () => clearInterval(interval)
    }, [card])

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return `${m}:${s.toString().padStart(2, '0')}`
    }

    const handleClaim = async () => {
        setIsClaiming(true)
        try {
            const res = await fetch('/api/momentos/claim', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cardId: card.id })
            })
            
            const data = await res.json()
            
            if (data.success) {
                setClaimed(true)
                onClaim(card.id)
                setTimeout(onClose, 2500)
            } else {
                alert(`Error: ${data.error}`)
            }
        } catch (err) {
            console.error('Claim failed:', err)
        } finally {
            setIsClaiming(false)
        }
    }

    const isUrgent = timeLeft < 300 // Menos de 5 min

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-void/90 backdrop-blur-sm"
                onClick={onClose}
            />

            <motion.div 
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                className="relative bg-panel border-2 border-gold/30 rounded-3xl w-full max-w-sm overflow-hidden shadow-[0_0_50px_rgba(240,192,64,0.2)]"
            >
                {/* Header Holográfico */}
                <div className="bg-gradient-to-r from-gold/20 via-gold/40 to-gold/20 h-10 flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4 text-gold fill-current animate-pulse" />
                    <span className="text-gold font-display font-black text-sm tracking-widest uppercase italic">¡MOMENTO DETECTADO!</span>
                    <Zap className="w-4 h-4 text-gold fill-current animate-pulse" />
                </div>

                <div className="p-6 flex flex-col items-center">
                    <div className="mb-6 transform scale-90">
                        <PlayerCard card={card} />
                    </div>

                    <div className="text-center mb-8">
                        <h3 className="text-xl font-display font-black italic text-gold uppercase leading-tight mb-1">
                            {card.playerName}
                        </h3>
                        <p className="text-xs text-txt2 font-mono uppercase tracking-tighter">
                            {card.momentoMatch}
                        </p>
                    </div>

                    <div className="w-full space-y-4">
                        <div className={`flex items-center justify-between px-4 py-3 rounded-xl border ${isUrgent ? 'bg-fire/10 border-fire animate-pulse' : 'bg-void/50 border-rim'}`}>
                            <div className="flex items-center gap-2">
                                <Clock className={`w-4 h-4 ${isUrgent ? 'text-fire' : 'text-txt2'}`} />
                                <span className="text-[10px] font-bold text-txt2 uppercase">EXPIRA EN:</span>
                            </div>
                            <span className={`font-mono text-lg font-black ${isUrgent ? 'text-fire' : 'text-white'}`}>
                                {formatTime(timeLeft)}
                            </span>
                        </div>

                        {!claimed ? (
                            <button 
                                onClick={handleClaim}
                                disabled={isClaiming || timeLeft <= 0}
                                className="w-full bg-gold hover:bg-gold-dark text-void font-display font-black py-4 rounded-xl shadow-lg shadow-gold/20 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
                            >
                                {isClaiming ? 'RECLAMANDO...' : 'RECLAMAR CARTURA ÚNICA'}
                            </button>
                        ) : (
                            <div className="w-full bg-emerald text-void font-display font-black py-4 rounded-xl flex items-center justify-center gap-2">
                                <ShieldCheck className="w-5 h-5" />
                                AÑADIDA A TU COLECCIÓN
                            </div>
                        )}
                    </div>
                </div>

                {/* X de cierre */}
                <button 
                    onClick={onClose}
                    className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center text-white/20 hover:text-white"
                >
                    ✕
                </button>
            </motion.div>
        </div>
    )
}
