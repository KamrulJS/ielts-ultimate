'use client';

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { useIsMounted } from '@/hooks/useIsMounted';

export function BandProgressionChart({ data = [], activeMetric = 'overall', height = 240 }) {
  const mounted = useIsMounted();

  if (!mounted) {
    return <div className="skeleton" style={{ height, width: '100%' }} />;
  }

  const colorMap = {
    overall: '#8867B8',
    reading: '#39966B',
    listening: '#F6BD28',
    writing: '#D95B55',
    speaking: '#4D73B8',
  };
  const strokeColor = colorMap[activeMetric] || '#8867B8';

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 12, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={`grad-${activeMetric}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={strokeColor} stopOpacity={0.22} />
              <stop offset="95%" stopColor={strokeColor} stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E9E6DC" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12, fill: '#77766F' }}
            axisLine={{ stroke: '#E9E6DC' }}
            tickLine={false}
          />
          <YAxis
            domain={[4, 9]}
            ticks={[4, 5, 6, 7, 8, 9]}
            tick={{ fontSize: 12, fill: '#77766F' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E9E6DC',
              borderRadius: 12,
              boxShadow: '0 6px 20px rgba(32,32,32,0.08)',
              fontSize: 13,
            }}
          />
          <Area
            type="monotone"
            dataKey={activeMetric}
            stroke={strokeColor}
            strokeWidth={2.5}
            fillOpacity={1}
            fill={`url(#grad-${activeMetric})`}
            dot={{ r: 4, fill: strokeColor, strokeWidth: 2, stroke: '#FFFFFF' }}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
