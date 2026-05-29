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
    { time: '01:47:22', dur: '01:58', chatReal: 1247, editorPicked: false },
    { time: '03:18:45', dur: '02:14', chatReal:   18, editorPicked: true  },
    { time: '04:55:10', dur: '02:31', chatReal:  892, editorPicked: false },
  ]

  return (
    <div className="w-full bg-[#0d0d1a] rounded-xl border border-white/10 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10 bg-white/5">
        <span className="text-white/60 text-xs font-semibold">편집자가 고른 클립</span>
        <span className="ml-auto text-orange-400/70 text-[11px]">채팅 데이터 없음</span>
      </div>

      <div className="p-3 space-y-2">
        {clips.map((c, i) => (
          <div key={i} className={`rounded-lg border overflow-hidden ${
            c.editorPicked
              ? 'border-accent-purple/40 bg-accent-purple/5'
              : 'border-white/[0.06] bg-white/[0.02]'
          }`}>
            <div className="flex items-center gap-3 px-3 py-2.5">
              {/* 썸네일 대역 */}
              <div className="w-16 h-9 rounded bg-white/[0.06] flex-shrink-0 flex items-center justify-center">
                <span className="text-white/20 text-[9px]">▶ {c.dur}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white/55 text-[11px] font-mono">{c.time}</div>
                <div className="text-white/25 text-[10px] mt-0.5">전투 장면 — 영상만으론 구별 불가</div>
              </div>
              {c.editorPicked
                ? <span className="text-accent-purple text-[10px] font-bold px-2 py-0.5 bg-accent-purple/15 rounded-full flex-shrink-0">✓ 선택됨</span>
                : <span className="text-white/20 text-[10px] px-2 py-0.5 rounded-full flex-shrink-0">패스</span>
              }
            </div>

            {/* 실제 채팅 반응 공개 */}
            <div className={`px-3 py-2 border-t flex items-center gap-2 ${
              c.editorPicked ? 'border-accent-purple/20 bg-black/20' : 'border-white/[0.05] bg-black/10'
            }`}>
              <span className="text-white/25 text-[9px] w-14 flex-shrink-0">실제 채팅</span>
              <div className="flex-1 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.round(c.chatReal / 13)}%`,
                    background: c.chatReal > 500 ? '#a855f7' : c.chatReal > 100 ? '#06b6d4' : 'rgba(255,255,255,0.15)'
                  }}/>
              </div>
              <span className={`text-[9px] font-semibold w-16 text-right flex-shrink-0 ${
                c.chatReal > 500 ? 'text-purple-400' : c.chatReal > 100 ? 'text-cyan-400' : 'text-white/20'
              }`}>
                {c.chatReal > 500 ? '🔥 ' : c.chatReal > 100 ? '💬 ' : '😶 '}{c.chatReal.toLocaleString()}/분
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="px-3 pb-3">
        <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-lg px-3 py-2">
          <span className="text-orange-300/80 text-xs">채팅이 폭발한 장면을 두고 평범한 클립을 선택</span>
        </div>
      </div>
    </div>
  )
}

// Pain 04 — 채널이 늘수록 편집자 혼자 감당 불가
function ScalingPainVisual() {
  const requests = [
    { name: '김코딩',   platform: '치지직', dur: '7h 03m', clips: 12, color: '#00d564', read: false },
    { name: '박롤러',   platform: 'SOOP',   dur: '5h 48m', clips: 8,  color: '#ff6b35', read: false },
    { name: '이발로',   platform: '치지직', dur: '6h 22m', clips: 15, color: '#00d564', read: false },
    { name: '최게임',   platform: 'SOOP',   dur: '3h 11m', clips: 6,  color: '#ff6b35', read: false },
  ]
  const totalClips = requests.reduce((s, r) => s + r.clips, 0)
  const totalHours = '22h 24m'

  return (
    <div className="w-full bg-[#0d0d1a] rounded-xl border border-white/10 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10 bg-white/5">
        <span className="text-white/60 text-xs font-semibold">클립 요청 수신함</span>
        <span className="ml-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"/>
          <span className="text-red-400/80 text-[11px] font-semibold">{requests.length}건 미처리</span>
        </span>
      </div>

      {/* 요청 카드 스택 */}
      <div className="p-3 space-y-2">
        {requests.map((r, i) => (
          <div key={i} className="flex items-center gap-3 bg-white/[0.03] rounded-lg px-3 py-2.5 border border-white/[0.06]">
            {/* 채널 아이콘 */}
            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-bold"
              style={{ background: r.color + '22', border: `1px solid ${r.color}55`, color: r.color }}>
              {r.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-white/70 text-[11px] font-semibold">{r.name}</span>
                <span className="text-[8px] px-1.5 py-px rounded-full font-medium"
                  style={{ color: r.color, background: r.color + '18' }}>{r.platform}</span>
              </div>
              <div className="text-white/30 text-[10px] mt-0.5">방송 끝났어요, 클립 부탁해요 🙏</div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-orange-400/80 text-[10px] font-semibold">{r.clips}개</div>
              <div className="text-white/20 text-[9px]">VOD {r.dur}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 편집자 상태 */}
      <div className="border-t border-white/[0.07] mx-3 mb-3 pt-2.5">
        <div className="flex items-center gap-2.5 bg-white/[0.03] rounded-lg px-3 py-2 border border-white/[0.05]">
          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] flex-shrink-0">편</div>
          <div className="flex-1 min-w-0">
            <div className="text-white/40 text-[10px]">지금 다른 방송 편집 중이에요... 😓</div>
            <div className="text-white/20 text-[9px] mt-0.5">총 대기: {totalClips}개 클립 · {totalHours} VOD</div>
          </div>
          <span className="text-red-400/70 text-[9px] bg-red-500/10 px-1.5 py-0.5 rounded flex-shrink-0">한계</span>
        </div>
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
