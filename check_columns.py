import os, psycopg2
from dotenv import load_dotenv
load_dotenv()
conn = psycopg2.connect(os.getenv('DATABASE_URL'))
cur = conn.cursor()

cur.execute("""
    SELECT g.app_id, g._dlt_id, genre.value
    FROM raw.game_details g
    JOIN raw.game_details__genres genre ON genre._dlt_parent_id = g._dlt_id
    LIMIT 10
""")
print("=== joined sample ===")
for row in cur.fetchall():
    print(row)

conn.close()