'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { HelpCircle, Send, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PageHeader, Badge } from '@/components/common/UiPrimitives';
import { SearchBar } from '@/components/common/DataControls';
import helpData from '@/data/help/faqs.json';

export function HelpCenterView() {
  const { showToast } = useApp();
  const [cat, setCat] = useState('All');
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('');
  const [msg, setMsg] = useState('');

  const filteredFaqs = useMemo(() => {
    const q = search.trim().toLowerCase();
    return helpData.faqs
      .filter((f) => (cat === 'All' ? true : f.category === cat))
      .filter((f) => (!q ? true : f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)));
  }, [cat, search]);

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim() || !msg.trim()) return;
    setSubject('');
    setMsg('');
    showToast('Support message logged (demo support desk)', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <PageHeader
        title="IELTSWIST Help Center"
        description="Answers on band score conversion, split-screen exam tools, speaking permissions, and account management."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Help Center' }]}
      />

      {/* Learning Guides */}
      <div className="grid-3">
        {helpData.guides.map((g) => (
          <Link key={g.id} href={g.href} className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Badge variant="yellow">Quick Guide</Badge>
            <h3 className="h3">{g.title}</h3>
            <p className="text-xs text-muted">{g.summary}</p>
            <span className="text-xs" style={{ fontWeight: 600, color: 'var(--accent-purple)', marginTop: 'auto' }}>
              Read Guide <ArrowRight size={12} style={{ display: 'inline' }} />
            </span>
          </Link>
        ))}
      </div>

      {/* FAQ Filter & List */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 }}>
        <div className="filter-pills">
          {['All', ...helpData.categories].map((c) => (
            <button
              key={c}
              type="button"
              className={`filter-pill ${cat === c ? 'active' : ''}`}
              onClick={() => setCat(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <SearchBar value={search} onChange={setSearch} placeholder="Search FAQs..." style={{ width: 220 }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filteredFaqs.map((f) => (
          <div key={f.id} className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <HelpCircle size={16} style={{ color: 'var(--accent-purple)' }} />
              <span style={{ fontWeight: 700 }}>{f.q}</span>
            </div>
            <p className="text-sm text-muted">{f.a}</p>
          </div>
        ))}
      </div>

      {/* Contact Support Form */}
      <form onSubmit={handleSupportSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <h2 className="h3">Contact IELTSWIST Support (Demo)</h2>
        <div className="field-group">
          <label className="field-label" htmlFor="sup-sub">Topic / Subject</label>
          <input id="sup-sub" className="input" required value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Question about Speaking Mic fallback" />
        </div>
        <div className="field-group">
          <label className="field-label" htmlFor="sup-msg">Message</label>
          <textarea id="sup-msg" className="textarea" rows={3} required value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Describe how we can help..." />
        </div>
        <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
          <Send size={14} /> Send Support Request
        </button>
      </form>
    </div>
  );
}

