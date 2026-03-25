'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayerCard, PlayerCardType } from '@/components/cards/PlayerCard';

interface WelcomePackProps {
  onComplete: () => void;
  nation: string;
}

export default function WelcomePack({ onComplete, nation }: WelcomePackProps) {
  const [status, setStatus] = useState<'idle' | 'opening' | 'revealing' | 'done'>('idle');
  const [revealedIndex, setRevealedIndex] = useState(0);

  // Generamos 3 cartas basadas en la nación elegida
  const cards: PlayerCardType[] = [
    {
      id: 'w1', playerId: 'p-w1', playerName: nation === 'AR' ? 'JULIÁN ÁLVAREZ' : (nation === 'BR' ? 'VINÍCIUS JR' : 'MBAPPÉ'),
      position: 'FWD', nationality: nation, flag: nation === 'AR' ? '🇦🇷' : (nation === 'BR' ? '🇧🇷' : '🇫🇷'),
      tier: 'ELITE', rating: 88, stats: { rit: 88, tir: 86, vis: 82, dri: 87, pas: 80, fis: 78 },
      evolution: { deltaToday: 0, deltaTournament: 0, lastEvent: 'Draft Inicial' }
    },
    {
      id: 'w2', playerId: 'p-w2', playerName: 'VALVERDE', position: 'MID', nationality: 'UY', flag: '🇺🇾',
      tier: 'BASE', rating: 86, stats: { rit: 87, tir: 82, vis: 84, dri: 83, pas: 85, fis: 88 },
      evolution: { deltaToday: 0, deltaTournament: 0, lastEvent: 'Draft Inicial' }
    },
    {
      id: 'w3', playerId: 'p-w3', playerName: 'GAVI', position: 'MID', nationality: 'ES', flag: '🇪🇸',
      tier: 'RISING', rating: 85, stats: { rit: 80, tir: 75, vis: 88, dri: 86, pas: 90, fis: 74 },
      evolution: { deltaToday: 0, deltaTournament: 0, lastEvent: 'Draft Inicial' }
    }
  ];

  const handleOpen = () => {
    setStatus('opening');
    setTimeout(() => setStatus('revealing'), 1500);
  };

  const handleNext = () => {
    if (revealedIndex < 2) {
      setRevealedIndex(prev => prev + 1);
    } else {
      setStatus('done');
      setTimeout(onComplete, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-void/95 backdrop-blur-2xl p-6">
      <AnimatePresence mode="wait">
        {status === 'idle' && (
          <motion.div 
            key="idle"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            className="flex flex-col items-center"
          >
            <div 
                className="w-64 h-96 bg-gradient-to-b from-gold to-gold-dark rounded-2xl relative shadow-[0_0_50px_rgba(240,192,64,0.3)] border-4 border-white/20 flex items-center justify-center cursor-pointer group" 
                onClick={handleOpen}
            >
                <div className="absolute inset-4 border-2 border-white/10 rounded-xl" />
                <div className="text-void font-display font-black text-6xl rotate-90 tracking-tighter select-none">PITCH 26</div>
                <div className="absolute bottom-8 text-void font-bold tracking-[0.3em] text-[10px] uppercase">Sobre de Bienvenida</div>
                
                <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                  <motion.div 
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                  />
                </div>
            </div>
            <motion.p 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="mt-12 text-gold font-display font-black text-2xl tracking-widest uppercase"
            >
              TOCA PARA ABRIR
            </motion.p>
          </motion.div>
        )}

        {status === 'opening' && (
          <motion.div 
            key="opening"
            animate={{ 
              rotate: [0, -4, 4, -4, 4, 0],
              scale: [1, 1.1, 1.2, 1.5, 5],
              filter: ['brightness(1)', 'brightness(2)', 'brightness(20)']
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="w-64 h-96 bg-gold rounded-2xl"
          />
        )}

        {status === 'revealing' && (
          <motion.div 
            key="revealing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center w-full max-w-sm"
          >
            <div className="relative w-full h-[450px] flex items-center justify-center">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={cards[revealedIndex].id}
                    initial={{ scale: 0.3, rotateY: 180, opacity: 0, filter: 'brightness(5)' }}
                    animate={{ scale: 1, rotateY: 0, opacity: 1, filter: 'brightness(1)' }}
                    exit={{ x: -300, opacity: 0, rotate: -20, scale: 0.8 }}
                    transition={{ type: "spring", damping: 12, stiffness: 100 }}
                    className="absolute"
                  >
                    <PlayerCard card={cards[revealedIndex]} />
                  </motion.div>
                </AnimatePresence>
            </div>
            
            <motion.button 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              onClick={handleNext}
              className="mt-8 bg-gold text-void px-12 py-4 rounded-full font-display font-black text-xl tracking-tighter uppercase shadow-lg shadow-gold/20 active:scale-95 transition-transform"
            >
              {revealedIndex < 2 ? 'Revelar Siguiente' : 'Cerrar Pack'}
            </motion.button>

            <div className="mt-8 flex gap-3">
              {[0, 1, 2].map(i => (
                <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${i === revealedIndex ? 'bg-gold w-6' : 'bg-white/20'}`} />
              ))}
            </div>
          </motion.div>
        )}

        {status === 'done' && (
          <motion.div 
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="text-gold font-display font-black text-6xl mb-4 italic tracking-tighter animate-bounce uppercase">¡Bienvenido!</div>
            <p className="text-txt2 font-body text-lg italic uppercase tracking-widest">Inicia sesión para reclamar tu escuadrón</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
