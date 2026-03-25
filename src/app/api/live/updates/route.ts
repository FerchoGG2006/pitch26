import { liveEvents } from '@/lib/live-engine'
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * Endpoint de Server-Sent Events (SSE) para actualizaciones en tiempo real.
 * Los clientes se conectan aquí para recibir cambios de rating y eventos de partido.
 */
export async function GET(req: NextRequest) {
    const responseStream = new TransformStream()
    const writer = responseStream.writable.getWriter()
    const encoder = new TextEncoder()

    const onUpdate = (data: any) => {
        const payload = `data: ${JSON.stringify(data)}\n\n`
        writer.write(encoder.encode(payload))
    }

    // Suscribirse a los eventos del motor global
    liveEvents.on('update', onUpdate)
    liveEvents.on('momento', onUpdate)

    // Intervalo de heartbeat para mantener la conexión viva (PWA requirement)
    const heartbeat = setInterval(() => {
        writer.write(encoder.encode(': heartbeat\n\n'))
    }, 15000)

    // Manejar desconexión
    req.signal.onabort = () => {
        clearInterval(heartbeat)
        liveEvents.off('update', onUpdate)
        liveEvents.off('momento', onUpdate)
        writer.close()
    }

    return new Response(responseStream.readable, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
        },
    })
}
