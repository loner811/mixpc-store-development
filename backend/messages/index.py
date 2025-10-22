'''
Business: API для работы с сообщениями от пользователей
Args: event - dict с httpMethod, body
      context - object с request_id
Returns: HTTP response
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
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            cur.execute('''
                SELECT id, full_name, phone, email, message, is_read, created_at 
                FROM contact_messages 
                ORDER BY created_at DESC
            ''')
            
            messages = []
            for row in cur.fetchall():
                messages.append({
                    'id': row[0],
                    'fullName': row[1],
                    'phone': row[2],
                    'email': row[3],
                    'message': row[4],
                    'isRead': row[5],
                    'createdAt': row[6].isoformat() if row[6] else None
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'messages': messages})
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            
            cur.execute('''
                INSERT INTO contact_messages (full_name, phone, email, message)
                VALUES (%s, %s, %s, %s)
                RETURNING id
            ''', (
                body['fullName'],
                body['phone'],
                body['email'],
                body['message']
            ))
            
            message_id = cur.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'id': message_id, 'message': 'Message sent'})
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
