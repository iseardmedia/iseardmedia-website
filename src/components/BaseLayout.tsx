import { Poppins } from 'next/font/google'
import { GoogleTagManager } from '@next/third-parties/google'
import clsx from 'clsx'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import '@/styles/tailwind.css'
import React from 'react'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-poppins',
})

export default async function BaseLayout({
  children,
  locale,
}: {
  children: React.ReactNode
  locale: string
}) {
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages({ locale })

  return (
    <html
      lang={locale}
      className={clsx(
        'h-full scroll-smooth bg-white antialiased',
        poppins.variable,
      )}
    >
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID as string} />
      <body className="flex h-full flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
