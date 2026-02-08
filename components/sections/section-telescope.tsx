import { useSectionTimeline } from '@/hooks/useSectionTimeline'
import { useEffect } from 'react'
import { gsap } from '@/lib/gsap'

export default function TelescopeSection() {
  const sectionRef = useSectionTimeline('telescope')

  useEffect(() => {
    if (!sectionRef.current) return

    gsap.fromTo(
      sectionRef.current.querySelector('h2'),
      { opacity: 0, x: 50 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'top 30%',
          scrub: 1,
        },
      }
    )

    const cards = sectionRef.current.querySelectorAll('.telescope-card')
    gsap.fromTo(
      cards,
      { opacity: 0, x: 40 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'top 20%',
          scrub: 1,
        },
      }
    )
  }, [])

  return (
    <section ref={sectionRef} className="h-screen overflow-hidden relative">
      <div className="absolute inset-0 flex items-center justify-end px-4">
        <div className="w-[450px] mr-8 space-y-6">
          <h2 className="text-4xl text-[#5c4a3a] font-bold mb-6" style={{ fontFamily: 'Caveat Brush, cursive' }}>
            The Telescope
          </h2>

          <div 
            className="telescope-card relative overflow-hidden rounded-3xl p-6 transition-all duration-500 hover:scale-[1.02] group" 
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.4)'
            }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <h3 className="text-2xl font-bold text-[#5c4a3a] mb-4" style={{ fontFamily: 'Caveat Brush, cursive' }}>
                Brass Observatory
              </h3>
              <p className="text-base text-[#3a2a1a] leading-relaxed" style={{ fontFamily: 'Caveat Brush, cursive' }}>
                A polished brass telescope mounted on the observation deck, offering crystal-clear views of distant horizons and celestial wonders above the clouds.
              </p>
            </div>
          </div>

          <div 
            className="telescope-card relative overflow-hidden rounded-3xl p-6 transition-all duration-500 hover:scale-[1.02] group" 
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.4)'
            }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <h3 className="text-2xl font-bold text-[#5c4a3a] mb-4" style={{ fontFamily: 'Caveat Brush, cursive' }}>
                Navigation Aid
              </h3>
              <p className="text-base text-[#3a2a1a] leading-relaxed" style={{ fontFamily: 'Caveat Brush, cursive' }}>
                Essential for charting courses and identifying landmarks from great heights. The telescope helps navigate through fog and identify safe landing zones.
              </p>
            </div>
          </div>

          <div 
            className="telescope-card relative overflow-hidden rounded-3xl p-6 transition-all duration-500 hover:scale-[1.02] group" 
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.4)'
            }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <h3 className="text-2xl font-bold text-[#5c4a3a] mb-4" style={{ fontFamily: 'Caveat Brush, cursive' }}>
                Stargazing Wonder
              </h3>
              <p className="text-base text-[#3a2a1a] leading-relaxed" style={{ fontFamily: 'Caveat Brush, cursive' }}>
                At night, the telescope reveals constellations and planets with stunning clarity, turning the journey into an astronomical adventure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
