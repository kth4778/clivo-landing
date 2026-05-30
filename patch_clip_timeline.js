const fs = require('fs');
const file = 'src/components/LiveDashboard.tsx';
let lines = fs.readFileSync(file, 'utf8').split('\n');
console.log('start lines:', lines.length);

// ══════════════════════════════════════════════════
// Patch D (bottom): wrap AI 분析 로그 카드 with {!selectedLogClip && ...}
// AI log card: 0-indexed 1230~1300 (71 lines)
// ══════════════════════════════════════════════════
lines.splice(1301, 0, '        )}');
lines.splice(1230, 0, '        {!selectedLogClip && (');
console.log('after D:', lines.length);

// ══════════════════════════════════════════════════
// Patch C: replace full timeline (0-indexed 1009~1228, 220 lines)
// with conditional: selectedLogClip ? clipTimeline : fullTimeline
// ══════════════════════════════════════════════════
// capture existing full timeline Card (0-indexed 1010~1228 = the <Card>...</Card>)
const fullTimelineCard = lines.slice(1010, 1229); // 219 lines

const clipDetailLines = [
`          <Card className="p-3 flex-shrink-0">`,
`            <div className="flex items-center justify-between mb-3">`,
`              <div className="flex items-center gap-2">`,
`                <span className="text-white/55 text-[11px] font-semibold">클립 #{selectedLogClip.rank} 타임라인</span>`,
`                <span className="text-white/20 text-[9px] font-mono bg-white/[0.03] border border-white/[0.07] px-2 py-px rounded-full">`,
`                  {selectedLogClip.time.replace('–', ' ~ ')}`,
`                </span>`,
`                <span className="text-accent-purple/70 text-[9px] font-mono bg-accent-purple/10 border border-accent-purple/25 px-2 py-px rounded-full">`,
`                  {selectedLogClip.dur}`,
`                </span>`,
`              </div>`,
`              <button onClick={() => setSelectedLogClip(null)} className="text-white/25 hover:text-white/55 transition-colors">`,
`                <X size={11}/>`,
`              </button>`,
`            </div>`,
`            <div className="flex flex-col gap-3">`,
`              {/* 채팅밀도 */}`,
`              <div className="flex items-end">`,
`                <div className="text-[8.5px] text-white/25 text-right pr-2 flex-shrink-0 self-center" style={{width:'42px'}}>채팅밀도</div>`,
`                <div className="flex-1 flex items-end gap-px" style={{height:'40px'}}>`,
`                  {clipWave.map((v, i) => (`,
`                    <div key={i} className="flex-1 rounded-t-[1px]"`,
`                      style={{`,
`                        height:\`\${Math.round(v * 100)}%\`,`,
`                        background: \`rgba(124,58,237,\${(0.25 + v * 0.7).toFixed(2)})\`,`,
`                        boxShadow: v > 0.82 ? '0 0 4px rgba(168,85,247,0.7)' : undefined,`,
`                      }}/>`,
`                  ))}`,
`                </div>`,
`              </div>`,
`              {/* 감정흐름 */}`,
`              <div className="flex">`,
`                <div className="text-[8.5px] text-white/25 text-right pr-2 flex-shrink-0 self-center" style={{width:'42px'}}>감정흐름</div>`,
`                <div className="flex-1">`,
`                  <svg width="100%" height="40" viewBox="0 0 400 40" preserveAspectRatio="none">`,
`                    {[0.25, 0.5, 0.75].map(f => (`,
`                      <line key={f} x1="0" y1={40*f} x2="400" y2={40*f} stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>`,
`                    ))}`,
`                    <path d={buildPath(clipEmotionFlow.emotional, 400, 40, false)} fill="none" stroke="rgba(244,63,94,0.6)"  strokeWidth="1.5"/>`,
`                    <path d={buildPath(clipEmotionFlow.excited,   400, 40, false)} fill="none" stroke="rgba(59,130,246,0.6)"  strokeWidth="1.5"/>`,
`                    <path d={buildPath(clipEmotionFlow.happy,     400, 40, false)} fill="none" stroke="rgba(245,158,11,0.9)"  strokeWidth="2"/>`,
`                  </svg>`,
`                  <div className="flex items-center gap-3 mt-0.5 justify-end">`,
`                    {[{c:'#f59e0b',l:'😄 긍정'},{c:'#3b82f6',l:'😮 흥분'},{c:'#f43f5e',l:'❤️ 감동'}].map(item => (`,
`                      <div key={item.l} className="flex items-center gap-1">`,
`                        <div className="w-3 h-px rounded-full opacity-75" style={{background:item.c}}/>`,
`                        <span className="text-white/25 text-[8px]">{item.l}</span>`,
`                      </div>`,
`                    ))}`,
`                  </div>`,
`                </div>`,
`              </div>`,
`              {/* 주요 순간 마커 */}`,
`              <div className="flex items-center">`,
`                <div className="text-[8.5px] text-white/25 text-right pr-2 flex-shrink-0" style={{width:'42px'}}>주요순간</div>`,
`                <div className="relative flex-1" style={{height:'26px'}}>`,
`                  <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-white/[0.08]" style={{transform:'translateY(-50%)'}}/>`,
`                  {clipMoments.map((m, mi) => (`,
`                    <div key={mi} className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10" style={{left:\`\${m.pct}%\`}}>`,
`                      <div className="text-[7.5px] px-1.5 py-px rounded-full border font-semibold whitespace-nowrap"`,
`                        style={{background:m.bg, borderColor:m.border, color:m.color}}>`,
`                        {m.icon} {m.label}`,
`                      </div>`,
`                    </div>`,
`                  ))}`,
`                </div>`,
`              </div>`,
`              {/* 타임라인 바 + 타임스탬프 */}`,
`              <div className="flex flex-col gap-1">`,
`                <div className="flex">`,
`                  <div style={{width:'42px', flexShrink:0}}/>`,
`                  <div className="relative h-2 flex-1 bg-white/[0.04] rounded overflow-hidden border border-white/[0.06]">`,
`                    <div className="absolute inset-y-0 left-0 rounded"`,
`                      style={{width:'55%', background:'linear-gradient(90deg,rgba(124,58,237,0.35),rgba(168,85,247,0.55))'}}/>`,
`                    {clipMoments.map((m, mi) => (`,
`                      <div key={mi} className="absolute top-0 bottom-0 w-[1.5px] opacity-50" style={{left:\`\${m.pct}%\`, background:m.color}}/>`,
`                    ))}`,
`                    <div className="absolute top-0 bottom-0 w-[2px]"`,
`                      style={{left:'55%', background:'#a855f7', boxShadow:'0 0 5px rgba(168,85,247,0.8)'}}/>`,
`                  </div>`,
`                </div>`,
`                <div className="flex">`,
`                  <div style={{width:'42px', flexShrink:0}}/>`,
`                  <div className="flex flex-1 justify-between text-[8.5px] text-white/20 font-mono">`,
`                    {clipTimestamps.map(t => <span key={t}>{t}</span>)}`,
`                  </div>`,
`                </div>`,
`              </div>`,
`              {/* 태그 */}`,
`              <div className="flex items-center pt-1.5 border-t border-white/[0.05]">`,
`                <div className="text-[8.5px] text-white/25 text-right pr-2 flex-shrink-0" style={{width:'42px'}}>태그</div>`,
`                <div className="flex flex-1 flex-wrap gap-1.5">`,
`                  {(clipTags[selectedLogClip.rank] ?? selectedLogClip.tags).map((tag, ti) => (`,
`                    <span key={ti} className="text-[9px] px-2 py-0.5 rounded-full border bg-accent-purple/10 border-accent-purple/30 text-accent-purple/80 font-semibold">`,
`                      {tag}`,
`                    </span>`,
`                  ))}`,
`                  {selectedLogClip.chatScore >= 70 && (`,
`                    <span className="text-[9px] px-2 py-0.5 rounded-full border bg-cyan-500/10 border-cyan-500/30 text-cyan-400/80">`,
`                      📈 채팅 {selectedLogClip.chatScore}점`,
`                    </span>`,
`                  )}`,
`                  {selectedLogClip.videoScore >= 17 && (`,
`                    <span className="text-[9px] px-2 py-0.5 rounded-full border bg-purple-500/10 border-purple-500/30 text-purple-300/80">`,
`                      🎬 영상 {selectedLogClip.videoScore}점`,
`                    </span>`,
`                  )}`,
`                </div>`,
`              </div>`,
`            </div>`,
`          </Card>`,
];

const newTimeline = [
  `        {/* ── 타임라인 분析 ── */}`,
  `        {selectedLogClip ? (`,
  ...clipDetailLines,
  `        ) : (`,
  ...fullTimelineCard,
  `        )}`,
];

lines.splice(1009, 220, ...newTimeline);
console.log('after C:', lines.length);

// ══════════════════════════════════════════════════
// Patch B: insert clip data derivations after hClip (now at ~723 after C)
// hClip is still at 0-indexed 721 (C replaced 1009+, B is at 721, unaffected)
// ══════════════════════════════════════════════════
const clipVars = [
`  const clipWave         = selectedLogClip ? getClipWaveData(selectedLogClip) : ([] as number[])`,
`  const clipEmotionFlow  = selectedLogClip ? getClipEmotionFlowData(selectedLogClip) : {happy:[] as number[], excited:[] as number[], emotional:[] as number[]}`,
`  const clipMoments      = selectedLogClip ? getClipKeyMoments(selectedLogClip, clipWave) : [] as {pct:number;icon:string;label:string;color:string;bg:string;border:string}[]`,
`  const clipTimestamps   = selectedLogClip ? getClipTimestamps(selectedLogClip) : ([] as string[])`,
];
lines.splice(722, 0, ...clipVars);
console.log('after B:', lines.length);

// ══════════════════════════════════════════════════
// Patch A: insert 4 helper functions at 0-indexed 175
// (after the blank line at 175, before // ── 클립 처리 단계)
// ══════════════════════════════════════════════════
const helpers = [
`// ── 클립 타임라인 헬퍼 ─────────────────────────────────────`,
`function getClipWaveData(clip: Clip): number[] {`,
`  const N = 40`,
`  const waveIdx = Math.min(Math.round(clip.pos / 100 * (WAVE.length - 1)), WAVE.length - 1)`,
`  const base = WAVE[waveIdx]`,
`  const s = clip.rank * 7 + clip.chatScore`,
`  return Array.from({length: N}, (_, i) => {`,
`    const t = i / (N - 1)`,
`    const peakT = 0.28 + (s % 11) * 0.04`,
`    const peakH = 0.4 + clip.chatScore / 130`,
`    const peak = peakH * Math.exp(-Math.pow((t - peakT) * 5.5, 2))`,
`    const noise = Math.sin(i * s * 0.7) * 0.07 + Math.cos(i * (s + 3) * 0.4) * 0.05`,
`    return Math.max(0.04, Math.min(1, base * 0.3 + peak + noise))`,
`  })`,
`}`,
``,
`function getClipEmotionFlowData(clip: Clip): {happy:number[], excited:number[], emotional:number[]} {`,
`  const N = 20`,
`  const s = clip.rank * 11`,
`  const happy = Array.from({length: N}, (_, i) =>`,
`    Math.max(0.1, Math.min(0.9, 0.4 + 0.25 * Math.sin(i * 0.55 + s * 0.08) + 0.1 * Math.cos(i * 0.3)))`,
`  )`,
`  const excited = Array.from({length: N}, (_, i) =>`,
`    Math.max(0.05, Math.min(0.8, 0.15 + 0.5 * Math.abs(Math.sin(i * 0.75 + s * 0.12))))`,
`  )`,
`  const emotional = happy.map((h, i) =>`,
`    Math.max(0.05, Math.min(0.75, 0.9 - h - excited[i] * 0.6))`,
`  )`,
`  return {happy, excited, emotional}`,
`}`,
``,
`function getClipKeyMoments(clip: Clip, wave: number[]) {`,
`  const toSec = (t: string) => { const [h,m,s]=t.split(':').map(Number); return h*3600+m*60+s }`,
`  const [startStr, endStr] = clip.time.split('–')`,
`  const startSec = toSec(startStr)`,
`  const durSec = toSec(endStr) - startSec`,
`  const clipLogs = LOG_EVENTS.filter(e => e.clip === clip.rank)`,
`  const moments: {pct:number;icon:string;label:string;color:string;bg:string;border:string}[] = clipLogs.map(e => {`,
`    const eSec = toSec(e.time)`,
`    const pct = Math.min(92, Math.max(5, (eSec - startSec) / durSec * 100))`,
`    const isX = e.type === 'extract'`,
`    return {`,
`      pct,`,
`      icon: isX ? '✅' : '📈',`,
`      label: isX ? '추출완료' : '채팅피크',`,
`      color: isX ? '#4ade80' : '#06b6d4',`,
`      bg:    isX ? 'rgba(74,222,128,0.1)' : 'rgba(6,182,212,0.1)',`,
`      border:isX ? 'rgba(74,222,128,0.3)' : 'rgba(6,182,212,0.3)',`,
`    }`,
`  })`,
`  if (wave.length > 0) {`,
`    const peakIdx = wave.indexOf(Math.max(...wave))`,
`    const peakPct = Math.round(peakIdx / (wave.length - 1) * 100)`,
`    moments.push({pct:peakPct, icon:'🔥', label:'반응 최고조', color:'#f97316', bg:'rgba(249,115,22,0.1)', border:'rgba(249,115,22,0.3)'})`,
`  }`,
`  return moments.sort((a, b) => a.pct - b.pct)`,
`}`,
``,
`function getClipTimestamps(clip: Clip): string[] {`,
`  const toSec = (t: string) => { const [h,m,s]=t.split(':').map(Number); return h*3600+m*60+s }`,
`  const [startStr, endStr] = clip.time.split('–')`,
`  const startSec = toSec(startStr)`,
`  const dur = toSec(endStr) - startSec`,
`  return Array.from({length: 5}, (_, i) => fmtSecs(startSec + Math.round(i / 4 * dur)))`,
`}`,
``,
];
lines.splice(175, 0, ...helpers);
console.log('after A:', lines.length);

fs.writeFileSync(file, lines.join('\n'), 'utf8');
console.log('Done. Final lines:', lines.length);
