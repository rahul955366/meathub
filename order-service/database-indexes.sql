-- MEATHUB Order Service - Database Indexes for Performance Optimization
-- Run these indexes after initial schema creation

USE meathub_order;

-- Orders table indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_butcher_id ON orders(butcher_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_user_status ON orders(user_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_butcher_status ON orders(butcher_id, status);

-- Order Items table indexes
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_meat_item_id ON order_items(meat_item_id);

-- Cart table indexes
CREATE INDEX IF NOT EXISTS idx_cart_user_id ON cart(user_id);

-- Cart Items table indexes
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_meat_item_id ON cart_items(meat_item_id);

-- Reviews table indexes
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_butcher_id ON reviews(butcher_id);
CREATE INDEX IF NOT EXISTS idx_reviews_meat_item_id ON reviews(meat_item_id);
CREATE INDEX IF NOT EXISTS idx_reviews_order_id ON reviews(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_meat_item_created ON reviews(meat_item_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_butcher_created ON reviews(butcher_id, created_at DESC);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_orders_user_created ON orders(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_butcher_created ON orders(butcher_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_order_meat_item ON reviews(order_id, meat_item_id);

