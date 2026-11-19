import { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  MapPin,
  Minus,
  Package,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
  Truck,
  X,
} from 'lucide-react';
import { User } from 'firebase/auth';
import {
  ADD_ON_OPTIONS,
  BOX_COLOR_OPTIONS,
  BOX_THEME_OPTIONS,
  DELIVERY_SLOTS,
} from '../data/bloomboxData';
import { saveUserOrder } from '../lib/firebase';
import { CartItem, DeliverySlot, LocationHub, OrderRecord } from '../types';
import { SafeImage } from './SafeImage';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  selectedLocation: LocationHub;
  onOpenCustomStudio: () => void;
  authUser: User | null;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  selectedLocation,
  onOpenCustomStudio,
  authUser,
}: CartDrawerProps) {
  const [selectedSlotId, setSelectedSlotId] =
    useState<DeliverySlot['id']>('same-day');
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [viewStep, setViewStep] = useState<'cart' | 'checkout' | 'confirmed'>(
    'cart'
  );

  // Express checkout form state
  const [recipientName, setRecipientName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState(selectedLocation.pincode);
  const [paymentMethod, setPaymentMethod] = useState('UPI (GPay / PhonePe)');
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(
    null
  );

  if (!isOpen) return null;

  const selectedSlot =
    DELIVERY_SLOTS.find((s) => s.id === selectedSlotId) || DELIVERY_SLOTS[1];

  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  const discount = appliedPromo === 'BLOOM10' ? Math.round(subtotal * 0.1) : 0;
  const deliveryFee = items.length > 0 ? selectedSlot.fee : 0;
  const total = Math.max(0, subtotal - discount + deliveryFee);

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    if (code === 'BLOOM10') {
      setAppliedPromo('BLOOM10');
      setPromoError(null);
    } else {
      setPromoError('Try code BLOOM10 for 10% student & first-order savings');
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim() || !phone.trim() || !address.trim()) {
      setFormError('Please fill recipient name, phone number, and delivery address.');
      return;
    }
    setFormError(null);

    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const newOrder: OrderRecord = {
      orderId: `BB-DDN-${randomCode}`,
      recipientName: recipientName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      pincode: pincode.trim() || selectedLocation.pincode,
      slot: selectedSlot,
      paymentMethod,
      subtotal,
      discount,
      deliveryFee,
      total,
      itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
      placedAt: new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setConfirmedOrder(newOrder);
    onClearCart();
    setViewStep('confirmed');

    if (authUser) {
      void saveUserOrder(authUser, newOrder).catch((err) => {
        console.error('Could not save order to Firestore:', err);
      });
    }
  };

  const handleCloseDrawer = () => {
    if (viewStep === 'confirmed') {
      setViewStep('cart');
      setConfirmedOrder(null);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#1F291E]/55 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart and Checkout"
    >
      <div className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-[#1F291E]/10 px-5 py-4">
          <div className="flex items-center gap-2.5">
            {viewStep === 'checkout' && (
              <button
                type="button"
                onClick={() => setViewStep('cart')}
                aria-label="Back to cart"
                className="rounded-lg p-1.5 text-[#1F291E] hover:bg-[#F8F7F4]"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <div>
              <h2 className="font-display text-lg font-semibold text-[#1F291E]">
                {viewStep === 'cart'
                  ? 'Your Surprise Cart'
                  : viewStep === 'checkout'
                    ? 'Express Dehradun Checkout'
                    : 'Surprise Order Confirmed'}
              </h2>
              <p className="text-xs text-[#1F291E]/60">
                Delivering to {selectedLocation.area} ({selectedLocation.pincode})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCloseDrawer}
            aria-label="Close cart"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#1F291E]/12 text-[#1F291E] hover:bg-[#F8F7F4]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Drawer Body */}
        {viewStep === 'confirmed' && confirmedOrder ? (
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            <div className="rounded-2xl border border-[#7D8035]/30 bg-[#F4F5EA] p-5 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#7D8035] text-white">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#7D8035]">
                Order #{confirmedOrder.orderId}
              </p>
              <h3 className="mt-1 font-display text-xl font-semibold text-[#1F291E]">
                Surprise is being crafted!
              </h3>
              <p className="mt-1 text-xs text-[#1F291E]/70">
                Placed at {confirmedOrder.placedAt} · {confirmedOrder.slot.label}
              </p>
              {authUser && (
                <p className="mt-1.5 text-[11px] font-semibold text-[#7D8035]">
                  Saved to your Google account ({authUser.email})
                </p>
              )}
            </div>

            {/* Live Order Tracking Steps */}
            <div className="rounded-2xl border border-[#1F291E]/10 bg-white p-4 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-[#1F291E]/60">
                Live Dehradun Fulfillment Tracker
              </p>
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#7D8035] text-white font-bold">
                    1
                  </span>
                  <div>
                    <p className="font-bold text-[#1F291E]">Order Confirmed</p>
                    <p className="text-[#1F291E]/60">Sent to Rajpur Road &amp; Clement Town studio</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#7D8035]/20 text-[#7D8035] font-bold">
                    2
                  </span>
                  <div>
                    <p className="font-semibold text-[#1F291E]">Customizing Outer Box &amp; Note</p>
                    <p className="text-[#1F291E]/60">Printing recipient sleeve &amp; Polaroid memory</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F8F7F4] text-[#1F291E]/50 font-bold">
                    3
                  </span>
                  <div>
                    <p className="font-semibold text-[#1F291E]/70">Out for Doorstep Delivery</p>
                    <p className="text-[#1F291E]/55">{confirmedOrder.slot.sublabel}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Receipt Summary */}
            <div className="rounded-2xl border border-[#1F291E]/10 bg-[#F8F7F4] p-4 space-y-2 text-xs">
              <p className="font-bold text-[#1F291E]">Delivery Details</p>
              <p className="text-[#1F291E]/80">
                {confirmedOrder.recipientName} · {confirmedOrder.phone}
              </p>
              <p className="text-[#1F291E]/70">
                {confirmedOrder.address}, PIN {confirmedOrder.pincode}
              </p>
              <div className="mt-2 border-t border-[#1F291E]/10 pt-2 flex justify-between font-bold text-[#1F291E] tabular-nums">
                <span>Total Paid ({confirmedOrder.paymentMethod})</span>
                <span>₹{confirmedOrder.total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCloseDrawer}
              className="w-full rounded-xl bg-[#1F291E] py-3 text-sm font-semibold text-white hover:bg-[#7D8035] transition-colors"
            >
              Continue Exploring Gifts
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F8F7F4] text-[#7D8035]">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <h3 className="font-display text-xl font-semibold text-[#1F291E]">
              Your BloomBox cart is empty
            </h3>
            <p className="mt-1.5 max-w-xs text-sm text-[#1F291E]/65">
              Pick a bestseller or design your own personalized gift box with custom colors, photos &amp; blooms.
            </p>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenCustomStudio();
              }}
              className="mt-5 rounded-xl bg-[#7D8035] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#696B2B]"
            >
              Design Custom BloomBox
            </button>
          </div>
        ) : viewStep === 'checkout' ? (
          <form onSubmit={handlePlaceOrder} className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {formError && (
                <div className="rounded-xl border border-[#E05A47]/30 bg-[#E05A47]/10 px-3.5 py-2.5 text-xs font-medium text-[#E05A47]">
                  {formError}
                </div>
              )}

              <div>
                <label className="mb-1 block text-xs font-semibold text-[#1F291E]">
                  Recipient Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Who is receiving the surprise?"
                  className="w-full rounded-xl border border-[#1F291E]/15 px-3.5 py-2.5 text-sm focus:border-[#7D8035] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-[#1F291E]">
                  Recipient / Contact Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98XXXXXXXX"
                  className="w-full rounded-xl border border-[#1F291E]/15 px-3.5 py-2.5 text-sm tabular-nums focus:border-[#7D8035] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-[#1F291E]">
                  House, Hostel, or Campus Address (Dehradun) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g., DBS Campus Hostel Block B, Clement Town..."
                  className="w-full resize-none rounded-xl border border-[#1F291E]/15 px-3.5 py-2 text-sm focus:border-[#7D8035] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#1F291E]">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full rounded-xl border border-[#1F291E]/15 px-3.5 py-2 text-sm tabular-nums focus:border-[#7D8035] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#1F291E]">
                    Payment Mode
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full rounded-xl border border-[#1F291E]/15 bg-white px-3 py-2 text-sm focus:border-[#7D8035] focus:outline-none"
                  >
                    <option>UPI (GPay / PhonePe)</option>
                    <option>Cash on Delivery</option>
                    <option>Debit / Credit Card</option>
                  </select>
                </div>
              </div>

              <div className="rounded-xl border border-[#1F291E]/10 bg-[#F8F7F4] p-3.5 text-xs space-y-1.5">
                <div className="flex justify-between text-[#1F291E]/75">
                  <span>Selected Slot</span>
                  <span className="font-semibold text-[#1F291E]">{selectedSlot.label}</span>
                </div>
                <div className="flex justify-between font-bold text-[#1F291E] text-sm pt-1 border-t border-[#1F291E]/10 tabular-nums">
                  <span>Payable Total</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-[#1F291E]/10 p-5 bg-[#F8F7F4]">
              <button
                type="submit"
                className="w-full rounded-xl bg-[#7D8035] py-3.5 text-sm font-bold text-white shadow-sm hover:bg-[#696B2B] transition-colors"
              >
                Place Surprise Order — ₹{total.toLocaleString('en-IN')}
              </button>
            </div>
          </form>
        ) : (
          /* CART VIEW */
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Items List */}
              <div className="space-y-3">
                {items.map((item) => {
                  const boxColor = item.customization
                    ? BOX_COLOR_OPTIONS.find(
                        (c) => c.id === item.customization?.boxColorId
                      )
                    : null;
                  const boxTheme = item.customization
                    ? BOX_THEME_OPTIONS.find(
                        (t) => t.id === item.customization?.themeId
                      )
                    : null;

                  return (
                    <div
                      key={item.cartItemId}
                      className="flex gap-3 rounded-2xl border border-[#1F291E]/10 bg-white p-3"
                    >
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#F8F7F4]">
                        <SafeImage
                          src={item.product.image}
                          alt={item.product.title}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="line-clamp-2 text-xs font-bold text-[#1F291E]">
                            {item.product.title}
                          </h3>
                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.cartItemId)}
                            aria-label={`Remove ${item.product.title}`}
                            className="text-[#1F291E]/40 hover:text-[#E05A47]"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Custom Box Summary */}
                        {item.customization ? (
                          <div className="mt-1.5 rounded-lg bg-[#F4F5EA] px-2 py-1.5 text-[11px] text-[#1F291E]/80 space-y-0.5">
                            <p className="font-semibold text-[#7D8035]">
                              Box: {boxColor?.name} · {boxTheme?.name}
                            </p>
                            <p className="truncate">
                              Name: {item.customization.recipientName}
                              {item.customization.messageCard ? ' · +Message Card' : ''}
                              {item.customization.photoUrl ? ' · +Polaroid' : ''}
                            </p>
                            {item.customization.addOnIds.length > 0 && (
                              <p className="truncate text-[10px] text-[#1F291E]/65">
                                Add-ons:{' '}
                                {item.customization.addOnIds
                                  .map(
                                    (id) =>
                                      ADD_ON_OPTIONS.find((a) => a.id === id)
                                        ?.shortLabel
                                  )
                                  .filter(Boolean)
                                  .join(', ')}
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="mt-1 text-[11px] text-[#1F291E]/55">
                            Standard Signature Packaging
                          </p>
                        )}

                        {/* Stepper & Item Total */}
                        <div className="mt-2.5 flex items-center justify-between">
                          <div className="inline-flex items-center rounded-lg border border-[#1F291E]/15 bg-[#F8F7F4]">
                            <button
                              type="button"
                              onClick={() => onUpdateQty(item.cartItemId, -1)}
                              aria-label="Decrease quantity"
                              className="px-2 py-1 text-[#1F291E] hover:text-[#7D8035]"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-2 text-xs font-bold tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQty(item.cartItemId, 1)}
                              aria-label="Increase quantity"
                              className="px-2 py-1 text-[#1F291E] hover:text-[#7D8035]"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <span className="text-sm font-bold text-[#1F291E] tabular-nums">
                            ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Delivery Slot Selector */}
              <div className="space-y-2">
                <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1F291E]/70">
                  <Truck className="h-3.5 w-3.5 text-[#7D8035]" />
                  <span>Select Delivery Slot</span>
                </p>
                <div className="space-y-2">
                  {DELIVERY_SLOTS.map((slot) => {
                    const active = selectedSlotId === slot.id;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setSelectedSlotId(slot.id)}
                        className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-left transition-colors ${
                          active
                            ? 'border-[#7D8035] bg-[#F4F5EA]'
                            : 'border-[#1F291E]/12 bg-white hover:bg-[#F8F7F4]'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-bold text-[#1F291E]">{slot.label}</p>
                          <p className="text-[11px] text-[#1F291E]/60">{slot.sublabel}</p>
                        </div>
                        <span className="text-xs font-bold text-[#7D8035] tabular-nums">
                          {slot.fee === 0 ? 'FREE' : `₹${slot.fee}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Promo Code Box */}
              <div className="space-y-1.5">
                <label
                  htmlFor="promo-code-input"
                  className="flex items-center gap-1.5 text-xs font-bold text-[#1F291E]"
                >
                  <Tag className="h-3.5 w-3.5 text-[#E05A47]" />
                  <span>Student Referral / Promo Code</span>
                </label>
                <div className="flex gap-2">
                  <input
                    id="promo-code-input"
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Enter BLOOM10 for 10% off"
                    className="flex-1 rounded-xl border border-[#1F291E]/15 px-3 py-2 text-xs uppercase tracking-wider focus:border-[#7D8035] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="rounded-xl bg-[#1F291E] px-4 py-2 text-xs font-semibold text-white hover:bg-[#7D8035] transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {appliedPromo === 'BLOOM10' ? (
                  <p className="text-[11px] font-semibold text-[#7D8035]">
                    BLOOM10 applied — 10% student discount unlocked!
                  </p>
                ) : promoError ? (
                  <p className="text-[11px] text-[#E05A47]">{promoError}</p>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setPromoInput('BLOOM10');
                      setAppliedPromo('BLOOM10');
                      setPromoError(null);
                    }}
                    className="text-[11px] font-medium text-[#7D8035] hover:underline"
                  >
                    Tap to apply student code: BLOOM10 (10% OFF)
                  </button>
                )}
              </div>
            </div>

            {/* Order Summary Footer */}
            <div className="border-t border-[#1F291E]/10 bg-[#F8F7F4] p-5 space-y-2">
              <div className="flex justify-between text-xs text-[#1F291E]/75 tabular-nums">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-xs font-semibold text-[#7D8035] tabular-nums">
                  <span>Promo Discount (BLOOM10)</span>
                  <span>−₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-xs text-[#1F291E]/75 tabular-nums">
                <span>Delivery ({selectedSlot.label})</span>
                <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between border-t border-[#1F291E]/10 pt-2 text-base font-bold text-[#1F291E] tabular-nums">
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setPincode(selectedLocation.pincode);
                  setViewStep('checkout');
                }}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#7D8035] py-3.5 text-sm font-bold text-white shadow-sm hover:bg-[#696B2B] transition-colors"
              >
                <span>Proceed to Checkout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
