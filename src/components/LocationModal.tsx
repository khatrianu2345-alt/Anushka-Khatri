import { useState } from 'react';
import { Check, Clock, MapPin, Search, X } from 'lucide-react';
import { DEHRADUN_LOCATIONS, OTHER_INDIAN_CITIES } from '../data/bloomboxData';
import { LocationHub } from '../types';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocation: LocationHub;
  onSelectLocation: (loc: LocationHub) => void;
}

export function LocationModal({
  isOpen,
  onClose,
  selectedLocation,
  onSelectLocation,
}: LocationModalProps) {
  const [pinQuery, setPinQuery] = useState('');
  const [customFeedback, setCustomFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePinCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = pinQuery.trim();
    if (!cleaned) return;

    const allHubs = [...DEHRADUN_LOCATIONS, ...OTHER_INDIAN_CITIES];
    const matched = allHubs.find(
      (h) =>
        h.pincode === cleaned ||
        h.area.toLowerCase().includes(cleaned.toLowerCase()) ||
        h.city.toLowerCase().includes(cleaned.toLowerCase())
    );

    if (matched) {
      onSelectLocation(matched);
      setCustomFeedback(null);
      onClose();
    } else if (/^248\d{3}$/.test(cleaned)) {
      const dynamicDehradun: LocationHub = {
        id: `ddn-${cleaned}`,
        pincode: cleaned,
        area: 'Dehradun City Zone',
        city: 'Dehradun',
        deliverySpeed: 'Express 60-Min Delivery Available',
        expressMinutes: 60,
        isDehradun: true,
      };
      onSelectLocation(dynamicDehradun);
      setCustomFeedback(null);
      onClose();
    } else {
      setCustomFeedback(
        'Outside Dehradun? Partner dispatch available in Delhi NCR, Chandigarh, Bengaluru & Mumbai below.'
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F291E]/60 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-modal-title"
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#1F291E]/10 px-6 py-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#7D8035]">
              Choose Delivery Hub
            </p>
            <h2
              id="location-modal-title"
              className="font-display text-xl font-semibold text-[#1F291E]"
            >
              Where to deliver your BloomBox?
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close location selector"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#1F291E]/12 text-[#1F291E] hover:bg-[#F8F7F4]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto p-6 space-y-5">
          {/* PIN Code Search */}
          <form onSubmit={handlePinCheck} className="space-y-2">
            <label
              htmlFor="pincode-lookup"
              className="block text-xs font-semibold text-[#1F291E]"
            >
              Enter Dehradun PIN Code or Locality
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1F291E]/45" />
                <input
                  id="pincode-lookup"
                  type="text"
                  value={pinQuery}
                  onChange={(e) => setPinQuery(e.target.value)}
                  placeholder="e.g. 248001, 248007, Clement Town..."
                  className="w-full rounded-xl border border-[#1F291E]/15 bg-[#F8F7F4] py-2.5 pl-9 pr-3 text-sm focus:border-[#7D8035] focus:bg-white focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="rounded-xl bg-[#7D8035] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#696B2B]"
              >
                Check
              </button>
            </div>
            {customFeedback && (
              <p className="text-xs text-[#E05A47]">{customFeedback}</p>
            )}
          </form>

          {/* Dehradun Express Hubs */}
          <div>
            <div className="mb-2.5 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1F291E]/65">
                Dehradun Express Zones (60-Min &amp; Midnight)
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#7D8035]">
                <Clock className="h-3 w-3" />
                <span>Live Today</span>
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {DEHRADUN_LOCATIONS.map((hub) => {
                const isSelected = selectedLocation.id === hub.id;
                return (
                  <button
                    key={hub.id}
                    type="button"
                    onClick={() => {
                      onSelectLocation(hub);
                      onClose();
                    }}
                    className={`flex items-start justify-between rounded-xl border p-3 text-left transition-colors ${
                      isSelected
                        ? 'border-[#7D8035] bg-[#F4F5EA]'
                        : 'border-[#1F291E]/12 bg-white hover:bg-[#F8F7F4]'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-bold text-[#1F291E] tabular-nums">
                        {hub.pincode} · {hub.area}
                      </p>
                      <p className="mt-0.5 text-[11px] text-[#7D8035] font-medium">
                        {hub.deliverySpeed}
                      </p>
                    </div>
                    {isSelected ? (
                      <Check className="h-4 w-4 shrink-0 text-[#7D8035]" />
                    ) : (
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-[#1F291E]/35" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Other Indian Cities */}
          <div className="border-t border-[#1F291E]/10 pt-4">
            <p className="mb-2.5 text-xs font-bold uppercase tracking-wider text-[#1F291E]/65">
              Other Indian Cities (Partner Dispatch)
            </p>
            <div className="grid grid-cols-2 gap-2">
              {OTHER_INDIAN_CITIES.map((hub) => {
                const isSelected = selectedLocation.id === hub.id;
                return (
                  <button
                    key={hub.id}
                    type="button"
                    onClick={() => {
                      onSelectLocation(hub);
                      onClose();
                    }}
                    className={`rounded-xl border p-2.5 text-left transition-colors ${
                      isSelected
                        ? 'border-[#7D8035] bg-[#F4F5EA]'
                        : 'border-[#1F291E]/12 bg-white hover:bg-[#F8F7F4]'
                    }`}
                  >
                    <p className="text-xs font-bold text-[#1F291E]">
                      {hub.city} <span className="font-normal text-[#1F291E]/60 tabular-nums">({hub.pincode})</span>
                    </p>
                    <p className="mt-0.5 text-[10px] text-[#1F291E]/60">
                      {hub.deliverySpeed}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
