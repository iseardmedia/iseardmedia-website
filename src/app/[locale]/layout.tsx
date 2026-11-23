import '@/styles/tailwind.css'
import React from 'react'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import BaseLayout from '@/components/BaseLayout'
import { generateAppMetadata } from '@/utils/metadata'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

// Pre-render every locale at build time (required for `output: 'export'`).
export const dynamicParams = false

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Omit<Props, 'children'>) {
  const { locale } = await params
  return generateAppMetadata(locale)
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  // Enable static rendering for next-intl
  setRequestLocale(locale)

  return <BaseLayout locale={locale}>{children}</BaseLayout>
}
