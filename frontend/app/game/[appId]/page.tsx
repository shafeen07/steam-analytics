import { getGame, getPlayerHistory } from '@/lib/api';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import PlayerHistoryChart from '@/components/PlayerHistoryChart';

export default async function GamePage({ params }: { params: Promise<{ appId: string }> }) {
  const { appId: appIdStr } = await params;
  const appId = parseInt(appIdStr);
  const [game, playerHistory] = await Promise.all([
    getGame(appId),
    getPlayerHistory(appId, 30)
  ]);

  if (!game) return notFound();

  const sentimentColor: Record<string, string> = {
    'Overwhelmingly Positive': '#34d399',
    'Very Positive': '#4ade80',
    'Mostly Positive': '#a3e635',
    'Mixed': '#facc15',
    'Mostly Negative': '#f87171',
    'Insufficient Reviews': '#6b7280',
  };

  return (
    <main style={{minHeight:'100vh', background:'#030712', color:'#f9fafb'}}>
      
      {/* Hero */}
      <div style={{
        position:'relative',
        height:'280px',
        overflow:'hidden',
        background:'#0a0f1e'
      }}>
        <img
          src={game.header_image}
          alt={game.name}
          style={{
            width:'100%',
            height:'100%',
            objectFit:'cover',
            opacity:0.3,
            filter:'blur(8px)',
            transform:'scale(1.1)'
          }}
        />
        <div style={{
          position:'absolute',
          inset:0,
          background:'linear-gradient(to bottom, rgba(3,7,18,0.3), rgba(3,7,18,0.95))'
        }}/>
        <div style={{
          position:'absolute',
          bottom:0,
          left:0,
          right:0,
          padding:'0 48px 32px',
          maxWidth:'1280px',
          margin:'0 auto'
        }}>
          <Link href="/" style={{
            color:'#6b7280',
            fontSize:'13px',
            textDecoration:'none',
            display:'inline-flex',
            alignItems:'center',
            gap:'6px',
            marginBottom:'16px'
          }}>
            ← Back to dashboard
          </Link>
          <div style={{display:'flex', alignItems:'flex-end', gap:'24px'}}>
            <img
              src={game.header_image}
              alt={game.name}
              style={{width:'184px', height:'69px', objectFit:'cover', borderRadius:'8px', border:'1px solid #1e3a5f', flexShrink:0}}
            />
            <div>
              <h1 style={{fontSize:'32px', fontWeight:800, color:'#fff', margin:'0 0 6px', letterSpacing:'-0.02em'}}>
                {game.name}
              </h1>
              <p style={{color:'#94a3b8', fontSize:'14px', margin:0}}>
                {game.developer} {game.publisher && game.publisher !== game.developer ? `· Published by ${game.publisher}` : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{maxWidth:'1280px', margin:'0 auto', padding:'32px 48px'}}>
        
        {/* KPI row */}
        <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'32px'}}>
          {[
            {
              label: 'Current players',
              value: game.current_players?.toLocaleString() ?? '—',
              sub: 'concurrent right now',
              accent: '#3b82f6'
            },
            {
              label: 'Review score',
              value: game.positive_pct ? `${game.positive_pct}%` : '—',
              sub: game.review_sentiment ?? '',
              accent: sentimentColor[game.review_sentiment] ?? '#6b7280'
            },
            {
              label: 'Owners estimate',
              value: game.owners ?? '—',
              sub: 'total installs range',
              accent: '#8b5cf6'
            },
            {
              label: 'Price',
              value: game.is_free ? 'Free to Play' : `$${game.price_usd}`,
              sub: game.metacritic_score ? `Metacritic: ${game.metacritic_score}` : 'No Metacritic score',
              accent: game.is_free ? '#34d399' : '#f97316'
            }
          ].map((kpi, i) => (
            <div key={i} style={{
              background:'#111827',
              borderRadius:'12px',
              padding:'20px',
              border:'1px solid #1f2937',
              borderLeftColor: kpi.accent,
              borderLeftWidth: '3px'
            }}>
              <p style={{color:'#6b7280', fontSize:'11px', textTransform:'uppercase', letterSpacing:'0.05em', margin:0}}>
                {kpi.label}
              </p>
              <p style={{color:'#fff', fontSize:'20px', fontWeight:700, margin:'8px 0 4px', lineHeight:1.2}}>
                {kpi.value}
              </p>
              <p style={{color:'#9ca3af', fontSize:'11px', margin:0}}>
                {kpi.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Player history chart */}
        <div style={{marginBottom:'24px'}}>
          <PlayerHistoryChart data={playerHistory} gameName={game.name} />
        </div>

        {/* Details row */}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px'}}>
          
          {/* About */}
          <div style={{background:'#111827', borderRadius:'12px', border:'1px solid #1f2937', padding:'24px'}}>
            <h2 style={{color:'#fff', fontSize:'16px', fontWeight:600, margin:'0 0 16px'}}>About</h2>
            <p style={{color:'#94a3b8', fontSize:'14px', lineHeight:1.7, margin:'0 0 20px'}}>
              {game.short_description ?? 'No description available.'}
            </p>
            {game.release_date && (
              <p style={{color:'#6b7280', fontSize:'12px', margin:0}}>
                Released: <span style={{color:'#9ca3af'}}>{game.release_date}</span>
              </p>
            )}
          </div>

          {/* Genres and categories */}
          <div style={{background:'#111827', borderRadius:'12px', border:'1px solid #1f2937', padding:'24px'}}>
            <h2 style={{color:'#fff', fontSize:'16px', fontWeight:600, margin:'0 0 16px'}}>Details</h2>
            
            {game.genres?.length > 0 && (
              <div style={{marginBottom:'16px'}}>
                <p style={{color:'#6b7280', fontSize:'11px', textTransform:'uppercase', letterSpacing:'0.05em', margin:'0 0 8px'}}>
                  Genres
                </p>
                <div style={{display:'flex', flexWrap:'wrap', gap:'6px'}}>
                  {game.genres.map((g: string) => (
                    <span key={g} style={{
                      background:'rgba(59,130,246,0.1)',
                      border:'1px solid rgba(59,130,246,0.2)',
                      borderRadius:'6px',
                      padding:'3px 10px',
                      fontSize:'12px',
                      color:'#93c5fd'
                    }}>{g}</span>
                  ))}
                </div>
              </div>
            )}

            {game.categories?.length > 0 && (
              <div>
                <p style={{color:'#6b7280', fontSize:'11px', textTransform:'uppercase', letterSpacing:'0.05em', margin:'0 0 8px'}}>
                  Features
                </p>
                <div style={{display:'flex', flexWrap:'wrap', gap:'6px'}}>
                  {game.categories.map((c: string) => (
                    <span key={c} style={{
                      background:'rgba(139,92,246,0.1)',
                      border:'1px solid rgba(139,92,246,0.2)',
                      borderRadius:'6px',
                      padding:'3px 10px',
                      fontSize:'12px',
                      color:'#c4b5fd'
                    }}>{c}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}