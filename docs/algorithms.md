# 1. Основные алгоритмы работы

## Оглавление
- [1.1 Аутентификация пользователей](#11-аутентификация-пользователей)
- [1.2 Загрузка товаров с фильтрацией](#12-загрузка-товаров-с-фильтрацией)
- [1.3 Создание заказа](#13-создание-заказа)
- [1.4 Управление избранным](#14-управление-избранным)
- [1.5 Админ-панель](#15-админ-панель)

---

## 1.1 Аутентификация пользователей

### Описание
Система аутентификации обеспечивает безопасный вход/регистрацию пользователей с использованием JWT токенов и хеширования паролей (SHA-256).

### Файлы
- **Backend:** `backend/auth/index.py` (строки 14-176)
- **Frontend:** `src/pages/Index.tsx` (строки 635-703)

### Алгоритм работы

#### 1. Регистрация нового пользователя
```python
# backend/auth/index.py (НЕ ИСПОЛЬЗУЕТСЯ - регистрация через products)
# Регистрация реализована в backend/products/index.py строки 110-154

# Шаг 1: Проверка существования пользователя
cur.execute('SELECT id FROM users WHERE email = %s OR username = %s', (email, username))
if cur.fetchone():
    return {'error': 'Пользователь уже существует'}

# Шаг 2: Хеширование пароля SHA-256
password_hash = hashlib.sha256(password.encode()).hexdigest()

# Шаг 3: Создание записи в БД
cur.execute('''
    INSERT INTO users (email, username, password_hash, role)
    VALUES (%s, %s, %s, 'user')
    RETURNING id, email, username, role
''', (email, username, password_hash))
```

**Что происходит:**
1. Проверяется, не занят ли email/логин
2. Пароль хешируется алгоритмом SHA-256 (необратимое преобразование)
3. Данные сохраняются в БД, по умолчанию роль = 'user'

#### 2. Вход в систему (Login)
```python
# backend/auth/index.py строки 46-103

# Шаг 1: Поиск пользователя по username
cur.execute(
    "SELECT id, username, password_hash, role, email FROM users WHERE username = %s",
    (username,)
)
user = cur.fetchone()

# Шаг 2: Проверка пароля
if password_hash != hash_password(password):
    return {'error': 'Invalid credentials'}

# Шаг 3: Генерация JWT токена
token_payload = {
    'user_id': user_id,
    'username': db_username,
    'role': role,
    'exp': datetime.utcnow() + timedelta(days=7)  # Токен живёт 7 дней
}
token = jwt.encode(token_payload, JWT_SECRET, algorithm='HS256')

# Шаг 4: Возврат токена и данных пользователя
return {
    'token': token,
    'user': {'id': user_id, 'username': db_username, 'role': role, 'email': email}
}
```

**Что происходит:**
1. Ищем пользователя в БД по логину
2. Сравниваем хеш пароля из БД с хешем введённого пароля
3. Генерируем JWT токен (зашифрованный ключ, который живёт 7 дней)
4. Отправляем токен клиенту для хранения в localStorage

#### 3. Frontend обработка
```typescript
// src/pages/Index.tsx строки 635-659

const response = await fetch('https://functions.poehali.dev/9b2ca161-5453-49a5-959c-0d611720a876', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
});

const data = await response.json();

if (response.ok && data.token) {
    // Сохраняем токен локально
    localStorage.setItem('authToken', data.token);
    
    // Обновляем состояние приложения
    setCurrentUser(data.user);
    setIsLoggedIn(true);
    setIsAdmin(data.user.role === 'admin');
    setLoginOpen(false);
}
```

**Что происходит:**
1. Отправляем логин/пароль на backend
2. Получаем JWT токен и данные пользователя
3. Сохраняем токен в браузере (localStorage)
4. Обновляем интерфейс (показываем имя пользователя, кнопку выхода)

---

## 1.2 Загрузка товаров с фильтрацией

### Описание
Динамическая загрузка товаров из базы данных с поддержкой фильтров по категории, бренду, цене и признаку "популярность".

### Файлы
- **Backend:** `backend/products/index.py` (строки 37-104)
- **Frontend:** `src/pages/Index.tsx` (строки 230-260)

### Алгоритм работы

#### 1. Backend - построение SQL запроса
```python
# backend/products/index.py строки 37-104

# Шаг 1: Парсинг фильтров из URL параметров
params = event.get('queryStringParameters', {}) or {}
category_name = params.get('category')
brand = params.get('brand')
min_price = params.get('minPrice')
max_price = params.get('maxPrice')
featured_only = params.get('featured') == 'true'

# Шаг 2: Динамическое построение SQL запроса
query = '''
    SELECT p.id, p.name, p.description, p.price, p.brand, p.image_filename, 
           p.is_featured, p.in_stock, p.stock_quantity, c.name as category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE 1=1
'''

# Добавляем условия фильтрации
if category_name:
    query += f" AND c.name = '{category_name}'"
if brand:
    query += f" AND p.brand = '{brand}'"
if min_price:
    query += f" AND p.price >= {min_price}"
if max_price:
    query += f" AND p.price <= {max_price}"
if featured_only:
    query += " AND p.is_featured = true"

query += " ORDER BY p.created_at DESC LIMIT 50"

# Шаг 3: Получение спецификаций для каждого товара
for row in cur.fetchall():
    product_id = row[0]
    
    # Подзапрос для характеристик товара
    cur.execute('''
        SELECT spec_name, spec_value
        FROM product_specifications
        WHERE product_id = %s
        ORDER BY display_order
    ''', (product_id,))
    
    specifications = []
    for spec_row in cur.fetchall():
        specifications.append({
            'spec_name': spec_row[0],
            'spec_value': spec_row[1]
        })
```

**Что происходит:**
1. Читаем параметры из URL (?category=Процессоры&brand=AMD)
2. Динамически строим SQL запрос с фильтрами
3. Для каждого товара загружаем его характеристики из отдельной таблицы
4. Возвращаем массив товаров с полной информацией

#### 2. Frontend - запрос и отображение
```typescript
// src/pages/Index.tsx строки 230-260

const loadProducts = async () => {
    setIsLoadingProducts(true);
    try {
        // Формируем URL с фильтрами
        let url = 'https://functions.poehali.dev/9b2ca161-5453-49a5-959c-0d611720a876?';
        const params = new URLSearchParams();
        
        if (selectedCategory && selectedCategory !== 'Все') {
            params.append('category', selectedCategory);
        }
        if (selectedBrand && selectedBrand !== 'Все бренды') {
            params.append('brand', selectedBrand);
        }
        if (priceRange[0] > 0) {
            params.append('minPrice', priceRange[0].toString());
        }
        if (priceRange[1] < 500000) {
            params.append('maxPrice', priceRange[1].toString());
        }
        
        const response = await fetch(url + params.toString());
        const data = await response.json();
        
        // Сохраняем товары в состояние
        setProducts(data);
    } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
    } finally {
        setIsLoadingProducts(false);
    }
};
```

**Что происходит:**
1. Собираем активные фильтры (категория, бренд, диапазон цен)
2. Формируем URL с параметрами запроса
3. Отправляем GET запрос на backend
4. Полученные товары отображаются в интерфейсе

---

## 1.3 Создание заказа

### Описание
Процесс оформления заказа с созданием записей в таблицах orders и order_items, а также обновлением остатков товаров.

### Файлы
- **Backend:** `backend/orders/index.py` (строки 79-119)
- **Frontend:** `src/pages/Index.tsx` (строки 540-600)

### Алгоритм работы

#### 1. Backend - создание заказа
```python
# backend/orders/index.py строки 79-119

# Шаг 1: Парсинг данных заказа
body_data = json.loads(event.get('body', '{}'))
user_id = body_data.get('user_id')
full_name = body_data.get('full_name')
email = body_data.get('email')
phone = body_data.get('phone')
delivery_type = body_data.get('delivery_type')
total_amount = body_data.get('total_amount')
items = body_data.get('items', [])

# Шаг 2: Создание записи заказа
cursor.execute('''
    INSERT INTO orders 
    (user_id, full_name, email, phone, delivery_type, delivery_address, total_amount)
    VALUES (%s, %s, %s, %s, %s, %s, %s)
    RETURNING id
''', (user_id, full_name, email, phone, delivery_type, delivery_address, total_amount))

order_id = cursor.fetchone()['id']

# Шаг 3: Добавление товаров в заказ
for item in items:
    product_id = item.get('id')
    
    # Создаём запись order_items
    cursor.execute('''
        INSERT INTO order_items
        (order_id, product_id, product_name, product_price, quantity)
        VALUES (%s, %s, %s, %s, %s)
    ''', (order_id, product_id, item.get('name'), item.get('price'), 1))
    
    # Уменьшаем остаток товара на складе
    cursor.execute('''
        UPDATE products
        SET stock_quantity = GREATEST(stock_quantity - 1, 0)
        WHERE id = %s
    ''', (product_id,))

conn.commit()  # Сохраняем все изменения
```

**Что происходит:**
1. Создаём основную запись заказа в таблице `orders`
2. Для каждого товара в корзине создаём запись в `order_items`
3. Уменьшаем количество товара на складе (но не ниже 0)
4. Все операции выполняются в одной транзакции (либо всё, либо ничего)

#### 2. Frontend - оформление заказа
```typescript
// src/pages/Index.tsx строки 540-600

const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cart.length === 0) {
        alert('Корзина пуста');
        return;
    }
    
    const formData = new FormData(e.target as HTMLFormElement);
    const orderData = {
        user_id: currentUser?.id || null,
        full_name: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        delivery_type: formData.get('deliveryType'),
        delivery_address: formData.get('address') || '',
        total_amount: cart.reduce((sum, item) => sum + item.price, 0),
        items: cart
    };
    
    try {
        const response = await fetch('https://functions.poehali.dev/9b2ca161-5453-49a5-959c-0d611720a876', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        
        if (response.ok) {
            alert('Заказ успешно оформлен!');
            setCart([]);  // Очищаем корзину
            setCartOpen(false);
        }
    } catch (error) {
        alert('Ошибка при оформлении заказа');
    }
};
```

**Что происходит:**
1. Проверяем, что корзина не пуста
2. Собираем данные из формы (имя, телефон, адрес)
3. Отправляем POST запрос с данными заказа и списком товаров
4. При успехе - очищаем корзину и закрываем окно

---

## 1.4 Управление избранным

### Описание
Локальное сохранение избранных товаров в localStorage браузера для быстрого доступа.

### Файлы
- **Frontend:** `src/pages/Index.tsx` (строки 270-290)

### Алгоритм работы

```typescript
// src/pages/Index.tsx строки 270-290

// Загрузка избранного при старте приложения
useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
    }
}, []);

// Добавление/удаление товара из избранного
const toggleFavorite = (product: any) => {
    const newFavorites = favorites.some(f => f.id === product.id)
        ? favorites.filter(f => f.id !== product.id)  // Удаляем если уже есть
        : [...favorites, product];  // Добавляем если нет
    
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
};
```

**Что происходит:**
1. При загрузке приложения читаем избранное из localStorage
2. При клике на "Сердечко":
   - Если товар уже в избранном → удаляем
   - Если товара нет → добавляем
3. Сохраняем обновлённый список в localStorage
4. Данные сохраняются в браузере и доступны после перезагрузки страницы

---

## 1.5 Админ-панель

### Описание
Интерфейс управления товарами, заказами и сообщениями для администраторов магазина.

### Файлы
- **Backend Products:** `backend/products/index.py` (строки 199-278)
- **Backend Orders:** `backend/orders/index.py` (строки 33-77, 121-145)
- **Frontend:** `src/pages/Index.tsx` (строки 400-520)

### Алгоритм работы

#### 1. Загрузка данных админки
```typescript
// src/pages/Index.tsx строки 400-450

const loadAdminData = async () => {
    if (!isAdmin) return;
    
    try {
        // Загрузка всех товаров
        const productsRes = await fetch('https://functions.poehali.dev/9b2ca161-5453-49a5-959c-0d611720a876');
        const productsData = await productsRes.json();
        setAdminProducts(productsData);
        
        // Загрузка заказов (с админским заголовком)
        const ordersRes = await fetch('https://functions.poehali.dev/9b2ca161-5453-49a5-959c-0d611720a876', {
            headers: { 'X-Admin-Auth': 'admin:123' }
        });
        const ordersData = await ordersRes.json();
        
        // Backend возвращает массив, не объект
        if (Array.isArray(ordersData)) {
            setAdminOrders(ordersData);
        }
        
        // Загрузка сообщений
        const messagesRes = await fetch('https://functions.poehali.dev/9b2ca161-5453-49a5-959c-0d611720a876');
        const messagesData = await messagesRes.json();
        
        if (Array.isArray(messagesData)) {
            setAdminMessages(messagesData);
        } else if (messagesData.messages) {
            setAdminMessages(messagesData.messages);
        }
    } catch (error) {
        console.error('Ошибка загрузки данных админки:', error);
    }
};
```

**Что происходит:**
1. Проверяем права админа
2. Загружаем товары, заказы (с админским заголовком) и сообщения
3. Backend возвращает массивы данных
4. Обновляем состояние админ-панели

#### 2. Сохранение товара
```python
# backend/products/index.py строки 199-278

# POST запрос для создания товара
cursor.execute('''
    INSERT INTO products 
    (category_id, name, description, price, brand, image_filename, is_featured, stock_quantity)
    VALUES (
        (SELECT id FROM categories WHERE slug = %s), 
        %s, %s, %s, %s, %s, %s, %s
    )
    RETURNING id
''', (
    body['categorySlug'],
    body['name'],
    body.get('description', ''),
    body['price'],
    body['brand'],
    body.get('image', ''),
    body.get('isPopular', False),
    body.get('stock', 10)
))

product_id = cursor.fetchone()[0]

# Добавление характеристик товара
if body.get('specs'):
    for i, spec in enumerate(body['specs']):
        cursor.execute('''
            INSERT INTO product_specifications
            (product_id, spec_name, spec_value, display_order)
            VALUES (%s, %s, %s, %s)
        ''', (product_id, spec.get('name'), spec.get('value'), i))

conn.commit()

# PUT запрос для обновления товара
cursor.execute('''
    UPDATE products
    SET name = %s, description = %s, price = %s, brand = %s, 
        image_filename = %s, is_featured = %s, stock_quantity = %s
    WHERE id = %s
''', (
    body['name'],
    body.get('description', ''),
    body['price'],
    body['brand'],
    body.get('image', ''),
    body.get('isPopular', False),
    body.get('stock', 10),
    body['id']
))

# Удаление старых характеристик и добавление новых
cursor.execute('DELETE FROM product_specifications WHERE product_id = %s', (body['id'],))
if body.get('specs'):
    for i, spec in enumerate(body['specs']):
        cursor.execute('''
            INSERT INTO product_specifications
            (product_id, spec_name, spec_value, display_order)
            VALUES (%s, %s, %s, %s)
        ''', (body['id'], spec.get('name'), spec.get('value'), i))

conn.commit()
```

**Что происходит:**
1. **Создание товара (POST):**
   - Добавляем запись в таблицу `products`
   - Получаем ID созданного товара
   - Добавляем характеристики в `product_specifications`
   
2. **Обновление товара (PUT):**
   - Обновляем данные в таблице `products`
   - Удаляем все старые характеристики
   - Добавляем новые характеристики
   - Все в одной транзакции

#### 3. Обновление статуса заказа
```python
# backend/orders/index.py строки 121-145

# Проверка прав админа
if event.get('headers', {}).get('X-Admin-Auth') != 'admin:123':
    return {'statusCode': 403, 'error': 'Admin access required'}

# Обновление статуса
body_data = json.loads(event.get('body', '{}'))
order_id = body_data.get('id')
status = body_data.get('status')

cursor.execute('''
    UPDATE orders
    SET status = %s
    WHERE id = %s
''', (status, order_id))

conn.commit()
```

**Что происходит:**
1. Проверяем заголовок `X-Admin-Auth` для прав администратора
2. Обновляем статус заказа в БД (новый, в обработке, доставлен)
3. Frontend обновляет интерфейс

---

## Итоговая схема взаимодействия

```
┌─────────────┐
│  Браузер    │
│  (React)    │
└──────┬──────┘
       │
       ├─── Товары ────────> GET /products?category=X&brand=Y
       │                     backend/products/index.py
       │                     ↓
       │                     PostgreSQL: products + specifications
       │
       ├─── Авторизация ──> POST /auth {username, password}
       │                     backend/auth/index.py
       │                     ↓
       │                     JWT токен + данные пользователя
       │
       ├─── Заказ ────────> POST /orders {user_id, items, total}
       │                     backend/orders/index.py
       │                     ↓
       │                     PostgreSQL: orders + order_items
       │                     ↓
       │                     Обновление остатков
       │
       └─── Админка ──────> GET /orders (header: X-Admin-Auth)
                            backend/orders/index.py
                            ↓
                            Список заказов с items
```

---

## Ключевые особенности

1. **Безопасность:**
   - Пароли хешируются SHA-256
   - JWT токены для авторизации
   - Проверка прав администратора через заголовок

2. **Производительность:**
   - Фильтрация товаров на уровне SQL
   - Ограничение выборки (LIMIT 50)
   - Избранное хранится локально (не нагружает сервер)

3. **Целостность данных:**
   - Транзакции для заказов (либо всё, либо ничего)
   - Проверка существования пользователей при регистрации
   - Остатки не могут быть меньше 0

4. **Масштабируемость:**
   - Backend функции независимы
   - База данных PostgreSQL с индексами
   - Статичный frontend (React SPA)
