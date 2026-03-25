'use client';

import { BottomNav } from '@/components/layout/BottomNav';
import { LiveTicker } from '@/components/layout/LiveTicker';
import { MomentoClaim } from '@/components/momentos/MomentoClaim';
import { useLiveUpdates } from '@/hooks/useLiveUpdates';
import { AnimatePresence } from 'framer-motion';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { activeMomento, clearMomento } = useLiveUpdates()

    const handleClaim = (id: string) => {
        console.log('Claiming Momento:', id)
        // La lógica persistente se llamará desde el componente MomentoClaim
    }

    return (
        <div className="flex flex-col h-screen overflow-hidden text-txt bg-void">
            <header className="h-16 flex-shrink-0 border-b border-rim bg-deep/80 backdrop-blur-md px-4 flex items-center justify-between z-10">
                <div className="font-display font-black text-2xl tracking-tighter text-gold italic uppercase text-glow">PITCH 26</div>
                <div className="flex items-center gap-3">
                    <div className="bg-panel px-3 py-1 rounded-full text-xs font-mono font-bold text-emerald border border-rim">500 XP</div>
                    <div className="w-8 h-8 rounded-full bg-rim border-2 border-void overflow-hidden">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full object-cover" />
                    </div>
                </div>
            </header>

            <LiveTicker />

            <main className="flex-1 overflow-y-auto relative z-0 pb-32">
                {children}
            </main>

            <BottomNav />

            {/* Modal Global de Momentos */}
            <AnimatePresence>
                {activeMomento && (
                    <MomentoClaim 
                        card={activeMomento}
                        onClaim={handleClaim}
                        onClose={clearMomento}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
