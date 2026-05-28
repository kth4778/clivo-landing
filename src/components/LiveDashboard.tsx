import { useState } from 'react'
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
  Radio, Settings, RefreshCw, Download, Bell, HelpCircle,
  ChevronDown, TrendingUp, Users, Clock, Star, Search,
  CheckCircle, AlertCircle, Play, Filter, Wifi, Calendar,
  Eye, MessageSquare, Link2, Shield, Sliders,
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────
type Page = 'dashboard' | 'highlight' | 'analysis' | 'clips' | 'upload' | 'broadcast' | 'settings'

// ── Mock data ─────────────────────────────────────────────
const NAV: { icon: React.ElementType; label: string; page: Page; badge?: string }[] = [
  { icon: LayoutDashboard, label: '대시보드',       page: 'dashboard' },
  { icon: Zap,             label: '하이라이트',     page: 'highlight', badge: 'Beta' },
  { icon: BarChart2,       label: '실시간 분석',    page: 'analysis' },
  { icon: Film,            label: '클립 관리',      page: 'clips' },
  { icon: Upload,          label: '업로드 & 내보내기', page: 'upload' },
  { icon: Radio,           label: '방송 관리',      page: 'broadcast' },
  { icon: Settings,        label: '설정',           page: 'settings' },
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

// ── Game thumbnail SVGs (legacy — kept for reference) ─────
function Thumb0() {
  return (
    <svg className="w-full h-full" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="T0A" cx="50%" cy="30%" r="70%"><stop offset="0%" stopColor="#3d005a"/><stop offset="100%" stopColor="#080013"/></radialGradient>
        <radialGradient id="T0B" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#9900ff" stopOpacity="0.5"/><stop offset="100%" stopColor="#9900ff" stopOpacity="0"/></radialGradient>
      </defs>
      <rect width="320" height="180" fill="url(#T0A)"/>
      {/* Floor grid */}
      <g stroke="#440077" strokeWidth="0.6" opacity="0.4">
        {[115,126,136,146,158].map((y,i)=><line key={i} x1={60-i*12} y1={y} x2={260+i*12} y2={y}/>)}
        {[-4,-3,-2,-1,0,1,2,3,4].map((n,i)=><line key={i} x1={160+n*18} y1={113} x2={160+n*76} y2={180}/>)}
      </g>
      {/* Dungeon pillars */}
      <rect x="30" y="70" width="18" height="80" fill="#1a0030" opacity="0.8"/><rect x="272" y="70" width="18" height="80" fill="#1a0030" opacity="0.8"/>
      <rect x="28" y="68" width="22" height="8" fill="#250040" opacity="0.9"/><rect x="270" y="68" width="22" height="8" fill="#250040" opacity="0.9"/>
      {/* Boss aura */}
      <circle cx="160" cy="72" r="52" fill="url(#T0B)"/>
      {/* Boss body */}
      <ellipse cx="160" cy="62" rx="27" ry="44" fill="#150028"/>
      <circle cx="160" cy="16" r="20" fill="#120025"/>
      {/* Wings */}
      <path d="M133 42 Q75 14 98 52 Q116 67 133 59Z" fill="#1e0035"/>
      <path d="M187 42 Q245 14 222 52 Q204 67 187 59Z" fill="#1e0035"/>
      {/* Boss energy ring */}
      <ellipse cx="160" cy="72" rx="37" ry="16" fill="none" stroke="#aa00ff" strokeWidth="1.2" opacity="0.6"/>
      {/* Energy beams */}
      {[0,60,120,180,240,300].map((a,i)=><line key={i} x1="160" y1="72" x2={160+65*Math.cos(a*Math.PI/180)} y2={72+33*Math.sin(a*Math.PI/180)} stroke="#cc44ff" strokeWidth="1" opacity="0.3"/>)}
      {/* Particles */}
      {Array.from({length:10},(_,i)=>{const a=i*36*Math.PI/180;return <circle key={i} cx={160+40*Math.cos(a)} cy={72+18*Math.sin(a)} r={2.2} fill="#dd66ff" opacity={0.75}/>})}
      {/* Player */}
      <rect x="153" y="118" width="14" height="21" rx="2" fill="#4400aa"/><circle cx="160" cy="114" r="8" fill="#3300aa"/>
      <line x1="146" y1="123" x2="174" y2="123" stroke="#cc88ff" strokeWidth="2.5"/>
      {/* Ground haze */}
      <rect x="0" y="152" width="320" height="28" fill="rgba(8,0,19,0.8)"/>
    </svg>
  )
}

function Thumb1() {
  return (
    <svg className="w-full h-full" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="T1A" cx="50%" cy="30%" r="70%"><stop offset="0%" stopColor="#001840"/><stop offset="100%" stopColor="#000814"/></radialGradient>
        <radialGradient id="T1B" cx="50%" cy="50%" r="55%"><stop offset="0%" stopColor="#0066ff" stopOpacity="0.5"/><stop offset="100%" stopColor="#0033ff" stopOpacity="0"/></radialGradient>
      </defs>
      <rect width="320" height="180" fill="url(#T1A)"/>
      {/* Floor */}
      <g stroke="#003388" strokeWidth="0.5" opacity="0.38">
        {[112,122,132,143,155].map((y,i)=><line key={i} x1={55-i*12} y1={y} x2={265+i*12} y2={y}/>)}
        {[-4,-3,-2,-1,0,1,2,3,4].map((n,i)=><line key={i} x1={160+n*20} y1={110} x2={160+n*80} y2={180}/>)}
      </g>
      {/* Magic circles on floor */}
      <ellipse cx="160" cy="130" rx="60" ry="22" fill="rgba(0,80,200,0.12)" stroke="#0055cc" strokeWidth="1" opacity="0.55"/>
      <ellipse cx="160" cy="130" rx="42" ry="16" fill="none" stroke="#0077ff" strokeWidth="0.8" opacity="0.45"/>
      {Array.from({length:8},(_,i)=>{const a=i*45*Math.PI/180;return <circle key={i} cx={160+60*Math.cos(a)} cy={130+22*Math.sin(a)} r={2} fill="#44aaff" opacity={0.7}/>})}
      {/* Boss glow */}
      <circle cx="160" cy="68" r="50" fill="url(#T1B)"/>
      {/* Boss */}
      <ellipse cx="160" cy="58" rx="24" ry="40" fill="#001030"/>
      <circle cx="160" cy="16" r="17" fill="#001030"/>
      {/* Staff */}
      <line x1="186" y1="18" x2="196" y2="70" stroke="#2244bb" strokeWidth="3"/><circle cx="196" cy="16" r="7" fill="#1133aa"/>
      {/* Armor */}
      <path d="M136 54 Q130 39 140 34 Q160 29 180 34 Q190 39 184 54Z" fill="#001845" opacity="0.9"/>
      {/* Players */}
      <g transform="translate(108,128)"><rect x="-5" y="-18" width="10" height="22" rx="2" fill="#1e3f99"/><circle cx="0" cy="-23" r="7" fill="#162e88"/><line x1="-10" y1="-10" x2="10" y2="-10" stroke="#4488ff" strokeWidth="2"/></g>
      <g transform="translate(212,128)"><rect x="-5" y="-18" width="10" height="22" rx="2" fill="#2a4f88"/><circle cx="0" cy="-23" r="7" fill="#1e3a77"/></g>
      {/* Skill particles */}
      {Array.from({length:10},(_,i)=>{const a=i*36*Math.PI/180;const r=55+i%3*9;return <circle key={i} cx={160+r*Math.cos(a)} cy={68+r*0.44*Math.sin(a)} r={1.8} fill="#55aaff" opacity={0.7-i*0.05}/>})}
      <rect x="0" y="152" width="320" height="28" fill="rgba(0,8,20,0.8)"/>
    </svg>
  )
}

function Thumb2() {
  return (
    <svg className="w-full h-full" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="T2A" cx="50%" cy="30%" r="70%"><stop offset="0%" stopColor="#00203a"/><stop offset="100%" stopColor="#00080f"/></radialGradient>
        <radialGradient id="T2B" cx="50%" cy="50%" r="60%"><stop offset="0%" stopColor="#00ccff" stopOpacity="0.55"/><stop offset="55%" stopColor="#0066cc" stopOpacity="0.22"/><stop offset="100%" stopColor="#00aaff" stopOpacity="0"/></radialGradient>
        <radialGradient id="T2C" cx="50%" cy="50%" r="35%"><stop offset="0%" stopColor="white" stopOpacity="0.45"/><stop offset="100%" stopColor="#00aaff" stopOpacity="0"/></radialGradient>
      </defs>
      <rect width="320" height="180" fill="url(#T2A)"/>
      {/* Floor grid */}
      <g stroke="#005588" strokeWidth="0.5" opacity="0.42">
        {[112,122,132,143,155].map((y,i)=><line key={i} x1={55-i*12} y1={y} x2={265+i*12} y2={y}/>)}
        {[-5,-4,-3,-2,-1,0,1,2,3,4,5].map((n,i)=><line key={i} x1={160+n*18} y1={110} x2={160+n*75} y2={180}/>)}
      </g>
      {/* Spell circle */}
      <ellipse cx="160" cy="130" rx="65" ry="24" fill="rgba(0,100,200,0.14)" stroke="#0088cc" strokeWidth="1" opacity="0.55"/>
      <ellipse cx="160" cy="130" rx="45" ry="17" fill="none" stroke="#00aaff" strokeWidth="0.8" opacity="0.45"/>
      {Array.from({length:8},(_,i)=>{const a=i*45*Math.PI/180;return <rect key={i} x={160+65*Math.cos(a)-1.5} y={130+24*Math.sin(a)-1.5} width="3" height="3" fill="#00ddff" opacity="0.6"/>})}
      {/* Central explosion */}
      <circle cx="160" cy="86" r="52" fill="url(#T2B)"/>
      <circle cx="160" cy="86" r="18" fill="url(#T2C)"/>
      {/* Explosion rays */}
      {Array.from({length:12},(_,i)=>{const a=i*30*Math.PI/180;return <line key={i} x1="160" y1="86" x2={160+72*Math.cos(a)} y2={86+40*Math.sin(a)} stroke="#00ccff" strokeWidth="1.5" opacity="0.38"/>})}
      {/* Main character */}
      <g transform="translate(160,120)">
        <rect x="-6" y="-21" width="12" height="25" rx="2" fill="#1155aa"/><circle cx="0" cy="-26" r="8" fill="#0e44aa"/>
        <line x1="-13" y1="-13" x2="13" y2="-13" stroke="#44ccff" strokeWidth="3"/>
        <line x1="-13" y1="-19" x2="13" y2="-19" stroke="#22aaff" strokeWidth="1"/>
      </g>
      {/* Enemies */}
      {[[-45,5],[45,5],[-25,-3],[25,-3],[-55,9],[55,9]].map(([dx,dy],i)=>(
        <g key={i} transform={`translate(${160+dx},${113+dy})`}>
          <rect x="-4" y="-14" width="8" height="17" rx="2" fill={i%2===0?"#440000":"#003a00"} opacity="0.85"/>
          <circle cx="0" cy="-18" r="5.5" fill={i%2===0?"#330000":"#002800"} opacity="0.85"/>
        </g>
      ))}
      {/* Particles */}
      {Array.from({length:14},(_,i)=>{const a=i*25.7*Math.PI/180;const r=53+i%4*8;return <circle key={i} cx={160+r*Math.cos(a)} cy={86+r*0.5*Math.sin(a)} r={1.5+i%3*0.5} fill={i%2===0?"#00ffff":"#0099ff"} opacity={0.72-i*0.03}/>})}
      <rect x="0" y="152" width="320" height="28" fill="rgba(0,8,15,0.8)"/>
    </svg>
  )
}

function Thumb3() {
  return (
    <svg className="w-full h-full" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="T3A" cx="50%" cy="30%" r="70%"><stop offset="0%" stopColor="#2a1500"/><stop offset="100%" stopColor="#0c0800"/></radialGradient>
        <radialGradient id="T3B" cx="50%" cy="50%" r="60%"><stop offset="0%" stopColor="#ffaa00" stopOpacity="0.55"/><stop offset="50%" stopColor="#ff6600" stopOpacity="0.22"/><stop offset="100%" stopColor="#ff4400" stopOpacity="0"/></radialGradient>
        <radialGradient id="T3C" cx="50%" cy="50%" r="35%"><stop offset="0%" stopColor="white" stopOpacity="0.5"/><stop offset="100%" stopColor="#ffcc00" stopOpacity="0"/></radialGradient>
      </defs>
      <rect width="320" height="180" fill="url(#T3A)"/>
      {/* Floor */}
      <g stroke="#553300" strokeWidth="0.5" opacity="0.38">
        {[112,122,133,143,155].map((y,i)=><line key={i} x1={55-i*12} y1={y} x2={265+i*12} y2={y}/>)}
        {[-4,-3,-2,-1,0,1,2,3,4].map((n,i)=><line key={i} x1={160+n*20} y1={110} x2={160+n*80} y2={180}/>)}
      </g>
      {/* Item glow on floor */}
      <ellipse cx="160" cy="115" rx="42" ry="16" fill="rgba(255,150,0,0.2)"/>
      {/* Golden aura */}
      <circle cx="160" cy="88" r="55" fill="url(#T3B)"/>
      {/* Light pillar */}
      <rect x="155" y="0" width="10" height="88" fill="rgba(255,180,0,0.15)"/>
      {/* Light beams */}
      {Array.from({length:8},(_,i)=>{const a=i*45*Math.PI/180;return <line key={i} x1="160" y1="88" x2={160+80*Math.cos(a)} y2={88+42*Math.sin(a)} stroke="#ffaa00" strokeWidth="1.5" opacity="0.28"/>})}
      {/* Legendary item */}
      <g transform="translate(160,88)">
        <rect x="-11" y="-13" width="22" height="22" rx="3" fill="#ffcc00" opacity="0.9"/>
        <rect x="-11" y="-13" width="22" height="22" rx="3" fill="none" stroke="white" strokeWidth="1.5" opacity="0.65"/>
        <line x1="-8" y1="-9" x2="-3" y2="-9" stroke="white" strokeWidth="2" opacity="0.7"/>
        <circle cx="0" cy="0" r="19" fill="url(#T3C)"/>
      </g>
      {/* System notice */}
      <rect x="68" y="23" width="184" height="22" rx="4" fill="rgba(255,150,0,0.15)" stroke="rgba(255,150,0,0.35)" strokeWidth="0.8"/>
      <text x="160" y="38" textAnchor="middle" fill="#ffcc44" fontSize="9" fontFamily="sans-serif" opacity="0.8">★ 전설 등급 아이템 획득! ★</text>
      {/* Characters kneeling */}
      {[[-50,10],[50,10],[-28,-2],[28,-2]].map(([dx,dy],i)=>(
        <g key={i} transform={`translate(${160+dx},${115+dy})`}>
          <rect x="-5" y="-13" width="10" height="15" rx="2" fill="#3a2000" opacity="0.85"/>
          <circle cx="0" cy="-17" r="6" fill="#2a1800" opacity="0.85"/>
          <line x1={i<2?5:-5} y1="-8" x2={i<2?15:-15} y2="-10" stroke="#4a2800" strokeWidth="2" opacity="0.65"/>
        </g>
      ))}
      {/* Gold particles */}
      {Array.from({length:12},(_,i)=>{const a=i*30*Math.PI/180;const r=48+i%3*10;return <circle key={i} cx={160+r*Math.cos(a)} cy={88+r*0.42*Math.sin(a)} r={2} fill="#ffcc44" opacity={0.68-i*0.04}/>})}
      <rect x="0" y="152" width="320" height="28" fill="rgba(12,8,0,0.8)"/>
    </svg>
  )
}

const THUMBS = [Thumb0, Thumb1, Thumb2, Thumb3]

// pos = 전체 방송(25395초) 기준 클립 시작 위치 %
const CLIPS = [
  { rank:1, title:'극적인 역전 순간!',   time:'03:18:45–03:21:59', dur:'03:21', score:98, tags:['#역전','#채팅폭발'],    pos:47 },
  { rank:2, title:'보조킬 완벽 타이밍', time:'01:47:22–01:50:10', dur:'02:48', score:91, tags:['#보스전','#완벽타이밍'], pos:25 },
  { rank:3, title:'연속 킬 폭발!',      time:'04:12:33–04:14:48', dur:'02:15', score:85, tags:['#연속킬','#스킬연계'],   pos:60 },
  { rank:4, title:'전설 아이템 획득!',  time:'05:45:11–05:47:09', dur:'01:58', score:79, tags:['#전설템','#축하'],       pos:82 },
]

const R = 36, CIRC = 2 * Math.PI * R, SCORE = 87, ARC = (SCORE/100)*CIRC

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
// PAGE 1: 대시보드
// ══════════════════════════════════════════════════════════
function DashboardPage() {
  const metrics = [
    { icon:Radio,      label:'이번 주 방송', value:'3회',    sub:'+1 지난주 대비',     color:'text-purple-400' },
    { icon:Film,       label:'생성된 클립',  value:'47개',   sub:'이번 달 누적',        color:'text-cyan-400' },
    { icon:Eye,        label:'총 조회수',    value:'128K',   sub:'+23% 지난주 대비',   color:'text-green-400' },
    { icon:Star,       label:'평균 점수',    value:'86점',   sub:'상위 13% 수준',      color:'text-yellow-400' },
  ]
  const broadcasts = [
    { date:'05.27', title:'발로란트 마스터 도전기 EP.12', dur:'7:03:15', clips:12, score:87, status:'완료' },
    { date:'05.25', title:'던전파이터 레이드 공략', dur:'4:22:10', clips:8,  score:82, status:'완료' },
    { date:'05.23', title:'리그 오브 레전드 챌린저 도전', dur:'5:48:30', clips:10, score:79, status:'완료' },
    { date:'05.21', title:'스타크래프트 래더 매치', dur:'3:11:45', clips:6,  score:74, status:'완료' },
  ]
  return (
    <PageWrap>
      <div className="px-5 pt-4 pb-2 flex-shrink-0">
        <h3 className="text-white font-bold text-sm">대시보드</h3>
        <p className="text-white/35 text-[11px]">전체 방송 현황 요약</p>
      </div>
      <div className="flex-1 px-5 pb-4 flex flex-col gap-3 min-h-0">
        {/* Metric cards */}
        <div className="grid grid-cols-4 gap-3 flex-shrink-0">
          {metrics.map(m => {
            const Icon = m.icon
            return (
              <Card key={m.label} className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={13} className={m.color} />
                  <span className="text-white/40 text-[10px]">{m.label}</span>
                </div>
                <div className={`text-xl font-bold ${m.color}`}>{m.value}</div>
                <div className="text-white/30 text-[10px] mt-0.5">{m.sub}</div>
              </Card>
            )
          })}
        </div>
        {/* Recent broadcasts */}
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
// PAGE 2: 하이라이트
// ══════════════════════════════════════════════════════════
function HighlightPage() {
  return (
    <PageWrap>
      <div className="flex items-start justify-between px-5 pt-4 pb-2 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-white font-bold text-sm">하이라이트 감지 결과</h3>
            <span className="text-[10px] bg-accent-purple/25 text-accent-purple px-2 py-px rounded-full font-semibold">Beta</span>
          </div>
          <p className="text-white/35 text-[11px] mt-0.5">AI가 분석한 실시간 하이라이트 구간입니다</p>
        </div>
        <button className="flex items-center gap-1.5 text-[11px] text-white/50 border border-white/10 rounded-lg px-3 py-1.5 flex-shrink-0">
          <RefreshCw size={10} /> 전체 다시 분석
        </button>
      </div>

      <div className="flex-1 px-5 pb-4 flex flex-col gap-2.5 min-h-0">
        {/* Timeline */}
        <Card className="p-3 flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/55 text-[11px] font-semibold">하이라이트 타임라인 ⓘ</span>
            <div className="flex items-center gap-3 text-[10px] text-white/35">
              {[['bg-accent-purple','매우 높음'],['bg-purple-500/50','높음'],['bg-purple-500/25','보통']].map(([c,l])=>(
                <span key={l} className="flex items-center gap-1"><span className={`w-2 h-2 rounded-sm ${c}`}/>{l}</span>
              ))}
            </div>
          </div>
          <div className="relative h-6 bg-white/[0.04] rounded overflow-hidden border border-white/[0.06]">
            {TIMELINE_SEGS.map((s,i)=>(
              <div key={i} className="absolute top-0.5 bottom-0.5 rounded-sm" style={{
                left:`${s.l}%`, width:`${s.w}%`,
                background: s.lv===3?'#7c3aed':s.lv===2?'rgba(124,58,237,.55)':'rgba(124,58,237,.28)',
                boxShadow: s.lv===3?'0 0 8px rgba(124,58,237,.7)':undefined,
              }}/>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-white/25 mt-1">
            {['00:00:00','01:45:00','03:30:00','05:15:00'].map(t=><span key={t}>{t}</span>)}
            <span className="text-accent-purple/60">07:03:15</span>
          </div>
        </Card>

        {/* Chat graph */}
        <Card className="p-3 flex-shrink-0">
          <span className="text-white/55 text-[11px] font-semibold">채팅 반응 그래프 ⓘ</span>
          <div className="relative mt-2" style={{height:'68px'}}>
            <div className="absolute -left-1 top-0 bottom-0 flex flex-col justify-between text-[9px] text-white/20" style={{width:'22px'}}>
              <span>100</span><span>50</span><span>0</span>
            </div>
            <div className="absolute inset-0" style={{left:'22px'}}>
              <svg width="100%" height="68" viewBox="0 0 800 68" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="wg2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity=".5"/>
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity=".03"/>
                  </linearGradient>
                </defs>
                {[0.33,0.66].map(f=>(
                  <line key={f} x1="0" y1={68*f} x2="800" y2={68*f} stroke="rgba(255,255,255,.05)" strokeWidth="1"/>
                ))}
                <path d={buildPath(WAVE,800,68,true)} fill="url(#wg2)"/>
                <path d={buildPath(WAVE,800,68,false)} fill="none" stroke="#7c3aed" strokeWidth="1.5"/>
                <line x1="273" y1="0" x2="273" y2="68" stroke="rgba(255,255,255,.2)" strokeWidth="0.8" strokeDasharray="3 3"/>
                <circle cx="273" cy={68-WAVE[27]*68*0.88} r="3" fill="#06b6d4" style={{filter:'drop-shadow(0 0 4px #06b6d4)'}}/>
              </svg>
              <div className="absolute pointer-events-none bg-[#1a1a2e] border border-white/[0.12] rounded-lg px-2.5 py-1.5 text-[9px] shadow-xl"
                style={{left:'34%',top:'0',transform:'translateX(-50%)'}}>
                <div className="text-white/45 font-semibold mb-0.5">03:21:47</div>
                <div className="text-white/65">채팅 반응도: <span className="text-cyan-400 font-bold">98%</span></div>
                <div className="text-white/65">하이라이트 점수: <span className="text-accent-purple font-bold">91점</span></div>
              </div>
            </div>
          </div>
          <div className="flex justify-between text-[10px] text-white/25 mt-1" style={{paddingLeft:'22px'}}>
            {['00:00:00','01:45:00','03:30:00','05:15:00'].map(t=><span key={t}>{t}</span>)}
            <span className="text-accent-purple/60">07:03:15</span>
          </div>
        </Card>

        {/* Clips */}
        <div className="flex-1 min-h-0 flex flex-col">
          <div className="text-white/55 text-[11px] font-semibold mb-2 flex-shrink-0">추천 하이라이트 클립 (4)</div>
          <div className="grid grid-cols-4 gap-2">
            {CLIPS.map(clip=>(
              <div key={clip.rank}
                className="bg-white/[0.04] rounded-xl overflow-hidden border border-white/[0.07] hover:border-accent-purple/40 transition-colors cursor-pointer flex flex-col">
                {/* Thumbnail — 16/6 비율 */}
                <div className="relative flex-shrink-0" style={{aspectRatio:'16/6', background:'#0a0a14'}}>
                  <img
                    src={THUMB_IMGS[(clip.rank - 1) % THUMB_IMGS.length]}
                    alt={clip.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    draggable={false}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center border border-white/25">
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
                  <div className="text-white/80 text-[10px] font-semibold truncate">{clip.title}</div>
                  <div className="flex flex-wrap gap-1">
                    {clip.tags.map(tag=>(
                      <span key={tag} className="text-[8px] text-accent-purple/70 bg-accent-purple/10 px-1.5 py-px rounded-full">{tag}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-[8px]">
                    <span className="text-white/40">{clip.time.split('–')[0]}</span>
                    <span className="text-white/20">~</span>
                    <span className="text-white/40">{clip.time.split('–')[1]}</span>
                  </div>
                  <div>
                    <div className="flex justify-between text-[7px] text-white/20 mb-0.5">
                      <span>0:00</span>
                      <span className="text-accent-purple/55">{clip.time.split('–')[0]}</span>
                      <span>7:03</span>
                    </div>
                    <div className="relative h-1 bg-white/[0.08] rounded-full">
                      <div className="absolute inset-y-0 left-0 rounded-full bg-white/[0.05]"
                        style={{width:`${clip.pos}%`}}/>
                      <div className="absolute inset-y-0 rounded-full bg-accent-purple/70"
                        style={{left:`${Math.max(0, clip.pos - 0.3)}%`, width:'1.2%',
                          boxShadow:'0 0 4px rgba(124,58,237,0.9)'}}/>
                      <div className="absolute top-1/2 w-1.5 h-1.5 rounded-full bg-accent-purple"
                        style={{left:`${clip.pos}%`, transform:'translate(-50%,-50%)',
                          boxShadow:'0 0 5px rgba(124,58,237,1)'}}/>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrap>
  )
}

// ══════════════════════════════════════════════════════════
// PAGE 3: 실시간 분석
// ══════════════════════════════════════════════════════════
function AnalysisPage() {
  const events = [
    { time:'03:21:47', type:'하이라이트', msg:'채팅 반응도 98% 감지 — 클립 생성됨', color:'text-purple-400' },
    { time:'03:19:02', type:'채팅 급증', msg:'1분간 채팅 수 1,247건 돌파',           color:'text-cyan-400' },
    { time:'02:55:31', type:'하이라이트', msg:'채팅 반응도 85% 감지 — 클립 생성됨', color:'text-purple-400' },
    { time:'02:41:15', type:'시청자 피크', msg:'동시 시청자 13,204명 달성',          color:'text-green-400' },
    { time:'01:48:03', type:'하이라이트', msg:'채팅 반응도 91% 감지 — 클립 생성됨', color:'text-purple-400' },
    { time:'01:22:44', type:'채팅 급증', msg:'1분간 채팅 수 987건 돌파',             color:'text-cyan-400' },
  ]
  const liveStats = [
    { label:'현재 시청자',    value:'13,204', icon:Users,       color:'text-cyan-400' },
    { label:'분당 채팅',      value:'1,247',  icon:MessageSquare,color:'text-purple-400' },
    { label:'현재 하이라이트 점수', value:'87점', icon:Star,   color:'text-yellow-400' },
    { label:'감지된 구간',    value:'12개',   icon:Zap,         color:'text-green-400' },
  ]
  return (
    <PageWrap>
      <div className="px-5 pt-4 pb-2 flex-shrink-0 flex items-center justify-between">
        <div>
          <h3 className="text-white font-bold text-sm">실시간 분석</h3>
          <p className="text-white/35 text-[11px]">방송 중 실시간 감지 현황</p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-lg">
          <Wifi size={11}/> 실시간 연결 중
        </div>
      </div>
      <div className="flex-1 px-5 pb-4 flex flex-col gap-3 min-h-0">
        {/* Live stats */}
        <div className="grid grid-cols-4 gap-3 flex-shrink-0">
          {liveStats.map(s=>{
            const Icon=s.icon
            return (
              <Card key={s.label} className="p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon size={12} className={s.color}/>
                  <span className="text-white/35 text-[10px]">{s.label}</span>
                </div>
                <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
              </Card>
            )
          })}
        </div>
        {/* Event log + mini waveform */}
        <div className="flex gap-3 flex-1 min-h-0">
          <Card className="flex-1 flex flex-col min-h-0">
            <div className="px-4 py-2.5 border-b border-white/[0.06] flex-shrink-0">
              <span className="text-white/55 text-xs font-semibold">이벤트 감지 로그</span>
            </div>
            <div className="flex-1 overflow-hidden">
              {events.map((e,i)=>(
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
            {[['클립각',94],['역전',88],['ㅋㅋㅋ',85],['대박',78],['와',72],['미쳤다',65]].map(([kw,pct])=>(
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
// PAGE 4: 클립 관리
// ══════════════════════════════════════════════════════════
function ClipsPage() {
  const clips = [
    ...CLIPS,
    { rank:5, title:'화려한 콤보 연계',   time:'06:12:04–06:14:11', dur:'02:07', score:76, tags:['#콤보'],  pos:88 },
    { rank:6, title:'아슬아슬한 생존',    time:'02:33:22–02:35:00', dur:'01:38', score:72, tags:['#생존'],  pos:36 },
    { rank:7, title:'팀원 구조 성공',     time:'04:58:10–05:00:25', dur:'02:15', score:68, tags:['#팀플'],  pos:70 },
    { rank:8, title:'예상치 못한 반전',   time:'01:10:55–01:13:02', dur:'02:07', score:65, tags:['#반전'],  pos:17 },
  ]
  return (
    <PageWrap>
      <div className="px-5 pt-4 pb-2 flex-shrink-0 flex items-center justify-between">
        <div>
          <h3 className="text-white font-bold text-sm">클립 관리</h3>
          <p className="text-white/35 text-[11px]">총 {clips.length}개 클립</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-1.5">
            <Search size={11} className="text-white/30"/>
            <input className="bg-transparent text-white/60 text-[11px] outline-none w-28 placeholder:text-white/25"
              placeholder="클립 검색..." readOnly/>
          </div>
          <button className="flex items-center gap-1.5 text-[11px] text-white/50 border border-white/10 rounded-lg px-3 py-1.5">
            <Filter size={10}/> 필터
          </button>
        </div>
      </div>
      <div className="flex-1 px-5 pb-4 min-h-0 overflow-y-auto">
        <div className="grid grid-cols-4 gap-2">
          {clips.map(clip=>(
            <div key={clip.rank}
              className="bg-white/[0.04] rounded-xl overflow-hidden border border-white/[0.07] hover:border-accent-purple/40 transition-colors cursor-pointer flex flex-col">
              {/* Thumbnail — 16/6 비율 */}
              <div className="relative flex-shrink-0" style={{aspectRatio:'16/6', background:'#0a0a14'}}>
                <img
                  src={THUMB_IMGS[(clip.rank - 1) % THUMB_IMGS.length]}
                  alt={clip.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  draggable={false}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center border border-white/25">
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
                {/* 제목 */}
                <div className="text-white/80 text-[10px] font-semibold truncate">{clip.title}</div>
                {/* 태그 */}
                <div className="flex flex-wrap gap-1">
                  {clip.tags.map(t=>(
                    <span key={t} className="text-[8px] text-accent-purple/70 bg-accent-purple/10 px-1.5 py-px rounded-full">{t}</span>
                  ))}
                </div>
                {/* 구간 시작~종료 */}
                <div className="flex items-center gap-1 text-[8px]">
                  <span className="text-white/40">{clip.time.split('–')[0]}</span>
                  <span className="text-white/20">~</span>
                  <span className="text-white/40">{clip.time.split('–')[1]}</span>
                </div>
                {/* 방송 7시간 타임라인 위치 */}
                <div>
                  <div className="flex justify-between text-[7px] text-white/20 mb-0.5">
                    <span>0:00</span>
                    <span className="text-accent-purple/55">{clip.time.split('–')[0]}</span>
                    <span>7:03</span>
                  </div>
                  <div className="relative h-1 bg-white/[0.08] rounded-full">
                    <div className="absolute inset-y-0 left-0 rounded-full bg-white/[0.05]"
                      style={{width:`${clip.pos}%`}}/>
                    <div className="absolute inset-y-0 rounded-full bg-accent-purple/70"
                      style={{left:`${Math.max(0, clip.pos - 0.3)}%`, width:'1.2%',
                        boxShadow:'0 0 4px rgba(124,58,237,0.9)'}}/>
                    <div className="absolute top-1/2 w-1.5 h-1.5 rounded-full bg-accent-purple"
                      style={{left:`${clip.pos}%`, transform:'translate(-50%,-50%)',
                        boxShadow:'0 0 5px rgba(124,58,237,1)'}}/>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageWrap>
  )
}

// ══════════════════════════════════════════════════════════
// PAGE 5: 업로드 & 내보내기
// ══════════════════════════════════════════════════════════
function UploadPage() {
  const platforms = [
    { name:'YouTube',  color:'#ff0000', connected:true,  uploads:12, icon:'▶' },
    { name:'TikTok',   color:'#69c9d0', connected:true,  uploads:8,  icon:'♪' },
    { name:'치지직',   color:'#00d564', connected:true,  uploads:15, icon:'◈' },
    { name:'SOOP',     color:'#ff6b35', connected:false, uploads:0,  icon:'◉' },
  ]
  const queue = [
    { clip:'극적인 역전 순간!', platform:'YouTube', status:'완료', time:'2분 전' },
    { clip:'극적인 역전 순간!', platform:'치지직',  status:'완료', time:'2분 전' },
    { clip:'보조킬 완벽 타이밍', platform:'YouTube', status:'업로드 중', time:'진행 중' },
    { clip:'보조킬 완벽 타이밍', platform:'TikTok',  status:'대기',   time:'예정' },
    { clip:'연속 킬 폭발!',     platform:'YouTube', status:'대기',   time:'예정' },
  ]
  return (
    <PageWrap>
      <div className="px-5 pt-4 pb-2 flex-shrink-0">
        <h3 className="text-white font-bold text-sm">업로드 & 내보내기</h3>
        <p className="text-white/35 text-[11px]">플랫폼 연동 및 자동 업로드</p>
      </div>
      <div className="flex-1 px-5 pb-4 flex flex-col gap-3 min-h-0">
        <div className="grid grid-cols-4 gap-3 flex-shrink-0">
          {platforms.map(p=>(
            <Card key={p.name} className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold text-white"
                    style={{background:p.color+'33', border:`1px solid ${p.color}55`}}>
                    {p.icon}
                  </div>
                  <span className="text-white/70 text-xs font-semibold">{p.name}</span>
                </div>
                {p.connected
                  ? <span className="text-green-400 text-[9px] bg-green-500/10 px-1.5 py-px rounded-full">연결됨</span>
                  : <button className="text-white/40 text-[9px] border border-white/10 px-1.5 py-px rounded-full">연결</button>
                }
              </div>
              <div className="text-white/35 text-[10px]">업로드 {p.uploads}개</div>
            </Card>
          ))}
        </div>
        <Card className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] flex-shrink-0">
            <span className="text-white/55 text-xs font-semibold">업로드 큐</span>
            <button className="flex items-center gap-1 text-[11px] text-white/40 border border-white/10 rounded px-2 py-1">
              <Download size={10}/> 모두 내보내기
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            {queue.map((q,i)=>(
              <div key={i} className="flex items-center gap-4 px-4 py-2.5 border-b border-white/[0.04]">
                <div className="flex-1 text-white/65 text-[11px] font-medium truncate">{q.clip}</div>
                <div className="text-white/40 text-[11px] w-16 flex-shrink-0">{q.platform}</div>
                <div className="w-20 flex-shrink-0">
                  <span className={`text-[10px] px-2 py-px rounded-full font-medium ${
                    q.status==='완료'?'text-green-400 bg-green-500/10':
                    q.status==='업로드 중'?'text-cyan-400 bg-cyan-500/10 animate-pulse':
                    'text-white/30 bg-white/5'
                  }`}>{q.status}</span>
                </div>
                <div className="text-white/30 text-[10px] w-16 flex-shrink-0 text-right">{q.time}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
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
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-1.5">
            <Calendar size={11} className="text-white/30"/>
            <span className="text-white/40 text-[11px]">2025.05</span>
          </div>
        </div>
      </div>
      <div className="flex-1 px-5 pb-4 flex flex-col gap-3 min-h-0">
        <div className="grid grid-cols-3 gap-3 flex-shrink-0">
          {[
            { label:'이번 달 총 방송', value:'8회',    color:'text-cyan-400' },
            { label:'평균 시청자 수', value:'10,137명', color:'text-purple-400' },
            { label:'생성 클립 수',   value:'총 51개', color:'text-green-400' },
          ].map(s=>(
            <Card key={s.label} className="p-3 flex items-center gap-3">
              <div>
                <div className="text-white/35 text-[10px]">{s.label}</div>
                <div className={`text-lg font-bold mt-0.5 ${s.color}`}>{s.value}</div>
              </div>
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
                  {['날짜','방송 제목','플랫폼','시간','시청자','클립','상태'].map(h=>(
                    <th key={h} className="px-4 py-2 text-left text-white/30 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {broadcasts.map(b=>(
                  <tr key={b.date+b.title} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                    <td className="px-4 py-2.5 text-white/40">{b.date}</td>
                    <td className="px-4 py-2.5 text-white/70 font-medium max-w-[200px] truncate">{b.title}</td>
                    <td className="px-4 py-2.5 text-white/40">{b.platform}</td>
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
  return (
    <PageWrap>
      <div className="px-5 pt-4 pb-2 flex-shrink-0">
        <h3 className="text-white font-bold text-sm">설정</h3>
        <p className="text-white/35 text-[11px]">계정 및 서비스 설정</p>
      </div>
      <div className="flex-1 px-5 pb-4 flex gap-4 min-h-0">
        {/* Left column */}
        <div className="flex-1 flex flex-col gap-3 min-h-0">
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <Shield size={14} className="text-accent-purple"/>
              <span className="text-white/65 text-xs font-semibold">계정 정보</span>
            </div>
            <div className="space-y-3">
              {[['스트리머명','BJ 던파파이터'],['플랫폼','치지직 / SOOP'],['이메일','dunpa@example.com'],['가입일','2025년 3월 12일']].map(([l,v])=>(
                <div key={l} className="flex justify-between items-center py-1.5 border-b border-white/[0.05]">
                  <span className="text-white/35 text-[11px]">{l}</span>
                  <span className="text-white/65 text-[11px]">{v}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-4 flex-1">
            <div className="flex items-center gap-3 mb-4">
              <Link2 size={14} className="text-cyan-400"/>
              <span className="text-white/65 text-xs font-semibold">API 키</span>
            </div>
            <div className="space-y-2.5">
              {[['Clivo.ai API Key','clv_sk_••••••••••••••••'],['YouTube API','yt_••••••••••••'],['TikTok API','tt_••••••••••••']].map(([l,v])=>(
                <div key={l}>
                  <div className="text-white/30 text-[10px] mb-1">{l}</div>
                  <div className="flex items-center gap-2 bg-white/[0.04] rounded-lg px-3 py-2 border border-white/[0.07]">
                    <span className="text-white/40 text-[11px] flex-1 font-mono">{v}</span>
                    <button className="text-white/30 text-[10px] hover:text-white/60">복사</button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        {/* Right column */}
        <div className="w-52 flex-shrink-0 flex flex-col gap-3">
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Bell size={14} className="text-yellow-400"/>
              <span className="text-white/65 text-xs font-semibold">알림 설정</span>
            </div>
            {[['하이라이트 감지 시',true],['방송 종료 후 요약',true],['클립 업로드 완료',false],['주간 리포트',true]].map(([l,on])=>(
              <div key={String(l)} className="flex justify-between items-center py-2 border-b border-white/[0.05]">
                <span className="text-white/50 text-[11px]">{l}</span>
                <div className={`w-8 h-4 rounded-full flex items-center px-0.5 ${on?'bg-accent-purple':'bg-white/10'}`}>
                  <div className={`w-3 h-3 rounded-full bg-white transition-transform ${on?'translate-x-4':''}`}/>
                </div>
              </div>
            ))}
          </Card>
          <Card className="p-4 flex-1">
            <div className="flex items-center gap-3 mb-3">
              <Sliders size={14} className="text-green-400"/>
              <span className="text-white/65 text-xs font-semibold">감지 민감도</span>
            </div>
            {[['채팅 반응 임계값','85%'],['최소 클립 길이','30초'],['최대 클립 수','12개']].map(([l,v])=>(
              <div key={String(l)} className="mb-3">
                <div className="flex justify-between mb-1">
                  <span className="text-white/40 text-[10px]">{l}</span>
                  <span className="text-accent-purple text-[10px] font-bold">{v}</span>
                </div>
                <div className="h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                  <div className="h-full bg-accent-purple rounded-full" style={{width: l==='채팅 반응 임계값'?'85%':l==='최소 클립 길이'?'50%':'80%'}}/>
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
        {/* Heading */}
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

        {/* Dashboard shell */}
        <motion.div
          initial={{ opacity:0, y:32 }}
          animate={inView ? { opacity:1, y:0 } : {}}
          transition={{ duration:0.7, delay:0.15 }}
          className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
          style={{ background:'#09090f', height:'calc(100vh - 200px)', minHeight:'700px', maxHeight:'860px' }}
        >
          <div className="flex h-full">
            {/* ── SIDEBAR ── */}
            <aside className="w-44 flex-shrink-0 border-r border-white/[0.07] flex flex-col"
              style={{ background:'#0c0c1a' }}>
              {/* Logo */}
              <div className="px-4 py-3.5 border-b border-white/[0.07] flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-accent-purple flex items-center justify-center">
                  <Zap size={12} className="text-white"/>
                </div>
                <span className="font-bold text-white text-sm tracking-tight">Clivo.ai</span>
              </div>
              {/* Nav */}
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
                      <span className="text-[9px] bg-accent-purple/30 text-accent-purple px-1.5 py-px rounded-full flex-shrink-0">
                        {badge}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
              {/* Profile */}
              <div className="p-3 border-t border-white/[0.07]">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ background:'linear-gradient(135deg,#7c3aed,#06b6d4)' }}>BJ</div>
                  <div className="min-w-0">
                    <div className="text-white/80 text-[11px] font-semibold truncate">BJ 던파파이터</div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-white/30 text-[10px]">7:03:15</span>
                      <span className="bg-red-500 text-white text-[8px] font-bold px-1 rounded-sm leading-4">LIVE</span>
                    </div>
                  </div>
                </div>
                <div className="text-white/25 text-[10px]">플랫폼 AfreecaTV</div>
              </div>
            </aside>

            {/* ── MAIN AREA ── */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Top bar */}
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

              {/* Page content + right panel */}
              <div className="flex flex-1 overflow-hidden">
                {/* Content */}
                <main className="flex-1 overflow-hidden" style={{ background:'#0a0a14' }}>
                  <AnimatePresence mode="wait">
                    <div key={activePage} className="h-full">
                      {pageComponents[activePage]}
                    </div>
                  </AnimatePresence>
                </main>

                {/* Right panel — always visible */}
                <aside className="w-48 flex-shrink-0 border-l border-white/[0.07] overflow-y-auto p-3 space-y-3"
                  style={{ background:'#0c0c1a' }}>
                  {/* Donut */}
                  <div className="bg-white/[0.04] rounded-xl p-3 border border-white/[0.07] text-center">
                    <div className="relative w-16 h-16 mx-auto mb-1.5">
                      <svg width="64" height="64" viewBox="0 0 80 80">
                        <circle cx="40" cy="40" r={R} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="6"/>
                        <circle cx="40" cy="40" r={R} fill="none" stroke="#7c3aed" strokeWidth="6"
                          strokeLinecap="round"
                          strokeDasharray={`${ARC} ${CIRC-ARC}`}
                          strokeDashoffset={CIRC*0.25}
                          style={{ filter:'drop-shadow(0 0 6px rgba(124,58,237,.8))' }}/>
                        <circle cx="40" cy="40" r={R} fill="none" stroke="#06b6d4" strokeWidth="6"
                          strokeLinecap="round"
                          strokeDasharray={`${CIRC*0.045} ${CIRC*0.955}`}
                          strokeDashoffset={CIRC*0.25-ARC}/>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-lg font-bold text-white leading-none">{SCORE}</span>
                        <span className="text-[9px] text-white/35">점</span>
                      </div>
                    </div>
                    <div className="text-white/50 text-[10px] font-semibold">하이라이트 점수</div>
                    <div className="text-cyan-400 text-[10px] mt-0.5">상위 13%</div>
                  </div>

                  {/* Summary */}
                  <div className="bg-white/[0.04] rounded-xl p-3 border border-white/[0.07]">
                    <div className="text-white/50 text-[10px] font-semibold mb-2">분석 요약</div>
                    {[['총 방송 시간','07:03:15'],['하이라이트 구간','12개'],['하이라이트 길이','23:47'],['평균 점수','86점']].map(([l,v])=>(
                      <div key={l} className="flex justify-between py-1.5 border-b border-white/[0.05] last:border-0">
                        <span className="text-white/30 text-[10px]">{l}</span>
                        <span className="text-white/60 text-[10px] font-semibold">{v}</span>
                      </div>
                    ))}
                  </div>

                  {/* Export */}
                  <div className="bg-white/[0.04] rounded-xl p-3 border border-white/[0.07]">
                    <div className="text-white/50 text-[10px] font-semibold mb-2">내보내기</div>
                    <button className="w-full flex items-center justify-center gap-1.5 bg-accent-purple text-white text-[11px] font-semibold py-2 rounded-lg mb-1.5">
                      <Download size={11}/> 클립 내보내기
                    </button>
                    <button className="w-full flex items-center justify-center gap-1.5 text-white/45 text-[11px] border border-white/10 py-2 rounded-lg">
                      <Download size={11}/> 타임라인 내보내기
                    </button>
                  </div>

                  {/* AI model */}
                  <div className="bg-white/[0.04] rounded-xl p-3 border border-white/[0.07]">
                    <div className="text-white/50 text-[10px] font-semibold mb-1.5">AI 분석 모델</div>
                    <div className="text-white/45 text-[10px] font-semibold">Clivo AI v2.3.1</div>
                    <div className="text-white/25 text-[9px] mt-0.5">학습 데이터: 128TB+</div>
                    <div className="text-white/25 text-[9px]">정확도: 94.7%</div>
                    <svg width="100%" height="20" viewBox="0 0 100 20" className="mt-2 opacity-40">
                      <polyline points="0,18 15,15 30,12 45,14 55,7 65,9 75,5 85,8 100,3"
                        fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
