import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Manage customer orders (create, view, update status)
    Args: event - dict with httpMethod, body, headers
          context - object with request_id attribute
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Admin-Auth',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'GET':
            is_admin = event.get('headers', {}).get('X-Admin-Auth') == 'admin:123'
            
            if is_admin:
                cursor.execute('''
                    SELECT o.*, 
                           json_agg(json_build_object(
                               'product_name', oi.product_name,
                               'product_price', oi.product_price,
                               'quantity', oi.quantity
                           )) as items
                    FROM t_p58610579_mixpc_store_developm.orders o
                    LEFT JOIN t_p58610579_mixpc_store_developm.order_items oi ON o.id = oi.order_id
                    GROUP BY o.id
                    ORDER BY o.created_at DESC
                ''')
            else:
                user_id = event.get('headers', {}).get('X-User-Id')
                if not user_id:
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'User not authenticated'})
                    }
                
                cursor.execute('''
                    SELECT o.*, 
                           json_agg(json_build_object(
                               'product_name', oi.product_name,
                               'product_price', oi.product_price,
                               'quantity', oi.quantity
                           )) as items
                    FROM t_p58610579_mixpc_store_developm.orders o
                    LEFT JOIN t_p58610579_mixpc_store_developm.order_items oi ON o.id = oi.order_id
                    WHERE o.user_id = %s
                    GROUP BY o.id
                    ORDER BY o.created_at DESC
                ''', (user_id,))
            
            orders = cursor.fetchall()
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps([dict(order) for order in orders], default=str)
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            user_id = body_data.get('user_id')
            full_name = body_data.get('full_name')
            email = body_data.get('email')
            phone = body_data.get('phone')
            delivery_type = body_data.get('delivery_type')
            delivery_address = body_data.get('delivery_address', '')
            total_amount = body_data.get('total_amount')
            items = body_data.get('items', [])
            
            cursor.execute('''
                INSERT INTO t_p58610579_mixpc_store_developm.orders 
                (user_id, full_name, email, phone, delivery_type, delivery_address, total_amount)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            ''', (user_id, full_name, email, phone, delivery_type, delivery_address, total_amount))
            
            order_id = cursor.fetchone()['id']
            
            for item in items:
                cursor.execute('''
                    INSERT INTO t_p58610579_mixpc_store_developm.order_items
                    (order_id, product_id, product_name, product_price, quantity)
                    VALUES (%s, %s, %s, %s, %s)
                ''', (order_id, item.get('id'), item.get('name'), item.get('price'), 1))
            
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'order_id': order_id, 'message': 'Order created successfully'})
            }
        
        elif method == 'PUT':
            if event.get('headers', {}).get('X-Admin-Auth') != 'admin:123':
                return {
                    'statusCode': 403,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Admin access required'})
                }
            
            body_data = json.loads(event.get('body', '{}'))
            order_id = body_data.get('id')
            status = body_data.get('status')
            
            cursor.execute('''
                UPDATE t_p58610579_mixpc_store_developm.orders
                SET status = %s
                WHERE id = %s
            ''', (status, order_id))
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Order status updated'})
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    finally:
        cursor.close()
        conn.close()
