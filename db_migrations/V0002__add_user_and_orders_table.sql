-- Добавляем обычного пользователя
INSERT INTO t_p58610579_mixpc_store_developm.users (email, username, password_hash, role)
VALUES ('user@example.com', 'login', '123', 'user');

-- Создаем таблицу заказов
CREATE TABLE IF NOT EXISTS t_p58610579_mixpc_store_developm.orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES t_p58610579_mixpc_store_developm.users(id),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    delivery_type VARCHAR(50) NOT NULL,
    delivery_address TEXT,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем таблицу товаров в заказе
CREATE TABLE IF NOT EXISTS t_p58610579_mixpc_store_developm.order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES t_p58610579_mixpc_store_developm.orders(id),
    product_id INTEGER,
    product_name VARCHAR(255) NOT NULL,
    product_price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);