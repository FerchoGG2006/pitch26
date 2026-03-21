import React from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col h-screen overflow-hidden text-txt">
            <header className="h-16 flex-shrink-0 border-b border-rim bg-deep/80 backdrop-blur-md px-4 flex items-center justify-between z-10">
                <div className="font-display font-black text-2xl tracking-tighter text-gold">PITCH 26</div>
                <div className="flex items-center gap-3">
                    <div className="bg-panel px-3 py-1 rounded-full text-xs font-mono font-bold text-emerald border border-rim">500 XP</div>
                    <div className="w-8 h-8 rounded-full bg-rim border-2 border-void"></div>
                </div>
            </header>

            <div className="h-8 bg-panel flex items-center px-4 overflow-hidden border-b border-rim z-10 flex-shrink-0">
                <div className="text-[11px] font-mono text-txt2 tracking-widest whitespace-nowrap overflow-hidden relative w-full">
                    <div className="inline-block animate-[ticker_20s_linear_infinite]">
                        <span className="text-fire font-bold">● VIVO</span> ARG 2 - 0 FRA 45&apos; &nbsp;&nbsp;|&nbsp;&nbsp; BRA 1 - 1 ENG 82&apos; &nbsp;&nbsp;|&nbsp;&nbsp; ESP 3 - 0 POR F
                    </div>
                </div>
            </div>

            <main className="flex-1 overflow-y-auto relative z-0">
                {children}
            </main>

            <footer className="h-16 bg-deep/90 backdrop-blur-md border-t border-rim flex justify-around items-center px-2 flex-shrink-0 z-10">
                <button className="flex flex-col items-center gap-1 text-txt opacity-50 hover:opacity-100">
                    <div className="w-6 h-6 border-2 border-current rounded-sm" />
                    <span className="text-[10px] font-bold">COLECCIÓN</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-txt opacity-50 hover:opacity-100">
                    <div className="w-6 h-6 border-2 border-current rounded-sm" />
                    <span className="text-[10px] font-bold">MERCADO</span>
                </button>
                <button className="w-12 h-12 bg-gradient-to-tr from-gold to-gold-dark rounded-full shadow-lg shadow-gold/20 flex flex-col items-center justify-center -translate-y-4 border-2 border-void">
                    <div className="w-5 h-5 bg-void rounded-sm"></div>
                </button>
                <button className="flex flex-col items-center gap-1 text-txt opacity-50 hover:opacity-100">
                    <div className="w-6 h-6 border-2 border-current rounded-sm" />
                    <span className="text-[10px] font-bold">DUELOS</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-txt opacity-50 hover:opacity-100">
                    <div className="w-6 h-6 border-2 border-fire rounded-sm" />
                    <span className="text-[10px] font-bold text-fire">MOMENTOS</span>
                </button>
            </footer>
        </div>
    );
}
