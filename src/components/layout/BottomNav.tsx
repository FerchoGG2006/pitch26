'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutGrid, Swords, ShoppingBag, Zap } from 'lucide-react';

const TABS = [
    { id: 'coleccion', label: 'COLECCIÓN', icon: LayoutGrid, href: '/coleccion' },
    { id: 'play', label: 'DUELOS', icon: Swords, href: '/play' },
    { id: 'mercado', label: 'MERCADO', icon: ShoppingBag, href: '/mercado' },
    { id: 'momentos', label: 'MOMENTOS', icon: Zap, href: '/momentos' },
]

export function BottomNav() {
    const pathname = usePathname();

    return (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[100] px-4 pb-8">
            <div className="relative bg-[#0A1422]/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-2 flex items-center justify-around shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
                
                {/* Active Indicator Layer */}
                <div className="absolute inset-0 z-0 pointer-events-none" />

                {TABS.map((tab) => {
                    const isActive = pathname.startsWith(tab.href);
                    
                    return (
                        <Link 
                            key={tab.id} 
                            href={tab.href}
                            className="relative flex-1 flex flex-col items-center justify-center py-3 group no-tap-highlight"
                        >
                            {isActive && (
                                <motion.div 
                                    layoutId="navTab"
                                    className="absolute inset-0 bg-white/[0.03] rounded-3xl border border-white/5"
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                />
                            )}
                            
                            <div className="relative z-10 flex flex-col items-center gap-1">
                                <tab.icon className={`w-5 h-5 transition-all duration-300 ${isActive ? 'text-gold scale-110 drop-shadow-[0_0_8px_rgba(242,196,65,0.4)]' : 'text-txt3 group-hover:text-txt2'}`} />
                                <span className={`text-[8px] font-black tracking-[1.5px] uppercase transition-all ${isActive ? 'text-white' : 'text-txt3/60'}`}>
                                    {tab.label}
                                </span>
                            </div>

                            {isActive && (
                                <motion.div 
                                    layoutId="navDot"
                                    className="absolute -bottom-1 w-1 h-1 bg-gold rounded-full shadow-[0_0_10px_#F2C441]"
                                />
                            )}
                        </Link>
                    );
                })}
            </div>
            
            <style jsx>{`
                .no-tap-highlight {
                    -webkit-tap-highlight-color: transparent;
                }
            `}</style>
        </div>
    );
}
