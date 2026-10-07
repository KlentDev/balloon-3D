import { useSectionTimeline } from '@/hooks/useSectionTimeline'
import { useEffect } from 'react'
import { gsap } from '@/lib/gsap'

export default function SteeringSection() {
  const sectionRef = useSectionTimeline('steering')

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      // Animate the heading
      gsap.fromTo(
        section.querySelector('h2'),
        {
          opacity: 0,
          x: -50,
        },
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

      // Animate each card with stagger
      const cards = section.querySelectorAll('.steering-card')
      gsap.fromTo(
        cards,
        {
          opacity: 0,
          x: -40,
        },
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
      <div className="absolute inset-0 flex items-end justify-center pb-6 lg:items-center lg:justify-start lg:pb-0 px-4">
        {/* Left Content - Steering Wheel Details */}
        <div data-scene-reserve className="w-full lg:w-[450px] lg:ml-8 space-y-3 lg:space-y-6">
          <h2 className="text-3xl lg:text-4xl text-[#5c4a3a] font-bold mb-2 lg:mb-6" style={{ fontFamily: 'Caveat Brush, cursive' }}>
            Steering Wheel
          </h2>
          
          <div className="text-base text-[#3a2a1a] mb-2 lg:mb-8" style={{ fontFamily: 'Caveat Brush, cursive' }}>
            <p className="lg:mb-4">On the Captain&apos;s Bridge</p>
          </div>

          <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 lg:block lg:space-y-6 lg:overflow-visible lg:m-0 lg:p-0">
          <div
            className="steering-card relative overflow-hidden rounded-3xl p-4 lg:p-6 shrink-0 w-[85%] max-w-sm snap-center lg:w-auto lg:max-w-none transition-all duration-500 hover:scale-[1.02] group" 
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.4)'
            }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <h3 className="text-xl lg:text-2xl font-bold text-[#5c4a3a] mb-2 lg:mb-4" style={{ fontFamily: 'Caveat Brush, cursive' }}>
                Precision Control
              </h3>
              <p className="text-sm lg:text-base text-[#3a2a1a] leading-relaxed" style={{ fontFamily: 'Caveat Brush, cursive' }}>
                Hand-carved mahogany wheel with brass spokes, allowing the captain to execute even the slightest adjustments with grace and precision through the skies.
              </p>
            </div>
          </div>

          <div 
            className="steering-card relative overflow-hidden rounded-3xl p-4 lg:p-6 shrink-0 w-[85%] max-w-sm snap-center lg:w-auto lg:max-w-none transition-all duration-500 hover:scale-[1.02] group" 
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.4)'
            }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <h3 className="text-xl lg:text-2xl font-bold text-[#5c4a3a] mb-2 lg:mb-4" style={{ fontFamily: 'Caveat Brush, cursive' }}>
                Navigation Heart
              </h3>
              <p className="text-sm lg:text-base text-[#3a2a1a] leading-relaxed" style={{ fontFamily: 'Caveat Brush, cursive' }}>
                Positioned at the heart of command, the wheel connects to a system of pulleys and cables that guide the aircraft through wind currents and beyond the clouds.
              </p>
            </div>
          </div>

          <div 
            className="steering-card relative overflow-hidden rounded-3xl p-4 lg:p-6 shrink-0 w-[85%] max-w-sm snap-center lg:w-auto lg:max-w-none transition-all duration-500 hover:scale-[1.02] group" 
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.4)'
            }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <h3 className="text-xl lg:text-2xl font-bold text-[#5c4a3a] mb-2 lg:mb-4" style={{ fontFamily: 'Caveat Brush, cursive' }}>
                Captain&apos;s Legacy
              </h3>
              <p className="text-sm lg:text-base text-[#3a2a1a] leading-relaxed" style={{ fontFamily: 'Caveat Brush, cursive' }}>
                Worn smooth by countless hands across infinite journeys, the wheel stands as a testament to the art of navigation and the dreams of those who dared to fly.
              </p>
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  )
}
