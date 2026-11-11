'use client';

import React from 'react';
import { Trophy, Shield, Flame, Award } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PageHeader, Badge, ProgressBar, StatCard } from '@/components/common/UiPrimitives';
import rankingsData from '@/data/leaderboard/rankings.json';

export function AchievementsView() {
  const { profile, masteredWords, testResults } = useApp();

  const milestones = [
    { title: 'Tests Completed Milestone', current: testResults.length + 15, goal: 30 },
    { title: 'Academic Words Mastered', current: masteredWords.length, goal: 36 },
    { title: 'Study Streak Goal', current: profile.streakDays, goal: 21 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <PageHeader
        title="Achievements & Milestones"
        description="Track unlocked IELTS Ultimate badges, daily streak rewards, and skill proficiency milestones."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Achievements' }]}
      />

      <div className="grid-3">
        <StatCard label="Total XP Earned" value={profile.xp.toLocaleString()} icon={Award} dark />
        <StatCard label="Current Streak" value={`${profile.streakDays} Days`} icon={Flame} />
        <StatCard label="Badges Unlocked" value={`${rankingsData.badges.filter((b) => b.unlocked).length} / ${rankingsData.badges.length}`} icon={Trophy} />
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <h2 className="h2">Active Milestones</h2>
        {milestones.map((m) => {
          const pct = Math.min(100, Math.round((m.current / m.goal) * 100));
          return (
            <div key={m.title} className="card-warm card-compact">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontWeight: 600 }}>{m.title}</span>
                <span className="text-xs text-muted">{m.current} / {m.goal}</span>
              </div>
              <ProgressBar value={pct} variant="purple" showLabel />
            </div>
          );
        })}
      </div>

      <div className="grid-3">
        {rankingsData.badges.map((b) => (
          <div key={b.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Badge variant={b.unlocked ? 'success' : 'neutral'}>{b.unlocked ? 'Completed' : b.category}</Badge>
              <Shield size={18} style={{ color: b.unlocked ? 'var(--accent-yellow)' : 'var(--text-muted)' }} />
            </div>
            <h3 className="h3">{b.title}</h3>
            <p className="text-xs text-muted">{b.description}</p>
            <ProgressBar value={b.progress} variant={b.unlocked ? 'success' : 'yellow'} small showLabel />
          </div>
        ))}
      </div>
    </div>
  );
}

