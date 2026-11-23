import {
  PRODUCTS as SEED_PRODUCTS,
  CATEGORIES as SEED_CATEGORIES,
} from '../data/products';

const PRODUCTS_KEY = 'pizzeria_products';
const CATEGORIES_KEY = 'pizzeria_categories';

function initIfEmpty() {
  if (!localStorage.getItem(PRODUCTS_KEY)) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(SEED_PRODUCTS));
  }
  if (!localStorage.getItem(CATEGORIES_KEY)) {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(SEED_CATEGORIES));
  }
}

export function getProducts() {
  initIfEmpty();
  const raw = localStorage.getItem(PRODUCTS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveProducts(list) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(list));
}

export function addProduct(product) {
  const list = getProducts();
  const newId = list.length ? Math.max(...list.map((p) => p.id)) + 1 : 1;
  const newProduct = {
    ...product,
    id: newId,
    addedAt: new Date().toISOString().slice(0, 10),
  };
  saveProducts([...list, newProduct]);
  return newProduct;
}

export function updateProduct(id, patch) {
  const list = getProducts();
  saveProducts(list.map((p) => (p.id === id ? { ...p, ...patch } : p)));
}

export function deleteProduct(id) {
  saveProducts(getProducts().filter((p) => p.id !== id));
}

export function getCategories() {
  initIfEmpty();
  const raw = localStorage.getItem(CATEGORIES_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveCategories(list) {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(list));
}

export function addCategory(name) {
  const trimmed = name.trim();
  if (!trimmed) return { error: 'Название не может быть пустым' };

  const id = trimmed.toLowerCase().replace(/\s+/g, '_');
  const list = getCategories();
  if (list.some((c) => c.id === id)) {
    return { error: 'Такая категория уже есть' };
  }
  saveCategories([...list, { id, name: trimmed }]);
  return { ok: true };
}

export function deleteCategory(id) {
  if (id === 'all') {
    return { error: 'Системную категорию удалять нельзя' };
  }
  saveCategories(getCategories().filter((c) => c.id !== id));
  return { ok: true };
}