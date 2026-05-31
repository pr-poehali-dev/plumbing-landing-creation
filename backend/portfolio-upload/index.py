import os
import json
import uuid
import base64
import hashlib
import boto3
import psycopg2

def get_token():
    admin_password = os.environ.get('ADMIN_PASSWORD', '')
    return hashlib.sha256(f"{admin_password}:aquamaster-admin".encode()).hexdigest()

def check_auth(headers: dict) -> bool:
    auth = headers.get('X-Authorization') or headers.get('x-authorization') or headers.get('Authorization') or ''
    token = auth.replace('Bearer ', '').strip()
    return token == get_token()

def handler(event: dict, context) -> dict:
    """Загрузка фото портфолио в S3 и сохранение в БД."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, DELETE, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization', 'Access-Control-Max-Age': '86400'}, 'body': ''}

    headers = event.get('headers') or {}
    if not check_auth(headers):
        return {'statusCode': 401, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Unauthorized'})}

    method = event.get('httpMethod')

    if method == 'POST':
        body = json.loads(event.get('body') or '{}')
        image_b64 = body.get('image')
        title = body.get('title', 'Без названия')
        tag = body.get('tag', '')
        area = body.get('area', '')
        duration = body.get('duration', '')

        if not image_b64:
            return {'statusCode': 400, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'No image provided'})}

        if ',' in image_b64:
            image_b64 = image_b64.split(',', 1)[1]

        image_data = base64.b64decode(image_b64)
        file_key = f"portfolio/{uuid.uuid4().hex}.jpg"

        s3 = boto3.client(
            's3',
            endpoint_url='https://bucket.poehali.dev',
            aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
            aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
        )
        s3.put_object(Bucket='files', Key=file_key, Body=image_data, ContentType='image/jpeg')
        image_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{file_key}"

        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO portfolio_photos (title, image_url, tag, area, duration) VALUES (%s, %s, %s, %s, %s) RETURNING id",
            (title, image_url, tag, area, duration)
        )
        photo_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()

        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True, 'id': photo_id, 'image_url': image_url})
        }

    if method == 'DELETE':
        body = json.loads(event.get('body') or '{}')
        photo_id = body.get('id')
        if not photo_id:
            return {'statusCode': 400, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'No id provided'})}

        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        cur.execute("DELETE FROM portfolio_photos WHERE id = %s", (photo_id,))
        conn.commit()
        cur.close()
        conn.close()

        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'success': True})}

    return {'statusCode': 405, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Method not allowed'})}
