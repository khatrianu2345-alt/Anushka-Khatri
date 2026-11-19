import { useState } from 'react';
import { User } from 'firebase/auth';
import {
  CheckCircle2,
  Flower2,
  Loader2,
  LogOut,
  Package,
  ShieldCheck,
  X,
} from 'lucide-react';
import {
  SavedFirestoreOrder,
  signInWithGoogle,
  signOutUser,
} from '../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  authUser: User | null;
  authReady: boolean;
  savedOrders: SavedFirestoreOrder[];
}

export function AuthModal({
  isOpen,
  onClose,
  authUser,
  authReady,
  savedOrders,
}: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (error: unknown) {
      const code =
        typeof error === 'object' && error !== null && 'code' in error
          ? String((error as { code?: string }).code)
          : '';
      if (code === 'auth/popup-closed-by-user') {
        setErrorMessage('Google sign-in popup was closed before finishing. Please try again.');
      } else if (code === 'auth/popup-blocked') {
        setErrorMessage('Popup was blocked by your browser. Allow popups for this site and retry.');
      } else if (code === 'auth/unauthorized-domain') {
        setErrorMessage('This domain is not authorized for Firebase OAuth yet.');
      } else {
        setErrorMessage('Could not complete Google Sign-In. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setErrorMessage(null);
    setIsLoading(true);
    try {
      await signOutUser();
      onClose();
    } catch {
      setErrorMessage('Could not sign out right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F291E]/60 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close sign in dialog"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-[#1F291E]/12 text-[#1F291E] hover:bg-[#F8F7F4]"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-5 flex items-center gap-3 pr-8">
          {authUser?.photoURL ? (
            <img
              src={authUser.photoURL}
              alt={authUser.displayName || 'User profile'}
              referrerPolicy="no-referrer"
              className="h-11 w-11 shrink-0 rounded-full border border-[#7D8035]/30 object-cover"
            />
          ) : (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#7D8035] text-white">
              <Flower2 className="h-5 w-5" />
            </div>
          )}
          <div className="min-w-0">
            <h2
              id="auth-modal-title"
              className="font-display text-xl font-semibold text-[#1F291E] truncate"
            >
              {authUser
                ? authUser.displayName || 'BloomBox Member'
                : 'Sign in to BloomBox'}
            </h2>
            <p className="truncate text-xs text-[#1F291E]/65">
              {authUser
                ? authUser.email
                : 'Dehradun Quick-Gifting & Student Perks'}
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 rounded-xl border border-[#E05A47]/30 bg-[#E05A47]/10 px-3.5 py-2.5 text-xs font-medium text-[#E05A47]">
            {errorMessage}
          </div>
        )}

        {!authReady ? (
          <div className="flex items-center justify-center py-8 text-sm text-[#1F291E]/65">
            <Loader2 className="mr-2 h-4 w-4 animate-spin text-[#7D8035]" />
            <span>Checking account session...</span>
          </div>
        ) : authUser ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-[#7D8035]/20 bg-[#F4F5EA] p-4 text-xs text-[#1F291E]/85 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-[#7D8035]">
                <CheckCircle2 className="h-4 w-4" />
                <span>Verified Google Account · Student Perk Active</span>
              </div>
              <p>
                Apply code <strong>BLOOM10</strong> in your cart for 10% off custom surprise boxes.
              </p>
            </div>

            {/* Order History */}
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1F291E]/65">
                <Package className="h-3.5 w-3.5 text-[#7D8035]" />
                <span>Your Recent Orders ({savedOrders.length})</span>
              </p>
              {savedOrders.length === 0 ? (
                <div className="rounded-xl border border-[#1F291E]/10 bg-[#F8F7F4] p-3.5 text-xs text-[#1F291E]/65">
                  No saved orders yet. Orders you place while signed in appear here automatically.
                </div>
              ) : (
                <div className="max-h-44 space-y-2 overflow-y-auto pr-1">
                  {savedOrders.map((ord) => (
                    <div
                      key={ord.orderId}
                      className="flex items-center justify-between rounded-xl border border-[#1F291E]/10 bg-[#F8F7F4] p-3 text-xs"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="font-bold text-[#1F291E] truncate">
                          #{ord.orderId} · For {ord.recipientName}
                        </p>
                        <p className="truncate text-[11px] text-[#1F291E]/60">
                          {ord.slotLabel} · PIN {ord.pincode}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-bold text-[#1F291E] tabular-nums">
                          ₹{ord.total.toLocaleString('en-IN')}
                        </p>
                        <p className="text-[10px] font-semibold uppercase text-[#7D8035]">
                          {ord.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              disabled={isLoading}
              onClick={handleSignOut}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#1F291E]/15 py-2.5 text-sm font-semibold text-[#1F291E] hover:bg-[#F8F7F4] disabled:opacity-60 transition-colors"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-[#1F291E]/75">
              Sign in securely with Google to save your custom BloomBox orders, track Dehradun deliveries, and unlock student promo perks.
            </p>

            <button
              type="button"
              disabled={isLoading}
              onClick={handleGoogleSignIn}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#1F291E]/20 bg-white px-4 py-3 text-sm font-bold text-[#1F291E] shadow-xs transition-all hover:border-[#7D8035] hover:bg-[#F8F7F4] disabled:opacity-60"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-[#7D8035]" />
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
                  />
                </svg>
              )}
              <span>{isLoading ? 'Signing in...' : 'Continue with Google'}</span>
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#1F291E]/55">
              <ShieldCheck className="h-3.5 w-3.5 text-[#7D8035]" />
              <span>Authenticated via Firebase Security</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
