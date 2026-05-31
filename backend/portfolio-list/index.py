import os
import json
import psycopg2

def handler(event: dict, context) -> dict:
    """Получение списка фото портфолио из БД."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400'}, 'body': ''}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute("SELECT id, title, image_url, tag, area, duration FROM portfolio_photos ORDER BY sort_order ASC, created_at DESC")
    rows = cur.fetchall()
    cur.close()
    conn.close()

    photos = [
        {'id': r[0], 'title': r[1], 'image_url': r[2], 'tag': r[3], 'area': r[4], 'duration': r[5]}
        for r in rows
    ]

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'photos': photos})
    }
