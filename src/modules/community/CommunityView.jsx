'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Heart,
  MessageCircle,
  Bookmark,
  Plus,
  Users,
  ArrowRight,
  Check,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useGsapEntrance } from '@/hooks/useGsapEntrance';
import { PageHeader, Badge } from '@/components/common/UiPrimitives';
import { SearchBar } from '@/components/common/DataControls';
import { SafeAvatar } from '@/components/common/SafeAvatar';
import { Modal } from '@/components/common/Modal';

const CATEGORIES = [
  'All',
  'Reading Strategy',
  'Writing Feedback',
  'Speaking Partners',
  'Listening Q&A',
  'Vocabulary',
  'Success Stories',
];

export function CommunityView() {
  const {
    posts,
    likedPosts,
    togglePostLike,
    addCommunityPost,
    comments,
    groups,
    toggleJoinGroup,
    bookmarks,
    toggleBookmark,
  } = useApp();
  const rootRef = useGsapEntrance('community');

  const [cat, setCat] = useState('All');
  const [search, setSearch] = useState('');
  const [composeOpen, setComposeOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCat, setNewCat] = useState('Reading Strategy');
  const [newContent, setNewContent] = useState('');

  const filteredPosts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return posts
      .filter((p) => (cat === 'All' ? true : p.category === cat))
      .filter(
        (p) =>
          !q ||
          p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q) ||
          p.author.name.toLowerCase().includes(q)
      );
  }, [posts, cat, search]);

  const handlePublish = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    addCommunityPost({
      title: newTitle.trim(),
      category: newCat,
      content: newContent.trim(),
      tags: [newCat],
    });
    setNewTitle('');
    setNewContent('');
    setComposeOpen(false);
  };

  return (
    <div ref={rootRef} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <PageHeader
        title="IELTS Ultimate Learning Community"
        description="Share essay feedback, swap speaking partner schedules, discuss reading tactics, and join cohort study groups."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Community' }]}
        actions={
          <button type="button" className="btn btn-primary" onClick={() => setComposeOpen(true)}>
            <Plus size={16} /> New Discussion
          </button>
        }
      />

      {/* Category Filter Pills & Search */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div className="filter-pills">
          {CATEGORIES.map((c) => (
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
        <SearchBar value={search} onChange={setSearch} placeholder="Search posts..." style={{ width: 220 }} />
      </div>

      {/* Main Feed + Study Groups Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(260px, 1fr)', gap: 20, alignItems: 'start' }} className="community-grid">
        {/* Feed Posts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filteredPosts.map((post) => {
            const liked = likedPosts.includes(post.id);
            const saved = bookmarks.resources.includes(post.id);
            const commentCount = comments.filter((c) => c.postId === post.id).length;

            return (
              <article key={post.id} data-animate="card" className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <SafeAvatar src={post.author.avatar} name={post.author.name} size={36} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                        {post.author.name}{' '}
                        <span className="text-xs text-muted">• Band {post.author.band}</span>
                      </div>
                      <div className="text-xs text-muted">{post.author.country} • {post.createdAt}</div>
                    </div>
                  </div>
                  <Badge variant="purple">{post.category}</Badge>
                </div>

                <Link href={`/community/post/${post.id}`} style={{ display: 'block' }}>
                  <h2 className="h3" style={{ fontSize: '1.05rem', marginBottom: 6 }}>{post.title}</h2>
                  <p className="text-sm text-muted" style={{ lineHeight: 1.6 }}>{post.content}</p>
                </Link>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => togglePostLike(post.id)}
                      style={{ color: liked ? 'var(--error)' : 'var(--text-secondary)' }}
                    >
                      <Heart size={15} fill={liked ? 'var(--error)' : 'none'} /> {post.likes}
                    </button>
                    <Link href={`/community/post/${post.id}`} className="btn btn-ghost btn-sm">
                      <MessageCircle size={15} /> {commentCount} Replies
                    </Link>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => toggleBookmark('resources', post.id, 'Saved Posts')}
                    >
                      <Bookmark size={15} fill={saved ? 'var(--accent-yellow)' : 'none'} color={saved ? '#B48200' : 'var(--text-secondary)'} />
                    </button>
                  </div>
                  <Link href={`/community/post/${post.id}`} className="text-xs" style={{ fontWeight: 600, color: 'var(--accent-purple)' }}>
                    Open Thread →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* Study Groups Column */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Users size={18} style={{ color: 'var(--accent-purple)' }} />
              <h2 className="h3">Active Study Groups</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {groups.map((grp) => (
                <div key={grp.id} className="card-warm card-compact" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <Link href={`/community/groups/${grp.id}`} style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                      {grp.name}
                    </Link>
                    <Badge variant="neutral">{grp.members}</Badge>
                  </div>
                  <p className="text-xs text-muted">{grp.focus}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
                    <button
                      type="button"
                      onClick={() => toggleJoinGroup(grp.id)}
                      className={`btn btn-sm ${grp.joined ? 'btn-secondary' : 'btn-primary'}`}
                    >
                      {grp.joined ? <><Check size={13} /> Joined</> : 'Join Group'}
                    </button>
                    <Link href={`/community/groups/${grp.id}`} className="text-xs" style={{ fontWeight: 600 }}>
                      Details <ArrowRight size={12} style={{ display: 'inline' }} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Create Post Modal */}
      <Modal open={composeOpen} onClose={() => setComposeOpen(false)} title="Create Community Post" subtitle="Ask a question, share tips, or find a study partner.">
        <form onSubmit={handlePublish} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="field-group">
            <label className="field-label" htmlFor="post-cat">Category</label>
            <select id="post-cat" className="select" value={newCat} onChange={(e) => setNewCat(e.target.value)}>
              {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="field-group">
            <label className="field-label" htmlFor="post-title">Title</label>
            <input
              id="post-title"
              className="input"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Summarise your question or tip..."
            />
          </div>
          <div className="field-group">
            <label className="field-label" htmlFor="post-body">Details</label>
            <textarea
              id="post-body"
              className="textarea"
              rows={4}
              required
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Share details, essay excerpts, or study schedule..."
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button type="button" className="btn btn-secondary" onClick={() => setComposeOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Publish Post</button>
          </div>
        </form>
      </Modal>

      <style jsx>{`
        @media (max-width: 960px) {
          .community-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

