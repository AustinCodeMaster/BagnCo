import { useEffect, useRef } from 'react';
import { ArrowRight, Search, X } from 'lucide-react';

const titles = { search: 'Find your everyday', account: 'Your account', about: 'About BAG & CO.', contact: 'Friendly support' };

export default function StoreDialog({ panel, onClose, onSearch }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (panel && !dialog.open) {
      dialog.showModal();
      if (panel === 'search') dialog.querySelector('input')?.focus();
    }
    if (!panel && dialog.open) dialog.close();
  }, [panel]);

  useEffect(() => {
    if (!panel) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [panel]);

  return (
    <dialog ref={dialogRef} className="store-dialog" aria-labelledby="dialog-title" onCancel={onClose} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="dialog-content">
        <div className="dialog-header"><h2 id="dialog-title">{titles[panel]}</h2><button type="button" className="icon-button" aria-label="Close dialog" onClick={onClose}><X strokeWidth={1.5} aria-hidden="true" /></button></div>
        {panel === 'search' && <form className="search-form" onSubmit={(event) => { event.preventDefault(); onSearch(new FormData(event.currentTarget).get('query')); onClose(); document.getElementById('collection').scrollIntoView({ behavior: 'smooth' }); }}>
          <label htmlFor="bag-search">Search by bag name or style</label>
          <div className="search-input-wrap"><Search size={20} strokeWidth={1.5} aria-hidden="true" /><input id="bag-search" name="query" type="search" placeholder="Try a tote or a backpack" autoFocus required /></div>
          <button className="primary-button" type="submit">Search bags <ArrowRight size={20} aria-hidden="true" /></button>
        </form>}
        {panel === 'account' && <div className="dialog-copy"><p>A home for your everyday favourites.</p><p>Account sign-in is coming soon. In the meantime, tap the heart on any bag to save it while you browse.</p></div>}
        {panel === 'about' && <div className="dialog-copy"><p>Carry your everyday.</p><p>Thoughtfully selected bags for work, weekends, and everything in between. Discover totes, backpacks, crossbody bags, and travel companions, made for wherever the day takes you.</p></div>}
        {panel === 'contact' && <div className="dialog-copy"><p>Here for you and your everyday.</p><p>Our contact details will be available soon. Explore the collection and find your next favourite.</p></div>}
      </div>
    </dialog>
  );
}
