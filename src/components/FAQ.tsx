import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useInView } from '@/hooks/useInView'

const faqs = [
  {
    q: '인터뷰는 어떻게 진행되나요?',
    a: '온라인(구글밋/줌) 또는 오프라인 중 편하신 방식으로 진행합니다. 30분 동안 편집 작업에서 불편한 점을 자유롭게 말씀해 주시면 됩니다. 별도 준비물은 없습니다.',
  },
  {
    q: '비용이 있나요?',
    a: '전혀 없습니다. 무료로 진행되며, 참여해 주신 분께는 출시 후 서비스 이용권을 증정합니다.',
  },
  {
    q: '인터뷰 내용은 어디에 활용되나요?',
    a: '서비스가 실제로 필요한지 판단하는 용도로만 활용됩니다. 외부에 공개되거나 다른 목적으로 사용되지 않습니다.',
  },
  {
    q: '인터뷰 후 서비스를 꼭 써야 하나요?',
    a: '아닙니다. 인터뷰 참여가 서비스 이용으로 이어지지 않습니다. 부담 없이 참여해 주세요.',
  },
  {
    q: '개인정보는 어떻게 처리되나요?',
    a: '인터뷰 내용은 서비스 검토 목적으로만 활용되며, 이후 즉시 폐기됩니다.',
  },
]

function FAQItem({ q, a, index, inView }: { q: string; a: string; index: number; inView: boolean }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="border-b border-bg-border last:border-0"
    >
      <button
        className="w-full flex items-center justify-between py-5 text-left gap-4 group"
        onClick={() => setOpen(v => !v)}
      >
        <span className="text-text-primary font-medium text-sm md:text-base group-hover:text-accent-purple transition-colors duration-200">
          {q}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="flex-shrink-0 text-text-muted group-hover:text-accent-purple transition-colors"
        >
          <ChevronDown size={18} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-text-muted text-sm leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQ() {
  const { ref, inView } = useInView()

  return (
    <section id="FAQ" ref={ref} className="py-24 px-5 bg-bg-surface">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2
            className="font-syne font-bold text-text-primary"
            style={{ fontSize: 'clamp(24px, 3.5vw, 36px)' }}
          >
            자주 묻는 질문
          </h2>
        </motion.div>

        <div className="glass-card rounded-2xl border border-bg-border px-6 md:px-8">
          {faqs.map((item, i) => (
            <FAQItem key={item.q} q={item.q} a={item.a} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  )
}
