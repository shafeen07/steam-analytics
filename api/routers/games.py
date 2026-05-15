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
        SELECT d.*,
            array_agg(DISTINCT g.value) FILTER (WHERE g.value IS NOT NULL) as genres,
            array_agg(DISTINCT c.value) FILTER (WHERE c.value IS NOT NULL) as categories
        FROM transform_marts.dim_games d
        LEFT JOIN raw.game_details gd ON d.app_id = gd.app_id
        LEFT JOIN raw.game_details__genres g ON g._dlt_parent_id = gd._dlt_id
        LEFT JOIN raw.game_details__categories c ON c._dlt_parent_id = gd._dlt_id
        WHERE d.app_id = %s
        GROUP BY d.app_id, d.name, d.developer, d.publisher, d.is_free,
                 d.price_usd, d.release_date, d.coming_soon, d.header_image,
                 d.short_description, d.metacritic_score, d.recommendations,
                 d.owners, d.positive_reviews, d.negative_reviews,
                 d.avg_playtime_hrs, d.median_playtime_hrs, d.current_players,
                 d.positive_pct, d.review_sentiment, d.fetched_at
    """, (app_id,))
    
    row = cur.fetchone()
    conn.close()
    if not row:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Game not found")
    return dict(row)