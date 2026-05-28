import { motion } from 'framer-motion'
import { useInView } from '@/hooks/useInView'
import vodThumb from '@/assets/김코딩_발로란트 방송 썸네일.png'

function VODScrubVisual() {
  return (
    <div className="w-full bg-[#0d0d1a] rounded-xl p-4 border border-white/10">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-gray-600 flex-shrink-0" />
        <span className="text-white/40 text-[11px] truncate">김코딩_발로란트_2025-05-27.mp4</span>
        <span className="ml-auto text-white/30 text-[11px] flex-shrink-0">7:02:14</span>
      </div>
      <div className="aspect-video rounded-lg mb-3 relative overflow-hidden">
        <img src={vodThumb} alt="방송 썸네일" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
        <div className="absolute inset-0 bg-black/30" />
        <span className="absolute inset-0 flex items-center justify-center text-white/40 text-5xl">▶</span>
      </div>
      <div className="relative h-2.5 bg-white/10 rounded-full mb-2">
        <div className="absolute left-0 top-0 bottom-0 rounded-full bg-white/40" style={{ width: '2%' }} />
        <div className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full border-2 border-purple-500" style={{ left: '2%' }} />
      </div>
      <div className="flex justify-between text-xs mb-3">
        <span className="text-white/50">0:08:23</span>
        <span className="text-red-400/80">남은 시간: 6:53:51</span>
      </div>
      <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-lg px-3 py-2">
        <span className="text-orange-300/80 text-xs">새벽 3:17 AM · 아직 2% 진행</span>
      </div>
    </div>
  )
}

function ChatMissVisual() {
  const messages = [
    { user: 'zoomzoom99', msg: 'ㅋㅋㅋㅋㅋㅋ대박', flag: false },
    { user: 'fan_ko', msg: '진짜?? 방금 뭐야', flag: false },
    { user: 'viewer_a', msg: '클립각 클립각!!', flag: true },
    { user: 'chzzk7', msg: 'ㅋㅋㅋ터졌다', flag: false },
    { user: 'pro_edit', msg: '역대급임 이거', flag: true },
    { user: 'watch00', msg: '저거 하이라이트 ㄹㅇ', flag: true },
    { user: 'gamer_b', msg: '!!!!!!!!!!!!!!', flag: false },
  ]
  return (
    <div className="w-full bg-[#0d0d1a] rounded-xl border border-white/10 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10 bg-white/5">
        <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
        <span className="text-white/60 text-xs font-semibold">실시간 채팅</span>
        <span className="ml-auto text-cyan-400/70 text-[11px]">×1,247 / min</span>
      </div>
      <div className="relative p-3 space-y-1.5 h-44 overflow-hidden">
        {messages.map((m, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="text-purple-400/60 flex-shrink-0">{m.user}</span>
            <span className={m.flag ? 'text-yellow-300/90 font-semibold' : 'text-white/45'}>{m.msg}</span>
            {m.flag && (
              <span className="ml-auto text-red-400/80 text-[10px] bg-red-500/10 px-1.5 py-0.5 rounded flex-shrink-0">
                놓침
              </span>
            )}
          </div>
        ))}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0d0d1a] to-transparent pointer-events-none" />
      </div>
      <div className="px-3 pb-3">
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          <span className="text-red-300/80 text-xs">초당 20개 채팅 — 수동 분석 불가</span>
        </div>
      </div>
    </div>
  )
}

function UploadDelayVisual() {
  const steps = [
    { time: '22:00', label: '방송 시작', done: true, warn: false },
    { time: '03:00', label: '방송 종료', done: true, warn: false },
    { time: '03:10', label: 'VOD 탐색 시작', done: true, warn: false },
    { time: '07:30', label: '클립 편집 완료', done: false, warn: false },
    { time: '09:00+', label: '쇼츠 업로드', done: false, warn: true },
  ]
  return (
    <div className="w-full bg-[#0d0d1a] rounded-xl p-4 border border-white/10">
      <div className="text-white/50 text-xs mb-4 font-semibold">업로드 현황 타임라인</div>
      <div className="space-y-3 mb-4">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-white/30 text-[11px] w-11 flex-shrink-0">{step.time}</span>
            <div
              className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                step.done
                  ? i < 2 ? 'bg-green-500' : 'bg-yellow-500'
                  : step.warn ? 'bg-red-500 animate-pulse' : 'bg-white/15'
              }`}
            />
            <span
              className={`text-xs flex-1 ${
                step.warn ? 'text-red-400/90' : step.done ? 'text-white/60' : 'text-white/30'
              }`}
            >
              {step.label}
            </span>
            {step.warn && (
              <span className="text-[10px] text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded flex-shrink-0">
                지연 6h+
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="text-xs text-white/30 bg-white/5 rounded-lg p-3 border border-white/10">
        시청자: <span className="text-white/50">"방송 끝났는데 클립 언제 올려요?"</span>
      </div>
    </div>
  )
}

function ManualWorkVisual() {
  const channels = [
    { name: 'BJ 던파파이터', platform: '치지직', dur: '7h', clips: 12, color: '#a855f7' },
    { name: 'BJ 발로란트킹', platform: '치지직', dur: '5h', clips: 8,  color: '#06b6d4' },
    { name: 'BJ 롤챌린저',   platform: 'SOOP',   dur: '6h', clips: 10, color: '#22c55e' },
  ]
  const taskBars = [
    { label: 'VOD 탐색',   hours: 4.0, color: '#f97316' },
    { label: '트리밍',     hours: 2.5, color: '#a855f7' },
    { label: '자막',       hours: 2.0, color: '#06b6d4' },
    { label: '썸네일',     hours: 1.5, color: '#22c55e' },
    { label: '업로드',     hours: 1.0, color: '#eab308' },
  ]
  const maxH = Math.max(...taskBars.map(t => t.hours))
  const totalH = taskBars.reduce((s, t) => s + t.hours, 0)

  return (
    <div className="w-full bg-[#0d0d1a] rounded-xl border border-white/10 overflow-hidden">
      {/* 담당 채널 목록 */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10 bg-white/5">
        <span className="text-white/60 text-xs font-semibold">오늘 담당 채널</span>
        <span className="ml-auto text-red-400/80 text-[11px] font-semibold">편집자 1인 ↓</span>
      </div>
      <div className="px-3 pt-3 space-y-2">
        {channels.map((ch, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-bold text-white"
              style={{ background: ch.color + '33', border: `1px solid ${ch.color}55` }}>
              BJ
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-white/65 text-[11px] font-medium truncate">{ch.name}</span>
                <span className="text-white/30 text-[10px] flex-shrink-0 ml-2">{ch.platform} · {ch.dur}</span>
              </div>
              {/* 작업량 바 */}
              <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: '100%', background: ch.color + '55' }}/>
              </div>
            </div>
            <span className="text-[10px] flex-shrink-0" style={{ color: ch.color + 'cc' }}>{ch.clips}클립</span>
          </div>
        ))}
      </div>

      {/* 작업 유형별 소요 시간 바 차트 */}
      <div className="px-3 pt-3 pb-1">
        <div className="text-white/35 text-[10px] mb-2">채널 1개 기준 수동 작업 시간</div>
        <div className="flex items-end gap-2 h-14">
          {taskBars.map((t, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[8px] text-white/35">{t.hours}h</span>
              <div className="w-full rounded-t-sm transition-all"
                style={{
                  height: `${(t.hours / maxH) * 36}px`,
                  background: t.color + '55',
                  border: `1px solid ${t.color}44`,
                }}/>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-0.5">
          {taskBars.map((t, i) => (
            <div key={i} className="flex-1 text-center">
              <span className="text-[8px] text-white/25">{t.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 총합 경고 */}
      <div className="px-3 pb-3 pt-2">
        <div className="flex items-center justify-between bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          <span className="text-red-300/75 text-xs">채널 1개 · 총 {totalH}시간 수동 작업</span>
          <span className="text-red-400 text-[11px] font-bold">채널 3개 = {totalH * 3}h+</span>
        </div>
      </div>
    </div>
  )
}

const painPoints = [
  {
    Visual: VODScrubVisual,
    tag: 'Pain 01',
    title: '7시간 VOD를 처음부터 검토',
    desc: '방송이 끝나도 편집자의 밤은 시작됩니다. 수 시간짜리 VOD를 처음부터 돌려보며 "이 장면이 재밌겠다" 싶은 구간을 직접 찾아야 합니다.',
    stat: '평균 탐색 시간 4시간+',
    statColor: 'text-orange-400',
    statBg: 'bg-orange-500/10 border-orange-500/20',
  },
  {
    Visual: ChatMissVisual,
    tag: 'Pain 02',
    title: '채팅 폭발 구간을 실시간으로 놓침',
    desc: '시청자들의 "클립각" 반응은 방송 중 1초 안에 지나갑니다. VOD를 혼자 보는 편집자는 그 맥락을 절대 파악할 수 없습니다.',
    stat: '초당 20개 채팅 — 수동 분석 불가',
    statColor: 'text-red-400',
    statBg: 'bg-red-500/10 border-red-500/20',
  },
  {
    Visual: UploadDelayVisual,
    tag: 'Pain 03',
    title: '업로드가 너무 늦어 화제성을 잃음',
    desc: '방송 종료 후 6시간 이상 지나야 클립이 올라갑니다. 시청자들의 관심이 식은 뒤에 올라온 쇼츠는 알고리즘에서 외면받습니다.',
    stat: '평균 업로드 지연 6시간+',
    statColor: 'text-red-400',
    statBg: 'bg-red-500/10 border-red-500/20',
  },
  {
    Visual: ManualWorkVisual,
    tag: 'Pain 04',
    title: '모든 반복 작업을 혼자 처리',
    desc: '탐색, 트리밍, 자막, 썸네일, 업로드. 채널 하나도 벅찬데 스트리머가 늘어날수록 편집자의 부담은 배로 증가합니다.',
    stat: '채널 1개 기준 편집 8+ 단계',
    statColor: 'text-yellow-400',
    statBg: 'bg-yellow-500/10 border-yellow-500/20',
  },
]

export default function PainPoints() {
  const { ref, inView } = useInView()

  return (
    <section ref={ref} className="py-24 px-5 bg-bg-surface">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            className="font-syne font-bold text-text-primary mb-3"
            style={{ fontSize: 'clamp(24px, 3.5vw, 36px)' }}
          >
            혹시 이런 상황이신가요?
          </h2>
          <p className="text-text-hint text-sm">클립 편집자가 매일 겪는 현실</p>
        </motion.div>

        <div className="space-y-20">
          {painPoints.map(({ Visual, tag, title, desc, stat, statColor, statBg }, i) => (
            <motion.div
              key={tag}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.1 }}
              className={`flex flex-col md:flex-row items-center gap-10 ${
                i % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Visual */}
              <div className="w-full md:w-1/2 flex-shrink-0">
                <Visual />
              </div>

              {/* Text */}
              <div className="w-full md:w-1/2">
                <span className="inline-block text-xs font-semibold text-accent-purple/70 uppercase tracking-widest mb-3">
                  {tag}
                </span>
                <h3
                  className="font-syne font-bold text-text-primary mb-4 leading-snug"
                  style={{ fontSize: 'clamp(18px, 2.2vw, 24px)' }}
                >
                  {title}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed mb-5">{desc}</p>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${statBg}`}>
                  <span className={`text-sm font-semibold ${statColor}`}>{stat}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
