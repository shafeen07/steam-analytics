from fastapi import APIRouter
from db import get_conn

router = APIRouter()

@router.get("/")
def get_genres():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("""
        SELECT *
        FROM transform_marts.mart_genre_summary
        ORDER BY total_current_players DESC
    """)
    rows = cur.fetchall()
    conn.close()
    return list(rows)