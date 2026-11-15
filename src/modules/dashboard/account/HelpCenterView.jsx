'use client';
import styles from './HelpCenterView.module.css';

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
    <div className={styles.help_div_1}>
      <PageHeader
        title="IELTS Ultimate Help Center"
        description="Answers on band score conversion, split-screen exam tools, speaking permissions, and account management."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Help Center' }]}
      />

      {/* Learning Guides */}
      <div className="grid-3">
        {helpData.guides.map((g) => (
          <Link key={g.id} href={g.href} className={`card card-interactive ${styles.help_link_2}`} >
            <Badge variant="yellow">Quick Guide</Badge>
            <h3 className="h3">{g.title}</h3>
            <p className="text-xs text-muted">{g.summary}</p>
            <span className={`text-xs ${styles.help_span_3}`} >
              Read Guide <ArrowRight size={12} className={styles.help_arrowright_4} />
            </span>
          </Link>
        ))}
      </div>

      {/* FAQ Filter & List */}
      <div className={styles.help_div_5}>
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
        <SearchBar value={search} onChange={setSearch} placeholder="Search FAQs..." className={styles.help_searchbar_6} />
      </div>

      <div className={styles.help_div_7}>
        {filteredFaqs.map((f) => (
          <div key={f.id} className="card">
            <div className={styles.help_div_8}>
              <HelpCircle size={16} className={styles.help_helpcircle_9} />
              <span className={styles.help_span_10}>{f.q}</span>
            </div>
            <p className="text-sm text-muted">{f.a}</p>
          </div>
        ))}
      </div>

      {/* Contact Support Form */}
      <form onSubmit={handleSupportSubmit} className={`card ${styles.help_form_11}`} >
        <h2 className="h3">Contact IELTS Ultimate Support (Demo)</h2>
        <div className="field-group">
          <label className="field-label" htmlFor="sup-sub">Topic / Subject</label>
          <input id="sup-sub" className="input" required value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Question about Speaking Mic fallback" />
        </div>
        <div className="field-group">
          <label className="field-label" htmlFor="sup-msg">Message</label>
          <textarea id="sup-msg" className="textarea" rows={3} required value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Describe how we can help..." />
        </div>
        <button type="submit" className={`btn btn-primary ${styles.help_button_12}`} >
          <Send size={14} /> Send Support Request
        </button>
      </form>
    </div>
  );
}

