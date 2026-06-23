"use client";

import { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

export function AnalyticsChart({ data }: { data: any[] }) {
  const [activeMetric, setActiveMetric] = useState<'both' | 'clicks' | 'scans'>('both');

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
        <p className="text-slate-400 font-medium">No analytics data available yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-end mb-4 space-x-2">
        <button 
          onClick={() => setActiveMetric('both')}
          className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${activeMetric === 'both' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          All
        </button>
        <button 
          onClick={() => setActiveMetric('clicks')}
          className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${activeMetric === 'clicks' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-blue-50'}`}
        >
          Clicks
        </button>
        <button 
          onClick={() => setActiveMetric('scans')}
          className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${activeMetric === 'scans' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-emerald-50'}`}
        >
          QR Scans
        </button>
      </div>

      <div className="w-full h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748B' }}
              tickFormatter={(val) => {
                const date = new Date(val);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748B' }}
              dx={-10}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
              labelStyle={{ color: '#0F172A', fontWeight: 'bold', marginBottom: '4px' }}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '13px', paddingTop: '20px' }} />
            
            {(activeMetric === 'both' || activeMetric === 'clicks') && (
              <Line 
                type="monotone" 
                name="Clicks"
                dataKey="clicks" 
                stroke="#2563EB" 
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                animationDuration={1000}
              />
            )}
            
            {(activeMetric === 'both' || activeMetric === 'scans') && (
              <Line 
                type="monotone" 
                name="QR Scans"
                dataKey="scans" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                animationDuration={1000}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
