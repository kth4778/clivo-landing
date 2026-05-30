const fs = require('fs');
const file = 'src/components/LiveDashboard.tsx';
let lines = fs.readFileSync(file, 'utf8').split('\n');
console.log('start lines:', lines.length);

// ══ Patch 1: Add clipSeek state + clipSeekHover after tagInput (0-indexed 727)
lines.splice(728, 0,
  `  const [clipSeek,      setClipSeek]      = useState(0)   // 0-100% within selected clip`,
  `  const [clipSeekHover, setClipSeekHover] = useState<number|null>(null)`,
);
console.log('after P1:', lines.length);

// ══ Patch 2: Reset clipSeek when selectedLogClip changes
// Find useEffect or selectedLogClip setter calls - insert after the useState block
// Find 'const logScrollRef' to insert a useEffect before it
let logScrollIdx = -1;
lines.forEach((l,i) => { if(l.includes('const logScrollRef') && logScrollIdx === -1) logScrollIdx = i; });
console.log('logScrollRef at:', logScrollIdx+1);
lines.splice(logScrollIdx, 0,
  `  // reset seek when clip changes`,
  `  useEffect(() => { setClipSeek(0); setClipSeekHover(null) }, [selectedLogClip?.rank])`,
  ``,
);
console.log('after P2:', lines.length);

// ══ Patch 3: Add useEffect to React import if not present
const importLine = lines[0];
if(!importLine.includes('useEffect')) {
  lines[0] = importLine.replace('useState', 'useState, useEffect');
  console.log('added useEffect to import');
} else {
  console.log('useEffect already imported');
}

// ══ Patch 4: Compute current timestamp from clipSeek
// After clipTimestamps declaration, add clipCurrentTime
let clipTsIdx = -1;
lines.forEach((l,i) => { if(l.includes('const clipTimestamps') && clipTsIdx === -1) clipTsIdx = i; });
console.log('clipTimestamps at:', clipTsIdx+1);
lines.splice(clipTsIdx+1, 0,
  `  const clipCurrentTime = (() => {`,
  `    if (!selectedLogClip) return ''`,
  `    const toSec = (t: string) => { const [h,m,s]=t.split(':').map(Number); return h*3600+m*60+s }`,
  `    const [s0,s1] = selectedLogClip.time.split('–')`,
  `    const cur = toSec(s0) + Math.round(clipSeek/100 * (toSec(s1)-toSec(s0)))`,
  `    return fmtSecs(cur)`,
  `  })()`,
);
console.log('after P4:', lines.length);

// ══ Patch 5: Update video player timestamp display to use clipCurrentTime
// Find: {selectedLogClip.time.split('–')[0]} ~ {selectedLogClip.time.split('–')[1]}
// (inside the inline clip detail video overlay)
let videoTsIdx = -1;
lines.forEach((l,i) => {
  if(l.includes("selectedLogClip.time.split('–')[0]} ~") && videoTsIdx === -1) videoTsIdx = i;
});
console.log('video timestamp at:', videoTsIdx+1);
// Replace with current time + add mini progress bar after
lines[videoTsIdx] = lines[videoTsIdx].replace(
  `{selectedLogClip.time.split('–')[0]} ~ {selectedLogClip.time.split('–')[1]}`,
  `{clipCurrentTime}`
);
// Add mini progress bar after the video player div (after the timestamp line + a few lines)
// Find the closing of the video relative container (aspectRatio:16/9 div closing)
// The structure is:
// </div>  ← closes the gradient overlay div (line after the timestamp)
// </div>  ← closes the relative div (video container)
// Look for the second </div> after videoTsIdx
let closeIdx = videoTsIdx + 1;
let closes = 0;
while(closeIdx < lines.length && closes < 2) {
  if(lines[closeIdx].trim() === '</div>') closes++;
  closeIdx++;
}
// closeIdx now points to line AFTER the two closing divs
// Insert mini progress bar + scrubber right after the relative video container closing div
const miniBar = [
  `                    {/* 미니 시크바 */}`,
  `                    <div className="relative h-1 bg-white/[0.06] rounded-full overflow-hidden cursor-pointer group/seek"`,
  `                      onClick={e => {`,
  `                        const r = e.currentTarget.getBoundingClientRect()`,
  `                        setClipSeek(Math.round(Math.max(0,Math.min(1,(e.clientX-r.left)/r.width))*100))`,
  `                      }}>`,
  `                      <div className="absolute inset-y-0 left-0 bg-accent-purple/70 rounded-full transition-all duration-75"`,
  `                        style={{width:\`\${clipSeek}%\`}}/>`,
  `                      <div className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-accent-purple shadow-lg opacity-0 group-hover/seek:opacity-100 transition-opacity pointer-events-none"`,
  `                        style={{left:\`\${clipSeek}%\`, transform:'translate(-50%,-50%)', boxShadow:'0 0 6px rgba(168,85,247,0.9)'}}/>`,
  `                    </div>`,
];
lines.splice(closeIdx, 0, ...miniBar);
console.log('after P5:', lines.length);

// ══ Patch 6: Remove 감정흐름 section
// Find {/* 감정흐름 */} and remove through </div>
let emIdx = -1;
lines.forEach((l,i) => { if(l.includes('감정흐름') && l.includes('/*') && emIdx === -1) emIdx = i; });
console.log('감정흐름 at:', emIdx+1);
// Count lines to remove: from emIdx to the closing </div></div> of that section
// Structure: comment, flex div, label div, flex-1 div (SVG + legend), /flex-1, /flex
let depth = 0, emEnd = emIdx + 1;
let started = false;
while(emEnd < lines.length) {
  for(const c of lines[emEnd]) {
    if(c === '<') {
      // check if opening or closing
    }
  }
  const open = (lines[emEnd].match(/<[a-zA-Z]/g) || []).length;
  const close = (lines[emEnd].match(/<\//g) || []).length + (lines[emEnd].match(/\/>/g) || []).length;
  if(!started && lines[emEnd].trim().startsWith('<div')) started = true;
  if(started) {
    depth += open - close;
    if(depth <= 0) { emEnd++; break; }
  }
  emEnd++;
}
console.log('removing감정흐름 lines', emIdx+1, 'to', emEnd);
lines.splice(emIdx, emEnd - emIdx);
console.log('after P6:', lines.length);

// ══ Patch 7: Make timeline bar interactive (clickable + hover cursor + tooltip)
// Find the timeline bar div inside clip detail: 'relative h-2 flex-1 bg-white/[0.04] rounded overflow-hidden border border-white/[0.06]'
// and replace the static bar with interactive version
let barIdx = -1;
lines.forEach((l,i) => {
  if(l.includes('relative h-2 flex-1 bg-white/[0.04] rounded overflow-hidden border border-white/[0.06]') && barIdx === -1 && i > 1080) barIdx = i;
});
console.log('timeline bar at:', barIdx+1);

// Read forward to find end of this bar div (next </div> at same level)
// Lines: barIdx = the outer div with h-2
// barIdx+1 = fill div
// barIdx+2..N = moment markers
// last = cursor div
// barIdx+N+1 = </div>
let bEnd = barIdx + 1;
let bDepth = 1;
while(bEnd < lines.length) {
  const open = (lines[bEnd].match(/<[a-zA-Z]/g) || []).length;
  const cl   = (lines[bEnd].match(/<\//g) || []).length + (lines[bEnd].match(/\/>/g) || []).length;
  bDepth += open - cl;
  bEnd++;
  if(bDepth <= 0) break;
}
console.log('bar end at:', bEnd);

// Extract moment markers (they stay the same)
const momentMarkers = lines.slice(barIdx+1, bEnd-1).filter(l => l.includes('clipMoments.map'));
// Build new interactive bar
const newBar = [
`                  <div className="relative h-3 flex-1 bg-white/[0.04] rounded-full overflow-hidden border border-white/[0.06] cursor-pointer group/bar"`,
`                    onClick={e => {`,
`                      const r = e.currentTarget.getBoundingClientRect()`,
`                      setClipSeek(Math.round(Math.max(0,Math.min(1,(e.clientX-r.left)/r.width))*100))`,
`                    }}`,
`                    onMouseMove={e => {`,
`                      const r = e.currentTarget.getBoundingClientRect()`,
`                      setClipSeekHover(Math.round(Math.max(0,Math.min(1,(e.clientX-r.left)/r.width))*100))`,
`                    }}`,
`                    onMouseLeave={() => setClipSeekHover(null)}`,
`                  >`,
`                    {/* 재생된 구간 */}`,
`                    <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-75"`,
`                      style={{width:\`\${clipSeek}%\`, background:'linear-gradient(90deg,rgba(124,58,237,0.5),rgba(168,85,247,0.75))'}}/>`,
`                    {/* 주요 순간 마커 선 */}`,
`                    {clipMoments.map((m, mi) => (`,
`                      <div key={mi} className="absolute top-0 bottom-0 w-[1.5px] opacity-60 pointer-events-none"`,
`                        style={{left:\`\${m.pct}%\`, background:m.color}}/>`,
`                    ))}`,
`                    {/* 현재 위치 커서 */}`,
`                    <div className="absolute top-0 bottom-0 w-[2px] pointer-events-none"`,
`                      style={{left:\`\${clipSeek}%\`, transform:'translateX(-50%)', background:'#a855f7', boxShadow:'0 0 6px rgba(168,85,247,0.9)'}}/>`,
`                    {/* 호버 커서 */}`,
`                    {clipSeekHover !== null && (`,
`                      <div className="absolute top-0 bottom-0 w-px pointer-events-none opacity-40"`,
`                        style={{left:\`\${clipSeekHover}%\`, background:'rgba(255,255,255,0.6)'}}/>`,
`                    )}`,
`                    {/* 클릭 핸들 */}`,
`                    <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-accent-purple shadow pointer-events-none"`,
`                      style={{left:\`\${clipSeek}%\`, transform:'translate(-50%,-50%)', boxShadow:'0 0 6px rgba(168,85,247,1)'}}/>`,
`                  </div>`,
];
lines.splice(barIdx, bEnd - barIdx, ...newBar);
console.log('after P7:', lines.length);

// ══ Patch 8: Add hover tooltip above the timestamps row
// Find the timestamps row in clip detail and add tooltip before it
let tsRowIdx = -1;
lines.forEach((l,i) => {
  if(l.includes('clipTimestamps.map') && tsRowIdx === -1 && i > 1080) tsRowIdx = i;
});
console.log('timestamps row at:', tsRowIdx+1);
// Go up to find the flex wrapper of the timestamps
let tsDivIdx = tsRowIdx;
while(tsDivIdx > 0 && !lines[tsDivIdx].includes('<div className="flex">')) tsDivIdx--;
// Insert tooltip ABOVE that flex div
const tooltip = [
`                {/* 호버 타임 툴팁 */}`,
`                {clipSeekHover !== null && (() => {`,
`                  const toSec = (t: string) => { const [h,m,s]=t.split(':').map(Number); return h*3600+m*60+s }`,
`                  const [s0,s1] = selectedLogClip.time.split('–')`,
`                  const hoverSec = toSec(s0) + Math.round(clipSeekHover/100 * (toSec(s1)-toSec(s0)))`,
`                  return (`,
`                    <div className="absolute pointer-events-none z-20 -translate-x-1/2 -translate-y-full"`,
`                      style={{left:\`calc(42px + \${clipSeekHover}% * (100% - 42px) / 100)\`, top:0}}>`,
`                      <div className="bg-[#1a1a2e] border border-white/15 rounded-lg px-2 py-1 text-center shadow-xl mb-1">`,
`                        <div className="text-white/80 text-[9px] font-mono font-semibold">{fmtSecs(hoverSec)}</div>`,
`                        <div className="text-white/35 text-[8px]">채팅 {Math.round(WAVE[Math.round(clipSeekHover/100*(WAVE.length-1))] * 80)}/분</div>`,
`                      </div>`,
`                    </div>`,
`                  )`,
`                })()}`,
];
lines.splice(tsDivIdx, 0, ...tooltip);
console.log('after P8:', lines.length);

// ══ Patch 9: Wrap timeline bar + tooltip area in relative div
// Find the '타임라인 바 + 타임스탬프' comment
let tlBarCommentIdx = -1;
lines.forEach((l,i) => {
  if(l.includes('타임라인 바 + 타임스탬프') && tlBarCommentIdx === -1 && i > 1080) tlBarCommentIdx = i;
});
console.log('타임라인 바 + 타임스탬프 at:', tlBarCommentIdx+1);
// Check if already wrapped in relative div
if(lines[tlBarCommentIdx-1] && !lines[tlBarCommentIdx-1].includes('relative')) {
  // The structure is: {/* comment */} then <div className="flex flex-col gap-1">
  // We need to wrap the whole section in a relative div for the tooltip
  // Find the flex flex-col div after comment and add relative to it
  let fcDiv = tlBarCommentIdx + 1;
  while(fcDiv < lines.length && !lines[fcDiv].includes('flex flex-col gap-1')) fcDiv++;
  lines[fcDiv] = lines[fcDiv].replace('flex flex-col gap-1', 'relative flex flex-col gap-1');
  console.log('added relative to flex-col at', fcDiv+1);
}

fs.writeFileSync(file, lines.join('\n'), 'utf8');
console.log('Done! Final lines:', lines.length);
