'''
Business: API для получения категорий товаров
Args: event - dict с httpMethod
      context - object с request_id
Returns: HTTP response с списком категорий
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
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method == 'GET':
        conn = get_db_connection()
        cur = conn.cursor()
        
        try:
            cur.execute('SELECT id, name, slug, icon FROM categories ORDER BY id')
            categories = []
            for row in cur.fetchall():
                categories.append({
                    'id': row[0],
                    'name': row[1],
                    'slug': row[2],
                    'icon': row[3]
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'categories': categories})
            }
        finally:
            cur.close()
            conn.close()
    
    return {'statusCode': 405, 'body': json.dumps({'error': 'Method not allowed'})}
