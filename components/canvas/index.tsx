'use client'

import dynamic from 'next/dynamic'

const Scene = dynamic(() => import('./Scene'), {
  ssr: false,
  loading: () => <div className="w-full h-screen bg-black" />,
})

export default Scene
