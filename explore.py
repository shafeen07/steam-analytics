import requests
import json
from dotenv import load_dotenv
import os

load_dotenv()
STEAM_KEY = os.getenv("STEAM_API_KEY")

def get_top_games():
    """Get current most played games on Steam"""
    url = "https://api.steampowered.com/ISteamChartsService/GetMostPlayedGames/v1/"
    response = requests.get(url)
    data = response.json()
    return data['response']['ranks']

def get_game_details(appid):
    url = f"https://store.steampowered.com/api/appdetails?appids={appid}&l=english&cc=us"
    response = requests.get(url)
    data = response.json()
    if data[str(appid)]['success']:
        return data[str(appid)]['data']
    return None

def get_player_count(appid):
    """Get current player count for a game"""
    url = f"https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid={appid}"
    response = requests.get(url)
    data = response.json()
    return data['response']['player_count']

# Test it
print("Fetching top games...")
top_games = get_top_games()
print(f"Got {len(top_games)} games")
print("\nTop 5 games right now:")
print("\nFirst game raw data:")
print("\nTop 10 games right now:")
for game in top_games[:10]:
    print(f"  Rank: {game['rank']}  AppID: {game['appid']}  Peak today: {game['peak_in_game']}  Last week rank: {game['last_week_rank']}")

print(f"\nTotal games returned: {len(top_games)}")
print("\nSample of raw data:")
print(json.dumps(top_games[:3], indent=2))

# Test game details on #1 game
top_appid = top_games[0]['appid']
print(f"\nFetching details for appid {top_appid}...")
details = get_game_details(top_appid)
if details:
    print(f"Name: {details.get('name')}")
    print(f"Genre: {[g['description'] for g in details.get('genres', [])]}")
    print(f"Price: {details.get('price_overview', {}).get('final_formatted', 'Free')}")
    print(f"Reviews: {details.get('metacritic', {}).get('score', 'N/A')}")

print(f"\nCurrent players for appid {top_appid}: {get_player_count(top_appid)}")