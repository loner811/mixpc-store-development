import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Business: Admin API for managing products (CRUD operations)
    Args: event - dict with httpMethod, body, queryStringParameters, pathParams
          context - object with request_id attribute
    Returns: HTTP response dict with product data
    """
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Auth',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    headers = event.get('headers', {})
    auth_token = headers.get('x-admin-auth') or headers.get('X-Admin-Auth')
    
    if auth_token != 'admin:123':
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Unauthorized'})
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    
    try:
        if method == 'GET':
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("""
                    SELECT p.id, p.name, p.price, p.brand, c.name as category, 
                           p.image_filename, p.description, p.created_at
                    FROM products p
                    LEFT JOIN categories c ON p.category_id = c.id
                    ORDER BY p.created_at DESC
                """)
                products = cur.fetchall()
                
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps([dict(p) for p in products], default=str)
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            name = body_data.get('name')
            price = body_data.get('price')
            brand = body_data.get('brand')
            category_name = body_data.get('category')
            image_url = body_data.get('image_url', '')
            description = body_data.get('description', '')
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("SELECT id FROM categories WHERE name = %s", (category_name,))
                category = cur.fetchone()
                category_id = category['id'] if category else None
                
                cur.execute("""
                    INSERT INTO products (name, price, brand, category_id, image_filename, description)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    RETURNING id, name, price, brand, image_filename, description
                """, (name, price, brand, category_id, image_url, description))
                
                new_product = cur.fetchone()
                conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(new_product), default=str)
            }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            product_id = body_data.get('id')
            name = body_data.get('name')
            price = body_data.get('price')
            brand = body_data.get('brand')
            category_name = body_data.get('category')
            image_url = body_data.get('image_url')
            description = body_data.get('description')
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("SELECT id FROM categories WHERE name = %s", (category_name,))
                category = cur.fetchone()
                category_id = category['id'] if category else None
                
                cur.execute("""
                    UPDATE products 
                    SET name = %s, price = %s, brand = %s, category_id = %s, 
                        image_filename = %s, description = %s, updated_at = CURRENT_TIMESTAMP
                    WHERE id = %s
                    RETURNING id, name, price, brand, image_filename, description
                """, (name, price, brand, category_id, image_url, description, product_id))
                
                updated_product = cur.fetchone()
                conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(updated_product) if updated_product else {}, default=str)
            }
        
        elif method == 'DELETE':
            params = event.get('queryStringParameters', {})
            product_id = params.get('id')
            
            with conn.cursor() as cur:
                cur.execute("DELETE FROM products WHERE id = %s", (product_id,))
                conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True})
            }
    
    finally:
        conn.close()
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }
