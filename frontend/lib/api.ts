const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function getTopGames(limit = 50) {
  const res = await fetch(`${API_URL}/api/games/top?limit=${limit}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch top games');
  return res.json();
}

export async function searchGames(params: {
  q?: string;
  genre?: string;
  min_positive_pct?: number;
  max_price?: number;
  is_free?: boolean;
  limit?: number;
}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, String(value));
    }
  });
  const res = await fetch(`${API_URL}/api/games/search?${query}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to search games');
  return res.json();
}

export async function getGame(appId: number) {
  const res = await fetch(`${API_URL}/api/games/${appId}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export async function getPlayerHistory(appId: number, days = 30) {
  const res = await fetch(`${API_URL}/api/players/${appId}/history?days=${days}`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export async function getGenres() {
  const res = await fetch(`${API_URL}/api/genres/`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch genres');
  return res.json();
}

export async function getLastUpdated() {
  const res = await fetch(`${API_URL}/api/players/last-updated`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}


