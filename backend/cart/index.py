'''
Business: API для управления корзиной пользователя
Args: event - dict с httpMethod, body, headers
      context - object с request_id
Returns: HTTP response с данными корзины
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
                'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    headers = event.get('headers', {})
    user_id = headers.get('X-User-Id') or headers.get('x-user-id')
    
    if not user_id:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'User not authenticated'})
        }
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            cur.execute('''
                SELECT c.product_id, c.quantity, 
                       p.name, p.price, p.brand, p.image_filename, p.description, cat.name as category
                FROM t_p58610579_mixpc_store_developm.cart_items c
                JOIN t_p58610579_mixpc_store_developm.products p ON c.product_id = p.id
                LEFT JOIN t_p58610579_mixpc_store_developm.categories cat ON p.category_id = cat.id
                WHERE c.user_id = %s
            ''', (user_id,))
            
            cart_items = []
            for row in cur.fetchall():
                cart_items.append({
                    'product': {
                        'id': row[0],
                        'name': row[2],
                        'price': float(row[3]),
                        'brand': row[4],
                        'image_url': row[5],
                        'description': row[6],
                        'category': row[7]
                    },
                    'quantity': row[1]
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps(cart_items)
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            cart_items = body.get('items', [])
            
            # Очищаем старую корзину
            cur.execute('DELETE FROM t_p58610579_mixpc_store_developm.cart_items WHERE user_id = %s', (user_id,))
            
            # Добавляем новые товары
            for item in cart_items:
                product_id = item.get('product', {}).get('id')
                quantity = item.get('quantity', 1)
                
                if product_id and quantity > 0:
                    cur.execute('''
                        INSERT INTO t_p58610579_mixpc_store_developm.cart_items (user_id, product_id, quantity)
                        VALUES (%s, %s, %s)
                    ''', (user_id, product_id, quantity))
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'message': 'Cart saved successfully'})
            }
        
        elif method == 'DELETE':
            cur.execute('DELETE FROM t_p58610579_mixpc_store_developm.cart_items WHERE user_id = %s', (user_id,))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'message': 'Cart cleared successfully'})
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Method not allowed'})
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