'use client';

import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts';

interface Snapshot {
  captured_at: string;
  current_players: number;
  snapshot_date: string;
}

interface Props {
  data: Snapshot[];
  gameName: string;
}

export default function PlayerHistoryChart({ data, gameName }: Props) {
  const formatted = data.map(d => ({
    ...d,
    date: new Date(d.captured_at).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    }),
    players: d.current_players
  }));

  if (data.length === 0) {
    return (
      <div style={{
        background:'#111827',
        borderRadius:'12px',
        border:'1px solid #1f2937',
        padding:'48px',
        textAlign:'center'
      }}>
        <p style={{color:'#6b7280', margin:0}}>
          Player history will appear here as data accumulates over time.
        </p>
      </div>
    );
  }

  const peak = Math.max(...data.map(d => d.current_players));

  return (
    <div style={{background:'#111827', borderRadius:'12px', border:'1px solid #1f2937', padding:'24px'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px'}}>
        <h2 style={{color:'#fff', fontSize:'16px', fontWeight:600, margin:0}}>
          Player count history
        </h2>
        <div style={{display:'flex', gap:'16px'}}>
          <div style={{textAlign:'right'}}>
            <p style={{color:'#6b7280', fontSize:'11px', margin:0, textTransform:'uppercase', letterSpacing:'0.05em'}}>Peak (30d)</p>
            <p style={{color:'#3b82f6', fontSize:'16px', fontWeight:700, margin:'2px 0 0', fontFamily:'monospace'}}>
              {peak.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={formatted} margin={{left:0, right:16, top:4, bottom:0}}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false}/>
          <XAxis
            dataKey="date"
            tick={{fill:'#6b7280', fontSize:11}}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{fill:'#6b7280', fontSize:11}}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => v.toLocaleString()}
            width={70}
          />
          <Tooltip
            contentStyle={{
              background:'#1f2937',
              border:'1px solid #374151',
              borderRadius:'8px',
              fontSize:'12px'
            }}
            labelStyle={{color:'#f9fafb', fontWeight:600, marginBottom:'4px'}}
            itemStyle={{color:'#93c5fd'}}
            formatter={(value: number) => [value.toLocaleString(), 'Players']}
          />
          <Line
            type="monotone"
            dataKey="players"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            activeDot={{r:4, fill:'#3b82f6', stroke:'#1f2937', strokeWidth:2}}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}