import { ArrowRight, Award, CakeSlice, Clock, PackageCheck } from 'lucide-react';
import { GIFTS_FOR_EVERYONE, GIFTS_FOR_FEELING } from '../data/bloomboxData';
import { SafeImage } from './SafeImage';

interface CurationRowsProps {
  activeRecipient: string | null;
  activeFeeling: string | null;
  onSelectRecipient: (recipient: string) => void;
  onSelectFeeling: (feeling: string) => void;
}

export function CurationRows({
  activeRecipient,
  activeFeeling,
  onSelectRecipient,
  onSelectFeeling,
}: CurationRowsProps) {
  return (
    <div className="bg-white">
      {/* Gifts for Everyone */}
      <section className="mx-auto max-w-[1380px] px-4 pt-10 pb-6 lg:px-6">
        <div className="mb-5 flex items-baseline justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-[#1F291E] sm:text-[26px]">
              Gifts for Everyone
            </h2>
            <p className="mt-0.5 text-sm text-[#1F291E]/65">
              Curated combos tailored for the people who matter most
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
          {GIFTS_FOR_EVERYONE.map((item) => {
            const isSelected = activeRecipient === item.recipient;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectRecipient(item.recipient)}
                className={`group flex flex-col overflow-hidden rounded-2xl border text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${
                  isSelected
                    ? 'border-[#7D8035] bg-[#F4F5EA] ring-2 ring-[#7D8035]/20'
                    : 'border-[#1F291E]/10 bg-[#F8F7F4]'
                }`}
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-white">
                  <SafeImage
                    src={item.image}
                    alt={item.label}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-sm font-bold text-[#1F291E] group-hover:text-[#7D8035]">
                      {item.label}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[#7D8035] opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-[11px] text-[#1F291E]/60">
                    {item.sublabel}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Gifts for Every Feeling */}
      <section className="mx-auto max-w-[1380px] px-4 py-6 lg:px-6 lg:pb-10">
        <div className="mb-5">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-[#1F291E] sm:text-[26px]">
            Gifts for Every Feeling
          </h2>
          <p className="mt-0.5 text-sm text-[#1F291E]/65">
            Say it with custom colors, handwritten notes &amp; fresh blooms
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5">
          {GIFTS_FOR_FEELING.map((item) => {
            const isSelected = activeFeeling === item.feeling;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectFeeling(item.feeling)}
                className={`group relative aspect-[4/3] overflow-hidden rounded-2xl text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${
                  isSelected ? 'ring-3 ring-[#7D8035]' : ''
                }`}
              >
                <SafeImage
                  src={item.image}
                  alt={item.label}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1F291E]/85 via-[#1F291E]/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
                  <span className="font-display text-base sm:text-lg font-semibold text-white">
                    {item.label}
                  </span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-xs transition-colors group-hover:bg-[#7D8035]">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Trust Metrics Bar */}
      <section className="border-t border-[#1F291E]/8 bg-[#F8F7F4]">
        <div className="mx-auto grid max-w-[1380px] grid-cols-1 gap-4 px-4 py-7 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#7D8035] shadow-xs border border-[#1F291E]/8">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#1F291E]">60-Min Express Delivery</p>
              <p className="text-xs text-[#1F291E]/65">Across Dehradun &amp; university campuses</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#7D8035] shadow-xs border border-[#1F291E]/8">
              <PackageCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#1F291E]">100% Custom Gift Packaging</p>
              <p className="text-xs text-[#1F291E]/65">Names, themes, Polaroids &amp; note cards</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#7D8035] shadow-xs border border-[#1F291E]/8">
              <CakeSlice className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#1F291E]">Fresh Blooms &amp; Eggless Cakes</p>
              <p className="text-xs text-[#1F291E]/65">Handcrafted daily by local Dehradun florists</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#7D8035] shadow-xs border border-[#1F291E]/8">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#1F291E]">4.9★ Rated by Students</p>
              <p className="text-xs text-[#1F291E]/65">Trusted by 18–30 young professionals</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
