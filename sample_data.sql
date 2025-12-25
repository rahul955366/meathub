-- MEATHUB Sample Data - Meat Products with Images
-- This script adds sample butchers and meat products to the database

USE meathub_butcher;

-- First, create some sample butchers
INSERT INTO butchers (user_id, shop_name, license_number, phone, address, rating, status, created_at) VALUES
(1, 'Fresh Meat Corner', 'LIC001', '9876543210', '123 Market Street, Mumbai', 4.5, 'ACTIVE', NOW()),
(2, 'Premium Meats', 'LIC002', '9876543211', '456 Main Road, Delhi', 4.8, 'ACTIVE', NOW()),
(3, 'Organic Butcher', 'LIC003', '9876543212', '789 Food Lane, Bangalore', 4.6, 'ACTIVE', NOW());

-- CHICKEN PRODUCTS
INSERT INTO meat_items (butcher_id, name, description, price, quantity, category, image_url, status, created_at) VALUES
-- Fresh Meat Corner - Chicken
(1, 'Boneless Chicken Breast', 'Fresh, tender chicken breast pieces - perfect for grilling', 280.00, 50, 'Chicken', 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500', 'AVAILABLE', NOW()),
(1, 'Chicken Drumsticks', 'Juicy chicken drumsticks - great for BBQ', 220.00, 40, 'Chicken', 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=500', 'AVAILABLE', NOW()),
(1, 'Chicken Wings', 'Fresh chicken wings - perfect for appetizers', 200.00, 35, 'Chicken', 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=500', 'AVAILABLE', NOW()),
(1, 'Whole Chicken', 'Farm-fresh whole chicken - 1.2-1.5kg', 350.00, 25, 'Chicken', 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=500', 'AVAILABLE', NOW()),

-- Premium Meats - Chicken
(2, 'Organic Chicken Thighs', 'Antibiotic-free organic chicken thighs', 320.00, 30, 'Chicken', 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=500', 'AVAILABLE', NOW()),
(2, 'Chicken Mince', 'Freshly ground chicken - perfect for kebabs', 260.00, 45, 'Chicken', 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500', 'AVAILABLE', NOW()),

-- MUTTON PRODUCTS
INSERT INTO meat_items (butcher_id, name, description, price, quantity, category, image_url, status, created_at) VALUES
-- Fresh Meat Corner - Mutton
(1, 'Mutton Leg Pieces', 'Premium mutton leg pieces - bone-in', 650.00, 20, 'Mutton', 'https://images.unsplash.com/photo-1607623488552-e341c53e4138?w=500', 'AVAILABLE', NOW()),
(1, 'Mutton Chops', 'Tender mutton chops - perfect for curry', 680.00, 18, 'Mutton', 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=500', 'AVAILABLE', NOW()),
(1, 'Boneless Mutton', 'Premium boneless mutton cubes', 720.00, 15, 'Mutton', 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=500', 'AVAILABLE', NOW()),

-- Premium Meats - Mutton
(2, 'Mutton Mince (Keema)', 'Fresh ground mutton - for keema dishes', 600.00, 25, 'Mutton', 'https://images.unsplash.com/photo-1607623488552-e341c53e4138?w=500', 'AVAILABLE', NOW()),
(2, 'Mutton Ribs', 'Succulent mutton ribs - BBQ ready', 700.00, 12, 'Mutton', 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=500', 'AVAILABLE', NOW()),
(2, 'Mutton Liver', 'Fresh mutton liver - highly nutritious', 450.00, 10, 'Mutton', 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=500', 'AVAILABLE', NOW()),

-- FISH PRODUCTS
INSERT INTO meat_items (butcher_id, name, description, price, quantity, category, image_url, status, created_at) VALUES
-- Organic Butcher - Fish
(3, 'Fresh Pomfret', 'Silver pomfret - cleaned and gutted', 550.00, 20, 'Fish', 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=500', 'AVAILABLE', NOW()),
(3, 'Salmon Fillets', 'Atlantic salmon fillets - omega-3 rich', 800.00, 15, 'Fish', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500', 'AVAILABLE', NOW()),
(3, 'Rohu Fish', 'Fresh Rohu - Bengali favorite', 280.00, 25, 'Fish', 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=500', 'AVAILABLE', NOW()),
(3, 'Mackerel (Bangda)', 'Fresh mackerel - protein packed', 220.00, 30, 'Fish', 'https://images.unsplash.com/photo-1580217593608-61931cefc821?w=500', 'AVAILABLE', NOW()),

-- Fresh Meat Corner - Fish
(1, 'Kingfish Steaks', 'Premium kingfish steaks - firm texture', 650.00, 12, 'Fish', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500', 'AVAILABLE', NOW()),
(1, 'Tuna Chunks', 'Fresh tuna - sushi grade available', 750.00, 10, 'Fish', 'https://images.unsplash.com/photo-1580217593608-61931cefc821?w=500', 'AVAILABLE', NOW()),

-- PRAWNS/SEAFOOD
INSERT INTO meat_items (butcher_id, name, description, price, quantity, category, image_url, status, created_at) VALUES
-- Organic Butcher - Prawns
(3, 'Jumbo Prawns', 'Large-sized fresh prawns - 10-15 count', 850.00, 18, 'Prawns', 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=500', 'AVAILABLE', NOW()),
(3, 'Medium Prawns', 'Fresh medium prawns - cleaned', 600.00, 25, 'Prawns', 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=500', 'AVAILABLE', NOW()),
(3, 'Tiger Prawns', 'Premium tiger prawns - 6-8 count', 950.00, 12, 'Prawns', 'https://images.unsplash.com/photo-1618670112264-5c398ddbcec6?w=500', 'AVAILABLE', NOW()),

-- Premium Meats - Prawns
(2, 'Prawns (Headless)', 'Deveined headless prawns - ready to cook', 700.00, 20, 'Prawns', 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=500', 'AVAILABLE', NOW()),
(2, 'Squid Rings', 'Fresh squid rings - tender and tasty', 450.00, 15, 'Seafood', 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=500', 'AVAILABLE', NOW()),
(2, 'Crab Meat', 'Fresh crab meat - sweet and delicate', 1200.00, 8, 'Seafood', 'https://images.unsplash.com/photo-1618670112264-5c398ddbcec6?w=500', 'AVAILABLE', NOW());

-- Additional variety items
INSERT INTO meat_items (butcher_id, name, description, price, quantity, category, image_url, status, created_at) VALUES
(1, 'Chicken Liver', 'Fresh chicken liver - iron rich', 150.00, 20, 'Chicken', 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500', 'AVAILABLE', NOW()),
(2, 'Lamb Chops', 'Premium lamb chops - grill ready', 850.00, 10, 'Mutton', 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=500', 'AVAILABLE', NOW()),
(3, 'Hilsa Fish', 'Bengali delicacy - fresh hilsa', 1200.00, 8, 'Fish', 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=500', 'AVAILABLE', NOW()),
(1, 'Mini Chicken Sausages', 'Ready-to-cook chicken sausages', 180.00, 35, 'Chicken', 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=500', 'AVAILABLE', NOW());

SELECT 'Sample data inserted successfully!' as Message;
SELECT COUNT(*) as 'Total Products' FROM meat_items;
SELECT category, COUNT(*) as 'Count' FROM meat_items GROUP BY category;
