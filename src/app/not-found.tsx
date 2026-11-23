import BaseLayout from '@/components/BaseLayout'
import { routing } from '@/i18n/routing'
import NotFoundPage from '@/components/NotFoundPage'
import { setRequestLocale } from 'next-intl/server'

export default function NotFound() {
  setRequestLocale(routing.defaultLocale)

  return (
    <BaseLayout locale={routing.defaultLocale}>
      <NotFoundPage />
    </BaseLayout>
  )
}
