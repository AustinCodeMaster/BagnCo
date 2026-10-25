import { useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { products, categories } from '../data/products';
import ProductCard from './ProductCard';

export default function Collection({ wishlist, onToggleWishlist, onAddToCart, search, onClearSearch }) {
  const [activeCategory, setActiveCategory] = useState('All bags');
  const filteredProducts = products.filter((product) =>
    (activeCategory === 'All bags' || product.category === activeCategory) &&
    `${product.name} ${product.category}`.toLowerCase().includes(search.toLowerCase().trim()),
  );

  function resetFilters() {
    setActiveCategory('All bags');
    onClearSearch();
  }

  return (
    <section className="collection page-container" id="collection" aria-labelledby="collection-heading">
      <div className="collection-heading-row">
        <div>
          <h2 id="collection-heading">Find your next favourite</h2>
          <p className="collection-subtitle">Made for wherever the day takes you.</p>
        </div>
        <a className="view-all" href="#products" onClick={resetFilters}>View all bags <ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" /></a>
      </div>
      <div className="category-filters" role="group" aria-label="Filter bags by category">
        {categories.map((category) => (
          <button key={category} type="button" className={`filter-pill${activeCategory === category ? ' is-active' : ''}`}
            aria-pressed={activeCategory === category} onClick={() => setActiveCategory(category)}>{category}</button>
        ))}
      </div>
      {search && <div className="search-summary">Results for “{search}” <button className="text-button" type="button" onClick={onClearSearch} aria-label="Clear search"><X size={16} aria-hidden="true" /> Clear</button></div>}
      <p className="sr-only" role="status" aria-live="polite">{filteredProducts.length} {filteredProducts.length === 1 ? 'bag' : 'bags'} shown</p>
      <div className="product-grid grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4" id="products">
        {filteredProducts.map((product) => <ProductCard key={product.id} product={product} isWishlisted={wishlist.has(product.id)} onToggleWishlist={onToggleWishlist} onAddToCart={onAddToCart} />)}
      </div>
      {filteredProducts.length === 0 && <div className="empty-state"><h3>No bags found</h3><p>Try another search or explore the full collection.</p><button className="text-button" type="button" onClick={resetFilters}>View all bags <ArrowRight size={18} aria-hidden="true" /></button></div>}
    </section>
  );
}
