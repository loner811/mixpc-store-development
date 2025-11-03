-- Таблица для сохранения сборок ПК пользователей
CREATE TABLE IF NOT EXISTS pc_builds (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    name VARCHAR(255) DEFAULT 'Моя сборка',
    total_price NUMERIC(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для компонентов в сборке
CREATE TABLE IF NOT EXISTS pc_build_items (
    id SERIAL PRIMARY KEY,
    build_id INTEGER REFERENCES pc_builds(id),
    product_id INTEGER REFERENCES products(id),
    category_id INTEGER REFERENCES categories(id),
    quantity INTEGER DEFAULT 1,
    price NUMERIC(10,2) NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_pc_builds_user_id ON pc_builds(user_id);
CREATE INDEX IF NOT EXISTS idx_pc_build_items_build_id ON pc_build_items(build_id);