-- 1. Create the Shop Item Table
CREATE TABLE shop_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT, -- Prevents deleting a teacher if they have active items
    title VARCHAR(255) NOT NULL,
    description TEXT,
    stock INT NOT NULL DEFAULT 0 CONSTRAINT non_negative_stock CHECK (stock >= 0),
    cost INT NOT NULL CONSTRAINT positive_cost CHECK (cost > 0), -- Items must cost at least 1 point
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create the Shop Transaction Table (The Purchase Ledger)
CREATE TABLE shop_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_item_id UUID REFERENCES shop_items(id) ON DELETE SET NULL, -- Keep transaction history even if item is deleted
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,     -- Delete log if the student account is wiped
    quantity INT NOT NULL DEFAULT 1 CONSTRAINT positive_quantity CHECK (quantity > 0),
    points_spent INT NOT NULL, -- Captured at time of purchase (cost * quantity)
    purchased_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Optimization Indexes for Fast Queries
CREATE INDEX idx_shop_items_seller ON shop_items(seller_id);
CREATE INDEX idx_shop_transactions_user ON shop_transactions(user_id);
CREATE INDEX idx_shop_transactions_item ON shop_transactions(shop_item_id);