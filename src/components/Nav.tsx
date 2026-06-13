import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const GOOGLE_FORM_LINK = 'https://docs.google.com/forms/d/e/1FAIpQLSf56_6z4cvxvFaRmbgW5zMxkxAYmG8rKBFBWeB4Be-ngUlJqA/viewform?usp=sharing&ouid=107121737297056392953'

const links = [
  { label: '서비스 소개', href: '#서비스소개' },
  { label: 'FAQ', href: '#FAQ' },
  { label: '인터뷰 신청', href: '#인터뷰신청' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? 'rgba(10,10,15,0.92)'
          : 'rgba(10,10,15,0.75)',
        backdropFilter: `blur(${scrolled ? '16px' : '8px'})`,
        WebkitBackdropFilter: `blur(${scrolled ? '16px' : '8px'})`,
        borderBottom: '1px solid #1e1e2e',
      }}
    >
      <nav className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <img src="/logo.png" alt="PokeClip" className="h-8 w-auto" />
          <span className="font-syne font-bold text-lg tracking-tight">
            <span style={{ color: '#a855f7' }}>Poke</span><span className="text-text-primary">Clip</span>
          </span>
        </a>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map(link => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-text-muted hover:text-text-primary transition-colors duration-200"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <a
          href={GOOGLE_FORM_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent-purple text-white text-sm font-semibold glow-purple glow-purple-hover hover:scale-105 transition-all duration-200"
        >
          인터뷰 신청하기
        </a>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-text-muted hover:text-text-primary transition-colors"
          onClick={() => setMenuOpen(v => !v)}
          aria-label="메뉴 열기"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-bg-border"
            style={{ background: 'rgba(10,10,15,0.97)' }}
          >
            <ul className="flex flex-col px-5 py-4 gap-4">
              {links.map(link => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="block text-base text-text-muted hover:text-text-primary transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={GOOGLE_FORM_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-accent-purple text-white text-sm font-semibold glow-purple w-full justify-center"
                  onClick={() => setMenuOpen(false)}
                >
                  인터뷰 신청하기
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
