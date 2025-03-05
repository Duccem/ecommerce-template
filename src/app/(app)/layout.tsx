import { Nunito } from 'next/font/google'
import React from 'react'
import './globals.css'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

const nunito = Nunito({
  subsets: ['latin'],
})

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${nunito.className} antialiased box-border relative`}
      >
        <main>{children}</main>
      </body>
    </html>
  )
}
