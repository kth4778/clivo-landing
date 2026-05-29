import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const GOOGLE_FORM_LINK = 'https://docs.google.com/forms/d/e/1FAIpQLSf56_6z4cvxvFaRmbgW5zMxkxAYmG8rKBFBWeB4Be-ngUlJqA/viewform?usp=sharing&ouid=107121737297056392953'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-5 pt-24 pb-16">
      {/* Background glows */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <motion.div
          animate={{ x: [0, 30, -20, 0], y: [0, -20, 15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)',
          }}
        />
        <motion.div
          animate={{ x: [0, -25, 20, 0], y: [0, 18, -15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          className="absolute top-[-5%] right-[-5%] w-[420px] h-[420px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
          }}
        />
        {/* Dot grid */}
        <div className="absolute inset-0 dot-grid opacity-40" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto gap-6">
        {/* Badge */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium text-accent-purple border border-accent-purple/40 bg-accent-purple/10">
            ✦ 소프트웨어 마에스트로 팀 3K
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="font-syne font-extrabold leading-tight text-shadow-glow w-full"
          style={{ fontSize: 'clamp(28px, 4.5vw, 60px)' }}
        >
          <span className="gradient-text block whitespace-nowrap">라이브가 끝나기 전에,</span>
          <span className="text-text-primary block whitespace-nowrap">하이라이트는 이미 완성됩니다</span>
        </motion.h1>

        {/* Sub copy */}
        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-text-muted text-base md:text-lg leading-relaxed max-w-xl break-keep"
          style={{ lineHeight: 1.75 }}
        >
          <span className="whitespace-nowrap">AI가 실시간으로 채팅과 영상을 분석해 하이라이트 클립을 자동 감지·추출·업로드합니다.</span>
          <br className="hidden md:block" />
          치지직·SOOP 전용 — 편집자는 VOD를 처음부터 볼 필요가 없습니다.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
        >
          <a
            href={GOOGLE_FORM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-accent-purple text-white font-semibold text-base glow-purple glow-purple-hover hover:scale-[1.03] transition-all duration-200"
          >
            인터뷰 신청하기
            <ArrowRight size={18} />
          </a>
          <a
            href="#서비스소개"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-bg-border text-text-muted hover:text-text-primary hover:border-text-hint font-semibold text-base transition-all duration-200"
          >
            서비스 소개 보기
          </a>
        </motion.div>

        {/* Aux text */}
        <motion.p
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-sm text-text-hint"
        >
          현재 얼리 인터뷰 참여자 모집 중 · 선착순 10인
        </motion.p>
      </div>
    </section>
  )
}
