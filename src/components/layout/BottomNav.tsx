'use client'

import React from 'react'
import { LayoutGrid, ShoppingBag, Trophy, Zap, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

const NAV_ITEMS = [
    { label: 'COLECCIÓN', icon: LayoutGrid, href: '/coleccion' },
    { label: 'MERCADO', icon: ShoppingBag, href: '/mercado' },
    { label: 'PLAY', icon: Zap, href: '/play', center: true },
    { label: 'DUELOS', icon: Trophy, href: '/duelos' },
    { label: 'MOMENTOS', icon: Zap, href: '/momentos', color: 'text-fire' },
]

export function BottomNav() {
    const pathname = usePathname()

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50">
            <nav className="bg-deep/80 backdrop-blur-xl border border-rim rounded-2xl h-16 px-4 flex items-center justify-between shadow-2xl relative">
                {NAV_ITEMS.map((item, idx) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon

                    if (item.center) {
                        return (
                            <Link key={idx} href={item.href} className="relative -top-6">
                                <motion.div 
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="w-14 h-14 bg-gradient-to-tr from-gold to-gold-dark rounded-2xl shadow-lg shadow-gold/20 flex items-center justify-center border-4 border-void"
                                >
                                    <Icon className="w-8 h-8 text-void fill-current" />
                                </motion.div>
                            </Link>
                        )
                    }

                    return (
                        <Link 
                            key={idx} 
                            href={item.href} 
                            className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? 'opacity-100 scale-110' : 'opacity-40 hover:opacity-100'}`}
                        >
                            <Icon className={`w-5 h-5 ${item.color || 'text-txt'}`} />
                            <span className={`text-[9px] font-black tracking-tighter ${item.color || 'text-txt'}`}>{item.label}</span>
                            {isActive && (
                                <motion.div 
                                    layoutId="nav-glow"
                                    className="absolute -bottom-1 w-1 h-1 bg-gold rounded-full shadow-[0_0_10px_#F0C040]"
                                />
                            )}
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}
