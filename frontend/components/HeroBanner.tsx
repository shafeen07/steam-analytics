'use client';

import { useEffect, useState } from 'react';

interface Game {
  app_id: number;
  name: string;
  current_players: number;
  header_image: string;
}

interface HeroBannerProps {
  totalPlayers: number;
  topGames: Game[];
  lastUpdated: string | null;
}

export default function HeroBanner({ totalPlayers, topGames, lastUpdated }: HeroBannerProps) {
  const [displayCount, setDisplayCount] = useState(0);
  const [tickerOffset, setTickerOffset] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = totalPlayers / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= totalPlayers) {
        setDisplayCount(totalPlayers);
        clearInterval(timer);
      } else {
        setDisplayCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [totalPlayers]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerOffset(prev => {
        const next = prev - 1;
        return next < -(topGames.length * 200) ? 0 : next;
      });
    }, 30);
    return () => clearInterval(timer);
  }, [topGames.length]);

  return (
    <div style={{
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '16px',
      marginBottom: '32px',
      background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1b2a 50%, #0a1628 100%)',
      border: '1px solid #1e3a5f',
      minHeight: '320px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>

      {/* Animated grid background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(66,153,225,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(66,153,225,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        pointerEvents: 'none'
      }}/>

      {/* Glow effects */}
      <div style={{
        position: 'absolute',
        top: '-80px',
        left: '30%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }}/>
      <div style={{
        position: 'absolute',
        bottom: '-60px',
        right: '20%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)',
        pointerEvents: 'none'
      }}/>

      {/* Main content */}
      <div style={{
        position: 'relative',
        padding: '48px 48px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '32px'
      }}>
        {/* Left: headline */}
        <div>
          <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'16px'}}>
            <span style={{
              display:'inline-flex', alignItems:'center', gap:'6px',
              background:'rgba(59,130,246,0.15)',
              border:'1px solid rgba(59,130,246,0.3)',
              borderRadius:'20px',
              padding:'4px 12px',
              fontSize:'11px',
              color:'#93c5fd',
              textTransform:'uppercase',
              letterSpacing:'0.08em'
            }}>
              <span style={{
                width:'6px', height:'6px', borderRadius:'50%',
                background:'#3b82f6',
                boxShadow:'0 0 6px #3b82f6',
                display:'inline-block'
              }}/>
              Updated every 6 hours
            </span>
          </div>
          <h1 style={{
            fontSize:'42px',
            fontWeight:800,
            color:'#fff',
            margin:'0 0 12px',
            lineHeight:1.1,
            letterSpacing:'-0.02em'
          }}>
            Steam Analytics
          </h1>
          <p style={{
            color:'#94a3b8',
            fontSize:'16px',
            margin:'0 0 8px',
            maxWidth:'420px',
            lineHeight:1.6
          }}>
            Real-time player counts, review trends, and market insights
            across the Steam gaming ecosystem.
          </p>
          {lastUpdated && (
            <p style={{color:'#475569', fontSize:'12px', margin:0}}>
              Last updated: {lastUpdated}
            </p>
          )}
        </div>

        {/* Right: big stat */}
        <div style={{textAlign:'right'}}>
          <p style={{color:'#64748b', fontSize:'12px', textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 8px'}}>
            Concurrent players at last update
          </p>
          <p style={{
            fontSize:'56px',
            fontWeight:800,
            color:'#fff',
            margin:'0 0 4px',
            lineHeight:1,
            letterSpacing:'-0.03em',
            fontFamily:'monospace'
          }}>
            {displayCount.toLocaleString()}
          </p>
          <p style={{color:'#3b82f6', fontSize:'13px', margin:0}}>
            across top 50 tracked games
          </p>
        </div>
      </div>

      {/* Ticker */}
      <div style={{
        position: 'relative',
        borderTop: '1px solid #1e3a5f',
        background: 'rgba(0,0,0,0.3)',
        padding: '12px 0',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'flex',
          gap: '0',
          transform: `translateX(${tickerOffset}px)`,
          whiteSpace: 'nowrap',
          willChange: 'transform'
        }}>
          {[...topGames, ...topGames, ...topGames].map((game, i) => (
            <div key={i} style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0 24px',
              borderRight: '1px solid #1e3a5f',
              minWidth: '200px'
            }}>
              <img
                src={game.header_image}
                alt={game.name}
                style={{width:'40px', height:'22px', objectFit:'cover', borderRadius:'3px', flexShrink:0}}
              />
              <div>
                <p style={{
                  color:'#cbd5e1',
                  fontSize:'11px',
                  margin:0,
                  overflow:'hidden',
                  textOverflow:'ellipsis',
                  whiteSpace:'nowrap',
                  maxWidth:'120px'
                }}>{game.name}</p>
                <p style={{color:'#3b82f6', fontSize:'10px', margin:0, fontFamily:'monospace'}}>
                  {game.current_players.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}