'use client';

import React from 'react';
import { Search, X } from 'lucide-react';

export function SearchBar({ value, onChange, placeholder = 'Search...', style = {} }) {
  return (
    <div style={{ position: 'relative', width: '100%', ...style }}>
      <Search
        size={16}
        style={{
          position: 'absolute',
          left: 13,
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--text-muted)',
          pointerEvents: 'none',
        }}
      />
      <input
        type="text"
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ paddingLeft: 38, paddingRight: value ? 34 : 14 }}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          style={{
            position: 'absolute',
            right: 10,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-secondary)',
            padding: 4,
          }}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

export function FilterDropdown({ label, value, onChange, options = [], style = {} }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, ...style }}>
      {label && (
        <span className="text-xs text-muted" style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
          {label}
        </span>
      )}
      <select
        className="select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: 'auto', minWidth: 150, paddingTop: 8, paddingBottom: 8 }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function Tabs({ tabs = [], activeTab, onChange }) {
  return (
    <div className="tabs-list" role="tablist">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`tab-trigger ${isActive ? 'active' : ''}`}
          >
            {Icon && <Icon size={15} />}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className="text-xs"
                style={{
                  padding: '1px 6px',
                  borderRadius: 999,
                  backgroundColor: isActive ? 'var(--bg-secondary)' : 'rgba(0,0,0,0.06)',
                  color: 'var(--text-secondary)',
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function DataTable({ columns = [], data = [], emptyMessage = 'No records found.' }) {
  if (!data.length) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: 32 }}>
        <p className="text-sm text-muted">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rIdx) => (
            <tr key={row.id || rIdx}>
              {columns.map((col) => (
                <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

