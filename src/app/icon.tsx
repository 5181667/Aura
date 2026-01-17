import { ImageResponse } from 'next/og'
import { Brain } from 'lucide-react'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
        }}
      >
        <Brain size={24} color="#8b5cf6" strokeWidth={2} />
      </div>
    ),
    {
      ...size,
    }
  )
}
