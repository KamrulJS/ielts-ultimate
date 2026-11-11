'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart, Send } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PageHeader, Badge } from '@/components/common/UiPrimitives';
import { SafeAvatar } from '@/components/common/SafeAvatar';

export function PostDetailView({ postId }) {
  const { posts, likedPosts, togglePostLike, comments, addPostComment } = useApp();
  const post = posts.find((p) => p.id === postId) || posts[0];
  const postComments = comments.filter((c) => c.postId === post.id);
  const [replyText, setReplyText] = useState('');

  const liked = likedPosts.includes(post.id);

  const submitComment = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    addPostComment(post.id, replyText.trim());
    setReplyText('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PageHeader
        title={post.title}
        description={`Posted by ${post.author.name} • ${post.createdAt}`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Community', href: '/community' },
          { label: 'Thread' },
        ]}
        actions={
          <Link href="/community" className="btn btn-secondary btn-sm">
            <ArrowLeft size={14} /> Back to Feed
          </Link>
        }
      />

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <SafeAvatar src={post.author.avatar} name={post.author.name} size={42} />
            <div>
              <div style={{ fontWeight: 700 }}>{post.author.name}</div>
              <div className="text-xs text-muted">{post.author.country} • Band {post.author.band}</div>
            </div>
          </div>
          <Badge variant="purple">{post.category}</Badge>
        </div>

        <p style={{ fontSize: '0.98rem', lineHeight: 1.7 }}>{post.content}</p>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            className={`btn btn-sm ${liked ? 'btn-danger' : 'btn-secondary'}`}
            onClick={() => togglePostLike(post.id)}
          >
            <Heart size={14} fill={liked ? 'currentColor' : 'none'} /> {post.likes} Likes
          </button>
        </div>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <h2 className="h3">Replies ({postComments.length})</h2>
        <form onSubmit={submitComment} style={{ display: 'flex', gap: 10 }}>
          <input
            className="input"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a helpful reply..."
          />
          <button type="submit" className="btn btn-primary">
            <Send size={15} /> Reply
          </button>
        </form>

        {postComments.map((c) => (
          <div key={c.id} className="card-warm card-compact" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <SafeAvatar src={c.avatar} name={c.author} size={28} />
              <span style={{ fontWeight: 700, fontSize: '0.86rem' }}>{c.author}</span>
              <span className="text-xs text-muted">• {c.createdAt}</span>
            </div>
            <p className="text-sm">{c.text}</p>
            {c.replies?.map((r) => (
              <div
                key={r.id}
                style={{
                  marginLeft: 24,
                  padding: '8px 12px',
                  borderRadius: 8,
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                }}
              >
                <div className="text-xs" style={{ fontWeight: 700 }}>{r.author} • {r.createdAt}</div>
                <p className="text-xs" style={{ marginTop: 3 }}>{r.text}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

