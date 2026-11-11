'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bookmark, Trash2, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PageHeader, Badge, EmptyState } from '@/components/common/UiPrimitives';

import passages from '@/data/reading/passages.json';
import listeningTests from '@/data/listening/tests.json';
import writingTasks from '@/data/writing/tasks.json';
import speakingTopics from '@/data/speaking/topics.json';
import readingQuestions from '@/data/reading/questions.json';
import wordsData from '@/data/vocabulary/words.json';
import guidesData from '@/data/question-types/guides.json';

export function BookmarksView() {
  const { bookmarks, toggleBookmark } = useApp();
  const [tab, setTab] = useState('tests'); // tests | questions | vocabulary | resources

  const savedTests = [
    ...passages.filter((p) => bookmarks.tests.includes(p.id)).map((p) => ({ id: p.id, title: p.title, sub: 'Reading', href: `/reading/test/${p.id}` })),
    ...listeningTests.filter((l) => bookmarks.tests.includes(l.id)).map((l) => ({ id: l.id, title: l.title, sub: 'Listening', href: `/listening/test/${l.id}` })),
    ...writingTasks.filter((w) => bookmarks.tests.includes(w.id)).map((w) => ({ id: w.id, title: w.title, sub: 'Writing', href: `/writing/practice/${w.id}` })),
    ...speakingTopics.filter((s) => bookmarks.tests.includes(s.id)).map((s) => ({ id: s.id, title: s.title, sub: 'Speaking', href: `/speaking/practice/${s.id}` })),
  ];

  const savedQuestions = readingQuestions.filter((q) => bookmarks.questions.includes(q.id));
  const savedVocab = wordsData.filter((w) => bookmarks.vocabulary.includes(w.id));
  const savedResources = guidesData.filter((g) => bookmarks.resources.includes(g.id));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PageHeader
        title="My Bookmarks"
        description="Quickly revisit saved practice tests, flagged exam questions, favourite vocabulary, and study guides."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'My Bookmarks' }]}
      />

      <div className="tabs-list">
        {[
          { id: 'tests', label: 'Saved Tests', count: savedTests.length },
          { id: 'questions', label: 'Saved Questions', count: savedQuestions.length },
          { id: 'vocabulary', label: 'Saved Vocabulary', count: savedVocab.length },
          { id: 'resources', label: 'Saved Resources', count: savedResources.length },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            className={`tab-trigger ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            <span>{t.label}</span>
            <span className="text-xs text-muted">({t.count})</span>
          </button>
        ))}
      </div>

      {tab === 'tests' && (
        savedTests.length === 0 ? (
          <EmptyState icon={Bookmark} title="No saved tests yet" description="Bookmark any Reading, Listening, Writing, or Speaking test to keep it handy." />
        ) : (
          <div className="grid-2">
            {savedTests.map((t) => (
              <div key={t.id} className="card card-compact" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                <div>
                  <Badge variant="purple">{t.sub}</Badge>
                  <div style={{ fontWeight: 700, marginTop: 6 }}>{t.title}</div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => toggleBookmark('tests', t.id, 'Saved Tests')}>
                    <Trash2 size={14} />
                  </button>
                  <Link href={t.href} className="btn btn-primary btn-sm">Open <ArrowRight size={13} /></Link>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {tab === 'questions' && (
        savedQuestions.length === 0 ? (
          <EmptyState icon={Bookmark} title="No flagged questions" description="Flag tricky questions inside Reading or Listening exams to review them here." />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {savedQuestions.map((q) => (
              <div key={q.id} className="card card-compact" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <div>
                  <Badge variant="yellow">{q.typeLabel}</Badge>
                  <p className="text-sm" style={{ marginTop: 6 }}>{q.prompt}</p>
                </div>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => toggleBookmark('questions', q.id, 'Saved Questions')}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )
      )}

      {tab === 'vocabulary' && (
        savedVocab.length === 0 ? (
          <EmptyState icon={Bookmark} title="No saved vocabulary" description="Star academic words in Vocabulary Studio to drill them here." />
        ) : (
          <div className="grid-3">
            {savedVocab.map((w) => (
              <div key={w.id} className="card card-compact" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{w.word}</strong>
                  <button type="button" onClick={() => toggleBookmark('vocabulary', w.id, 'Saved Vocabulary')}><Trash2 size={14} /></button>
                </div>
                <p className="text-xs text-muted">{w.definition}</p>
              </div>
            ))}
          </div>
        )
      )}

      {tab === 'resources' && (
        savedResources.length === 0 ? (
          <EmptyState icon={Bookmark} title="No saved resources" description="Save Question Type guides to access them quickly." />
        ) : (
          <div className="grid-2">
            {savedResources.map((g) => (
              <div key={g.id} className="card card-compact" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Badge variant="purple">{g.module}</Badge>
                  <div style={{ fontWeight: 700, marginTop: 4 }}>{g.title}</div>
                </div>
                <Link href={`/question-types/${g.id}`} className="btn btn-secondary btn-sm">Study</Link>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

