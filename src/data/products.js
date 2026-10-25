export const categories = ['All bags', 'Totes', 'Backpacks', 'Crossbody', 'Travel'];

export const products = [
  {
    id: 'tote',
    name: 'Classic Leather Tote',
    price: 4500,
    category: 'Totes',
    image: '/images/tote.jpg',
    badge: 'Bestseller',
  },
  {
    id: 'backpack',
    name: 'Everyday Backpack',
    price: 3800,
    category: 'Backpacks',
    image: '/images/backpack.jpg',
  },
  {
    id: 'crossbody',
    name: 'Mini Crossbody',
    price: 2900,
    category: 'Crossbody',
    image: '/images/crossbody.jpg',
    badge: 'New',
  },
  {
    id: 'duffel',
    name: 'Weekend Duffel',
    price: 6200,
    category: 'Travel',
    image: '/images/duffel.jpg',
  },
];

const priceFormatter = new Intl.NumberFormat('en-KE', {
  maximumFractionDigits: 0,
});

export function formatPrice(price) {
  return `KSh ${priceFormatter.format(price)}`;
}
