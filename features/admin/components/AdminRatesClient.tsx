/**
 * AdminRatesClient
 * Tabbed category view with card-style scrap items,
 * inline price editing, and add category / add item modals.
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Loader2,
  AlertTriangle,
  Pencil,
  Check,
  X,
  RefreshCw,
  IndianRupee,
  Tag,
  Plus,
  FolderPlus,
  PackagePlus,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ────────── Types ────────── */
interface Rate {
  id: string;
  price_per_unit: number;
  city: string;
  effective_from: string;
  is_current: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  icon_url: string | null;
  image_url: string | null;
}

interface ScrapItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  unit: string;
  is_active: boolean;
  sort_order: number;
  category: Category;
  rates: Rate[];
}

/* ────────── Scrap Item Card (matches user's screenshot style) ────────── */
function ScrapItemCard({
  item,
  onUpdated,
}: {
  item: ScrapItem;
  onUpdated: () => void;
}) {
  const currentRate = item.rates.find((r) => r.is_current) ?? item.rates[0];
  const [editing, setEditing] = useState(false);
  const [price, setPrice] = useState(String(currentRate?.price_per_unit ?? 0));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    const newPrice = parseFloat(price);
    if (isNaN(newPrice) || newPrice < 0) {
      setError('Enter a valid price');
      return;
    }
    if (!currentRate) return;

    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/rates/${currentRate.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price_per_unit: newPrice }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setEditing(false);
      onUpdated();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setPrice(String(currentRate?.price_per_unit ?? 0));
    setError(null);
  };

  return (
    <div className="group relative flex flex-col rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-5 shadow-sm transition hover:shadow-md">
      {/* Category badge */}
      <div className="mb-3 flex items-start justify-between">
        <div className="text-2xl">
          {item.category.icon_url ? (
            <img src={item.category.icon_url} alt="" className="h-8 w-8" />
          ) : (
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm">
              📦
            </span>
          )}
        </div>
        <span className="rounded-full bg-surface-container px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
          {item.category.name}
        </span>
      </div>

      {/* Item name + description */}
      <h3 className="text-base font-bold text-on-surface">{item.name}</h3>
      {item.description && (
        <p className="mt-0.5 text-xs text-on-surface-variant line-clamp-2">
          {item.description}
        </p>
      )}

      {/* Spacer to push price to bottom */}
      <div className="flex-1" />

      {/* Price section */}
      <div className="mt-4">
        {editing ? (
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm font-bold text-primary">₹</span>
              <input
                type="number"
                step="0.5"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                autoFocus
                className="w-full rounded-lg border border-primary/50 bg-surface-container py-2 pl-7 pr-3 text-sm font-bold text-on-surface outline-none focus:ring-2 focus:ring-primary/30"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                  if (e.key === 'Escape') handleCancel();
                }}
              />
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-primary p-2 text-on-primary hover:bg-primary-container transition disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            </button>
            <button
              onClick={handleCancel}
              className="rounded-lg border border-outline-variant/30 p-2 text-on-surface-variant hover:bg-surface-container transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xl font-bold text-primary">
                ₹{currentRate?.price_per_unit ?? '—'}
              </span>
              <span className="ml-1 text-sm text-on-surface-variant">/ {item.unit}</span>
            </div>
            <button
              onClick={() => setEditing(true)}
              className="rounded-lg border border-outline-variant/20 p-1.5 text-on-surface-variant opacity-0 hover:bg-surface-container hover:text-primary transition group-hover:opacity-100"
              title="Edit price"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
        {error && <p className="mt-1 text-xs text-error">{error}</p>}
      </div>
    </div>
  );
}

/* ────────── Add Category Modal ────────── */
function AddCategoryModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Name is required'); return; }

    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), description: description.trim() || undefined }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      onCreated();
    } catch (err: any) {
      setError(err.message || 'Failed to create category');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-scrim/60 p-4" onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-primary/10 p-2">
              <FolderPlus className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-on-surface">Add Category</h3>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1 hover:bg-surface-container transition">
            <X className="h-5 w-5 text-on-surface-variant" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-on-surface-variant">
              Category Name <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rubber, Wood, Textile"
              autoFocus
              className="w-full rounded-xl border border-outline-variant/30 bg-surface-container px-4 py-2.5 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-on-surface-variant">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description of this category..."
              rows={2}
              className="w-full resize-none rounded-xl border border-outline-variant/30 bg-surface-container px-4 py-2.5 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition"
            />
          </div>
        </div>

        {error && (
          <p className="mt-3 rounded-lg bg-error-container/50 px-3 py-2 text-xs text-on-error-container">{error}</p>
        )}

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-outline-variant/30 py-2.5 text-sm font-medium text-on-surface-variant hover:bg-surface-container transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-medium text-on-primary hover:bg-primary-container transition disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <FolderPlus className="h-4 w-4" />}
            Create Category
          </button>
        </div>
      </form>
    </div>
  );
}

/* ────────── Add Scrap Item Modal ────────── */
function AddItemModal({
  categories,
  defaultCategory,
  onClose,
  onCreated,
}: {
  categories: Category[];
  defaultCategory: string; // category id or empty
  onClose: () => void;
  onCreated: () => void;
}) {
  const [categoryId, setCategoryId] = useState(defaultCategory || (categories[0]?.id ?? ''));
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [unit, setUnit] = useState('kg');
  const [price, setPrice] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Item name is required'); return; }
    if (!categoryId) { setError('Select a category'); return; }
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) { setError('Enter a valid price'); return; }

    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category_id: categoryId,
          name: name.trim(),
          description: description.trim() || undefined,
          unit: unit.trim() || 'kg',
          price_per_unit: priceNum,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      onCreated();
    } catch (err: any) {
      setError(err.message || 'Failed to create item');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-scrim/60 p-4" onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-tertiary-highlight/15 p-2">
              <PackagePlus className="h-5 w-5 text-tertiary" />
            </div>
            <h3 className="text-lg font-bold text-on-surface">Add Scrap Item</h3>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1 hover:bg-surface-container transition">
            <X className="h-5 w-5 text-on-surface-variant" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Category selector */}
          <div>
            <label className="mb-1 block text-xs font-medium text-on-surface-variant">
              Category <span className="text-error">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-xl border border-outline-variant/30 bg-surface-container px-4 py-2.5 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Item name */}
          <div>
            <label className="mb-1 block text-xs font-medium text-on-surface-variant">
              Item Name <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Glass Bottles, Copper Wire"
              autoFocus
              className="w-full rounded-xl border border-outline-variant/30 bg-surface-container px-4 py-2.5 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-xs font-medium text-on-surface-variant">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description shown on customer card..."
              rows={2}
              className="w-full resize-none rounded-xl border border-outline-variant/30 bg-surface-container px-4 py-2.5 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition"
            />
          </div>

          {/* Unit + Price — side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-on-surface-variant">
                Unit
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full rounded-xl border border-outline-variant/30 bg-surface-container px-4 py-2.5 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition"
              >
                <option value="kg">kg</option>
                <option value="piece">piece</option>
                <option value="dozen">dozen</option>
                <option value="bundle">bundle</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-on-surface-variant">
                Price (₹) <span className="text-error">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-primary">₹</span>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-xl border border-outline-variant/30 bg-surface-container py-2.5 pl-8 pr-4 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition"
                />
              </div>
            </div>
          </div>

          {/* Preview card */}
          <div className="rounded-xl border border-dashed border-outline-variant/30 bg-surface-container/50 p-4">
            <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-on-surface-variant">Preview</p>
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs">📦</span>
              </div>
              <span className="rounded-full bg-surface-container px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-on-surface-variant">
                {categories.find((c) => c.id === categoryId)?.name ?? '—'}
              </span>
            </div>
            <h4 className="mt-2 text-sm font-bold text-on-surface">{name || 'Item Name'}</h4>
            {description && (
              <p className="mt-0.5 text-[11px] text-on-surface-variant line-clamp-1">{description}</p>
            )}
            <p className="mt-3">
              <span className="text-base font-bold text-primary">₹{price || '0'}</span>
              <span className="ml-1 text-xs text-on-surface-variant">/ {unit}</span>
            </p>
          </div>
        </div>

        {error && (
          <p className="mt-3 rounded-lg bg-error-container/50 px-3 py-2 text-xs text-on-error-container">{error}</p>
        )}

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-outline-variant/30 py-2.5 text-sm font-medium text-on-surface-variant hover:bg-surface-container transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-medium text-on-primary hover:bg-primary-container transition disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <PackagePlus className="h-4 w-4" />}
            Add Item
          </button>
        </div>
      </form>
    </div>
  );
}

/* ────────── Main Rates Page ────────── */
export function AdminRatesClient() {
  const [items, setItems] = useState<ScrapItem[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Modal states
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);

  const fetchRates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/rates');
      const json = await res.json();
      if (json.success) {
        setItems(json.data);
      } else {
        setError(json.error);
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all categories (including empty ones) separately
  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/rates/categories');
      const json = await res.json();
      if (json.success && json.data) {
        setAllCategories(json.data);
      }
    } catch {
      // Fallback to deriving from items
    }
  }, []);

  useEffect(() => {
    fetchRates();
    fetchCategories();
  }, [fetchRates, fetchCategories]);

  // Derive categories from items (as a fallback / merge)
  const itemCategories = Array.from(
    new Map(items.map((i) => [i.category.slug, i.category])).values(),
  );

  // Merge: all categories from API + item categories (for complete list including empty ones)
  const categories = allCategories.length > 0 ? allCategories : itemCategories;

  const filtered =
    activeCategory === 'all'
      ? items
      : items.filter((i) => i.category.slug === activeCategory);

  // Find the category id for the active filter (to pre-select in Add Item modal)
  const activeCatObj = categories.find((c) => c.slug === activeCategory);

  const handleCreated = () => {
    setShowAddCategory(false);
    setShowAddItem(false);
    fetchRates();
    fetchCategories();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Scrap Rates</h1>
          <p className="text-sm text-on-surface-variant">
            Manage categories, items, and pricing
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddCategory(true)}
            className="flex items-center gap-1.5 rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-4 py-2 text-sm font-medium text-on-surface-variant hover:bg-surface-container hover:text-primary transition"
          >
            <FolderPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Category</span>
          </button>
          <button
            onClick={() => setShowAddItem(true)}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-container transition"
          >
            <PackagePlus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Item</span>
          </button>
          <button
            onClick={() => { fetchRates(); fetchCategories(); }}
            className="flex items-center gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-2 text-on-surface-variant hover:bg-surface-container transition"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory('all')}
          className={cn(
            'flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition',
            activeCategory === 'all'
              ? 'bg-primary text-on-primary shadow-sm'
              : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/20 hover:bg-surface-container',
          )}
        >
          <Tag className="h-3.5 w-3.5" />
          All ({items.length})
        </button>
        {categories.map((cat) => {
          const count = items.filter((i) => i.category.slug === cat.slug).length;
          return (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition',
                activeCategory === cat.slug
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/20 hover:bg-surface-container',
              )}
            >
              {cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-error-container/50 p-4 text-sm text-on-error-container">
          <AlertTriangle className="h-5 w-5" />
          {error}
        </div>
      )}

      {/* Items grid — card style */}
      {!loading && !error && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((item) => (
            <ScrapItemCard key={item.id} item={item} onUpdated={fetchRates} />
          ))}

          {/* Add new item card (always visible at the end) */}
          <button
            onClick={() => setShowAddItem(true)}
            className="flex min-h-[160px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-outline-variant/30 bg-surface-container/30 p-5 text-on-surface-variant transition hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
          >
            <Plus className="h-8 w-8" />
            <span className="text-sm font-medium">Add New Item</span>
          </button>
        </div>
      )}

      {/* Modals */}
      {showAddCategory && (
        <AddCategoryModal
          onClose={() => setShowAddCategory(false)}
          onCreated={handleCreated}
        />
      )}

      {showAddItem && categories.length > 0 && (
        <AddItemModal
          categories={categories}
          defaultCategory={activeCatObj?.id ?? ''}
          onClose={() => setShowAddItem(false)}
          onCreated={handleCreated}
        />
      )}

      {/* Edge case: no categories yet */}
      {showAddItem && categories.length === 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-scrim/60 p-4" onClick={() => setShowAddItem(false)}>
          <div
            className="w-full max-w-sm rounded-2xl bg-surface-container-lowest p-6 text-center shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <FolderPlus className="mx-auto mb-3 h-10 w-10 text-tertiary-highlight" />
            <h3 className="text-base font-bold text-on-surface">No Categories Yet</h3>
            <p className="mt-1 text-sm text-on-surface-variant">
              Create a category first, then you can add scrap items to it.
            </p>
            <button
              onClick={() => { setShowAddItem(false); setShowAddCategory(true); }}
              className="mt-4 w-full rounded-xl bg-primary py-2.5 text-sm font-medium text-on-primary hover:bg-primary-container transition"
            >
              Create Category
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
