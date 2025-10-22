-- Таблица пользователей
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица категорий товаров
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица товаров
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    brand VARCHAR(100),
    image_filename VARCHAR(255),
    specs JSONB,
    is_popular BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица избранного
CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    product_id INTEGER REFERENCES products(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

-- Таблица корзины
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица сообщений от пользователей
CREATE TABLE contact_messages (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Вставка тестового администратора (пароль: admin123)
INSERT INTO users (email, username, password_hash, role) 
VALUES ('admin@mixpc.ru', 'admin', 'admin123', 'admin');

-- Вставка категорий
INSERT INTO categories (name, slug, icon) VALUES
('Компьютеры', 'computers', 'Monitor'),
('Процессоры', 'processors', 'Cpu'),
('Видеокарты', 'videocards', 'Zap'),
('Материнские платы', 'motherboards', 'CircuitBoard'),
('Оперативная память', 'ram', 'MemoryStick'),
('Накопители SSD', 'ssd', 'HardDrive'),
('Блоки питания', 'psu', 'Battery'),
('Корпуса', 'cases', 'Box'),
('Куллеры', 'coolers', 'Fan'),
('Мониторы', 'monitors', 'MonitorDot'),
('Клавиатуры', 'keyboards', 'Keyboard'),
('Компьютерные мыши', 'mice', 'Mouse');

-- Вставка тестовых товаров
INSERT INTO products (category_id, name, description, price, brand, image_filename, specs, is_popular) VALUES
(2, 'AMD Ryzen 9 7950X', 'Мощный 16-ядерный процессор для профессиональных задач', 45990, 'AMD', '1.jpg', '{"cores": "16", "threads": "32", "frequency": "4.5 GHz"}', true),
(2, 'Intel Core i9-13900K', 'Топовый процессор Intel 13 поколения', 52990, 'Intel', '2.jpg', '{"cores": "24", "threads": "32", "frequency": "5.8 GHz"}', true),
(3, 'NVIDIA GeForce RTX 4090', 'Флагманская видеокарта для игр и работы', 159990, 'NVIDIA', '3.jpg', '{"memory": "24 GB GDDR6X", "power": "450W"}', true),
(3, 'AMD Radeon RX 7900 XTX', 'Мощная видеокарта для геймеров', 89990, 'AMD', '4.jpg', '{"memory": "24 GB GDDR6", "power": "355W"}', true),
(5, 'Kingston Fury 32GB DDR5', 'Высокоскоростная оперативная память', 12990, 'Kingston', '5.jpg', '{"capacity": "32GB", "type": "DDR5", "frequency": "6000 MHz"}', false),
(6, 'Samsung 980 PRO 2TB', 'Быстрый NVMe SSD накопитель', 18990, 'Samsung', '6.jpg', '{"capacity": "2TB", "interface": "NVMe PCIe 4.0", "speed": "7000 MB/s"}', true),
(4, 'ASUS ROG Strix B650', 'Игровая материнская плата для AMD', 24990, 'ASUS', '7.jpg', '{"socket": "AM5", "chipset": "B650", "formfactor": "ATX"}', false),
(7, 'Corsair RM850x', 'Надежный блок питания 850W', 14990, 'Corsair', '8.jpg', '{"power": "850W", "efficiency": "80+ Gold", "modular": "Full"}', false);
