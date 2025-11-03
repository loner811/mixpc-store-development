'''
Business: API для управления товарами магазина
Args: event - dict с httpMethod, body, queryStringParameters
      context - object с request_id, function_name
Returns: HTTP response dict
'''

import json
import os
import psycopg2
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
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters', {}) or {}
            
            if params.get('action') == 'get_build':
                user_id = event.get('headers', {}).get('x-user-id')
                if not user_id:
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Требуется авторизация'})
                    }
                
                cur.execute('''
                    SELECT pb.id, pb.name, pb.total_price, pb.created_at, pb.updated_at,
                           json_agg(
                               json_build_object(
                                   'id', pbi.id,
                                   'product_id', pbi.product_id,
                                   'quantity', pbi.quantity,
                                   'price', pbi.price,
                                   'product_name', p.name,
                                   'product_image', p.image_filename,
                                   'category_name', c.name
                               )
                           ) FILTER (WHERE pbi.id IS NOT NULL) as items
                    FROM t_p58610579_mixpc_store_developm.pc_builds pb
                    LEFT JOIN t_p58610579_mixpc_store_developm.pc_build_items pbi ON pb.id = pbi.build_id
                    LEFT JOIN t_p58610579_mixpc_store_developm.products p ON pbi.product_id = p.id
                    LEFT JOIN t_p58610579_mixpc_store_developm.categories c ON pbi.category_id = c.id
                    WHERE pb.user_id = %s
                    GROUP BY pb.id
                    ORDER BY pb.updated_at DESC
                    LIMIT 1
                ''', (user_id,))
                
                row = cur.fetchone()
                if not row:
                    cur.execute('''
                        INSERT INTO t_p58610579_mixpc_store_developm.pc_builds (user_id, name, total_price)
                        VALUES (%s, 'Моя сборка', 0)
                        RETURNING id, name, total_price, created_at, updated_at
                    ''', (user_id,))
                    conn.commit()
                    new_build = cur.fetchone()
                    build = {
                        'id': new_build[0],
                        'name': new_build[1],
                        'total_price': float(new_build[2]),
                        'created_at': str(new_build[3]),
                        'updated_at': str(new_build[4]),
                        'items': []
                    }
                else:
                    build = {
                        'id': row[0],
                        'name': row[1],
                        'total_price': float(row[2]),
                        'created_at': str(row[3]),
                        'updated_at': str(row[4]),
                        'items': row[5] if row[5] else []
                    }
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(build, default=str)
                }
            
            category_name = params.get('category')
            brand = params.get('brand')
            min_price = params.get('minPrice')
            max_price = params.get('maxPrice')
            featured_only = params.get('featured') == 'true'
            
            query = '''
                SELECT p.id, p.name, p.description, p.price, p.brand, p.image_filename, 
                       p.is_featured, c.name as category_name
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
                products.append({
                    'id': row[0],
                    'name': row[1],
                    'description': row[2],
                    'price': float(row[3]),
                    'brand': row[4],
                    'image_url': row[5],
                    'is_featured': row[6],
                    'category': row[7]
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps(products)
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            
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
            action = body.get('action')
            
            if action == 'add_to_build':
                user_id = event.get('headers', {}).get('x-user-id') or event.get('headers', {}).get('X-User-Id')
                if not user_id:
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Требуется авторизация'})
                    }
                
                product_id = body.get('product_id')
                category_id = body.get('category_id')
                
                if not product_id or not category_id:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Не указан product_id или category_id'})
                    }
                
                cur.execute('SELECT id FROM t_p58610579_mixpc_store_developm.pc_builds WHERE user_id = %s ORDER BY updated_at DESC LIMIT 1', (user_id,))
                build = cur.fetchone()
                
                if not build:
                    cur.execute('''
                        INSERT INTO t_p58610579_mixpc_store_developm.pc_builds (user_id, name, total_price)
                        VALUES (%s, 'Моя сборка', 0)
                        RETURNING id
                    ''', (user_id,))
                    build_id = cur.fetchone()[0]
                else:
                    build_id = build[0]
                
                cur.execute('SELECT price FROM t_p58610579_mixpc_store_developm.products WHERE id = %s', (product_id,))
                product = cur.fetchone()
                
                if not product:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Товар не найден'})
                    }
                
                cur.execute('''
                    SELECT id FROM t_p58610579_mixpc_store_developm.pc_build_items 
                    WHERE build_id = %s AND category_id = %s
                ''', (build_id, category_id))
                existing = cur.fetchone()
                
                if existing:
                    cur.execute('''
                        UPDATE t_p58610579_mixpc_store_developm.pc_build_items 
                        SET product_id = %s, price = %s 
                        WHERE id = %s
                    ''', (product_id, product[0], existing[0]))
                else:
                    cur.execute('''
                        INSERT INTO t_p58610579_mixpc_store_developm.pc_build_items 
                        (build_id, product_id, category_id, quantity, price)
                        VALUES (%s, %s, %s, 1, %s)
                    ''', (build_id, product_id, category_id, product[0]))
                
                cur.execute('''
                    UPDATE t_p58610579_mixpc_store_developm.pc_builds 
                    SET total_price = (
                        SELECT COALESCE(SUM(price * quantity), 0) 
                        FROM t_p58610579_mixpc_store_developm.pc_build_items 
                        WHERE build_id = %s
                    ),
                    updated_at = CURRENT_TIMESTAMP
                    WHERE id = %s
                ''', (build_id, build_id))
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'message': 'Товар добавлен в сборку'})
                }
            
            elif action == 'remove_from_build':
                user_id = event.get('headers', {}).get('x-user-id') or event.get('headers', {}).get('X-User-Id')
                if not user_id:
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Требуется авторизация'})
                    }
                
                item_id = body.get('item_id')
                category_id = body.get('category_id')
                
                if category_id:
                    cur.execute('''
                        DELETE FROM t_p58610579_mixpc_store_developm.pc_build_items 
                        WHERE category_id = %s AND build_id IN (
                            SELECT id FROM t_p58610579_mixpc_store_developm.pc_builds WHERE user_id = %s
                        )
                        RETURNING build_id
                    ''', (category_id, user_id))
                elif item_id:
                    cur.execute('''
                        DELETE FROM t_p58610579_mixpc_store_developm.pc_build_items 
                        WHERE id = %s AND build_id IN (
                            SELECT id FROM t_p58610579_mixpc_store_developm.pc_builds WHERE user_id = %s
                        )
                        RETURNING build_id
                    ''', (item_id, user_id))
                else:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Не указан item_id или category_id'})
                    }
                
                result = cur.fetchone()
                if result:
                    build_id = result[0]
                    cur.execute('''
                        UPDATE t_p58610579_mixpc_store_developm.pc_builds 
                        SET total_price = (
                            SELECT COALESCE(SUM(price * quantity), 0) 
                            FROM t_p58610579_mixpc_store_developm.pc_build_items 
                            WHERE build_id = %s
                        ),
                        updated_at = CURRENT_TIMESTAMP
                        WHERE id = %s
                    ''', (build_id, build_id))
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'message': 'Товар удалён из сборки'})
                }
            
            else:
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