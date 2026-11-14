'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Mic, Clock, ArrowRight, MessageSquareQuote, Bookmark } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useGsapEntrance } from '@/hooks/useGsapEntrance';
import { PageHeader, Badge } from '@/components/common/UiPrimitives';
import { SearchBar, FilterDropdown } from '@/components/common/DataControls';
import speakingTopics from '@/data/speaking/topics.json';

export function SpeakingLibraryView() {
  const { bookmarks, toggleBookmark } = useApp();
  const rootRef = useGsapEntrance('speaking-library');

  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return speakingTopics
      .filter((t) => (category === 'All' ? true : t.category === category))
      .filter((t) => (difficulty === 'all' ? true : t.difficulty.toLowerCase() === difficulty))
      .filter((t) => (!q ? true : t.title.toLowerCase().includes(q) || t.part2.cueTitle.toLowerCase().includes(q)));
  }, [category, difficulty, search]);

  const groups = ['Recent Speaking', 'Academic Speaking', 'Campus & Daily Life'].filter((g) =>
    category === 'All' ? true : category === g
  );

  return (
    <div ref={rootRef} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <PageHeader
        title="Step into the Speaking Studio"
        description="Simulate realistic Parts 1, 2, and 3 IELTS Speaking interviews with microphone recording, cue card prep countdowns, and demo rubric feedback."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Speaking' }]}
        actions={
          <Link href="/cue-card-coach" className="btn btn-accent">
            <MessageSquareQuote size={16} /> Cue Card Coach
          </Link>
        }
      />

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div className="filter-pills">
          {['All', 'Recent Speaking', 'Academic Speaking', 'Campus & Daily Life'].map((cat) => (
            <button
              key={cat}
              type="button"
              className={`filter-pill ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              <span>{cat}</span>
              {cat === 'Recent Speaking' && <Badge variant="yellow">NEW</Badge>}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search speaking topics..." style={{ width: 220 }} />
          <FilterDropdown
            value={difficulty}
            onChange={setDifficulty}
            options={[
              { value: 'all', label: 'All Difficulties' },
              { value: 'moderate', label: 'Moderate' },
              { value: 'standard', label: 'Standard' },
              { value: 'challenging', label: 'Challenging' },
              { value: 'advanced', label: 'Advanced' },
            ]}
          />
        </div>
      </div>

      {/* Grouped Sections (Image 7 inspired) */}
      {groups.map((groupName) => {
        const items = filtered.filter((t) => t.category === groupName);
        if (!items.length) return null;
        return (
          <section key={groupName} className="card" style={{ padding: 20 }}>
            <div className="section-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: '999px', backgroundColor: 'var(--success)' }} />
                <h2 className="h2">{groupName}</h2>
                <span className="text-xs text-muted">{items.length} topics</span>
              </div>
              {groupName === 'Recent Speaking' && <Badge variant="yellow">Updated Topics</Badge>}
            </div>

            <div className="grid-3">
              {items.map((topic) => {
                const saved = bookmarks.tests.includes(topic.id);
                return (
                  <div
                    key={topic.id}
                    data-animate="card"
                    style={{
                      padding: 16,
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--bg-primary)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Badge variant="purple">PARTS 1-3</Badge>
                        {topic.isNew && <Badge variant="yellow">NEW</Badge>}
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleBookmark('tests', topic.id, 'Saved Speaking Topics')}
                        aria-label="Bookmark topic"
                      >
                        <Bookmark size={14} fill={saved ? 'var(--accent-yellow)' : 'none'} color={saved ? '#B48200' : 'var(--text-secondary)'} />
                      </button>
                    </div>

                    <h3 className="h3" style={{ fontSize: '0.96rem' }}>{topic.title}</h3>
                    <p className="text-xs text-muted">{topic.part2.cueTitle}</p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 6 }}>
                      <span className="text-xs text-muted" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={12} /> {topic.durationLabel}
                      </span>
                      <Link href={`/speaking/practice/${topic.id}`} className="btn btn-primary btn-sm">
                        <Mic size={13} /> Start <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

