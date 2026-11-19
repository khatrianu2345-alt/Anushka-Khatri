import { useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { AuthModal } from './components/AuthModal';
import { CartDrawer } from './components/CartDrawer';
import { CurationRows } from './components/CurationRows';
import { CustomBoxStudioModal } from './components/CustomBoxStudioModal';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { LocationModal } from './components/LocationModal';
import { OccasionsRow } from './components/OccasionsRow';
import { ProductGrid } from './components/ProductGrid';
import { DEHRADUN_LOCATIONS, PRODUCTS } from './data/bloomboxData';
import {
  auth,
  SavedFirestoreOrder,
  subscribeToUserOrders,
  syncUserProfile,
} from './lib/firebase';
import {
  CartItem,
  CategorySlug,
  CustomBoxConfig,
  GridFilterTab,
  LocationHub,
  Product,
  SortOption,
} from './types';

export default function App() {
  // Firebase Authentication & Orders state
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [savedOrders, setSavedOrders] = useState<SavedFirestoreOrder[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      setAuthReady(true);
      if (user) {
        void syncUserProfile(user).catch((err) => {
          console.error('Failed to sync user profile:', err);
        });
      } else {
        setSavedOrders([]);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!authReady || !authUser) return;
    const unsubscribe = subscribeToUserOrders(
      authUser.uid,
      (orders) => setSavedOrders(orders),
      (err) => console.error('Order subscription error:', err)
    );
    return () => unsubscribe();
  }, [authReady, authUser]);

  // Location & Modal state
  const [selectedLocation, setSelectedLocation] = useState<LocationHub>(
    DEHRADUN_LOCATIONS[0]
  );
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Filter & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategorySlug>('all');
  const [activeGridTab, setActiveGridTab] = useState<GridFilterTab>('all');
  const [activeOccasion, setActiveOccasion] = useState<string | null>(null);
  const [activeRecipient, setActiveRecipient] = useState<string | null>(null);
  const [activeFeeling, setActiveFeeling] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  // Custom Packaging Studio Modal state
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [studioProduct, setStudioProduct] = useState<Product | null>(null);

  // Cart Drawer state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const handleOpenCustomStudio = (product?: Product) => {
    setStudioProduct(product || PRODUCTS[0]);
    setIsStudioOpen(true);
  };

  const handleQuickAddProduct = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.customization === null
      );
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === existing.cartItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          cartItemId: `${product.id}-standard-${Date.now()}`,
          product,
          quantity: 1,
          customization: null,
          unitPrice: product.price,
        },
      ];
    });

    setRecentlyAddedId(product.id);
    window.setTimeout(() => {
      setRecentlyAddedId((curr) => (curr === product.id ? null : curr));
    }, 1400);
  };

  const handleAddCustomToCart = (
    product: Product,
    config: CustomBoxConfig,
    totalUnitPrice: number
  ) => {
    setCartItems((prev) => [
      ...prev,
      {
        cartItemId: `${product.id}-custom-${Date.now()}`,
        product,
        quantity: 1,
        customization: config,
        unitPrice: totalUnitPrice,
      },
    ]);
    setIsCartOpen(true);
  };

  const handleUpdateCartQty = (cartItemId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const handleClearAllFilters = () => {
    setSearchQuery('');
    setActiveCategory('all');
    setActiveGridTab('all');
    setActiveOccasion(null);
    setActiveRecipient(null);
    setActiveFeeling(null);
  };

  const handleSelectCategory = (slug: CategorySlug) => {
    setActiveCategory(slug);
    setActiveOccasion(null);
    setActiveRecipient(null);
    setActiveFeeling(null);
  };

  const handleSelectOccasionCircle = (opts: {
    categoryFilter?: CategorySlug;
    occasionTag?: string;
    opensStudio?: boolean;
  }) => {
    if (opts.opensStudio) {
      handleOpenCustomStudio();
      return;
    }
    setActiveRecipient(null);
    setActiveFeeling(null);
    if (opts.categoryFilter) {
      setActiveCategory(opts.categoryFilter);
      setActiveOccasion(opts.occasionTag || null);
    } else if (opts.occasionTag) {
      setActiveCategory('all');
      setActiveOccasion(opts.occasionTag);
    }
    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectRecipient = (recipient: string) => {
    setActiveCategory('all');
    setActiveOccasion(null);
    setActiveFeeling(null);
    setActiveRecipient((prev) => (prev === recipient ? null : recipient));
    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectFeeling = (feeling: string) => {
    setActiveCategory('all');
    setActiveOccasion(null);
    setActiveRecipient(null);
    setActiveFeeling((prev) => (prev === feeling ? null : feeling));
    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const list = PRODUCTS.filter((product) => {
      if (activeCategory !== 'all' && !product.categories.includes(activeCategory)) {
        return false;
      }

      if (activeOccasion && !product.occasions.includes(activeOccasion)) {
        return false;
      }

      if (activeRecipient && !product.recipients.includes(activeRecipient)) {
        return false;
      }

      if (activeFeeling && !product.feelings.includes(activeFeeling)) {
        return false;
      }

      if (activeGridTab === 'bestsellers' && !product.isBestseller) {
        return false;
      }
      if (
        activeGridTab === 'flowers-cakes' &&
        !product.categories.includes('flowers') &&
        !product.categories.includes('cakes')
      ) {
        return false;
      }
      if (
        activeGridTab === 'personalised' &&
        !product.isPersonalizable &&
        !product.categories.includes('custom-boxes')
      ) {
        return false;
      }
      if (activeGridTab === 'under-1000' && product.price > 1000) {
        return false;
      }

      if (q) {
        const hay = `${product.title} ${product.shortDesc} ${product.occasions.join(' ')} ${product.categories.join(' ')}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }

      return true;
    });

    if (sortBy === 'price-asc') {
      return [...list].sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-desc') {
      return [...list].sort((a, b) => b.price - a.price);
    }
    if (sortBy === 'rating') {
      return [...list].sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    }
    return list;
  }, [
    searchQuery,
    activeCategory,
    activeOccasion,
    activeRecipient,
    activeFeeling,
    activeGridTab,
    sortBy,
  ]);

  const activeFilterLabel = useMemo(() => {
    const parts: string[] = [];
    if (activeCategory !== 'all') {
      parts.push(activeCategory.replace('-', ' ').toUpperCase());
    }
    if (activeOccasion) parts.push(activeOccasion);
    if (activeRecipient) parts.push(`For ${activeRecipient}`);
    if (activeFeeling) parts.push(activeFeeling);
    if (searchQuery.trim()) parts.push(`"${searchQuery.trim()}"`);
    return parts.length > 0 ? parts.join(' · ') : null;
  }, [activeCategory, activeOccasion, activeRecipient, activeFeeling, searchQuery]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1F291E]">
      <Header
        selectedLocation={selectedLocation}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        onOpenCustomStudio={handleOpenCustomStudio}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={cartCount}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        authUser={authUser}
        onSelectOccasion={(tag) =>
          handleSelectOccasionCircle({ occasionTag: tag })
        }
        onSelectProductQuick={(product) => handleOpenCustomStudio(product)}
      />

      <main className="flex-1">
        <HeroSection
          selectedLocation={selectedLocation}
          onOpenCustomStudio={() => handleOpenCustomStudio()}
          onSelectCategory={handleSelectCategory}
        />

        <OccasionsRow
          activeOccasion={activeOccasion}
          onSelectOccasionCircle={handleSelectOccasionCircle}
        />

        <ProductGrid
          products={filteredProducts}
          activeGridTab={activeGridTab}
          onChangeGridTab={setActiveGridTab}
          sortBy={sortBy}
          onChangeSort={setSortBy}
          activeFilterLabel={activeFilterLabel}
          onClearAllFilters={handleClearAllFilters}
          onCustomizeProduct={handleOpenCustomStudio}
          onQuickAddProduct={handleQuickAddProduct}
          recentlyAddedId={recentlyAddedId}
        />

        <CurationRows
          activeRecipient={activeRecipient}
          activeFeeling={activeFeeling}
          onSelectRecipient={handleSelectRecipient}
          onSelectFeeling={handleSelectFeeling}
        />
      </main>

      <Footer
        onSelectCategory={handleSelectCategory}
        onSelectLocation={setSelectedLocation}
        onOpenCustomStudio={() => handleOpenCustomStudio()}
      />

      {/* Interactive Modals & Drawers */}
      <CustomBoxStudioModal
        isOpen={isStudioOpen}
        initialProduct={studioProduct}
        onClose={() => setIsStudioOpen(false)}
        onAddCustomToCart={handleAddCustomToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={() => setCartItems([])}
        selectedLocation={selectedLocation}
        onOpenCustomStudio={() => handleOpenCustomStudio()}
        authUser={authUser}
      />

      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        selectedLocation={selectedLocation}
        onSelectLocation={setSelectedLocation}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        authUser={authUser}
        authReady={authReady}
        savedOrders={savedOrders}
      />
    </div>
  );
}
