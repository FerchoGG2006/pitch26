'use client'

import React, { useEffect, useRef } from 'react'

/**
 * Componente que rastrea el movimiento del mouse/toque y actualiza
 * las variables CSS globales para el efecto de luz en el fondo.
 */
export function DynamicBackground() {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth) * 100
            const y = (e.clientY / window.innerHeight) * 100
            
            document.documentElement.style.setProperty('--mouse-x', `${x}%`)
            document.documentElement.style.setProperty('--mouse-y', `${y}%`)
        }

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                const x = (e.touches[0].clientX / window.innerWidth) * 100
                const y = (e.touches[0].clientY / window.innerHeight) * 100
                
                document.documentElement.style.setProperty('--mouse-x', `${x}%`)
                document.documentElement.style.setProperty('--mouse-y', `${y}%`)
            }
        }

        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('touchmove', handleTouchMove)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('touchmove', handleTouchMove)
        }
    }, [])

    return null // Solo maneja lógica de efectos globales
}
