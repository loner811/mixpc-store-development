-- Добавляем поле для описания товара
ALTER TABLE t_p58610579_mixpc_store_developm.products 
ADD COLUMN IF NOT EXISTS description TEXT;

-- Создаем таблицу характеристик товаров
CREATE TABLE IF NOT EXISTS t_p58610579_mixpc_store_developm.product_specifications (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES t_p58610579_mixpc_store_developm.products(id),
    spec_name VARCHAR(255) NOT NULL,
    spec_value TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Добавляем индекс для быстрого поиска характеристик по товару
CREATE INDEX IF NOT EXISTS idx_product_specs_product_id 
ON t_p58610579_mixpc_store_developm.product_specifications(product_id);