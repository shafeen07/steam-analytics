from fastapi import APIRouter, Query
from db import get_conn

router = APIRouter()

@router.get("/{app_id}/history")
def get_player_history(app_id: int, days: int = Query(30, le=90)):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("""
        SELECT 
            app_id,
            game_name,
            current_players,
            captured_at,
            snapshot_date
        FROM transform_marts.fct_player_history
        WHERE app_id = %s
        AND captured_at >= now() - interval '%s days'
        ORDER BY captured_at ASC
    """, (app_id, days))
    rows = cur.fetchall()
    conn.close()
    return list(rows)