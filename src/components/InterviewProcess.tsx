import { motion } from 'framer-motion'
import { ClipboardList, Phone, CalendarCheck, MessageCircle } from 'lucide-react'
import { useInView } from '@/hooks/useInView'

const steps = [
  {
    num: 1,
    icon: ClipboardList,
    title: '구글폼 신청',
    desc: '이메일 주소만 남겨주세요',
  },
  {
    num: 2,
    icon: Phone,
    title: '팀에서 연락',
    desc: '3일 내로 연락드립니다',
  },
  {
    num: 3,
    icon: CalendarCheck,
    title: '일정 조율',
    desc: '온/오프라인 선택 가능',
  },
  {
    num: 4,
    icon: MessageCircle,
    title: '30분 인터뷰',
    desc: '편하게 대화합니다',
  },
]

export default function InterviewProcess() {
  const { ref, inView } = useInView()

  return (
    <section ref={ref} className="py-24 px-5 bg-bg-base">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            className="font-syne font-bold text-text-primary"
            style={{ fontSize: 'clamp(24px, 3.5vw, 36px)' }}
          >
            이렇게 진행됩니다
          </h2>
        </motion.div>

        {/* Desktop: Horizontal timeline */}
        <div className="hidden md:flex items-start gap-0 relative">
          {/* Connecting line */}
          <div className="absolute top-7 left-[calc(12.5%)] right-[calc(12.5%)] h-px bg-bg-border" />

          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="flex-1 flex flex-col items-center text-center gap-4 px-4 relative"
              >
                <div className="w-14 h-14 rounded-full bg-bg-surface border-2 border-accent-purple/60 flex items-center justify-center z-10 glow-purple">
                  <Icon size={22} className="text-accent-purple" />
                </div>
                <span className="text-xs font-bold text-accent-purple/60">STEP {step.num}</span>
                <h3 className="font-syne font-bold text-text-primary text-base">{step.title}</h3>
                <p className="text-text-muted text-sm">{step.desc}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Mobile: Vertical timeline */}
        <div className="flex flex-col md:hidden gap-0 relative pl-8">
          <div className="absolute left-[27px] top-7 bottom-7 w-px bg-bg-border" />
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.45, delay: i * 0.12 }}
                className="relative flex gap-5 pb-10 last:pb-0"
              >
                <div className="absolute -left-8 w-14 h-14 rounded-full bg-bg-surface border-2 border-accent-purple/60 flex items-center justify-center z-10 flex-shrink-0 glow-purple">
                  <Icon size={20} className="text-accent-purple" />
                </div>
                <div className="pt-1 pl-8">
                  <span className="text-xs font-bold text-accent-purple/60 block mb-1">
                    STEP {step.num}
                  </span>
                  <h3 className="font-syne font-bold text-text-primary text-base mb-1">
                    {step.title}
                  </h3>
                  <p className="text-text-muted text-sm">{step.desc}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
