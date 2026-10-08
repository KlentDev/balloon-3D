'use client'

import Scene from '@/components/canvas'
import SectionHero from '@/components/sections/SectionHero'
import SectionDetails from '@/components/sections/steers-section'
import TelescopeSection from '@/components/sections/section-telescope'
import WingsSection from '@/components/sections/wings-section'
import FooterSection from '@/components/sections/footer-section'
import SectionSteering from '@/components/sections/propeller-section'
import EnvelopeSection from '@/components/sections/envelope-section'

export default function Home() {
  return (
    <>
      {/* Layer 1: Background - z-0 */}
      <div className="fixed inset-0 z-0 bg-[url('/background.jpg')] bg-cover bg-center" />
      
      {/* Layer 2: Model - z-10. Large-viewport height so the canvas doesn't resize (and re-frame)
          when the mobile browser toolbar shows or hides. */}
      <div className="fixed inset-x-0 top-0 h-lvh z-10 pointer-events-none">
        <Scene />
      </div>

      {/* Layer 3: Content (sections + cards) - z-20 */}
      <div className="relative z-20">
        <SectionHero />
        <SectionSteering />
        <EnvelopeSection />
        <SectionDetails />
        <TelescopeSection />
        <WingsSection />
        <FooterSection />
      </div>
    </>
  )
}
