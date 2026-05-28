import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { ChevronsLeftRight } from 'lucide-react'
import { useInView } from '@/hooks/useInView'
import painPointImg from '@/assets/pain_point.png'

const HIGHLIGHT_MARKERS = [7, 14, 22, 31, 40, 51, 57, 65, 73, 82, 88, 94]

const CLIPS = [
  { time: '0:23:14', score: 98, label: '에이스', hue: 0 },
  { time: '1:05:42', score: 94, label: '클러치', hue: 25 },
  { time: '2:18:09', score: 91, label: '킬스트릭', hue: 50 },
  { time: '0:47:33', score: 87, label: '채팅폭발', hue: 270 },
  { time: '1:52:01', score: 85, label: '반전', hue: 200 },
  { time: '3:01:28', score: 82, label: '재미', hue: 140 },
]

function DashboardPreview() {
  return (
    <div className="absolute inset-0 bg-[#0a0a15] flex flex-col p-3 overflow-hidden select-none">
      {/* Timeline */}
      <div className="mb-2.5 flex-shrink-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-white/45 text-[10px]">하이라이트 타임라인</span>
          <span className="text-purple-400 text-[10px] font-semibold">✦ 12구간 자동 감지</span>
        </div>
        <div className="relative h-5 bg-white/5 rounded overflow-hidden border border-white/10">
          {HIGHLIGHT_MARKERS.map((pos, i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 w-2 rounded-sm"
              style={{
                left: `${pos}%`,
                background: `hsla(${260 + i * 12}, 70%, 65%, 0.75)`,
              }}
            />
          ))}
          <div className="absolute top-0 bottom-0 left-0 bg-white/5" style={{ width: '52%' }} />
          <div className="absolute top-1 bottom-1 w-px bg-white/50" style={{ left: '52%' }} />
        </div>
        <div className="flex justify-between text-white/25 text-[9px] mt-0.5">
          <span>0:00</span>
          <span>3:42 진행 중 / 7:00 예상</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-1.5 mb-2.5 flex-shrink-0">
        {[
          { label: '클립 준비', value: '6개', color: 'text-purple-400' },
          { label: '채팅 피크', value: '×847', color: 'text-cyan-400' },
          { label: '평균 점수', value: '89.5', color: 'text-green-400' },
        ].map((s, i) => (
          <div key={i} className="bg-white/5 rounded-lg p-1.5 border border-white/10 text-center">
            <div className={`text-xs font-bold ${s.color}`}>{s.value}</div>
            <div className="text-[9px] text-white/35 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Clips grid */}
      <div className="flex-1 min-h-0">
        <div className="text-white/40 text-[10px] mb-1">감지된 하이라이트 클립</div>
        <div className="grid grid-cols-3 gap-1.5 h-[calc(100%-16px)]">
          {CLIPS.map((clip, i) => (
            <div
              key={i}
              className="bg-white/5 rounded-lg border border-white/10 overflow-hidden flex flex-col"
            >
              <div
                className="flex-1 flex items-center justify-center relative min-h-0"
                style={{ background: `hsla(${clip.hue}, 60%, 20%, 0.4)` }}
              >
                <span className="text-white/40 text-sm">▶</span>
                <div
                  className="absolute top-1 right-1 text-[9px] font-bold px-1 rounded"
                  style={{
                    color: `hsl(${clip.hue}, 70%, 70%)`,
                    background: 'rgba(0,0,0,0.5)',
                  }}
                >
                  {clip.score}
                </div>
              </div>
              <div className="px-1.5 py-1 flex-shrink-0">
                <div className="text-[9px] text-white/65 font-semibold truncate">{clip.label}</div>
                <div className="text-[9px] text-white/30">{clip.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function BeforeAfterSlider() {
  const { ref: sectionRef, inView } = useInView({ threshold: 0.3 })
  const [position, setPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [activeTab, setActiveTab] = useState<'before' | 'after'>('before')
  const containerRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()
  const sweptRef = useRef(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (inView && !sweptRef.current && !isMobile) {
      sweptRef.current = true
      controls.start({
        left: ['15%', '85%', '50%'],
        transition: { duration: 2, ease: 'easeInOut', times: [0, 0.6, 1] },
      })
      setTimeout(() => setPosition(50), 2000)
    }
  }, [inView, isMobile, controls])

  const getPositionFromEvent = useCallback((clientX: number) => {
    const container = containerRef.current
    if (!container) return 50
    const rect = container.getBoundingClientRect()
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    return (x / rect.width) * 100
  }, [])

  const onMouseDown = () => setIsDragging(true)
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setPosition(getPositionFromEvent(e.clientX))
  }
  const onMouseUp = () => setIsDragging(false)

  const onTouchStart = () => setIsDragging(true)
  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    setPosition(getPositionFromEvent(e.touches[0].clientX))
  }
  const onTouchEnd = () => setIsDragging(false)

  return (
    <section id="서비스소개" ref={sectionRef} className="py-24 px-5 bg-bg-base">
      <div className="max-w-4xl mx-auto">
        {isMobile ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex rounded-xl overflow-hidden border border-bg-border mb-4">
              <button
                className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${activeTab === 'before' ? 'bg-bg-surface text-text-primary' : 'text-text-hint'}`}
                onClick={() => setActiveTab('before')}
              >
                Before
              </button>
              <button
                className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${activeTab === 'after' ? 'bg-accent-purple text-white' : 'text-text-hint'}`}
                onClick={() => setActiveTab('after')}
              >
                After
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden border border-bg-border" style={{ aspectRatio: '16/9', position: 'relative' }}>
              {activeTab === 'before' ? (
                <img
                  src={painPointImg}
                  alt="편집자 페인포인트"
                  className="w-full h-full object-cover"
                />
              ) : (
                <DashboardPreview />
              )}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80">
                <p className="text-xs text-text-muted">
                  {activeTab === 'before'
                    ? '"하이라이트가 어디지..? 7시간 중 0%"'
                    : '"방송 종료 즉시 — 하이라이트 12구간 자동 감지"'}
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div
              ref={containerRef}
              className="relative w-full rounded-2xl overflow-hidden border border-bg-border select-none cursor-col-resize"
              style={{ aspectRatio: '16/9' }}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
            >
              {/* After: real dashboard (base layer) */}
              <DashboardPreview />

              {/* Before: clipped image */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${position}%` }}
              >
                <img
                  src={painPointImg}
                  alt="편집자 페인포인트"
                  className="absolute inset-0 h-full object-cover"
                  style={{ width: containerRef.current?.offsetWidth ?? '100%' }}
                  draggable={false}
                />
              </div>

              {/* Captions */}
              <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-1.5">
                <p className="text-xs text-text-muted">"하이라이트가 어디지..? 7시간 중 0%"</p>
              </div>
              <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-1.5">
                <p className="text-xs text-text-muted">"방송 종료 즉시 — 12구간 자동 감지"</p>
              </div>

              {/* Labels */}
              <div className="absolute top-4 left-4 bg-bg-surface/80 rounded-md px-2.5 py-1 text-xs font-semibold text-text-muted">
                BEFORE
              </div>
              <div className="absolute top-4 right-4 bg-accent-purple/80 rounded-md px-2.5 py-1 text-xs font-semibold text-white">
                AFTER
              </div>

              {/* Divider */}
              <motion.div
                className="absolute top-0 bottom-0 w-0.5 bg-accent-purple z-10"
                style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
                animate={controls}
              >
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-accent-purple glow-purple flex items-center justify-center cursor-grab active:cursor-grabbing"
                  onMouseDown={onMouseDown}
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                >
                  <ChevronsLeftRight size={18} className="text-white" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
