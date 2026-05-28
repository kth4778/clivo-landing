import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from '@/hooks/useInView'
import img27 from '@/assets/image 27.png'
import img28 from '@/assets/image 28.png'
import img29 from '@/assets/image 29.png'
import img30 from '@/assets/image 30.png'
import img31 from '@/assets/image 31.png'
import img32 from '@/assets/image 32.png'
import img33 from '@/assets/image 33.png'
import img34 from '@/assets/image 34.png'

const THUMB_IMGS = [img27, img28, img29, img30, img31, img32, img33, img34]

import {
  LayoutDashboard, Zap, BarChart2, Film, Upload,
  Radio, Settings, Download, Bell, HelpCircle,
  ChevronDown, Users, Star, Search,
  Play, Filter, Wifi, Calendar,
  Eye, MessageSquare, Link2, Shield,
  MoreHorizontal, RotateCcw, Trash2,
  Pencil, X,
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────
type Page = 'dashboard' | 'highlight' | 'analysis' | 'clips' | 'upload' | 'broadcast' | 'settings'

type Clip = {
  rank: number
  title: string
  time: string
  dur: string
  score: number
  chatScore: number
  videoScore: number
  tags: string[]
  pos: number
  date: string
  platform: string
}

// ── Mock data ─────────────────────────────────────────────
const NAV: { icon: React.ElementType; label: string; page: Page; badge?: string }[] = [
  { icon: LayoutDashboard, label: '대시보드',          page: 'dashboard' },
  { icon: Zap,             label: '하이라이트',        page: 'highlight', badge: 'Beta' },
  { icon: BarChart2,       label: '실시간 분석',       page: 'analysis' },
  { icon: Film,            label: '클립 관리',         page: 'clips' },
  { icon: Upload,          label: '업로드 & 내보내기', page: 'upload' },
  { icon: Radio,           label: '방송 관리',         page: 'broadcast' },
  { icon: Settings,        label: '설정',              page: 'settings' },
]

const TIMELINE_SEGS = [
  { l:6,  w:4, lv:2 }, { l:15, w:2, lv:1 }, { l:23, w:7, lv:3 },
  { l:34, w:3, lv:1 }, { l:41, w:5, lv:2 }, { l:52, w:4, lv:3 },
  { l:61, w:2, lv:1 }, { l:66, w:3, lv:2 }, { l:74, w:3, lv:1 },
  { l:80, w:4, lv:3 }, { l:88, w:2, lv:1 }, { l:93, w:4, lv:2 },
]

const WAVE = [
  0.05,0.07,0.06,0.09,0.08,0.11,0.14,0.12,0.09,0.07,
  0.14,0.23,0.34,0.44,0.39,0.28,0.19,0.16,0.11,0.09,
  0.11,0.17,0.27,0.44,0.63,0.80,0.94,1.00,0.89,0.71,
  0.53,0.37,0.24,0.17,0.21,0.29,0.37,0.31,0.24,0.19,
  0.17,0.24,0.39,0.53,0.63,0.57,0.47,0.41,0.37,0.31,
  0.27,0.37,0.49,0.61,0.70,0.66,0.56,0.49,0.44,0.39,
  0.34,0.29,0.37,0.47,0.53,0.49,0.41,0.34,0.29,0.24,
  0.21,0.27,0.33,0.41,0.37,0.31,0.27,0.24,0.19,0.16,
]

const TOTAL_SECS = 7 * 3600 + 3 * 60 + 15 // 07:03:15

const ALL_CLIPS: Clip[] = [
  { rank:1, title:'극적인 역전 순간!',   time:'03:18:45–03:21:59', dur:'03:21', score:98, chatScore:81, videoScore:17, tags:['#역전','#채팅폭발'],    pos:47, date:'05.27', platform:'치지직' },
  { rank:2, title:'보조킬 완벽 타이밍', time:'01:47:22–01:50:10', dur:'02:48', score:91, chatScore:72, videoScore:19, tags:['#보스전','#완벽타이밍'], pos:25, date:'05.27', platform:'치지직' },
  { rank:3, title:'연속 킬 폭발!',      time:'04:12:33–04:14:48', dur:'02:15', score:85, chatScore:68, videoScore:17, tags:['#연속킬','#스킬연계'],   pos:60, date:'05.27', platform:'치지직' },
  { rank:4, title:'전설 아이템 획득!',  time:'05:45:11–05:47:09', dur:'01:58', score:79, chatScore:62, videoScore:17, tags:['#전설템','#축하'],       pos:82, date:'05.27', platform:'치지직' },
  { rank:5, title:'화려한 콤보 연계',   time:'06:12:04–06:14:11', dur:'02:07', score:76, chatScore:59, videoScore:17, tags:['#콤보'],                 pos:88, date:'05.25', platform:'치지직' },
  { rank:6, title:'아슬아슬한 생존',    time:'02:33:22–02:35:00', dur:'01:38', score:72, chatScore:57, videoScore:15, tags:['#생존'],                 pos:36, date:'05.25', platform:'치지직' },
  { rank:7, title:'팀원 구조 성공',     time:'04:58:10–05:00:25', dur:'02:15', score:68, chatScore:52, videoScore:16, tags:['#팀플'],                 pos:70, date:'05.23', platform:'SOOP'  },
  { rank:8, title:'예상치 못한 반전',   time:'01:10:55–01:13:02', dur:'02:07', score:65, chatScore:49, videoScore:16, tags:['#반전'],                 pos:17, date:'05.23', platform:'SOOP'  },
]

const CLIPS = ALL_CLIPS.slice(0, 4)

// ── Helpers ───────────────────────────────────────────────
function fmtSecs(s: number) {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
}

function buildPath(data: number[], w: number, h: number, fill: boolean) {
  const step = w / (data.length - 1)
  const pts = data.map((v, i): [number,number] => [i*step, h - v*h*0.88])
  let d = `M ${pts[0][0]} ${pts[0][1]}`
  for (let i=1; i<pts.length; i++) {
    const [px,py]=pts[i-1],[cx,cy]=pts[i],mx=(px+cx)/2
    d += ` C ${mx} ${py} ${mx} ${cy} ${cx} ${cy}`
  }
  if (fill) d += ` L ${pts[pts.length-1][0]} ${h} L 0 ${h} Z`
  return d
}

// ── Page transition wrapper ───────────────────────────────
function PageWrap({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity:0, y:8 }}
      animate={{ opacity:1, y:0 }}
      exit={{ opacity:0, y:-4 }}
      transition={{ duration:0.2 }}
      className="h-full flex flex-col"
    >
      {children}
    </motion.div>
  )
}

// ── Card shell ────────────────────────────────────────────
function Card({ className='', children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`bg-white/[0.04] rounded-xl border border-white/[0.07] ${className}`}>
      {children}
    </div>
  )
}

// ══════════════════════════════════════════════════════════
// CLIP DETAIL MODAL
// ══════════════════════════════════════════════════════════
function ClipDetailModal({ clip, onClose }: { clip: Clip; onClose: () => void }) {
  const [editingTitle, setEditingTitle] = useState(false)
  const [title,        setTitle]        = useState(clip.title)
  const [tags,         setTags]         = useState([...clip.tags])
  const [newTag,       setNewTag]       = useState('')
  const [selTitle,     setSelTitle]     = useState(0)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const aiTitles = [
    `${clip.title} — 발로란트 EP.12 하이라이트`,
    `이 순간이 바로 클립각! ${clip.title}`,
    `BJ 던파파이터 ${clip.date} 방송 명장면`,
  ]

  const applyTitle = (t: string) => { setTitle(t); setSelTitle(aiTitles.indexOf(t)); setEditingTitle(false) }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/65 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity:0, scale:0.94, y:18 }}
        animate={{ opacity:1, scale:1, y:0 }}
        exit={{ opacity:0, scale:0.94, y:10 }}
        transition={{ duration:0.2, ease:[0.22,1,0.36,1] }}
        className="relative w-full max-w-[660px] rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
        style={{ background:'#0f0f1e' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center transition-colors"
        >
          <X size={13} className="text-white/50"/>
        </button>

        <div className="flex gap-0">
          {/* ── Left column ── */}
          <div className="w-56 flex-shrink-0 border-r border-white/[0.06] p-4 flex flex-col gap-3">
            {/* Thumbnail */}
            <div className="relative rounded-xl overflow-hidden" style={{aspectRatio:'16/9'}}>
              <img
                src={THUMB_IMGS[(clip.rank-1) % THUMB_IMGS.length]}
                alt={clip.title}
                className="absolute inset-0 w-full h-full object-cover"
                draggable={false}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/10 transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-white/20 group-hover:bg-white/30 flex items-center justify-center border border-white/30 transition-colors">
                  <Play size={14} className="text-white ml-0.5" fill="white"/>
                </div>
              </div>
              <div className="absolute top-1.5 left-1.5 flex items-center gap-0.5">
                <span className="text-yellow-400 text-[10px]">♛</span>
                <span className="text-white/80 text-[9px] font-bold">{clip.rank}</span>
              </div>
              <div className="absolute bottom-1.5 right-1.5 bg-accent-purple text-white text-[9px] font-bold px-1.5 py-px rounded-full">
                {clip.score}점
              </div>
            </div>

            {/* Score breakdown */}
            <div className="bg-white/[0.04] rounded-xl p-3 border border-white/[0.07]">
              <div className="text-center mb-2.5">
                <span className="text-accent-purple text-2xl font-bold leading-none">{clip.score}</span>
                <span className="text-white/40 text-sm"> 점</span>
                <div className="text-white/25 text-[9px] mt-0.5">종합 점수</div>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-white/45 text-[10px]">채팅 반응</span>
                    <span className="text-cyan-400 font-bold text-[10px]">{clip.chatScore}점</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400/70 rounded-full" style={{width:`${clip.chatScore}%`}}/>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-white/45 text-[10px]">영상 분석</span>
                    <span className="text-purple-300 font-bold text-[10px]">{clip.videoScore}점</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div className="h-full bg-purple-400/60 rounded-full" style={{width:`${clip.videoScore * 5}%`}}/>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline position */}
            <div className="bg-white/[0.04] rounded-xl p-3 border border-white/[0.07]">
              <div className="text-white/35 text-[10px] mb-2">방송 내 위치</div>
              <div className="flex justify-between text-[9px] text-white/20 mb-1.5">
                <span>0:00</span><span>7:03:15</span>
              </div>
              <div className="relative h-2 bg-white/[0.08] rounded-full">
                <div className="absolute inset-y-0 left-0 bg-white/[0.05] rounded-full" style={{width:`${clip.pos}%`}}/>
                <div className="absolute top-1/2 w-3.5 h-3.5 rounded-full bg-accent-purple"
                  style={{left:`${clip.pos}%`, transform:'translate(-50%,-50%)',
                    boxShadow:'0 0 8px rgba(124,58,237,1), 0 0 16px rgba(124,58,237,0.5)'}}/>
              </div>
              <div className="text-accent-purple/70 text-[10px] text-center mt-1.5 font-mono">
                {clip.time.split('–')[0]}
              </div>
            </div>
          </div>

          {/* ── Right column ── */}
          <div className="flex-1 p-4 flex flex-col gap-3 min-w-0">
            {/* Title */}
            <div>
              <div className="text-white/30 text-[10px] mb-1.5">클립 제목</div>
              {editingTitle ? (
                <div className="flex gap-2">
                  <input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    autoFocus
                    className="flex-1 bg-white/[0.05] border border-accent-purple/50 rounded-lg px-3 py-1.5 text-white/80 text-sm outline-none focus:border-accent-purple"
                  />
                  <button
                    onClick={() => setEditingTitle(false)}
                    className="text-[10px] text-accent-purple border border-accent-purple/40 rounded-lg px-3 hover:bg-accent-purple/10 transition-colors"
                  >저장</button>
                </div>
              ) : (
                <div className="flex items-center gap-2 group">
                  <span className="text-white/85 text-sm font-semibold leading-snug">{title}</span>
                  <button
                    onClick={() => setEditingTitle(true)}
                    className="text-white/20 hover:text-white/55 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                  >
                    <Pencil size={11}/>
                  </button>
                </div>
              )}
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-2">
              {[
                ['구간', clip.time.replace('–',' ~ ')],
                ['길이', clip.dur],
                ['방송', clip.date],
                ['플랫폼', clip.platform],
              ].map(([l,v]) => (
                <div key={l} className="bg-white/[0.03] rounded-lg px-3 py-2">
                  <div className="text-white/25 text-[9px] mb-0.5">{l}</div>
                  <div className={`text-[11px] font-semibold ${
                    l==='플랫폼'
                      ? clip.platform==='치지직' ? 'text-green-400' : 'text-orange-400'
                      : 'text-white/65'
                  }`}>{v}</div>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div>
              <div className="text-white/30 text-[10px] mb-1.5">태그</div>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag, i) => (
                  <span key={tag+i} className="flex items-center gap-1 text-[10px] text-accent-purple/80 bg-accent-purple/15 border border-accent-purple/25 px-2 py-0.5 rounded-full">
                    {tag}
                    <button
                      onClick={() => setTags(t => t.filter((_,j) => j!==i))}
                      className="text-white/30 hover:text-white/70 ml-0.5 leading-none"
                    >×</button>
                  </span>
                ))}
                <div className="flex items-center bg-white/[0.04] border border-white/[0.1] rounded-full px-2.5 py-0.5">
                  <input
                    value={newTag}
                    onChange={e => setNewTag(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && newTag.trim()) {
                        setTags(t => [...t, newTag.trim().startsWith('#') ? newTag.trim() : '#'+newTag.trim()])
                        setNewTag('')
                      }
                    }}
                    placeholder="+ 태그 추가"
                    className="bg-transparent text-white/40 text-[10px] outline-none w-16 placeholder:text-white/20"
                  />
                </div>
              </div>
            </div>

            {/* AI title suggestions */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-white/30 text-[10px]">AI 제목 추천</span>
                <span className="text-[8px] bg-accent-purple/20 text-accent-purple px-1.5 py-px rounded-full">Beta</span>
              </div>
              <div className="space-y-1">
                {aiTitles.map((t, i) => (
                  <button key={i}
                    onClick={() => applyTitle(t)}
                    className={`w-full text-left text-[10px] p-2 rounded-lg border transition-all ${
                      selTitle === i
                        ? 'border-accent-purple/45 bg-accent-purple/10 text-white/75'
                        : 'border-white/[0.06] bg-white/[0.02] text-white/40 hover:bg-white/[0.05] hover:text-white/60'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-1.5 mt-auto pt-1">
              <button className="flex-1 flex items-center justify-center gap-1.5 bg-accent-purple text-white text-[11px] font-bold py-2 rounded-xl hover:bg-accent-purple/90 transition-colors"
                style={{boxShadow:'0 0 12px rgba(124,58,237,.35)'}}>
                <Upload size={11}/> 업로드
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 text-white/55 border border-white/[0.1] text-[11px] py-2 rounded-xl hover:border-cyan-500/40 hover:text-cyan-400 transition-colors">
                <Download size={11}/> 내보내기
              </button>
              <button className="flex items-center justify-center gap-1.5 text-white/40 border border-white/[0.1] text-[11px] px-3 py-2 rounded-xl hover:border-white/20 hover:text-white/60 transition-colors">
                <RotateCcw size={10}/> 재분석
              </button>
              <button className="flex items-center justify-center px-3 py-2 rounded-xl border border-white/[0.07] text-red-400/50 hover:border-red-500/30 hover:text-red-400 transition-colors">
                <Trash2 size={11}/>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════
// COMMON SIDEBAR — 4 cards (모든 페이지 공통)
// ══════════════════════════════════════════════════════════
function CommonSidebar({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [elapsed, setElapsed] = useState(8073)

  useEffect(() => {
    const id = setInterval(() => setElapsed(e => e + 1), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <aside className="w-48 flex-shrink-0 border-l border-white/[0.07] overflow-y-auto p-3 space-y-3"
      style={{ background:'#0c0c1a' }}>
      {/* Card 1: 라이브 상태 */}
      <div className="bg-white/[0.04] rounded-xl p-3 border border-green-500/25">
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse flex-shrink-0"/>
          <span className="text-green-400 text-[10px] font-bold tracking-wide">LIVE</span>
        </div>
        <div className="text-white/75 text-[11px] font-semibold leading-snug mb-1">
          발로란트 마스터 도전기 EP.12
        </div>
        <div className="text-white/35 text-[10px] mb-1.5">치지직 · 경과 {fmtSecs(elapsed)}</div>
        <div className="flex items-center gap-1">
          <Users size={9} className="text-cyan-400 flex-shrink-0"/>
          <span className="text-cyan-400 text-[10px] font-semibold">13,204</span>
          <span className="text-white/30 text-[10px]">명 시청 중</span>
        </div>
      </div>

      {/* Card 2: 이번 달 요약 */}
      <Card className="p-3">
        <div className="text-white/50 text-[10px] font-semibold mb-2">이번 달 요약</div>
        {([['이번 달 방송','3회'],['생성된 클립','47개'],['총 조회수','128K'],['평균 점수','86점']] as [string,string][]).map(([l,v]) => (
          <div key={l} className="flex justify-between py-1 border-b border-white/[0.05] last:border-0">
            <span className="text-white/30 text-[10px]">{l}</span>
            <span className="text-white/65 text-[10px] font-semibold">{v}</span>
          </div>
        ))}
      </Card>

      {/* Card 3: 업로드 대기 */}
      <Card className="p-3">
        <div className="text-white/50 text-[10px] font-semibold mb-2">업로드 대기</div>
        <div className="flex items-end gap-1.5 mb-2">
          <span className="text-accent-purple text-xl font-bold leading-none">3</span>
          <span className="text-white/40 text-[10px] pb-0.5">개 클립 대기 중</span>
        </div>
        <button onClick={() => onNavigate('upload')}
          className="w-full text-[10px] text-accent-purple border border-accent-purple/35 rounded-lg py-1.5 hover:bg-accent-purple/10 transition-colors">
          클립 업로드하기 →
        </button>
      </Card>

      {/* Card 4: 플랫폼 업로드 현황 */}
      <Card className="p-3">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-white/50 text-[10px] font-semibold">플랫폼 업로드 현황</span>
          <button onClick={() => onNavigate('upload')} className="text-accent-purple/70 text-[9px] hover:text-accent-purple transition-colors">관리 →</button>
        </div>
        {([
          { name:'YouTube', icon:'▶', color:'#ff0000', uploads:12, pct:34 },
          { name:'TikTok',  icon:'♪', color:'#69c9d0', uploads:8,  pct:23 },
          { name:'치지직',  icon:'◈', color:'#00d564', uploads:15, pct:43 },
          { name:'SOOP',    icon:'◉', color:'#ff6b35', uploads:5,  pct:14 },
        ] as { name:string; icon:string; color:string; uploads:number; pct:number }[]).map(p => (
          <div key={p.name} className="mb-2 last:mb-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px]" style={{color:p.color}}>{p.icon}</span>
                <span className="text-white/55 text-[10px]">{p.name}</span>
              </div>
              <span className="text-white/45 text-[10px] font-semibold">{p.uploads}개</span>
            </div>
            <div className="h-1 bg-white/[0.07] rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{width:`${p.pct}%`, background:p.color+'cc'}}/>
            </div>
          </div>
        ))}
        <div className="mt-2.5 pt-2 border-t border-white/[0.06] flex justify-between items-center">
          <span className="text-white/25 text-[9px]">이번 달 총</span>
          <span className="text-white/55 text-[10px] font-bold">40개 업로드</span>
        </div>
      </Card>
    </aside>
  )
}

// ══════════════════════════════════════════════════════════
// PAGE 1: 대시보드
// ══════════════════════════════════════════════════════════
function DashboardPage() {
  const metrics = [
    { icon:Radio,  label:'이번 주 방송', value:'3회',  sub:'+1 지난주 대비',   color:'text-purple-400' },
    { icon:Film,   label:'생성된 클립',  value:'47개', sub:'이번 달 누적',     color:'text-cyan-400'   },
    { icon:Eye,    label:'총 조회수',    value:'128K', sub:'+23% 지난주 대비', color:'text-green-400'  },
    { icon:Star,   label:'평균 점수',    value:'86점', sub:'상위 13% 수준',    color:'text-yellow-400' },
  ]
  const broadcasts = [
    { date:'05.27', title:'발로란트 마스터 도전기 EP.12', dur:'7:03:15', clips:12, score:87, status:'완료' },
    { date:'05.25', title:'던전파이터 레이드 공략',       dur:'4:22:10', clips:8,  score:82, status:'완료' },
    { date:'05.23', title:'리그 오브 레전드 챌린저 도전', dur:'5:48:30', clips:10, score:79, status:'완료' },
    { date:'05.21', title:'스타크래프트 래더 매치',       dur:'3:11:45', clips:6,  score:74, status:'완료' },
  ]
  return (
    <PageWrap>
      <div className="px-5 pt-4 pb-2 flex-shrink-0">
        <h3 className="text-white font-bold text-sm">대시보드</h3>
        <p className="text-white/35 text-[11px]">전체 방송 현황 요약</p>
      </div>
      <div className="flex-1 px-5 pb-4 flex flex-col gap-3 min-h-0">
        <div className="grid grid-cols-4 gap-3 flex-shrink-0">
          {metrics.map(m => {
            const Icon = m.icon
            return (
              <Card key={m.label} className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={13} className={m.color}/>
                  <span className="text-white/40 text-[10px]">{m.label}</span>
                </div>
                <div className={`text-xl font-bold ${m.color}`}>{m.value}</div>
                <div className="text-white/30 text-[10px] mt-0.5">{m.sub}</div>
              </Card>
            )
          })}
        </div>
        <Card className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06]">
            <span className="text-white/55 text-xs font-semibold">최근 방송</span>
            <button className="text-accent-purple text-[10px]">전체 보기</button>
          </div>
          <div className="flex-1 overflow-hidden">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b border-white/[0.05]">
                  {['날짜','방송 제목','방송 시간','클립','점수','상태'].map(h => (
                    <th key={h} className="px-4 py-2 text-left text-white/30 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {broadcasts.map(b => (
                  <tr key={b.date} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                    <td className="px-4 py-2.5 text-white/40">{b.date}</td>
                    <td className="px-4 py-2.5 text-white/70 font-medium">{b.title}</td>
                    <td className="px-4 py-2.5 text-white/40">{b.dur}</td>
                    <td className="px-4 py-2.5 text-cyan-400 font-semibold">{b.clips}개</td>
                    <td className="px-4 py-2.5"><span className="text-accent-purple font-bold">{b.score}점</span></td>
                    <td className="px-4 py-2.5"><span className="text-green-400/80 bg-green-500/10 px-2 py-px rounded-full text-[10px]">{b.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </PageWrap>
  )
}

// ══════════════════════════════════════════════════════════
// PAGE 2: 하이라이트 (interactive graph + hover sync + modal)
// ══════════════════════════════════════════════════════════
function HighlightPage() {
  const [openMenu,     setOpenMenu]     = useState<number | null>(null)
  const [hoveredClip,  setHoveredClip]  = useState<number | null>(null)
  const [graphPos,     setGraphPos]     = useState<number | null>(null)  // 0~1
  const [selectedClip, setSelectedClip] = useState<Clip | null>(null)

  // 그래프 마우스 위치에서 수치 계산
  const waveIdx   = graphPos !== null ? Math.min(79, Math.floor(graphPos * 80)) : 0
  const hoverWave = WAVE[waveIdx]
  const hoverTime = graphPos !== null ? fmtSecs(Math.floor(graphPos * TOTAL_SECS)) : ''
  const hoverChat = Math.round(hoverWave * 85)
  const hoverVid  = Math.round(hoverWave * 22)
  const hoverTotal= hoverChat + hoverVid

  // 클립 hover 시 그래프·타임라인에 표시할 SVG X (0~800)
  const hClip = hoveredClip !== null ? CLIPS.find(c => c.rank === hoveredClip) : null

  return (
    <PageWrap>
      <div className="flex items-start px-5 pt-4 pb-2 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-white font-bold text-sm">하이라이트 감지 결과</h3>
            <span className="text-[10px] bg-accent-purple/25 text-accent-purple px-2 py-px rounded-full font-semibold">Beta</span>
          </div>
          <p className="text-white/35 text-[11px] mt-0.5">AI가 분석한 실시간 하이라이트 구간입니다</p>
        </div>
      </div>

      <div className="flex-1 px-5 pb-4 flex flex-col gap-2.5 min-h-0">

        {/* ── 하이라이트 타임라인 ── */}
        <Card className="p-3 flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/55 text-[11px] font-semibold">하이라이트 타임라인</span>
            <div className="flex items-center gap-3 text-[10px] text-white/35">
              {[['bg-accent-purple','매우 높음'],['bg-purple-500/50','높음'],['bg-purple-500/25','보통']].map(([c,l]) => (
                <span key={l} className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-sm ${c}`}/>{l}
                </span>
              ))}
            </div>
          </div>

          <div className="relative h-6 bg-white/[0.04] rounded overflow-hidden border border-white/[0.06]">
            {/* 기본 세그먼트 — hover 시 살짝 어둡게 */}
            {TIMELINE_SEGS.map((s,i) => (
              <div key={i}
                className="absolute top-0.5 bottom-0.5 rounded-sm transition-opacity"
                style={{
                  left:`${s.l}%`, width:`${s.w}%`,
                  opacity: hClip ? 0.35 : 1,
                  background: s.lv===3?'#7c3aed':s.lv===2?'rgba(124,58,237,.55)':'rgba(124,58,237,.28)',
                  boxShadow: s.lv===3?'0 0 8px rgba(124,58,237,.7)':undefined,
                }}
              />
            ))}

            {/* 클립 hover 시 해당 pos에 글로우 마커 */}
            {hClip && (
              <div
                className="absolute top-0 bottom-0 z-10 pointer-events-none transition-all"
                style={{
                  left:`${hClip.pos - 1.2}%`,
                  width:'2.4%',
                  background:'#a855f7',
                  borderRadius:'3px',
                  boxShadow:'0 0 12px rgba(168,85,247,1), 0 0 24px rgba(124,58,237,0.6)',
                }}
              />
            )}
          </div>

          <div className="flex justify-between text-[10px] text-white/25 mt-1">
            {['00:00:00','01:45:00','03:30:00','05:15:00'].map(t => <span key={t}>{t}</span>)}
            <span className="text-accent-purple/60">07:03:15</span>
          </div>
        </Card>

        {/* ── 채팅 반응 그래프 (인터랙티브) ── */}
        <Card className="p-3 flex-shrink-0">
          <span className="text-white/55 text-[11px] font-semibold">채팅 반응 그래프</span>

          <div className="flex gap-3 mt-2 items-start">
            {/* ── 그래프 (flex-1) ── */}
            <div className="flex-1 min-w-0">
              <div className="relative" style={{height:'68px'}}>
                {/* Y축 레이블 */}
                <div className="absolute -left-1 top-0 bottom-0 flex flex-col justify-between text-[9px] text-white/20 pointer-events-none" style={{width:'22px'}}>
                  <span>100</span><span>50</span><span>0</span>
                </div>

                {/* SVG + 마우스 이벤트 */}
                <div
                  className="absolute inset-0 cursor-crosshair"
                  style={{left:'22px'}}
                  onMouseMove={e => {
                    const r = e.currentTarget.getBoundingClientRect()
                    setGraphPos(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)))
                  }}
                  onMouseLeave={() => setGraphPos(null)}
                >
                  <svg width="100%" height="68" viewBox="0 0 800 68" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="wg3" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7c3aed" stopOpacity=".45"/>
                        <stop offset="100%" stopColor="#7c3aed" stopOpacity=".03"/>
                      </linearGradient>
                    </defs>

                    {/* 격자선 */}
                    {[0.33,0.66].map(f => (
                      <line key={f} x1="0" y1={68*f} x2="800" y2={68*f} stroke="rgba(255,255,255,.05)" strokeWidth="1"/>
                    ))}

                    {/* 클립 hover 하이라이트 밴드 */}
                    {hClip && (
                      <g>
                        <rect x={hClip.pos/100*800 - 32} y={0} width={64} height={68}
                          fill="rgba(168,85,247,0.15)" rx={3}/>
                        <line
                          x1={hClip.pos/100*800} y1={0}
                          x2={hClip.pos/100*800} y2={68}
                          stroke="#a855f7" strokeWidth={1.5} strokeDasharray="4 3" opacity={0.75}/>
                      </g>
                    )}

                    {/* 파형 fill & stroke */}
                    <path d={buildPath(WAVE,800,68,true)} fill="url(#wg3)"/>
                    <path d={buildPath(WAVE,800,68,false)} fill="none" stroke="#7c3aed" strokeWidth="1.5"/>

                    {/* 마우스 크로스헤어 + 추적 점만 — 툴팁은 우측 패널로 분리 */}
                    {graphPos !== null && (
                      <g>
                        <line
                          x1={graphPos*800} y1={0}
                          x2={graphPos*800} y2={68}
                          stroke="rgba(255,255,255,0.22)" strokeWidth={1} strokeDasharray="3 2"/>
                        <circle
                          cx={graphPos*800}
                          cy={68 - WAVE[waveIdx]*68*0.88}
                          r={3.5} fill="#06b6d4"
                          style={{filter:'drop-shadow(0 0 5px #06b6d4)'}}/>
                      </g>
                    )}
                  </svg>
                </div>
              </div>

              <div className="flex justify-between text-[10px] text-white/25 mt-1" style={{paddingLeft:'22px'}}>
                {['00:00:00','01:45:00','03:30:00','05:15:00'].map(t => <span key={t}>{t}</span>)}
                <span className="text-accent-purple/60">07:03:15</span>
              </div>
            </div>

            {/* ── 오른쪽 점수 패널 (그래프와 나란히) ── */}
            <div
              className="flex-shrink-0 rounded-xl border transition-all duration-150 overflow-hidden"
              style={{
                width: '112px',
                opacity: graphPos !== null ? 1 : 0,
                transform: graphPos !== null ? 'translateX(0)' : 'translateX(6px)',
                pointerEvents: 'none',
                background: '#131325',
                borderColor: 'rgba(255,255,255,0.10)',
                padding: '8px 10px',
              }}
            >
              <div className="text-white/35 text-[9px] font-mono font-semibold mb-2 tracking-wide">
                {hoverTime || '──:──:──'}
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-white/40 text-[9px]">채팅 반응</span>
                  <span className="text-cyan-400 text-[10px] font-bold">{hoverChat}점</span>
                </div>
                <div className="h-0.5 bg-white/[0.07] rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400/55 rounded-full transition-all duration-75"
                    style={{width:`${hoverChat}%`}}/>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/40 text-[9px]">영상 분석</span>
                  <span className="text-purple-300 text-[10px] font-bold">{hoverVid}점</span>
                </div>
                <div className="h-0.5 bg-white/[0.07] rounded-full overflow-hidden">
                  <div className="h-full bg-purple-400/55 rounded-full transition-all duration-75"
                    style={{width:`${hoverVid * 5}%`}}/>
                </div>
              </div>
              <div className="mt-2 pt-1.5 border-t border-white/[0.07] flex items-center justify-between">
                <span className="text-white/45 text-[9px]">종합</span>
                <span className="text-accent-purple text-[12px] font-bold">{hoverTotal}점</span>
              </div>
            </div>
          </div>
        </Card>

        {/* ── 추천 하이라이트 클립 ── */}
        <div className="flex-1 min-h-0 flex flex-col">
          <div className="text-white/55 text-[11px] font-semibold mb-2 flex-shrink-0">
            추천 하이라이트 클립 (4)
            <span className="text-white/25 text-[10px] font-normal ml-2">클립에 마우스를 올리면 그래프에 위치가 표시됩니다</span>
          </div>
          <div className="grid grid-cols-4 gap-2" onClick={() => setOpenMenu(null)}>
            {CLIPS.map(clip => (
              <div key={clip.rank}
                onMouseEnter={() => setHoveredClip(clip.rank)}
                onMouseLeave={() => setHoveredClip(null)}
                onClick={() => { setOpenMenu(null); setSelectedClip(clip) }}
                className={`bg-white/[0.04] rounded-xl border transition-all cursor-pointer flex flex-col ${
                  hoveredClip === clip.rank
                    ? 'border-accent-purple/60 shadow-lg shadow-accent-purple/15 -translate-y-px'
                    : 'border-white/[0.07] hover:border-white/15'
                }`}
              >
                {/* Thumbnail */}
                <div className="rounded-t-xl overflow-hidden relative flex-shrink-0"
                  style={{aspectRatio:'16/6', background:'#0a0a14'}}>
                  <img
                    src={THUMB_IMGS[(clip.rank - 1) % THUMB_IMGS.length]}
                    alt={clip.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    draggable={false}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                      hoveredClip === clip.rank
                        ? 'bg-accent-purple/70 border-accent-purple'
                        : 'bg-white/20 border-white/25'
                    }`}>
                      <Play size={9} className="text-white ml-0.5" fill="white"/>
                    </div>
                  </div>
                  <div className="absolute top-1 left-1 flex items-center gap-0.5">
                    <span className="text-yellow-400 text-[10px] leading-none">♛</span>
                    <span className="text-white/80 text-[9px] font-bold">{clip.rank}</span>
                  </div>
                  <div className="absolute bottom-1 left-1 bg-black/60 text-white/65 text-[8px] px-1 py-px rounded">{clip.dur}</div>
                </div>

                {/* Info */}
                <div className="px-2 pt-1.5 pb-2 flex flex-col gap-1">
                  {/* 제목 + ··· */}
                  <div className="flex items-center gap-1">
                    <div className="text-white/80 text-[10px] font-semibold truncate flex-1">{clip.title}</div>
                    <div className="relative flex-shrink-0" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => setOpenMenu(openMenu === clip.rank ? null : clip.rank)}
                        className="text-white/25 hover:text-white/60 p-0.5 rounded transition-colors"
                      >
                        <MoreHorizontal size={10}/>
                      </button>
                      {openMenu === clip.rank && (
                        <div className="absolute right-0 top-full mt-0.5 z-30 bg-[#1a1a2e] border border-white/[0.12] rounded-lg shadow-2xl min-w-[108px] py-1">
                          {[
                            { icon:RotateCcw, label:'이 클립 재분석', color:'text-white/60' },
                            { icon:Upload,    label:'업로드',         color:'text-white/60' },
                            { icon:Download,  label:'내보내기',       color:'text-white/60' },
                            { icon:Trash2,    label:'삭제',           color:'text-red-400/70' },
                          ].map(({ icon:Icon, label, color }) => (
                            <button key={label} className={`flex items-center gap-2 w-full px-3 py-1.5 text-[10px] ${color} hover:bg-white/[0.05] transition-colors`}>
                              <Icon size={9}/>{label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 태그 */}
                  <div className="flex flex-wrap gap-1">
                    {clip.tags.map(tag => (
                      <span key={tag} className="text-[8px] text-accent-purple/70 bg-accent-purple/10 px-1.5 py-px rounded-full">{tag}</span>
                    ))}
                  </div>

                  {/* 시간 범위 */}
                  <div className="flex items-center gap-1 text-[8px]">
                    <span className="text-white/40">{clip.time.split('–')[0]}</span>
                    <span className="text-white/20">~</span>
                    <span className="text-white/40">{clip.time.split('–')[1]}</span>
                  </div>

                  {/* 종합 점수 */}
                  <div className="flex items-center justify-between">
                    <span className="text-white/25 text-[8px]">종합 점수</span>
                    <span className={`font-bold text-[10px] transition-colors ${
                      hoveredClip === clip.rank ? 'text-accent-purple' : 'text-accent-purple/75'
                    }`}>{clip.score}점</span>
                  </div>

                  {/* 타임라인 바 */}
                  <div>
                    <div className="flex justify-between text-[7px] text-white/20 mb-0.5">
                      <span>0:00</span>
                      <span className="text-accent-purple/55">{clip.time.split('–')[0]}</span>
                      <span>7:03</span>
                    </div>
                    <div className="relative h-1 bg-white/[0.08] rounded-full">
                      <div className="absolute inset-y-0 left-0 rounded-full bg-white/[0.05]" style={{width:`${clip.pos}%`}}/>
                      <div className="absolute inset-y-0 rounded-full bg-accent-purple/70"
                        style={{left:`${Math.max(0,clip.pos-0.3)}%`, width:'1.2%', boxShadow:'0 0 4px rgba(124,58,237,.9)'}}/>
                      <div className="absolute top-1/2 w-1.5 h-1.5 rounded-full bg-accent-purple"
                        style={{left:`${clip.pos}%`, transform:'translate(-50%,-50%)',
                          boxShadow: hoveredClip===clip.rank
                            ? '0 0 8px rgba(168,85,247,1)'
                            : '0 0 5px rgba(124,58,237,1)'}}/>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 상세 모달 */}
      <AnimatePresence>
        {selectedClip && (
          <ClipDetailModal clip={selectedClip} onClose={() => setSelectedClip(null)}/>
        )}
      </AnimatePresence>
    </PageWrap>
  )
}

// ══════════════════════════════════════════════════════════
// PAGE 3: 실시간 분석
// ══════════════════════════════════════════════════════════
function AnalysisPage() {
  const [elapsed, setElapsed] = useState(8073)
  useEffect(() => {
    const id = setInterval(() => setElapsed(e => e + 1), 1000)
    return () => clearInterval(id)
  }, [])

  const events = [
    { time:'02:14:08', type:'하이라이트', msg:'채팅 반응도 91% 감지 — 클립 생성됨', color:'text-purple-400' },
    { time:'02:11:33', type:'채팅 급증',  msg:'1분간 채팅 수 1,247건 돌파',          color:'text-cyan-400'   },
    { time:'01:48:03', type:'하이라이트', msg:'채팅 반응도 85% 감지 — 클립 생성됨', color:'text-purple-400' },
    { time:'01:41:15', type:'시청자 피크',msg:'동시 시청자 13,204명 달성',           color:'text-green-400'  },
    { time:'01:22:44', type:'채팅 급증',  msg:'1분간 채팅 수 987건 돌파',            color:'text-cyan-400'   },
  ]
  const liveStats = [
    { label:'현재 시청자',    value:'13,204', icon:Users,        color:'text-cyan-400'   },
    { label:'분당 채팅',      value:'1,247',  icon:MessageSquare,color:'text-purple-400' },
    { label:'하이라이트 점수',value:'87점',   icon:Star,         color:'text-yellow-400' },
    { label:'감지된 구간',    value:'12개',   icon:Zap,          color:'text-green-400'  },
  ]
  const liveClips = [CLIPS[0], CLIPS[1]]

  return (
    <PageWrap>
      <div className="px-5 pt-4 pb-2 flex-shrink-0 flex items-center justify-between">
        <div>
          <h3 className="text-white font-bold text-sm">실시간 분석</h3>
          <p className="text-white/35 text-[11px]">방송 중 실시간 감지 현황</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[11px] text-white/50 bg-white/[0.04] border border-white/[0.08] px-3 py-1.5 rounded-lg font-mono">
            경과 <span className="text-white/75 font-bold">{fmtSecs(elapsed)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-lg">
            <Wifi size={11}/> 실시간 연결 중
          </div>
        </div>
      </div>
      <div className="flex-1 px-5 pb-4 flex flex-col gap-3 min-h-0">
        <div className="grid grid-cols-4 gap-3 flex-shrink-0">
          {liveStats.map(s => {
            const Icon = s.icon
            return (
              <Card key={s.label} className="p-3">
                <div className="flex items-center gap-1.5 mb-1"><Icon size={12} className={s.color}/><span className="text-white/35 text-[10px]">{s.label}</span></div>
                <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
              </Card>
            )
          })}
        </div>
        <Card className="p-3 flex-shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse flex-shrink-0"/>
            <span className="text-white/55 text-[11px] font-semibold">방송 중 감지된 클립</span>
            <span className="text-red-400 text-[9px] bg-red-500/10 px-1.5 py-px rounded-full ml-auto">LIVE 중</span>
          </div>
          <div className="flex gap-2">
            {liveClips.map(clip => (
              <div key={clip.rank} className="flex-1 flex items-center gap-2.5 bg-white/[0.03] rounded-lg px-2.5 py-2 border border-white/[0.06]">
                <div className="relative flex-shrink-0 rounded overflow-hidden" style={{width:'48px',aspectRatio:'16/9'}}>
                  <img src={THUMB_IMGS[(clip.rank-1)%THUMB_IMGS.length]} alt={clip.title}
                    className="absolute inset-0 w-full h-full object-cover" draggable={false}/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-white/70 text-[10px] font-semibold truncate">{clip.title}</span>
                    <span className="text-red-400 text-[8px] bg-red-500/15 px-1.5 py-px rounded-full flex-shrink-0 font-semibold">LIVE 중 클립</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-accent-purple text-[9px] font-bold">{clip.score}점</span>
                    <span className="text-white/25 text-[9px]">·</span>
                    <span className="text-white/35 text-[9px]">{clip.dur}</span>
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button className="flex items-center gap-1 text-[9px] text-white/60 bg-white/[0.06] hover:bg-accent-purple/20 hover:text-accent-purple border border-white/[0.08] rounded-md px-2 py-1 transition-colors">
                    <Upload size={8}/> 업로드
                  </button>
                  <button className="flex items-center gap-1 text-[9px] text-white/60 bg-white/[0.06] hover:bg-cyan-500/15 hover:text-cyan-400 border border-white/[0.08] rounded-md px-2 py-1 transition-colors">
                    <Download size={8}/> 내보내기
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <div className="flex gap-3 flex-1 min-h-0">
          <Card className="flex-1 flex flex-col min-h-0">
            <div className="px-4 py-2.5 border-b border-white/[0.06] flex-shrink-0">
              <span className="text-white/55 text-xs font-semibold">이벤트 감지 로그</span>
            </div>
            <div className="flex-1 overflow-hidden">
              {events.map((e,i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-2.5 border-b border-white/[0.04] hover:bg-white/[0.02]">
                  <span className="text-white/30 text-[10px] flex-shrink-0 mt-0.5">{e.time}</span>
                  <span className={`text-[10px] font-semibold flex-shrink-0 mt-0.5 ${e.color}`}>{e.type}</span>
                  <span className="text-white/55 text-[10px]">{e.msg}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card className="w-44 flex-shrink-0 p-3 flex flex-col gap-3">
            <span className="text-white/55 text-[11px] font-semibold">키워드 분석</span>
            {[['클립각',94],['역전',88],['ㅋㅋㅋ',85],['대박',78],['와',72],['미쳤다',65]].map(([kw,pct]) => (
              <div key={kw}>
                <div className="flex justify-between text-[10px] mb-0.5">
                  <span className="text-white/60">{kw}</span>
                  <span className="text-accent-purple/70">{pct}%</span>
                </div>
                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full bg-accent-purple/60 rounded-full" style={{width:`${pct}%`}}/>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </PageWrap>
  )
}

// ══════════════════════════════════════════════════════════
// PAGE 4: 클립 관리 (클릭 → 상세 모달)
// ══════════════════════════════════════════════════════════
function ClipsPage() {
  const [openFilter,   setOpenFilter]   = useState<string | null>(null)
  const [openMenu,     setOpenMenu]     = useState<number | null>(null)
  const [activeFilters,setActiveFilters]= useState<Record<string,string>>({})
  const [selectedClip, setSelectedClip] = useState<Clip | null>(null)

  const filterDefs = [
    { id:'date',     label:'방송 날짜', opts:['전체','05.27','05.25','05.23','05.21'] },
    { id:'genre',    label:'게임 장르', opts:['전체','발로란트','리그오브레전드','스타크래프트','기타'] },
    { id:'platform', label:'플랫폼',   opts:['전체','치지직','SOOP'] },
    { id:'score',    label:'점수 범위', opts:['전체','90~100점','80~89점','70~79점','60~69점'] },
  ]

  const closeAll = () => { setOpenFilter(null); setOpenMenu(null) }

  return (
    <PageWrap>
      <div className="px-5 pt-4 pb-2 flex-shrink-0 flex items-center justify-between">
        <div>
          <h3 className="text-white font-bold text-sm">클립 관리</h3>
          <p className="text-white/35 text-[11px]">총 {ALL_CLIPS.length}개 클립 · 클립 클릭 시 상세 편집</p>
        </div>
        <div className="flex items-center gap-1.5 bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-1.5">
          <Search size={11} className="text-white/30"/>
          <input className="bg-transparent text-white/60 text-[11px] outline-none w-28 placeholder:text-white/25"
            placeholder="클립 검색..." readOnly/>
        </div>
      </div>

      {/* 필터 바 */}
      <div className="px-5 pb-2 flex-shrink-0" onClick={closeAll}>
        <div className="flex items-center gap-2">
          <Filter size={10} className="text-white/30 flex-shrink-0"/>
          {filterDefs.map(f => (
            <div key={f.id} className="relative" onClick={e => e.stopPropagation()}>
              <button
                onClick={() => setOpenFilter(openFilter === f.id ? null : f.id)}
                className={`flex items-center gap-1.5 text-[10px] px-2.5 py-1.5 rounded-lg border transition-colors ${
                  activeFilters[f.id] && activeFilters[f.id] !== '전체'
                    ? 'text-accent-purple border-accent-purple/40 bg-accent-purple/10'
                    : 'text-white/40 border-white/[0.08] bg-white/[0.03] hover:text-white/60'
                }`}
              >
                {activeFilters[f.id] && activeFilters[f.id] !== '전체' ? activeFilters[f.id] : f.label}
                <ChevronDown size={8} className={`transition-transform ${openFilter===f.id?'rotate-180':''}`}/>
              </button>
              {openFilter === f.id && (
                <div className="absolute left-0 top-full mt-1 z-30 bg-[#1a1a2e] border border-white/[0.12] rounded-lg shadow-2xl min-w-[120px] py-1">
                  {f.opts.map(opt => (
                    <button key={opt}
                      onClick={() => { setActiveFilters(p => ({...p,[f.id]:opt})); setOpenFilter(null) }}
                      className={`w-full text-left px-3 py-1.5 text-[10px] hover:bg-white/[0.05] transition-colors ${
                        (activeFilters[f.id]??'전체')===opt ? 'text-accent-purple font-semibold' : 'text-white/55'
                      }`}
                    >{opt}</button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 px-5 pb-4 min-h-0 overflow-y-auto" onClick={closeAll}>
        <div className="grid grid-cols-4 gap-2">
          {ALL_CLIPS.map(clip => (
            <div key={clip.rank}
              onClick={() => { closeAll(); setSelectedClip(clip) }}
              className="bg-white/[0.04] rounded-xl border border-white/[0.07] hover:border-accent-purple/40 hover:-translate-y-px transition-all cursor-pointer flex flex-col group">
              {/* Thumbnail */}
              <div className="rounded-t-xl overflow-hidden relative flex-shrink-0"
                style={{aspectRatio:'16/6', background:'#0a0a14'}}>
                <img src={THUMB_IMGS[(clip.rank-1)%THUMB_IMGS.length]} alt={clip.title}
                  className="absolute inset-0 w-full h-full object-cover" draggable={false}/>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                  <div className="w-6 h-6 rounded-full bg-accent-purple/80 flex items-center justify-center border border-accent-purple">
                    <Play size={9} className="text-white ml-0.5" fill="white"/>
                  </div>
                </div>
                <div className="absolute top-1 left-1 flex items-center gap-0.5">
                  <span className="text-yellow-400 text-[10px] leading-none">♛</span>
                  <span className="text-white/80 text-[9px] font-bold">{clip.rank}</span>
                </div>
                <div className="absolute bottom-1 left-1 bg-black/60 text-white/65 text-[8px] px-1 py-px rounded">{clip.dur}</div>
                <div className="absolute bottom-1 right-1 bg-accent-purple text-white text-[8px] font-bold px-1 py-px rounded-full">{clip.score}점</div>
              </div>

              {/* Info */}
              <div className="px-2 pt-1.5 pb-2 flex flex-col gap-1">
                <div className="flex items-center gap-1">
                  <div className="text-white/80 text-[10px] font-semibold truncate flex-1">{clip.title}</div>
                  <div className="relative flex-shrink-0" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => setOpenMenu(openMenu===clip.rank ? null : clip.rank)}
                      className="text-white/25 hover:text-white/60 p-0.5 rounded transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <MoreHorizontal size={10}/>
                    </button>
                    {openMenu === clip.rank && (
                      <div className="absolute right-0 top-full mt-0.5 z-30 bg-[#1a1a2e] border border-white/[0.12] rounded-lg shadow-2xl min-w-[108px] py-1">
                        {[
                          { icon:Upload,    label:'업로드',         color:'text-white/60' },
                          { icon:Download,  label:'내보내기',       color:'text-white/60' },
                          { icon:RotateCcw, label:'이 클립 재분석', color:'text-white/60' },
                          { icon:Trash2,    label:'삭제',           color:'text-red-400/70' },
                        ].map(({ icon:Icon, label, color }) => (
                          <button key={label} className={`flex items-center gap-2 w-full px-3 py-1.5 text-[10px] ${color} hover:bg-white/[0.05] transition-colors`}>
                            <Icon size={9}/>{label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {clip.tags.map(t => (
                    <span key={t} className="text-[8px] text-accent-purple/70 bg-accent-purple/10 px-1.5 py-px rounded-full">{t}</span>
                  ))}
                </div>
                <div className="flex items-center gap-1 text-[8px]">
                  <span className="text-white/40">{clip.time.split('–')[0]}</span>
                  <span className="text-white/20">~</span>
                  <span className="text-white/40">{clip.time.split('–')[1]}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-white/25 text-[8px]">{clip.date}</span>
                  <span className="text-white/15 text-[8px]">·</span>
                  <span className={`text-[8px] px-1.5 py-px rounded-full font-medium ${
                    clip.platform==='치지직' ? 'text-green-400/70 bg-green-500/10' : 'text-orange-400/70 bg-orange-500/10'
                  }`}>{clip.platform}</span>
                </div>
                <div>
                  <div className="flex justify-between text-[7px] text-white/20 mb-0.5">
                    <span>0:00</span>
                    <span className="text-accent-purple/55">{clip.time.split('–')[0]}</span>
                    <span>7:03</span>
                  </div>
                  <div className="relative h-1 bg-white/[0.08] rounded-full">
                    <div className="absolute inset-y-0 left-0 rounded-full bg-white/[0.05]" style={{width:`${clip.pos}%`}}/>
                    <div className="absolute inset-y-0 rounded-full bg-accent-purple/70"
                      style={{left:`${Math.max(0,clip.pos-0.3)}%`, width:'1.2%', boxShadow:'0 0 4px rgba(124,58,237,.9)'}}/>
                    <div className="absolute top-1/2 w-1.5 h-1.5 rounded-full bg-accent-purple"
                      style={{left:`${clip.pos}%`, transform:'translate(-50%,-50%)', boxShadow:'0 0 5px rgba(124,58,237,1)'}}/>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedClip && (
          <ClipDetailModal clip={selectedClip} onClose={() => setSelectedClip(null)}/>
        )}
      </AnimatePresence>
    </PageWrap>
  )
}

// ══════════════════════════════════════════════════════════
// PAGE 5: 업로드 & 내보내기
// ══════════════════════════════════════════════════════════
function UploadPage() {
  const [activeTab,         setActiveTab]         = useState<'upload'|'export'>('upload')
  const [selectedClips,     setSelectedClips]     = useState(new Set<number>([1]))
  const [clipTitles,        setClipTitles]        = useState<Record<number,number>>({1:0})
  const [clipTags,          setClipTags]          = useState<Record<number,Set<number>>>({1: new Set([0,1,2,3,4,5])})
  const [selectedPlatforms, setSelectedPlatforms] = useState(new Set(['YouTube','치지직']))
  const [exportRatio,       setExportRatio]       = useState('16:9')
  const [exportSelected,    setExportSelected]    = useState(new Set<number>([1,2]))
  const [exportFormat,      setExportFormat]      = useState('MP4')

  const platforms = [
    { name:'YouTube', color:'#ff0000', icon:'▶', connected:true  },
    { name:'TikTok',  color:'#69c9d0', icon:'♪', connected:false },
    { name:'치지직',  color:'#00d564', icon:'◈', connected:true  },
    { name:'SOOP',    color:'#ff6b35', icon:'◉', connected:true  },
  ]
  const uploadClips = CLIPS.slice(0, 3)
  const connectedNames = platforms.filter(p => p.connected).map(p => p.name)
  const exportClips = ALL_CLIPS.slice(0,4)

  // 클립별 AI 추천 제목 2개
  const getAiTitles = (clip: Clip) => [
    `${clip.title} — 발로란트 EP.12 하이라이트`,
    `이 순간이 바로 클립각! ${clip.title}`,
  ]

  // 클립별 AI 추천 태그 풀 — 최대 5개
  const getAiTagPool = (clip: Clip) => {
    const base = ['#발로란트','#하이라이트','#BJ던파파이터','#치지직','#게임클립']
    return [...clip.tags.slice(0,2), ...base.filter(t => !clip.tags.includes(t))].slice(0,5)
  }

  // 클립의 선택된 태그 Set (없으면 처음 4개 기본 선택)
  const getClipTagSet = (rank: number) => clipTags[rank] ?? new Set([0,1,2,3])

  const togglePlatform = (name: string) => {
    setSelectedPlatforms(prev => { const n=new Set(prev); n.has(name)?n.delete(name):n.add(name); return n })
  }
  const toggleAllPlatforms = () => {
    setSelectedPlatforms(
      selectedPlatforms.size === connectedNames.length ? new Set() : new Set(connectedNames)
    )
  }
  const toggleClip = (rank: number) => {
    setSelectedClips(prev => {
      const n = new Set(prev)
      n.has(rank) ? n.delete(rank) : n.add(rank)
      return n
    })
  }
  const toggleAllClips = () => {
    const allRanks = uploadClips.map(c => c.rank)
    if (selectedClips.size === allRanks.length) {
      setSelectedClips(new Set())
    } else {
      setSelectedClips(new Set(allRanks))
      setClipTitles(prev => Object.fromEntries(allRanks.map(r => [r, prev[r] ?? 0])))
    }
  }
  const toggleClipTag = (rank: number, i: number) => {
    setClipTags(prev => {
      const cur = new Set(prev[rank] ?? new Set([0,1,2,3,4,5]))
      cur.has(i) ? cur.delete(i) : cur.add(i)
      return {...prev, [rank]: cur}
    })
  }
  const [clipCustomTitles, setClipCustomTitles] = useState<Record<number,string>>({})
  const [clipExtraTags,    setClipExtraTags]    = useState<Record<number,string[]>>({})
  const [clipTagInputs,    setClipTagInputs]    = useState<Record<number,string>>({})

  const setClipTitle = (rank: number, idx: number) => {
    setClipTitles(prev => ({...prev, [rank]: idx}))
    // AI 옵션 선택 시 직접입력 초기화
    setClipCustomTitles(prev => ({...prev, [rank]: ''}))
  }
  const setCustomTitle = (rank: number, val: string) => {
    setClipCustomTitles(prev => ({...prev, [rank]: val}))
    // 직접입력 시 -1(custom) 선택 상태로
    setClipTitles(prev => ({...prev, [rank]: val ? -1 : (prev[rank] ?? 0)}))
  }
  const addExtraTag = (rank: number) => {
    const raw = (clipTagInputs[rank] ?? '').trim()
    if (!raw) return
    const tag = raw.startsWith('#') ? raw : '#' + raw
    setClipExtraTags(prev => ({...prev, [rank]: [...(prev[rank] ?? []), tag]}))
    setClipTagInputs(prev => ({...prev, [rank]: ''}))
  }
  const removeExtraTag = (rank: number, i: number) => {
    setClipExtraTags(prev => ({...prev, [rank]: (prev[rank] ?? []).filter((_,j) => j !== i)}))
  }
  const toggleExport = (rank: number) => {
    setExportSelected(prev => { const n=new Set(prev); n.has(rank)?n.delete(rank):n.add(rank); return n })
  }
  const toggleAllExport = () => {
    setExportSelected(
      exportSelected.size === exportClips.length
        ? new Set()
        : new Set(exportClips.map(c => c.rank))
    )
  }

  return (
    <PageWrap>
      <div className="px-5 pt-4 pb-0 flex-shrink-0">
        <h3 className="text-white font-bold text-sm">업로드 & 내보내기</h3>
        <p className="text-white/35 text-[11px]">AI 추천으로 빠르게 업로드하세요</p>
        <div className="flex gap-1 mt-3 border-b border-white/[0.07]">
          {(['upload','export'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-semibold transition-colors border-b-2 -mb-px ${
                activeTab===tab ? 'text-accent-purple border-accent-purple' : 'text-white/35 border-transparent hover:text-white/55'
              }`}
            >{tab==='upload'?'업로드':'내보내기'}</button>
          ))}
        </div>
      </div>

      {activeTab === 'upload' ? (
        <div className="flex-1 px-5 pt-3 pb-4 flex flex-col gap-3 min-h-0 overflow-hidden">

          {/* ① 업로드 플랫폼 선택 */}
          <div className="flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/55 text-[11px] font-semibold">① 업로드 플랫폼 선택</span>
              <div className="flex items-center gap-2">
                <span className="text-white/30 text-[10px]">{selectedPlatforms.size}개 선택됨</span>
                <button
                  onClick={toggleAllPlatforms}
                  className="text-[10px] text-accent-purple/80 hover:text-accent-purple transition-colors"
                >
                  {selectedPlatforms.size === connectedNames.length ? '전체 해제' : '전체 선택'}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {platforms.map(p => {
                const isSel = selectedPlatforms.has(p.name)
                return (
                  <button
                    key={p.name}
                    disabled={!p.connected}
                    onClick={() => p.connected && togglePlatform(p.name)}
                    className={`relative rounded-xl border p-2.5 text-left transition-all ${
                      !p.connected
                        ? 'border-white/[0.05] bg-white/[0.02] opacity-40 cursor-not-allowed'
                        : isSel
                          ? 'border-transparent cursor-pointer'
                          : 'border-white/[0.07] bg-white/[0.03] hover:border-white/15 cursor-pointer'
                    }`}
                    style={p.connected && isSel ? {
                      background: p.color+'18', borderColor: p.color+'60',
                      boxShadow: `0 0 10px ${p.color}22`,
                    } : {}}
                  >
                    <div className={`absolute top-2 right-2 w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${
                      !p.connected ? 'border-white/15' : isSel ? 'border-transparent bg-accent-purple' : 'border-white/20'
                    }`}>
                      {p.connected && isSel && <span className="text-white text-[7px] font-bold leading-none">✓</span>}
                    </div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{
                          background: p.connected ? p.color+'33' : 'rgba(255,255,255,0.05)',
                          border: `1px solid ${p.connected ? p.color+'55' : 'rgba(255,255,255,0.08)'}`,
                        }}
                      >{p.icon}</div>
                      <span className={`text-[10px] font-semibold ${p.connected ? 'text-white/70' : 'text-white/30'}`}>{p.name}</span>
                    </div>
                    {p.connected
                      ? <span className="text-green-400 text-[8px] bg-green-500/10 px-1.5 py-px rounded-full">연결됨</span>
                      : <span className="text-white/25 text-[8px] bg-white/[0.05] px-1.5 py-px rounded-full">연결안됨</span>
                    }
                  </button>
                )
              })}
            </div>
          </div>

          {/* ② 클립 선택 */}
          <Card className="p-3 flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/55 text-[11px] font-semibold">② 클립 선택</span>
              <div className="flex items-center gap-2">
                <span className="text-white/30 text-[10px]">{selectedClips.size}개 선택됨</span>
                <button
                  onClick={toggleAllClips}
                  className="text-[10px] text-accent-purple/80 hover:text-accent-purple transition-colors"
                >
                  {selectedClips.size === uploadClips.length ? '전체 해제' : '전체 선택'}
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              {uploadClips.map(clip => {
                const isSel = selectedClips.has(clip.rank)
                return (
                  <div key={clip.rank}
                    onClick={() => toggleClip(clip.rank)}
                    className={`flex-1 rounded-lg overflow-hidden border cursor-pointer transition-all ${
                      isSel
                        ? 'border-accent-purple/60 ring-1 ring-accent-purple/30'
                        : 'border-white/[0.07] opacity-50 hover:opacity-75 hover:border-white/15'
                    }`}
                  >
                    <div className="relative" style={{aspectRatio:'16/9'}}>
                      <img src={THUMB_IMGS[(clip.rank-1)%THUMB_IMGS.length]} alt={clip.title}
                        className="absolute inset-0 w-full h-full object-cover" draggable={false}/>
                      <div className={`absolute top-1 left-1 w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                        isSel ? 'bg-accent-purple border-accent-purple' : 'bg-black/40 border-white/40'
                      }`}>
                        {isSel && <span className="text-white text-[8px] font-bold">✓</span>}
                      </div>
                      <div className="absolute bottom-1 right-1 bg-accent-purple text-white text-[8px] font-bold px-1.5 py-px rounded-full">{clip.score}점</div>
                      <div className="absolute bottom-1 left-1 bg-black/60 text-white/70 text-[8px] px-1 py-px rounded">{clip.dur}</div>
                    </div>
                    <div className={`px-2 py-1.5 ${isSel ? 'bg-accent-purple/10' : 'bg-white/[0.02]'}`}>
                      <div className="text-white/75 text-[9px] font-semibold truncate">{clip.title}</div>
                      <div className="flex gap-1 mt-0.5">
                        {clip.tags.slice(0,2).map(tag => (
                          <span key={tag} className="text-[8px] text-accent-purple/60">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* ③ AI 추천 제목 + 태그 — 클립별 개별 적용 */}
          {selectedClips.size > 0 && (
            selectedClips.size === 1 ? (
              /* ── 클립 1개: 제목(왼쪽) + 태그(오른쪽) 나란히 ── */
              (() => {
                const clip    = uploadClips.find(c => selectedClips.has(c.rank))!
                const tagPool = getAiTagPool(clip)
                const tagSet  = getClipTagSet(clip.rank)
                const selIdx  = clipTitles[clip.rank] ?? 0
                return (
                  <div className="flex gap-3 flex-shrink-0">
                    {/* 제목 */}
                    <Card className="flex-1 p-3 min-w-0">
                      <span className="text-white/55 text-[11px] font-semibold block mb-2">③ AI 추천 제목</span>
                      <div className="space-y-1.5">
                        {getAiTitles(clip).map((t, i) => (
                          <button key={i} onClick={() => setClipTitle(clip.rank, i)}
                            className={`w-full flex items-start gap-2 text-left p-2 rounded-lg border transition-colors text-[10px] ${
                              selIdx === i
                                ? 'border-accent-purple/50 bg-accent-purple/10 text-white/80'
                                : 'border-white/[0.06] bg-white/[0.02] text-white/45 hover:bg-white/[0.04]'
                            }`}>
                            <span className={`mt-0.5 w-3 h-3 rounded-full border flex-shrink-0 flex items-center justify-center ${
                              selIdx === i ? 'border-accent-purple bg-accent-purple' : 'border-white/25'
                            }`}>
                              {selIdx === i && <span className="text-white text-[6px]">●</span>}
                            </span>
                            <span className="leading-snug">{t}</span>
                          </button>
                        ))}
                        {/* 직접 입력 */}
                        <div className={`flex items-center gap-2 p-2 rounded-lg border transition-colors ${
                          selIdx === -1 ? 'border-accent-purple/50 bg-accent-purple/10' : 'border-white/[0.06] bg-white/[0.02]'
                        }`}>
                          <span className={`w-3 h-3 rounded-full border flex-shrink-0 flex items-center justify-center ${
                            selIdx === -1 ? 'border-accent-purple bg-accent-purple' : 'border-white/25'
                          }`}>
                            {selIdx === -1 && <span className="text-white text-[6px]">●</span>}
                          </span>
                          <input
                            value={clipCustomTitles[clip.rank] ?? ''}
                            onChange={e => setCustomTitle(clip.rank, e.target.value)}
                            placeholder="직접 입력..."
                            className="flex-1 bg-transparent text-white/65 text-[10px] outline-none placeholder:text-white/20"
                          />
                        </div>
                      </div>
                    </Card>
                    {/* 태그 */}
                    <Card className="w-44 flex-shrink-0 p-3">
                      <span className="text-white/55 text-[11px] font-semibold block mb-2">AI 추천 태그</span>
                      <div className="flex flex-wrap gap-1">
                        {tagPool.map((tag, i) => (
                          <button key={tag} onClick={() => toggleClipTag(clip.rank, i)}
                            className={`text-[9px] px-1.5 py-px rounded-full border transition-colors ${
                              tagSet.has(i) ? 'text-accent-purple border-accent-purple/50 bg-accent-purple/15' : 'text-white/30 border-white/[0.08] hover:border-white/20'
                            }`}>
                            {tagSet.has(i) ? '✕ ':''}{tag}
                          </button>
                        ))}
                        {/* 직접 추가한 태그 */}
                        {(clipExtraTags[clip.rank] ?? []).map((tag, i) => (
                          <button key={tag+i} onClick={() => removeExtraTag(clip.rank, i)}
                            className="text-[9px] px-1.5 py-px rounded-full border text-cyan-400/80 border-cyan-500/35 bg-cyan-500/10 transition-colors hover:border-red-400/40 hover:text-red-400/70">
                            ✕ {tag}
                          </button>
                        ))}
                        {/* 직접 입력 */}
                        <div className="flex items-center bg-white/[0.04] border border-white/[0.09] rounded-full px-2 py-0.5 gap-1">
                          <input
                            value={clipTagInputs[clip.rank] ?? ''}
                            onChange={e => setClipTagInputs(prev => ({...prev, [clip.rank]: e.target.value}))}
                            onKeyDown={e => { if (e.key === 'Enter') addExtraTag(clip.rank) }}
                            placeholder="+ 직접 입력"
                            className="bg-transparent text-white/50 text-[9px] outline-none w-16 placeholder:text-white/20"
                          />
                        </div>
                      </div>
                    </Card>
                  </div>
                )
              })()
            ) : (
              /* ── 클립 여러 개: 클립별 섹션 (제목 + 태그 통합) ── */
              <Card className="p-3 flex-shrink-0">
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="text-white/55 text-[11px] font-semibold">③ AI 추천 제목 + 태그</span>
                  <span className="text-[9px] text-cyan-400/70 bg-cyan-500/10 px-2 py-px rounded-full">클립별 개별 적용</span>
                </div>
                <div className="space-y-2">
                  {uploadClips.filter(c => selectedClips.has(c.rank)).map(clip => {
                    const tagPool = getAiTagPool(clip)
                    const tagSet  = getClipTagSet(clip.rank)
                    const selIdx  = clipTitles[clip.rank] ?? 0
                    return (
                      <div key={clip.rank} className="rounded-lg border border-white/[0.07] overflow-hidden">
                        {/* 클립 헤더 */}
                        <div className="flex items-center gap-2 px-2.5 py-1.5 bg-white/[0.03] border-b border-white/[0.05]">
                          <div className="relative w-10 flex-shrink-0 rounded overflow-hidden" style={{aspectRatio:'16/9'}}>
                            <img src={THUMB_IMGS[(clip.rank-1)%THUMB_IMGS.length]} alt={clip.title}
                              className="absolute inset-0 w-full h-full object-cover" draggable={false}/>
                          </div>
                          <span className="text-white/70 text-[10px] font-semibold truncate flex-1">{clip.title}</span>
                          <span className="text-accent-purple text-[9px] font-bold flex-shrink-0">{clip.score}점</span>
                        </div>

                        <div className="p-2.5 flex gap-3">
                          {/* 제목 옵션 + 직접 입력 */}
                          <div className="flex-1 min-w-0 space-y-1">
                            {getAiTitles(clip).map((t, i) => (
                              <button key={i} onClick={() => setClipTitle(clip.rank, i)}
                                className={`w-full flex items-center gap-1.5 text-left px-2 py-1 rounded-md border transition-colors text-[9px] ${
                                  selIdx === i
                                    ? 'border-accent-purple/45 bg-accent-purple/10 text-white/75'
                                    : 'border-transparent text-white/35 hover:text-white/55 hover:bg-white/[0.03]'
                                }`}>
                                <span className={`w-2 h-2 rounded-full border flex-shrink-0 ${
                                  selIdx === i ? 'bg-accent-purple border-accent-purple' : 'border-white/20'
                                }`}/>
                                <span className="truncate">{t}</span>
                              </button>
                            ))}
                            {/* 직접 입력 */}
                            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border transition-colors ${
                              selIdx === -1 ? 'border-accent-purple/45 bg-accent-purple/10' : 'border-white/[0.06] bg-transparent'
                            }`}>
                              <span className={`w-2 h-2 rounded-full border flex-shrink-0 ${
                                selIdx === -1 ? 'bg-accent-purple border-accent-purple' : 'border-white/20'
                              }`}/>
                              <input
                                value={clipCustomTitles[clip.rank] ?? ''}
                                onChange={e => setCustomTitle(clip.rank, e.target.value)}
                                placeholder="직접 입력..."
                                className="flex-1 bg-transparent text-white/60 text-[9px] outline-none placeholder:text-white/20 min-w-0"
                              />
                            </div>
                          </div>

                          {/* 태그 옵션 + 직접 입력 */}
                          <div className="w-32 flex-shrink-0 border-l border-white/[0.05] pl-2.5">
                            <div className="text-white/25 text-[9px] mb-1.5">태그</div>
                            <div className="flex flex-wrap gap-1">
                              {tagPool.map((tag, i) => (
                                <button key={tag} onClick={() => toggleClipTag(clip.rank, i)}
                                  className={`text-[8px] px-1.5 py-px rounded-full border transition-colors ${
                                    tagSet.has(i) ? 'text-accent-purple border-accent-purple/50 bg-accent-purple/15' : 'text-white/25 border-white/[0.07] hover:border-white/15'
                                  }`}>
                                  {tagSet.has(i) ? '✕ ':''}{tag}
                                </button>
                              ))}
                              {(clipExtraTags[clip.rank] ?? []).map((tag, i) => (
                                <button key={tag+i} onClick={() => removeExtraTag(clip.rank, i)}
                                  className="text-[8px] px-1.5 py-px rounded-full border text-cyan-400/75 border-cyan-500/30 bg-cyan-500/10 hover:border-red-400/40 hover:text-red-400/70 transition-colors">
                                  ✕ {tag}
                                </button>
                              ))}
                              <div className="flex items-center bg-white/[0.04] border border-white/[0.09] rounded-full px-1.5 py-0.5 gap-1 mt-0.5">
                                <input
                                  value={clipTagInputs[clip.rank] ?? ''}
                                  onChange={e => setClipTagInputs(prev => ({...prev, [clip.rank]: e.target.value}))}
                                  onKeyDown={e => { if (e.key === 'Enter') addExtraTag(clip.rank) }}
                                  placeholder="+ 입력"
                                  className="bg-transparent text-white/45 text-[8px] outline-none w-12 placeholder:text-white/20"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            )
          )}

          {/* 업로드 버튼 */}
          <button
            disabled={selectedClips.size === 0 || selectedPlatforms.size === 0}
            className="w-full flex items-center justify-center gap-2 bg-accent-purple text-white text-[11px] font-bold py-2.5 rounded-xl hover:bg-accent-purple/90 transition-colors flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{boxShadow:'0 0 16px rgba(124,58,237,.4)'}}
          >
            <Upload size={12}/>
            {selectedClips.size}개 클립 · {selectedPlatforms.size}개 플랫폼에 업로드
          </button>
        </div>
      ) : (
        <div className="flex-1 px-5 pt-3 pb-4 flex flex-col gap-3 min-h-0 overflow-hidden">
          {/* 클립 선택 */}
          <Card className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-white/55 text-xs font-semibold">클립 선택</span>
                <span className="text-white/30 text-[10px]">{exportSelected.size}/{exportClips.length}개 선택됨</span>
              </div>
              <button
                onClick={toggleAllExport}
                className="text-[10px] text-accent-purple/80 hover:text-accent-purple transition-colors"
              >
                {exportSelected.size === exportClips.length ? '전체 해제' : '전체 선택'}
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              {exportClips.map(clip => {
                const isSel = exportSelected.has(clip.rank)
                return (
                  <div
                    key={clip.rank}
                    onClick={() => toggleExport(clip.rank)}
                    className={`flex items-center gap-3 px-4 py-2.5 border-b border-white/[0.04] cursor-pointer transition-colors ${
                      isSel ? 'hover:bg-accent-purple/[0.04]' : 'opacity-45 hover:opacity-65 hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all ${
                      isSel ? 'bg-accent-purple border-accent-purple' : 'border-white/20 bg-transparent'
                    }`}>
                      {isSel && <span className="text-white text-[8px] font-bold">✓</span>}
                    </div>
                    <div className="relative flex-shrink-0 rounded overflow-hidden" style={{width:'52px',aspectRatio:'16/9'}}>
                      <img src={THUMB_IMGS[(clip.rank-1)%THUMB_IMGS.length]} alt={clip.title}
                        className="absolute inset-0 w-full h-full object-cover" draggable={false}/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-[11px] font-semibold truncate ${isSel ? 'text-white/75' : 'text-white/45'}`}>
                        {clip.title}
                      </div>
                      <div className="text-white/30 text-[10px]">{clip.dur} · {clip.date} · {clip.platform}</div>
                    </div>
                    <span className={`font-bold text-[10px] flex-shrink-0 ${isSel ? 'text-accent-purple' : 'text-accent-purple/40'}`}>
                      {clip.score}점
                    </span>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* 옵션 — 비율 + 포맷 통합 */}
          <Card className="flex-shrink-0 p-3">
            <div className="flex gap-3 items-start">
              {/* 비율 */}
              <div className="flex-1 min-w-0">
                <div className="text-white/35 text-[9px] font-semibold mb-1.5">비율</div>
                <div className="flex gap-1.5">
                  {([
                    { ratio:'16:9', desc:'YouTube · 치지직', w:22, h:12 },
                    { ratio:'9:16', desc:'TikTok · Shorts',  w:12, h:22 },
                    { ratio:'1:1',  desc:'Instagram · 피드', w:17, h:17 },
                  ] as {ratio:string;desc:string;w:number;h:number}[]).map(r => (
                    <button key={r.ratio} onClick={() => setExportRatio(r.ratio)}
                      className={`flex items-center gap-2 px-2.5 py-2 rounded-xl border transition-all flex-1 ${
                        exportRatio === r.ratio
                          ? 'border-accent-purple/55 bg-accent-purple/10'
                          : 'border-white/[0.07] bg-white/[0.02] hover:border-white/15'
                      }`}
                    >
                      <div className="flex items-center justify-center w-6 flex-shrink-0">
                        <div className={`rounded-sm border-2 transition-colors ${
                          exportRatio === r.ratio ? 'border-accent-purple' : 'border-white/25'
                        }`} style={{width:`${r.w}px`,height:`${r.h}px`}}/>
                      </div>
                      <div className="text-left min-w-0">
                        <div className={`text-[10px] font-bold ${exportRatio===r.ratio?'text-accent-purple':'text-white/50'}`}>{r.ratio}</div>
                        <div className={`text-[8px] truncate ${exportRatio===r.ratio?'text-white/45':'text-white/20'}`}>{r.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              {/* 구분선 */}
              <div className="w-px self-stretch bg-white/[0.06] mx-1"/>
              {/* 포맷 */}
              <div className="flex-shrink-0">
                <div className="text-white/35 text-[9px] font-semibold mb-1.5">포맷</div>
                <div className="flex gap-1.5">
                  {([
                    ['MP4', 'H.264 · 범용'],
                    ['MOV', 'H.264 · 편집용'],
                    ['WebM','VP9 · 웹'],
                  ] as [string,string][]).map(([fmt, desc]) => (
                    <button key={fmt} onClick={() => setExportFormat(fmt)}
                      className={`px-2.5 py-2 rounded-xl border transition-all text-left ${
                        exportFormat===fmt
                          ? 'border-accent-purple/55 bg-accent-purple/10'
                          : 'border-white/[0.07] bg-white/[0.02] hover:border-white/15'
                      }`}
                    >
                      <div className={`text-[10px] font-bold ${exportFormat===fmt?'text-accent-purple':'text-white/50'}`}>{fmt}</div>
                      <div className={`text-[8px] ${exportFormat===fmt?'text-white/40':'text-white/20'}`}>{desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* 일괄 다운로드 */}
          <button
            disabled={exportSelected.size === 0}
            className="w-full flex items-center justify-center gap-2 border border-accent-purple/40 text-accent-purple text-[11px] font-bold py-2.5 rounded-xl hover:bg-accent-purple/10 transition-colors flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download size={12}/>
            선택된 {exportSelected.size}개 클립 · {exportRatio} · {exportFormat}으로 다운로드
          </button>
        </div>
      )}
    </PageWrap>
  )
}

// ══════════════════════════════════════════════════════════
// PAGE 6: 방송 관리
// ══════════════════════════════════════════════════════════
function BroadcastPage() {
  const broadcasts = [
    { date:'2025.05.27', title:'발로란트 마스터 도전기 EP.12', platform:'치지직', dur:'7:03:15', viewers:'13,204', clips:12, status:'완료' },
    { date:'2025.05.25', title:'던전파이터 레이드 공략',       platform:'치지직', dur:'4:22:10', viewers:'9,847',  clips:8,  status:'완료' },
    { date:'2025.05.23', title:'리그 오브 레전드 챌린저 도전', platform:'SOOP',   dur:'5:48:30', viewers:'11,203', clips:10, status:'완료' },
    { date:'2025.05.21', title:'스타크래프트 래더 매치',       platform:'치지직', dur:'3:11:45', viewers:'7,521',  clips:6,  status:'완료' },
    { date:'2025.05.19', title:'메이플스토리 보스 공략',       platform:'SOOP',   dur:'6:22:00', viewers:'8,912',  clips:9,  status:'완료' },
  ]
  return (
    <PageWrap>
      <div className="px-5 pt-4 pb-2 flex-shrink-0 flex items-center justify-between">
        <div>
          <h3 className="text-white font-bold text-sm">방송 관리</h3>
          <p className="text-white/35 text-[11px]">방송 이력 및 스트림 설정</p>
        </div>
        <div className="flex items-center gap-1.5 bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-1.5">
          <Calendar size={11} className="text-white/30"/>
          <span className="text-white/40 text-[11px]">2025.05</span>
        </div>
      </div>
      <div className="flex-1 px-5 pb-4 flex flex-col gap-3 min-h-0">
        <div className="grid grid-cols-3 gap-3 flex-shrink-0">
          {[
            { label:'이번 달 총 방송', value:'3회',     color:'text-cyan-400'   },
            { label:'평균 시청자 수',  value:'10,137명', color:'text-purple-400' },
            { label:'생성 클립 수',    value:'47개',     color:'text-green-400'  },
          ].map(s => (
            <Card key={s.label} className="p-3">
              <div className="text-white/35 text-[10px]">{s.label}</div>
              <div className={`text-lg font-bold mt-0.5 ${s.color}`}>{s.value}</div>
            </Card>
          ))}
        </div>
        <Card className="flex-1 flex flex-col min-h-0">
          <div className="px-4 py-2.5 border-b border-white/[0.06] flex-shrink-0">
            <span className="text-white/55 text-xs font-semibold">방송 이력</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b border-white/[0.05]">
                  {['날짜','방송 제목','플랫폼','시간','시청자','클립','상태'].map(h => (
                    <th key={h} className="px-4 py-2 text-left text-white/30 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {broadcasts.map(b => (
                  <tr key={b.date+b.title} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                    <td className="px-4 py-2.5 text-white/40">{b.date}</td>
                    <td className="px-4 py-2.5 text-white/70 font-medium max-w-[200px] truncate">{b.title}</td>
                    <td className="px-4 py-2.5">
                      <span className={`text-[9px] px-1.5 py-px rounded-full font-medium ${
                        b.platform==='치지직'?'text-green-400/70 bg-green-500/10':'text-orange-400/70 bg-orange-500/10'
                      }`}>{b.platform}</span>
                    </td>
                    <td className="px-4 py-2.5 text-white/40">{b.dur}</td>
                    <td className="px-4 py-2.5 text-cyan-400">{b.viewers}</td>
                    <td className="px-4 py-2.5 text-accent-purple font-semibold">{b.clips}개</td>
                    <td className="px-4 py-2.5"><span className="text-green-400/80 bg-green-500/10 px-2 py-px rounded-full">{b.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </PageWrap>
  )
}

// ══════════════════════════════════════════════════════════
// PAGE 7: 설정
// ══════════════════════════════════════════════════════════
function SettingsPage() {
  const [chzKey,      setChzKey]      = useState('chzzk_live_••••••••••••••••')
  const [soopKey,     setSoopKey]     = useState('')
  const [showChz,     setShowChz]     = useState(false)
  const [showSoop,    setShowSoop]    = useState(false)
  const [streamTab,   setStreamTab]   = useState<'치지직'|'SOOP'>('치지직')
  const [notifs,      setNotifs]      = useState<Record<string,boolean>>({
    '하이라이트 감지 시': true, '방송 종료 후 요약': true,
    '클립 업로드 완료': false, '주간 리포트': true,
  })

  const CLIVO_RTMP    = 'rtmp://stream.clivo.ai/live'
  const CLIVO_CHZ_KEY = 'clv_chz_9f3k••••••••'
  // SOOP 키가 입력되면 해시 기반으로 Clivo 키 생성 (데모용 결정론적 값)
  const CLIVO_SOOP_KEY = soopKey
    ? 'clv_soop_' + (soopKey.slice(-4).padStart(4,'x')) + '••••••••'
    : ''

  const copyText = (text: string) => navigator.clipboard?.writeText(text)

  const streamPlatforms = {
    '치지직': {
      icon:'◈', color:'#00d564', colorCls:'text-green-400', borderCls:'border-green-500/25',
      connected: !!chzKey, platformKey: chzKey, setPlatformKey: setChzKey,
      show: showChz, setShow: setShowChz,
      clivoKey: CLIVO_CHZ_KEY, placeholder:'치지직 스트림 키 붙여넣기',
      hint:'치지직 스튜디오 → 방송 설정 → 스트림 키',
    },
    'SOOP': {
      icon:'◉', color:'#ff6b35', colorCls:'text-orange-400', borderCls:'border-orange-500/20',
      connected: !!soopKey, platformKey: soopKey, setPlatformKey: setSoopKey,
      show: showSoop, setShow: setShowSoop,
      clivoKey: CLIVO_SOOP_KEY, placeholder:'SOOP 스트림 키 붙여넣기',
      hint:'SOOP 방송국 → 방송 설정 → 스트림 키',
    },
  } as Record<string, {
    icon:string; color:string; colorCls:string; borderCls:string
    connected:boolean; platformKey:string; setPlatformKey:(v:string)=>void
    show:boolean; setShow:(v:boolean)=>void
    clivoKey:string; placeholder:string; hint:string
  }>

  const p = streamPlatforms[streamTab]

  return (
    <PageWrap>
      <div className="px-5 pt-4 pb-2 flex-shrink-0">
        <h3 className="text-white font-bold text-sm">설정</h3>
        <p className="text-white/35 text-[11px]">스트림 연동 및 서비스 설정</p>
      </div>

      <div className="flex-1 px-5 pb-4 flex gap-3 min-h-0 overflow-y-auto">
        {/* ── 왼쪽: 연동 설정 ── */}
        <div className="flex-1 flex flex-col gap-3 min-h-0">

          {/* 스트리밍 연동 — 탭 방식 */}
          <Card className="p-4 flex-shrink-0">
            <div className="flex items-center gap-2 mb-1">
              <Wifi size={13} className="text-cyan-400"/>
              <span className="text-white/70 text-xs font-semibold">스트리밍 연동</span>
            </div>

            {/* 릴레이 흐름 */}
            <div className="flex items-center gap-1.5 mb-3 bg-white/[0.03] rounded-lg px-3 py-2 border border-white/[0.06]">
              <span className="text-white/40 text-[10px] font-mono">OBS</span>
              <span className="text-white/20 text-[10px]">→</span>
              <span className="text-accent-purple text-[10px] font-semibold">Clivo 서버</span>
              <span className="text-white/20 text-[10px]">→</span>
              <span className="text-green-400 text-[10px] font-mono">치지직 / SOOP</span>
              <span className="text-white/20 text-[9px] ml-auto">릴레이 방식</span>
            </div>

            {/* 플랫폼 탭 */}
            <div className="flex gap-1.5 mb-3">
              {(['치지직', 'SOOP'] as const).map(tab => {
                const info = streamPlatforms[tab]
                const isActive = streamTab === tab
                return (
                  <button
                    key={tab}
                    onClick={() => setStreamTab(tab)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-semibold transition-all ${
                      isActive
                        ? `${info.colorCls} border-current bg-white/[0.05]`
                        : 'text-white/30 border-white/[0.08] hover:text-white/50'
                    }`}
                  >
                    <span style={{color: isActive ? info.color : undefined}}>{info.icon}</span>
                    {tab}
                    <span className={`text-[8px] px-1.5 py-px rounded-full ml-0.5 ${
                      info.connected
                        ? 'text-green-400 bg-green-500/15'
                        : 'text-white/25 bg-white/[0.06]'
                    }`}>
                      {info.connected ? '연결됨' : '미연결'}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* 선택된 플랫폼 설정 */}
            <div className={`rounded-xl border p-3 ${p.borderCls}`} style={{background:'rgba(255,255,255,0.02)'}}>
              {/* Step 1 */}
              <div className="mb-3">
                <div className="text-white/35 text-[9px] font-semibold mb-1.5 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-white/[0.08] flex items-center justify-center text-[8px] font-bold text-white/50">1</span>
                  {streamTab} 스트림 키 입력
                </div>
                <div className="flex items-center gap-2 bg-black/20 rounded-lg border border-white/[0.08] px-2.5 py-1.5">
                  <input
                    type={p.show ? 'text' : 'password'}
                    value={p.platformKey}
                    onChange={e => p.setPlatformKey(e.target.value)}
                    placeholder={p.placeholder}
                    className="flex-1 bg-transparent text-white/55 text-[10px] font-mono outline-none placeholder:text-white/20"
                    style={{letterSpacing: p.show ? undefined : '0.12em'}}
                  />
                  <button onClick={() => p.setShow(!p.show)}
                    className={`text-[9px] hover:text-white/60 transition-colors flex-shrink-0 ${p.show ? 'text-accent-purple/70' : 'text-white/25'}`}>
                    {p.show ? '숨김' : '표시'}
                  </button>
                </div>
                <div className="text-white/20 text-[9px] mt-1 ml-0.5">{p.hint}</div>
              </div>

              {/* Step 2 */}
              <div>
                <div className="text-white/35 text-[9px] font-semibold mb-1.5 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-white/[0.08] flex items-center justify-center text-[8px] font-bold text-white/50">2</span>
                  OBS에 아래 정보 입력
                </div>
                <div className={`space-y-1.5 ${!p.connected ? 'opacity-35 pointer-events-none' : ''}`}>
                  {[
                    { label:'RTMP 서버', value: CLIVO_RTMP },
                    { label:'스트림 키', value: p.connected ? p.clivoKey : '① 스트림 키 입력 후 자동 발급' },
                  ].map(row => (
                    <div key={row.label} className="flex items-center gap-2 bg-black/20 rounded-lg border border-white/[0.07] px-2.5 py-1.5">
                      <span className="text-white/25 text-[9px] w-16 flex-shrink-0">{row.label}</span>
                      <span className="text-white/55 text-[10px] font-mono flex-1 truncate">{row.value}</span>
                      {p.connected && (
                        <button onClick={() => copyText(row.value)}
                          className="text-accent-purple/60 text-[9px] hover:text-accent-purple transition-colors flex-shrink-0">
                          복사
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* 업로드 플랫폼 연동 */}
          <Card className="p-4 flex-shrink-0">
            <div className="flex items-center gap-2 mb-3">
              <Link2 size={13} className="text-cyan-400"/>
              <span className="text-white/70 text-xs font-semibold">업로드 플랫폼 연동</span>
              <span className="text-white/25 text-[9px] ml-auto">클립 업로드용 OAuth 연결</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {([
                { name:'YouTube', icon:'▶', color:'#ff0000', connected:true  },
                { name:'TikTok',  icon:'♪', color:'#69c9d0', connected:false },
                { name:'치지직',  icon:'◈', color:'#00d564', connected:true  },
                { name:'SOOP',    icon:'◉', color:'#ff6b35', connected:true  },
              ] as {name:string;icon:string;color:string;connected:boolean}[]).map(pl => (
                <div key={pl.name} className="flex items-center gap-2.5 bg-white/[0.03] rounded-xl border border-white/[0.06] px-3 py-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                    style={{background:pl.color+'22', border:`1px solid ${pl.color}44`}}>{pl.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white/65 text-[10px] font-semibold">{pl.name}</div>
                    <div className={`text-[9px] ${pl.connected?'text-green-400':'text-white/25'}`}>
                      {pl.connected ? '연결됨' : '연결안됨'}
                    </div>
                  </div>
                  <button className={`text-[9px] px-2 py-1 rounded-lg border transition-colors flex-shrink-0 ${
                    pl.connected
                      ? 'text-white/30 border-white/[0.08] hover:border-red-500/30 hover:text-red-400/70'
                      : 'text-accent-purple border-accent-purple/35 hover:bg-accent-purple/10'
                  }`}>
                    {pl.connected ? '해제' : '연결'}
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ── 오른쪽 사이드바 ── */}
        <div className="w-48 flex-shrink-0 flex flex-col gap-3">
          {/* 계정 정보 */}
          <Card className="p-3">
            <div className="flex items-center gap-2 mb-2.5">
              <Shield size={11} className="text-accent-purple"/>
              <span className="text-white/55 text-[11px] font-semibold">계정 정보</span>
            </div>
            {([
              ['스트리머명','BJ 던파파이터'],
              ['이메일','dunpa@example.com'],
              ['가입일','2025. 03. 12'],
            ] as [string,string][]).map(([l,v]) => (
              <div key={l} className="flex justify-between py-1.5 border-b border-white/[0.05] last:border-0">
                <span className="text-white/30 text-[10px]">{l}</span>
                <span className="text-white/60 text-[10px] font-medium truncate max-w-[96px] text-right">{v}</span>
              </div>
            ))}
          </Card>

          {/* Clivo 플랜 */}
          <Card className="p-3">
            <div className="flex items-center gap-2 mb-2.5">
              <Star size={11} className="text-yellow-400"/>
              <span className="text-white/55 text-[11px] font-semibold">Clivo 플랜</span>
              <span className="ml-auto text-[8px] px-1.5 py-px rounded-full bg-yellow-400/15 text-yellow-400 font-bold">Pro</span>
            </div>
            {/* 사용량 바 */}
            {([
              { label:'이번 달 방송', used:3,  total:20,  unit:'회',  color:'bg-accent-purple/70' },
              { label:'클립 저장',    used:47, total:200, unit:'개',  color:'bg-cyan-400/70'       },
              { label:'저장 공간',    used:14, total:50,  unit:'GB',  color:'bg-green-400/70'      },
            ] as {label:string;used:number;total:number;unit:string;color:string}[]).map(item => (
              <div key={item.label} className="mb-2.5 last:mb-0">
                <div className="flex justify-between mb-1">
                  <span className="text-white/35 text-[10px]">{item.label}</span>
                  <span className="text-white/50 text-[10px] font-mono">
                    {item.used}<span className="text-white/25">/{item.total}{item.unit}</span>
                  </span>
                </div>
                <div className="h-1 bg-white/[0.08] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${item.color}`}
                    style={{width:`${Math.round(item.used/item.total*100)}%`}}/>
                </div>
              </div>
            ))}
            <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-white/25 text-[9px]">다음 결제</span>
              <span className="text-white/45 text-[9px] font-mono">2025. 06. 12</span>
            </div>
          </Card>

          {/* 알림 설정 */}
          <Card className="p-3">
            <div className="flex items-center gap-2 mb-2.5">
              <Bell size={11} className="text-yellow-400"/>
              <span className="text-white/55 text-[11px] font-semibold">알림 설정</span>
            </div>
            {Object.entries(notifs).map(([l, on]) => (
              <div key={l} className="flex justify-between items-center py-2 border-b border-white/[0.05] last:border-0">
                <span className="text-white/45 text-[10px]">{l}</span>
                <button
                  onClick={() => setNotifs(prev => ({...prev, [l]: !prev[l]}))}
                  className={`w-7 h-3.5 rounded-full flex items-center px-0.5 transition-colors flex-shrink-0 ${on?'bg-accent-purple':'bg-white/10'}`}
                >
                  <div className={`w-2.5 h-2.5 rounded-full bg-white transition-transform ${on?'translate-x-3.5':''}`}/>
                </button>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </PageWrap>
  )
}

// ══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════
export default function LiveDashboard() {
  const { ref, inView } = useInView()
  const [activePage, setActivePage] = useState<Page>('highlight')

  const pageComponents: Record<Page, React.ReactNode> = {
    dashboard: <DashboardPage />,
    highlight: <HighlightPage />,
    analysis:  <AnalysisPage />,
    clips:     <ClipsPage />,
    upload:    <UploadPage />,
    broadcast: <BroadcastPage />,
    settings:  <SettingsPage />,
  }

  return (
    <section ref={ref} className="py-20 px-5 bg-bg-base">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity:0, y:24 }}
          animate={inView ? { opacity:1, y:0 } : {}}
          transition={{ duration:0.6 }}
          className="text-center mb-10"
        >
          <h2 className="font-syne font-bold text-text-primary mb-3"
            style={{ fontSize:'clamp(22px, 3vw, 32px)' }}>
            방송이 끝나면{' '}
            <span className="gradient-text">이 화면이 기다립니다</span>
          </h2>
          <p className="text-text-hint text-sm">AI가 실시간으로 분석한 하이라이트 구간과 클립 추천</p>
        </motion.div>

        <motion.div
          initial={{ opacity:0, y:32 }}
          animate={inView ? { opacity:1, y:0 } : {}}
          transition={{ duration:0.7, delay:0.15 }}
          className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
          style={{ background:'#09090f', height:'calc(100vh - 200px)', minHeight:'700px', maxHeight:'860px' }}
        >
          <div className="flex h-full">
            {/* Left nav sidebar */}
            <aside className="w-44 flex-shrink-0 border-r border-white/[0.07] flex flex-col"
              style={{ background:'#0c0c1a' }}>
              <div className="px-4 py-3.5 border-b border-white/[0.07] flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-accent-purple flex items-center justify-center">
                  <Zap size={12} className="text-white"/>
                </div>
                <span className="font-bold text-white text-sm tracking-tight">Clivo.ai</span>
              </div>
              <nav className="flex-1 py-2">
                {NAV.map(({ icon:Icon, label, page, badge }) => (
                  <button key={page} onClick={() => setActivePage(page)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 mx-2 rounded-lg text-left transition-colors
                      ${activePage===page ? 'bg-accent-purple/20 text-accent-purple' : 'text-white/35 hover:text-white/60 hover:bg-white/[0.03]'}`}
                    style={{ width:'calc(100% - 16px)' }}
                  >
                    <Icon size={13} className="flex-shrink-0"/>
                    <span className="text-[11px] truncate flex-1">{label}</span>
                    {badge && (
                      <span className="text-[9px] bg-accent-purple/30 text-accent-purple px-1.5 py-px rounded-full flex-shrink-0">{badge}</span>
                    )}
                  </button>
                ))}
              </nav>
              <div className="p-3 border-t border-white/[0.07]">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ background:'linear-gradient(135deg,#7c3aed,#06b6d4)' }}>BJ</div>
                  <div className="min-w-0">
                    <div className="text-white/80 text-[11px] font-semibold truncate">BJ 던파파이터</div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-white/30 text-[10px]">치지직</span>
                      <span className="bg-red-500 text-white text-[8px] font-bold px-1 rounded-sm leading-4">LIVE</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center justify-end gap-3 px-5 py-2.5 border-b border-white/[0.07] flex-shrink-0"
                style={{ background:'#0a0a14' }}>
                <Bell size={14} className="text-white/30"/>
                <HelpCircle size={14} className="text-white/30"/>
                <div className="flex items-center gap-1.5 text-white/40 text-xs cursor-default">
                  <div className="w-5 h-5 rounded-full flex-shrink-0"
                    style={{ background:'linear-gradient(135deg,#7c3aed,#06b6d4)' }}/>
                  BJ 던파파이터
                  <ChevronDown size={11}/>
                </div>
              </div>

              <div className="flex flex-1 overflow-hidden">
                <main className="flex-1 overflow-hidden" style={{ background:'#0a0a14' }}>
                  <AnimatePresence mode="wait">
                    <div key={activePage} className="h-full">
                      {pageComponents[activePage]}
                    </div>
                  </AnimatePresence>
                </main>
                <CommonSidebar onNavigate={setActivePage}/>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
