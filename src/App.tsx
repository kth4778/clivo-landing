import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import PainPoints from '@/components/PainPoints'
import LiveDashboard from '@/components/LiveDashboard'
import HowItWorks from '@/components/HowItWorks'
import Comparison from '@/components/Comparison'
import InterviewProcess from '@/components/InterviewProcess'
import FAQ from '@/components/FAQ'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-bg-base font-pretendard">
      <Nav />
      <main>
        <Hero />
        <PainPoints />
        <LiveDashboard />
        <HowItWorks />
        <Comparison />
        <InterviewProcess />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
