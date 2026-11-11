'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import { PageHeader, Badge, EmptyState } from '@/components/common/UiPrimitives';
import collections from '@/data/reading/collections.json';

export function ReadingCollectionView({ collectionId }) {
  const collection = collections.find((c) => c.id === collectionId) || collections[0];

  if (!collection) {
    return (
      <EmptyState
        icon={BookOpen}
        title="Collection not found"
        action={<Link href="/reading" className="btn btn-primary">Back to Reading</Link>}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PageHeader
        title={collection.title}
        description={collection.description}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Reading', href: '/reading' },
          { label: collection.title },
        ]}
        badge={<Badge variant="purple">{collection.category}</Badge>}
        actions={
          <Link href="/reading" className="btn btn-secondary btn-sm">
            <ArrowLeft size={14} /> Reading Library
          </Link>
        }
      />

      <div className="grid-2">
        {collection.tests.map((test, idx) => (
          <div key={test.id + idx} className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Badge variant="yellow">{test.label}</Badge>
              <span className="text-xs text-muted" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <Clock size={13} /> {test.duration} min • {test.questionsCount} questions
              </span>
            </div>
            <h3 className="h3">{test.topic}</h3>
            <p className="text-xs text-muted">Difficulty: {test.difficulty}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
              {test.completedScore ? (
                <Badge variant="success">Last score: {test.completedScore}</Badge>
              ) : (
                <span className="text-xs text-muted">Not attempted yet</span>
              )}
              <Link href={`/reading/test/${test.id}`} className="btn btn-primary btn-sm">
                Start Test <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

