'use client';

import { useRouter } from 'next/navigation';

interface Game {
  app_id: number;
  name: string;
  developer: string;
  current_players: number;
  positive_pct: number;
  review_sentiment: string;
  is_free: boolean;
  price_usd: number;
  header_image: string;
}

const sentimentColor: Record<string, string> = {
  'Overwhelmingly Positive': '#34d399',
  'Very Positive': '#4ade80',
  'Mostly Positive': '#a3e635',
  'Mixed': '#facc15',
  'Mostly Negative': '#f87171',
  'Insufficient Reviews': '#6b7280',
};

export default function TopGamesTable({ games }: { games: Game[] }) {
  const router = useRouter();

  return (
    <div style={{background:'#111827', borderRadius:'12px', border:'1px solid #1f2937', overflow:'hidden'}}>
      <div style={{padding:'16px 20px', borderBottom:'1px solid #1f2937'}}>
        <h2 style={{color:'#fff', fontSize:'16px', fontWeight:600, margin:0}}>
          Top games by concurrent players
        </h2>
      </div>
      <div style={{overflowX:'auto'}}>
        <table style={{width:'100%', borderCollapse:'collapse', fontSize:'13px'}}>
          <thead>
            <tr style={{borderBottom:'1px solid #1f2937'}}>
              {['#','Game','Players','Price','Review'].map((h, i) => (
                <th key={h} style={{
                  padding:'10px 16px',
                  color:'#6b7280',
                  fontSize:'11px',
                  textTransform:'uppercase',
                  letterSpacing:'0.05em',
                  fontWeight:500,
                  textAlign: i >= 2 ? 'right' : 'left'
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {games.map((game, i) => (
              <tr
                key={game.app_id}
                onClick={() => router.push(`/game/${game.app_id}`)}
                style={{borderBottom:'1px solid #1f293780', cursor:'pointer'}}
                onMouseEnter={e => (e.currentTarget.style.background = '#1f2937')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <td style={{padding:'10px 16px', color:'#4b5563', width:'40px'}}>{i+1}</td>
                <td style={{padding:'10px 16px'}}>
                  <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
                    <img
                      src={game.header_image}
                      alt={game.name}
                      style={{width:'64px', height:'36px', objectFit:'cover', borderRadius:'4px', flexShrink:0}}
                    />
                    <div style={{minWidth:0}}>
                      <p style={{color:'#f9fafb', fontWeight:500, margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:'220px'}}>
                        {game.name}
                      </p>
                      <p style={{color:'#6b7280', fontSize:'11px', margin:'2px 0 0', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:'220px'}}>
                        {game.developer}
                      </p>
                    </div>
                  </div>
                </td>
                <td style={{padding:'10px 16px', textAlign:'right', color:'#f9fafb', fontFamily:'monospace'}}>
                  {game.current_players.toLocaleString()}
                </td>
                <td style={{padding:'10px 16px', textAlign:'right'}}>
                  {game.is_free
                    ? <span style={{color:'#34d399', fontSize:'12px', fontWeight:500}}>Free</span>
                    : <span style={{color:'#d1d5db'}}>${game.price_usd}</span>
                  }
                </td>
                <td style={{padding:'10px 16px', textAlign:'right'}}>
                  <span style={{color: sentimentColor[game.review_sentiment] || '#6b7280', fontSize:'12px', fontWeight:500}}>
                    {game.positive_pct ? `${game.positive_pct}%` : '—'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}