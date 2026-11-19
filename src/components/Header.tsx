import { useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  Clock,
  Flower2,
  MapPin,
  Palette,
  Search,
  ShoppingBag,
  User,
  X,
} from 'lucide-react';
import {
  BOX_THEME_OPTIONS,
  CATEGORY_NAV_ITEMS,
  OCCASION_CIRCLES,
  PRODUCTS,
} from '../data/bloomboxData';
import { User as FirebaseUser } from 'firebase/auth';
import { CategorySlug, LocationHub, Product } from '../types';
import { SafeImage } from './SafeImage';

interface HeaderProps {
  selectedLocation: LocationHub;
  onOpenLocationModal: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeCategory: CategorySlug;
  onSelectCategory: (slug: CategorySlug) => void;
  onOpenCustomStudio: (product?: Product) => void;
  onOpenCart: () => void;
  cartCount: number;
  onOpenAuthModal: () => void;
  authUser: FirebaseUser | null;
  onSelectOccasion: (occasionTag: string) => void;
  onSelectProductQuick: (product: Product) => void;
}

export function Header({
  selectedLocation,
  onOpenLocationModal,
  searchQuery,
  onSearchChange,
  activeCategory,
  onSelectCategory,
  onOpenCustomStudio,
  onOpenCart,
  cartCount,
  onOpenAuthModal,
  authUser,
  onSelectOccasion,
  onSelectProductQuick,
}: HeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const matchingProducts = normalizedQuery
    ? PRODUCTS.filter(
        (p) =>
          p.title.toLowerCase().includes(normalizedQuery) ||
          p.shortDesc.toLowerCase().includes(normalizedQuery) ||
          p.occasions.some((o) => o.toLowerCase().includes(normalizedQuery)) ||
          p.categories.some((c) => c.toLowerCase().includes(normalizedQuery))
      ).slice(0, 5)
    : [];

  const matchingOccasions = normalizedQuery
    ? OCCASION_CIRCLES.filter((o) => o.label.toLowerCase().includes(normalizedQuery))
    : [];

  const matchingThemes = normalizedQuery
    ? BOX_THEME_OPTIONS.filter(
        (t) =>
          t.name.toLowerCase().includes(normalizedQuery) ||
          t.description.toLowerCase().includes(normalizedQuery)
      )
    : [];

  const showDropdown = searchFocused && normalizedQuery.length > 0;

  return (
    <div className="sticky top-0 z-40 bg-white shadow-[0_1px_0_0_rgba(31,41,30,0.08)]">
      {/* Top Announcement Strip */}
      <div className="bg-[#1F291E] px-4 py-1.5 text-center text-[11px] sm:text-xs font-medium text-white">
        <p className="mx-auto max-w-[1380px] truncate tracking-wide">
          Same-Day &amp; Midnight Surprise Delivery Across Dehradun | Free Custom Name &amp; Theme Box on Orders Above ₹999
        </p>
      </div>

      {/* Main Sticky Header */}
      <header className="mx-auto flex max-w-[1380px] flex-wrap items-center justify-between gap-3 px-4 py-2.5 lg:flex-nowrap lg:gap-5 lg:px-6 lg:py-3">
        {/* Left: Brand + Location Pill */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <button
            type="button"
            onClick={() => {
              onSelectCategory('all');
              onSearchChange('');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7D8035] rounded-lg"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7D8035] text-white shadow-sm">
              <Flower2 className="h-5 w-5" />
            </span>
            <span className="flex flex-col">
              <span className="font-display text-xl font-bold tracking-tight text-[#1F291E] leading-none">
                Bloom<span className="text-[#7D8035]">Box</span>
              </span>
              <span className="hidden sm:block text-[10px] font-medium tracking-wider text-[#E05A47] mt-0.5">
                CUSTOM GIFTING
              </span>
            </span>
          </button>

          {/* Interactive Location Pill */}
          <button
            type="button"
            onClick={onOpenLocationModal}
            className="group flex items-center gap-2 rounded-full border border-[#1F291E]/12 bg-[#F8F7F4] px-3 py-1.5 text-left transition-colors hover:border-[#7D8035] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7D8035]"
          >
            <MapPin className="h-4 w-4 shrink-0 text-[#E05A47]" />
            <div className="flex flex-col leading-tight">
              <span className="text-[10px] font-medium text-[#1F291E]/60 hidden sm:block">
                Where to deliver?
              </span>
              <span className="flex items-center gap-1 text-xs font-semibold text-[#1F291E] max-w-[135px] sm:max-w-[175px] truncate">
                <span className="tabular-nums">{selectedLocation.pincode}</span>
                <span>·</span>
                <span className="truncate">{selectedLocation.area}</span>
                <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[#1F291E]/50 group-hover:text-[#7D8035]" />
              </span>
            </div>
          </button>
        </div>

        {/* Center: Finder Search Bar */}
        <div
          ref={searchContainerRef}
          className="relative order-3 w-full lg:order-2 lg:flex-1 lg:max-w-xl"
        >
          <div className="relative flex items-center">
            <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-[#1F291E]/45" />
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setSearchFocused(true)}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setSearchFocused(true);
              }}
              placeholder="Search flowers, custom boxes, birthday combos, chocolates..."
              aria-label="Search gifts, flowers, cakes, and custom boxes"
              className="h-10 w-full rounded-full border border-[#1F291E]/15 bg-[#F8F7F4] pl-10 pr-9 text-sm text-[#1F291E] placeholder:text-[#1F291E]/50 transition-colors focus:border-[#7D8035] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7D8035]/20"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Clear search"
                className="absolute right-3 rounded-full p-1 text-[#1F291E]/50 hover:bg-[#1F291E]/10 hover:text-[#1F291E]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Instant Finder Dropdown */}
          {showDropdown && (
            <div className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-2xl border border-[#1F291E]/12 bg-white shadow-xl">
              {matchingProducts.length === 0 &&
              matchingOccasions.length === 0 &&
              matchingThemes.length === 0 ? (
                <div className="p-5 text-center text-sm text-[#1F291E]/65">
                  No gifts matched &ldquo;{searchQuery}&rdquo;. Try &ldquo;roses&rdquo;, &ldquo;bento cake&rdquo;, or &ldquo;polaroid&rdquo;.
                </div>
              ) : (
                <div className="max-h-[380px] overflow-y-auto divide-y divide-[#1F291E]/8">
                  {matchingProducts.length > 0 && (
                    <div className="p-2.5">
                      <p className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#1F291E]/50">
                        Matching Gifts
                      </p>
                      {matchingProducts.map((product) => (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => {
                            onSelectProductQuick(product);
                            setSearchFocused(false);
                          }}
                          className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-[#F8F7F4]"
                        >
                          <SafeImage
                            src={product.image}
                            alt={product.title}
                            className="h-11 w-11 shrink-0 rounded-lg object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-[#1F291E]">
                              {product.title}
                            </p>
                            <p className="text-xs text-[#1F291E]/60">
                              <span className="font-semibold text-[#7D8035] tabular-nums">
                                ₹{product.price}
                              </span>{' '}
                              · {product.deliveryText}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {(matchingOccasions.length > 0 || matchingThemes.length > 0) && (
                    <div className="bg-[#F8F7F4]/60 p-3 space-y-2.5">
                      {matchingOccasions.length > 0 && (
                        <div>
                          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#1F291E]/50">
                            Occasions
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {matchingOccasions.map((occ) => (
                              <button
                                key={occ.id}
                                type="button"
                                onClick={() => {
                                  if (occ.opensStudio) {
                                    onOpenCustomStudio();
                                  } else if (occ.occasionTag) {
                                    onSelectOccasion(occ.occasionTag);
                                  }
                                  setSearchFocused(false);
                                }}
                                className="rounded-lg border border-[#1F291E]/12 bg-white px-2.5 py-1 text-xs font-medium text-[#1F291E] hover:border-[#7D8035] hover:text-[#7D8035]"
                              >
                                {occ.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {matchingThemes.length > 0 && (
                        <div>
                          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#1F291E]/50">
                            Box Packaging Themes
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {matchingThemes.map((theme) => (
                              <button
                                key={theme.id}
                                type="button"
                                onClick={() => {
                                  onOpenCustomStudio();
                                  setSearchFocused(false);
                                }}
                                className="rounded-lg border border-[#7D8035]/30 bg-white px-2.5 py-1 text-xs font-medium text-[#7D8035] hover:bg-[#7D8035] hover:text-white"
                              >
                                {theme.name} Box
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Utility Action Buttons */}
        <div className="order-2 flex items-center gap-1 sm:gap-2 lg:order-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              onSelectCategory('same-day');
              document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hidden xl:flex flex-col items-center gap-0.5 rounded-xl px-2.5 py-1.5 text-[#1F291E] transition-colors hover:bg-[#F8F7F4] whitespace-nowrap"
          >
            <Clock className="h-4 w-4 text-[#E05A47]" />
            <span className="text-[11px] font-semibold">Same-Day</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenCustomStudio()}
            className="flex items-center gap-1.5 rounded-xl border border-[#7D8035]/30 bg-[#7D8035]/8 px-2.5 py-2 text-[#1F291E] transition-colors hover:bg-[#7D8035] hover:text-white whitespace-nowrap sm:px-3"
          >
            <Palette className="h-4 w-4 text-[#7D8035] group-hover:text-white shrink-0" />
            <span className="text-xs font-semibold hidden sm:inline">Custom Box Studio</span>
            <span className="text-xs font-semibold sm:hidden">Studio</span>
          </button>

          <div
            className="hidden md:flex flex-col items-center justify-center px-2 py-1 text-[#1F291E]/75 whitespace-nowrap select-none"
            title="Prices in Indian Rupees"
          >
            <span className="text-xs font-bold leading-none">₹</span>
            <span className="text-[10px] font-medium mt-0.5">INR ₹</span>
          </div>

          <button
            type="button"
            onClick={onOpenCart}
            className="relative flex flex-col items-center gap-0.5 rounded-xl px-2.5 py-1.5 text-[#1F291E] transition-colors hover:bg-[#F8F7F4] whitespace-nowrap"
            aria-label={`Open shopping cart with ${cartCount} items`}
          >
            <div className="relative">
              <ShoppingBag className="h-4.5 w-4.5" />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#E05A47] px-1 text-[10px] font-bold text-white tabular-nums">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[11px] font-semibold hidden sm:block">Cart</span>
          </button>

          <button
            type="button"
            onClick={onOpenAuthModal}
            className="flex flex-col items-center gap-0.5 rounded-xl px-2.5 py-1.5 text-[#1F291E] transition-colors hover:bg-[#F8F7F4] whitespace-nowrap"
          >
            {authUser?.photoURL ? (
              <img
                src={authUser.photoURL}
                alt={authUser.displayName || 'Account'}
                referrerPolicy="no-referrer"
                className="h-5 w-5 rounded-full object-cover border border-[#7D8035]/40"
              />
            ) : (
              <User className="h-4.5 w-4.5" />
            )}
            <span className="text-[11px] font-semibold hidden sm:block max-w-[72px] truncate">
              {authUser
                ? (authUser.displayName || authUser.email || 'Account').split(' ')[0]
                : 'Sign In'}
            </span>
          </button>
        </div>
      </header>

      {/* Horizontal Category Navigation Strip */}
      <nav
        aria-label="Gift Categories"
        className="border-t border-[#1F291E]/8 bg-white"
      >
        <div className="mx-auto flex max-w-[1380px] items-center gap-1.5 overflow-x-auto px-4 py-2 lg:px-6 no-scrollbar">
          {CATEGORY_NAV_ITEMS.map((item) => {
            const isActive = activeCategory === item.slug;
            return (
              <button
                key={item.slug}
                type="button"
                onClick={() => {
                  onSelectCategory(item.slug);
                  if (item.slug !== 'all') {
                    document
                      .getElementById('catalog-section')
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className={`relative flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[#7D8035] text-white shadow-xs'
                    : 'text-[#1F291E]/80 hover:bg-[#F8F7F4] hover:text-[#1F291E]'
                }`}
              >
                {item.hasRedDot && (
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isActive ? 'bg-white' : 'bg-[#E05A47]'
                    }`}
                    aria-hidden="true"
                  />
                )}
                <span>{item.label}</span>
                {item.badgeText && (
                  <span
                    className={`rounded px-1.5 py-0.5 text-[9px] font-bold tracking-wide leading-none ${
                      isActive
                        ? 'bg-white text-[#1F291E]'
                        : item.badgeVariant === 'coral'
                          ? 'bg-[#E05A47]/12 text-[#E05A47]'
                          : 'bg-[#7D8035]/15 text-[#7D8035]'
                    }`}
                  >
                    {item.badgeText}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
