import dlt
import requests
from datetime import datetime, timezone
@dlt.resource(name="steamspy_snapshots", write_disposition="append")
def steamspy_top100():
    import time
    snapped_at = datetime.now(timezone.utc).isoformat()
    
    for request in ["top100in2weeks", "top100forever", "top100owned"]:
        url = f"https://steamspy.com/api.php?request={request}"
        response = requests.get(url, timeout=30)
        
        try:
            data = response.json()
        except Exception:
            continue
            
        for app_id, game in data.items():
            yield {
                "app_id": int(app_id),
                "name": game.get("name"),
                "developer": game.get("developer"),
                "publisher": game.get("publisher"),
                "positive_reviews": game.get("positive", 0),
                "negative_reviews": game.get("negative", 0),
                "owners": game.get("owners"),
                "avg_playtime_hrs": round(game.get("average_forever", 0) / 60, 2),
                "median_playtime_hrs": round(game.get("median_forever", 0) / 60, 2),
                "price_usd": game.get("price"),
                "discount_pct": game.get("discount", 0),
                "ccu": game.get("ccu", 0),
                "snapped_at": snapped_at
            }
        
        time.sleep(2)

@dlt.source
def steamspy_source():
    return steamspy_top100()

if __name__ == "__main__":
    import os
    from dotenv import load_dotenv
    load_dotenv(dotenv_path="../../.env")

    pipeline = dlt.pipeline(
        pipeline_name="steamspy",
        destination=dlt.destinations.postgres(
            credentials=os.getenv("DATABASE_URL")
        ),
        dataset_name="raw"
    )

    load_info = pipeline.run(steamspy_source())
    print(load_info)