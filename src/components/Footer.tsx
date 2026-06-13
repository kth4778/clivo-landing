export default function Footer() {
  return (
    <footer className="border-t border-bg-border py-8 px-5">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
          <img src="/logo.svg" alt="PokeClip" className="h-6 w-auto" />
          <span className="hidden sm:block text-text-hint text-sm">·</span>
          <span className="text-text-hint text-sm">소프트웨어 마에스트로 팀 3K</span>
        </div>
        <p className="text-text-hint text-sm">
          © 2025 PokeClip · 치지직·SOOP 전용 서비스
        </p>
      </div>
    </footer>
  )
}
