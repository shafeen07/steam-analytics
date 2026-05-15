interface Game {
  app_id: number;
  name: string;
  current_players: number;
  is_free: boolean;
  price_usd: number;
  positive_pct: number;
  review_sentiment: string;
}

export default function PulseStats({ games }: { games: Game[] }) {
  const totalPlayers = games.reduce((sum, g) => sum + g.current_players, 0);
  const topGame = games[0];
  const validGames = games.filter(g => g.positive_pct);
  const avgPositive = Math.round(
    validGames.reduce((sum, g) => sum + g.positive_pct, 0) / validGames.length
  );
  const freeCount = games.filter(g => g.is_free).length;
  const paidCount = games.length - freeCount;

  const kpis = [
    {
      label: 'Total concurrent players',
      value: totalPlayers.toLocaleString(),
      sub: 'across top 50 games',
      accent: '#3b82f6'
    },
    {
      label: 'Most played right now',
      value: topGame?.name,
      sub: `${topGame?.current_players.toLocaleString()} players`,
      accent: '#8b5cf6'
    },
    {
      label: 'Avg review score',
      value: `${avgPositive}%`,
      sub: 'positive across top 50',
      accent: avgPositive >= 80 ? '#22c55e' : avgPositive >= 60 ? '#eab308' : '#ef4444'
    },
    {
      label: 'Free vs paid',
      value: `${freeCount} / ${paidCount}`,
      sub: 'free-to-play vs paid',
      accent: '#f97316'
    }
  ];

  return (
    <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px'}}>
      {kpis.map((kpi, i) => (
        <div key={i} style={{
          background:'#111827',
          borderRadius:'12px',
          padding:'20px',
          borderLeft:`3px solid ${kpi.accent}`,
          border:`1px solid #1f2937`,
          borderLeftColor: kpi.accent,
          borderLeftWidth: '3px'
        }}>
          <p style={{color:'#6b7280', fontSize:'11px', textTransform:'uppercase', letterSpacing:'0.05em', margin:0}}>
            {kpi.label}
          </p>
          <p style={{color:'#fff', fontSize:'22px', fontWeight:700, margin:'8px 0 4px', lineHeight:1.2}}>
            {kpi.value}
          </p>
          <p style={{color:'#9ca3af', fontSize:'11px', margin:0}}>
            {kpi.sub}
          </p>
        </div>
      ))}
    </div>
  );
}