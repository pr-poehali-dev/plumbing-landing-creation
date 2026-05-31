import os
import json
import hashlib

def handler(event: dict, context) -> dict:
    """Проверка пароля для входа в админку."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400'}, 'body': ''}

    if event.get('httpMethod') != 'POST':
        return {'statusCode': 405, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Method not allowed'})}

    body = json.loads(event.get('body') or '{}')
    password = body.get('password', '')

    admin_password = os.environ.get('ADMIN_PASSWORD', '')

    if not admin_password:
        return {'statusCode': 500, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Admin password not configured'})}

    if password == admin_password:
        token = hashlib.sha256(f"{admin_password}:aquamaster-admin".encode()).hexdigest()
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True, 'token': token})
        }

    return {
        'statusCode': 401,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': False, 'error': 'Неверный пароль'})
    }
