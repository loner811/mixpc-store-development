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
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Auth, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    headers = event.get('headers', {})
    auth_token = headers.get('x-admin-auth') or headers.get('X-Admin-Auth')
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            user_id = headers.get('x-user-id') or headers.get('X-User-Id')
            
            if auth_token == 'admin:123':
                cur.execute('''
                    SELECT cm.id, cm.full_name, cm.phone, cm.email, cm.message, cm.is_read, cm.created_at, cm.user_id,
                           mr.id as reply_id, mr.reply_text, mr.admin_name, mr.created_at as reply_created_at
                    FROM t_p58610579_mixpc_store_developm.contact_messages cm
                    LEFT JOIN t_p58610579_mixpc_store_developm.message_replies mr ON cm.id = mr.message_id
                    ORDER BY cm.created_at DESC, mr.created_at ASC
                ''')
                
                messages_dict = {}
                for row in cur.fetchall():
                    msg_id = row[0]
                    
                    if msg_id not in messages_dict:
                        messages_dict[msg_id] = {
                            'id': msg_id,
                            'name': row[1],
                            'phone': row[2],
                            'email': row[3],
                            'message': row[4],
                            'is_read': row[5],
                            'created_at': row[6].isoformat() if row[6] else None,
                            'user_id': row[7],
                            'replies': []
                        }
                    
                    if row[8]:
                        messages_dict[msg_id]['replies'].append({
                            'id': row[8],
                            'reply_text': row[9],
                            'admin_name': row[10],
                            'created_at': row[11].isoformat() if row[11] else None
                        })
                
                messages = list(messages_dict.values())
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps(messages)
                }
            
            elif user_id:
                cur.execute('''
                    SELECT cm.id, cm.full_name, cm.phone, cm.email, cm.message, cm.is_read, cm.created_at,
                           mr.id as reply_id, mr.reply_text, mr.admin_name, mr.created_at as reply_created_at
                    FROM t_p58610579_mixpc_store_developm.contact_messages cm
                    LEFT JOIN t_p58610579_mixpc_store_developm.message_replies mr ON cm.id = mr.message_id
                    WHERE cm.user_id = %s
                    ORDER BY cm.created_at DESC, mr.created_at ASC
                ''', (user_id,))
                
                messages_dict = {}
                for row in cur.fetchall():
                    msg_id = row[0]
                    
                    if msg_id not in messages_dict:
                        messages_dict[msg_id] = {
                            'id': msg_id,
                            'name': row[1],
                            'phone': row[2],
                            'email': row[3],
                            'message': row[4],
                            'is_read': row[5],
                            'created_at': row[6].isoformat() if row[6] else None,
                            'replies': []
                        }
                    
                    if row[7]:
                        messages_dict[msg_id]['replies'].append({
                            'id': row[7],
                            'reply_text': row[8],
                            'admin_name': row[9],
                            'created_at': row[10].isoformat() if row[10] else None
                        })
                
                messages = list(messages_dict.values())
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps(messages)
                }
            
            else:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Unauthorized'})
                }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            user_id_str = headers.get('x-user-id') or headers.get('X-User-Id')
            user_id = int(user_id_str) if user_id_str else None
            
            cur.execute('''
                INSERT INTO t_p58610579_mixpc_store_developm.contact_messages (full_name, phone, email, message, user_id)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id
            ''', (
                body['fullName'],
                body['phone'],
                body['email'],
                body['message'],
                user_id
            ))
            
            message_id = cur.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'id': message_id, 'message': 'Message sent'})
            }
        
        elif method == 'PUT':
            if auth_token != 'admin:123':
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Unauthorized'})
                }
            
            body = json.loads(event.get('body', '{}'))
            message_id = body.get('message_id')
            reply_text = body.get('reply_text')
            admin_name = body.get('admin_name', 'Администратор')
            
            if not message_id or not reply_text:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'message_id and reply_text required'})
                }
            
            cur.execute('''
                INSERT INTO t_p58610579_mixpc_store_developm.message_replies (message_id, reply_text, admin_name)
                VALUES (%s, %s, %s)
                RETURNING id
            ''', (message_id, reply_text, admin_name))
            
            reply_id = cur.fetchone()[0]
            
            cur.execute('''
                UPDATE t_p58610579_mixpc_store_developm.contact_messages
                SET is_read = true
                WHERE id = %s
            ''', (message_id,))
            
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'id': reply_id, 'message': 'Reply sent'})
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