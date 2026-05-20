import { ImageResponse } from 'next/og';

export const contentType = 'image/png';

const SIZES = {
  small: 32,
  medium: 192,
  large: 512,
} as const;

type IconId = keyof typeof SIZES;

export function generateImageMetadata() {
  return (Object.keys(SIZES) as IconId[]).map((id) => ({
    id,
    contentType,
    size: { width: SIZES[id], height: SIZES[id] },
  }));
}

export default function Icon({ id }: { id: IconId }) {
  const size = SIZES[id];
  const isSmall = id === 'small';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f97316 0%, #dc2626 100%)',
          color: 'white',
          fontSize: Math.round(size * 0.7),
          fontWeight: 800,
          ...(isSmall ? { borderRadius: 6 } : {}),
        }}
      >
        D
      </div>
    ),
    { width: size, height: size },
  );
}
