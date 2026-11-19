import { Check, Palette, Plus, Star, Truck, X } from 'lucide-react';
import { GridFilterTab, Product, SortOption } from '../types';
import { SafeImage } from './SafeImage';

interface ProductGridProps {
  products: Product[];
  activeGridTab: GridFilterTab;
  onChangeGridTab: (tab: GridFilterTab) => void;
  sortBy: SortOption;
  onChangeSort: (sort: SortOption) => void;
  activeFilterLabel: string | null;
  onClearAllFilters: () => void;
  onCustomizeProduct: (product: Product) => void;
  onQuickAddProduct: (product: Product) => void;
  recentlyAddedId: string | null;
}

const GRID_TABS: { id: GridFilterTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'bestsellers', label: 'Bestsellers' },
  { id: 'flowers-cakes', label: 'Flowers & Cakes' },
  { id: 'personalised', label: 'Personalised Boxes' },
  { id: 'under-1000', label: 'Under ₹1,000' },
];

export function ProductGrid({
  products,
  activeGridTab,
  onChangeGridTab,
  sortBy,
  onChangeSort,
  activeFilterLabel,
  onClearAllFilters,
  onCustomizeProduct,
  onQuickAddProduct,
  recentlyAddedId,
}: ProductGridProps) {
  return (
    <section
      id="catalog-section"
      className="bg-[#F8F7F4] py-10 lg:py-12 border-y border-[#1F291E]/6"
    >
      <div className="mx-auto max-w-[1380px] px-4 lg:px-6">
        {/* Section Header + Tabs + Sort */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-[#1F291E] sm:text-3xl">
              Shop By Bestsellers
            </h2>
            <p className="mt-1 text-sm text-[#1F291E]/65">
              Handcrafted boxes, fresh Dehradun blooms &amp; eggless cakes — ready to personalize
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 rounded-xl bg-white p-1 border border-[#1F291E]/10">
              {GRID_TABS.map((tab) => {
                const isActive = activeGridTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => onChangeGridTab(tab.id)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                      isActive
                        ? 'bg-[#1F291E] text-white'
                        : 'text-[#1F291E]/75 hover:bg-[#F8F7F4] hover:text-[#1F291E]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => onChangeSort(e.target.value as SortOption)}
              aria-label="Sort gifts"
              className="h-9 rounded-xl border border-[#1F291E]/15 bg-white px-3 text-xs font-semibold text-[#1F291E] focus:border-[#7D8035] focus:outline-none"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Active External Filter Bar */}
        {activeFilterLabel && (
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#7D8035]/25 bg-white px-4 py-2.5 text-xs">
            <span className="font-medium text-[#1F291E]">
              Showing gifts for:{' '}
              <strong className="font-semibold text-[#7D8035]">{activeFilterLabel}</strong>{' '}
              <span className="text-[#1F291E]/55 tabular-nums">({products.length} items)</span>
            </span>
            <button
              type="button"
              onClick={onClearAllFilters}
              className="inline-flex items-center gap-1 font-semibold text-[#E05A47] hover:underline"
            >
              <X className="h-3.5 w-3.5" />
              <span>Reset Filter</span>
            </button>
          </div>
        )}

        {/* Empty State */}
        {products.length === 0 ? (
          <div className="rounded-2xl border border-[#1F291E]/10 bg-white p-12 text-center">
            <p className="font-display text-xl font-semibold text-[#1F291E]">
              No gifts match your current filters
            </p>
            <p className="mt-1.5 text-sm text-[#1F291E]/65">
              Try clearing your search or switching to All Gifts to browse our full Dehradun collection.
            </p>
            <button
              type="button"
              onClick={onClearAllFilters}
              className="mt-5 rounded-xl bg-[#7D8035] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#696B2B]"
            >
              Show All 12 BloomBox Gifts
            </button>
          </div>
        ) : (
          /* 4-Column FNP Product Grid */
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => {
              const discountPct = Math.round(
                ((product.mrp - product.price) / product.mrp) * 100
              );
              const isJustAdded = recentlyAddedId === product.id;

              return (
                <article
                  key={product.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-[#1F291E]/8 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  {/* Square Photo Container */}
                  <div className="relative aspect-square w-full overflow-hidden bg-[#F8F7F4]">
                    <SafeImage
                      src={product.image}
                      alt={product.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {product.badge && (
                      <span
                        className={`absolute left-3 top-3 rounded-md px-2 py-1 text-[10px] font-bold tracking-wider uppercase shadow-xs ${
                          product.badge === '60 MIN DELIVERY'
                            ? 'bg-[#E05A47] text-white'
                            : product.badge === 'PERSONALISE IT!'
                              ? 'bg-[#1F291E] text-white'
                              : product.badge === 'STUDENT PICK'
                                ? 'bg-white text-[#7D8035] border border-[#7D8035]/30'
                                : 'bg-[#7D8035] text-white'
                        }`}
                      >
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="flex flex-1 flex-col justify-between p-4">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="line-clamp-2 min-h-[2.65rem] text-[15px] font-semibold leading-snug text-[#1F291E] group-hover:text-[#7D8035] transition-colors">
                          {product.title}
                        </h3>
                      </div>

                      {/* Rating Badge */}
                      <div className="mt-2 flex items-center gap-1.5 text-xs">
                        <span className="inline-flex items-center gap-1 rounded bg-[#7D8035]/12 px-1.5 py-0.5 font-bold text-[#7D8035] tabular-nums">
                          <span>{product.rating.toFixed(1)}</span>
                          <Star className="h-3 w-3 fill-[#7D8035] text-[#7D8035]" />
                        </span>
                        <span className="text-[#1F291E]/55 tabular-nums">
                          ({product.reviewCount})
                        </span>
                      </div>

                      {/* Price Row */}
                      <div className="mt-2.5 flex items-baseline gap-2 tabular-nums">
                        <span className="text-lg font-bold text-[#1F291E]">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-[#1F291E]/45 line-through">
                          ₹{product.mrp.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs font-bold text-[#E05A47]">
                          {discountPct}% OFF
                        </span>
                      </div>

                      {/* Earliest Delivery Indicator */}
                      <p className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-[#1F291E]/65">
                        <Truck className="h-3.5 w-3.5 shrink-0 text-[#7D8035]" />
                        <span className="truncate">{product.deliveryText}</span>
                      </p>
                    </div>

                    {/* Dual Action Buttons */}
                    <div className="mt-4 flex items-center gap-2 pt-3 border-t border-[#1F291E]/6">
                      <button
                        type="button"
                        onClick={() => onCustomizeProduct(product)}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#7D8035] bg-white px-3 py-2 text-xs font-semibold text-[#7D8035] transition-colors hover:bg-[#7D8035] hover:text-white whitespace-nowrap"
                      >
                        <Palette className="h-3.5 w-3.5 shrink-0" />
                        <span>Customize &amp; Add</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onQuickAddProduct(product)}
                        className={`flex items-center justify-center gap-1 rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                          isJustAdded
                            ? 'bg-[#1F291E] text-white'
                            : 'bg-[#7D8035] text-white hover:bg-[#696B2B]'
                        }`}
                      >
                        {isJustAdded ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <Plus className="h-3.5 w-3.5" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
