import { motion } from 'framer-motion'
import { ArrowRight, Gift, Bell } from 'lucide-react'
import { useInView } from '@/hooks/useInView'

const GOOGLE_FORM_LINK = 'https://docs.google.com/forms/d/e/1FAIpQLSf56_6z4cvxvFaRmbgW5zMxkxAYmG8rKBFBWeB4Be-ngUlJqA/viewform?usp=sharing&ouid=107121737297056392953'

export default function CTA() {
  const { ref, inView } = useInView()

  return (
    <section id="인터뷰신청" ref={ref} className="py-32 px-5 relative overflow-hidden">
      {/* Gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(6,182,212,0.06) 50%, rgba(10,10,15,0) 100%)',
        }}
      />
      <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center text-center gap-7">
        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-syne font-bold text-text-primary"
          style={{ fontSize: 'clamp(26px, 4vw, 42px)' }}
        >
          지금 가장 불편한 게 뭔지
          <br />
          <span className="gradient-text">알려주세요</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-text-muted text-base leading-relaxed"
          style={{ lineHeight: 1.75 }}
        >
          편집자·스트리머 10인의 인터뷰를 통해 Clivo.ai를 만들어가고 있습니다.
          <br className="hidden sm:block" />
          30분 인터뷰에 참여해 주시면 출시 시 서비스 이용권을 드립니다.
        </motion.p>

        {/* Benefit badges */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-purple/15 border border-accent-purple/30 text-sm text-accent-purple font-medium">
            <Gift size={15} />
            서비스 이용권 증정
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 text-sm text-accent-cyan font-medium">
            <Bell size={15} />
            출시 알림 우선 발송
          </span>
        </motion.div>

        {/* CTA Button */}
        <motion.a
          href={GOOGLE_FORM_LINK}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.26 }}
          whileHover={{ scale: 1.03 }}
          className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-accent-purple text-white font-bold text-lg glow-purple glow-purple-hover transition-all duration-200"
        >
          구글폼으로 인터뷰 신청하기
          <ArrowRight size={20} />
        </motion.a>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="text-sm text-text-hint"
        >
          부담 없는 30분 대화입니다 · 현재 00명 참여 중
        </motion.p>
      </div>
    </section>
  )
}
