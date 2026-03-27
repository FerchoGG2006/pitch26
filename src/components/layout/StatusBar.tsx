'use client'

import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

export function StatusBar() {
    const [time, setTime] = useState('9:41');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            setTime(`${hours}:${minutes}`);
        };
        updateTime();
        const interval = setInterval(updateTime, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-11 flex items-center justify-between px-8 pt-2 select-none z-[100] bg-transparent">
            <div className="text-[14px] font-black text-white/90 tracking-tight">
                {time}
            </div>
            
            {/* Notch Simulation Area (Invisible but reserved) */}
            <div className="flex-1" />

            <div className="flex items-center gap-1.5 opacity-80">
                <Signal className="w-4 h-4 text-white" fill="currentColor" />
                <Wifi className="w-4 h-4 text-white" />
                <div className="flex items-center gap-1">
                    <span className="text-[12px] font-black text-white/90">99%</span>
                    <Battery className="w-5 h-5 text-white" />
                </div>
            </div>
        </div>
    );
}
