'use client'

import { useSectionTimeline } from '@/hooks/useSectionTimeline'
import { useScroll, useTransform, motion } from 'framer-motion'
import { useRef } from 'react'

export default function SectionHero() {
  const containerRef = useRef<HTMLElement>(null)
  const sectionRef = useSectionTimeline('hero')
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  })
  
  const leftX = useTransform(scrollYProgress, [0, 1], [0, -300])
  const rightX = useTransform(scrollYProgress, [0, 1], [0, 300])

  return (
    <section ref={(el) => { sectionRef.current = el; containerRef.current = el; }} className="h-screen overflow-hidden relative">
      {/* Right Sidebar - Full Height Navigation */}
      <motion.div 
        className="absolute right-0 top-0 h-full w-24 animate-slide-in-right flex flex-col"
        style={{
          x: rightX,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
          backdropFilter: 'blur(20px)',
          borderLeft: '1px solid rgba(255,255,255,0.3)',
          boxShadow: '-4px 0 16px rgba(0,0,0,0.1)'
        }}
      >
        {/* Top - Wheel Icon */}
        <div className="flex items-center justify-center pt-8 pb-6">
          <svg className="w-14 h-14 text-[#5c4a3a] animate-float" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="3" />
            <line x1="12" y1="2" x2="12" y2="9" />
            <line x1="12" y1="15" x2="12" y2="22" />
            <line x1="2" y1="12" x2="9" y2="12" />
            <line x1="15" y1="12" x2="22" y2="12" />
            <line x1="4.93" y1="4.93" x2="9.17" y2="9.17" />
            <line x1="14.83" y1="14.83" x2="19.07" y2="19.07" />
            <line x1="4.93" y1="19.07" x2="9.17" y2="14.83" />
            <line x1="14.83" y1="9.17" x2="19.07" y2="4.93" />
          </svg>
        </div>
        
        {/* Divider */}
        <div className="flex justify-center">
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#5c4a3a]/50 to-transparent" />
        </div>
        
        {/* Bottom - Section Icons */}
        <div className="flex-1 flex flex-col items-center justify-end space-y-6 pb-8">
          <svg className="w-12 h-12 text-[#5c4a3a] cursor-pointer hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          
          <svg className="w-12 h-12 text-[#5c4a3a] cursor-pointer hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
          </svg>
          
          <svg className="w-12 h-12 text-[#5c4a3a] cursor-pointer hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z" />
            <circle cx="12" cy="9" r="2" />
          </svg>
          
          <svg className="w-12 h-12 text-[#5c4a3a] cursor-pointer hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <line x1="12" y1="2" x2="12" y2="22" />
          </svg>
          
          <svg className="w-12 h-12 text-[#5c4a3a] cursor-pointer hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M17 8l4 4-4 4M3 12h18" />
          </svg>
        </div>
      </motion.div>

      {/* Left Content Area */}
      <motion.div style={{ x: leftX }} className="absolute left-8 top-1/2 -translate-y-1/2 w-[600px] space-y-6 animate-slide-in-left">
        {/* Title Section */}
        <div className="space-y-5">
          <div 
            className="inline-block px-4 py-2 rounded-full animate-fade-in"
            style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.3)'
            }}
          >
            <h2 className="text-lg text-[#5c4a3a]" style={{ fontFamily: 'Caveat Brush, cursive' }}>
              An Odyssey Above the Earth
            </h2>
          </div>
          
          <h1 
            className="text-7xl font-bold animate-fade-in whitespace-nowrap mt-4" 
            style={{ 
              fontFamily: 'Uncial Antiqua, serif',
              color: '#5c4a3a',
              letterSpacing: '0.1em',
              animationDelay: '0.1s'
            }}
          >
            FLYING ATLAS
          </h1>
          
          <p className="text-lg leading-relaxed text-[#3a2a1a] max-w-md animate-fade-in" style={{ fontFamily: 'Caveat Brush, cursive', animationDelay: '0.2s' }}>
            A magnificent vessel of brass and steam, its burnished hull gleaming like molten gold beneath the sun. Born from the forge of master craftsmen, this mechanical marvel drifts through cerulean skies and amber-lit clouds, carried by warm currents that whisper of distant lands. Each rivet and gear tells a story of adventure, while endless horizons beckon with promises of wonder yet unseen.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="space-y-3 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center space-x-3">
            <svg className="w-6 h-6 text-[#5c4a3a]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-base text-[#3a2a1a]" style={{ fontFamily: 'Caveat Brush, cursive' }}>Hand-crafted brass construction</p>
          </div>
          <div className="flex items-center space-x-3">
            <svg className="w-6 h-6 text-[#5c4a3a]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-base text-[#3a2a1a]" style={{ fontFamily: 'Caveat Brush, cursive' }}>Precision navigation system</p>
          </div>
          <div className="flex items-center space-x-3">
            <svg className="w-6 h-6 text-[#5c4a3a]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-base text-[#3a2a1a]" style={{ fontFamily: 'Caveat Brush, cursive' }}>Vintage steampunk aesthetic</p>
          </div>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div 
            className="relative overflow-hidden rounded-3xl p-6 text-center transition-all duration-500 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.3)'
            }}
          >
            <p className="text-4xl font-bold text-[#5c4a3a] mb-2" style={{ fontFamily: 'Caveat Brush, cursive' }}>750m</p>
            <p className="text-sm text-[#3a2a1a]" style={{ fontFamily: 'Caveat Brush, cursive' }}>Altitude</p>
          </div>

          <div 
            className="relative overflow-hidden rounded-3xl p-6 text-center transition-all duration-500 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.3)'
            }}
          >
            <p className="text-4xl font-bold text-[#5c4a3a] mb-2" style={{ fontFamily: 'Caveat Brush, cursive' }}>18km/h</p>
            <p className="text-sm text-[#3a2a1a]" style={{ fontFamily: 'Caveat Brush, cursive' }}>Speed</p>
          </div>

          <div 
            className="relative overflow-hidden rounded-3xl p-6 text-center transition-all duration-500 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.3)'
            }}
          >
            <p className="text-4xl font-bold text-[#5c4a3a] mb-2" style={{ fontFamily: 'Caveat Brush, cursive' }}>6hrs</p>
            <p className="text-sm text-[#3a2a1a]" style={{ fontFamily: 'Caveat Brush, cursive' }}>Duration</p>
          </div>

          <div 
            className="relative overflow-hidden rounded-3xl p-6 text-center transition-all duration-500 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.3)'
            }}
          >
            <p className="text-4xl font-bold text-[#5c4a3a] mb-2" style={{ fontFamily: 'Caveat Brush, cursive' }}>2</p>
            <p className="text-sm text-[#3a2a1a]" style={{ fontFamily: 'Caveat Brush, cursive' }}>Voyagers</p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
