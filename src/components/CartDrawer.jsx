import { useEffect, useRef, useState } from 'react';
import { Check, Minus, Plus, ShoppingBag, Truck, X } from 'lucide-react';
import { formatPrice } from '../data/products';

const localImages = import.meta.glob('/public/images/{tote,backpack,crossbody,duffel}.jpg', {
  eager: true,
  query: '?url',
  import: 'default',
});

function CartThumbnail({ product }) {
  const [imageFailed, setImageFailed] = useState(false);
  const hasImage = Boolean(localImages[`/public${product.image}`]);

  return (
    <div className="cart-thumbnail">
      {hasImage && !imageFailed ? (
        <img src={product.image} alt={product.name} width="80" height="88"
          onError={() => setImageFailed(true)} />
      ) : (
        <span role="img" aria-label={`${product.name}: image coming soon`}>
          <ShoppingBag size={28} strokeWidth={1.5} aria-hidden="true" />
        </span>
      )}
    </div>
  );
}

export default function CartDrawer({ open, onClose, items, onUpdateQuantity, onRemoveItem }) {
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const [checkoutNotice, setCheckoutNotice] = useState(null);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open) {
      if (dialog.open) dialog.close();
      setCheckoutNotice(null);
      return undefined;
    }

    // Native modality makes the rest of the page inert and restores the opener's focus.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (!dialog.open) dialog.showModal();
    closeButtonRef.current.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
    };
  }, [open]);

  useEffect(() => {
    // Removing the focused line must not leave focus outside the drawer.
    if (open && !dialogRef.current.contains(document.activeElement)) {
      closeButtonRef.current.focus();
    }
  }, [items, open]);

  useEffect(() => {
    if (!checkoutNotice) return undefined;
    const timeout = setTimeout(() => setCheckoutNotice(null), 2600);
    return () => clearTimeout(timeout);
  }, [checkoutNotice]);

  function trapFocus(event) {
    if (event.key !== 'Tab') return;
    const buttons = [...dialogRef.current.querySelectorAll('button:not(:disabled)')];
    const first = buttons[0];
    const last = buttons[buttons.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="cart-drawer"
      aria-labelledby="cart-drawer-title"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onKeyDown={trapFocus}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <div className="cart-drawer-panel">
        <header className="cart-drawer-header">
          <div>
            <h2 id="cart-drawer-title">Your shopping bag</h2>
            <p>{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
          </div>
          <button ref={closeButtonRef} className="icon-button" type="button" aria-label="Close shopping bag" onClick={onClose}>
            <X strokeWidth={1.5} aria-hidden="true" />
          </button>
        </header>

        <div className="cart-drawer-body">
          {items.length ? (
            <ul className="cart-drawer-items">
              {items.map(({ product, quantity }) => (
                <li className="cart-drawer-item" key={product.id}>
                  <CartThumbnail product={product} />
                  <div className="cart-line-details">
                    <h3>{product.name}</h3>
                    <p className="cart-line-price">{formatPrice(product.price)} <span>each</span></p>
                    <div className="cart-line-actions">
                      <div className="cart-quantity" role="group" aria-label={`Quantity for ${product.name}`}>
                        <button type="button" aria-label={`Decrease quantity of ${product.name}`} disabled={quantity === 1}
                          onClick={() => onUpdateQuantity(product.id, -1)}>
                          <Minus size={16} strokeWidth={1.5} aria-hidden="true" />
                        </button>
                        <span aria-live="polite" aria-label={`Quantity: ${quantity}`}>{quantity}</span>
                        <button type="button" aria-label={`Increase quantity of ${product.name}`}
                          onClick={() => onUpdateQuantity(product.id, 1)}>
                          <Plus size={16} strokeWidth={1.5} aria-hidden="true" />
                        </button>
                      </div>
                      <button className="cart-remove" type="button" aria-label={`Remove ${product.name} from bag`}
                        onClick={() => onRemoveItem(product.id)}>Remove</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state cart-drawer-empty">
              <ShoppingBag size={42} strokeWidth={1.5} aria-hidden="true" />
              <h3>A little room for your everyday.</h3>
              <p>Your bag is empty. Find something you love.</p>
              <button className="primary-button" type="button" onClick={onClose}>Continue shopping</button>
            </div>
          )}
        </div>

        <footer className="cart-drawer-footer">
          <div className={`cart-drawer-toast${checkoutNotice ? ' is-visible' : ''}`} role="status" aria-live="polite" aria-atomic="true">
            {checkoutNotice && <><Check size={18} strokeWidth={1.5} aria-hidden="true" /><span>{checkoutNotice.message}</span></>}
          </div>
          <div className="cart-drawer-subtotal"><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>
          <p className="cart-shipping"><Truck size={18} strokeWidth={1.5} aria-hidden="true" />Free shipping included</p>
          <button className="primary-button cart-checkout" type="button" disabled={!items.length}
            onClick={() => setCheckoutNotice({ message: 'Checkout is coming soon.' })}>Checkout</button>
        </footer>
      </div>
    </dialog>
  );
}
