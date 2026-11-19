import { OCCASION_CIRCLES } from '../data/bloomboxData';
import { CategorySlug } from '../types';
import { SafeImage } from './SafeImage';

interface OccasionsRowProps {
  activeOccasion: string | null;
  onSelectOccasionCircle: (opts: {
    categoryFilter?: CategorySlug;
    occasionTag?: string;
    opensStudio?: boolean;
  }) => void;
}

export function OccasionsRow({
  activeOccasion,
  onSelectOccasionCircle,
}: OccasionsRowProps) {
  return (
    <section className="mx-auto max-w-[1380px] px-4 py-6 lg:px-6 lg:py-8">
      <div className="mb-5 flex items-baseline justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-[#1F291E] sm:text-[26px]">
            Gifts for Every Occasion
          </h2>
          <p className="mt-0.5 text-sm text-[#1F291E]/65">
            Tap any occasion to filter curated gifts &amp; custom boxes
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 sm:grid-cols-4 md:grid-cols-8 md:gap-4">
        {OCCASION_CIRCLES.map((item) => {
          const isSelected =
            item.occasionTag && activeOccasion === item.occasionTag;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectOccasionCircle(item)}
              className="group flex flex-col items-center text-center focus-visible:outline-none"
            >
              <div
                className={`relative h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 overflow-hidden rounded-full border-2 p-0.5 transition-all duration-200 shadow-sm group-hover:shadow-md ${
                  isSelected
                    ? 'border-[#7D8035] ring-2 ring-[#7D8035]/25'
                    : 'border-white bg-white group-hover:border-[#7D8035]/60'
                }`}
              >
                <div className="h-full w-full overflow-hidden rounded-full bg-[#F8F7F4]">
                  <SafeImage
                    src={item.image}
                    alt={item.label}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-108"
                  />
                </div>
              </div>
              <span
                className={`mt-2 text-xs sm:text-[13px] font-semibold leading-tight transition-colors ${
                  isSelected
                    ? 'text-[#7D8035]'
                    : 'text-[#1F291E] group-hover:text-[#7D8035]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
