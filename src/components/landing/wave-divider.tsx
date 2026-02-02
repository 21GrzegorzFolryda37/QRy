'use client';

interface WaveDividerProps {
  variant?: 'wave1' | 'wave2' | 'wave3';
  position?: 'top' | 'bottom';
  fillColor?: string;
  animated?: boolean;
  className?: string;
}

export function WaveDivider({
  variant = 'wave1',
  position = 'bottom',
  fillColor = '#ffffff',
  animated = false,
  className = '',
}: WaveDividerProps) {
  const isTop = position === 'top';

  const waves = {
    wave1: (
      <svg
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className={`w-full h-full ${animated ? 'animate-wave' : ''}`}
      >
        <path
          d="M0 60L48 55C96 50 192 40 288 45C384 50 480 70 576 75C672 80 768 70 864 60C960 50 1056 40 1152 45C1248 50 1344 70 1392 80L1440 90V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0V60Z"
          fill={fillColor}
        />
      </svg>
    ),
    wave2: (
      <svg
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className={`w-full h-full ${animated ? 'animate-wave' : ''}`}
      >
        <path
          d="M0 40L60 50C120 60 240 80 360 85C480 90 600 80 720 65C840 50 960 30 1080 25C1200 20 1320 30 1380 35L1440 40V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V40Z"
          fill={fillColor}
        />
      </svg>
    ),
    wave3: (
      <svg
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className={`w-full h-full ${animated ? 'animate-wave' : ''}`}
      >
        <path
          d="M0 80L40 72C80 64 160 48 240 42.7C320 37 400 43 480 53.3C560 64 640 80 720 82.7C800 85 880 75 960 66.7C1040 58 1120 52 1200 50.7C1280 50 1360 54 1400 56L1440 58V120H1400C1360 120 1280 120 1200 120C1120 120 1040 120 960 120C880 120 800 120 720 120C640 120 560 120 480 120C400 120 320 120 240 120C160 120 80 120 40 120H0V80Z"
          fill={fillColor}
        />
      </svg>
    ),
  };

  return (
    <div
      className={`absolute left-0 right-0 w-full h-16 md:h-24 overflow-hidden pointer-events-none ${
        isTop ? 'top-0 rotate-180' : 'bottom-0'
      } ${className}`}
      aria-hidden="true"
    >
      {waves[variant]}
    </div>
  );
}
