import { ImageResponse } from 'next/og'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #09090b 0%, #18181b 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '25%',
          border: '1px solid #27272a',
          boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)',
        }}
      >
        <div
          style={{
            fontSize: 18,
            fontWeight: 900,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            background: 'linear-gradient(135deg, #a78bfa 0%, #2dd4bf 100%)',
            backgroundClip: 'text',
            color: 'transparent',
            letterSpacing: '-1.5px',
            marginLeft: '1px',
          }}
        >
          DV
        </div>
      </div>
    ),
    { ...size }
  )
}
