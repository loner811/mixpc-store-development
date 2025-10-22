-- AMD Ryzen 9 7950X
INSERT INTO t_p58610579_mixpc_store_developm.product_specifications (product_id, spec_name, spec_value, display_order) VALUES
(1, 'Гарантия', '36 мес.', 0),
(1, 'Сокет', 'AM5', 1),
(1, 'Поколение процессоров', 'AMD Ryzen 7000', 2),
(1, 'Количество ядер', '16', 3),
(1, 'Количество потоков', '32', 4),
(1, 'Базовая частота', '4.5 ГГц', 5),
(1, 'Максимальная частота', '5.7 ГГц', 6),
(1, 'Поддержка DDR5', 'Есть', 7);

-- Intel Core i9-13900K
INSERT INTO t_p58610579_mixpc_store_developm.product_specifications (product_id, spec_name, spec_value, display_order) VALUES
(2, 'Гарантия', '36 мес.', 0),
(2, 'Сокет', 'LGA 1700', 1),
(2, 'Поколение процессоров', 'Intel 13th Gen', 2),
(2, 'Количество ядер', '24 (8P+16E)', 3),
(2, 'Количество потоков', '32', 4),
(2, 'Базовая частота', '3.0 ГГц', 5),
(2, 'Максимальная частота', '5.8 ГГц', 6),
(2, 'Поддержка DDR5', 'Есть', 7);

-- NVIDIA GeForce RTX 4090
INSERT INTO t_p58610579_mixpc_store_developm.product_specifications (product_id, spec_name, spec_value, display_order) VALUES
(3, 'Гарантия', '24 мес.', 0),
(3, 'Объем видеопамяти', '24 ГБ', 1),
(3, 'Тип памяти', 'GDDR6X', 2),
(3, 'Частота памяти', '21 Гбит/с', 3),
(3, 'Разрядность шины', '384 бит', 4),
(3, 'Техпроцесс', '5 нм', 5),
(3, 'Количество ядер CUDA', '16384', 6),
(3, 'Рекомендуемая мощность БП', '850 Вт', 7);

-- AMD Radeon RX 7900 XTX
INSERT INTO t_p58610579_mixpc_store_developm.product_specifications (product_id, spec_name, spec_value, display_order) VALUES
(4, 'Гарантия', '24 мес.', 0),
(4, 'Объем видеопамяти', '24 ГБ', 1),
(4, 'Тип памяти', 'GDDR6', 2),
(4, 'Частота памяти', '20 Гбит/с', 3),
(4, 'Разрядность шины', '384 бит', 4),
(4, 'Техпроцесс', '5 нм', 5),
(4, 'Потоковые процессоры', '6144', 6),
(4, 'Рекомендуемая мощность БП', '800 Вт', 7);

-- Kingston Fury 32GB DDR5
INSERT INTO t_p58610579_mixpc_store_developm.product_specifications (product_id, spec_name, spec_value, display_order) VALUES
(5, 'Гарантия', 'Пожизненная', 0),
(5, 'Объем', '32 ГБ (2x16 ГБ)', 1),
(5, 'Тип памяти', 'DDR5', 2),
(5, 'Частота', '6000 МГц', 3),
(5, 'Тайминги', 'CL40', 4),
(5, 'Напряжение', '1.35 В', 5),
(5, 'Радиатор', 'Есть', 6);

-- Samsung 980 PRO 2TB
INSERT INTO t_p58610579_mixpc_store_developm.product_specifications (product_id, spec_name, spec_value, display_order) VALUES
(6, 'Гарантия', '60 мес.', 0),
(6, 'Объем', '2 ТБ', 1),
(6, 'Интерфейс', 'PCIe 4.0 x4, NVMe', 2),
(6, 'Форм-фактор', 'M.2 2280', 3),
(6, 'Скорость чтения', '7000 МБ/с', 4),
(6, 'Скорость записи', '5100 МБ/с', 5),
(6, 'Тип памяти', 'V-NAND 3-bit MLC', 6);

-- ASUS ROG Strix B650
INSERT INTO t_p58610579_mixpc_store_developm.product_specifications (product_id, spec_name, spec_value, display_order) VALUES
(7, 'Гарантия', '36 мес.', 0),
(7, 'Сокет', 'AM5', 1),
(7, 'Чипсет', 'AMD B650', 2),
(7, 'Форм-фактор', 'ATX', 3),
(7, 'Слоты памяти', '4 x DDR5', 4),
(7, 'Максимум памяти', '128 ГБ', 5),
(7, 'Слоты PCIe', '2 x PCIe 4.0 x16', 6),
(7, 'Сеть', '2.5 Гбит/с LAN', 7);

-- Corsair RM850x
INSERT INTO t_p58610579_mixpc_store_developm.product_specifications (product_id, spec_name, spec_value, display_order) VALUES
(8, 'Гарантия', '120 мес.', 0),
(8, 'Мощность', '850 Вт', 1),
(8, 'Сертификат', '80 PLUS Gold', 2),
(8, 'Модульность', 'Полностью модульный', 3),
(8, 'PFC', 'Активный', 4),
(8, 'Охлаждение', '135 мм вентилятор', 5),
(8, 'Разъемы CPU', '2 x 8-pin', 6),
(8, 'Разъемы PCIe', '4 x 8-pin', 7);

-- Сделаем первые 4 товара популярными
UPDATE t_p58610579_mixpc_store_developm.products SET is_featured = true WHERE id IN (1, 2, 3, 4);