import { useSectionTimeline } from '@/hooks/useSectionTimeline'

export default function FooterSection() {
  const sectionRef = useSectionTimeline('footer')

  return (
    <section ref={sectionRef} className="h-screen overflow-hidden relative flex items-end">
      <div
        data-scene-reserve
        className="w-full py-6 px-8"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.3)',
          boxShadow: '0 -4px 16px rgba(0,0,0,0.1)'
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[#3a2a1a]" style={{ fontFamily: 'Caveat Brush, cursive' }}>
            {/* Left Column */}
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-[#5c4a3a]">Credits</h3>
              <p className="text-sm leading-relaxed">
                This animated model is provided <strong>free to download</strong> under the{' '}
                <strong>CC BY License</strong>. Credit is required.
              </p>
              <a 
                href="https://drive.google.com/file/d/14iRtQu9UZ4N-82rr9dWRe1qHpwy8dzy0/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-[#5c4a3a] underline hover:text-[#3a2a1a] transition-colors text-sm"
              >
                Download (24.8 MB)
              </a>
            </div>

            {/* Middle Column */}
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[#5c4a3a]">Created by</h3>
              <p className="text-sm"><strong>Conrad Justin</strong></p>
              <p className="text-sm">Modeled, animated, and textured in <strong>Blender 2.92</strong></p>
              <p className="text-xs italic">Original piano composition (audio disabled by Epic Games)</p>
            </div>

            {/* Right Column */}
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[#5c4a3a]">Links</h3>
              <a 
                href="https://conradjustin.art"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-[#5c4a3a] underline hover:text-[#3a2a1a] transition-colors text-sm"
              >
                conradjustin.art
              </a>
              <a 
                href="https://twitter.com/ConradJustinArt"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-[#5c4a3a] underline hover:text-[#3a2a1a] transition-colors text-sm"
              >
                @ConradJustinArt
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
