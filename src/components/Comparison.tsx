import { motion } from 'framer-motion'
import { X, Check } from 'lucide-react'
import { useInView } from '@/hooks/useInView'

const competitors = [
  { name: 'Opus Clip', sub: 'opus.pro' },
  { name: 'Eklipse.gg', sub: 'eklipse.gg' },
  { name: 'Medal.tv', sub: 'medal.tv' },
]

interface Row {
  label: string
  desc: string
  values: (string | false)[]
  clivo: string
}

const rows: Row[] = [
  {
    label: '처리 시점',
    desc: '언제 감지하나요?',
    values: ['VOD 사후 분석', 'VOD 사후 스캔', '게임 중 실시간'],
    clivo: '라이브 도중 실시간',
  },
  {
    label: '분석 기반',
    desc: '무엇을 보나요?',
    values: ['영상 내용만', '게임 이벤트만', '게임 이벤트만'],
    clivo: '영상 + 채팅 반응',
  },
  {
    label: '치지직 · SOOP',
    desc: '한국 방송 플랫폼',
    values: [false, false, false],
    clivo: '전용 서비스',
  },
  {
    label: '지원 플랫폼',
    desc: '어디서 쓸 수 있나요?',
    values: [
      'YouTube, TikTok,\nInstagram',
      'Twitch, YouTube,\nFacebook Gaming',
      'PC 게임 전용',
    ],
    clivo: '치지직 · SOOP',
  },
  {
    label: '업로드',
    desc: '클립이 어떻게 올라가나요?',
    values: ['수동 업로드', '자동 VOD 스캔', '수동 저장'],
    clivo: '방송 종료 전 자동',
  },
  {
    label: '편집자 지원',
    desc: '전용 도구 제공',
    values: [false, false, false],
    clivo: '구간 태깅 + 시각화',
  },
]

export default function Comparison() {
  const { ref, inView } = useInView()

  return (
    <section ref={ref} className="py-24 px-5 bg-bg-surface">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-4"
        >
          <h2
            className="font-syne font-bold text-text-primary"
            style={{ fontSize: 'clamp(24px, 3.5vw, 36px)' }}
          >
            기존 서비스와{' '}
            <span className="gradient-text">무엇이 다른가요?</span>
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center text-text-hint text-sm mb-12"
        >
          Opus Clip · Eklipse.gg · Medal.tv 공식 기능 기준
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="rounded-2xl overflow-hidden border border-bg-border overflow-x-auto"
        >
          <table className="w-full min-w-[560px]">
            <thead>
              <tr style={{ background: '#1a1a2e' }}>
                <th className="py-3.5 px-6 text-left text-xs font-semibold text-text-hint uppercase tracking-wider w-[22%]">
                  비교 항목
                </th>
                {competitors.map(c => (
                  <th key={c.name} className="py-3.5 px-4 text-center text-xs font-semibold text-text-muted uppercase tracking-wider w-[19%]">
                    <span className="block">{c.name}</span>
                    <span className="block text-[11px] font-normal text-text-hint normal-case tracking-normal mt-0.5">{c.sub}</span>
                  </th>
                ))}
                <th className="py-3.5 px-6 text-center w-[21%]">
                  <span className="block text-sm font-bold text-accent-purple">PokeClip</span>
                  <span className="block text-[11px] text-accent-purple/50 mt-0.5">우리 서비스</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <motion.tr
                  key={row.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.07 }}
                  className="border-t border-bg-border transition-colors duration-150"
                  style={{ background: '#111118' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#15151e' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#111118' }}
                >
                  <td className="py-4 px-6 align-middle">
                    <span className="block text-sm font-medium text-text-primary">{row.label}</span>
                    <span className="block text-xs text-text-hint mt-0.5">{row.desc}</span>
                  </td>

                  {row.values.map((val, vi) => (
                    <td key={vi} className="py-4 px-4 text-center align-middle">
                      {val === false ? (
                        <span className="inline-flex items-center justify-center gap-1.5 text-sm text-text-hint">
                          <X size={13} className="text-red-500/40 flex-shrink-0" />
                          미지원
                        </span>
                      ) : (
                        <span className="text-sm text-text-hint whitespace-pre-line leading-relaxed">
                          {val}
                        </span>
                      )}
                    </td>
                  ))}

                  <td className="py-4 px-6 text-center align-middle">
                    <span className="inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-accent-purple">
                      <Check size={13} className="flex-shrink-0" />
                      {row.clivo}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-xs text-text-hint text-center mt-4"
        >
          * 각 서비스 공식 홈페이지 기능 소개 기준 (2025년 기준)
        </motion.p>
      </div>
    </section>
  )
}
