import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export async function generateAppMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta' })

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    ),
    title: {
      template: t('title.template'),
      default: t('title.default'),
    },
    description: t('description'),
    openGraph: {
      images: `/images/og-${locale}.png`,
    },
  }
}
