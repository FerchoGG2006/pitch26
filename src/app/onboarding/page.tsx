'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn } from 'next-auth/react';
import WelcomePack from '@/components/onboarding/WelcomePack';

type OnboardingStep = 'NATION_PICK' | 'PACK_OPEN' | 'SIGN_IN';

const NATIONS = [
  { id: 'AR', flag: '🇦🇷', name: 'Argentina' },
  { id: 'BR', flag: '🇧🇷', name: 'Brasil' },
  { id: 'FR', flag: '🇫🇷', name: 'Francia' },
  { id: 'ES', flag: '🇪🇸', name: 'España' },
  { id: 'GB', flag: '🇬🇧', name: 'Inglaterra' },
  { id: 'DE', flag: '🇩🇪', name: 'Alemania' },
  { id: 'IT', flag: '🇮🇹', name: 'Italia' },
  { id: 'UY', flag: '🇺🇾', name: 'Uruguay' },
];

export default function OnboardingPage() {
  const [step, setStep] = useState<OnboardingStep>('NATION_PICK');
  const [selectedNation, setSelectedNation] = useState<string | null>(null);

  const handleNationSelect = (id: string) => {
    setSelectedNation(id);
  };

  const handleContinueToPack = () => {
    if (selectedNation) {
      setStep('PACK_OPEN');
    }
  };

  const handlePackComplete = () => {
    setStep('SIGN_IN');
  };

  const handleSignIn = () => {
    signIn('google', { callbackUrl: '/coleccion' });
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative z-10 overflow-hidden">
      <AnimatePresence mode="wait">
        {step === 'NATION_PICK' && (
          <motion.div 
            key="pick"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-sm flex flex-col items-center"
          >
            <h1 className="text-4xl font-display font-black text-gold mb-2 uppercase tracking-tight italic">ELIGE TU NACIÓN</h1>
            <p className="text-txt2 text-sm mb-10 uppercase tracking-[0.2em] font-bold">Tu primera carta depende de esto</p>
            
            <div className="grid grid-cols-4 gap-4 w-full mb-12">
              {NATIONS.map(n => (
                <button 
                  key={n.id} 
                  onClick={() => handleNationSelect(n.id)}
                  className={`aspect-square flex flex-col items-center justify-center rounded-2xl border-2 transition-all duration-300 ${
                    selectedNation === n.id 
                    ? 'bg-gold border-white shadow-[0_0_20px_rgba(240,192,64,0.4)] scale-110' 
                    : 'bg-panel border-rim hover:border-gold/50'
                  }`}
                >
                  <span className="text-4xl mb-1">{n.flag}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-tighter ${selectedNation === n.id ? 'text-void' : 'text-txt2'}`}>{n.id}</span>
                </button>
              ))}
            </div>

            <button 
              disabled={!selectedNation}
              onClick={handleContinueToPack}
              className={`w-full py-5 rounded-full font-display font-black text-2xl uppercase tracking-widest transition-all duration-500 shadow-xl ${
                selectedNation 
                ? 'bg-gradient-to-r from-gold to-gold-dark text-void shadow-gold/20' 
                : 'bg-rim text-txt2 opacity-50 cursor-not-allowed'
              }`}
            >
              RECLAMAR PACK
            </button>
          </motion.div>
        )}

        {step === 'PACK_OPEN' && (
          <WelcomePack nation={selectedNation!} onComplete={handlePackComplete} />
        )}

        {step === 'SIGN_IN' && (
          <motion.div 
            key="signin"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm flex flex-col items-center text-center"
          >
             <h1 className="text-5xl font-display font-black text-white mb-4 uppercase tracking-tighter leading-none italic">
                CREA TU<br/><span className="text-gold underline decoration-white/20 underline-offset-8">HISTORIA</span>
             </h1>
             <p className="text-txt2 text-sm mb-12 max-w-[280px]">Únete a miles de coleccionistas y domina el Mundial 2026.</p>
             
             <div className="w-full space-y-4">
                <button 
                  onClick={handleSignIn}
                  className="w-full bg-white text-void py-4 rounded-xl font-bold flex items-center justify-center gap-4 hover:bg-gold transition-colors active:scale-95 duration-200"
                >
                  <div className="w-6 h-6 bg-rim/10 rounded-full flex items-center justify-center font-black">G</div>
                  <span>CONTINUAR CON GOOGLE</span>
                </button>
                <button 
                   disabled
                   className="w-full bg-panel border border-rim text-txt2 py-4 rounded-xl font-bold flex items-center justify-center gap-4 opacity-50 cursor-not-allowed"
                >
                  <div className="w-6 h-6 border border-current rounded-full flex items-center justify-center text-[10px] font-black italic">A</div>
                  <span>SÓLO APPLE (PRÓXIMAMENTE)</span>
                </button>
             </div>

             <p className="mt-8 text-[11px] text-txt2 px-8 uppercase font-bold tracking-widest leading-loose">
                AL CONTINUAR ACEPTAS NUESTROS <span className="text-gold">TÉRMINOS DE SERVICIO</span>
             </p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
