import { useSectionTimeline } from '@/hooks/useSectionTimeline'
import { useEffect } from 'react'
import { gsap } from '@/lib/gsap'

export default function WingsSection() {
  const sectionRef = useSectionTimeline('wings')

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

    const cards = sectionRef.current.querySelectorAll('.wings-card')
    gsap.fromTo(
      cards,
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
  }, [])

  return (
    <section ref={sectionRef} className="h-screen overflow-hidden relative">
      <div className="absolute inset-0 flex items-center justify-start px-4">
        <div className="w-[450px] ml-8 space-y-6">
          <h2 className="text-4xl text-[#5c4a3a] font-bold mb-6" style={{ fontFamily: 'Caveat Brush, cursive' }}>
            The Wings
          </h2>

          <div 
            className="wings-card relative overflow-hidden rounded-3xl p-6 transition-all duration-500 hover:scale-[1.02] group" 
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.4)'
            }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <h3 className="text-2xl font-bold text-[#5c4a3a] mb-4" style={{ fontFamily: 'Caveat Brush, cursive' }}>
                Stabilizing Flight
              </h3>
              <p className="text-base text-[#3a2a1a] leading-relaxed" style={{ fontFamily: 'Caveat Brush, cursive' }}>
                Elegant canvas wings stretched over lightweight wooden frames provide stability and control during flight, catching wind currents with grace.
              </p>
            </div>
          </div>

          <div 
            className="wings-card relative overflow-hidden rounded-3xl p-6 transition-all duration-500 hover:scale-[1.02] group" 
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.4)'
            }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <h3 className="text-2xl font-bold text-[#5c4a3a] mb-4" style={{ fontFamily: 'Caveat Brush, cursive' }}>
                Aerodynamic Design
              </h3>
              <p className="text-base text-[#3a2a1a] leading-relaxed" style={{ fontFamily: 'Caveat Brush, cursive' }}>
                Inspired by bird flight, the wings can be adjusted to catch updrafts and glide smoothly through turbulent air with minimal effort.
              </p>
            </div>
          </div>

          <div 
            className="wings-card relative overflow-hidden rounded-3xl p-6 transition-all duration-500 hover:scale-[1.02] group" 
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.4)'
            }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <h3 className="text-2xl font-bold text-[#5c4a3a] mb-4" style={{ fontFamily: 'Caveat Brush, cursive' }}>
                Emergency Glide
              </h3>
              <p className="text-base text-[#3a2a1a] leading-relaxed" style={{ fontFamily: 'Caveat Brush, cursive' }}>
                In case of engine failure, the wings allow for controlled descent and safe emergency landings, making every journey secure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
