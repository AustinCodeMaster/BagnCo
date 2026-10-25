import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Collection from './components/Collection';
import Perks from './components/Perks';
import StoreDialog from './components/StoreDialog';
import CartDrawer from './components/CartDrawer';
import useCartStore from './stores/useCartStore';
import { products } from './data/products';

export default function App() {
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const changeQuantity = useCartStore((state) => state.changeQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const [wishlist, setWishlist] = useState(new Set());
  const [panel, setPanel] = useState(null);
  const [search, setSearch] = useState('');
  const cart = items.map(({ productId, quantity }) => ({
    product: products.find((product) => product.id === productId),
    quantity,
  }));
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  function addToCart(product) {
    addItem(product.id);
    setPanel('cart');
  }

  function toggleWishlist(id) {
    setWishlist((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header cartCount={cartCount} onOpenPanel={setPanel} />
      <main id="main">
        <Hero />
        <Collection wishlist={wishlist} onToggleWishlist={toggleWishlist} onAddToCart={addToCart} search={search} onClearSearch={() => setSearch('')} />
        <Perks />
      </main>
      <StoreDialog panel={panel === 'cart' ? null : panel} onClose={() => setPanel(null)} onSearch={setSearch} />
      <CartDrawer open={panel === 'cart'} onClose={() => setPanel(null)} items={cart} onUpdateQuantity={changeQuantity} onRemoveItem={removeItem} />
    </>
  );
}
