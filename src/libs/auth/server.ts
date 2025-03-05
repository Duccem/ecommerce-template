import { PrismaClient } from '@prisma/client'
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { nextCookies } from 'better-auth/next-js'
import { bearer } from 'better-auth/plugins'
import { headers } from 'next/headers'
import { cache } from 'react'
const prisma = new PrismaClient()
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  advanced: {
    generateId: false,
  },
  user: {
    additionalFields: {},
  },
  socialProviders: {
    google: {
      enabled: true,
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  plugins: [nextCookies(), bearer()],
  trustedOrigins: ['http://localhost:3000'],
})

export type BetterSession = typeof auth.$Infer.Session
export type BetterUser = typeof auth.$Infer.Session.user
export const getSession: () => Promise<BetterSession | null> = cache(async () => {
  return await auth.api.getSession({
    headers: await headers(),
  })
})
