import { useSectionTimeline } from '@/hooks/useSectionTimeline'
import { useEffect } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

export default function PropellerSection() {
  const sectionRef = useSectionTimeline('propeller')

  useEffect(() => {
    if (!sectionRef.current) return

    // Animate the heading
    gsap.fromTo(
      sectionRef.current.querySelector('h2'),
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
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

    // Animate each card with stagger
    const cards = sectionRef.current.querySelectorAll('.detail-card')
    gsap.fromTo(
      cards,
      {
        opacity: 0,
        y: 40,
      },
      {
        opacity: 1,
        y: 0,
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
        {/* Right Content - Propeller Details */}
        <div className="w-[450px] mr-8 space-y-6">
          <h2 className="text-4xl text-[#5c4a3a] font-bold mb-6" style={{ fontFamily: 'Caveat Brush, cursive' }}>
            Propeller System
          </h2>

          <div 
            className="detail-card relative overflow-hidden rounded-3xl p-6 transition-all duration-500 hover:scale-[1.02] group" 
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.4)'
            }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <h3 className="text-2xl font-bold text-[#5c4a3a] mb-4" style={{ fontFamily: 'Caveat Brush, cursive' }}>
                Dual Propulsion
              </h3>
              <p className="text-base text-[#3a2a1a] leading-relaxed" style={{ fontFamily: 'Caveat Brush, cursive' }}>
                Twin brass propellers spin in perfect harmony, each blade hand-forged and balanced for optimal thrust. The front propeller pulls while the rear pushes, creating stable forward momentum.
              </p>
            </div>
          </div>

          <div 
            className="detail-card relative overflow-hidden rounded-3xl p-6 transition-all duration-500 hover:scale-[1.02] group" 
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.4)'
            }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <h3 className="text-2xl font-bold text-[#5c4a3a] mb-4" style={{ fontFamily: 'Caveat Brush, cursive' }}>
                Mechanical Precision
              </h3>
              <p className="text-base text-[#3a2a1a] leading-relaxed" style={{ fontFamily: 'Caveat Brush, cursive' }}>
                Gear-driven rotation at 24 RPM ensures smooth, reliable power. The clockwork mechanism requires minimal maintenance and operates silently through the clouds.
              </p>
            </div>
          </div>

          <div 
            className="detail-card relative overflow-hidden rounded-3xl p-6 transition-all duration-500 hover:scale-[1.02] group" 
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.4)'
            }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <h3 className="text-2xl font-bold text-[#5c4a3a] mb-4" style={{ fontFamily: 'Caveat Brush, cursive' }}>
                Directional Control
              </h3>
              <p className="text-base text-[#3a2a1a] leading-relaxed" style={{ fontFamily: 'Caveat Brush, cursive' }}>
                Adjustable pitch allows for precise speed control and directional changes. The pilot can fine-tune thrust to navigate wind currents with ease.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
