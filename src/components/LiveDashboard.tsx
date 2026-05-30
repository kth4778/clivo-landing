import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from '@/hooks/useInView'
import imgLol01 from '@/assets/clip_lol_01.png'
import imgLol02 from '@/assets/clip_lol_02.png'
import imgLol03 from '@/assets/clip_lol_03.png'
import imgLol04 from '@/assets/clip_lol_04.png'
import imgLol05 from '@/assets/clip_lol_05.png'
import imgLol06 from '@/assets/clip_lol_06.png'
import imgLol07 from '@/assets/clip_lol_07.png'
import imgLol08 from '@/assets/clip_lol_08.png'
import imgValo01 from '@/assets/clip_valo_01.png'
import imgValo02 from '@/assets/clip_valo_02.png'
import imgValo03 from '@/assets/clip_valo_03.png'
import imgValo04 from '@/assets/clip_valo_04.png'
import imgValo05 from '@/assets/clip_valo_05.png'
import imgValo06 from '@/assets/clip_valo_06.png'
import imgRadio01 from '@/assets/clip_radio_01.png'
import imgRadio02 from '@/assets/clip_radio_02.png'
import imgRadio03 from '@/assets/clip_radio_03.png'
import imgRadio04 from '@/assets/clip_radio_04.png'

const THUMB_IMGS = [
  imgLol01, imgLol02, imgLol03, imgLol04, imgLol05, imgLol06, imgLol07, imgLol08,
  imgValo01, imgValo02, imgValo03, imgValo04, imgValo05, imgValo06,
  imgRadio01, imgRadio02, imgRadio03, imgRadio04,
]

import {
  Zap, BarChart2, Film, Upload,
  Settings, Download, Bell, HelpCircle,
  ChevronDown, Users, Star, Search,
  Play, Filter, Wifi, Calendar,
  MessageSquare, Link2, TrendingUp,
  MoreHorizontal, RotateCcw, Trash2,
  Pencil, X, Shield,
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────
type Page = 'highlight' | 'clips' | 'upload' | 'performance' | 'settings'
type UploadNav = { rank: number; tab: 'upload' | 'export' }

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
  genre: string
}

// ── Mock data ─────────────────────────────────────────────
const NAV: { icon: React.ElementType; label: string; page: Page; badge?: string }[] = [
  { icon: BarChart2,   label: '실시간 분석',        page: 'highlight' },
  { icon: Film,        label: '방송 & 클립',        page: 'clips' },
  { icon: Upload,      label: '업로드 & 내보내기',  page: 'upload' },
  { icon: TrendingUp,  label: '성과 분석',          page: 'performance' },
  { icon: Settings,    label: '설정',               page: 'settings' },
]

// 클립 pos 기반 구간 세그먼트
// 각 세그먼트 중심 ≈ 클립 pos (8→17%, 2→25%, 6→36%, 1→47%, 3→60%, 7→70%, 4→82%, 5→88%)

// 방송 세그먼트 레이블 (타임라인 상단 구간 표시)
const BROADCAST_SEGS = [
  { l:0,  w:11, label:'인사 & 준비',  color:'rgba(74,222,128,0.55)'  },
  { l:11, w:22, label:'솔로 랭크 #1', color:'rgba(59,130,246,0.55)'  },
  { l:33, w:12, label:'시청자 Q&A',   color:'rgba(245,158,11,0.55)'  },
  { l:45, w:18, label:'솔로 랭크 #2', color:'rgba(59,130,246,0.55)'  },
  { l:63, w:8,  label:'식사 중 방송', color:'rgba(249,115,22,0.55)'  },
  { l:71, w:9,  label:'다른 콘텐츠',  color:'rgba(139,92,246,0.55)'  },
  { l:80, w:20, label:'팀 랭크',      color:'rgba(6,182,212,0.55)'   },
]

// 80-포인트 채팅 반응 파형
// 각 클립 pos에 피크 배치 (점수 비례): 17%→idx14, 25%→idx20, 36%→idx28
// 47%→idx37(최대), 60%→idx47, 70%→idx55, 82%→idx65, 88%→idx70
const WAVE = [
  0.05,0.06,0.07,0.06,0.07,0.09,0.10,0.11,0.12,0.11,
  0.10,0.14,0.22,0.35,0.45,0.38,0.28,0.18,0.22,0.40,
  0.85,0.88,0.75,0.60,0.47,0.37,0.42,0.48,0.55,0.50,
  0.43,0.52,0.63,0.74,0.85,0.93,0.98,1.00,0.95,0.82,
  0.67,0.55,0.46,0.40,0.48,0.57,0.66,0.78,0.80,0.72,
  0.61,0.50,0.42,0.37,0.40,0.50,0.52,0.46,0.38,0.33,
  0.36,0.42,0.50,0.58,0.62,0.65,0.63,0.58,0.56,0.60,
  0.62,0.58,0.50,0.40,0.32,0.24,0.18,0.13,0.09,0.06,
]

const TOTAL_SECS = 7 * 3600 + 3 * 60 + 15 // 07:03:15

const ALL_CLIPS: Clip[] = [
  { rank:1, title:'이게 되네? 진짜로??',        time:'03:18:45–03:21:59', dur:'03:21', score:98, chatScore:81, videoScore:17, tags:['#한타역전','#채팅폭발'], pos:47, date:'05.29', platform:'SOOP', genre:'리그오브레전드' },
  { rank:2, title:'솔킬 따고 손 떨림 ㅋㅋ',    time:'01:47:22–01:50:10', dur:'02:48', score:91, chatScore:72, videoScore:19, tags:['#솔킬','#손떨림'],       pos:25, date:'05.29', platform:'SOOP', genre:'리그오브레전드' },
  { rank:3, title:'바론 스틸 하고 방송 터짐',   time:'04:12:33–04:14:48', dur:'02:15', score:85, chatScore:68, videoScore:17, tags:['#바론스틸','#대박'],     pos:60, date:'05.29', platform:'SOOP', genre:'리그오브레전드' },
  { rank:4, title:'4대1 살아남은 거 실화냐',    time:'05:45:11–05:47:09', dur:'01:58', score:79, chatScore:62, videoScore:17, tags:['#4대1','#생존'],         pos:82, date:'05.29', platform:'SOOP', genre:'리그오브레전드' },
  { rank:5, title:'팀원이 날 살렸다...',        time:'06:12:04–06:14:11', dur:'02:07', score:76, chatScore:59, videoScore:17, tags:['#팀플','#감동'],          pos:88, date:'05.29', platform:'SOOP', genre:'리그오브레전드' },
  { rank:6, title:'이 각도에서 스킬이 맞음??',  time:'02:33:22–02:35:00', dur:'01:38', score:72, chatScore:57, videoScore:15, tags:['#스킬샷','#명중'],        pos:36, date:'05.29', platform:'SOOP', genre:'리그오브레전드' },
  { rank:7, title:'한타 혼자 뒤집음 ㄷㄷ',     time:'04:58:10–05:00:25', dur:'02:15', score:68, chatScore:52, videoScore:16, tags:['#한타','#역전'],           pos:70, date:'05.29', platform:'SOOP', genre:'리그오브레전드' },
  { rank:8, title:'멘탈 나갈 뻔했는데',         time:'01:10:55–01:13:02', dur:'02:07', score:65, chatScore:49, videoScore:16, tags:['#멘탈','#위기탈출'],      pos:17, date:'05.29', platform:'SOOP', genre:'리그오브레전드' },
]

const VALO_CLIPS: Clip[] = [
  { rank:9,  title:'에임 뭐임 이거 ㅋㅋㅋ',       time:'01:23:10–01:24:45', dur:'01:35', score:94, chatScore:76, videoScore:18, tags:['#에임','#연속킬'],    pos:19, date:'05.27', platform:'치지직', genre:'발로란트' },
  { rank:10, title:'1대5 클러치 실화냐',           time:'02:45:22–02:47:33', dur:'02:11', score:97, chatScore:82, videoScore:15, tags:['#클러치','#1대5'],    pos:39, date:'05.27', platform:'치지직', genre:'발로란트' },
  { rank:11, title:'나이프로 그냥 해버림',          time:'03:12:05–03:13:20', dur:'01:15', score:88, chatScore:70, videoScore:18, tags:['#나이프','#웃김'],    pos:45, date:'05.27', platform:'치지직', genre:'발로란트' },
  { rank:12, title:'에이스 뜬다 잠깐만',           time:'04:28:44–04:31:02', dur:'02:18', score:96, chatScore:79, videoScore:17, tags:['#에이스','#긴장'],    pos:63, date:'05.27', platform:'치지직', genre:'발로란트' },
  { rank:13, title:'이 각에서 헤드샷이 맞음??',    time:'05:15:30–05:16:48', dur:'01:18', score:85, chatScore:67, videoScore:18, tags:['#헤드샷','#황당'],    pos:74, date:'05.27', platform:'치지직', genre:'발로란트' },
  { rank:14, title:'버그냐 이게',                  time:'06:02:11–06:03:45', dur:'01:34', score:79, chatScore:61, videoScore:18, tags:['#버그','#황당'],      pos:86, date:'05.27', platform:'치지직', genre:'발로란트' },
]

const RADIO_CLIPS: Clip[] = [
  { rank:15, title:'이거 공감되는 분?? ㅋㅋ',      time:'00:45:22–00:47:10', dur:'01:48', score:82, chatScore:71, videoScore:11, tags:['#공감','#일상'],    pos:27, date:'05.25', platform:'치지직', genre:'보이는라디오' },
  { rank:16, title:'솔직히 말하면...',              time:'01:22:15–01:24:30', dur:'02:15', score:88, chatScore:76, videoScore:12, tags:['#솔직','#토크'],    pos:50, date:'05.25', platform:'치지직', genre:'보이는라디오' },
  { rank:17, title:'갑자기 눈물 날 뻔했잖아',       time:'01:55:40–01:57:25', dur:'01:45', score:91, chatScore:80, videoScore:11, tags:['#감동','#눈물'],    pos:71, date:'05.25', platform:'치지직', genre:'보이는라디오' },
  { rank:18, title:'이 얘기 처음 하는 건데',        time:'02:18:05–02:20:15', dur:'02:10', score:86, chatScore:73, videoScore:13, tags:['#비하인드','#첫공개'], pos:84, date:'05.25', platform:'치지직', genre:'보이는라디오' },
]


// ── 실시간 분석 로그 이벤트 ─────────────────────────────────
type LogEntry = { pos: number; time: string; type: 'info' | 'chat' | 'detect' | 'extract'; clip?: number; msg: string }

const LOG_EVENTS: LogEntry[] = [
  { pos:  5, time:'00:21:07', type:'info',    msg:'AI 분석 세션 시작 — 채팅·영상 동시 모니터링 중' },
  { pos: 12, time:'00:50:33', type:'chat',    msg:'채팅 속도 상승 감지 (320건/분)' },
  { pos: 17, time:'01:10:55', type:'detect',  clip:8, msg:'클립 #8 후보 감지 — 채팅 반응 49점, 경계 분석 중...' },
  { pos: 19, time:'01:19:40', type:'extract', clip:8, msg:'클립 #8 추출 완료 · 01:10:55–01:13:02 · #멘탈 #위기탈출 자동 태깅' },
  { pos: 23, time:'01:38:22', type:'chat',    msg:'채팅 속도 상승 (612건/분)' },
  { pos: 25, time:'01:47:22', type:'detect',  clip:2, msg:'클립 #2 후보 감지 — 채팅 반응 72점, 경계 분석 중...' },
  { pos: 27, time:'01:53:11', type:'extract', clip:2, msg:'클립 #2 추출 완료 · 01:47:22–01:50:10 · #솔킬 #손떨림 자동 태깅' },
  { pos: 33, time:'02:18:05', type:'info',    msg:'영상 패턴 분석: 빠른 액션 시퀀스 집중 감지 모드 전환' },
  { pos: 36, time:'02:33:22', type:'detect',  clip:6, msg:'클립 #6 후보 감지 — 채팅 반응 57점, 경계 분석 중...' },
  { pos: 38, time:'02:40:15', type:'extract', clip:6, msg:'클립 #6 추출 완료 · 02:33:22–02:35:00 · #스킬샷 #명중 자동 태깅' },
  { pos: 44, time:'03:06:18', type:'chat',    msg:'채팅 폭발적 증가 — 1,247건/분 (세션 최고치)' },
  { pos: 47, time:'03:18:45', type:'detect',  clip:1, msg:'클립 #1 후보 감지 — 채팅 반응 81점, 최우선 처리 중...' },
  { pos: 49, time:'03:24:03', type:'extract', clip:1, msg:'클립 #1 추출 완료 · 03:18:45–03:21:59 · #한타역전 #채팅폭발 자동 태깅' },
  { pos: 58, time:'04:03:18', type:'chat',    msg:'채팅 반응 상승 (782건/분)' },
  { pos: 60, time:'04:12:33', type:'detect',  clip:3, msg:'클립 #3 후보 감지 — 채팅 반응 68점, 경계 분석 중...' },
  { pos: 62, time:'04:18:44', type:'extract', clip:3, msg:'클립 #3 추출 완료 · 04:12:33–04:14:48 · #바론스틸 #대박 자동 태깅' },
  { pos: 68, time:'04:43:33', type:'info',    msg:'감정 분석: 긍정 반응 키워드 비율 87% — 품질 상위 구간 진입' },
  { pos: 70, time:'04:58:10', type:'detect',  clip:7, msg:'클립 #7 후보 감지 — 채팅 반응 52점, 경계 분석 중...' },
  { pos: 72, time:'05:03:22', type:'extract', clip:7, msg:'클립 #7 추출 완료 · 04:58:10–05:00:25 · #한타 #역전 자동 태깅' },
]

// ── 클립별 채팅 로그 (상위 메시지) ────────────────────────
// ── Helpers ───────────────────────────────────────────────
function fmtSecs(s: number) {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
}

function parseClipPos(timeStr: string) {
  const toSec = (t: string) => { const [h,m,s]=t.split(':').map(Number); return h*3600+m*60+s }
  const [a,b] = timeStr.split('–')
  return { startPct: toSec(a)/TOTAL_SECS*100, endPct: toSec(b)/TOTAL_SECS*100 }
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

// ── 클립 감정 분석 데이터 ─────────────────────────────────
// ── 클립 타임라인 헬퍼 ─────────────────────────────────────
function getClipWaveData(clip: Clip): number[] {
  const N = 40
  const waveIdx = Math.min(Math.round(clip.pos / 100 * (WAVE.length - 1)), WAVE.length - 1)
  const base = WAVE[waveIdx]
  const s = clip.rank * 7 + clip.chatScore
  return Array.from({length: N}, (_, i) => {
    const t = i / (N - 1)
    const peakT = 0.28 + (s % 11) * 0.04
    const peakH = 0.4 + clip.chatScore / 130
    const peak = peakH * Math.exp(-Math.pow((t - peakT) * 5.5, 2))
    const noise = Math.sin(i * s * 0.7) * 0.07 + Math.cos(i * (s + 3) * 0.4) * 0.05
    return Math.max(0.04, Math.min(1, base * 0.3 + peak + noise))
  })
}


function getClipKeyMoments(clip: Clip, wave: number[]) {
  const toSec = (t: string) => { const [h,m,s]=t.split(':').map(Number); return h*3600+m*60+s }
  const [startStr, endStr] = clip.time.split('–')
  const startSec = toSec(startStr)
  const durSec = toSec(endStr) - startSec
  const s = clip.rank * 13 + clip.chatScore * 7

  // 결정적 pseudo-random: 클립별 고정 시드
  const rnd = (seed: number) => {
    let x = Math.sin(seed) * 43758.5453123
    return x - Math.floor(x)
  }

  // 이벤트 팔레트 (구체적 태깅)
  const MOMENT_TYPES = [
    { icon:'💬', label:(r:number)=>`채팅 ${Math.round(200+r*900)}/분`,     color:'#06b6d4', bg:'rgba(6,182,212,0.1)',    border:'rgba(6,182,212,0.3)'  },
    { icon:'😂', label:(_:number)=>'웃음 폭발',                              color:'#fbbf24', bg:'rgba(251,191,36,0.1)',   border:'rgba(251,191,36,0.3)' },
    { icon:'📢', label:(r:number)=>`도배 ${Math.round(30+r*120)}줄`,        color:'#f43f5e', bg:'rgba(244,63,94,0.1)',    border:'rgba(244,63,94,0.3)'  },
    { icon:'🎯', label:(_:number)=>'핵심 장면',                              color:'#a855f7', bg:'rgba(168,85,247,0.1)',   border:'rgba(168,85,247,0.3)' },
    { icon:'👥', label:(r:number)=>`시청자 +${Math.round(50+r*300)}명`,     color:'#34d399', bg:'rgba(52,211,153,0.1)',   border:'rgba(52,211,153,0.3)' },
    { icon:'💰', label:(r:number)=>`도네이션 ${Math.round(1+r*9)*1000}원`,   color:'#f97316', bg:'rgba(249,115,22,0.1)',   border:'rgba(249,115,22,0.3)' },
    { icon:'🔔', label:(_:number)=>'구독 알림',                              color:'#fb923c', bg:'rgba(251,146,60,0.1)',   border:'rgba(251,146,60,0.3)' },
    { icon:'⚡', label:(_:number)=>'순간 집중',                              color:'#e879f9', bg:'rgba(232,121,249,0.1)',  border:'rgba(232,121,249,0.3)'},
    { icon:'🎬', label:(_:number)=>'장면 전환',                              color:'#818cf8', bg:'rgba(129,140,248,0.1)',  border:'rgba(129,140,248,0.3)'},
    { icon:'😱', label:(_:number)=>'OMG 반응',                               color:'#f43f5e', bg:'rgba(244,63,94,0.1)',    border:'rgba(244,63,94,0.3)'  },
    { icon:'🏆', label:(_:number)=>'하이라이트',                             color:'#fcd34d', bg:'rgba(252,211,77,0.1)',   border:'rgba(252,211,77,0.3)' },
    { icon:'🤣', label:(r:number)=>`ㅋㅋ ${Math.round(200+r*600)}개`,       color:'#fbbf24', bg:'rgba(251,191,36,0.1)',   border:'rgba(251,191,36,0.3)' },
  ]

  // 10~13개 합성 모멘트 생성
  const count = 10 + (s % 4)
  const usedPct = new Set<number>()
  const moments: {pct:number;icon:string;label:string;color:string;bg:string;border:string}[] = []

  for(let i = 0; i < count; i++) {
    let pct = Math.round(5 + rnd(s + i * 17) * 88)
    // 최소 4% 간격 보장
    let tries = 0
    while([...usedPct].some(p => Math.abs(p - pct) < 5) && tries < 20) {
      pct = Math.round(5 + rnd(s + i * 17 + tries * 31) * 88)
      tries++
    }
    usedPct.add(pct)
    const typeIdx = Math.floor(rnd(s + i * 23 + 7) * MOMENT_TYPES.length)
    const t = MOMENT_TYPES[typeIdx]
    const r = rnd(s + i * 41)
    moments.push({ pct, icon: t.icon, label: t.label(r), color: t.color, bg: t.bg, border: t.border })
  }

  // LOG_EVENTS 기반 실제 이벤트 덮어쓰기
  const clipLogs = LOG_EVENTS.filter(e => e.clip === clip.rank)
  clipLogs.forEach(e => {
    const eSec = toSec(e.time)
    const pct = Math.min(93, Math.max(4, Math.round((eSec - startSec) / durSec * 100)))
    const isX = e.type === 'extract'
    moments.push({
      pct,
      icon:   isX ? '✅' : '📈',
      label:  isX ? '추출 완료' : `채팅 피크`,
      color:  isX ? '#4ade80' : '#06b6d4',
      bg:     isX ? 'rgba(74,222,128,0.1)' : 'rgba(6,182,212,0.1)',
      border: isX ? 'rgba(74,222,128,0.3)' : 'rgba(6,182,212,0.3)',
    })
  })

  // 파형 피크 (반응 최고조)
  if(wave.length > 0) {
    const peakIdx = wave.indexOf(Math.max(...wave))
    const peakPct = Math.round(peakIdx / (wave.length - 1) * 100)
    moments.push({ pct:peakPct, icon:'🔥', label:'반응 최고조', color:'#f97316', bg:'rgba(249,115,22,0.1)', border:'rgba(249,115,22,0.3)' })
  }

  return moments.sort((a, b) => a.pct - b.pct)
}

function getClipTimestamps(clip: Clip): string[] {
  const toSec = (t: string) => { const [h,m,s]=t.split(':').map(Number); return h*3600+m*60+s }
  const [startStr, endStr] = clip.time.split('–')
  const startSec = toSec(startStr)
  const dur = toSec(endStr) - startSec
  return Array.from({length: 5}, (_, i) => fmtSecs(startSec + Math.round(i / 4 * dur)))
}


// ── 클립 처리 단계 ────────────────────────────────────────
type ClipStage = 'detecting' | 'segmenting' | 'encoding' | 'done'

function getClipStage(clipPos: number, progress: number): ClipStage {
  const diff = progress - clipPos
  if (diff < 3)  return 'detecting'
  if (diff < 7)  return 'segmenting'
  if (diff < 14) return 'encoding'
  return 'done'
}

function getEncodingPct(clipPos: number, progress: number): number {
  const diff = progress - clipPos
  return Math.min(94, Math.max(4, ((diff - 7) / 7) * 100))
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
function Card({ className='', style, children }: { className?: string; style?: React.CSSProperties; children: React.ReactNode }) {
  return (
    <div className={`bg-white/[0.04] rounded-xl border border-white/[0.07] ${className}`} style={style}>
      {children}
    </div>
  )
}

// ══════════════════════════════════════════════════════════
// CLIP DETAIL MODAL
// ══════════════════════════════════════════════════════════
function ClipDetailModal({ clip, onClose, onNav }: { clip: Clip; onClose: () => void; onNav: (nav: UploadNav) => void }) {
  const [editingTitle,    setEditingTitle]    = useState(false)
  const [title,           setTitle]           = useState(clip.title)
  const [tags,            setTags]            = useState([...clip.tags])
  const [newTag,          setNewTag]          = useState('')
  const [reanalyzeTypes,  setReanalyzeTypes]  = useState(new Set(['채팅 폭발']))
  const [chatWeight,      setChatWeight]      = useState(clip.chatScore > clip.videoScore * 4 ? 75 : 60)
  const [reanalyzeNote,   setReanalyzeNote]   = useState('')
  const [analyzing,       setAnalyzing]       = useState(false)
  const [analyzeProgress, setAnalyzeProgress] = useState(0)
  const [analyzeDone,     setAnalyzeDone]     = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const toggleType = (t: string) => {
    setReanalyzeTypes(prev => {
      const n = new Set(prev)
      n.has(t) ? n.delete(t) : n.add(t)
      return n.size === 0 ? prev : n   // 최소 1개 유지
    })
  }

  const runAnalysis = () => {
    setAnalyzing(true); setAnalyzeDone(false); setAnalyzeProgress(0)
    let p = 0
    const id = setInterval(() => {
      p += Math.random() * 18 + 4
      if (p >= 100) {
        clearInterval(id)
        setAnalyzeProgress(100)
        setAnalyzing(false)
        setAnalyzeDone(true)
      } else {
        setAnalyzeProgress(Math.min(p, 98))
      }
    }, 180)
  }

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
          <div className="flex-1 p-4 flex flex-col gap-2.5 min-w-0">

            {/* 제목 */}
            <div>
              <div className="text-white/30 text-[10px] mb-1">클립 제목</div>
              {editingTitle ? (
                <div className="flex gap-2">
                  <input value={title} onChange={e => setTitle(e.target.value)} autoFocus
                    className="flex-1 bg-white/[0.05] border border-accent-purple/50 rounded-lg px-3 py-1.5 text-white/80 text-sm outline-none focus:border-accent-purple"/>
                  <button onClick={() => setEditingTitle(false)}
                    className="text-[10px] text-accent-purple border border-accent-purple/40 rounded-lg px-3 hover:bg-accent-purple/10 transition-colors">저장</button>
                </div>
              ) : (
                <div className="flex items-center gap-2 group">
                  <span className="text-white/85 text-sm font-semibold leading-snug">{title}</span>
                  <button onClick={() => setEditingTitle(true)}
                    className="text-white/20 hover:text-white/55 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0">
                    <Pencil size={11}/>
                  </button>
                </div>
              )}
            </div>

            {/* 태그 */}
            <div>
              <div className="text-white/30 text-[10px] mb-1">태그</div>
              <div className="flex flex-wrap gap-1">
                {tags.map((tag, i) => (
                  <span key={tag+i} className="flex items-center gap-1 text-[9px] text-accent-purple/80 bg-accent-purple/15 border border-accent-purple/25 px-1.5 py-0.5 rounded-full">
                    {tag}
                    <button onClick={() => setTags(t => t.filter((_,j) => j!==i))}
                      className="text-white/30 hover:text-white/70 leading-none">×</button>
                  </span>
                ))}
                <div className="flex items-center bg-white/[0.04] border border-white/[0.1] rounded-full px-2 py-0.5">
                  <input value={newTag} onChange={e => setNewTag(e.target.value)}
                    onKeyDown={e => { if (e.key==='Enter' && newTag.trim()) { setTags(t => [...t, newTag.trim().startsWith('#')?newTag.trim():'#'+newTag.trim()]); setNewTag('') }}}
                    placeholder="+ 추가" className="bg-transparent text-white/40 text-[9px] outline-none w-12 placeholder:text-white/20"/>
                </div>
              </div>
            </div>

            {/* 구분선 */}
            <div className="border-t border-white/[0.06]"/>

            {/* ── 재분석 설정 ── */}
            <div className="flex-1 flex flex-col gap-2.5 min-h-0">
              <div className="flex items-center gap-2">
                <RotateCcw size={11} className="text-accent-purple/80"/>
                <span className="text-white/65 text-[11px] font-semibold">재분석 설정</span>
                <span className="text-[8px] bg-accent-purple/20 text-accent-purple px-1.5 py-px rounded-full ml-auto">Beta</span>
              </div>

              {/* 감지 유형 */}
              <div>
                <div className="text-white/30 text-[9px] mb-1.5">감지 유형 <span className="text-white/20">(중복 선택 가능)</span></div>
                <div className="flex flex-wrap gap-1.5">
                  {['채팅 폭발','액션 장면','반전 순간','감정 반응','킬/클러치'].map(t => (
                    <button key={t} onClick={() => toggleType(t)}
                      className={`text-[9px] px-2 py-1 rounded-lg border transition-all ${
                        reanalyzeTypes.has(t)
                          ? 'text-accent-purple border-accent-purple/50 bg-accent-purple/15 font-semibold'
                          : 'text-white/35 border-white/[0.08] hover:border-white/20 hover:text-white/55'
                      }`}>
                      {reanalyzeTypes.has(t) ? '✓ ' : ''}{t}
                    </button>
                  ))}
                </div>
              </div>

              {/* 가중치 슬라이더 */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-white/30 text-[9px]">분석 가중치</span>
                  <div className="flex items-center gap-1 text-[9px]">
                    <span className="text-cyan-400/80 font-semibold">채팅 {chatWeight}%</span>
                    <span className="text-white/20">·</span>
                    <span className="text-purple-300/80 font-semibold">영상 {100-chatWeight}%</span>
                  </div>
                </div>
                {/* 슬라이더 트랙 + 드래그 핸들 */}
                <div className="relative h-5 flex items-center">
                  {/* 트랙 배경 */}
                  <div className="w-full h-1.5 rounded-full" style={{background:'rgba(255,255,255,0.07)'}}/>
                  {/* 채워진 부분 */}
                  <div className="absolute left-0 h-1.5 rounded-full pointer-events-none"
                    style={{width:`${chatWeight}%`, background:'linear-gradient(to right,#06b6d4bb,#a855f7bb)'}}/>
                  {/* 드래그 핸들 (dot) */}
                  <div className="absolute w-4 h-4 rounded-full pointer-events-none transition-transform"
                    style={{
                      left:`${chatWeight}%`,
                      transform:'translateX(-50%)',
                      background:'white',
                      border:'2px solid #7c3aed',
                      boxShadow:'0 0 0 3px rgba(124,58,237,0.25), 0 0 8px rgba(124,58,237,0.6)',
                    }}/>
                  {/* 인터랙션용 투명 input */}
                  <input type="range" min={10} max={90} value={chatWeight}
                    onChange={e => setChatWeight(Number(e.target.value))}
                    className="absolute inset-0 w-full opacity-0 cursor-grab active:cursor-grabbing"
                    style={{height:'100%'}}/>
                </div>
                <div className="flex justify-between text-[8px] text-white/20 mt-0.5">
                  <span className="text-cyan-400/40">채팅 중심</span>
                  <span>균형</span>
                  <span className="text-purple-300/40">영상 중심</span>
                </div>
              </div>

              {/* 자유 지시 */}
              <div>
                <div className="text-white/30 text-[9px] mb-1">AI에게 추가 지시</div>
                <textarea
                  value={reanalyzeNote}
                  onChange={e => setReanalyzeNote(e.target.value)}
                  placeholder="예: 킬 장면 위주로, 클립 시작을 5초 앞으로, 감동적인 순간 위주로..."
                  rows={2}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-2.5 py-2 text-white/60 text-[10px] outline-none focus:border-accent-purple/40 resize-none placeholder:text-white/20 leading-relaxed"
                />
              </div>

              {/* 재분석 실행 */}
              <div className="mt-auto">
                {analyzing ? (
                  <div className="rounded-xl border border-accent-purple/30 bg-accent-purple/[0.07] p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-accent-purple animate-pulse"/>
                        <span className="text-accent-purple text-[10px] font-semibold">AI 재분석 중...</span>
                      </div>
                      <span className="text-accent-purple/60 text-[10px] font-mono">{Math.round(analyzeProgress)}%</span>
                    </div>
                    <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                      <div className="h-full bg-accent-purple/70 rounded-full transition-all duration-200"
                        style={{width:`${analyzeProgress}%`}}/>
                    </div>
                    <div className="text-white/30 text-[9px] mt-1.5">
                      {analyzeProgress < 40 ? '채팅 데이터 분석 중...' : analyzeProgress < 75 ? '영상 패턴 감지 중...' : '결과 최적화 중...'}
                    </div>
                  </div>
                ) : analyzeDone ? (
                  <div className="rounded-xl border border-green-500/30 bg-green-500/[0.06] p-3 flex items-center gap-2">
                    <span className="text-green-400 text-[11px]">✓</span>
                    <span className="text-green-400/80 text-[10px] font-semibold">재분석 완료 — 점수가 업데이트되었습니다</span>
                    <button onClick={() => setAnalyzeDone(false)}
                      className="ml-auto text-white/25 hover:text-white/50 transition-colors"><X size={11}/></button>
                  </div>
                ) : (
                  <button onClick={runAnalysis}
                    disabled={reanalyzeTypes.size === 0}
                    className="w-full flex items-center justify-center gap-2 bg-accent-purple/20 border border-accent-purple/40 text-accent-purple text-[11px] font-bold py-2.5 rounded-xl hover:bg-accent-purple/30 transition-colors disabled:opacity-40"
                    style={{boxShadow:'0 0 12px rgba(124,58,237,.15)'}}>
                    <RotateCcw size={11}/>
                    선택한 방향으로 재분석
                  </button>
                )}
              </div>
            </div>

            {/* 하단 액션 */}
            <div className="flex gap-1.5 pt-1 border-t border-white/[0.06]">
              <button onClick={() => { onNav({ rank: clip.rank, tab: 'upload' }); onClose() }} className="flex-1 flex items-center justify-center gap-1 text-white/45 border border-white/[0.09] text-[10px] py-1.5 rounded-lg hover:border-accent-purple/40 hover:text-accent-purple transition-colors">
                <Upload size={10}/> 업로드 페이지 →
              </button>
              <button onClick={() => { onNav({ rank: clip.rank, tab: 'export' }); onClose() }} className="flex-1 flex items-center justify-center gap-1 text-white/45 border border-white/[0.09] text-[10px] py-1.5 rounded-lg hover:border-cyan-500/35 hover:text-cyan-400 transition-colors">
                <Download size={10}/> 내보내기 페이지 →
              </button>
              <button className="flex items-center justify-center px-2.5 py-1.5 rounded-lg border border-white/[0.07] text-red-400/45 hover:border-red-500/30 hover:text-red-400 transition-colors">
                <Trash2 size={10}/>
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
  const [elapsed,  setElapsed]  = useState(8073)
  const [viewers,  setViewers]  = useState(11203)

  useEffect(() => {
    const id = setInterval(() => setElapsed(e => e + 1), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      setViewers(v => Math.max(10000, Math.min(13000, Math.round(v + (Math.random()-0.5)*80))))
    }, 3500)
    return () => clearInterval(id)
  }, [])

  return (
    <aside className="w-48 flex-shrink-0 border-l border-white/[0.07] overflow-hidden p-3 space-y-3"
      style={{ background:'#0c0c1a' }}>
      {/* Card 1: 라이브 상태 */}
      <div className="bg-white/[0.04] rounded-xl p-3 border border-green-500/25">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse flex-shrink-0"/>
            <span className="text-green-400 text-[10px] font-bold tracking-wide">LIVE</span>
          </div>
          <a
            href="https://chzzk.naver.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-1.5 py-0.5 rounded-md border border-green-500/30 bg-green-500/10 hover:bg-green-500/20 transition-colors"
          >
            <span className="text-green-400/80 text-[8px] font-semibold">바로가기</span>
            <Link2 size={8} className="text-green-400/60 flex-shrink-0"/>
          </a>
        </div>
        <div className="text-white/75 text-[11px] font-semibold leading-snug mb-1">
          리그 오브 레전드 | 플래 탈출 도전기 EP.8
        </div>
        <div className="text-white/35 text-[10px] mb-1.5">SOOP · 경과 {fmtSecs(elapsed)}</div>
        <div className="flex items-center gap-1">
          <Users size={9} className="text-cyan-400 flex-shrink-0"/>
          <span className="text-cyan-400 text-[10px] font-semibold transition-all duration-700">{viewers.toLocaleString()}</span>
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

      {/* Card 5: 업로드 대기 */}
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

      {/* Card 6: 플랫폼 업로드 현황 */}
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
// CLIP ANALYSIS MODAL — 상세 AI 분석 (채팅 로그 + 감지 근거)
// ══════════════════════════════════════════════════════════

// ══════════════════════════════════════════════════════════
// PAGE 2: 실시간 분석 (live animated progress 20 → 80%)
// ══════════════════════════════════════════════════════════
function LiveAnalysisPage() {
  const [progress,       setProgress]       = useState(20)
  const [animDone,       setAnimDone]       = useState(false)
  const [extraSecs,      setExtraSecs]      = useState(0)
  const [hoveredClip,    setHoveredClip]    = useState<number | null>(null)
  const [graphPos,       setGraphPos]       = useState<number | null>(null)
  const [selectedLogClip,setSelectedLogClip]= useState<Clip | null>(null)
  const [clipTags, setClipTags] = useState<Record<number,string[]>>(
    () => Object.fromEntries(ALL_CLIPS.map(c => [c.rank, [...c.tags]]))
  )
  const [tagInput, setTagInput] = useState('')
  const [clipSeek,      setClipSeek]      = useState(0)   // 0-100% within selected clip
  const [clipSeekHover, setClipSeekHover] = useState<number|null>(null)
  const [bitrate,  setBitrate]  = useState(6000)
  const [delay,    setDelay]    = useState(0.8)
  const [chatRate, setChatRate] = useState(1247)
  // reset seek when clip changes
  useEffect(() => { setClipSeek(0); setClipSeekHover(null) }, [selectedLogClip?.rank])

  const logScrollRef = useRef<HTMLDivElement>(null)

  // 릴레이 & 채팅 수치 실시간 변동
  useEffect(() => {
    const id = setInterval(() => {
      setBitrate(b  => Math.max(5000, Math.min(6800, Math.round(b + (Math.random()-0.5)*280))))
      setDelay(d    => Math.round((Math.max(0.3, Math.min(2.0, d + (Math.random()-0.5)*0.22)))*10)/10)
      setChatRate(r => Math.max(800, Math.min(1800, Math.round(r + (Math.random()-0.5)*180))))
    }, 1800)
    return () => clearInterval(id)
  }, [])

  // 20% → 80% 진행 애니메이션 (~22초)
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>
    const timeoutId = setTimeout(() => {
      let cur = 20
      intervalId = setInterval(() => {
        cur = Math.min(cur + 60 / (22000 / 60), 80)
        setProgress(cur)
        if (cur >= 80) { setAnimDone(true); clearInterval(intervalId) }
      }, 60)
    }, 400)
    return () => { clearTimeout(timeoutId); clearInterval(intervalId!) }
  }, [])

  // 애니메이션 완료 후 실시간 경과 타이머
  useEffect(() => {
    if (!animDone) return
    const id = setInterval(() => setExtraSecs(s => s + 1), 1000)
    return () => clearInterval(id)
  }, [animDone])

  const elapsedSecs   = Math.floor(progress / 100 * TOTAL_SECS) + extraSecs
  const detectedClips = ALL_CLIPS.filter(c => c.pos <= progress).sort((a, b) => a.pos - b.pos)
  const visibleLogs   = LOG_EVENTS.filter(e => e.pos <= progress)

  // 새 로그 등장 시 자동 스크롤
  useEffect(() => {
    if (logScrollRef.current) {
      logScrollRef.current.scrollTop = logScrollRef.current.scrollHeight
    }
  }, [visibleLogs.length])

  // 그래프 끝 라이브 도트 위치
  const liveWaveIdx = Math.min(79, Math.floor(progress / 100 * 80))
  const liveDotX    = progress / 100 * 800
  const liveDotY    = 56 - WAVE[liveWaveIdx] * 56 * 0.88

  // 호버 인터랙션
  const waveIdx    = graphPos !== null ? Math.min(79, Math.floor(graphPos * 80)) : 0
  const hoverWave  = WAVE[waveIdx]
  const hoverTime  = graphPos !== null ? fmtSecs(Math.floor(graphPos * TOTAL_SECS)) : ''
  const hoverChat  = Math.round(hoverWave * 80)
  const hoverVid   = Math.round(hoverWave * 20)
  const hoverTotal = hoverChat + hoverVid
  const hClip      = hoveredClip !== null ? detectedClips.find(c => c.rank === hoveredClip) : null
  const clipWave         = selectedLogClip ? getClipWaveData(selectedLogClip) : ([] as number[])
  const clipMoments      = selectedLogClip ? getClipKeyMoments(selectedLogClip, clipWave) : [] as {pct:number;icon:string;label:string;color:string;bg:string;border:string}[]
  const clipTimestamps   = selectedLogClip ? getClipTimestamps(selectedLogClip) : ([] as string[])
  const clipCurrentTime = (() => {
    if (!selectedLogClip) return ''
    const toSec = (t: string) => { const [h,m,s]=t.split(':').map(Number); return h*3600+m*60+s }
    const [s0,s1] = selectedLogClip.time.split('–')
    const cur = toSec(s0) + Math.round(clipSeek/100 * (toSec(s1)-toSec(s0)))
    return fmtSecs(cur)
  })()
  const selLogClipRank = selectedLogClip?.rank

  // 선택된 클립 기준 로그 필터
  const filteredLogs = selectedLogClip
    ? visibleLogs.filter(e =>
        e.clip === selectedLogClip.rank ||
        (e.type !== 'detect' && e.type !== 'extract' && Math.abs(e.pos - selectedLogClip.pos) < 14)
      )
    : visibleLogs

  return (
    <PageWrap>
      {/* 헤더 */}
      <div className="px-5 pt-4 pb-2 flex-shrink-0 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-white font-bold text-sm">실시간 분석</h3>
            {animDone ? (
              <span className="flex items-center gap-1 text-[9px] bg-accent-purple/15 text-accent-purple border border-accent-purple/25 px-2 py-px rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-purple animate-pulse"/>80% 분석 중
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[9px] bg-red-500/15 text-red-400 border border-red-500/25 px-2 py-px rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"/>LIVE 분석 중
              </span>
            )}
          </div>
          <p className="text-white/35 text-[11px] mt-0.5">방송 중 AI가 실시간으로 하이라이트를 감지합니다</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[11px] text-white/50 bg-white/[0.04] border border-white/[0.08] px-3 py-1.5 rounded-lg font-mono">
            경과 <span className="text-white/75 font-bold">{fmtSecs(elapsedSecs)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-lg">
            <Wifi size={11}/> 실시간 연결 중
          </div>
        </div>
      </div>

      {/* ── 스크롤 가능한 메인 콘텐츠 ── */}
      <div className="flex-1 px-5 pb-4 flex flex-col gap-2.5 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-accent-purple/35 [&::-webkit-scrollbar-track]:bg-transparent">

        {/* 스탯 2개 + 릴레이 품질 + 채팅 API 상태 */}
        <div className="grid grid-cols-4 gap-2 flex-shrink-0">

          {/* 채팅 밀도 */}
          {(() => {
            const hot = chatRate >= 1300
            const warm = chatRate >= 1100
            const color = hot ? 'text-orange-400' : warm ? 'text-yellow-400' : 'text-cyan-400'
            const barColor = hot ? 'bg-orange-400/70' : warm ? 'bg-yellow-400/60' : 'bg-cyan-400/60'
            const barW = Math.min(100, Math.round((chatRate - 800) / 1000 * 100))
            return (
              <Card className="p-2.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <MessageSquare size={11} className={color}/>
                  <span className="text-white/35 text-[9px]">채팅 밀도</span>
                </div>
                <div className={`text-base font-bold font-mono ${color} transition-all duration-500`}>
                  {chatRate.toLocaleString()}<span className="text-[9px] font-normal ml-0.5">건/분</span>
                </div>
                <div className="mt-1 h-0.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${barColor}`} style={{ width:`${barW}%` }}/>
                </div>
              </Card>
            )
          })()}

          {/* 처리 대기열 */}
          {(() => {
            const queue = detectedClips.filter(c => getClipStage(c.pos, progress) !== 'done')
            const stages = [
              { label:'분석', count: queue.filter(c => getClipStage(c.pos,progress) === 'detecting').length,  dot:'bg-yellow-400' },
              { label:'확정', count: queue.filter(c => getClipStage(c.pos,progress) === 'segmenting').length, dot:'bg-orange-400' },
              { label:'인코딩', count: queue.filter(c => getClipStage(c.pos,progress) === 'encoding').length, dot:'bg-cyan-400'   },
            ]
            return (
              <Card className="p-2.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <Zap size={11} className="text-accent-purple"/>
                  <span className="text-white/35 text-[9px]">처리 대기열</span>
                </div>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-base font-bold text-accent-purple">{queue.length}</span>
                  <span className="text-white/30 text-[9px] pb-0.5">개 처리 중</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {stages.map(s => s.count > 0 && (
                    <span key={s.label} className="flex items-center gap-0.5 text-[8px] text-white/35">
                      <span className={`w-1 h-1 rounded-full ${s.dot} animate-pulse`}/>
                      {s.label} {s.count}
                    </span>
                  ))}
                  {queue.length === 0 && <span className="text-[8px] text-white/20">대기 없음</span>}
                </div>
              </Card>
            )
          })()}

          {/* 릴레이 품질 */}
          <Card className="p-2.5">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1">
                <Wifi size={11} className="text-cyan-400"/>
                <span className="text-white/35 text-[9px]">릴레이 품질</span>
              </div>
              <span className="flex items-center gap-0.5 text-[7px] text-green-400/80 bg-green-500/10 px-1 py-px rounded-full">
                <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse"/>RELAY
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-white/30 text-[9px]">비트레이트</span>
                <span className={`text-[9px] font-mono font-semibold ${bitrate > 5800 ? 'text-green-400' : 'text-yellow-400'}`}>{bitrate.toLocaleString()} kbps</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/30 text-[9px]">딜레이</span>
                <span className={`text-[9px] font-mono font-semibold ${delay < 1.0 ? 'text-green-400' : 'text-yellow-400'}`}>{delay.toFixed(1)}s</span>
              </div>
            </div>
            <div className="mt-1.5 h-0.5 bg-white/[0.06] rounded-full overflow-hidden">
              <div className="h-full bg-cyan-400/60 rounded-full transition-all duration-700"
                style={{ width:`${Math.min(100,(bitrate/6500)*100)}%` }}/>
            </div>
          </Card>

          {/* 채팅 API 상태 */}
          <Card className="p-2.5">
            <div className="flex items-center gap-1 mb-1.5">
              <MessageSquare size={11} className="text-accent-purple"/>
              <span className="text-white/35 text-[9px]">채팅 API</span>
            </div>
            <div className="space-y-1">
              {([
                { platform:'치지직', connected:true  },
                { platform:'SOOP',   connected:false },
              ]).map(p => (
                <div key={p.platform} className="flex items-center justify-between">
                  <span className="text-white/40 text-[9px]">{p.platform}</span>
                  {p.connected
                    ? <span className="flex items-center gap-0.5 text-[8px] text-green-400"><span className="w-1 h-1 rounded-full bg-green-400 animate-pulse"/>연결</span>
                    : <span className="text-[8px] text-white/20">미연결</span>
                  }
                </div>
              ))}
            </div>
            <div className="mt-1 pt-1 border-t border-white/[0.05] flex justify-between">
              <span className="text-white/25 text-[9px]">수신속도</span>
              <span className="text-cyan-400 text-[9px] font-mono transition-all duration-700">{chatRate.toLocaleString()}건/분</span>
            </div>
          </Card>

        </div>

        {/* ── 인라인 클립 상세보기 ── */}
        <AnimatePresence>
          {selectedLogClip && (
            <motion.div
              key={selectedLogClip.rank}
              initial={{ opacity:0, height:0 }}
              animate={{ opacity:1, height:'auto' }}
              exit={{ opacity:0, height:0 }}
              transition={{ duration:0.22, ease:[0.22,1,0.36,1] }}
              className="overflow-hidden flex-shrink-0"
            >
              <Card className="overflow-hidden">
                {/* 헤더 */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06]"
                  style={{background:'rgba(255,255,255,0.02)'}}>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-yellow-400 text-[10px] flex-shrink-0">♛{selectedLogClip.rank}</span>
                    <span className="text-white/80 text-[12px] font-bold truncate">{selectedLogClip.title}</span>
                    <span className="text-white/25 text-[9px] flex-shrink-0 font-mono">{selectedLogClip.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-accent-purple text-[10px] font-bold bg-accent-purple/15 border border-accent-purple/25 px-2 py-0.5 rounded-full">
                      {selectedLogClip.score}점
                    </span>
                    <button onClick={() => setSelectedLogClip(null)}
                      className="w-6 h-6 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center transition-colors">
                      <X size={11} className="text-white/40"/>
                    </button>
                  </div>
                </div>
                {/* 본문 */}
                <div className="flex gap-0">
                  {/* 비디오 플레이어 */}
                  <div className="flex-1 p-3 border-r border-white/[0.06] flex flex-col gap-2 min-w-0">
                    <div className="relative rounded-lg overflow-hidden" style={{aspectRatio:'16/9'}}>
                      <img src={THUMB_IMGS[(selectedLogClip.rank-1)%THUMB_IMGS.length]} alt={selectedLogClip.title}
                        className="absolute inset-0 w-full h-full object-cover" draggable={false}/>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/10 transition-colors cursor-pointer group">
                        <div className="w-10 h-10 rounded-full bg-black/40 group-hover:bg-black/60 flex items-center justify-center border border-white/30 backdrop-blur-sm transition-colors">
                          <Play size={16} className="text-white ml-0.5" fill="white"/>
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 px-2.5 py-1.5 flex items-center justify-between"
                        style={{background:'linear-gradient(to top, rgba(0,0,0,0.75), transparent)'}}>
                        <span className="text-white/80 text-[10px] font-mono font-semibold">
                          {clipCurrentTime}
                        </span>
                        <span className="text-white/40 text-[9px]">1920×1080 · {selectedLogClip.platform}</span>
                      </div>
                    </div>
                    {/* 미니 시크바 */}
                    <div className="relative h-1 bg-white/[0.06] rounded-full overflow-hidden cursor-pointer group/seek"
                      onClick={e => {
                        const r = e.currentTarget.getBoundingClientRect()
                        setClipSeek(Math.round(Math.max(0,Math.min(1,(e.clientX-r.left)/r.width))*100))
                      }}>
                      <div className="absolute inset-y-0 left-0 bg-accent-purple/70 rounded-full transition-all duration-75"
                        style={{width:`${clipSeek}%`}}/>
                      <div className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-accent-purple shadow-lg opacity-0 group-hover/seek:opacity-100 transition-opacity pointer-events-none"
                        style={{left:`${clipSeek}%`, transform:'translate(-50%,-50%)', boxShadow:'0 0 6px rgba(168,85,247,0.9)'}}/>
                    </div>
                    {/* 태그 에디터 */}
                    <div className="flex flex-wrap gap-1">
                      {(clipTags[selectedLogClip.rank] ?? []).map((tag, ti) => (
                        <span key={tag+ti} className="flex items-center gap-1 text-[9px] text-accent-purple/80 bg-accent-purple/15 border border-accent-purple/25 px-1.5 py-0.5 rounded-full">
                          {tag}
                          <button onClick={() => setClipTags(prev => ({
                            ...prev,
                            [selectedLogClip.rank]: (prev[selectedLogClip.rank] ?? []).filter((_el, j) => j !== ti)
                          }))} className="text-white/30 hover:text-white/70 leading-none transition-colors">×</button>
                        </span>
                      ))}
                      <div className="flex items-center bg-white/[0.04] border border-white/[0.1] rounded-full px-2 py-0.5">
                        <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter' && tagInput.trim() && selectedLogClip) {
                              const t = tagInput.trim().startsWith('#') ? tagInput.trim() : '#'+tagInput.trim()
                              setClipTags(prev => ({ ...prev, [selectedLogClip.rank]: [...(prev[selectedLogClip.rank] ?? []), t] }))
                              setTagInput('')
                            }
                          }}
                          placeholder="+ 태그 추가"
                          className="bg-transparent text-white/40 text-[9px] outline-none w-14 placeholder:text-white/20"/>
                      </div>
                    </div>
                  </div>
                  {/* 채팅 반응 분석 패널 */}
                  <div className="w-52 flex-shrink-0 flex flex-col border-l border-white/[0.05]">
                    {/* AI 분析 로그 헤더 */}
                    <div className="flex items-center justify-between px-3 pt-2.5 pb-2 border-b border-white/[0.06] flex-shrink-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-white/55 text-[10px] font-semibold">AI 분석 로그</span>
                        <span className="flex items-center gap-1 text-[8px] text-cyan-400/80 bg-cyan-500/10 border border-cyan-500/25 px-1.5 py-px rounded-full">
                          <span className="w-1 h-1 rounded-full bg-cyan-400 flex-shrink-0"/>클립 #{selectedLogClip.rank}
                        </span>
                      </div>
                      <span className="text-white/20 text-[8px] font-mono">{filteredLogs.filter(l => l.clip === selectedLogClip.rank || Math.abs(l.pos - selectedLogClip.pos) < 14).length}개</span>
                    </div>
                    {/* 로그 리스트 */}
                    <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-[2px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-accent-purple/25 [&::-webkit-scrollbar-track]:bg-transparent">
                      {filteredLogs.filter(l => l.clip === selectedLogClip.rank || Math.abs(l.pos - selectedLogClip.pos) < 14).length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full gap-2 py-6">
                          <span className="text-white/15 text-[9px]">이 클립 관련 로그 없음</span>
                        </div>
                      ) : (
                        filteredLogs
                          .filter(l => l.clip === selectedLogClip.rank || Math.abs(l.pos - selectedLogClip.pos) < 14)
                          .map((log, i) => (
                          <div key={i} className={`flex items-start gap-2 px-3 py-2 border-b border-white/[0.03] ${
                            log.clip === selectedLogClip.rank ? 'bg-accent-purple/[0.06]' : ''
                          }`}>
                            <span className="text-white/20 text-[8px] font-mono flex-shrink-0 mt-px leading-tight">{log.time}</span>
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1 ${
                              log.type==='chat' ? 'bg-cyan-400' :
                              log.type==='detect' ? 'bg-accent-purple' :
                              log.type==='extract' ? 'bg-green-400' : 'bg-white/25'
                            }`}/>
                            <span className={`text-[9px] leading-relaxed ${
                              log.type==='chat' ? 'text-cyan-400/75' :
                              log.type==='detect' ? 'text-accent-purple/90' :
                              log.type==='extract' ? 'text-green-400/90' : 'text-white/35'
                            }`}>{log.msg}</span>
                          </div>
                        ))
                      )}
                      {!animDone && (
                        <div className="flex items-center gap-2 px-3 py-2">
                          <span className="text-white/15 text-[8px] font-mono flex-shrink-0">──:──:──</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-white/15 flex-shrink-0"/>
                          <span className="text-white/20 text-[9px]">분석 진행 중</span>
                          <span className="flex gap-0.5 ml-1">
                            {[0,1,2].map(d => (
                              <span key={d} className="w-1 h-1 rounded-full bg-white/20 animate-pulse" style={{animationDelay:`${d*0.2}s`}}/>
                            ))}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── 타임라인 분析 ── */}
        {selectedLogClip && (
          <Card className="p-3 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-white/55 text-[11px] font-semibold">클립 #{selectedLogClip.rank} 타임라인</span>
                <span className="text-white/20 text-[9px] font-mono bg-white/[0.03] border border-white/[0.07] px-2 py-px rounded-full">
                  {selectedLogClip.time.replace('–', ' ~ ')}
                </span>
                <span className="text-accent-purple/70 text-[9px] font-mono bg-accent-purple/10 border border-accent-purple/25 px-2 py-px rounded-full">
                  {selectedLogClip.dur}
                </span>
              </div>
              <button onClick={() => setSelectedLogClip(null)} className="text-white/25 hover:text-white/55 transition-colors">
                <X size={11}/>
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {/* 채팅밀도 */}
              <div className="flex items-end">
                <div className="text-[8.5px] text-white/25 text-right pr-2 flex-shrink-0 self-center" style={{width:'42px'}}>채팅밀도</div>
                <div className="flex-1 flex items-end gap-px" style={{height:'40px'}}>
                  {clipWave.map((v, i) => (
                    <div key={i} className="flex-1 rounded-t-[1px]"
                      style={{
                        height:`${Math.round(v * 100)}%`,
                        background: `rgba(124,58,237,${(0.25 + v * 0.7).toFixed(2)})`,
                        boxShadow: v > 0.82 ? '0 0 4px rgba(168,85,247,0.7)' : undefined,
                      }}/>
                  ))}
                </div>
              </div>
              {/* 주요 순간 마커 */}
              <div className="flex" style={{alignItems:'stretch'}}>
                <div className="text-[8.5px] text-white/25 text-right pr-2 flex-shrink-0 flex items-center justify-end" style={{width:'42px'}}>주요순간</div>
                <div className="relative flex-1" style={{height:'52px'}}>
                  {/* 중앙 점선 */}
                  <div className="absolute left-0 right-0 border-t border-dashed border-white/[0.08]" style={{top:'50%'}}/>
                  {clipMoments.map((m, mi) => {
                    const isTop = mi % 2 === 0
                    return (
                      <div key={mi} className="absolute -translate-x-1/2 group/moment" style={{left:`${m.pct}%`, top:0, bottom:0}}>
                        {/* 틱 선 */}
                        <div className="absolute left-1/2 -translate-x-1/2 w-px opacity-40"
                          style={{
                            background: m.color,
                            top: isTop ? 0 : '50%',
                            bottom: isTop ? '50%' : 0,
                          }}/>
                        {/* 라벨 칩 */}
                        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-px z-10"
                          style={{ top: isTop ? 0 : undefined, bottom: isTop ? undefined : 0 }}>
                          <div className="text-[7px] px-1 py-px rounded border font-semibold whitespace-nowrap leading-tight"
                            style={{background:m.bg, borderColor:m.border, color:m.color, maxWidth:'58px', overflow:'hidden', textOverflow:'ellipsis'}}>
                            {m.icon} {m.label}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              {/* 타임라인 바 + 타임스탬프 */}
              <div className="relative flex flex-col gap-1">
                <div className="flex">
                  <div style={{width:'42px', flexShrink:0}}/>
                  <div className="relative h-3 flex-1 bg-white/[0.04] rounded-full overflow-hidden border border-white/[0.06] cursor-pointer group/bar"
                    onClick={e => {
                      const r = e.currentTarget.getBoundingClientRect()
                      setClipSeek(Math.round(Math.max(0,Math.min(1,(e.clientX-r.left)/r.width))*100))
                    }}
                    onMouseMove={e => {
                      const r = e.currentTarget.getBoundingClientRect()
                      setClipSeekHover(Math.round(Math.max(0,Math.min(1,(e.clientX-r.left)/r.width))*100))
                    }}
                    onMouseLeave={() => setClipSeekHover(null)}
                  >
                    {/* 재생된 구간 */}
                    <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-75"
                      style={{width:`${clipSeek}%`, background:'linear-gradient(90deg,rgba(124,58,237,0.5),rgba(168,85,247,0.75))'}}/>
                    {/* 주요 순간 마커 선 */}
                    {clipMoments.map((m, mi) => (
                      <div key={mi} className="absolute top-0 bottom-0 w-[1.5px] opacity-60 pointer-events-none"
                        style={{left:`${m.pct}%`, background:m.color}}/>
                    ))}
                    {/* 현재 위치 커서 */}
                    <div className="absolute top-0 bottom-0 w-[2px] pointer-events-none"
                      style={{left:`${clipSeek}%`, transform:'translateX(-50%)', background:'#a855f7', boxShadow:'0 0 6px rgba(168,85,247,0.9)'}}/>
                    {/* 호버 커서 */}
                    {clipSeekHover !== null && (
                      <div className="absolute top-0 bottom-0 w-px pointer-events-none opacity-40"
                        style={{left:`${clipSeekHover}%`, background:'rgba(255,255,255,0.6)'}}/>
                    )}
                    {/* 클릭 핸들 */}
                    <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-accent-purple shadow pointer-events-none"
                      style={{left:`${clipSeek}%`, transform:'translate(-50%,-50%)', boxShadow:'0 0 6px rgba(168,85,247,1)'}}/>
                  </div>
                </div>
                {/* 호버 타임 툴팁 */}
                {clipSeekHover !== null && (() => {
                  const toSec = (t: string) => { const [h,m,s]=t.split(':').map(Number); return h*3600+m*60+s }
                  const [s0,s1] = selectedLogClip.time.split('–')
                  const hoverSec = toSec(s0) + Math.round(clipSeekHover/100 * (toSec(s1)-toSec(s0)))
                  return (
                    <div className="absolute pointer-events-none z-20 -translate-x-1/2 -translate-y-full"
                      style={{left:`calc(42px + ${clipSeekHover}% * (100% - 42px) / 100)`, top:0}}>
                      <div className="bg-[#1a1a2e] border border-white/15 rounded-lg px-2 py-1 text-center shadow-xl mb-1">
                        <div className="text-white/80 text-[9px] font-mono font-semibold">{fmtSecs(hoverSec)}</div>
                        <div className="text-white/35 text-[8px]">채팅 {Math.round(WAVE[Math.round(clipSeekHover/100*(WAVE.length-1))] * 80)}/분</div>
                      </div>
                    </div>
                  )
                })()}
                <div className="flex">
                  <div style={{width:'42px', flexShrink:0}}/>
                  <div className="flex flex-1 justify-between text-[8.5px] text-white/20 font-mono">
                    {clipTimestamps.map(t => <span key={t}>{t}</span>)}
                  </div>
                </div>
              </div>
              {/* 태그 */}
              <div className="flex items-center pt-1.5 border-t border-white/[0.05]">
                <div className="text-[8.5px] text-white/25 text-right pr-2 flex-shrink-0" style={{width:'42px'}}>태그</div>
                <div className="flex flex-1 flex-wrap gap-1.5">
                  {(clipTags[selectedLogClip.rank] ?? selectedLogClip.tags).map((tag, ti) => (
                    <span key={ti} className="text-[9px] px-2 py-0.5 rounded-full border bg-accent-purple/10 border-accent-purple/30 text-accent-purple/80 font-semibold">
                      {tag}
                    </span>
                  ))}
                  {selectedLogClip.chatScore >= 70 && (
                    <span className="text-[9px] px-2 py-0.5 rounded-full border bg-cyan-500/10 border-cyan-500/30 text-cyan-400/80">
                      📈 채팅 {selectedLogClip.chatScore}점
                    </span>
                  )}
                  {selectedLogClip.videoScore >= 17 && (
                    <span className="text-[9px] px-2 py-0.5 rounded-full border bg-purple-500/10 border-purple-500/30 text-purple-300/80">
                      🎬 영상 {selectedLogClip.videoScore}점
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}
        {!selectedLogClip && (
        <Card className="p-3 flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/55 text-[11px] font-semibold">타임라인 분석</span>
            <div className="flex items-center gap-2">
              <span className="text-white/25 text-[9px]">분석 진행률</span>
              <div className="w-16 h-1.5 bg-white/[0.07] rounded-full overflow-hidden">
                <div className="h-full bg-accent-purple/70 rounded-full transition-all duration-100"
                  style={{ width:`${progress}%` }}/>
              </div>
              <span className="text-accent-purple text-[9px] font-mono font-semibold">
                {Math.round(progress)}%{animDone && <span className="text-accent-purple/50 ml-0.5 animate-pulse"> ●</span>}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            {/* 방송 세그먼트 레이블 */}
            <div className="flex">
              <div style={{width:'22px',flexShrink:0}}/>
              <div className="relative h-5 flex-1">
                {BROADCAST_SEGS.map((seg, si) => {
                  if (seg.l >= progress) return null
                  const visW = Math.min(seg.l + seg.w, progress) - seg.l
                  return (
                    <div key={si} className="absolute top-0 bottom-0 rounded-sm px-1 flex items-center overflow-hidden"
                      style={{left:`${seg.l}%`, width:`${visW}%`, background:seg.color}}>
                      <span className="text-[7.5px] font-semibold text-white/90 truncate leading-none">{seg.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
            {/* 클립 마커 (썸네일) */}
            <div className="flex">
              <div style={{width:'22px',flexShrink:0}}/>
              <div className="relative flex-1" style={{height:'38px'}}>
                {detectedClips.map(clip => {
                  const isSel = selLogClipRank === clip.rank
                  const isHov = hoveredClip === clip.rank
                  return (
                    <button key={clip.rank}
                      className="absolute bottom-0 flex flex-col items-center gap-0.5"
                      style={{left:`${clip.pos}%`, transform:'translateX(-50%)'}}
                      onClick={() => { setSelectedLogClip(prev => prev?.rank === clip.rank ? null : clip) }}
                      onMouseEnter={() => setHoveredClip(clip.rank)}
                      onMouseLeave={() => setHoveredClip(null)}
                    >
                      <div className={`rounded overflow-hidden border transition-all ${
                        isSel ? 'border-accent-purple shadow-lg shadow-accent-purple/40 scale-110' :
                        isHov ? 'border-accent-purple/50' : 'border-white/20'
                      }`} style={{width:'32px',height:'20px'}}>
                        <img src={THUMB_IMGS[(clip.rank-1)%THUMB_IMGS.length]} alt="" className="w-full h-full object-cover"/>
                      </div>
                      <span className={`text-[7px] font-bold leading-none transition-colors ${
                        isSel ? 'text-accent-purple' : isHov ? 'text-white/65' : 'text-white/30'
                      }`}>#{clip.rank}</span>
                    </button>
                  )
                })}
              </div>
            </div>
            {/* 타임라인 바 */}
            <div className="flex">
              <div className="flex-shrink-0" style={{width:'22px'}}/>
              <div className="relative h-2.5 flex-1 bg-white/[0.04] rounded overflow-hidden border border-white/[0.06]">
                <div className="absolute inset-y-0 left-0 bg-white/[0.04] transition-all duration-100" style={{width:`${progress}%`}}/>
                {BROADCAST_SEGS.map((seg, si) => {
                  if (seg.l >= progress) return null
                  const visW = Math.min(seg.l + seg.w, progress) - seg.l
                  return <div key={si} className="absolute inset-y-0 opacity-25" style={{left:`${seg.l}%`, width:`${visW}%`, background:seg.color}}/>
                })}
                {detectedClips.map(clip => {
                  const { startPct, endPct } = parseClipPos(clip.time)
                  const w = Math.max(endPct - startPct, 0.5)
                  const isSel = selLogClipRank === clip.rank
                  const isHov = hoveredClip === clip.rank
                  return (
                    <div key={clip.rank} className="absolute inset-y-0 cursor-pointer transition-all rounded-sm"
                      style={{
                        left:`${startPct}%`, width:`${w}%`,
                        background: isSel ? '#a855f7' : isHov ? 'rgba(168,85,247,0.75)' : 'rgba(124,58,237,0.55)',
                        boxShadow: isSel ? '0 0 8px rgba(168,85,247,0.8)' : undefined,
                      }}
                      onClick={() => setSelectedLogClip(prev => prev?.rank === clip.rank ? null : clip)}
                      onMouseEnter={() => setHoveredClip(clip.rank)}
                      onMouseLeave={() => setHoveredClip(null)}
                    />
                  )
                })}
                <div className="absolute top-0 bottom-0 w-[2px] z-20 transition-all duration-100"
                  style={{left:`${progress}%`, background:'#a855f7', boxShadow:'0 0 10px rgba(168,85,247,1), 0 0 20px rgba(124,58,237,0.6)'}}>
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full"
                    style={{background:'#c084fc', boxShadow:'0 0 8px rgba(192,132,252,1)',
                      animation: animDone ? 'pulse 1.5s ease-in-out infinite' : undefined}}/>
                </div>
              </div>
            </div>
            {/* 파형 그래프 */}
            <div className="mt-0.5">
              <div className="flex relative">
                <div className="flex flex-col justify-between text-[9px] text-white/20 pointer-events-none"
                  style={{width:'22px',flexShrink:0,height:'56px'}}>
                  <span>100</span><span>50</span><span>0</span>
                </div>
                <div
                  className="relative flex-1 cursor-crosshair"
                  style={{ height:'56px' }}
                  onMouseMove={e => {
                    const r = e.currentTarget.getBoundingClientRect()
                    setGraphPos(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)))
                  }}
                  onMouseLeave={() => setGraphPos(null)}
                >
                  <svg width="100%" height="56" viewBox="0 0 800 56" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="wgLive" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7c3aed" stopOpacity=".45"/>
                        <stop offset="100%" stopColor="#7c3aed" stopOpacity=".03"/>
                      </linearGradient>
                      <clipPath id="liveWaveClip">
                        <rect x="0" y="0" width={liveDotX} height="56"/>
                      </clipPath>
                    </defs>
                    {[0.33, 0.66].map(f => (
                      <line key={f} x1="0" y1={56*f} x2="800" y2={56*f} stroke="rgba(255,255,255,.05)" strokeWidth="1"/>
                    ))}
                    {hClip && (
                      <g>
                        <rect x={hClip.pos/100*800 - 32} y={0} width={64} height={56} fill="rgba(168,85,247,0.15)" rx={3}/>
                        <line x1={hClip.pos/100*800} y1={0} x2={hClip.pos/100*800} y2={56}
                          stroke="#a855f7" strokeWidth={1.5} strokeDasharray="4 3" opacity={0.75}/>
                      </g>
                    )}
                    <path d={buildPath(WAVE,800,56,true)}  fill="url(#wgLive)"  clipPath="url(#liveWaveClip)"/>
                    <path d={buildPath(WAVE,800,56,false)} fill="none" stroke="#7c3aed" strokeWidth="1.5" clipPath="url(#liveWaveClip)"/>
                    {graphPos !== null && (
                      <g>
                        <line x1={graphPos*800} y1={0} x2={graphPos*800} y2={56}
                          stroke="rgba(255,255,255,0.22)" strokeWidth={1} strokeDasharray="3 2"/>
                        <circle cx={graphPos*800} cy={56 - WAVE[waveIdx]*56*0.88}
                          r={3.5} fill="#06b6d4" style={{ filter:'drop-shadow(0 0 5px #06b6d4)' }}/>
                      </g>
                    )}
                    {!animDone ? (
                      <g>
                        <circle cx={liveDotX} cy={liveDotY} r="4" fill="rgba(124,58,237,0.35)">
                          <animate attributeName="r" values="4;14;4" dur="1.2s" repeatCount="indefinite"/>
                          <animate attributeName="opacity" values="0.6;0;0.6" dur="1.2s" repeatCount="indefinite"/>
                        </circle>
                        <circle cx={liveDotX} cy={liveDotY} r="4.5" fill="#7c3aed"
                          style={{ filter:'drop-shadow(0 0 8px rgba(124,58,237,1))' }}/>
                      </g>
                    ) : (
                      <g>
                        <circle cx={liveDotX} cy={liveDotY} r="5" fill="rgba(168,85,247,0.2)">
                          <animate attributeName="r" values="5;18;5" dur="2s" repeatCount="indefinite"/>
                          <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite"/>
                        </circle>
                        <circle cx={liveDotX} cy={liveDotY} r="4" fill="#a855f7"
                          style={{ filter:'drop-shadow(0 0 10px rgba(168,85,247,1))' }}/>
                        <text x={liveDotX + 8} y={liveDotY - 7}
                          fill="#a855f7" fontSize="7" fontWeight="bold" fontFamily="monospace">
                          LIVE
                          <animate attributeName="opacity" values="1;0.25;1" dur="2s" repeatCount="indefinite"/>
                        </text>
                      </g>
                    )}
                  </svg>
                </div>
                {/* 호버 점수 패널 */}
                <div className="absolute right-0 top-0 rounded-xl border transition-all duration-150 overflow-hidden z-10"
                  style={{
                    width:'112px',
                    opacity: graphPos !== null ? 1 : 0,
                    transform: graphPos !== null ? 'translateX(0)' : 'translateX(6px)',
                    pointerEvents:'none',
                    background:'#131325',
                    borderColor:'rgba(255,255,255,0.10)',
                    padding:'8px 10px',
                  }}>
                  <div className="text-white/35 text-[9px] font-mono font-semibold mb-2 tracking-wide">
                    {hoverTime || '──:──:──'}
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-white/40 text-[9px]">채팅 반응</span>
                      <span className="text-cyan-400 text-[10px] font-bold">{hoverChat}<span className="text-white/25 text-[8px] font-normal">/80</span></span>
                    </div>
                    <div className="h-0.5 bg-white/[0.07] rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-400/55 rounded-full transition-all duration-75" style={{ width:`${hoverChat/80*100}%` }}/>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/40 text-[9px]">영상 분석</span>
                      <span className="text-purple-300 text-[10px] font-bold">{hoverVid}<span className="text-white/25 text-[8px] font-normal">/20</span></span>
                    </div>
                    <div className="h-0.5 bg-white/[0.07] rounded-full overflow-hidden">
                      <div className="h-full bg-purple-400/55 rounded-full transition-all duration-75" style={{ width:`${hoverVid*5}%` }}/>
                    </div>
                  </div>
                  <div className="mt-2 pt-1.5 border-t border-white/[0.07] flex items-center justify-between">
                    <span className="text-white/45 text-[9px]">종합</span>
                    <span className="text-accent-purple text-[12px] font-bold">
                      {hoverTotal}<span className="text-white/25 text-[9px] font-normal">/100</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex mt-1">
                <div style={{width:'22px',flexShrink:0}}/>
                <div className="flex flex-1 justify-between text-[10px] text-white/25">
                  {['00:00:00','01:45:00','03:30:00','05:15:00'].map(t => <span key={t}>{t}</span>)}
                  <span className="inline-flex items-center gap-0.5 text-accent-purple/70">
                    <span className="w-1 h-1 rounded-full bg-accent-purple/80 animate-pulse flex-shrink-0"/>LIVE
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
        )}

        {!selectedLogClip && (
        <Card className="flex-shrink-0">
          <div className="flex items-center justify-between px-3 pt-2.5 pb-2 border-b border-white/[0.06]">
            <div className="flex items-center gap-1.5">
              <span className="text-white/55 text-[11px] font-semibold">AI 분석 로그</span>
              {!animDone && !selectedLogClip && (
                <span className="flex items-center gap-1 text-[8px] text-green-400/70">
                  <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse flex-shrink-0"/>실시간
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white/25 text-[9px]">{filteredLogs.length}개 이벤트</span>
            </div>
          </div>
          <div ref={logScrollRef}
            className="h-[90px] overflow-y-auto [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-accent-purple/25 [&::-webkit-scrollbar-track]:bg-transparent">
            {filteredLogs.map((log, i) => {
              const isHighlighted = false
              return (
                <motion.div key={i}
                  initial={{ opacity:0, x:-8 }}
                  animate={{ opacity:1, x:0 }}
                  transition={{ duration:0.25 }}
                  className={`flex items-start gap-2 px-3 py-1.5 border-b border-white/[0.03] transition-colors ${
                    isHighlighted ? 'bg-accent-purple/[0.06]' : 'hover:bg-white/[0.02]'
                  }`}>
                  <span className="text-white/20 text-[9px] font-mono flex-shrink-0 mt-px w-[52px]">{log.time}</span>
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${
                    log.type==='chat' ? 'bg-cyan-400' :
                    log.type==='detect' ? 'bg-accent-purple' :
                    log.type==='extract' ? 'bg-green-400' : 'bg-white/25'
                  }`}/>
                  <span className={`text-[10px] leading-relaxed ${
                    log.type==='chat' ? 'text-cyan-400/75' :
                    log.type==='detect' ? (isHighlighted ? 'text-accent-purple' : 'text-accent-purple/80') :
                    log.type==='extract' ? (isHighlighted ? 'text-green-400' : 'text-green-400/80') : 'text-white/35'
                  }`}>{log.msg}</span>
                </motion.div>
              )
            })}
            {!animDone && (
              <div className="flex items-center gap-2 px-3 py-1.5">
                <span className="text-white/15 text-[9px] font-mono w-[52px]">──:──:──</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/15 flex-shrink-0"/>
                <span className="text-white/20 text-[10px]">분석 진행 중</span>
                <span className="flex gap-0.5 ml-1">
                  {[0,1,2].map(i => (
                    <span key={i} className="w-1 h-1 rounded-full bg-white/20 animate-bounce"
                      style={{ animationDelay:`${i*0.15}s` }}/>
                  ))}
                </span>
              </div>
            )}
            {!selectedLogClip && (
              <div className="px-3 py-1.5 border-t border-white/[0.04]">
                <span className="text-white/20 text-[9px]">아래 클립을 선택하면 관련 로그와 <span className="text-accent-purple/50 font-semibold">상세 분석</span>을 볼 수 있습니다</span>
              </div>
            )}
          </div>
        </Card>
        )}

        {/* 실시간 감지된 클립 */}
        <div className="flex-shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-white/55 text-[11px] font-semibold">실시간 감지된 클립</span>
            <span className="text-accent-purple text-[10px] font-bold bg-accent-purple/15 px-1.5 py-px rounded-full">
              {detectedClips.length}개
            </span>
            {!animDone && (
              <span className="flex items-center gap-1 text-[9px] text-orange-400/80 bg-orange-500/10 border border-orange-500/20 px-2 py-px rounded-full">
                <span className="w-1 h-1 rounded-full bg-orange-400 animate-ping flex-shrink-0"/>분석 진행 중
              </span>
            )}
            <span className="text-white/25 text-[10px] font-normal ml-auto">클릭하면 상세 정보를 볼 수 있습니다</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1.5 [&::-webkit-scrollbar]:h-[3px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-accent-purple/30 [&::-webkit-scrollbar-track]:bg-transparent">
            {detectedClips.map(clip => {
              const stage   = getClipStage(clip.pos, progress)
              const encPct  = getEncodingPct(clip.pos, progress)
              const isSel   = selLogClipRank === clip.rank
              const isHov   = hoveredClip === clip.rank
              return (
                <motion.div
                  key={clip.rank}
                  initial={{ opacity:0, y:14, scale:0.9 }}
                  animate={{ opacity:1, y:0, scale:1 }}
                  transition={{ duration:0.38, ease:[0.22,1,0.36,1] }}
                  onMouseEnter={() => setHoveredClip(clip.rank)}
                  onMouseLeave={() => setHoveredClip(null)}
                  onClick={() => { setSelectedLogClip(prev => prev?.rank === clip.rank ? null : clip) }}
                  className={`flex-shrink-0 w-[118px] bg-white/[0.04] rounded-xl border transition-all cursor-pointer flex flex-col ${
                    isSel
                      ? 'border-accent-purple/65 shadow-lg shadow-accent-purple/15 -translate-y-px'
                      : isHov
                        ? 'border-accent-purple/40 shadow-md shadow-accent-purple/10 -translate-y-px'
                        : 'border-white/[0.07] hover:border-white/15'
                  }`}
                >
                  <div className="rounded-t-xl overflow-hidden relative flex-shrink-0"
                    style={{aspectRatio:'16/9', background:'#0a0a14'}}>
                    <img src={THUMB_IMGS[(clip.rank-1)%THUMB_IMGS.length]} alt={clip.title}
                      className="absolute inset-0 w-full h-full object-cover" draggable={false}/>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                        isHov ? 'bg-accent-purple/70 border-accent-purple' : 'bg-white/20 border-white/25'
                      }`}>
                        <Play size={9} className="text-white ml-0.5" fill="white"/>
                      </div>
                    </div>
                    <div className="absolute top-1 left-1 bg-black/55 text-yellow-400 text-[8px] font-bold px-1 py-px rounded">
                      #{clip.rank}
                    </div>
                    {stage === 'done' && (
                      <div className="absolute top-1 right-1 bg-accent-purple text-white text-[8px] font-bold px-1 py-px rounded">
                        {clip.score}점
                      </div>
                    )}
                    {stage !== 'done' && (
                      <>
                        <div className="absolute inset-0 overflow-hidden rounded-t-xl pointer-events-none">
                          <div className="absolute left-0 right-0 h-px opacity-60"
                            style={{background:'linear-gradient(to right,transparent,#06b6d4,transparent)',
                              animation:'scanline 1.8s linear infinite', top:'0%'}}/>
                        </div>
                        <div className={`absolute top-1 right-1 flex items-center gap-0.5 text-white text-[7px] font-bold px-1.5 py-px rounded-full ${
                          stage==='detecting'  ? 'bg-yellow-500/80' :
                          stage==='segmenting' ? 'bg-orange-500/80' : 'bg-cyan-500/80'
                        }`}>
                          <span className="w-1 h-1 rounded-full bg-white animate-pulse"/>
                          {stage==='detecting'?'분석':stage==='segmenting'?'확정':'인코딩'}
                        </div>
                      </>
                    )}
                    <div className="absolute bottom-1 left-1 bg-black/60 text-white/65 text-[7px] px-1 py-px rounded">{clip.dur}</div>
                  </div>
                  <div className="px-1.5 pt-1.5 pb-2 flex flex-col gap-1 flex-1">
                    <div className="text-white/80 text-[9px] font-semibold leading-tight line-clamp-2">{clip.title}</div>
                    {stage === 'done' ? (
                      <div className="flex flex-wrap gap-0.5 mt-auto">
                        {(clipTags[clip.rank] ?? []).slice(0,2).map((tag, ti) => (
                          <span key={tag+ti} className="text-[7px] text-accent-purple/70 bg-accent-purple/10 px-1 py-px rounded-full border border-accent-purple/20">{tag}</span>
                        ))}
                        {(clipTags[clip.rank] ?? []).length > 2 && (
                          <span className="text-[7px] text-white/25">+{(clipTags[clip.rank] ?? []).length - 2}</span>
                        )}
                      </div>
                    ) : (
                      <div className="mt-auto">
                        <div className="h-1 bg-white/[0.07] rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${stage !== 'encoding' ? 'transition-all duration-700' : ''} ${
                            stage==='detecting'?'bg-yellow-400/60':stage==='segmenting'?'bg-orange-400/70':'bg-cyan-400/70'
                          }`} style={{width:`${stage==='detecting'?8:stage==='segmenting'?38:encPct}%`}}/>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

    </PageWrap>
  )
}


// ══════════════════════════════════════════════════════════
// PAGE 3: 방송 & 클립 (방송 이력 + 클립 관리 통합)
// ══════════════════════════════════════════════════════════
function ClipsPage({ onNav, initialOpenClip }: { onNav: (nav: UploadNav) => void; initialOpenClip?: Clip | null }) {
  const [viewTab,       setViewTab]       = useState<'broadcast'|'clips'>('clips')
  const [openFilter,    setOpenFilter]    = useState<string | null>(null)
  const [openMenu,      setOpenMenu]      = useState<number | null>(null)
  const [activeFilters, setActiveFilters] = useState<Record<string,string>>({})
  const [selectedClip,  setSelectedClip]  = useState<Clip | null>(null)
  const [sortBy,        setSortBy]        = useState<'score'|'date'>('score')

  // 재분석 진입 시 해당 클립 모달 자동 오픈
  useEffect(() => {
    if (!initialOpenClip) return
    setViewTab('clips')
    setSelectedClip(initialOpenClip)
  }, [initialOpenClip])
  const [sortOrder,     setSortOrder]     = useState<'desc'|'asc'>('desc')
  const [dateFrom,      setDateFrom]      = useState<string>('전체')
  const [dateTo,        setDateTo]        = useState<string>('전체')
  const [calYear,       setCalYear]       = useState(2025)
  const [calMonth,      setCalMonth]      = useState(5)

  const broadcasts = [
    { date:'2025.05.29', title:'리그 오브 레전드 | 플래 탈출 도전기 EP.8 🎯', platform:'SOOP',   dur:'진행 중', viewers:'11,203', clips:6,  status:'방송중' },
    { date:'2025.05.27', title:'발로란트 마스터 도전기 EP.12',                  platform:'치지직', dur:'7:03:15',  viewers:'13,204', clips:6,  status:'완료'   },
    { date:'2025.05.25', title:'📻 자기 전에 잠깐 EP.15 | 이번 주 있었던 일',  platform:'치지직', dur:'2:45:30',  viewers:'8,941',  clips:4,  status:'완료'   },
  ]

  const filterDefs = [
    { id:'genre',    label:'장르', opts:['전체','리그오브레전드','발로란트','보이는라디오'] },
    { id:'platform', label:'플랫폼',   opts:['전체','치지직','SOOP'] },
    { id:'score',    label:'점수 범위', opts:['전체','90~100점','80~89점','70~79점','60~69점'] },
  ]

  const scoreRanges: Record<string,[number,number]> = {
    '90~100점':[90,100], '80~89점':[80,89], '70~79점':[70,79], '60~69점':[60,69]
  }

  // 전체 클립 (라이브 + 이력)
  const ALL_HISTORY_CLIPS = [...ALL_CLIPS, ...VALO_CLIPS, ...RADIO_CLIPS]

  // 실제 필터링 + 정렬
  const displayClips = ALL_HISTORY_CLIPS
    .filter(clip => {
      const f = activeFilters
      if (dateFrom !== '전체' && clip.date < dateFrom) return false
      if (dateTo   !== '전체' && clip.date > dateTo)   return false
      if (f.genre    && f.genre    !== '전체' && clip.genre    !== f.genre)    return false
      if (f.platform && f.platform !== '전체' && clip.platform !== f.platform) return false
      if (f.score    && f.score    !== '전체') {
        const [min,max] = scoreRanges[f.score]
        if (clip.score < min || clip.score > max) return false
      }
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'score') return sortOrder === 'desc' ? b.score - a.score : a.score - b.score
      // 날짜 정렬 ('05.27' > '05.25' > '05.23')
      const cmp = a.date.localeCompare(b.date)
      return sortOrder === 'desc' ? -cmp : cmp
    })

  const dateRangeActive   = dateFrom !== '전체' || dateTo !== '전체'
  const activeFilterCount = Object.values(activeFilters).filter(v => v && v !== '전체').length + (dateRangeActive ? 1 : 0)

  const closeAll = () => { setOpenFilter(null);  }

  const handleSortClick = (by: 'score'|'date') => {
    if (sortBy === by) setSortOrder(o => o === 'desc' ? 'asc' : 'desc')
    else { setSortBy(by); setSortOrder('desc') }
  }

  // ── 달력 헬퍼 ──
  const CAL_MONTHS   = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const calDaysInMon = new Date(calYear, calMonth, 0).getDate()
  const calFirstDow  = new Date(calYear, calMonth - 1, 1).getDay()
  const calToDot     = (m: number, d: number) => `${String(m).padStart(2,'0')}.${String(d).padStart(2,'0')}`
  const calCells: (number|null)[] = [
    ...Array(calFirstDow).fill(null),
    ...Array.from({length: calDaysInMon}, (_, i) => i + 1),
  ]
  while (calCells.length % 7 !== 0) calCells.push(null)

  const prevCalMonth = () => { if(calMonth===1){setCalMonth(12);setCalYear(y=>y-1)}else setCalMonth(m=>m-1) }
  const nextCalMonth = () => { if(calMonth===12){setCalMonth(1);setCalYear(y=>y+1)}else setCalMonth(m=>m+1) }
  const handleCalDay = (dot: string) => {
    if (dateFrom==='전체' || (dateFrom!=='전체' && dateTo!=='전체')) {
      setDateFrom(dot); setDateTo('전체')
    } else {
      if (dot >= dateFrom) { setDateTo(dot) } else { setDateTo(dateFrom); setDateFrom(dot) }
      setOpenFilter(null)
    }
  }

  return (
    <PageWrap>
      {/* 헤더 + 탭 */}
      <div className="px-5 pt-4 pb-0 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-white font-bold text-sm">방송 & 클립</h3>
            <p className="text-white/35 text-[11px]">
              {viewTab === 'clips'
                ? displayClips.length < ALL_HISTORY_CLIPS.length
                  ? <><span className="text-accent-purple font-semibold">{displayClips.length}</span>/{ALL_HISTORY_CLIPS.length}개 클립</>
                  : <>총 {ALL_HISTORY_CLIPS.length}개 클립</>
                : `총 ${broadcasts.length}회 방송`}
            </p>
          </div>
          {viewTab === 'clips' && (
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-white/[0.04] border border-white/[0.08] rounded-lg overflow-hidden">
                {([['score','점수순'],['date','날짜순']] as [typeof sortBy, string][]).map(([by, label]) => (
                  <button key={by} onClick={() => handleSortClick(by)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 text-[10px] transition-colors ${
                      sortBy===by ? 'text-accent-purple bg-accent-purple/15 font-semibold' : 'text-white/35 hover:text-white/55'
                    }`}>
                    {label}{sortBy===by && <span className="text-[9px] leading-none">{sortOrder==='desc'?'↓':'↑'}</span>}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1.5 bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-1.5">
                <Search size={11} className="text-white/30"/>
                <input className="bg-transparent text-white/60 text-[11px] outline-none w-24 placeholder:text-white/25"
                  placeholder="클립 검색..." readOnly/>
              </div>
            </div>
          )}
        </div>
        {/* 탭 */}
        <div className="flex gap-1 border-b border-white/[0.07]">
          {([['clips','클립 관리'],['broadcast','방송 이력']] as ['clips'|'broadcast', string][]).map(([tab, label]) => (
            <button key={tab} onClick={() => setViewTab(tab)}
              className={`px-4 py-2 text-xs font-semibold transition-colors border-b-2 -mb-px ${
                viewTab===tab ? 'text-accent-purple border-accent-purple' : 'text-white/35 border-transparent hover:text-white/55'
              }`}>{label}</button>
          ))}
        </div>
      </div>

      {/* 방송 이력 탭 */}
      {viewTab === 'broadcast' && (
        <div className="flex-1 px-5 pt-3 pb-4 flex flex-col gap-3 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-accent-purple/30 [&::-webkit-scrollbar-track]:bg-transparent">
          <div className="grid grid-cols-3 gap-3 flex-shrink-0">
            {([
              { label:'이번 달 총 방송 시간', value:'26h 48m', color:'text-cyan-400'   },
              { label:'최고 동시 시청자',     value:'13,204명', color:'text-purple-400' },
              { label:'평균 방송 시간',       value:'5h 22m',  color:'text-green-400'  },
            ] as {label:string;value:string;color:string}[]).map(s => (
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
                    <tr key={b.date+b.title} className="border-b border-white/[0.04] hover:bg-white/[0.02] cursor-pointer"
                      onClick={() => { const d = b.date.slice(5); setViewTab('clips'); setActiveFilters({}); setDateFrom(d); setDateTo(d) }}>
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
                      <td className="px-4 py-2.5">
                        {b.status === '방송중'
                          ? <span className="flex items-center gap-1 text-red-400 bg-red-500/10 px-2 py-px rounded-full w-fit text-[9px]">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping flex-shrink-0"/>방송중
                            </span>
                          : <span className="text-green-400/80 bg-green-500/10 px-2 py-px rounded-full">{b.status}</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* 클립 관리 탭 */}
      {viewTab === 'clips' && <>
      {/* 필터 바 */}
      <div className="px-5 pt-2 pb-2 flex-shrink-0" onClick={closeAll}>
        <div className="flex items-center gap-2">
          <Filter size={10} className={`flex-shrink-0 ${activeFilterCount > 0 ? 'text-accent-purple/70' : 'text-white/30'}`}/>

          {/* 날짜 범위 필터 */}
          <div className="relative" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setOpenFilter(openFilter === 'dateRange' ? null : 'dateRange')}
              className={`flex items-center gap-1.5 text-[10px] px-2.5 py-1.5 rounded-lg border transition-colors ${
                dateRangeActive
                  ? 'text-accent-purple border-accent-purple/40 bg-accent-purple/10'
                  : 'text-white/40 border-white/[0.08] bg-white/[0.03] hover:text-white/60'
              }`}
            >
              {dateRangeActive
                ? `${dateFrom === '전체' ? '전체' : dateFrom} ~ ${dateTo === '전체' ? '전체' : dateTo}`
                : '방송 날짜'}
              <ChevronDown size={8} className={`transition-transform ${openFilter==='dateRange'?'rotate-180':''}`}/>
            </button>
            {openFilter === 'dateRange' && (
              <div className="absolute left-0 top-full mt-1 z-30 rounded-xl shadow-2xl overflow-hidden"
                style={{background:'#131325', border:'1px solid rgba(255,255,255,0.12)', width:'240px'}}>

                {/* 선택된 날짜 표시 */}
                <div className="flex items-center gap-2 px-3 pt-3 pb-2.5 border-b border-white/[0.07]">
                  <div className={`flex-1 text-center text-[9px] font-mono px-2 py-1.5 rounded-lg border ${
                    dateFrom !== '전체'
                      ? 'text-white/80 border-accent-purple/45 bg-accent-purple/10'
                      : 'text-white/20 border-white/[0.07] bg-white/[0.03]'
                  }`}>
                    {dateFrom !== '전체' ? `2025.${dateFrom}` : '시작일'}
                  </div>
                  <span className="text-white/20 text-[9px] flex-shrink-0">~</span>
                  <div className={`flex-1 text-center text-[9px] font-mono px-2 py-1.5 rounded-lg border ${
                    dateTo !== '전체'
                      ? 'text-white/80 border-accent-purple/45 bg-accent-purple/10'
                      : 'text-white/20 border-white/[0.07] bg-white/[0.03]'
                  }`}>
                    {dateTo !== '전체' ? `2025.${dateTo}` : '종료일'}
                  </div>
                </div>

                {/* 월 헤더 */}
                <div className="flex items-center justify-between px-4 py-2" style={{background:'#7c3aed'}}>
                  <button onClick={prevCalMonth}
                    className="text-white/70 hover:text-white text-[11px] transition-colors w-5 h-5 flex items-center justify-center rounded hover:bg-white/10">
                    ◀
                  </button>
                  <span className="text-white text-[10px] font-bold tracking-wide">
                    {CAL_MONTHS[calMonth - 1]} {calYear}
                  </span>
                  <button onClick={nextCalMonth}
                    className="text-white/70 hover:text-white text-[11px] transition-colors w-5 h-5 flex items-center justify-center rounded hover:bg-white/10">
                    ▶
                  </button>
                </div>

                {/* 요일 헤더 */}
                <div className="grid grid-cols-7 px-2 pt-2 pb-1">
                  {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
                    <div key={d} className="text-center text-[8px] text-white/30 font-semibold">{d}</div>
                  ))}
                </div>

                {/* 날짜 그리드 */}
                <div className="grid grid-cols-7 px-2 pb-3 gap-y-0.5">
                  {calCells.map((day, idx) => {
                    if (!day) return <div key={`e${idx}`}/>
                    const dot    = calToDot(calMonth, day)
                    const isFrom = dot === dateFrom
                    const isTo   = dot === dateTo
                    const inRng  = dateFrom !== '전체' && dateTo !== '전체' && dot > dateFrom && dot < dateTo
                    return (
                      <button
                        key={day}
                        onClick={() => handleCalDay(dot)}
                        className={`flex items-center justify-center h-6 text-[9px] transition-all rounded-full ${
                          isFrom || isTo
                            ? 'bg-accent-purple text-white font-bold shadow-lg'
                            : inRng
                              ? 'bg-accent-purple/20 text-accent-purple/80 rounded-none'
                              : 'text-white/55 hover:bg-white/[0.08] hover:text-white/80'
                        }`}
                      >
                        {day}
                      </button>
                    )
                  })}
                </div>

                {/* 초기화 */}
                {dateRangeActive && (
                  <div className="px-3 pb-2.5 pt-1 border-t border-white/[0.06]">
                    <button
                      onClick={() => { setDateFrom('전체'); setDateTo('전체') }}
                      className="w-full text-[9px] text-white/30 hover:text-white/60 transition-colors">
                      선택 초기화
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

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
          {/* 필터 초기화 */}
          {activeFilterCount > 0 && (
            <button
              onClick={() => { setActiveFilters({}); setDateFrom('전체'); setDateTo('전체'); closeAll() }}
              className="flex items-center gap-1 text-[10px] text-white/35 hover:text-white/60 transition-colors ml-auto"
            >
              <RotateCcw size={9}/> 초기화
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 px-5 pb-4 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-accent-purple/30 [&::-webkit-scrollbar-track]:bg-transparent" onClick={closeAll}>
        {displayClips.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-2 text-white/20">
            <Filter size={28}/>
            <p className="text-[12px]">조건에 맞는 클립이 없습니다</p>
            <button
              onClick={() => { setActiveFilters({}); setDateFrom('전체'); setDateTo('전체') }}
              className="text-[11px] text-accent-purple/70 hover:text-accent-purple transition-colors mt-1"
            >필터 초기화</button>
          </div>
        ) : (
        <div className="grid grid-cols-4 gap-2">
          {displayClips.map(clip => (
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
              </div>

              {/* Info */}
              <div className="px-2 pt-1.5 pb-2 flex flex-col gap-1">
                {/* 제목 + ··· */}
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
                          { icon:Upload,    label:'업로드',         color:'text-white/60',   nav: 'upload' as const },
                          { icon:Download,  label:'내보내기',       color:'text-white/60',   nav: 'export' as const },
                          { icon:RotateCcw, label:'이 클립 재분석', color:'text-white/60',   nav: null },
                          { icon:Trash2,    label:'삭제',           color:'text-red-400/70', nav: null },
                        ].map(({ icon:Icon, label, color, nav }) => (
                          <button key={label}
                            onClick={() => { if (nav) { closeAll(); onNav({ rank: clip.rank, tab: nav }) } }}
                            className={`flex items-center gap-2 w-full px-3 py-1.5 text-[10px] ${color} hover:bg-white/[0.05] transition-colors`}>
                            <Icon size={9}/>{label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {/* 태그 */}
                <div className="flex flex-wrap gap-1">
                  {clip.tags.map(t => (
                    <span key={t} className="text-[8px] text-accent-purple/70 bg-accent-purple/10 px-1.5 py-px rounded-full">{t}</span>
                  ))}
                </div>
                {/* 시간 범위 */}
                <div className="flex items-center gap-1 text-[8px]">
                  <span className="text-white/40">{clip.time.split('–')[0]}</span>
                  <span className="text-white/20">~</span>
                  <span className="text-white/40">{clip.time.split('–')[1]}</span>
                </div>
                {/* 날짜 · 플랫폼 */}
                <div className="flex items-center gap-1">
                  <span className="text-white/25 text-[8px]">{clip.date}</span>
                  <span className="text-white/15 text-[8px]">·</span>
                  <span className={`text-[8px] px-1.5 py-px rounded-full font-medium ${
                    clip.platform==='치지직' ? 'text-green-400/70 bg-green-500/10' : 'text-orange-400/70 bg-orange-500/10'
                  }`}>{clip.platform}</span>
                </div>
                {/* 종합 점수 */}
                <div className="flex items-center justify-between">
                  <span className="text-white/25 text-[8px]">종합 점수</span>
                  <span className="font-bold text-[10px] text-accent-purple/80 group-hover:text-accent-purple transition-colors">{clip.score}점</span>
                </div>
                {/* 타임라인 바 — start/end 두 점 */}
                {(() => {
                  const { startPct, endPct } = parseClipPos(clip.time)
                  const segW = Math.max(endPct - startPct, 0.9)
                  return (
                    <div>
                      <div className="flex justify-between text-[7px] text-white/20 mb-0.5">
                        <span>0:00</span>
                        <span className="text-accent-purple/55">{clip.time.split('–')[0]}</span>
                        <span>7:03</span>
                      </div>
                      <div className="relative h-1 bg-white/[0.08] rounded-full">
                        <div className="absolute inset-y-0 left-0 rounded-full bg-white/[0.05]"
                          style={{width:`${startPct}%`}}/>
                        <div className="absolute inset-y-0 rounded-full bg-accent-purple/75"
                          style={{left:`${startPct}%`,width:`${segW}%`,boxShadow:'0 0 5px rgba(124,58,237,.9)'}}/>
                        <div className="absolute top-1/2 w-1.5 h-1.5 rounded-full bg-accent-purple"
                          style={{left:`${startPct}%`,transform:'translate(-50%,-50%)',boxShadow:'0 0 4px rgba(124,58,237,1)'}}/>
                        <div className="absolute top-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400"
                          style={{left:`${startPct+segW}%`,transform:'translate(-50%,-50%)',boxShadow:'0 0 4px rgba(6,182,212,.8)'}}/>
                      </div>
                    </div>
                  )
                })()}
              </div>
            </div>
          ))}
        </div>
        )}
      </div>

      </>}

      <AnimatePresence>
        {selectedClip && (
          <ClipDetailModal clip={selectedClip} onClose={() => setSelectedClip(null)} onNav={onNav}/>
        )}
      </AnimatePresence>
    </PageWrap>
  )
}

// ══════════════════════════════════════════════════════════
// PAGE 4: 업로드 & 내보내기
// ══════════════════════════════════════════════════════════
function UploadPage({ initialNav }: { initialNav: UploadNav | null }) {
  const [activeTab,           setActiveTab]           = useState<'upload'|'export'>('upload')
  const [selectedBroadcast,   setSelectedBroadcast]   = useState<string | null>(null)
  const [selectedClips,       setSelectedClips]       = useState(new Set<number>([1]))
  const [clipTitles,          setClipTitles]          = useState<Record<number,number>>({1:0})
  const [clipTags,            setClipTags]            = useState<Record<number,Set<number>>>({1: new Set([0,1,2,3,4,5])})
  const [selectedPlatforms,   setSelectedPlatforms]   = useState(new Set(['YouTube','치지직']))
  const [exportRatio,         setExportRatio]         = useState('16:9')
  const [exportSelected,      setExportSelected]      = useState(new Set<number>([1,2]))
  const [exportFormat,        setExportFormat]        = useState('MP4')

  const broadcastClipMap: Record<string, Clip[]> = {
    '05.29': ALL_CLIPS,
    '05.27': VALO_CLIPS,
    '05.25': RADIO_CLIPS,
  }

  const BROADCAST_CARDS = [
    {
      id: '05.29', thumb: imgLol01,   date: '2025.05.29',
      typeIcon: '🎮', typeLabel: '리그 오브 레전드',
      title: '리그 오브 레전드 | 플래 탈출 도전기 EP.8',
      platform: 'SOOP',    platformCls: 'text-orange-400/80 bg-orange-500/10',
      clips: ALL_CLIPS.length,  statusLive: true,
    },
    {
      id: '05.27', thumb: imgValo01,  date: '2025.05.27',
      typeIcon: '🎮', typeLabel: '발로란트',
      title: '발로란트 마스터 도전기 EP.12',
      platform: '치지직', platformCls: 'text-green-400/80 bg-green-500/10',
      clips: VALO_CLIPS.length, statusLive: false,
    },
    {
      id: '05.25', thumb: imgRadio01, date: '2025.05.25',
      typeIcon: '📻', typeLabel: '보이는 라디오',
      title: '자기 전에 잠깐 EP.15',
      platform: '치지직', platformCls: 'text-green-400/80 bg-green-500/10',
      clips: RADIO_CLIPS.length, statusLive: false,
    },
  ]

  // 다른 페이지 ··· 메뉴에서 이동 시 클립 자동 선택
  useEffect(() => {
    if (!initialNav) return
    const { rank, tab } = initialNav
    setActiveTab(tab)
    // 클립 rank 기반으로 방송 자동 선택
    const broadcastId = ALL_CLIPS.find(c => c.rank === rank) ? '05.29'
      : VALO_CLIPS.find(c => c.rank === rank) ? '05.27' : '05.25'
    setSelectedBroadcast(broadcastId)
    if (tab === 'upload') {
      setSelectedClips(new Set([rank]))
      setClipTitles({ [rank]: 0 })
    } else {
      setExportSelected(new Set([rank]))
    }
  }, [initialNav])

  const platforms = [
    { name:'YouTube', color:'#ff0000', icon:'▶', connected:true  },
    { name:'TikTok',  color:'#69c9d0', icon:'♪', connected:false },
    { name:'치지직',  color:'#00d564', icon:'◈', connected:true  },
    { name:'SOOP',    color:'#ff6b35', icon:'◉', connected:true  },
  ]
  const uploadClips = selectedBroadcast ? (broadcastClipMap[selectedBroadcast] ?? []) : []
  const connectedNames = platforms.filter(p => p.connected).map(p => p.name)
  const exportClips = selectedBroadcast ? (broadcastClipMap[selectedBroadcast] ?? []).slice(0,4) : ALL_CLIPS.slice(0,4)

  // 클립별 AI 추천 제목 2개
  const getAiTitles = (clip: Clip) => [
    `${clip.title} — ${clip.genre} 하이라이트`,
    `이 순간이 바로 클립각! ${clip.title}`,
  ]

  // 클립별 AI 추천 태그 풀 — 최대 5개
  const getAiTagPool = (clip: Clip) => {
    const base = [`#${clip.genre}`, '#하이라이트', `#${clip.platform}`, '#게임클립', '#클립']
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
        <div className="flex items-center gap-2">
          {selectedBroadcast && (
            <button
              onClick={() => setSelectedBroadcast(null)}
              className="flex items-center gap-1 text-white/35 hover:text-white/65 transition-colors text-[11px]"
            >
              <ChevronDown size={12} className="rotate-90"/> 뒤로
            </button>
          )}
          <div>
            <h3 className="text-white font-bold text-sm">업로드 & 내보내기</h3>
            <p className="text-white/35 text-[11px]">
              {selectedBroadcast
                ? BROADCAST_CARDS.find(b => b.id === selectedBroadcast)?.title
                : '방송을 선택해 클립을 업로드하세요'}
            </p>
          </div>
        </div>
        {selectedBroadcast && (
          <div className="flex gap-1 mt-3 border-b border-white/[0.07]">
            {(['upload','export'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs font-semibold transition-colors border-b-2 -mb-px ${
                  activeTab===tab ? 'text-accent-purple border-accent-purple' : 'text-white/35 border-transparent hover:text-white/55'
                }`}
              >{tab==='upload'?'업로드':'내보내기'}</button>
            ))}
          </div>
        )}
      </div>

      {/* 방송 선택 화면 */}
      {!selectedBroadcast && (
        <div className="flex-1 px-5 pt-4 pb-4 flex flex-col gap-3 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-accent-purple/35 [&::-webkit-scrollbar-track]:bg-transparent">
          <div className="grid grid-cols-3 gap-3">
            {BROADCAST_CARDS.map(b => (
              <motion.button
                key={b.id}
                onClick={() => setSelectedBroadcast(b.id)}
                whileHover={{ scale:1.02 }}
                whileTap={{ scale:0.98 }}
                className="bg-white/[0.04] rounded-xl border border-white/[0.07] hover:border-accent-purple/40 transition-all text-left overflow-hidden flex flex-col"
              >
                {/* 정사각형 썸네일 */}
                <div className="relative w-full" style={{ aspectRatio:'1/1' }}>
                  <img src={b.thumb} alt={b.title}
                    className="absolute inset-0 w-full h-full object-cover"/>
                  {/* 상태 뱃지 */}
                  <div className="absolute top-2 left-2">
                    {b.statusLive
                      ? <span className="flex items-center gap-1 text-[8px] text-red-400 bg-black/60 px-1.5 py-0.5 rounded-full backdrop-blur-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"/>LIVE
                        </span>
                      : <span className="text-[8px] text-green-400/80 bg-black/60 px-1.5 py-0.5 rounded-full backdrop-blur-sm">완료</span>
                    }
                  </div>
                  {/* 클립 수 */}
                  <div className="absolute bottom-2 right-2">
                    <span className="text-[8px] text-white/70 bg-black/60 px-1.5 py-0.5 rounded-full backdrop-blur-sm">
                      {b.clips}개 클립
                    </span>
                  </div>
                </div>

                {/* 카드 정보 */}
                <div className="p-2.5 flex flex-col gap-1.5 flex-1">
                  {/* 타입 + 플랫폼 태그 */}
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="text-[8px] text-white/50 bg-white/[0.06] px-1.5 py-px rounded-full">
                      {b.typeIcon} {b.typeLabel}
                    </span>
                    <span className={`text-[8px] px-1.5 py-px rounded-full font-medium ${b.platformCls}`}>
                      {b.platform}
                    </span>
                  </div>
                  {/* 날짜 */}
                  <div className="text-white/30 text-[9px]">{b.date}</div>
                  {/* 제목 */}
                  <div className="text-white/75 text-[10px] font-semibold leading-snug line-clamp-2">{b.title}</div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {selectedBroadcast && activeTab === 'upload' ? (
        <div className="flex-1 px-5 pt-3 pb-4 flex flex-col gap-3 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-accent-purple/35 [&::-webkit-scrollbar-track]:bg-transparent">

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
      ) : selectedBroadcast && (
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
// PAGE 5: 성과 분석
// ══════════════════════════════════════════════════════════
function PerformancePage() {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null)
  const [showAll,    setShowAll]    = useState(false)

  const fmtN = (n: number) =>
    n >= 1_000_000 ? `${(n/1_000_000).toFixed(1)}M`
    : n >= 1_000   ? `${(n/1_000).toFixed(0)}K`
    : `${n}`

  const platforms = [
    { name:'YouTube', icon:'▶', color:'#ff0000', clips:12, views:850_000, likes:18_200, pct:65.4 },
    { name:'TikTok',  icon:'♪', color:'#69c9d0', clips:8,  views:250_000, likes:4_200,  pct:19.2 },
    { name:'치지직',  icon:'◈', color:'#00d564', clips:15, views:120_000, likes:1_100,  pct:9.2  },
    { name:'SOOP',    icon:'◉', color:'#ff6b35', clips:5,  views:45_000,  likes:890,    pct:3.5  },
  ]
  const totalViews = platforms.reduce((s,p) => s+p.views, 0)
  const totalLikes = platforms.reduce((s,p) => s+p.likes, 0)
  const totalClips = platforms.reduce((s,p) => s+p.clips, 0)

  // 멀티라인 차트 데이터
  const weekDays = ['월','화','수','목','금','토','일']
  const weeklyData: Record<string,number[]> = {
    YouTube: [55,72,68,85,92,112,88],
    TikTok:  [35,48,42,58,65,78,62],
    '치지직': [28,34,30,42,45,52,40],
    SOOP:    [8,12,10,16,18,22,18],
  }
  const platColors: Record<string,string> = {
    YouTube:'#ff0000', TikTok:'#69c9d0', '치지직':'#00d564', SOOP:'#ff6b35',
  }
  const CHART_MAX = 140

  // 도넛 차트 계산
  const donutR = 32, donutSW = 9, donutCircum = 2 * Math.PI * donutR
  let _cum = 0
  const donutSlices = platforms.map(p => {
    const pct = p.views / totalViews
    const slice = { color:p.color, pct, rotation: _cum * 360 - 90 }
    _cum += pct
    return slice
  })

  // KPI 스파크라인 데이터
  const kpiCards = [
    { label:'총 조회수',   icon:'👁', value:fmtN(totalViews),                        growth:'+23%', color:'#7c3aed', gid:'v', d:[820,950,880,1100,1050,1250,1300] },
    { label:'총 좋아요',   icon:'♡',  value:fmtN(totalLikes),                        growth:'+18%', color:'#f43f5e', gid:'l', d:[180,220,200,280,260,300,240]      },
    { label:'업로드 클립', icon:'⬆',  value:`${totalClips}개`,                       growth:'+12%', color:'#3b82f6', gid:'c', d:[32,35,34,37,38,40,40]             },
    { label:'평균 조회수', icon:'↗',  value:fmtN(Math.round(totalViews/totalClips)), growth:'+15%', color:'#06b6d4', gid:'a', d:[28,30,29,32,30,33,32]             },
  ]

  // 상위 클립 데이터
  const allTopClips = [
    { rank:1, title:'극적인 역전 순간!',  platform:'YouTube', pColor:'#ff0000', views:312_000, likes:8_400, daysAgo:1, score:98, dur:'00:45', sp:[10,18,28,42,38,52,46,58,54,60,56,62] },
    { rank:2, title:'보조킬 완벽 타이밍',platform:'TikTok',  pColor:'#69c9d0', views:187_000, likes:3_200, daysAgo:1, score:92, dur:'00:38', sp:[5,10,16,24,22,30,28,36,34,40,38,42]  },
    { rank:3, title:'연속 킬 폭발!',     platform:'YouTube', pColor:'#ff0000', views:143_000, likes:4_100, daysAgo:0, score:94, dur:'00:51', sp:[8,14,20,18,26,30,28,34,36,40,42,44]  },
    { rank:1, title:'극적인 역전 순간!',  platform:'치지직',  pColor:'#00d564', views:98_000,  likes:820,   daysAgo:1, score:90, dur:'00:47', sp:[4,8,12,16,14,20,18,24,26,28,30,34]   },
    { rank:4, title:'전설 아이템 획득!', platform:'TikTok',  pColor:'#69c9d0', views:63_000,  likes:1_000, daysAgo:0, score:88, dur:'00:42', sp:[3,6,8,10,12,14,13,17,18,20,22,24]    },
    { rank:5, title:'좀비 대량 학살!!',  platform:'SOOP',    pColor:'#ff6b35', views:45_000,  likes:650,   daysAgo:2, score:85, dur:'00:33', sp:[2,4,6,8,9,11,10,14,14,17,16,20]      },
  ]
  const visibleClips = showAll ? allTopClips : allTopClips.slice(0, 4)

  // SVG 경로 생성 (베지어 곡선)
  const mkPath = (data: number[], w: number, h: number, fill: boolean, maxV?: number) => {
    const mx = maxV ?? Math.max(...data)
    const pts = data.map((v,i): [number,number] => [i/(data.length-1)*w, h - (v/mx)*h*0.85 + h*0.05])
    let d = `M ${pts[0][0]} ${pts[0][1]}`
    for (let i=1;i<pts.length;i++) {
      const [px,py]=pts[i-1],[cx,cy]=pts[i],mx2=(px+cx)/2
      d += ` C ${mx2} ${py} ${mx2} ${cy} ${cx} ${cy}`
    }
    if (fill) d += ` L ${w} ${h} L 0 ${h} Z`
    return d
  }

  return (
    <PageWrap>
      {/* 헤더 */}
      <div className="px-5 pt-4 pb-2 flex-shrink-0 flex items-center justify-between">
        <div>
          <h3 className="text-white font-bold text-sm">성과 분석</h3>
          <p className="text-white/35 text-[11px]">업로드된 클립의 플랫폼별 성과</p>
        </div>
        <div className="flex items-center gap-1.5 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 cursor-pointer hover:border-white/15 transition-colors">
          <Calendar size={11} className="text-white/30"/>
          <span className="text-white/40 text-[11px]">최근 30일</span>
          <ChevronDown size={9} className="text-white/25"/>
        </div>
      </div>

      <div className="flex-1 px-5 pb-4 flex flex-col gap-3 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-accent-purple/35 [&::-webkit-scrollbar-track]:bg-transparent">

        {/* ── KPI 4개 ── */}
        <div className="grid grid-cols-4 gap-3 flex-shrink-0">
          {kpiCards.map(kpi => (
            <Card key={kpi.label} className="p-3 overflow-hidden">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px]">{kpi.icon}</span>
                  <span className="text-white/45 text-[10px]">{kpi.label}</span>
                </div>
              </div>
              <div className="font-bold text-[22px] leading-none mb-1.5" style={{color:kpi.color}}>{kpi.value}</div>
              <div className="flex items-center gap-1 mb-2.5">
                <span className="text-green-400 text-[9px] font-semibold">↗ {kpi.growth}</span>
                <span className="text-white/25 text-[9px]">지난달 대비</span>
              </div>
              <svg viewBox="0 0 80 22" width="100%" height="22" preserveAspectRatio="none">
                <defs>
                  <linearGradient id={`kg${kpi.gid}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={kpi.color} stopOpacity=".4"/>
                    <stop offset="100%" stopColor={kpi.color} stopOpacity=".02"/>
                  </linearGradient>
                </defs>
                <path d={mkPath(kpi.d, 80, 22, true)}  fill={`url(#kg${kpi.gid})`}/>
                <path d={mkPath(kpi.d, 80, 22, false)} fill="none" stroke={kpi.color} strokeWidth="1.5"/>
              </svg>
            </Card>
          ))}
        </div>

        {/* ── 클립 성과 추이 + 플랫폼별 성과 ── */}
        <div className="flex gap-3 flex-shrink-0">

          {/* 멀티라인 차트 */}
          <Card className="flex-1 p-3.5">
            <div className="flex items-center justify-between mb-2.5">
              <div>
                <div className="text-white/70 text-[11px] font-bold mb-1.5">클립 성과 추이</div>
                <div className="flex items-center gap-3">
                  {Object.keys(platColors).map(name => (
                    <div key={name} className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full" style={{background:platColors[name]}}/>
                      <span className="text-white/35 text-[9px]">{name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-white/[0.04] border border-white/[0.08] rounded-lg px-2.5 py-1.5">
                <span className="text-white/40 text-[10px]">주간</span>
                <ChevronDown size={8} className="text-white/25"/>
              </div>
            </div>

            <div className="relative" onMouseLeave={() => setHoveredDay(null)}>
              <div className="flex">
                {/* Y축 */}
                <div className="flex flex-col justify-between text-right pr-1.5 flex-shrink-0" style={{width:'28px',height:'100px'}}>
                  {[140,105,70,35,0].map(v => (
                    <span key={v} className="text-white/20 text-[8px] leading-none">{v>0?`${v}K`:0}</span>
                  ))}
                </div>
                {/* 차트 + X축 */}
                <div className="flex-1 min-w-0">
                  <svg
                    viewBox="0 0 400 100"
                    width="100%" height="100"
                    preserveAspectRatio="none"
                    className="cursor-crosshair"
                    onMouseMove={e => {
                      const r = e.currentTarget.getBoundingClientRect()
                      setHoveredDay(Math.min(6, Math.max(0, Math.round((e.clientX - r.left) / r.width * 6))))
                    }}
                  >
                    <defs>
                      {Object.keys(platColors).map(name => (
                        <linearGradient key={name} id={`lg${name}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={platColors[name]} stopOpacity=".22"/>
                          <stop offset="100%" stopColor={platColors[name]} stopOpacity=".01"/>
                        </linearGradient>
                      ))}
                    </defs>
                    {/* 격자 */}
                    {[25,50,75].map(y => (
                      <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
                    ))}
                    {/* 호버 수직선 */}
                    {hoveredDay !== null && (
                      <line x1={hoveredDay/6*400} y1={0} x2={hoveredDay/6*400} y2={100}
                        stroke="rgba(255,255,255,0.18)" strokeWidth="1" strokeDasharray="3 2"/>
                    )}
                    {/* 각 플랫폼 라인 */}
                    {Object.entries(weeklyData).map(([name, vals]) => {
                      const col = platColors[name]
                      const fillD = mkPath(vals,400,100,true,CHART_MAX)
                      const lineD = mkPath(vals,400,100,false,CHART_MAX)
                      return (
                        <g key={name}>
                          <path d={fillD} fill={`url(#lg${name})`}/>
                          <path d={lineD} fill="none" stroke={col} strokeWidth="1.5"
                            style={{filter:`drop-shadow(0 0 3px ${col}88)`}}/>
                          {hoveredDay !== null && (() => {
                            const v  = vals[hoveredDay]
                            const x  = hoveredDay/6*400
                            const y  = 100 - (v/CHART_MAX)*100*0.85 + 100*0.05
                            return <circle key="dot" cx={x} cy={y} r={3} fill={col} stroke="white" strokeWidth="1.5"
                              style={{filter:`drop-shadow(0 0 4px ${col})`}}/>
                          })()}
                        </g>
                      )
                    })}
                  </svg>
                  {/* X축 */}
                  <div className="flex justify-between mt-1 px-0.5">
                    {weekDays.map((d,i) => (
                      <span key={d} className={`text-[9px] transition-colors ${hoveredDay===i?'text-white/80 font-semibold':'text-white/25'}`}>{d}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 호버 툴팁 */}
              {hoveredDay !== null && (
                <div
                  className="absolute top-0 pointer-events-none z-20"
                  style={{
                    left: `calc(${hoveredDay/6*100}% + 32px)`,
                    transform: hoveredDay >= 5 ? 'translateX(-112%)' : 'translateX(8px)',
                  }}
                >
                  <div className="bg-[#16162a] border border-white/[0.14] rounded-xl px-3 py-2.5 shadow-xl"
                    style={{minWidth:'120px'}}>
                    <div className="text-white/50 text-[9px] font-semibold mb-2">{weekDays[hoveredDay]}요일</div>
                    {Object.entries(weeklyData).map(([name, vals]) => (
                      <div key={name} className="flex items-center gap-1.5 mb-1 last:mb-0">
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{background:platColors[name]}}/>
                        <span className="text-white/50 text-[9px]">{name}</span>
                        <span className="text-white/85 text-[9px] font-bold ml-auto">{vals[hoveredDay]}K</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* 플랫폼별 성과 */}
          <Card className="w-56 flex-shrink-0 p-3.5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/70 text-[11px] font-bold">플랫폼별 성과</span>
              <span className="text-white/25 text-[9px]">총 조회수 비중</span>
            </div>

            {/* 도넛 + 범례 */}
            <div className="flex items-center gap-3 mb-3.5">
              <div className="relative flex-shrink-0" style={{width:'76px',height:'76px'}}>
                <svg viewBox="0 0 100 100" width="76" height="76" style={{transform:'rotate(-90deg)'}}>
                  {donutSlices.map((s,i) => (
                    <circle key={i} cx="50" cy="50" r={donutR}
                      fill="none" stroke={s.color} strokeWidth={donutSW}
                      strokeDasharray={`${s.pct*donutCircum} ${donutCircum*(1-s.pct)}`}
                      style={{transform:`rotate(${s.rotation}deg)`,transformOrigin:'50px 50px'}}/>
                  ))}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center" style={{transform:'none'}}>
                  <span className="text-white font-bold text-[11px] leading-tight">{fmtN(totalViews)}</span>
                  <span className="text-white/30 text-[8px]">총 조회수</span>
                </div>
              </div>
              <div className="space-y-1.5">
                {platforms.map(p => (
                  <div key={p.name} className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{background:p.color}}/>
                    <span className="text-white/45 text-[9px]">{p.name}</span>
                    <span className="text-[9px] font-bold ml-auto" style={{color:p.color}}>{p.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 플랫폼별 바 */}
            <div className="space-y-2.5">
              {platforms.map(p => (
                <div key={p.name}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                      style={{background:p.color+'22', border:`1px solid ${p.color}44`}}>{p.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-white/65 text-[10px] font-semibold">{p.name}</span>
                          <span className="text-white/25 text-[8px] ml-1">{p.clips}개</span>
                        </div>
                        <span className="text-[11px] font-bold" style={{color:p.color}}>{fmtN(p.views)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{width:`${p.views/totalViews*100}%`, background:p.color+'cc'}}/>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ── 상위 클립 성과 ── */}
        <div className="flex-shrink-0">
          <div className="text-white/70 text-xs font-bold mb-3">상위 클립 성과</div>
          <div className="grid grid-cols-2 gap-3">
            {visibleClips.map((c, idx) => (
              <Card key={idx} className="p-3"
                style={idx===0 ? {
                  borderColor:'rgba(124,58,237,0.55)',
                  boxShadow:'0 0 0 1px rgba(124,58,237,0.2), 0 0 16px rgba(124,58,237,0.06)',
                } : {}}>
                {/* 상단: 썸네일 + 메타 */}
                <div className="flex gap-3 mb-3">
                  <div className="relative flex-shrink-0 rounded-xl overflow-hidden" style={{width:'90px',aspectRatio:'16/9'}}>
                    <img src={THUMB_IMGS[(c.rank-1)%THUMB_IMGS.length]} alt={c.title}
                      className="absolute inset-0 w-full h-full object-cover" draggable={false}/>
                    <div className="absolute bottom-1 left-1 flex items-center gap-0.5 bg-black/70 px-1 py-0.5 rounded text-white text-[7px]">
                      <Play size={6} fill="white" className="text-white flex-shrink-0"/>{c.dur}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white/85 text-[11px] font-bold leading-snug mb-1.5">{c.title}</div>
                    <span className="inline-block text-[8px] px-1.5 py-0.5 rounded-full font-semibold mb-2"
                      style={{color:c.pColor, background:c.pColor+'22'}}>{c.platform}</span>
                    <div className="grid grid-cols-3 gap-1">
                      {([
                        ['조회수',  fmtN(c.views),  'text-cyan-400'],
                        ['좋아요',  fmtN(c.likes),  'text-pink-400/80'],
                        ['업로드',  c.daysAgo===0?'오늘':`${c.daysAgo}일 전`, 'text-white/45'],
                      ] as [string,string,string][]).map(([l,v,cl]) => (
                        <div key={l}>
                          <div className="text-white/30 text-[8px]">{l}</div>
                          <div className={`${cl} text-[10px] font-bold`}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 하단: 미니 차트 + 점수 배지 */}
                <div className="flex items-end gap-2">
                  <div className="flex-1 min-w-0">
                    {/* Y 레이블 */}
                    <div className="flex justify-between text-[7px] text-white/15 mb-0.5">
                      <span>40K</span><span>20K</span><span>0</span>
                    </div>
                    <svg viewBox="0 0 200 38" width="100%" height="38" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id={`cg${idx}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={c.pColor} stopOpacity=".45"/>
                          <stop offset="100%" stopColor={c.pColor} stopOpacity=".02"/>
                        </linearGradient>
                      </defs>
                      <path d={mkPath(c.sp, 200, 38, true)}  fill={`url(#cg${idx})`}/>
                      <path d={mkPath(c.sp, 200, 38, false)} fill="none" stroke={c.pColor} strokeWidth="1.5"
                        style={{filter:`drop-shadow(0 0 3px ${c.pColor}88)`}}/>
                    </svg>
                    {/* X 레이블 */}
                    <div className="flex justify-between text-[7px] text-white/15 mt-0.5">
                      {['0시','4시','8시','12시','16시','20시','24시'].map(t => <span key={t}>{t}</span>)}
                    </div>
                  </div>

                  {/* 점수 배지 */}
                  <div className="flex-shrink-0 flex flex-col items-center justify-center rounded-full w-[52px] h-[52px] border-2 transition-all"
                    style={{
                      borderColor: c.score>=95?'#7c3aed':c.score>=90?'rgba(124,58,237,0.7)':'rgba(124,58,237,0.45)',
                      background: c.score>=95?'rgba(124,58,237,0.25)':'rgba(124,58,237,0.1)',
                      boxShadow: c.score>=95?'0 0 14px rgba(124,58,237,0.45)':'none',
                    }}>
                    <span className="text-accent-purple font-bold text-[13px] leading-none">{c.score}점</span>
                    <span className="text-white/25 text-[6px] mt-0.5 text-center leading-tight">하이라이트<br/>점수</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* 더 많은 클립 보기 버튼 */}
          <div className="flex justify-center mt-3.5">
            <button
              onClick={() => setShowAll(v => !v)}
              className="flex items-center gap-1.5 px-6 py-2 rounded-full border border-accent-purple/45 text-accent-purple/80 text-[10px] font-semibold hover:bg-accent-purple/10 hover:text-accent-purple hover:border-accent-purple/70 transition-all"
              style={{boxShadow:'0 0 12px rgba(124,58,237,0.12)'}}
            >
              {showAll ? '접기' : '더 많은 클립 보기'}
              <ChevronDown size={10} className={`transition-transform duration-200 ${showAll?'rotate-180':''}`}/>
            </button>
          </div>
        </div>

      </div>
    </PageWrap>
  )
}

// ══════════════════════════════════════════════════════════
// PAGE 6: 설정
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

      <div className="flex-1 px-5 pb-4 flex gap-3 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-accent-purple/30 [&::-webkit-scrollbar-track]:bg-transparent">
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
  const [activePage,       setActivePage]       = useState<Page>('highlight')
  const [uploadNav,        setUploadNav]        = useState<UploadNav | null>(null)
  const [clipsInitialClip, _setClipsInitialClip] = useState<Clip | null>(null)

  const navigateToUpload = (nav: UploadNav) => {
    setUploadNav(nav)
    setActivePage('upload')
  }


  const pageComponents: Record<Page, React.ReactNode> = {
    highlight:   <LiveAnalysisPage />,
    clips:       <ClipsPage onNav={navigateToUpload} initialOpenClip={clipsInitialClip} />,
    upload:      <UploadPage initialNav={uploadNav} />,
    performance: <PerformancePage />,
    settings:    <SettingsPage />,
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
