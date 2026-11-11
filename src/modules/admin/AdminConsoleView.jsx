'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Award,
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  Sparkles,
  MessageSquare,
  CreditCard,
  TrendingUp,
  Settings,
  ArrowLeft,
  Plus,
  Trash2,
  Menu,
  X,
  CheckCircle2,
  LogOut,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { ADMIN_NAV_ITEMS } from '@/lib/navigation';
import { useApp } from '@/context/AppContext';
import { useIsMounted } from '@/hooks/useIsMounted';
import { Badge, StatCard, PageHeader } from '@/components/common/UiPrimitives';
import { DataTable, SearchBar } from '@/components/common/DataControls';
import { Modal } from '@/components/common/Modal';

import adminAnalytics from '@/data/admin/analytics.json';
import initialTeachers from '@/data/teachers/teachers.json';
import initialMocks from '@/data/tests/mock-tests.json';
import initialPassages from '@/data/reading/passages.json';
import initialListening from '@/data/listening/tests.json';
import initialWriting from '@/data/writing/tasks.json';
import initialSpeaking from '@/data/speaking/topics.json';
import initialWords from '@/data/vocabulary/words.json';

const ADMIN_ICONS = {
  LayoutDashboard,
  Users,
  GraduationCap,
  Award,
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  Sparkles,
  MessageSquare,
  CreditCard,
  TrendingUp,
  Settings,
};

export function AdminConsoleView() {
  const router = useRouter();
  const { adminStudents, setAdminStudents, posts, showToast, logout } = useApp();

  const [section, setSection] = useState('overview');
  const [mobileMenu, setMobileMenu] = useState(false);
  const chartsMounted = useIsMounted();

  // Local Admin CRUD demo states
  const [teachers, setTeachers] = useState(initialTeachers);
  const [mocks, setMocks] = useState(initialMocks);
  const [passages, setPassages] = useState(initialPassages);
  const [listeningSets, setListeningSets] = useState(initialListening);
  const [writingTasks, setWritingTasks] = useState(initialWriting);
  const [speakingTopics, setSpeakingTopics] = useState(initialSpeaking);
  const [vocabWords, setVocabWords] = useState(initialWords);
  const [removedPostIds, setRemovedPostIds] = useState([]);

  const [search, setSearch] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formSub, setFormSub] = useState('');
  const [platformSettings, setPlatformSettings] = useState({
    siteTitle: 'IELTS Ultimate Learning Platform',
    defaultMockMinutes: 160,
    demoBannerEnabled: true,
  });

  const modPosts = posts.filter((p) => !removedPostIds.includes(p.id));

  const handleAddRecord = (e) => {
    e.preventDefault();
    if (!formTitle.trim()) return;
    const title = formTitle.trim();
    const sub = formSub.trim() || 'Standard';

    if (section === 'students') {
      setAdminStudents((prev) => [
        {
          id: `stu-${Date.now()}`,
          name: title,
          email: `${title.toLowerCase().replace(/\s+/g, '.')}@ieltsultimate.edu`,
          country: sub,
          track: 'Academic',
          currentBand: 6.5,
          targetBand: 7.5,
          plan: 'Free Plan',
          status: 'Active',
        },
        ...prev,
      ]);
    } else if (section === 'teachers') {
      setTeachers((prev) => [
        {
          id: `tch-${Date.now()}`,
          name: title,
          title: sub,
          country: 'United Kingdom',
          rating: 4.9,
          reviewsCount: 0,
          hourlyRate: '$30 / session',
          specialties: ['Writing', 'Speaking'],
        },
        ...prev,
      ]);
    } else if (section === 'mock-tests') {
      setMocks((prev) => [
        {
          id: `mock-${Date.now()}`,
          title,
          track: 'Academic',
          difficulty: sub,
          durationLabel: '2h 40m',
          status: 'Available',
        },
        ...prev,
      ]);
    } else if (section === 'reading') {
      setPassages((prev) => [
        {
          id: `rd-${Date.now()}`,
          title,
          category: sub,
          difficulty: 'Standard',
          partLabel: 'Part 1',
          wordCount: 620,
        },
        ...prev,
      ]);
    } else if (section === 'listening') {
      setListeningSets((prev) => [
        {
          id: `ls-${Date.now()}`,
          title,
          category: 'Official-Style Library',
          accent: sub,
          difficulty: 'Standard',
          durationMinutes: 30,
        },
        ...prev,
      ]);
    } else if (section === 'writing') {
      setWritingTasks((prev) => [
        {
          id: `wr-${Date.now()}`,
          title,
          taskNumber: 2,
          category: sub,
          difficulty: 'Standard',
          minWords: 250,
        },
        ...prev,
      ]);
    } else if (section === 'speaking') {
      setSpeakingTopics((prev) => [
        {
          id: `sp-${Date.now()}`,
          title,
          category: sub,
          difficulty: 'Standard',
          durationLabel: '11-14 min',
        },
        ...prev,
      ]);
    } else if (section === 'vocabulary') {
      setVocabWords((prev) => [
        {
          id: `v-${Date.now()}`,
          word: title,
          pos: 'adjective',
          ipa: '/demo/',
          category: 'Academic Core',
          band: '7.5+',
          definition: sub,
        },
        ...prev,
      ]);
    }

    setFormTitle('');
    setFormSub('');
    setAddModalOpen(false);
    showToast('Record created in Admin Demo Store', 'success');
  };

  const renderSidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div
        style={{
          height: 68,
          padding: '0 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              width: 30,
              height: 30,
              borderRadius: 9,
              backgroundColor: 'var(--dark-section)',
              color: 'var(--accent-yellow)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.85rem',
            }}
          >
            IU
          </span>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.96rem' }}>IELTS Ultimate</div>
            <div className="text-xs text-muted">Admin Console</div>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-ghost btn-icon admin-mobile-close"
          onClick={() => setMobileMenu(false)}
          aria-label="Close admin nav"
        >
          <X size={18} />
        </button>
      </div>

      <nav style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: 3 }}>
        {ADMIN_NAV_ITEMS.map((item) => {
          const Icon = ADMIN_ICONS[item.icon] || LayoutDashboard;
          const active = section === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setSection(item.id);
                setSearch('');
                setMobileMenu(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 12px',
                borderRadius: 10,
                fontSize: '0.85rem',
                fontWeight: active ? 600 : 500,
                backgroundColor: active ? 'var(--surface)' : 'transparent',
                border: active ? '1px solid var(--border)' : '1px solid transparent',
                color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                textAlign: 'left',
              }}
            >
              <Icon size={16} style={{ color: active ? 'var(--accent-purple)' : 'inherit' }} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div style={{ padding: 12, borderTop: '1px solid var(--border)' }}>
        <Link href="/dashboard" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
          <ArrowLeft size={14} /> Student Dashboard
        </Link>
      </div>
    </div>
  );

  const canCreate = [
    'students',
    'teachers',
    'mock-tests',
    'reading',
    'listening',
    'writing',
    'speaking',
    'vocabulary',
  ].includes(section);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Desktop Admin Sidebar */}
      <aside
        className="admin-sidebar"
        style={{
          width: 252,
          borderRight: '1px solid var(--border)',
          backgroundColor: 'var(--bg-primary)',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 50,
        }}
      >
        {renderSidebarContent()}
      </aside>

      {/* Mobile Drawer */}
      {mobileMenu && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 90, display: 'flex' }}>
          <div onClick={() => setMobileMenu(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} />
          <div style={{ position: 'relative', width: 260, background: 'var(--bg-primary)', zIndex: 1 }}>
            {renderSidebarContent()}
          </div>
        </div>
      )}

      <div className="admin-main" style={{ flex: 1, marginLeft: 252, minWidth: 0 }}>
        <header
          style={{
            minHeight: 68,
            height: 'auto',
            padding: '10px clamp(12px, 2.5vw, 24px)',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
            backgroundColor: 'var(--bg-primary)',
            position: 'sticky',
            top: 0,
            zIndex: 40,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', minWidth: 0 }}>
            <button
              type="button"
              className="btn btn-secondary btn-icon admin-mobile-open"
              onClick={() => setMobileMenu(true)}
              aria-label="Open menu"
            >
              <Menu size={17} />
            </button>
            <Badge variant="dark">Admin Demo Console</Badge>
            <span className="text-xs text-muted admin-subtitle">Frontend CRUD demonstration (Local JSON + State)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <Link href="/" className="btn btn-ghost btn-sm">
              Public Site
            </Link>
            <Link href="/dashboard" className="btn btn-secondary btn-sm">
              Exit to Student View
            </Link>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => {
                logout();
                router.replace('/login?role=admin');
              }}
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </header>

        <main className="admin-main-inner" style={{ padding: 'clamp(14px, 2.5vw, 24px) clamp(12px, 2.5vw, 20px)', maxWidth: 1450, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <PageHeader
            title={ADMIN_NAV_ITEMS.find((n) => n.id === section)?.label || 'Admin Overview'}
            description="Manage platform students, educators, exam modules, community moderation, and analytics."
            actions={
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', maxWidth: '100%' }}>
                {canCreate && (
                  <>
                    <SearchBar value={search} onChange={setSearch} placeholder="Filter records..." style={{ width: 200 }} />
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => setAddModalOpen(true)}>
                      <Plus size={14} /> Add New
                    </button>
                  </>
                )}
              </div>
            }
          />

          {/* 1. Overview & Analytics */}
          {(section === 'overview' || section === 'analytics') && (
            <>
              <div className="grid-4">
                <StatCard label="Active Students" value={adminAnalytics.summaryMetrics.activeStudents.toLocaleString()} icon={Users} dark />
                <StatCard label="Verified Teachers" value={teachers.length + 56} icon={GraduationCap} />
                <StatCard label="Completed Mocks" value={adminAnalytics.summaryMetrics.mockTestsCompleted.toLocaleString()} icon={Award} />
                <StatCard label="Monthly Revenue" value={adminAnalytics.summaryMetrics.monthlyRecurringRevenue} icon={CreditCard} />
              </div>

              <div className="grid-2">
                <div className="card">
                  <h2 className="h3" style={{ marginBottom: 12 }}>Monthly Student & Test Growth</h2>
                  {chartsMounted ? (
                    <div style={{ height: 240 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={adminAnalytics.monthlyGrowth}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E9E6DC" vertical={false} />
                          <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#77766F' }} />
                          <YAxis tick={{ fontSize: 12, fill: '#77766F' }} />
                          <Tooltip />
                          <Line type="monotone" dataKey="students" stroke="#8867B8" strokeWidth={2.5} />
                          <Line type="monotone" dataKey="tests" stroke="#F6BD28" strokeWidth={2.5} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="skeleton" style={{ height: 240 }} />
                  )}
                </div>

                <div className="card">
                  <h2 className="h3" style={{ marginBottom: 12 }}>Module Practice Popularity</h2>
                  {chartsMounted ? (
                    <div style={{ height: 240 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={adminAnalytics.modulePopularity}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E9E6DC" vertical={false} />
                          <XAxis dataKey="module" tick={{ fontSize: 12, fill: '#77766F' }} />
                          <YAxis tick={{ fontSize: 12, fill: '#77766F' }} />
                          <Tooltip />
                          <Bar dataKey="sessions" fill="#242424" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="skeleton" style={{ height: 240 }} />
                  )}
                </div>
              </div>
            </>
          )}

          {/* 2. Students CRUD */}
          {section === 'students' && (
            <DataTable
              data={adminStudents.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))}
              columns={[
                { key: 'name', label: 'Student' },
                { key: 'country', label: 'Country' },
                { key: 'track', label: 'Track' },
                { key: 'currentBand', label: 'Band' },
                { key: 'plan', label: 'Plan' },
                {
                  key: 'status',
                  label: 'Status',
                  render: (r) => <Badge variant={r.status === 'Active' ? 'success' : 'neutral'}>{r.status}</Badge>,
                },
                {
                  key: 'actions',
                  label: 'Actions',
                  render: (r) => (
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => {
                        setAdminStudents((prev) => prev.filter((x) => x.id !== r.id));
                        showToast(`Removed ${r.name}`, 'info');
                      }}
                    >
                      <Trash2 size={14} color="var(--error)" />
                    </button>
                  ),
                },
              ]}
            />
          )}

          {/* 3. Teachers CRUD */}
          {section === 'teachers' && (
            <DataTable
              data={teachers.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()))}
              columns={[
                { key: 'name', label: 'Instructor' },
                { key: 'title', label: 'Specialty' },
                { key: 'country', label: 'Location' },
                { key: 'hourlyRate', label: 'Rate' },
                {
                  key: 'actions',
                  label: 'Remove',
                  render: (r) => (
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => setTeachers((prev) => prev.filter((x) => x.id !== r.id))}
                    >
                      <Trash2 size={14} color="var(--error)" />
                    </button>
                  ),
                },
              ]}
            />
          )}

          {/* 4. Mock Tests CRUD */}
          {section === 'mock-tests' && (
            <DataTable
              data={mocks.filter((m) => m.title.toLowerCase().includes(search.toLowerCase()))}
              columns={[
                { key: 'title', label: 'Mock Test' },
                { key: 'track', label: 'Track' },
                { key: 'difficulty', label: 'Difficulty' },
                { key: 'durationLabel', label: 'Duration' },
                {
                  key: 'actions',
                  label: 'Delete',
                  render: (r) => (
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => setMocks((prev) => prev.filter((x) => x.id !== r.id))}
                    >
                      <Trash2 size={14} color="var(--error)" />
                    </button>
                  ),
                },
              ]}
            />
          )}

          {/* 5. Reading Passages CRUD */}
          {section === 'reading' && (
            <DataTable
              data={passages.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))}
              columns={[
                { key: 'title', label: 'Passage Title' },
                { key: 'category', label: 'Category' },
                { key: 'partLabel', label: 'Part' },
                { key: 'wordCount', label: 'Words' },
                {
                  key: 'actions',
                  label: 'Delete',
                  render: (r) => (
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => setPassages((prev) => prev.filter((x) => x.id !== r.id))}
                    >
                      <Trash2 size={14} color="var(--error)" />
                    </button>
                  ),
                },
              ]}
            />
          )}

          {/* 6. Listening CRUD */}
          {section === 'listening' && (
            <DataTable
              data={listeningSets.filter((l) => l.title.toLowerCase().includes(search.toLowerCase()))}
              columns={[
                { key: 'title', label: 'Listening Set' },
                { key: 'category', label: 'Collection' },
                { key: 'accent', label: 'Accent' },
                { key: 'durationMinutes', label: 'Minutes' },
                {
                  key: 'actions',
                  label: 'Delete',
                  render: (r) => (
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => setListeningSets((prev) => prev.filter((x) => x.id !== r.id))}
                    >
                      <Trash2 size={14} color="var(--error)" />
                    </button>
                  ),
                },
              ]}
            />
          )}

          {/* 7. Writing CRUD */}
          {section === 'writing' && (
            <DataTable
              data={writingTasks.filter((w) => w.title.toLowerCase().includes(search.toLowerCase()))}
              columns={[
                { key: 'title', label: 'Writing Task' },
                { key: 'taskNumber', label: 'Task #' },
                { key: 'category', label: 'Category' },
                { key: 'minWords', label: 'Min Words' },
                {
                  key: 'actions',
                  label: 'Delete',
                  render: (r) => (
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => setWritingTasks((prev) => prev.filter((x) => x.id !== r.id))}
                    >
                      <Trash2 size={14} color="var(--error)" />
                    </button>
                  ),
                },
              ]}
            />
          )}

          {/* 8. Speaking CRUD */}
          {section === 'speaking' && (
            <DataTable
              data={speakingTopics.filter((s) => s.title.toLowerCase().includes(search.toLowerCase()))}
              columns={[
                { key: 'title', label: 'Topic Title' },
                { key: 'category', label: 'Section' },
                { key: 'difficulty', label: 'Difficulty' },
                { key: 'durationLabel', label: 'Duration' },
                {
                  key: 'actions',
                  label: 'Delete',
                  render: (r) => (
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => setSpeakingTopics((prev) => prev.filter((x) => x.id !== r.id))}
                    >
                      <Trash2 size={14} color="var(--error)" />
                    </button>
                  ),
                },
              ]}
            />
          )}

          {/* 9. Vocabulary CRUD */}
          {section === 'vocabulary' && (
            <DataTable
              data={vocabWords.filter((v) => v.word.toLowerCase().includes(search.toLowerCase()))}
              columns={[
                { key: 'word', label: 'Word' },
                { key: 'pos', label: 'POS' },
                { key: 'category', label: 'Collection' },
                { key: 'band', label: 'Band' },
                {
                  key: 'actions',
                  label: 'Delete',
                  render: (r) => (
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => setVocabWords((prev) => prev.filter((x) => x.id !== r.id))}
                    >
                      <Trash2 size={14} color="var(--error)" />
                    </button>
                  ),
                },
              ]}
            />
          )}

          {/* 10. Community Moderation */}
          {section === 'community' && (
            <DataTable
              data={modPosts}
              columns={[
                { key: 'title', label: 'Post Title' },
                { key: 'category', label: 'Category' },
                { key: 'likes', label: 'Likes' },
                {
                  key: 'actions',
                  label: 'Moderate',
                  render: (r) => (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => showToast(`Approved "${r.title}"`, 'success')}
                      >
                        <CheckCircle2 size={13} /> Approve
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => setRemovedPostIds((prev) => [...prev, r.id])}
                      >
                        Remove
                      </button>
                    </div>
                  ),
                },
              ]}
            />
          )}

          {/* 11. Subscriptions */}
          {section === 'subscriptions' && (
            <DataTable
              data={adminStudents}
              columns={[
                { key: 'name', label: 'Student' },
                { key: 'email', label: 'Email' },
                {
                  key: 'plan',
                  label: 'Subscription Tier',
                  render: (r) => <Badge variant={r.plan === 'Free Plan' ? 'neutral' : 'yellow'}>{r.plan}</Badge>,
                },
                {
                  key: 'action',
                  label: 'Toggle Plus (Demo)',
                  render: (r) => (
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setAdminStudents((prev) =>
                          prev.map((s) =>
                            s.id === r.id ? { ...s, plan: s.plan === 'Free Plan' ? 'Plus' : 'Free Plan' } : s
                          )
                        );
                        showToast(`Updated ${r.name}'s tier`, 'success');
                      }}
                    >
                      Switch Plan
                    </button>
                  ),
                },
              ]}
            />
          )}

          {/* 12. Platform Settings */}
          {section === 'settings' && (
            <div className="card" style={{ maxWidth: 620, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="field-group">
                <label className="field-label" htmlFor="adm-site">Platform Name</label>
                <input
                  id="adm-site"
                  className="input"
                  value={platformSettings.siteTitle}
                  onChange={(e) => setPlatformSettings((p) => ({ ...p, siteTitle: e.target.value }))}
                />
              </div>
              <div className="field-group">
                <label className="field-label" htmlFor="adm-dur">Default Full Mock Duration (Minutes)</label>
                <input
                  id="adm-dur"
                  type="number"
                  className="input"
                  value={platformSettings.defaultMockMinutes}
                  onChange={(e) => setPlatformSettings((p) => ({ ...p, defaultMockMinutes: Number(e.target.value) }))}
                />
              </div>
              <button
                type="button"
                className="btn btn-primary"
                style={{ alignSelf: 'flex-start' }}
                onClick={() => showToast('Admin settings saved locally', 'success')}
              >
                Save Platform Config
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Add Record Modal */}
      <Modal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title={`Add New Entry (${section})`}
        subtitle="Creates a temporary demo entry in local state."
      >
        <form onSubmit={handleAddRecord} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="field-group">
            <label className="field-label" htmlFor="adm-title">Name / Title / Word</label>
            <input
              id="adm-title"
              className="input"
              required
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="Enter title or name..."
            />
          </div>
          <div className="field-group">
            <label className="field-label" htmlFor="adm-sub">Category / Country / Definition</label>
            <input
              id="adm-sub"
              className="input"
              value={formSub}
              onChange={(e) => setFormSub(e.target.value)}
              placeholder="Optional secondary metadata..."
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button type="button" className="btn btn-secondary" onClick={() => setAddModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Create Entry</button>
          </div>
        </form>
      </Modal>

      <style jsx>{`
        .admin-main-inner > * {
          min-width: 0;
          max-width: 100%;
        }
        .admin-mobile-open,
        .admin-mobile-close {
          display: none;
        }
        @media (max-width: 1024px) {
          .admin-sidebar {
            display: none !important;
          }
          .admin-main {
            margin-left: 0 !important;
          }
          .admin-mobile-open,
          .admin-mobile-close {
            display: inline-flex;
          }
        }
        @media (max-width: 540px) {
          .admin-subtitle {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

