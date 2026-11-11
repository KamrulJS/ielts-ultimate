'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { ArrowRight } from 'lucide-react';
import { useIsMounted } from '@/hooks/useIsMounted';

const PIE_COLORS = ['#8867B8', '#F6BD28', '#39966B', '#4D73B8', '#D95B55'];

export function WritingVisualPrompt({ task }) {
  const mounted = useIsMounted();

  if (!task || task.taskNumber !== 1) return null;

  if (task.chartType === 'table' && task.tableData) {
    return (
      <div className="table-wrap" style={{ marginTop: 12 }}>
        <table className="data-table">
          <thead>
            <tr>
              {task.tableData.headers.map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {task.tableData.rows.map((row, idx) => (
              <tr key={idx}>
                {row.map((cell, cIdx) => (
                  <td key={cIdx} style={{ fontWeight: cIdx === 0 ? 600 : 400 }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (task.chartType === 'process' && task.processSteps) {
    return (
      <div
        style={{
          marginTop: 12,
          padding: 16,
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--border)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          alignItems: 'center',
        }}
      >
        {task.processSteps.map((step, idx) => (
          <React.Fragment key={step}>
            <div
              style={{
                padding: '10px 12px',
                borderRadius: 10,
                backgroundColor: idx % 2 === 0 ? 'var(--surface)' : 'var(--accent-yellow-soft)',
                border: '1px solid var(--border)',
                fontSize: '0.81rem',
                fontWeight: 600,
              }}
            >
              {step}
            </div>
            {idx < task.processSteps.length - 1 && (
              <ArrowRight size={15} className="text-muted" />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }

  if (task.chartType === 'map' && task.mapHighlights) {
    return (
      <div className="grid-2" style={{ marginTop: 12, gap: 12 }}>
        <div className="card-warm card-compact">
          <div className="text-xs" style={{ fontWeight: 700, marginBottom: 8 }}>1995 (Industrial Wharf)</div>
          <ul style={{ paddingLeft: 18, fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {task.mapHighlights.before.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div
          className="card card-compact"
          style={{ backgroundColor: 'var(--success-soft)', borderColor: 'rgba(57,150,107,0.25)' }}
        >
          <div className="text-xs" style={{ fontWeight: 700, marginBottom: 8 }}>Present Day (Civic Waterfront)</div>
          <ul style={{ paddingLeft: 18, fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {task.mapHighlights.after.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  if (!mounted || !task.chartData) {
    return <div className="skeleton" style={{ height: 220, marginTop: 12 }} />;
  }

  return (
    <div
      style={{
        marginTop: 12,
        padding: 14,
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--bg-primary)',
        border: '1px solid var(--border)',
        height: 250,
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        {task.chartType === 'bar' ? (
          <BarChart data={task.chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E9E6DC" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#77766F' }} />
            <YAxis tick={{ fontSize: 11, fill: '#77766F' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="y2015" name="2015" fill="#8867B8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="y2020" name="2020" fill="#F6BD28" radius={[4, 4, 0, 0]} />
            <Bar dataKey="y2025" name="2025" fill="#242424" radius={[4, 4, 0, 0]} />
          </BarChart>
        ) : task.chartType === 'line' ? (
          <LineChart data={task.chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E9E6DC" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#77766F' }} />
            <YAxis tick={{ fontSize: 11, fill: '#77766F' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Metro" stroke="#8867B8" strokeWidth={2.5} />
            <Line type="monotone" dataKey="Car" stroke="#D95B55" strokeWidth={2.5} />
            <Line type="monotone" dataKey="Cycling" stroke="#39966B" strokeWidth={2.5} />
            <Line type="monotone" dataKey="Bus" stroke="#F6BD28" strokeWidth={2.5} />
          </LineChart>
        ) : (
          <PieChart>
            <Pie
              data={task.chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={78}
              label={({ name, value }) => `${name} (${value}%)`}
            >
              {task.chartData.map((_, idx) => (
                <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
