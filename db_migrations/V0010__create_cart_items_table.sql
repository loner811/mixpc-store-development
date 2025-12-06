-- Создание таблицы для хранения корзины пользователей
CREATE TABLE IF NOT EXISTS t_p58610579_mixpc_store_developm.cart_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL REFERENCES t_p58610579_mixpc_store_developm.products(id),
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

-- Индекс для быстрого поиска корзины пользователя
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON t_p58610579_mixpc_store_developm.cart_items(user_id);

-- Комментарии к таблице
COMMENT ON TABLE t_p58610579_mixpc_store_developm.cart_items IS 'Хранение товаров в корзине пользователей';
COMMENT ON COLUMN t_p58610579_mixpc_store_developm.cart_items.user_id IS 'ID пользователя';
COMMENT ON COLUMN t_p58610579_mixpc_store_developm.cart_items.product_id IS 'ID товара';
COMMENT ON COLUMN t_p58610579_mixpc_store_developm.cart_items.quantity IS 'Количество единиц товара';
