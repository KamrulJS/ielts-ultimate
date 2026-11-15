'use client';
import styles from './SpeakingLibraryView.module.css';

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
    <div ref={rootRef} className={styles.spea_div_1}>
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

      <div className={styles.spea_div_2}>
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

        <div className={styles.spea_div_3}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search speaking topics..." className={styles.spea_searchbar_4} />
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
          <section key={groupName} className={`card ${styles.spea_section_5}`} >
            <div className="section-header">
              <div className={styles.spea_div_6}>
                <span className={styles.spea_span_7} />
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
                    className={styles.spea_div_8}
                  >
                    <div className={styles.spea_div_9}>
                      <div className={styles.spea_div_10}>
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

                    <h3 className={`h3 ${styles.spea_h3_11}`} >{topic.title}</h3>
                    <p className="text-xs text-muted">{topic.part2.cueTitle}</p>

                    <div className={styles.spea_div_12}>
                      <span className={`text-xs text-muted ${styles.spea_span_13}`} >
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

