'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Genre {
  genre: string;
  game_count: number;
  avg_positive_pct: number;
  total_current_players: number;
}

const COLORS = ['#3b82f6','#6366f1','#8b5cf6','#a855f7','#ec4899','#f43f5e','#f97316','#eab308','#22c55e','#14b8a6'];

export default function GenreChart({ genres }: { genres: Genre[] }) {
  const top10 = genres.slice(0, 10);

  return (
    <div style={{background:'#111827', borderRadius:'12px', border:'1px solid #1f2937', padding:'20px'}}>
      <h2 style={{color:'#fff', fontSize:'16px', fontWeight:600, margin:'0 0 20px'}}>
        Concurrent players by genre
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={top10} layout="vertical" margin={{left:0, right:40, top:0, bottom:0}}>
          <XAxis
            type="number"
            tick={{fill:'#6b7280', fontSize:11}}
            tickFormatter={(v) => `${(v/1000).toFixed(0)}k`}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="genre"
            tick={{fill:'#9ca3af', fontSize:12}}
            width={110}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{background:'#111827', border:'1px solid #374151', borderRadius:'8px', fontSize:'12px', padding:'8px 12px'}}
            labelStyle={{color:'#f9fafb', fontWeight:600}}
            itemStyle={{color:'#93c5fd'}}
            formatter={(value: number) => [value.toLocaleString(), 'Players']}
            cursor={{fill:'rgba(255,255,255,0.03)'}}
          />
          <Bar dataKey="total_current_players" radius={[0,4,4,0]} maxBarSize={20}>
            {top10.map((_,i) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}