import { useEffect, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Clock, Palette } from 'lucide-react';
import { HERO_SLIDES, PRODUCT_IMAGES } from '../data/bloomboxData';
import { CategorySlug, LocationHub } from '../types';
import { SafeImage } from './SafeImage';

interface HeroSectionProps {
  selectedLocation: LocationHub;
  onOpenCustomStudio: () => void;
  onSelectCategory: (slug: CategorySlug) => void;
}

export function HeroSection({
  selectedLocation,
  onOpenCustomStudio,
  onSelectCategory,
}: HeroSectionProps) {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, []);

  const current = HERO_SLIDES[activeSlide];

  const handleHeroCta = () => {
    if (current.ctaAction === 'studio') {
      onOpenCustomStudio();
    } else {
      onSelectCategory(current.ctaAction);
      document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="mx-auto max-w-[1380px] px-4 pt-4 pb-6 lg:px-6 lg:pt-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-stretch">
        {/* Left Primary Carousel (65% -> 8 cols on 12-col grid) */}
        <div className="relative overflow-hidden rounded-2xl bg-[#1F291E] lg:col-span-8 min-h-[340px] sm:min-h-[400px] lg:min-h-[420px]">
          <SafeImage
            src={current.image}
            alt={current.headline}
            loading="eager"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1F291E]/90 via-[#1F291E]/60 to-[#1F291E]/15" />

          <div className="relative z-10 flex h-full flex-col justify-between p-6 sm:p-9 lg:p-10">
            <div className="max-w-lg">
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-widest text-[#E5E8A8]">
                {current.kicker}
              </p>
              <h1 className="font-display text-3xl font-semibold leading-[1.12] tracking-tight text-white sm:text-4xl lg:text-[42px] [text-wrap:balance]">
                {current.headline}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-white/85 sm:text-base max-w-md">
                {current.subtext}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleHeroCta}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#7D8035] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#696B2B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <Palette className="h-4 w-4" />
                  <span>{current.ctaLabel}</span>
                </button>
                <span className="text-xs font-medium text-white/80">
                  Choose it. Personalize it. Send the surprise.
                </span>
              </div>

              {/* Carousel Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setActiveSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
                  }
                  aria-label="Previous hero slide"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-1.5 px-1">
                  {HERO_SLIDES.map((slide, idx) => (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => setActiveSlide(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                      className={`h-2 rounded-full transition-all ${
                        idx === activeSlide ? 'w-6 bg-white' : 'w-2 bg-white/45 hover:bg-white/75'
                      }`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
                  aria-label="Next hero slide"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Stacked Promo Cards (35% -> 4 cols on 12-col grid) */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1 lg:grid-rows-2">
          {/* Promo 1: Last-Minute Surprise */}
          <div
            onClick={() => {
              onSelectCategory('same-day');
              document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectCategory('same-day');
                document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="group relative flex cursor-pointer overflow-hidden rounded-2xl border border-[#1F291E]/10 bg-[#F8F7F4] p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex flex-1 flex-col justify-between pr-3">
              <div>
                <div className="mb-1.5 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#E05A47]">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{selectedLocation.isDehradun ? `${selectedLocation.expressMinutes}-Min Express` : 'Express Dispatch'}</span>
                </div>
                <h2 className="font-display text-xl font-semibold leading-snug text-[#1F291E]">
                  Last-Minute Surprise?
                </h2>
                <p className="mt-1.5 text-xs leading-relaxed text-[#1F291E]/70">
                  60-Min &amp; Midnight Express Delivery in Dehradun
                </p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#7D8035] group-hover:gap-2 transition-all">
                <span>Order Express</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
            <div className="h-full w-28 sm:w-32 shrink-0 overflow-hidden rounded-xl bg-white">
              <SafeImage
                src={PRODUCT_IMAGES.bentoCakeRoses}
                alt="60-Min Express Bento Cake and Roses"
                loading="eager"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Promo 2: Student & Campus Special */}
          <div
            onClick={() => {
              onSelectCategory('under-999');
              document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectCategory('under-999');
                document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="group relative flex cursor-pointer overflow-hidden rounded-2xl border border-[#1F291E]/10 bg-[#F4F5EA] p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex flex-1 flex-col justify-between pr-3">
              <div>
                <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-[#7D8035]">
                  Student &amp; Campus Special
                </p>
                <h2 className="font-display text-xl font-semibold leading-snug text-[#1F291E]">
                  Birthday Combos from ₹549
                </h2>
                <p className="mt-1.5 text-xs leading-relaxed text-[#1F291E]/70">
                  Curated Birthday Combos Starting at ₹599 — free note card included
                </p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#1F291E] group-hover:text-[#7D8035] group-hover:gap-2 transition-all">
                <span>Explore Under ₹999</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
            <div className="h-full w-28 sm:w-32 shrink-0 overflow-hidden rounded-xl bg-white">
              <SafeImage
                src={PRODUCT_IMAGES.jarCakeCarnation}
                alt="Student Birthday Combos under 999"
                loading="eager"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
