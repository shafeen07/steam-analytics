import dlt
import requests
import time
import os
from dotenv import load_dotenv
from datetime import datetime, timezone

load_dotenv()

STEAM_API_KEY = os.getenv("STEAM_API_KEY")

def get_tracked_app_ids(conn_string):
    import psycopg2
    conn = psycopg2.connect(conn_string)
    cur = conn.cursor()
    cur.execute("""
        SELECT DISTINCT app_id 
        FROM raw.steamspy_snapshots 
        WHERE ccu > 100
        ORDER BY app_id
    """)
    ids = [row[0] for row in cur.fetchall()]
    conn.close()
    return ids

@dlt.resource(name="player_snapshots", write_disposition="append")
def steam_player_counts(app_ids):
    captured_at = datetime.now(timezone.utc).isoformat()
    
    for i, app_id in enumerate(app_ids):
        url = f"https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid={app_id}&key={STEAM_API_KEY}"
        try:
            response = requests.get(url, timeout=10)
            data = response.json()
            
            if data.get("response", {}).get("result") == 1:
                yield {
                    "app_id": app_id,
                    "current_players": data["response"]["player_count"],
                    "captured_at": captured_at
                }
                
        except Exception as e:
            print(f"Error fetching players for app_id {app_id}: {e}")
            continue
        
        if i % 100 == 0:
            print(f"Fetched player counts {i}/{len(app_ids)}")
        
        time.sleep(0.5)

@dlt.source
def player_counts_source(app_ids):
    return steam_player_counts(app_ids)

if __name__ == "__main__":
    database_url = os.getenv("DATABASE_URL")
    
    print("Fetching tracked app IDs...")
    app_ids = get_tracked_app_ids(database_url)
    print(f"Tracking {len(app_ids)} games")
    
    pipeline = dlt.pipeline(
        pipeline_name="player_counts",
        destination=dlt.destinations.postgres(credentials=database_url),
        dataset_name="raw"
    )
    
    load_info = pipeline.run(player_counts_source(app_ids))
    print(load_info)