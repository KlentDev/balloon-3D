import { useSectionTimeline } from '@/hooks/useSectionTimeline'
import { useEffect } from 'react'
import { gsap } from '@/lib/gsap'

export default function EnvelopeSection() {
  const sectionRef = useSectionTimeline('envelope')

  useEffect(() => {
    if (!sectionRef.current) return

    gsap.fromTo(
      sectionRef.current.querySelector('h2'),
      { opacity: 0, x: -50 },
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

    const leftCards = sectionRef.current.querySelectorAll('.envelope-card-left')
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
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'top 20%',
          scrub: 1,
        },
      }
    )

    const rightCards = sectionRef.current.querySelectorAll('.envelope-card-right')
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
      <div className="absolute inset-0 flex items-center justify-between px-4">
        {/* Left Content */}
        <div className="w-[380px] ml-8 space-y-6">
          <h2 className="text-4xl text-[#5c4a3a] font-bold mb-6" style={{ fontFamily: 'Caveat Brush, cursive' }}>
            The Envelope
          </h2>

          <div 
            className="envelope-card-left relative overflow-hidden rounded-3xl p-6 transition-all duration-500 hover:scale-[1.02] group" 
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.4)'
            }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <h3 className="text-2xl font-bold text-[#5c4a3a] mb-4" style={{ fontFamily: 'Caveat Brush, cursive' }}>
                Silk & Canvas
              </h3>
              <p className="text-base text-[#3a2a1a] leading-relaxed" style={{ fontFamily: 'Caveat Brush, cursive' }}>
                The balloon's envelope is crafted from layers of treated silk and canvas, painted in warm earth tones that glow golden in sunlight.
              </p>
            </div>
          </div>

          <div 
            className="envelope-card-left relative overflow-hidden rounded-3xl p-6 transition-all duration-500 hover:scale-[1.02] group" 
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.4)'
            }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <h3 className="text-2xl font-bold text-[#5c4a3a] mb-4" style={{ fontFamily: 'Caveat Brush, cursive' }}>
                Hot Air System
              </h3>
              <p className="text-base text-[#3a2a1a] leading-relaxed" style={{ fontFamily: 'Caveat Brush, cursive' }}>
                A brass burner heats the air within, creating lift through temperature difference. The system maintains altitude with minimal fuel consumption.
              </p>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="w-[380px] mr-8 space-y-6">
          <div 
            className="envelope-card-right relative overflow-hidden rounded-3xl p-6 transition-all duration-500 hover:scale-[1.02] group" 
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.4)'
            }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <h3 className="text-2xl font-bold text-[#5c4a3a] mb-4" style={{ fontFamily: 'Caveat Brush, cursive' }}>
                Graceful Ascent
              </h3>
              <p className="text-base text-[#3a2a1a] leading-relaxed" style={{ fontFamily: 'Caveat Brush, cursive' }}>
                The envelope expands majestically as it fills with heated air, lifting the vessel gently into the sky with quiet elegance.
              </p>
            </div>
          </div>

          <div 
            className="envelope-card-right relative overflow-hidden rounded-3xl p-6 transition-all duration-500 hover:scale-[1.02] group" 
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.4)'
            }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <h3 className="text-2xl font-bold text-[#5c4a3a] mb-4" style={{ fontFamily: 'Caveat Brush, cursive' }}>
                Weather Resistant
              </h3>
              <p className="text-base text-[#3a2a1a] leading-relaxed" style={{ fontFamily: 'Caveat Brush, cursive' }}>
                Treated with special oils and waxes, the fabric withstands rain, wind, and the harsh rays of high-altitude sun.
              </p>
            </div>
          </div>

          <div 
            className="envelope-card-right relative overflow-hidden rounded-3xl p-6 transition-all duration-500 hover:scale-[1.02] group" 
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.4)'
            }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <h3 className="text-2xl font-bold text-[#5c4a3a] mb-4" style={{ fontFamily: 'Caveat Brush, cursive' }}>
                Artistic Design
              </h3>
              <p className="text-base text-[#3a2a1a] leading-relaxed" style={{ fontFamily: 'Caveat Brush, cursive' }}>
                Hand-painted patterns adorn the surface, telling stories of distant lands and adventures yet to come.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
