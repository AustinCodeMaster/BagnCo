import assert from 'node:assert/strict';
import { beforeEach, test } from 'node:test';

const values = new Map();
globalThis.localStorage = {
  getItem: (key) => values.get(key) ?? null,
  setItem: (key, value) => values.set(key, String(value)),
  removeItem: (key) => values.delete(key),
  clear: () => values.clear(),
};

let storeNumber = 0;
async function loadStore() {
  const url = new URL('../src/stores/useCartStore.js', import.meta.url);
  url.searchParams.set('instance', String(++storeNumber));
  return (await import(url.href)).default;
}

beforeEach(() => localStorage.clear());

test('adding an existing product increases its quantity without duplicating the line', async () => {
  const store = await loadStore();
  store.getState().addItem('tote');
  store.getState().addItem('backpack');
  store.getState().addItem('tote');
  store.getState().addItem('missing-product');

  assert.deepEqual(store.getState().items, [
    { productId: 'tote', quantity: 2 },
    { productId: 'backpack', quantity: 1 },
  ]);
});

test('quantity changes stay at one or above and reject fractional changes', async () => {
  const store = await loadStore();
  store.getState().addItem('crossbody');
  store.getState().changeQuantity('crossbody', 3);
  assert.equal(store.getState().items[0].quantity, 4);

  store.getState().changeQuantity('crossbody', -20);
  store.getState().changeQuantity('crossbody', 0.5);
  store.getState().changeQuantity('crossbody', Infinity);
  store.getState().changeQuantity('missing-product', 1);
  assert.deepEqual(store.getState().items, [{ productId: 'crossbody', quantity: 1 }]);
});

test('removing a line preserves other products and the persisted cart', async () => {
  const store = await loadStore();
  store.getState().addItem('tote');
  store.getState().addItem('duffel');
  store.getState().removeItem('tote');

  const expected = [{ productId: 'duffel', quantity: 1 }];
  assert.deepEqual(store.getState().items, expected);
  assert.deepEqual(JSON.parse(localStorage.getItem('bag-and-co-cart')), {
    state: { items: expected },
    version: 1,
  });
});

test('a fresh store reloads persisted items without persisting actions or drawer state', async () => {
  const first = await loadStore();
  first.getState().addItem('backpack');
  first.getState().addItem('backpack');
  first.setState({ drawerOpen: true });

  assert.deepEqual(Object.keys(JSON.parse(localStorage.getItem('bag-and-co-cart')).state), ['items']);
  const reloaded = await loadStore();
  assert.deepEqual(reloaded.getState().items, [{ productId: 'backpack', quantity: 2 }]);
  assert.equal(reloaded.getState().drawerOpen, undefined);
  reloaded.getState().addItem('backpack');
  assert.equal(reloaded.getState().items[0].quantity, 3);
});

test('rehydration removes invalid data, merges duplicate IDs, and retains only catalog IDs and quantities', async () => {
  const store = await loadStore();
  localStorage.setItem('bag-and-co-cart', JSON.stringify({
    version: 1,
    state: {
      drawerOpen: true,
      addItem: 'untrusted stored value',
      items: [
        { productId: 'tote', quantity: 2, price: 1, name: 'Old product name' },
        { productId: 'tote', quantity: 1 },
        { productId: 'backpack', quantity: 3 },
        { productId: 'removed-product', quantity: 1 },
        { productId: 'crossbody', quantity: 0 },
        { productId: 'crossbody', quantity: -2 },
        { productId: 'duffel', quantity: 1.5 },
        { productId: 'duffel', quantity: '2' },
        { productId: 'duffel', quantity: Number.MAX_SAFE_INTEGER + 1 },
        null,
        {},
      ],
    },
  }));

  await store.persist.rehydrate();
  assert.deepEqual(store.getState().items, [
    { productId: 'tote', quantity: 3 },
    { productId: 'backpack', quantity: 3 },
  ]);
  assert.equal(store.getState().drawerOpen, undefined);
  assert.equal(typeof store.getState().addItem, 'function');
});

test('a malformed items payload hydrates as an empty cart', async () => {
  localStorage.setItem('bag-and-co-cart', JSON.stringify({
    version: 1,
    state: { items: { productId: 'tote', quantity: 2 } },
  }));

  const store = await loadStore();
  assert.deepEqual(store.getState().items, []);
});
