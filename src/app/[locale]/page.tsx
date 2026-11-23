import { About } from '@/components/About'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { Partners } from '@/components/Partners'
import { Projects } from '@/components/Projects'
import { Services } from '@/components/Services'
import Contact from '@/components/Contact'
import { setRequestLocale } from 'next-intl/server'

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  // Enable static rendering for next-intl
  setRequestLocale(locale)

  return (
    <div className="selection:bg-primary selection:text-white">
      <Header />
      <main>
        <Hero />
        <Partners />
        <Services />
        <Projects />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
