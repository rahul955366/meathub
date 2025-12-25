USE meathub_butcher;

INSERT INTO butchers (user_id, shop_name, phone_number, address, description, status, created_at) VALUES
(1, 'Fresh Meat Corner', '9876543210', '123 Market St', 'Premium meats', 'APPROVED', NOW()),
(2, 'Premium Meats', '9876543211', '456 Main Rd', 'Organic meats', 'APPROVED', NOW()),
(3, 'Organic Butcher', '9876543212', '789 Food Lane', 'Certified organic', 'APPROVED', NOW())
ON DUPLICATE KEY UPDATE shop_name=shop_name;

INSERT INTO meat_items (butcher_id, name, description, price, quantity, category, image_url, status, created_at) VALUES
(1, 'Boneless Chicken Breast', 'Fresh tender chicken breast', 280.00, 50, 'Chicken', 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500', 'AVAILABLE', NOW()),
(1, 'Chicken Drumsticks', 'Juicy chicken drumsticks', 220.00, 40, 'Chicken', 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=500', 'AVAILABLE', NOW()),
(1, 'Chicken Wings', 'Fresh chicken wings', 200.00, 35, 'Chicken', 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=500', 'AVAILABLE', NOW()),
(1, 'Whole Chicken', 'Farm-fresh whole chicken', 350.00, 25, 'Chicken', 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=500', 'AVAILABLE', NOW()),
(2, 'Chicken Thighs', 'Organic chicken thighs', 320.00, 30, 'Chicken', 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=500', 'AVAILABLE', NOW()),
(2, 'Chicken Mince', 'Fresh ground chicken', 260.00, 45, 'Chicken', 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500', 'AVAILABLE', NOW()),
(1, 'Mutton Leg', 'Premium mutton leg pieces', 650.00, 20, 'Mutton', 'https://images.unsplash.com/photo-1607623488552-e341c53e4138?w=500', 'AVAILABLE', NOW()),
(1, 'Mutton Chops', 'Tender mutton chops', 680.00, 18, 'Mutton', 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=500', 'AVAILABLE', NOW()),
(2, 'Boneless Mutton',  'Boneless mutton cubes', 720.00, 15, 'Mutton', 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=500', 'AVAILABLE', NOW()),
(2, 'Mutton Mince', 'Fresh ground mutton', 600.00, 25, 'Mutton', 'https://images.unsplash.com/photo-1607623488552-e341c53e4138?w=500', 'AVAILABLE', NOW()),
(3, 'Pomfret', 'Fresh silver pomfret', 550.00, 20, 'Fish', 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=500', 'AVAILABLE', NOW()),
(3, 'Salmon Fillets', 'Atlantic salmon fillets', 800.00, 15, 'Fish', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500', 'AVAILABLE', NOW()),
(3, 'Rohu Fish', 'Fresh Rohu fish', 280.00, 25, 'Fish', 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=500', 'AVAILABLE', NOW()),
(1, 'Mackerel', 'Fresh mackerel', 220.00, 30, 'Fish', 'https://images.unsplash.com/photo-1580217593608-61931cefc821?w=500', 'AVAILABLE', NOW()),
(3, 'Jumbo Prawns', 'Large fresh prawns', 850.00, 18, 'Prawns', 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=500', 'AVAILABLE', NOW()),
(3, 'Medium Prawns', 'Fresh medium prawns', 600.00, 25, 'Prawns', 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=500', 'AVAILABLE', NOW()),
(3, 'Tiger Prawns', 'Premium tiger prawns', 950.00, 12, 'Prawns', 'https://images.unsplash.com/photo-1618670112264-5c398ddbcec6?w=500', 'AVAILABLE', NOW()),
(2, 'Prawns Headless', 'Deveined prawns', 700.00, 20, 'Prawns', 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=500', 'AVAILABLE', NOW());

SELECT 'Data inserted!' as Status;
SELECT COUNT(*) as Total FROM meat_items;
SELECT category, COUNT(*) as Count FROM meat_items GROUP BY category;
