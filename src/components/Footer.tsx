import { Flower2, Mail, MapPin, Phone } from 'lucide-react';
import { DEHRADUN_LOCATIONS } from '../data/bloomboxData';
import { CategorySlug, LocationHub } from '../types';

interface FooterProps {
  onSelectCategory: (slug: CategorySlug) => void;
  onSelectLocation: (hub: LocationHub) => void;
  onOpenCustomStudio: () => void;
}

export function Footer({
  onSelectCategory,
  onSelectLocation,
  onOpenCustomStudio,
}: FooterProps) {
  const scrollToCatalog = () => {
    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1F291E] text-white">
      <div className="mx-auto max-w-[1380px] px-4 py-12 lg:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Story */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7D8035] text-white">
                <Flower2 className="h-5 w-5" />
              </span>
              <span className="font-display text-xl font-bold tracking-tight">
                Bloom<span className="text-[#C8CB74]">Box</span>
              </span>
            </div>
            <p className="text-xs font-semibold tracking-wide text-[#E5E8A8]">
              Choose it. Personalize it. Send the surprise.
            </p>
            <p className="text-xs leading-relaxed text-white/70">
              Dehradun&apos;s one-stop personalized quick-gifting platform combining fresh flowers, eggless bento cakes, chocolates, and custom-designed keepsake packaging for students and young professionals.
            </p>
          </div>

          {/* Quick Occasion Links */}
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-white/90">
              Quick Occasions
            </h3>
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onSelectCategory('birthday');
                    scrollToCatalog();
                  }}
                  className="hover:text-white transition-colors"
                >
                  Birthday Combos &amp; Bento Cakes
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onSelectCategory('anniversary');
                    scrollToCatalog();
                  }}
                  className="hover:text-white transition-colors"
                >
                  Anniversary Keepsake Boxes
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenCustomStudio}
                  className="hover:text-white transition-colors"
                >
                  Custom Box Packaging Studio
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onSelectCategory('same-day');
                    scrollToCatalog();
                  }}
                  className="hover:text-white transition-colors"
                >
                  60-Min &amp; Midnight Express
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onSelectCategory('under-999');
                    scrollToCatalog();
                  }}
                  className="hover:text-white transition-colors"
                >
                  Student Picks Under ₹999
                </button>
              </li>
            </ul>
          </div>

          {/* Dehradun Delivery Areas */}
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-white/90">
              Dehradun Delivery Hubs
            </h3>
            <ul className="space-y-2 text-xs text-white/70">
              {DEHRADUN_LOCATIONS.map((hub) => (
                <li key={hub.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectLocation(hub);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1.5 text-left hover:text-white transition-colors"
                  >
                    <MapPin className="h-3 w-3 shrink-0 text-[#C8CB74]" />
                    <span>
                      {hub.pincode} — {hub.area}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Studio Info */}
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-white/90">
              Dehradun Studio &amp; Support
            </h3>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#C8CB74]" />
                <span>Rajpur Road &amp; Clement Town Hub, Dehradun, Uttarakhand 248001</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 shrink-0 text-[#C8CB74]" />
                <span className="tabular-nums">+91 135 408 2480 (8 AM – 12 AM)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 shrink-0 text-[#C8CB74]" />
                <span>care@bloomboxdehradun.in</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-[11px] text-white/55 sm:flex-row">
          <p>© {new Date().getFullYear()} BloomBox Dehradun. Crafted for thoughtful surprises.</p>
          <p>Fresh Blooms · Custom Packaging · 60-Min Express Delivery</p>
        </div>
      </div>
    </footer>
  );
}
