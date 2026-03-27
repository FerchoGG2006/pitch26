'use client'

import React from 'react';
import { StatusBar } from '@/components/layout/StatusBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { usePathname } from 'next/navigation';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuth = pathname.startsWith('/auth');

    // Viewport Locking for Mobile Game feel (430px centered)
    return (
        <div className="min-h-screen bg-[#020817] flex justify-center overflow-x-hidden font-sans antialiased text-white selection:bg-purple/30">
            
            {/* Global Mesh Background (Shared) */}
            <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(56,217,245,0.08)_0%,transparent_70%)] pointer-events-none" />

            <div className="relative w-full max-w-[430px] min-h-screen bg-void shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col z-10 border-x border-white/5 border-glow">
                
                {!isAuth && (
                    <div className="absolute top-0 left-0 right-0 z-[100] w-full bg-[#0A1422]/80 backdrop-blur-xl border-b border-white/5">
                        <StatusBar />
                    </div>
                )}

                <main className="flex-1 overflow-y-auto no-scrollbar pt-11 pb-32">
                    {children}
                </main>

                {!isAuth && <BottomNav />}
            </div>

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .border-glow {
                   box-shadow: 0 0 40px rgba(0,0,0,0.5);
                }
            `}</style>
        </div>
    );
}
