'use client';
import styles from './QuestionTypesLibraryView.module.css';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Layers, ArrowRight, Bookmark } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useGsapEntrance } from '@/hooks/useGsapEntrance';
import { PageHeader, Badge } from '@/components/common/UiPrimitives';
import { SearchBar } from '@/components/common/DataControls';
import guides from '@/data/question-types/guides.json';

export function QuestionTypesLibraryView() {
  const { bookmarks, toggleBookmark } = useApp();
  const rootRef = useGsapEntrance('question-types');
  const [moduleFilter, setModuleFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return guides
      .filter((g) => (moduleFilter === 'All' ? true : g.module === moduleFilter))
      .filter((g) => (!q ? true : g.title.toLowerCase().includes(q) || g.overview.toLowerCase().includes(q)));
  }, [moduleFilter, search]);

  return (
    <div ref={rootRef} className={styles.ques_div_1}>
      <PageHeader
        title="IELTS Question Types Masterclass"
        description="Step-by-step solving strategies, examiner trap warnings, annotated examples, and mini-practice drills for every IELTS task."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Question Types' }]}
      />

      <div className={styles.ques_div_2}>
        <div className="filter-pills">
          {['All', 'Reading', 'Listening', 'Writing', 'Speaking'].map((mod) => (
            <button
              key={mod}
              type="button"
              onClick={() => setModuleFilter(mod)}
              className={`filter-pill ${moduleFilter === mod ? 'active' : ''}`}
            >
              {mod}
            </button>
          ))}
        </div>
        <SearchBar value={search} onChange={setSearch} placeholder="Search question types..." className={styles.ques_searchbar_3} />
      </div>

      <div className="grid-2">
        {filtered.map((guide) => {
          const saved = bookmarks.resources.includes(guide.id);
          return (
            <div key={guide.id} data-animate="card" className={`card card-interactive ${styles.ques_div_4}`} >
              <div className={styles.ques_div_5}>
                <div className={styles.ques_div_6}>
                  <Badge variant="purple">{guide.module}</Badge>
                  <Badge variant="yellow">{guide.difficulty}</Badge>
                </div>
                <button
                  type="button"
                  onClick={() => toggleBookmark('resources', guide.id, 'Saved Resources')}
                  aria-label="Bookmark guide"
                >
                  <Bookmark size={15} fill={saved ? 'var(--accent-yellow)' : 'none'} color={saved ? '#B48200' : 'var(--text-secondary)'} />
                </button>
              </div>

              <div>
                <h2 className={`h3 ${styles.ques_h2_7}`} >{guide.title}</h2>
                <p className={`text-xs text-muted ${styles.ques_p_8}`} >{guide.overview}</p>
              </div>

              <div className={styles.ques_div_9}>
                <span className={`text-xs text-muted ${styles.ques_span_10}`} >
                  <Layers size={13} /> {guide.frequency}
                </span>
                <Link href={`/question-types/${guide.id}`} className="btn btn-primary btn-sm">
                  Study & Practise <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

