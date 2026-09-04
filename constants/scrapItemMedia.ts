/**
 * Scrap Item Media Constants
 * Provides rich photography, 3D emojis, and visual tags for every scrap item.
 * Matches the visual-first, high-legibility layout requested for Scrap Rates.
 */

export interface ItemVisualMeta {
  emoji: string;
  image: string;
  alt: string;
  badgeLabel?: string;
}

export const ITEM_VISUAL_MAP: Record<string, ItemVisualMeta> = {
  // Paper
  newspaper: {
    emoji: '📰',
    image: '/images/items/newspaper.jpg',
    alt: 'Neat stack of old newspapers and dailies',
    badgeLabel: 'PAPER',
  },
  cardboard: {
    emoji: '📦',
    image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=500&auto=format&fit=crop&q=80',
    alt: 'Stacked corrugated cardboard boxes',
    badgeLabel: 'PAPER',
  },
  'magazines-books': {
    emoji: '📚',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop&q=80',
    alt: 'Stack of old magazines, textbooks, and books',
    badgeLabel: 'PAPER',
  },
  'office-paper': {
    emoji: '📄',
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&auto=format&fit=crop&q=80',
    alt: 'Clean stack of white office documents and A4 sheets',
    badgeLabel: 'PAPER',
  },

  // Plastic
  'pet-bottles': {
    emoji: '🧴',
    image: 'https://images.unsplash.com/photo-1572935748967-62a95b0138f1?w=500&auto=format&fit=crop&q=80',
    alt: 'Transparent PET water and soft drink bottles',
    badgeLabel: 'PLASTIC',
  },
  'hdpe-containers': {
    emoji: '🍶',
    image: 'https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=500&auto=format&fit=crop&q=80',
    alt: 'HDPE detergent containers and plastic milk jugs',
    badgeLabel: 'PLASTIC',
  },
  'hard-plastic': {
    emoji: '🪣',
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=500&auto=format&fit=crop&q=80',
    alt: 'Rigid plastic containers, buckets and chairs',
    badgeLabel: 'PLASTIC',
  },
  'plastic-mix': {
    emoji: '♻️',
    image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=500&auto=format&fit=crop&q=80',
    alt: 'Mixed packaging plastics and clean containers',
    badgeLabel: 'PLASTIC',
  },

  // Metal
  iron: {
    emoji: '⚙️',
    image: 'https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=500&auto=format&fit=crop&q=80',
    alt: 'Iron pipes, rods, and structural metal pieces',
    badgeLabel: 'METAL',
  },
  copper: {
    emoji: '🔩',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&auto=format&fit=crop&q=80',
    alt: 'Clean copper tubes, pipes, and coiled copper wire',
    badgeLabel: 'METAL',
  },
  aluminium: {
    emoji: '🥫',
    image: 'https://images.unsplash.com/photo-1584282479904-7a3237194602?w=500&auto=format&fit=crop&q=80',
    alt: 'Clean aluminium cans, foil, and window frames',
    badgeLabel: 'METAL',
  },
  steel: {
    emoji: '🔧',
    image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=500&auto=format&fit=crop&q=80',
    alt: 'Stainless steel utensils, vessels, and hardware',
    badgeLabel: 'METAL',
  },
  brass: {
    emoji: '🔔',
    image: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=500&auto=format&fit=crop&q=80',
    alt: 'Polished brass utensils, lamps, and fittings',
    badgeLabel: 'METAL',
  },

  // E-Waste
  'laptops-computers': {
    emoji: '💻',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=80',
    alt: 'Used laptops, desktop computer monitors, and hardware',
    badgeLabel: 'E-WASTE',
  },
  'mobile-phones': {
    emoji: '📱',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=80',
    alt: 'Old smartphones and feature phones',
    badgeLabel: 'E-WASTE',
  },
  'wires-cables': {
    emoji: '🔌',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80',
    alt: 'Bundle of electrical copper wires, chargers, and LAN cables',
    badgeLabel: 'E-WASTE',
  },
  batteries: {
    emoji: '🔋',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500&auto=format&fit=crop&q=80',
    alt: 'Car batteries, UPS batteries, and inverter battery units',
    badgeLabel: 'E-WASTE',
  },

  // Glass
  'glass-bottles': {
    emoji: '🍾',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&auto=format&fit=crop&q=80',
    alt: 'Clear and green glass bottles, beer bottles, and jars',
    badgeLabel: 'GLASS',
  },
  'window-glass': {
    emoji: '🪟',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
    alt: 'Clean flat window glass sheets and panes',
    badgeLabel: 'GLASS',
  },

  // Others
  'old-clothes': {
    emoji: '👕',
    image: 'https://images.unsplash.com/photo-1540221652346-e5dd6b50f3e7?w=500&auto=format&fit=crop&q=80',
    alt: 'Neat stack of folded clothes, denim, and cotton garments',
    badgeLabel: 'OTHERS',
  },
  'tyres-rubber': {
    emoji: '🛞',
    image: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=500&auto=format&fit=crop&q=80',
    alt: 'Stack of automobile rubber tyres and mats',
    badgeLabel: 'OTHERS',
  },
};

/** Category badge styling */
export const CATEGORY_BADGE_STYLES: Record<string, string> = {
  paper: 'bg-amber-50 text-amber-900 border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40',
  plastic: 'bg-sky-50 text-sky-900 border-sky-200/60 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/40',
  metal: 'bg-slate-100 text-slate-800 border-slate-300/60 dark:bg-slate-900/60 dark:text-slate-300 dark:border-slate-700/50',
  'e-waste': 'bg-purple-50 text-purple-900 border-purple-200/60 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/40',
  glass: 'bg-teal-50 text-teal-900 border-teal-200/60 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800/40',
  others: 'bg-emerald-50 text-emerald-900 border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40',
};
