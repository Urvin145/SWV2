-- ============================================================================
-- Scrapwala — Phase 1 Seed Data
-- Run AFTER 001_initial_schema.sql in Supabase SQL Editor.
-- ============================================================================

-- Clean slate to prevent any unique constraint/duplicate key violations
TRUNCATE TABLE 
  booking_status_logs, 
  booking_items, 
  bookings, 
  scrap_rates, 
  scrap_items, 
  scrap_categories, 
  pickup_slots, 
  blog_posts 
CASCADE;

-- Disable Row Level Security (RLS) on all tables for Phase 1 guest mode
ALTER TABLE scrap_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE scrap_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE scrap_rates DISABLE ROW LEVEL SECURITY;
ALTER TABLE pickup_slots DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE booking_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE booking_status_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 1. SCRAP CATEGORIES (6 categories)
-- ============================================================================
INSERT INTO scrap_categories (id, name, slug, description, sort_order) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Paper', 'paper', 'Newspapers, magazines, cardboard, books, and paper waste', 1),
  ('a1000000-0000-0000-0000-000000000002', 'Plastic', 'plastic', 'PET bottles, HDPE containers, plastic bags, and packaging', 2),
  ('a1000000-0000-0000-0000-000000000003', 'Metal', 'metal', 'Iron, steel, copper, aluminium, brass, and metal scrap', 3),
  ('a1000000-0000-0000-0000-000000000004', 'E-Waste', 'e-waste', 'Old electronics, cables, circuit boards, and batteries', 4),
  ('a1000000-0000-0000-0000-000000000005', 'Glass', 'glass', 'Glass bottles, jars, and window glass', 5),
  ('a1000000-0000-0000-0000-000000000006', 'Others', 'others', 'Rubber, textiles, wood, and miscellaneous scrap', 6)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 2. SCRAP ITEMS (~20 items across categories)
-- ============================================================================

-- Paper Items
INSERT INTO scrap_items (id, category_id, name, slug, description, unit, sort_order) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Newspaper', 'newspaper', 'Old newspapers and dailies', 'kg', 1),
  ('b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'Cardboard', 'cardboard', 'Cardboard boxes and corrugated sheets', 'kg', 2),
  ('b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', 'Magazines & Books', 'magazines-books', 'Old magazines, textbooks, and notebooks', 'kg', 3),
  ('b1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000001', 'Office Paper', 'office-paper', 'A4 sheets, printouts, and office documents', 'kg', 4)
ON CONFLICT (slug) DO NOTHING;

-- Plastic Items
INSERT INTO scrap_items (id, category_id, name, slug, description, unit, sort_order) VALUES
  ('b1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000002', 'PET Bottles', 'pet-bottles', 'Mineral water and soft drink bottles', 'kg', 1),
  ('b1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000002', 'HDPE Containers', 'hdpe-containers', 'Milk jugs, shampoo bottles, and detergent containers', 'kg', 2),
  ('b1000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000002', 'Hard Plastic', 'hard-plastic', 'Chairs, buckets, and rigid plastic items', 'kg', 3),
  ('b1000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000002', 'Plastic Mix', 'plastic-mix', 'Mixed plastic waste and packaging material', 'kg', 4)
ON CONFLICT (slug) DO NOTHING;

-- Metal Items
INSERT INTO scrap_items (id, category_id, name, slug, description, unit, sort_order) VALUES
  ('b1000000-0000-0000-0000-000000000009', 'a1000000-0000-0000-0000-000000000003', 'Iron', 'iron', 'Iron rods, pipes, sheets, and utensils', 'kg', 1),
  ('b1000000-0000-0000-0000-000000000010', 'a1000000-0000-0000-0000-000000000003', 'Copper', 'copper', 'Copper wire, pipes, and fittings', 'kg', 2),
  ('b1000000-0000-0000-0000-000000000011', 'a1000000-0000-0000-0000-000000000003', 'Aluminium', 'aluminium', 'Aluminium cans, foil, window frames, and utensils', 'kg', 3),
  ('b1000000-0000-0000-0000-000000000012', 'a1000000-0000-0000-0000-000000000003', 'Steel', 'steel', 'Stainless steel utensils, appliances, and fixtures', 'kg', 4),
  ('b1000000-0000-0000-0000-000000000013', 'a1000000-0000-0000-0000-000000000003', 'Brass', 'brass', 'Brass taps, fittings, and decorative items', 'kg', 5)
ON CONFLICT (slug) DO NOTHING;

-- E-Waste Items
INSERT INTO scrap_items (id, category_id, name, slug, description, unit, sort_order) VALUES
  ('b1000000-0000-0000-0000-000000000014', 'a1000000-0000-0000-0000-000000000004', 'Laptops & Computers', 'laptops-computers', 'Old laptops, desktops, and monitors', 'piece', 1),
  ('b1000000-0000-0000-0000-000000000015', 'a1000000-0000-0000-0000-000000000004', 'Mobile Phones', 'mobile-phones', 'Old smartphones and feature phones', 'piece', 2),
  ('b1000000-0000-0000-0000-000000000016', 'a1000000-0000-0000-0000-000000000004', 'Wires & Cables', 'wires-cables', 'Electrical wires, LAN cables, and chargers', 'kg', 3),
  ('b1000000-0000-0000-0000-000000000017', 'a1000000-0000-0000-0000-000000000004', 'Batteries', 'batteries', 'Car batteries, inverter batteries, UPS batteries', 'piece', 4)
ON CONFLICT (slug) DO NOTHING;

-- Glass Items
INSERT INTO scrap_items (id, category_id, name, slug, description, unit, sort_order) VALUES
  ('b1000000-0000-0000-0000-000000000018', 'a1000000-0000-0000-0000-000000000005', 'Glass Bottles', 'glass-bottles', 'Beer bottles, wine bottles, and glass jars', 'kg', 1),
  ('b1000000-0000-0000-0000-000000000019', 'a1000000-0000-0000-0000-000000000005', 'Window Glass', 'window-glass', 'Broken window panes and glass sheets', 'kg', 2)
ON CONFLICT (slug) DO NOTHING;

-- Other Items
INSERT INTO scrap_items (id, category_id, name, slug, description, unit, sort_order) VALUES
  ('b1000000-0000-0000-0000-000000000020', 'a1000000-0000-0000-0000-000000000006', 'Old Clothes', 'old-clothes', 'Wearable and non-wearable old garments', 'kg', 1),
  ('b1000000-0000-0000-0000-000000000021', 'a1000000-0000-0000-0000-000000000006', 'Tyres & Rubber', 'tyres-rubber', 'Old tyres, rubber mats, and rubber items', 'kg', 2)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 3. SCRAP RATES (current market prices in ₹/unit)
-- ============================================================================
INSERT INTO scrap_rates (scrap_item_id, price_per_unit, city) VALUES
  -- Paper
  ('b1000000-0000-0000-0000-000000000001', 14.00, 'Bangalore'),  -- Newspaper
  ('b1000000-0000-0000-0000-000000000002', 8.00, 'Bangalore'),   -- Cardboard
  ('b1000000-0000-0000-0000-000000000003', 12.00, 'Bangalore'),  -- Magazines
  ('b1000000-0000-0000-0000-000000000004', 10.00, 'Bangalore'),  -- Office Paper
  -- Plastic
  ('b1000000-0000-0000-0000-000000000005', 10.00, 'Bangalore'),  -- PET Bottles
  ('b1000000-0000-0000-0000-000000000006', 12.00, 'Bangalore'),  -- HDPE
  ('b1000000-0000-0000-0000-000000000007', 15.00, 'Bangalore'),  -- Hard Plastic
  ('b1000000-0000-0000-0000-000000000008', 5.00, 'Bangalore'),   -- Plastic Mix
  -- Metal
  ('b1000000-0000-0000-0000-000000000009', 28.00, 'Bangalore'),  -- Iron
  ('b1000000-0000-0000-0000-000000000010', 425.00, 'Bangalore'), -- Copper
  ('b1000000-0000-0000-0000-000000000011', 105.00, 'Bangalore'), -- Aluminium
  ('b1000000-0000-0000-0000-000000000012', 40.00, 'Bangalore'),  -- Steel
  ('b1000000-0000-0000-0000-000000000013', 305.00, 'Bangalore'), -- Brass
  -- E-Waste
  ('b1000000-0000-0000-0000-000000000014', 200.00, 'Bangalore'), -- Laptops
  ('b1000000-0000-0000-0000-000000000015', 50.00, 'Bangalore'),  -- Mobile Phones
  ('b1000000-0000-0000-0000-000000000016', 30.00, 'Bangalore'),  -- Wires
  ('b1000000-0000-0000-0000-000000000017', 75.00, 'Bangalore'),  -- Batteries
  -- Glass
  ('b1000000-0000-0000-0000-000000000018', 2.00, 'Bangalore'),   -- Glass Bottles
  ('b1000000-0000-0000-0000-000000000019', 1.50, 'Bangalore'),   -- Window Glass
  -- Others
  ('b1000000-0000-0000-0000-000000000020', 3.00, 'Bangalore'),   -- Old Clothes
  ('b1000000-0000-0000-0000-000000000021', 8.00, 'Bangalore');   -- Tyres

-- ============================================================================
-- 4. PICKUP SLOTS (4 time windows)
-- ============================================================================
INSERT INTO pickup_slots (id, start_time, end_time, label, max_bookings_per_day) VALUES
  ('c1000000-0000-0000-0000-000000000001', '09:00', '11:00', '9:00 AM - 11:00 AM', 10),
  ('c1000000-0000-0000-0000-000000000002', '11:00', '13:00', '11:00 AM - 1:00 PM', 10),
  ('c1000000-0000-0000-0000-000000000003', '14:00', '16:00', '2:00 PM - 4:00 PM', 10),
  ('c1000000-0000-0000-0000-000000000004', '16:00', '18:00', '4:00 PM - 6:00 PM', 10)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 5. BLOG POSTS (4 sample articles)
-- ============================================================================
INSERT INTO blog_posts (title, slug, excerpt, content, author_name, is_published, published_at) VALUES
(
  '5 Types of Scrap You Didn''t Know Were Valuable',
  '5-types-of-scrap-you-didnt-know-were-valuable',
  'Most people throw away scrap that could earn them money. Here are 5 surprisingly valuable types of scrap.',
  E'# 5 Types of Scrap You Didn''t Know Were Valuable\n\nMost households throw away items that could actually earn them good money. Here are five types of scrap that are more valuable than you think:\n\n## 1. Copper Wire\nOld electrical wires contain copper, which fetches ₹400+ per kg. Before your next home renovation, save those old wires!\n\n## 2. Aluminium Cans\nThose soda and beer cans? They''re worth ₹100+ per kg when collected in bulk.\n\n## 3. Old Batteries\nCar batteries, inverter batteries, and even laptop batteries contain valuable metals. They can fetch ₹50-200 per piece.\n\n## 4. Hard Plastic Items\nOld chairs, buckets, and containers made of hard plastic are worth ₹15/kg — much more than soft plastic.\n\n## 5. Brass Fittings\nOld taps, door handles, and decorative items made of brass can earn you ₹300+ per kg!\n\n---\n\n**Ready to sell your scrap?** Book a pickup with Scrapwala and get paid at the best market rates.',
  'Scrapwala Team',
  true,
  now() - INTERVAL '7 days'
),
(
  'How Scrapwala is Making Recycling Easy in Bangalore',
  'how-scrapwala-is-making-recycling-easy-in-bangalore',
  'Learn how Scrapwala is transforming doorstep scrap collection in Bangalore with technology and fair pricing.',
  E'# How Scrapwala is Making Recycling Easy in Bangalore\n\nRecycling shouldn''t be hard. But for most Bangalore residents, selling scrap means:\n- Waiting for the kabadiwala who never shows up\n- Getting lowballed on prices\n- Having no transparency on rates\n\n## The Scrapwala Difference\n\nWe built Scrapwala to solve these problems:\n\n### Transparent Pricing\nOur rates are published online and updated regularly. No haggling, no surprises.\n\n### Scheduled Pickups\nBook a pickup at your convenience. Choose your date and time slot, and our trained executive arrives on time.\n\n### Fair Payment\nWe weigh your scrap on a digital scale right at your doorstep. You see the weight, you see the rate, you get paid instantly.\n\n### Professional Service\nOur collection executives are trained, uniformed, and courteous. They handle the heavy lifting.\n\n---\n\n**Join 10,000+ happy customers** who have already made the switch to Scrapwala.',
  'Scrapwala Team',
  true,
  now() - INTERVAL '14 days'
),
(
  'The Environmental Impact of Recycling Your Scrap',
  'environmental-impact-of-recycling-scrap',
  'Every kg of scrap you recycle makes a difference. Here''s the real environmental impact of recycling.',
  E'# The Environmental Impact of Recycling Your Scrap\n\nEvery time you sell your scrap instead of throwing it in the trash, you''re making a real difference:\n\n## Paper Recycling\n- **1 tonne of recycled paper** saves 17 trees, 26,000 litres of water, and 4,000 kWh of electricity\n- India produces 15 million tonnes of paper waste annually\n\n## Plastic Recycling\n- Recycling **1 kg of plastic** saves 1.5 kg of CO₂ emissions\n- Only 9% of global plastic is recycled — every bit helps\n\n## Metal Recycling\n- Recycling **aluminium** uses 95% less energy than producing new aluminium\n- Recycling **steel** saves 60% of the energy needed to make new steel\n\n## E-Waste\n- India generates **3.2 million tonnes** of e-waste annually\n- Proper recycling recovers gold, silver, copper, and rare earth metals\n\n---\n\n**Make your contribution today.** Schedule a scrap pickup with Scrapwala and be part of the solution.',
  'Scrapwala Team',
  true,
  now() - INTERVAL '21 days'
),
(
  'A Complete Guide to Sorting Your Scrap at Home',
  'complete-guide-sorting-scrap-at-home',
  'Sort your scrap like a pro with this simple guide. Better sorting = better rates!',
  E'# A Complete Guide to Sorting Your Scrap at Home\n\nSorting your scrap before a pickup helps you get better rates and makes the collection process faster.\n\n## Paper\n- Keep newspapers separate from cardboard\n- Remove plastic covers from magazines\n- Bundle with string or rubber bands\n\n## Plastic\n- Rinse containers before recycling\n- Separate hard plastic from soft plastic\n- Remove caps from bottles (they''re a different type of plastic)\n\n## Metal\n- Separate ferrous (iron/steel) from non-ferrous (copper/aluminium)\n- Remove rubber or plastic attachments\n- Clean off food residue\n\n## E-Waste\n- Keep devices intact (don''t disassemble)\n- Remove personal data from phones/laptops\n- Separate batteries from devices\n\n## Pro Tips\n- Use separate bags or boxes for each category\n- Store in a dry area to prevent degradation\n- Collect over time — bigger pickups get better rates\n\n---\n\n**Ready for a pickup?** Book now on Scrapwala!',
  'Scrapwala Team',
  true,
  now() - INTERVAL '5 days'
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- DONE! Schema + seed data loaded.
-- ============================================================================
