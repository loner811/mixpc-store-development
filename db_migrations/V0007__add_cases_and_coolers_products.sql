-- Добавление товаров для категорий Корпуса и Куллеры

INSERT INTO t_p58610579_mixpc_store_developm.products 
(category_id, name, description, price, brand, image_filename, is_featured, is_popular) 
VALUES 
-- Корпуса
(8, 'Корпус Cooler Master MasterBox Q300L', 'Компактный корпус MicroATX с хорошей вентиляцией', 4990, 'Cooler Master', '8.jpg', false, false),
(8, 'Корпус NZXT H510', 'Стильный корпус ATX с закалённым стеклом', 7990, 'NZXT', '8.jpg', false, false),
(8, 'Корпус Fractal Design Meshify C', 'Корпус ATX с отличным воздушным охлаждением', 9990, 'Fractal Design', '8.jpg', true, true),
(8, 'Корпус Lian Li O11 Dynamic', 'Премиальный корпус для водяного охлаждения', 14990, 'Lian Li', '8.jpg', true, false),
-- Куллеры
(9, 'Кулер DeepCool GAMMAXX 400', 'Башенный кулер для процессора, 120мм', 1490, 'DeepCool', '9.jpg', false, false),
(9, 'Кулер Noctua NH-D15', 'Топовый воздушный кулер с двумя вентиляторами', 8990, 'Noctua', '9.jpg', true, true),
(9, 'Кулер be quiet! Dark Rock Pro 4', 'Тихий и мощный башенный кулер', 7990, 'be quiet!', '9.jpg', false, false),
(9, 'Кулер Arctic Freezer 34 eSports DUO', 'Двухвентиляторный башенный кулер', 3490, 'Arctic', '9.jpg', false, false);
