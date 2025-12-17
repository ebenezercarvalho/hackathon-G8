import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { MOCK_DELAY_STATS } from '../constants';

const StatsChart: React.FC = () => {
  return (
    <div className="h-64 w-full">
      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 text-center">Historical Delay by Period</h4>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={MOCK_DELAY_STATS}>
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#94a3b8', fontSize: 12 }} 
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            hide 
          />
          <Tooltip 
            cursor={{fill: 'transparent'}}
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
            itemStyle={{ color: '#22d3ee' }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {MOCK_DELAY_STATS.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.name === 'Evening' ? '#ef4444' : '#0891b2'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatsChart;