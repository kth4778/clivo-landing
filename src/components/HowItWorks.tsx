import { motion } from 'framer-motion'
import { Radio, Zap, Upload, ArrowRight } from 'lucide-react'
import { useInView } from '@/hooks/useInView'

const steps = [
  {
    num: '01',
    icon: Radio,
    title: '실시간 분석',
    lines: ['라이브 도중 채팅 반응', '+ 영상을 동시에', 'AI 분석'],
    color: '#7c3aed',
  },
  {
    num: '02',
    icon: Zap,
    title: '자동 감지',
    lines: ['채팅 폭발 구간,', '킬, 역전 장면', '자동 태깅'],
    color: '#a855f7',
  },
  {
    num: '03',
    icon: Upload,
    title: '즉시 업로드',
    lines: ['방송 종료 전에', '클립이 플랫폼에', '올라가 있음'],
    color: '#06b6d4',
  },
]

export default function HowItWorks() {
  const { ref, inView } = useInView()

  return (
    <section ref={ref} className="py-24 px-5 bg-bg-base">
      <div className="max-w-5xl mx-auto">
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
            PokeClip은{' '}
            <span className="gradient-text">방송 중에 이미 끝냅니다</span>
          </h2>
        </motion.div>

        <div className="flex flex-col md:flex-row items-stretch gap-4 md:gap-0">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={step.num} className="flex flex-col md:flex-row items-center flex-1">
                <motion.div
                  initial={{ opacity: 0, y: 32 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.55, delay: i * 0.18 }}
                  className="glass-card rounded-2xl p-8 flex flex-col items-center text-center gap-4 flex-1 border border-bg-border w-full"
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background: `${step.color}20`, border: `1px solid ${step.color}50` }}
                  >
                    <Icon size={24} style={{ color: step.color }} />
                  </div>
                  <span
                    className="font-syne font-bold text-4xl"
                    style={{ color: `${step.color}30` }}
                  >
                    {step.num}
                  </span>
                  <h3 className="font-syne font-bold text-text-primary text-xl">{step.title}</h3>
                  <div className="flex flex-col gap-1">
                    {step.lines.map(line => (
                      <p key={line} className="text-text-muted text-sm leading-relaxed">
                        {line}
                      </p>
                    ))}
                  </div>
                </motion.div>

                {i < steps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: i * 0.18 + 0.3 }}
                    className="flex items-center justify-center my-2 md:my-0 md:mx-1 flex-shrink-0"
                  >
                    <ArrowRight
                      size={20}
                      className="text-text-hint rotate-90 md:rotate-0"
                    />
                  </motion.div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
