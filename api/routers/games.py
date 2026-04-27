from fastapi import APIRouter, Query
from db import get_conn

router = APIRouter()

@router.get("/top")
def get_top_games(limit: int = Query(50, le=200)):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("""
        SELECT 
            app_id, name, developer, is_free, price_usd,
            current_players, positive_pct, review_sentiment,
            owners, avg_playtime_hrs, header_image, metacritic_score
        FROM transform_marts.mart_top_games
        ORDER BY current_players DESC
        LIMIT %s
    """, (limit,))
    rows = cur.fetchall()
    conn.close()
    return list(rows)

@router.get("/search")
def search_games(
    q: str = Query(None),
    genre: str = Query(None),
    min_positive_pct: float = Query(None),
    max_price: float = Query(None),
    is_free: bool = Query(None),
    limit: int = Query(50, le=200)
):
    conn = get_conn()
    cur = conn.cursor()
    
    filters = ["current_players > 0"]
    params = []
    
    if q:
        filters.append("name ILIKE %s")
        params.append(f"%{q}%")
    if min_positive_pct:
        filters.append("positive_pct >= %s")
        params.append(min_positive_pct)
    if max_price is not None:
        filters.append("(is_free = true OR price_usd <= %s)")
        params.append(max_price)
    if is_free is not None:
        filters.append("is_free = %s")
        params.append(is_free)
    
    where = " AND ".join(filters)
    params.append(limit)
    
    cur.execute(f"""
        SELECT 
            app_id, name, developer, is_free, price_usd,
            current_players, positive_pct, review_sentiment,
            owners, avg_playtime_hrs, header_image, metacritic_score
        FROM transform_marts.dim_games
        WHERE {where}
        ORDER BY current_players DESC
        LIMIT %s
    """, params)
    
    rows = cur.fetchall()
    conn.close()
    return list(rows)

@router.get("/{app_id}")
def get_game(app_id: int):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("""
        SELECT * FROM transform_marts.dim_games
        WHERE app_id = %s
    """, (app_id,))
    row = cur.fetchone()
    conn.close()
    if not row:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Game not found")
    return dict(row)