/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

// next-auth v4 with Next.js App Router
const handler = (NextAuth as any)(authOptions)

export { handler as GET, handler as POST }
