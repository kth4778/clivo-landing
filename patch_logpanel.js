const fs = require('fs');
const file = 'src/components/LiveDashboard.tsx';
const lines = fs.readFileSync(file, 'utf8').split('\n');

const clipLogs = [
`                  <div className="w-52 flex-shrink-0 flex flex-col border-l border-white/[0.05]">`,
`                    {/* AI 분析 로그 헤더 */}`,
`                    <div className="flex items-center justify-between px-3 pt-2.5 pb-2 border-b border-white/[0.06] flex-shrink-0">`,
`                      <div className="flex items-center gap-1.5">`,
`                        <span className="text-white/55 text-[10px] font-semibold">AI 분석 로그</span>`,
`                        <span className="flex items-center gap-1 text-[8px] text-cyan-400/80 bg-cyan-500/10 border border-cyan-500/25 px-1.5 py-px rounded-full">`,
`                          <span className="w-1 h-1 rounded-full bg-cyan-400 flex-shrink-0"/>클립 #{selectedLogClip.rank}`,
`                        </span>`,
`                      </div>`,
`                      <span className="text-white/20 text-[8px] font-mono">{filteredLogs.filter(l => l.clip === selectedLogClip.rank || Math.abs(l.pos - selectedLogClip.pos) < 14).length}개</span>`,
`                    </div>`,
`                    {/* 로그 리스트 */}`,
`                    <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-[2px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-accent-purple/25 [&::-webkit-scrollbar-track]:bg-transparent">`,
`                      {filteredLogs.filter(l => l.clip === selectedLogClip.rank || Math.abs(l.pos - selectedLogClip.pos) < 14).length === 0 ? (`,
`                        <div className="flex flex-col items-center justify-center h-full gap-2 py-6">`,
`                          <span className="text-white/15 text-[9px]">이 클립 관련 로그 없음</span>`,
`                        </div>`,
`                      ) : (`,
`                        filteredLogs`,
`                          .filter(l => l.clip === selectedLogClip.rank || Math.abs(l.pos - selectedLogClip.pos) < 14)`,
`                          .map((log, i) => (`,
`                          <div key={i} className={\`flex items-start gap-2 px-3 py-2 border-b border-white/[0.03] \${`,
`                            log.clip === selectedLogClip.rank ? 'bg-accent-purple/[0.06]' : ''`,
`                          }\`}>`,
`                            <span className="text-white/20 text-[8px] font-mono flex-shrink-0 mt-px leading-tight">{log.time}</span>`,
`                            <span className={\`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1 \${`,
`                              log.type==='chat' ? 'bg-cyan-400' :`,
`                              log.type==='detect' ? 'bg-accent-purple' :`,
`                              log.type==='extract' ? 'bg-green-400' : 'bg-white/25'`,
`                            }\`}/>`,
`                            <span className={\`text-[9px] leading-relaxed \${`,
`                              log.type==='chat' ? 'text-cyan-400/75' :`,
`                              log.type==='detect' ? 'text-accent-purple/90' :`,
`                              log.type==='extract' ? 'text-green-400/90' : 'text-white/35'`,
`                            }\`}>{log.msg}</span>`,
`                          </div>`,
`                        ))`,
`                      )}`,
`                      {!animDone && (`,
`                        <div className="flex items-center gap-2 px-3 py-2">`,
`                          <span className="text-white/15 text-[8px] font-mono flex-shrink-0">──:──:──</span>`,
`                          <span className="w-1.5 h-1.5 rounded-full bg-white/15 flex-shrink-0"/>`,
`                          <span className="text-white/20 text-[9px]">분석 진행 중</span>`,
`                          <span className="flex gap-0.5 ml-1">`,
`                            {[0,1,2].map(d => (`,
`                              <span key={d} className="w-1 h-1 rounded-full bg-white/20 animate-pulse" style={{animationDelay:\`\${d*0.2}s\`}}/>`,
`                            ))}`,
`                          </span>`,
`                        </div>`,
`                      )}`,
`                    </div>`,
`                  </div>`,
];

// Replace 0-indexed 962~1014 (53 lines)
lines.splice(962, 53, ...clipLogs);

fs.writeFileSync(file, lines.join('\n'), 'utf8');
console.log('Done. Lines:', lines.length);
