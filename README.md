# BAG & CO.

A responsive, frontend-only bag storefront based on the supplied reference. Built with React 18, Vite, Tailwind CSS v4 through `@tailwindcss/vite`, lucide-react, and Zustand for the persisted cart.

## Run locally

```sh
npm install
npm run dev
```

If PowerShell blocks `npm.ps1`, use `npm.cmd install` and `npm.cmd run dev`. Build with `npm run build`, then inspect the production build with `npm run preview`.

## Structure

```text
public/
  favicon.svg
  images/hero.jpg          Supplied hero photograph
src/
  main.jsx                 React entry point
  App.jsx                  Store integration, wishlist, search, and dialog state
  index.css                Tailwind theme tokens and responsive styles
  data/products.js         Product data, categories, and KSh formatting
  stores/useCartStore.js   Zustand cart persisted in localStorage
  components/
    Header.jsx
    Hero.jsx
    Collection.jsx
    ProductCard.jsx
    Perks.jsx
    CartDrawer.jsx         Accessible sliding cart and checkout notice
    StoreDialog.jsx        Search and informational dialogs
```

## Images and assumptions

- The supplied `hero.jpg` is included. Product photographs were not supplied separately, so the cards display sand placeholders. Add `tote.jpg`, `backpack.jpg`, `crossbody.jpg`, and `duffel.jpg` to `public/images/`; Vite detects those assets automatically. Rebuild for production after adding them. Corrupt images also fall back to placeholders.
- The cart starts empty and persists in localStorage under `bag-and-co-cart`. Only product IDs and quantities are saved; product details come from the current catalog. The wishlist remains React state and resets on reload.
- The cart drawer opens from the header or after adding an item. It supports Escape, backdrop dismissal, focus trapping, quantity changes, removal, and reduced motion. Checkout shows a coming-soon toast.
- Search and category filters work together. “View all bags” clears both filters.
- Google Fonts supplies Newsreader and Inter; Georgia and Arial are fallbacks when fonts are unavailable.
- Account sign-in, checkout, and contact details have informational placeholders. No backend, application API calls, authentication, or payments are implemented.
- Layout uses one product column below 480px, two from 480px, and four from 1024px. Mobile navigation collapses below 1024px.

Run cart persistence and quantity checks with `node --test tests/cart-store.test.js`.
