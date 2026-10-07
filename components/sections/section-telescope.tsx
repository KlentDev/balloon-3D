import { useSectionTimeline } from '@/hooks/useSectionTimeline'
import { useEffect } from 'react'
import { gsap } from '@/lib/gsap'

export default function TelescopeSection() {
  const sectionRef = useSectionTimeline('telescope')

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelector('h2'),
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            end: 'top 30%',
            scrub: 1,
          },
        }
      )

      const cards = section.querySelectorAll('.telescope-card')
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
            trigger: section,
            start: 'top 70%',
            end: 'top 20%',
            scrub: 1,
          },
        }
      )
    }, section)
    return () => ctx.revert()
  }, [sectionRef])

  return (
    <section ref={sectionRef} className="h-screen overflow-hidden relative">
      <div className="absolute inset-0 flex items-end justify-center pb-6 lg:items-center lg:justify-end lg:pb-0 px-4">
        <div data-scene-reserve className="w-full lg:w-[450px] lg:mr-8 space-y-3 lg:space-y-6">
          <h2 className="text-3xl lg:text-4xl text-[#5c4a3a] font-bold mb-2 lg:mb-6" style={{ fontFamily: 'Caveat Brush, cursive' }}>
            The Telescope
          </h2>

          <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 lg:block lg:space-y-6 lg:overflow-visible lg:m-0 lg:p-0">
          <div 
            className="telescope-card relative overflow-hidden rounded-3xl p-4 lg:p-6 shrink-0 w-[85%] max-w-sm snap-center lg:w-auto lg:max-w-none transition-all duration-500 hover:scale-[1.02] group" 
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.4)'
            }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <h3 className="text-xl lg:text-2xl font-bold text-[#5c4a3a] mb-2 lg:mb-4" style={{ fontFamily: 'Caveat Brush, cursive' }}>
                Brass Observatory
              </h3>
              <p className="text-sm lg:text-base text-[#3a2a1a] leading-relaxed" style={{ fontFamily: 'Caveat Brush, cursive' }}>
                A polished brass telescope mounted on the observation deck, offering crystal-clear views of distant horizons and celestial wonders above the clouds.
              </p>
            </div>
          </div>

          <div 
            className="telescope-card relative overflow-hidden rounded-3xl p-4 lg:p-6 shrink-0 w-[85%] max-w-sm snap-center lg:w-auto lg:max-w-none transition-all duration-500 hover:scale-[1.02] group" 
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.4)'
            }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <h3 className="text-xl lg:text-2xl font-bold text-[#5c4a3a] mb-2 lg:mb-4" style={{ fontFamily: 'Caveat Brush, cursive' }}>
                Navigation Aid
              </h3>
              <p className="text-sm lg:text-base text-[#3a2a1a] leading-relaxed" style={{ fontFamily: 'Caveat Brush, cursive' }}>
                Essential for charting courses and identifying landmarks from great heights. The telescope helps navigate through fog and identify safe landing zones.
              </p>
            </div>
          </div>

          <div 
            className="telescope-card relative overflow-hidden rounded-3xl p-4 lg:p-6 shrink-0 w-[85%] max-w-sm snap-center lg:w-auto lg:max-w-none transition-all duration-500 hover:scale-[1.02] group" 
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.4)'
            }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <h3 className="text-xl lg:text-2xl font-bold text-[#5c4a3a] mb-2 lg:mb-4" style={{ fontFamily: 'Caveat Brush, cursive' }}>
                Stargazing Wonder
              </h3>
              <p className="text-sm lg:text-base text-[#3a2a1a] leading-relaxed" style={{ fontFamily: 'Caveat Brush, cursive' }}>
                At night, the telescope reveals constellations and planets with stunning clarity, turning the journey into an astronomical adventure.
              </p>
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  )
}
