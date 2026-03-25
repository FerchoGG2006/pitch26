import { Redis } from '@upstash/redis'

// Singleton para el cliente de Redis (Upstash)
// Si no hay variables de entorno, devolvemos un mock para desarrollo
const createRedisClient = () => {
    const url = process.env.UPSTASH_REDIS_REST_URL
    const token = process.env.UPSTASH_REDIS_REST_TOKEN

    if (!url || !token) {
        console.warn('⚠️ Redis not configured. Using in-memory mock for development.')
        
        // Mock simple para desarrollo sin Redis real
        const storage = new Map<string, string>()
        
        return {
            get: async (key: string) => storage.get(key) || null,
            set: async (key: string, value: string) => { storage.set(key, value); return 'OK' },
            del: async (key: string) => { storage.delete(key); return 1 },
            hget: async (key: string, field: string) => {
                const h = JSON.parse(storage.get(key) || '{}')
                return h[field] || null
            },
            hset: async (key: string, obj: Record<string, any>) => {
                const current = JSON.parse(storage.get(key) || '{}')
                const updated = { ...current, ...obj }
                storage.set(key, JSON.stringify(updated))
                return 1
            },
            hgetall: async (key: string) => JSON.parse(storage.get(key) || '{}')
        } as unknown as Redis
    }

    return new Redis({ url, token })
}

export const redis = createRedisClient()
