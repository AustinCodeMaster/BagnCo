import { useState } from 'react';
import { Menu, Search, ShoppingBag, UserRound, X } from 'lucide-react';

export default function Header({ cartCount, onOpenPanel }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState('Home');

  function navigate(page) {
    setMenuOpen(false);
    if (page === 'About' || page === 'Contact') {
      onOpenPanel(page.toLowerCase());
    } else {
      setActivePage(page);
    }
  }

  return (
    <header id="home">
      <div className="announcement">Free shipping on all orders</div>
      <div className="site-header">
        <div className="page-container header-inner">
          <a className="brand" href="#home" aria-label="BAG & CO. home" onClick={() => navigate('Home')}>
            <ShoppingBag strokeWidth={1.5} aria-hidden="true" />
            <span>BAG &amp; CO.</span>
          </a>
          <nav className="desktop-nav" aria-label="Main navigation">
            {['Home', 'Shop', 'About', 'Contact'].map((page) =>
              page === 'Home' || page === 'Shop' ? (
                <a key={page} href={page === 'Home' ? '#home' : '#collection'}
                  aria-current={activePage === page ? 'page' : undefined}
                  onClick={() => navigate(page)}>{page}</a>
              ) : (
                <button key={page} type="button" onClick={() => navigate(page)}>{page}</button>
              ),
            )}
          </nav>
          <div className="header-actions">
            <button className="icon-button" type="button" aria-label="Search bags" onClick={() => onOpenPanel('search')}>
              <Search strokeWidth={1.5} aria-hidden="true" />
            </button>
            <button className="icon-button account-button" type="button" aria-label="Your account" onClick={() => onOpenPanel('account')}>
              <UserRound strokeWidth={1.5} aria-hidden="true" />
            </button>
            <button className="icon-button cart-button" type="button" aria-label={`Open shopping bag, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`} onClick={() => onOpenPanel('cart')}>
              <ShoppingBag strokeWidth={1.5} aria-hidden="true" />
              <span className="cart-count" aria-hidden="true">{cartCount}</span>
            </button>
            <button className="icon-button menu-toggle" type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X strokeWidth={1.5} aria-hidden="true" /> : <Menu strokeWidth={1.5} aria-hidden="true" />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav id="mobile-navigation" className="mobile-nav page-container" aria-label="Mobile navigation">
            <a href="#home" aria-current={activePage === 'Home' ? 'page' : undefined} onClick={() => navigate('Home')}>Home</a>
            <a href="#collection" aria-current={activePage === 'Shop' ? 'page' : undefined} onClick={() => navigate('Shop')}>Shop</a>
            <button type="button" onClick={() => navigate('About')}>About</button>
            <button type="button" onClick={() => navigate('Contact')}>Contact</button>
            <button type="button" onClick={() => { setMenuOpen(false); onOpenPanel('account'); }}>Your account</button>
          </nav>
        )}
      </div>
    </header>
  );
}
