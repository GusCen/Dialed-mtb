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
  const mountainSize = Math.round(size * 0.6);

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
          ...(isSmall ? { borderRadius: 6 } : {}),
        }}
      >
        <svg
          width={mountainSize}
          height={mountainSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
        </svg>
      </div>
    ),
    { width: size, height: size },
  );
}
