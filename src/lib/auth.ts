import { PrismaAdapter } from '@auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from '@/lib/prisma'

// next-auth v4 — authOptions without explicit AuthOptions type to avoid
// broken type exports when using @auth/prisma-adapter together.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const authOptions: any = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Apple provider — descomentar cuando tengas credenciales Apple Developer
    // AppleProvider({ ... }),
  ],
  session: {
    strategy: 'database' as const,
  },
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, user }: { session: any; user: any }) {
      if (session.user) {
        session.user.id = user.id
      }
      return session
    },
  },
  pages: {
    signIn: '/onboarding',
    error: '/onboarding',
  },
}
