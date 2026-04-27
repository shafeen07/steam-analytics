from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import games, players, genres

app = FastAPI(title="Steam Analytics API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(games.router, prefix="/api/games", tags=["games"])
app.include_router(players.router, prefix="/api/players", tags=["players"])
app.include_router(genres.router, prefix="/api/genres", tags=["genres"])

@app.get("/")
def root():
    return {"status": "ok"}