import { ChangeEvent, useEffect, useState } from 'react';
import {
  Camera,
  Check,
  Eye,
  Heart,
  ImagePlus,
  ShoppingBag,
  Sparkles,
  Upload,
  X,
} from 'lucide-react';
import {
  ADD_ON_OPTIONS,
  BOX_COLOR_OPTIONS,
  BOX_THEME_OPTIONS,
  PRESET_MEMORY_PHOTOS,
  PRODUCTS,
} from '../data/bloomboxData';
import { CustomBoxConfig, Product } from '../types';
import { SafeImage } from './SafeImage';

interface CustomBoxStudioModalProps {
  isOpen: boolean;
  initialProduct: Product | null;
  onClose: () => void;
  onAddCustomToCart: (product: Product, config: CustomBoxConfig, totalUnitPrice: number) => void;
}

export function CustomBoxStudioModal({
  isOpen,
  initialProduct,
  onClose,
  onAddCustomToCart,
}: CustomBoxStudioModalProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product>(
    initialProduct || PRODUCTS[0]
  );
  const [boxColorId, setBoxColorId] = useState<string>(
    initialProduct?.defaultBoxColorId || 'blush-pink'
  );
  const [themeId, setThemeId] = useState<string>(
    initialProduct?.defaultThemeId || 'floral-botanical'
  );
  const [recipientName, setRecipientName] = useState<string>('Rhea');
  const [messageCard, setMessageCard] = useState<string>(
    'Wishing you the happiest day! Hope this box brings the biggest smile to your face.'
  );
  const [photoUrl, setPhotoUrl] = useState<string | null>(
    PRESET_MEMORY_PHOTOS[0].image
  );
  const [photoLabel, setPhotoLabel] = useState<string>(
    PRESET_MEMORY_PHOTOS[0].caption
  );
  const [addOnIds, setAddOnIds] = useState<string[]>([]);
  const [previewLidOpen, setPreviewLidOpen] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen) {
      const target = initialProduct || PRODUCTS[0];
      setSelectedProduct(target);
      setBoxColorId(target.defaultBoxColorId || 'blush-pink');
      setThemeId(target.defaultThemeId || 'floral-botanical');
      setPreviewLidOpen(true);
    }
  }, [isOpen, initialProduct]);

  if (!isOpen) return null;

  const activeColor =
    BOX_COLOR_OPTIONS.find((c) => c.id === boxColorId) || BOX_COLOR_OPTIONS[0];
  const activeTheme =
    BOX_THEME_OPTIONS.find((t) => t.id === themeId) || BOX_THEME_OPTIONS[0];

  const addOnsTotal = addOnIds.reduce((sum, id) => {
    const found = ADD_ON_OPTIONS.find((a) => a.id === id);
    return sum + (found ? found.price : 0);
  }, 0);

  const totalUnitPrice = selectedProduct.price + addOnsTotal;

  const toggleAddOn = (id: string) => {
    setAddOnIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhotoUrl(reader.result);
        setPhotoLabel(file.name.replace(/\.[^/.]+$/, '').slice(0, 22) || 'Our Memory');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmAdd = () => {
    onAddCustomToCart(
      selectedProduct,
      {
        boxColorId,
        themeId,
        recipientName: recipientName.trim() || 'Someone Special',
        messageCard: messageCard.trim(),
        photoUrl,
        photoLabel: photoLabel.trim() || 'Our Memory',
        addOnIds,
      },
      totalUnitPrice
    );
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F291E]/65 p-3 sm:p-5 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="custom-studio-title"
    >
      <div className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl lg:flex-row">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close Custom Box Studio"
          className="absolute right-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#1F291E] shadow-sm border border-[#1F291E]/10 hover:bg-[#1F291E] hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Left Column: Live 3D-Style Visual Box Preview */}
        <div className="relative flex flex-col justify-between bg-[#F8F7F4] p-5 sm:p-7 lg:w-[48%] border-b lg:border-b-0 lg:border-r border-[#1F291E]/10 overflow-y-auto">
          <div className="flex items-center justify-between gap-2 pr-10 lg:pr-0">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#7D8035]">
                Live Box Preview
              </p>
              <h3 className="font-display text-lg font-semibold text-[#1F291E]">
                {activeColor.name} · {activeTheme.name}
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setPreviewLidOpen((prev) => !prev)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#1F291E]/15 bg-white px-3 py-1.5 text-xs font-semibold text-[#1F291E] shadow-2xs hover:border-[#7D8035] hover:text-[#7D8035] transition-colors"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>{previewLidOpen ? 'View Outer Lid' : 'Open Box View'}</span>
            </button>
          </div>

          {/* 3D Interactive Box Stage */}
          <div className="my-5 flex flex-1 items-center justify-center">
            {previewLidOpen ? (
              /* OPEN BOX 3D PERSPECTIVE PREVIEW */
              <div className="w-full max-w-[360px] transition-all duration-300">
                {/* Inside Open Lid (tilted top flap) */}
                <div
                  className="relative mx-auto w-[92%] rounded-t-2xl border border-black/10 p-4 shadow-md transition-colors duration-300"
                  style={{
                    backgroundColor: activeColor.lidHex,
                    color: activeColor.textHex,
                    transform: 'perspective(700px) rotateX(8deg)',
                    transformOrigin: 'bottom center',
                  }}
                >
                  {/* Theme Decorative Pattern Overlay */}
                  <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-t-2xl opacity-20">
                    {themeId === 'birthday-confetti' && (
                      <div className="flex flex-wrap gap-3 p-2 text-xs">
                        <span>✦</span><span>●</span><span>★</span><span>◆</span><span>✦</span><span>●</span>
                        <span>★</span><span>◆</span><span>✦</span><span>●</span><span>★</span><span>◆</span>
                      </div>
                    )}
                    {themeId === 'romantic-hearts' && (
                      <div className="flex flex-wrap gap-4 p-2">
                        <Heart className="h-3.5 w-3.5 fill-current" />
                        <Heart className="h-3 w-3 fill-current" />
                        <Heart className="h-3.5 w-3.5 fill-current" />
                        <Heart className="h-3 w-3 fill-current" />
                      </div>
                    )}
                    {themeId === 'floral-botanical' && (
                      <div className="h-full w-full border-2 border-dashed border-current/40 rounded-t-xl" />
                    )}
                  </div>

                  {/* Recipient Name on Lid */}
                  <div className="relative z-10 mb-3 text-center">
                    <p className="text-[9px] font-bold uppercase tracking-[0.22em] opacity-75">
                      Crafted Especially For
                    </p>
                    <p className="font-display text-lg font-bold tracking-wide truncate">
                      {recipientName.trim() || 'Someone Special'}
                    </p>
                  </div>

                  {/* Inside-Lid Polaroid + Handwritten Note Card */}
                  <div className="relative z-10 grid grid-cols-12 gap-2.5 items-center">
                    {/* Polaroid Photo */}
                    <div className="col-span-5 -rotate-3 rounded-sm bg-white p-1.5 pb-3 shadow-md text-[#1F291E]">
                      <div className="aspect-square w-full overflow-hidden bg-[#F8F7F4]">
                        {photoUrl ? (
                          <SafeImage
                            src={photoUrl}
                            alt={photoLabel}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[#1F291E]/30">
                            <Camera className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                      <p className="mt-1 truncate text-center font-display text-[9px] italic text-[#1F291E]/80">
                        {photoLabel || 'Our Memory'}
                      </p>
                    </div>

                    {/* Message Card */}
                    <div className="col-span-7 rotate-1 rounded-md bg-[#FFFDF8] p-2.5 shadow-md text-[#1F291E] border border-[#1F291E]/8 min-h-[96px] flex flex-col justify-between">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-[#7D8035]">
                        Personal Note
                      </p>
                      <p className="my-1 line-clamp-4 font-display text-[11px] italic leading-snug text-[#1F291E]/90">
                        &ldquo;{messageCard.trim() || 'With lots of love & warm wishes!'}&rdquo;
                      </p>
                      <p className="text-right text-[9px] font-semibold text-[#1F291E]/50">
                        — BloomBox Card
                      </p>
                    </div>
                  </div>
                </div>

                {/* Open Box Base (containing selected gift & add-ons) */}
                <div
                  className="relative mx-auto rounded-b-2xl border-x border-b border-black/15 p-4 shadow-xl transition-colors duration-300"
                  style={{
                    backgroundColor: activeColor.outerHex,
                  }}
                >
                  {/* Inner Box Cavity */}
                  <div
                    className="rounded-xl p-3 shadow-inner transition-colors duration-300"
                    style={{ backgroundColor: activeColor.innerHex }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-[#1F291E]/10 bg-white shadow-xs">
                        <SafeImage
                          src={selectedProduct.image}
                          alt={selectedProduct.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#7D8035]">
                          Inside Your Box
                        </span>
                        <p className="line-clamp-2 text-xs font-bold text-[#1F291E] leading-snug mt-0.5">
                          {selectedProduct.title}
                        </p>
                        {addOnIds.length > 0 && (
                          <div className="mt-1.5 flex flex-wrap gap-1">
                            {addOnIds.map((id) => {
                              const addon = ADD_ON_OPTIONS.find((a) => a.id === id);
                              if (!addon) return null;
                              return (
                                <span
                                  key={id}
                                  className="rounded bg-[#7D8035]/15 px-1.5 py-0.5 text-[9px] font-semibold text-[#1F291E]"
                                >
                                  +{addon.shortLabel}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Satin Ribbon Trim */}
                  <div
                    className="mt-3 flex items-center justify-between rounded-lg px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase"
                    style={{
                      backgroundColor: activeColor.ribbonHex,
                      color:
                        activeColor.ribbonHex === '#F8F7F4' ||
                        activeColor.ribbonHex === '#F6E6C2'
                          ? '#1F291E'
                          : '#FFFFFF',
                    }}
                  >
                    <span>BloomBox Signature Wrap</span>
                    <span>Dehradun Studio</span>
                  </div>
                </div>
              </div>
            ) : (
              /* CLOSED OUTER LID PREVIEW */
              <div
                className="relative flex aspect-square w-full max-w-[300px] flex-col items-center justify-center rounded-2xl border border-black/15 p-6 text-center shadow-2xl transition-all duration-300"
                style={{
                  backgroundColor: activeColor.outerHex,
                  color: activeColor.textHex,
                }}
              >
                {/* Vertical & Horizontal Ribbon */}
                <div
                  className="pointer-events-none absolute inset-y-0 left-1/2 w-7 -translate-x-1/2 opacity-85"
                  style={{ backgroundColor: activeColor.ribbonHex }}
                />
                <div
                  className="pointer-events-none absolute inset-x-0 top-1/2 h-7 -translate-y-1/2 opacity-85"
                  style={{ backgroundColor: activeColor.ribbonHex }}
                />

                {/* Center Monogram Plaque */}
                <div className="relative z-10 w-full max-w-[210px] rounded-xl border border-[#1F291E]/15 bg-white/95 px-4 py-5 text-[#1F291E] shadow-lg backdrop-blur-xs">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7D8035]">
                    {activeTheme.name}
                  </p>
                  <p className="mt-1.5 font-display text-xl font-bold text-[#1F291E] truncate">
                    For {recipientName.trim() || 'You'}
                  </p>
                  <p className="mt-1 text-[11px] text-[#1F291E]/60">
                    Open to reveal Polaroid &amp; note
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Summary Bar on Left Panel */}
          <div className="rounded-xl border border-[#1F291E]/10 bg-white p-3 text-xs text-[#1F291E]/75">
            <div className="flex items-center justify-between">
              <span className="font-medium">Free Custom Name &amp; Theme Packaging</span>
              <span className="font-bold text-[#7D8035]">INCLUDED</span>
            </div>
          </div>
        </div>

        {/* Right Column: Step-by-Step Interactive Customizer */}
        <div className="flex flex-1 flex-col overflow-hidden lg:w-[52%]">
          <div className="border-b border-[#1F291E]/10 px-5 py-4 sm:px-6">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#E05A47]">
              BloomBox Custom Packaging Studio
            </p>
            <h2
              id="custom-studio-title"
              className="font-display text-xl font-semibold text-[#1F291E] sm:text-2xl"
            >
              Personalize Your Surprise Box
            </h2>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5 sm:px-6">
            {/* Base Gift Switcher (if opened from Hero/Header or user wants to swap gift) */}
            <div>
              <label
                htmlFor="base-gift-select"
                className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#1F291E]/70"
              >
                Gift Inside the Box
              </label>
              <select
                id="base-gift-select"
                value={selectedProduct.id}
                onChange={(e) => {
                  const found = PRODUCTS.find((p) => p.id === e.target.value);
                  if (found) setSelectedProduct(found);
                }}
                className="w-full rounded-xl border border-[#1F291E]/15 bg-[#F8F7F4] px-3.5 py-2.5 text-sm font-semibold text-[#1F291E] focus:border-[#7D8035] focus:bg-white focus:outline-none"
              >
                {PRODUCTS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} — ₹{p.price}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 1: Box Color & Theme */}
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#7D8035]">
                  Step 1 — Choose Outer Box Color &amp; Theme
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2.5">
                  {BOX_COLOR_OPTIONS.map((swatch) => {
                    const active = boxColorId === swatch.id;
                    return (
                      <button
                        key={swatch.id}
                        type="button"
                        onClick={() => setBoxColorId(swatch.id)}
                        className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                          active
                            ? 'border-[#1F291E] bg-[#F8F7F4] ring-2 ring-[#7D8035]/30'
                            : 'border-[#1F291E]/12 bg-white hover:border-[#1F291E]/35'
                        }`}
                      >
                        <span
                          className="h-4 w-4 rounded-full border border-black/15 shrink-0"
                          style={{ backgroundColor: swatch.outerHex }}
                        />
                        <span>{swatch.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold text-[#1F291E]/75">
                  Outer Lid Theme Pattern
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {BOX_THEME_OPTIONS.map((theme) => {
                    const active = themeId === theme.id;
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => setThemeId(theme.id)}
                        className={`rounded-xl border p-2.5 text-left transition-colors ${
                          active
                            ? 'border-[#7D8035] bg-[#F4F5EA]'
                            : 'border-[#1F291E]/12 bg-white hover:bg-[#F8F7F4]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#1F291E]">
                            {theme.name}
                          </span>
                          {active && <Check className="h-3.5 w-3.5 text-[#7D8035]" />}
                        </div>
                        <p className="mt-0.5 text-[11px] text-[#1F291E]/60 leading-snug">
                          {theme.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Step 2: Personalize Name, Photo & Message */}
            <div className="space-y-4 border-t border-[#1F291E]/8 pt-5">
              <p className="text-xs font-bold uppercase tracking-wider text-[#7D8035]">
                Step 2 — Personalize the Box
              </p>

              <div>
                <label
                  htmlFor="recipient-name-input"
                  className="mb-1.5 block text-xs font-semibold text-[#1F291E]"
                >
                  Recipient&apos;s Name (Printed on Box Lid)
                </label>
                <input
                  id="recipient-name-input"
                  type="text"
                  maxLength={28}
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g., Rhea, Kabir, Bestie..."
                  className="w-full rounded-xl border border-[#1F291E]/15 bg-white px-3.5 py-2 text-sm text-[#1F291E] focus:border-[#7D8035] focus:outline-none focus:ring-2 focus:ring-[#7D8035]/20"
                />
              </div>

              {/* Photo Memory Upload / Preset */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#1F291E]">
                    Polaroid Photo Inside Lid
                  </span>
                  <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#7D8035]/40 bg-[#F4F5EA] px-2.5 py-1 text-[11px] font-semibold text-[#7D8035] hover:bg-[#7D8035] hover:text-white transition-colors">
                    <Upload className="h-3 w-3" />
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="sr-only"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {PRESET_MEMORY_PHOTOS.map((preset) => {
                    const selected = photoUrl === preset.image;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setPhotoUrl(preset.image);
                          setPhotoLabel(preset.caption);
                        }}
                        className={`group overflow-hidden rounded-xl border p-1 text-center transition-all ${
                          selected
                            ? 'border-[#7D8035] bg-[#F4F5EA] ring-2 ring-[#7D8035]/25'
                            : 'border-[#1F291E]/12 bg-white hover:border-[#1F291E]/30'
                        }`}
                      >
                        <div className="aspect-square overflow-hidden rounded-lg">
                          <SafeImage
                            src={preset.image}
                            alt={preset.label}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <p className="mt-1 truncate text-[10px] font-semibold text-[#1F291E]">
                          {preset.label}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Personal Message Card */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    htmlFor="message-card-input"
                    className="text-xs font-semibold text-[#1F291E]"
                  >
                    Personal Message Card
                  </label>
                  <span className="text-[11px] text-[#1F291E]/50 tabular-nums">
                    {messageCard.length}/160
                  </span>
                </div>
                <textarea
                  id="message-card-input"
                  rows={2}
                  maxLength={160}
                  value={messageCard}
                  onChange={(e) => setMessageCard(e.target.value)}
                  placeholder="Write a birthday, anniversary, or surprise note..."
                  className="w-full resize-none rounded-xl border border-[#1F291E]/15 bg-white px-3.5 py-2 text-sm text-[#1F291E] focus:border-[#7D8035] focus:outline-none focus:ring-2 focus:ring-[#7D8035]/20"
                />
              </div>
            </div>

            {/* Step 3: Quick Add-Ons */}
            <div className="space-y-2.5 border-t border-[#1F291E]/8 pt-5 pb-2">
              <p className="text-xs font-bold uppercase tracking-wider text-[#7D8035]">
                Step 3 — Add Quick Add-Ons (Optional)
              </p>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {ADD_ON_OPTIONS.map((addon) => {
                  const checked = addOnIds.includes(addon.id);
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => toggleAddOn(addon.id)}
                      className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-left transition-colors ${
                        checked
                          ? 'border-[#7D8035] bg-[#F4F5EA]'
                          : 'border-[#1F291E]/12 bg-white hover:bg-[#F8F7F4]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                            checked
                              ? 'border-[#7D8035] bg-[#7D8035] text-white'
                              : 'border-[#1F291E]/30 bg-white'
                          }`}
                        >
                          {checked && <Check className="h-3 w-3" />}
                        </span>
                        <span className="truncate text-xs font-semibold text-[#1F291E]">
                          {addon.shortLabel}
                        </span>
                      </div>
                      <span className="ml-2 shrink-0 text-xs font-bold text-[#7D8035] tabular-nums">
                        +₹{addon.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sticky Footer Price Calculator & CTA */}
          <div className="border-t border-[#1F291E]/10 bg-[#F8F7F4] px-5 py-4 sm:px-6">
            <div className="mb-3 flex items-center justify-between text-xs text-[#1F291E]/70">
              <span>
                Base Gift (₹{selectedProduct.price}) + Custom Packaging (Free)
                {addOnsTotal > 0 ? ` + Add-ons (₹${addOnsTotal})` : ''}
              </span>
              <span className="text-base font-bold text-[#1F291E] tabular-nums">
                ₹{totalUnitPrice.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              type="button"
              onClick={handleConfirmAdd}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#7D8035] px-5 py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#696B2B]"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>
                Add Custom BloomBox to Cart — ₹{totalUnitPrice.toLocaleString('en-IN')}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
