import { useState } from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { formatPrice } from '../data/products';

// Vite refreshes this inventory when photos are added to public/images.
// Missing photos show a placeholder without requesting a nonexistent file.
const localImages = import.meta.glob('/public/images/{tote,backpack,crossbody,duffel}.jpg', {
  eager: true,
  query: '?url',
  import: 'default',
});

export default function ProductCard({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const hasImage = Boolean(localImages[`/public${product.image}`]);

  return (
    <article className="product-card" aria-labelledby={`${product.id}-name`}>
      <div className="product-image-wrap">
        {hasImage && !imageFailed ? (
          <img
            className="product-image"
            src={product.image}
            alt={product.name}
            width="600"
            height="450"
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div
            className="product-placeholder"
            role="img"
            aria-label={`${product.name}: product image coming soon`}
          >
            <ShoppingBag aria-hidden="true" size={40} strokeWidth={1.5} />
            <span>Image coming soon</span>
          </div>
        )}

        {product.badge && <span className="product-badge">{product.badge}</span>}

        <button
          className={`wishlist-button${isWishlisted ? ' is-active' : ''}`}
          type="button"
          aria-label={`${isWishlisted ? 'Remove' : 'Add'} ${product.name} ${isWishlisted ? 'from' : 'to'} wishlist`}
          aria-pressed={isWishlisted}
          onClick={() => onToggleWishlist(product.id)}
        >
          <Heart
            aria-hidden="true"
            size={23}
            strokeWidth={1.5}
            fill={isWishlisted ? 'currentColor' : 'none'}
          />
        </button>
      </div>

      <div className="product-details">
        <h3 className="product-name" id={`${product.id}-name`}>
          {product.name}
        </h3>
        <p className="product-price">{formatPrice(product.price)}</p>
        <button
          className="add-to-cart"
          type="button"
          aria-label={`Add ${product.name} to cart`}
          onClick={() => onAddToCart(product)}
        >
          Add to cart
        </button>
      </div>
    </article>
  );
}
