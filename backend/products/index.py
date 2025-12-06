'''
Business: API для управления товарами магазина
Args: event - dict с httpMethod, body, queryStringParameters
      context - object с request_id, function_name
Returns: HTTP response dict
'''

import json
import os
import psycopg2
import hashlib
from typing import Dict, Any

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'isBase64Encoded': False,
            'body': ''
        }
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters', {}) or {}
            category_name = params.get('category')
            brand = params.get('brand')
            min_price = params.get('minPrice')
            max_price = params.get('maxPrice')
            featured_only = params.get('featured') == 'true'
            
            query = '''
                SELECT p.id, p.name, p.description, p.price, p.brand, p.image_filename, 
                       p.is_featured, p.in_stock, p.stock_quantity, c.name as category_name
                FROM t_p58610579_mixpc_store_developm.products p
                LEFT JOIN t_p58610579_mixpc_store_developm.categories c ON p.category_id = c.id
                WHERE 1=1
            '''
            
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
            
            cur.execute(query)
            products = []
            for row in cur.fetchall():
                product_id = row[0]
                
                cur.execute('''
                    SELECT spec_name, spec_value
                    FROM t_p58610579_mixpc_store_developm.product_specifications
                    WHERE product_id = %s
                    ORDER BY display_order
                ''', (product_id,))
                
                specifications = []
                for spec_row in cur.fetchall():
                    specifications.append({
                        'spec_name': spec_row[0],
                        'spec_value': spec_row[1]
                    })
                
                products.append({
                    'id': row[0],
                    'name': row[1],
                    'description': row[2],
                    'price': float(row[3]),
                    'brand': row[4],
                    'image_url': row[5],
                    'is_featured': row[6],
                    'in_stock': row[7],
                    'stock_quantity': row[8],
                    'category': row[9],
                    'specifications': specifications
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps(products)
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            if action == 'register':
                email = body.get('email')
                username = body.get('username')
                password = body.get('password')
                
                if not email or not username or not password:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'isBase64Encoded': False,
                        'body': json.dumps({'error': 'Заполните все поля'})
                    }
                
                cur.execute('SELECT id FROM t_p58610579_mixpc_store_developm.users WHERE email = %s OR username = %s', (email, username))
                if cur.fetchone():
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'isBase64Encoded': False,
                        'body': json.dumps({'error': 'Пользователь с таким email или логином уже существует'})
                    }
                
                password_hash = hashlib.sha256(password.encode()).hexdigest()
                
                cur.execute('''
                    INSERT INTO t_p58610579_mixpc_store_developm.users (email, username, password_hash, role)
                    VALUES (%s, %s, %s, 'user')
                    RETURNING id, email, username, role
                ''', (email, username, password_hash))
                
                user_data = cur.fetchone()
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({
                        'success': True,
                        'message': 'Регистрация успешна!',
                        'user': {
                            'id': user_data[0],
                            'email': user_data[1],
                            'username': user_data[2],
                            'role': user_data[3]
                        }
                    })
                }
            
            elif action == 'login':
                username = body.get('username')
                password = body.get('password')
                
                if not username or not password:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'isBase64Encoded': False,
                        'body': json.dumps({'error': 'Введите логин и пароль'})
                    }
                
                password_hash = hashlib.sha256(password.encode()).hexdigest()
                
                cur.execute('''
                    SELECT id, email, username, role 
                    FROM t_p58610579_mixpc_store_developm.users 
                    WHERE username = %s AND password_hash = %s
                ''', (username, password_hash))
                
                user_data = cur.fetchone()
                
                if not user_data:
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'isBase64Encoded': False,
                        'body': json.dumps({'error': 'Неверный логин или пароль'})
                    }
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({
                        'success': True,
                        'message': 'Вход выполнен успешно!',
                        'user': {
                            'id': user_data[0],
                            'email': user_data[1],
                            'username': user_data[2],
                            'role': user_data[3]
                        }
                    })
                }
            
            cur.execute('''
                INSERT INTO products (category_id, name, description, price, brand, image_filename, specs, is_popular)
                VALUES ((SELECT id FROM categories WHERE slug = %s), %s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            ''', (
                body['categorySlug'],
                body['name'],
                body.get('description', ''),
                body['price'],
                body['brand'],
                body.get('image', ''),
                json.dumps(body.get('specs', {})),
                body.get('isPopular', False)
            ))
            
            product_id = cur.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'id': product_id, 'message': 'Product created'})
            }
        
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            product_id = body.get('id')
            
            cur.execute('''
                UPDATE products 
                SET name = %s, description = %s, price = %s, brand = %s, 
                    image_filename = %s, specs = %s, is_popular = %s, updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
            ''', (
                body['name'],
                body.get('description', ''),
                body['price'],
                body['brand'],
                body.get('image', ''),
                json.dumps(body.get('specs', {})),
                body.get('isPopular', False),
                product_id
            ))
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'message': 'Product updated'})
            }
        
    except Exception as e:
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': str(e)})
        }
    finally:
        cur.close()
        conn.close()
    
    return {'statusCode': 405, 'body': json.dumps({'error': 'Method not allowed'})}