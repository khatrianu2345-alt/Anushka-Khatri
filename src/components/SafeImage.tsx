import { useState } from 'react';
import { Gift } from 'lucide-react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'eager' | 'lazy';
}

export function SafeImage({ src, alt, className = '', loading = 'lazy' }: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#F8F7F4] via-[#EFECE4] to-[#E6E2D6] p-4 text-center ${className}`}
      >
        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#7D8035]/15 text-[#7D8035]">
          <Gift className="h-5 w-5" />
        </div>
        <span className="line-clamp-2 text-xs font-medium text-[#1F291E]/75">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
