'use client';
import styles from './GlobalSearchModal.module.css';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, BookOpen, Headphones, PenTool, Mic, Sparkles, ArrowRight } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { useApp } from '@/context/AppContext';
import passages from '@/data/reading/passages.json';
import listeningTests from '@/data/listening/tests.json';
import writingTasks from '@/data/writing/tasks.json';
import speakingTopics from '@/data/speaking/topics.json';
import words from '@/data/vocabulary/words.json';

const QUICK_ROUTES = [
  { label: 'Full Mock Test (2h 40m)', href: '/mock-test', type: 'Page' },
  { label: 'Reading Practice Library', href: '/reading', type: 'Page' },
  { label: 'Listening Audio Library', href: '/listening', type: 'Page' },
  { label: 'Writing Task 1 & 2 Workspace', href: '/writing', type: 'Page' },
  { label: 'Speaking Studio & Recorder', href: '/speaking', type: 'Page' },
  { label: 'Question Types Trainer', href: '/question-types', type: 'Page' },
  { label: 'Cue Card Coach', href: '/cue-card-coach', type: 'Page' },
  { label: 'Band Score Calculator & Tools', href: '/tools', type: 'Page' },
  { label: 'Band Battle & Leaderboard', href: '/band-battle', type: 'Page' },
];

export function GlobalSearchModal() {
  const { searchOpen, setSearchOpen } = useApp();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [setSearchOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const matched = [];
    QUICK_ROUTES.forEach((r) => {
      if (r.label.toLowerCase().includes(q)) {
        matched.push({ id: r.href, title: r.label, sub: 'Module Page', href: r.href, icon: ArrowRight });
      }
    });
    passages.forEach((p) => {
      if (p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)) {
        matched.push({
          id: p.id,
          title: p.title,
          sub: `Reading • ${p.category}`,
          href: `/reading/test/${p.id}`,
          icon: BookOpen,
        });
      }
    });
    listeningTests.forEach((l) => {
      if (l.title.toLowerCase().includes(q)) {
        matched.push({
          id: l.id,
          title: l.title,
          sub: `Listening • ${l.difficulty}`,
          href: `/listening/test/${l.id}`,
          icon: Headphones,
        });
      }
    });
    writingTasks.forEach((w) => {
      if (w.title.toLowerCase().includes(q) || w.category.toLowerCase().includes(q)) {
        matched.push({
          id: w.id,
          title: w.title,
          sub: `Writing Task ${w.taskNumber} • ${w.category}`,
          href: `/writing/practice/${w.id}`,
          icon: PenTool,
        });
      }
    });
    speakingTopics.forEach((s) => {
      if (s.title.toLowerCase().includes(q)) {
        matched.push({
          id: s.id,
          title: s.title,
          sub: `Speaking • ${s.category}`,
          href: `/speaking/practice/${s.id}`,
          icon: Mic,
        });
      }
    });
    words.forEach((w) => {
      if (w.word.toLowerCase().includes(q) || w.definition.toLowerCase().includes(q)) {
        matched.push({
          id: w.id,
          title: `${w.word} (${w.pos})`,
          sub: `Vocabulary • Band ${w.band}`,
          href: `/vocabulary?q=${encodeURIComponent(w.word)}`,
          icon: Sparkles,
        });
      }
    });

    return matched.slice(0, 10);
  }, [query]);

  return (
    <Modal
      open={searchOpen}
      onClose={() => setSearchOpen(false)}
      title="Search IELTS Ultimate"
      subtitle="Jump directly to passages, audio tests, writing tasks, cue cards, or vocabulary."
      large
    >
      <div className={styles.glob_div_1}>
        <Search
          size={16}
          className={styles.glob_search_2}
        />
        <input
          autoFocus
          type="text"
          className={`input ${styles.glob_input_3}`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type e.g. 'longitude', 'urban', 'task 2', 'mitigate', 'mock'..."
          
        />
      </div>

      {!query.trim() ? (
        <div>
          <div className={`text-xs text-muted ${styles.glob_div_4}`} >
            QUICK JUMP
          </div>
          <div className={`grid-2 ${styles.glob_div_5}`} >
            {QUICK_ROUTES.slice(0, 6).map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setSearchOpen(false)}
                className={styles.glob_link_6}
              >
                <span>{route.label}</span>
                <ArrowRight size={14} className="text-muted" />
              </Link>
            ))}
          </div>
        </div>
      ) : results.length === 0 ? (
        <div className={`empty-state ${styles.glob_div_7}`} >
          <p className="text-sm text-muted">No matches found for &ldquo;{query}&rdquo;.</p>
        </div>
      ) : (
        <div className={styles.glob_div_8}>
          {results.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => {
                  setSearchOpen(false);
                  setQuery('');
                }}
                className={styles.glob_link_9}
              >
                <span
                  className={styles.glob_span_10}
                >
                  <Icon size={15} />
                </span>
                <div className={styles.glob_div_11}>
                  <div className={styles.glob_div_12}>{item.title}</div>
                  <div className="text-xs text-muted">{item.sub}</div>
                </div>
                <ArrowRight size={14} className="text-muted" />
              </Link>
            );
          })}
        </div>
      )}
    </Modal>
  );
}

