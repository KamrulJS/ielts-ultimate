'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  PenTool,
  Plus,
  Clock,
  ArrowRight,
  Bookmark,
  FileText,
  Sparkles,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useGsapEntrance } from '@/hooks/useGsapEntrance';
import { PageHeader, Badge } from '@/components/common/UiPrimitives';
import { SearchBar, FilterDropdown } from '@/components/common/DataControls';
import { Modal } from '@/components/common/Modal';
import writingTasks from '@/data/writing/tasks.json';

export function WritingLibraryView() {
  const router = useRouter();
  const { writingSubmissions, bookmarks, toggleBookmark } = useApp();
  const rootRef = useGsapEntrance('writing-library');

  const [activeTab, setActiveTab] = useState('all'); // all | task1 | task2 | submissions
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [search, setSearch] = useState('');
  const [customOpen, setCustomOpen] = useState(false);
  const [customTaskNum, setCustomTaskNum] = useState('2');
  const [customPrompt, setCustomPrompt] = useState('');

  const categories = useMemo(() => {
    const relevant = writingTasks.filter((t) =>
      activeTab === 'task1' ? t.taskNumber === 1 : activeTab === 'task2' ? t.taskNumber === 2 : true
    );
    return ['all', ...Array.from(new Set(relevant.map((t) => t.category)))];
  }, [activeTab]);

  const filteredTasks = useMemo(() => {
    const q = search.trim().toLowerCase();
    return writingTasks
      .filter((t) => (activeTab === 'task1' ? t.taskNumber === 1 : activeTab === 'task2' ? t.taskNumber === 2 : true))
      .filter((t) => (categoryFilter === 'all' ? true : t.category === categoryFilter))
      .filter((t) => (difficulty === 'all' ? true : t.difficulty.toLowerCase() === difficulty))
      .filter((t) => (!q ? true : t.title.toLowerCase().includes(q) || t.prompt.toLowerCase().includes(q)));
  }, [activeTab, categoryFilter, difficulty, search]);

  const handleLaunchCustom = (e) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;
    try {
      window.localStorage.setItem(
        'ielts_ultimate_custom_writing_prompt',
        JSON.stringify({
          id: 'custom',
          taskNumber: Number(customTaskNum),
          category: customTaskNum === '1' ? 'Custom Task 1' : 'Custom Task 2',
          title: 'Custom Writing Practice Prompt',
          difficulty: 'Custom',
          recommendedMinutes: customTaskNum === '1' ? 20 : 40,
          minWords: customTaskNum === '1' ? 150 : 250,
          prompt: customPrompt.trim(),
          keyTips: ['Plan paragraph structure before drafting.', 'Check word count and register.'],
        })
      );
    } catch {
      // ignore
    }
    setCustomOpen(false);
    router.push('/writing/practice/custom');
  };

  return (
    <div ref={rootRef} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <PageHeader
        title="Master the Writing Assessment"
        description="Structured Academic Task 1 data reports and Task 2 argumentative essays with live word counter, autosave, and demo rubric feedback."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Writing' }]}
        actions={
          <button type="button" className="btn btn-accent" onClick={() => setCustomOpen(true)}>
            <Plus size={16} /> Custom Question
          </button>
        }
      />

      {/* Custom Prompt Banner (Image 6 inspired) */}
      <div
        data-animate="card"
        className="card-warm"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 14,
          padding: '16px 20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={17} style={{ color: 'var(--accent-purple)' }} />
          </span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.94rem' }}>Practice with Your Own Essay Prompt</div>
            <p className="text-xs text-muted">
              Paste a custom Task 1 or Task 2 prompt from class to practise inside the timed workspace.
            </p>
          </div>
        </div>
        <button type="button" className="btn btn-primary btn-sm" onClick={() => setCustomOpen(true)}>
          Write Custom Prompt →
        </button>
      </div>

      {/* Tabs & Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div className="tabs-list">
          {[
            { id: 'all', label: 'All Tasks', count: writingTasks.length },
            { id: 'task1', label: 'Task 1 (Charts & Maps)', count: writingTasks.filter((t) => t.taskNumber === 1).length },
            { id: 'task2', label: 'Task 2 (Essays)', count: writingTasks.filter((t) => t.taskNumber === 2).length },
            { id: 'submissions', label: 'Previous Submissions', count: writingSubmissions.length },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`tab-trigger ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(tab.id);
                setCategoryFilter('all');
              }}
            >
              <span>{tab.label}</span>
              <span className="text-xs text-muted">({tab.count})</span>
            </button>
          ))}
        </div>

        {activeTab !== 'submissions' && (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <SearchBar value={search} onChange={setSearch} placeholder="Search prompts..." style={{ width: 200 }} />
            <FilterDropdown
              value={difficulty}
              onChange={setDifficulty}
              options={[
                { value: 'all', label: 'All Difficulties' },
                { value: 'moderate', label: 'Moderate' },
                { value: 'standard', label: 'Standard' },
                { value: 'challenging', label: 'Challenging' },
              ]}
            />
          </div>
        )}
      </div>

      {activeTab !== 'submissions' && (
        <div className="filter-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`filter-pill ${categoryFilter === cat ? 'active' : ''}`}
              onClick={() => setCategoryFilter(cat)}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      )}

      {/* Task Cards or Previous Submissions */}
      {activeTab === 'submissions' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {writingSubmissions.map((sub) => (
            <div key={sub.id} className="card card-interactive" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 14 }}>
              <div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                  <Badge variant={sub.taskNumber === 1 ? 'yellow' : 'purple'}>Task {sub.taskNumber}</Badge>
                  <span className="text-xs text-muted">{sub.submittedAt} • {sub.wordCount} words</span>
                </div>
                <h3 className="h3">{sub.title}</h3>
                <p className="text-xs text-muted" style={{ marginTop: 4, maxWidth: 680 }}>
                  {sub.content.slice(0, 150)}...
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Badge variant="dark">Band {sub.bandScore.toFixed(1)}</Badge>
                <Link href={`/writing/result/${sub.id}`} className="btn btn-secondary btn-sm">
                  View Feedback <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid-2">
          {filteredTasks.map((task) => {
            const saved = bookmarks.tests.includes(task.id);
            return (
              <div key={task.id} data-animate="card" className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <Badge variant={task.taskNumber === 1 ? 'yellow' : 'purple'}>Task {task.taskNumber}</Badge>
                    <Badge variant="neutral">{task.category}</Badge>
                  </div>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => toggleBookmark('tests', task.id, 'Saved Writing Tasks')}
                  >
                    <Bookmark size={15} fill={saved ? 'var(--accent-yellow)' : 'none'} color={saved ? '#B48200' : 'var(--text-secondary)'} />
                  </button>
                </div>

                <div>
                  <h3 className="h3">{task.title}</h3>
                  <p className="text-xs text-muted" style={{ marginTop: 6, lineHeight: 1.55 }}>{task.prompt}</p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 6 }}>
                  <span className="text-xs text-muted" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={13} /> {task.recommendedMinutes}m
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <FileText size={13} /> {task.minWords}+ words
                    </span>
                  </span>
                  <Link href={`/writing/practice/${task.id}`} className="btn btn-primary btn-sm">
                    <PenTool size={14} /> Start Writing
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Custom Prompt Modal */}
      <Modal open={customOpen} onClose={() => setCustomOpen(false)} title="Create Custom Writing Prompt" subtitle="Launch the timed IELTS editor with any prompt.">
        <form onSubmit={handleLaunchCustom} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="field-group">
            <label className="field-label" htmlFor="custom-type">Task Type</label>
            <select id="custom-type" className="select" value={customTaskNum} onChange={(e) => setCustomTaskNum(e.target.value)}>
              <option value="1">Task 1 (150+ words • 20 min)</option>
              <option value="2">Task 2 Essay (250+ words • 40 min)</option>
            </select>
          </div>
          <div className="field-group">
            <label className="field-label" htmlFor="custom-prompt">Prompt Question</label>
            <textarea
              id="custom-prompt"
              className="textarea"
              rows={4}
              required
              placeholder="Paste your IELTS Writing question prompt..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button type="button" className="btn btn-secondary" onClick={() => setCustomOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Launch Workspace →</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

