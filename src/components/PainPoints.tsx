import { motion } from 'framer-motion'
import { useInView } from '@/hooks/useInView'
import vodThumb from '@/assets/vod_thumbnail.png'

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

// Pain 03 — 채팅 맥락 없이 VOD 편집
function ChatContextVisual() {
  const clips = [
    { time: '01:47:22', thumb: '🎮', question: '왜 이 장면이 터진 거지?', chatCount: 0, known: false },
    { time: '03:18:45', thumb: '⚔️', question: '그냥 전투 장면인데?',     chatCount: 0, known: false },
    { time: '04:55:10', thumb: '🏆', question: '이게 하이라이트인가?',     chatCount: 0, known: false },
  ]
  const realChats = [
    { time: '01:47:22', peak: 1247, msg: '"ㅋㅋㅋ 이거 완전 클립각" × 340건' },
    { time: '03:18:45', peak: 892,  msg: '"역대급 역전!!!" × 280건' },
    { time: '04:55:10', peak: 203,  msg: '"그냥 평범한 장면"' },
  ]

  return (
    <div className="w-full bg-[#0d0d1a] rounded-xl border border-white/10 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10 bg-white/5">
        <span className="text-white/60 text-xs font-semibold">편집자 시점 — VOD만 보는 중</span>
        <span className="ml-auto text-orange-400/70 text-[11px]">채팅 정보 없음</span>
      </div>

      {/* 편집자가 보는 클립 목록 */}
      <div className="p-3 space-y-2">
        {clips.map((c, i) => (
          <div key={i} className="flex items-center gap-3 bg-white/[0.03] rounded-lg px-3 py-2.5 border border-white/[0.06]">
            <span className="text-xl flex-shrink-0">{c.thumb}</span>
            <div className="flex-1 min-w-0">
              <div className="text-white/55 text-[11px] font-medium">{c.time}</div>
              <div className="text-orange-300/70 text-[10px] mt-0.5 flex items-center gap-1">
                <span>❓</span> {c.question}
              </div>
            </div>
            <div className="flex-shrink-0 text-[10px] text-white/20 bg-white/[0.04] px-2 py-1 rounded border border-white/[0.06]">
              채팅 모름
            </div>
          </div>
        ))}
      </div>

      {/* 실제 채팅 반응 — 편집자가 모르는 정보 */}
      <div className="border-t border-white/10 px-3 py-2.5">
        <div className="text-white/30 text-[10px] mb-2">실제 그 순간 채팅 반응 (편집자는 알 수 없음)</div>
        {realChats.map((r, i) => (
          <div key={i} className="flex items-center gap-2 mb-1.5">
            <span className="text-white/25 text-[10px] w-14 flex-shrink-0">{r.time}</span>
            <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <div className="h-full rounded-full"
                style={{
                  width: `${Math.round(r.peak / 13)}%`,
                  background: r.peak > 500 ? '#a855f7' : r.peak > 300 ? '#06b6d4' : '#ffffff33'
                }}/>
            </div>
            <span className={`text-[9px] flex-shrink-0 ${r.peak > 500 ? 'text-purple-400' : r.peak > 300 ? 'text-cyan-400' : 'text-white/25'}`}>
              {r.peak > 300 ? `🔥 ${r.peak}/분` : `${r.peak}/분`}
            </span>
          </div>
        ))}
      </div>

      <div className="px-3 pb-3">
        <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-lg px-3 py-2">
          <span className="text-orange-300/80 text-xs">"이 장면이 왜 터졌는지" — 편집자는 영원히 모름</span>
        </div>
      </div>
    </div>
  )
}

// Pain 04 — 채널이 늘수록 편집자 혼자 감당 불가
function ScalingPainVisual() {
  const months = ['1개월', '3개월', '6개월', '현재']
  const editorLoad = [18, 33, 52, 88] // 업무 부담 %
  const channels =  [1,   2,   3,   5]

  return (
    <div className="w-full bg-[#0d0d1a] rounded-xl border border-white/10 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10 bg-white/5">
        <span className="text-white/60 text-xs font-semibold">편집자 1인 업무 증가 추이</span>
        <span className="ml-auto text-red-400/70 text-[11px] animate-pulse">한계 초과 중</span>
      </div>

      {/* 업무 증가 그래프 */}
      <div className="px-4 pt-4 pb-2">
        <div className="relative h-28">
          {/* 한계선 */}
          <div className="absolute left-0 right-0 border-t border-dashed border-red-500/40" style={{ top: '10%' }}>
            <span className="absolute right-0 -top-4 text-[9px] text-red-400/60">한계선</span>
          </div>
          {/* 그래프 바 */}
          <div className="absolute bottom-0 left-0 right-0 flex items-end gap-3 h-full">
            {editorLoad.map((load, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t-md relative overflow-hidden"
                  style={{
                    height: `${load}%`,
                    background: load >= 80
                      ? 'linear-gradient(to top, rgba(239,68,68,0.7), rgba(239,68,68,0.4))'
                      : load >= 50
                      ? 'linear-gradient(to top, rgba(251,146,60,0.6), rgba(251,146,60,0.3))'
                      : 'linear-gradient(to top, rgba(124,58,237,0.5), rgba(124,58,237,0.2))',
                    border: `1px solid ${load >= 80 ? 'rgba(239,68,68,0.5)' : load >= 50 ? 'rgba(251,146,60,0.4)' : 'rgba(124,58,237,0.4)'}`,
                    boxShadow: load >= 80 ? '0 0 12px rgba(239,68,68,0.3)' : undefined,
                  }}>
                  <span className="absolute top-1 left-0 right-0 text-center text-[8px] font-bold text-white/70">
                    {load >= 80 ? '😵' : load >= 50 ? '😓' : '🙂'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* x축 레이블 */}
        <div className="flex gap-3 mt-1">
          {months.map((m, i) => (
            <div key={i} className="flex-1 text-center">
              <div className="text-[9px] text-white/35">{m}</div>
              <div className="text-[9px] text-white/20">채널 {channels[i]}개</div>
            </div>
          ))}
        </div>
      </div>

      {/* 현재 상태 */}
      <div className="px-4 pb-3 pt-1 space-y-1.5">
        {[
          { label: '주간 편집 시간',  value: '60h+',   color: 'text-red-400',    bar: 95 },
          { label: '처리 못한 클립',  value: '23개',   color: 'text-orange-400', bar: 65 },
          { label: '평균 수면 시간',  value: '4.5h',   color: 'text-yellow-400', bar: 38 },
        ].map((s, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-white/40 text-[10px] w-24 flex-shrink-0">{s.label}</span>
            <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <div className={`h-full rounded-full`}
                style={{ width: `${s.bar}%`, background: s.bar > 80 ? 'rgba(239,68,68,0.6)' : s.bar > 50 ? 'rgba(251,146,60,0.6)' : 'rgba(234,179,8,0.6)' }}/>
            </div>
            <span className={`text-[11px] font-bold w-10 flex-shrink-0 text-right ${s.color}`}>{s.value}</span>
          </div>
        ))}
      </div>

      <div className="px-3 pb-3">
        <div className="flex items-center justify-between bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          <span className="text-red-300/75 text-xs">채널 5개 = 1인 한계의 3배 업무량</span>
          <span className="text-red-400 text-[10px] font-bold">번아웃 직전</span>
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
    Visual: ChatContextVisual,
    tag: 'Pain 03',
    title: '"왜 이 장면이 터진 건지" 알 수 없다',
    desc: 'VOD만 보는 편집자는 그 순간 채팅이 얼마나 폭발했는지 알 수 없습니다. 맥락 없이 자른 클립은 시청자 반응을 재현하지 못합니다.',
    stat: '채팅 맥락 없는 편집 — 하이라이트 품질 저하',
    statColor: 'text-orange-400',
    statBg: 'bg-orange-500/10 border-orange-500/20',
  },
  {
    Visual: ScalingPainVisual,
    tag: 'Pain 04',
    title: '채널이 늘수록 혼자 감당이 안 된다',
    desc: '스트리머가 한 명 더 늘 때마다 편집자의 업무는 11시간씩 증가합니다. 성장이 곧 번아웃으로 이어지는 구조입니다.',
    stat: '채널 5개 = 주 60시간+ 수작업',
    statColor: 'text-red-400',
    statBg: 'bg-red-500/10 border-red-500/20',
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
