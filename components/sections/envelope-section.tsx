import { useSectionTimeline } from '@/hooks/useSectionTimeline'
import { useEffect } from 'react'
import { gsap } from '@/lib/gsap'

export default function EnvelopeSection() {
  const sectionRef = useSectionTimeline('envelope')

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelector('h2'),
        { opacity: 0, x: -50 },
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

      const leftCards = section.querySelectorAll('.envelope-card-left')
      gsap.fromTo(
        leftCards,
        { opacity: 0, x: -40 },
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

      const rightCards = section.querySelectorAll('.envelope-card-right')
      gsap.fromTo(
        rightCards,
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
      <div className="absolute inset-0 flex flex-col justify-end gap-3 pb-6 lg:flex-row lg:items-center lg:justify-between lg:gap-0 lg:pb-0 px-4">
        {/* Left Content */}
        <div data-scene-reserve className="w-full lg:w-[380px] lg:ml-8 space-y-3 lg:space-y-6">
          <h2 className="text-3xl lg:text-4xl text-[#5c4a3a] font-bold mb-2 lg:mb-6" style={{ fontFamily: 'Caveat Brush, cursive' }}>
            The Envelope
          </h2>

          <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 lg:block lg:space-y-6 lg:overflow-visible lg:m-0 lg:p-0">
          <div 
            className="envelope-card-left relative overflow-hidden rounded-3xl p-4 lg:p-6 shrink-0 w-[85%] max-w-sm snap-center lg:w-auto lg:max-w-none transition-all duration-500 hover:scale-[1.02] group" 
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.4)'
            }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <h3 className="text-xl lg:text-2xl font-bold text-[#5c4a3a] mb-2 lg:mb-4" style={{ fontFamily: 'Caveat Brush, cursive' }}>
                Silk & Canvas
              </h3>
              <p className="text-sm lg:text-base text-[#3a2a1a] leading-relaxed" style={{ fontFamily: 'Caveat Brush, cursive' }}>
                The balloon&apos;s envelope is crafted from layers of treated silk and canvas, painted in warm earth tones that glow golden in sunlight.
              </p>
            </div>
          </div>

          <div 
            className="envelope-card-left relative overflow-hidden rounded-3xl p-4 lg:p-6 shrink-0 w-[85%] max-w-sm snap-center lg:w-auto lg:max-w-none transition-all duration-500 hover:scale-[1.02] group" 
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.4)'
            }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <h3 className="text-xl lg:text-2xl font-bold text-[#5c4a3a] mb-2 lg:mb-4" style={{ fontFamily: 'Caveat Brush, cursive' }}>
                Hot Air System
              </h3>
              <p className="text-sm lg:text-base text-[#3a2a1a] leading-relaxed" style={{ fontFamily: 'Caveat Brush, cursive' }}>
                A brass burner heats the air within, creating lift through temperature difference. The system maintains altitude with minimal fuel consumption.
              </p>
            </div>
          </div>
          </div>
        </div>

        {/* Right Content */}
        <div data-scene-reserve className="w-full lg:w-[380px] lg:mr-8">
          <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 lg:block lg:space-y-6 lg:overflow-visible lg:m-0 lg:p-0">
          <div 
            className="envelope-card-right relative overflow-hidden rounded-3xl p-4 lg:p-6 shrink-0 w-[85%] max-w-sm snap-center lg:w-auto lg:max-w-none transition-all duration-500 hover:scale-[1.02] group" 
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.4)'
            }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <h3 className="text-xl lg:text-2xl font-bold text-[#5c4a3a] mb-2 lg:mb-4" style={{ fontFamily: 'Caveat Brush, cursive' }}>
                Graceful Ascent
              </h3>
              <p className="text-sm lg:text-base text-[#3a2a1a] leading-relaxed" style={{ fontFamily: 'Caveat Brush, cursive' }}>
                The envelope expands majestically as it fills with heated air, lifting the vessel gently into the sky with quiet elegance.
              </p>
            </div>
          </div>

          <div 
            className="envelope-card-right relative overflow-hidden rounded-3xl p-4 lg:p-6 shrink-0 w-[85%] max-w-sm snap-center lg:w-auto lg:max-w-none transition-all duration-500 hover:scale-[1.02] group" 
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.4)'
            }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <h3 className="text-xl lg:text-2xl font-bold text-[#5c4a3a] mb-2 lg:mb-4" style={{ fontFamily: 'Caveat Brush, cursive' }}>
                Weather Resistant
              </h3>
              <p className="text-sm lg:text-base text-[#3a2a1a] leading-relaxed" style={{ fontFamily: 'Caveat Brush, cursive' }}>
                Treated with special oils and waxes, the fabric withstands rain, wind, and the harsh rays of high-altitude sun.
              </p>
            </div>
          </div>

          <div 
            className="envelope-card-right relative overflow-hidden rounded-3xl p-4 lg:p-6 shrink-0 w-[85%] max-w-sm snap-center lg:w-auto lg:max-w-none transition-all duration-500 hover:scale-[1.02] group" 
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.4)'
            }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <h3 className="text-xl lg:text-2xl font-bold text-[#5c4a3a] mb-2 lg:mb-4" style={{ fontFamily: 'Caveat Brush, cursive' }}>
                Artistic Design
              </h3>
              <p className="text-sm lg:text-base text-[#3a2a1a] leading-relaxed" style={{ fontFamily: 'Caveat Brush, cursive' }}>
                Hand-painted patterns adorn the surface, telling stories of distant lands and adventures yet to come.
              </p>
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  )
}
