'use client';

import React, { useState, useMemo } from 'react';
import { Swords, Trophy, Zap, CheckCircle2, XCircle, Shield } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useGsapEntrance } from '@/hooks/useGsapEntrance';
import { PageHeader, Badge, StatCard, ProgressBar } from '@/components/common/UiPrimitives';
import { SafeAvatar } from '@/components/common/SafeAvatar';
import { Modal } from '@/components/common/Modal';
import rankingsData from '@/data/leaderboard/rankings.json';

export function BandBattleView() {
  const { profile, showToast } = useApp();
  const rootRef = useGsapEntrance('band-battle');

  const [tab, setTab] = useState('leaderboard'); // leaderboard | history | badges
  const [scope, setScope] = useState('global'); // global | weekly | friends
  const [history, setHistory] = useState(rankingsData.battleHistory);

  // Live 1v1 Battle State
  const [opponent, setOpponent] = useState(null);
  const [battleStage, setBattleStage] = useState('idle'); // idle | active | result
  const [qIndex, setQIndex] = useState(0);
  const [myScore, setMyScore] = useState(0);
  const [oppScore, setOppScore] = useState(0);
  const [lastFeedback, setLastFeedback] = useState(null);

  const filteredRankings = useMemo(() => {
    const list = rankingsData.rankings.filter((r) => {
      if (scope === 'friends') return r.isFriend;
      if (scope === 'weekly') return r.scope === 'weekly' || r.xp > 1000;
      return true;
    });
    return [...list].sort((a, b) => b.xp - a.xp);
  }, [scope]);

  const startBattleWith = (opp) => {
    setOpponent(opp);
    setBattleStage('active');
    setQIndex(0);
    setMyScore(0);
    setOppScore(0);
    setLastFeedback(null);
  };

  const answerBattleQuestion = (opt) => {
    const q = rankingsData.battleQuestions[qIndex];
    const isRight = opt === q.answer;
    const nextMy = myScore + (isRight ? 1 : 0);
    // Deterministic simulated opponent accuracy (~75%)
    const oppGotIt = (qIndex + (opponent?.name?.length || 2)) % 4 !== 0;
    const nextOpp = oppScore + (oppGotIt ? 1 : 0);

    setMyScore(nextMy);
    setOppScore(nextOpp);
    setLastFeedback(isRight ? 'Correct! +1 point' : `Answer was: ${q.answer}`);

    setTimeout(() => {
      setLastFeedback(null);
      if (qIndex + 1 < rankingsData.battleQuestions.length) {
        setQIndex(qIndex + 1);
      } else {
        setBattleStage('result');
        const won = nextMy >= nextOpp;
        setHistory((prev) => [
          {
            id: `bh-${Date.now()}`,
            opponent: opponent.name,
            topic: '5-Question Mixed IELTS Sprint',
            myScore: nextMy,
            oppScore: nextOpp,
            result: won ? 'Won' : 'Lost',
            xpEarned: won ? '+60 XP' : '+20 XP',
            date: 'Just now',
          },
          ...prev,
        ]);
        showToast(won ? `Battle won vs ${opponent.name}!` : `Battle finished vs ${opponent.name}`, won ? 'success' : 'info');
      }
    }, 650);
  };

  const currentQuestion = rankingsData.battleQuestions[qIndex];

  return (
    <div ref={rootRef} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <PageHeader
        title="IELTS Band Battle Arena"
        description="Challenge peers to rapid 5-question vocabulary, reading, and strategy duels to climb the global leaderboard."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Band Battle' }]}
        actions={
          <button
            type="button"
            className="btn btn-accent"
            onClick={() => startBattleWith(rankingsData.rankings[4])}
          >
            <Swords size={16} /> Quick 1v1 Battle
          </button>
        }
      />

      <div className="grid-3">
        <StatCard label="Your XP" value={profile.xp.toLocaleString()} hint="Climb top 5 weekly" icon={Zap} dark />
        <StatCard label="Battle Record" value={`${history.filter((h) => h.result === 'Won').length} Wins`} hint={`Across ${history.length} matches`} icon={Swords} />
        <StatCard label="Unlocked Badges" value={`${rankingsData.badges.filter((b) => b.unlocked).length} / ${rankingsData.badges.length}`} hint="Earn more via streaks & battles" icon={Trophy} />
      </div>

      {/* Main Navigation Tabs */}
      <div className="tabs-list">
        {[
          { id: 'leaderboard', label: 'Leaderboards' },
          { id: 'history', label: 'Battle History', count: history.length },
          { id: 'badges', label: 'Achievements & Badges' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            className={`tab-trigger ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            <span>{t.label}</span>
            {t.count !== undefined && <span className="text-xs text-muted">({t.count})</span>}
          </button>
        ))}
      </div>

      {tab === 'leaderboard' && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <div className="filter-pills">
              {[
                { id: 'global', label: 'Global Leaderboard' },
                { id: 'weekly', label: 'Weekly Sprint' },
                { id: 'friends', label: 'Friends' },
              ].map((sc) => (
                <button
                  key={sc.id}
                  type="button"
                  className={`filter-pill ${scope === sc.id ? 'active' : ''}`}
                  onClick={() => setScope(sc.id)}
                >
                  {sc.label}
                </button>
              ))}
            </div>
            <span className="text-xs text-muted">Click Challenge to start a live 5-question duel</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filteredRankings.map((student, idx) => (
              <div
                key={student.id}
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  padding: '12px 14px',
                  borderRadius: 12,
                  border: student.isCurrentUser ? '1.5px solid var(--accent-purple)' : '1px solid var(--border)',
                  backgroundColor: student.isCurrentUser ? 'var(--accent-purple-soft)' : 'var(--bg-primary)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 26, fontWeight: 800, color: idx < 3 ? 'var(--accent-purple)' : 'var(--text-secondary)' }}>
                    #{idx + 1}
                  </span>
                  <SafeAvatar src={student.avatar} name={student.name} size={38} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>
                      {student.name} {student.isCurrentUser && <Badge variant="purple">You</Badge>}
                    </div>
                    <div className="text-xs text-muted">
                      {student.country} • Band {student.band} • {student.streak}d streak
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700 }}>{student.xp.toLocaleString()} XP</div>
                    <div className="text-xs text-muted">{student.wins}W - {student.losses}L</div>
                  </div>
                  {!student.isCurrentUser && (
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => startBattleWith(student)}
                    >
                      <Swords size={14} /> Challenge
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {history.map((h) => (
            <div key={h.id} className="card card-compact" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div style={{ fontWeight: 700 }}>{h.topic} vs {h.opponent}</div>
                <div className="text-xs text-muted">{h.date} • Score: {h.myScore} - {h.oppScore}</div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Badge variant="yellow">{h.xpEarned}</Badge>
                <Badge variant={h.result === 'Won' ? 'success' : 'error'}>{h.result}</Badge>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'badges' && (
        <div className="grid-3">
          {rankingsData.badges.map((b) => (
            <div key={b.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Badge variant={b.unlocked ? 'success' : 'neutral'}>{b.unlocked ? 'Unlocked' : b.category}</Badge>
                <Shield size={18} style={{ color: b.unlocked ? 'var(--accent-yellow)' : 'var(--text-muted)' }} />
              </div>
              <h3 className="h3">{b.title}</h3>
              <p className="text-xs text-muted">{b.description}</p>
              <ProgressBar value={b.progress} variant={b.unlocked ? 'success' : 'purple'} small showLabel />
            </div>
          ))}
        </div>
      )}

      {/* 1-on-1 Live Quiz Battle Modal */}
      <Modal
        open={battleStage !== 'idle'}
        onClose={() => setBattleStage('idle')}
        title={opponent ? `Band Battle vs ${opponent.name}` : 'Band Battle'}
        subtitle="5 rapid questions • Speed & accuracy count"
      >
        {battleStage === 'active' && currentQuestion && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div
              className="card-warm card-compact"
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div>
                <div className="text-xs text-muted">You</div>
                <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>{myScore}</div>
              </div>
              <Badge variant="dark">Q{qIndex + 1} / {rankingsData.battleQuestions.length}</Badge>
              <div style={{ textAlign: 'right' }}>
                <div className="text-xs text-muted">{opponent?.name}</div>
                <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>{oppScore}</div>
              </div>
            </div>

            <h3 className="h3">{currentQuestion.prompt}</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {currentQuestion.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  disabled={Boolean(lastFeedback)}
                  onClick={() => answerBattleQuestion(opt)}
                  className="btn btn-secondary"
                  style={{ justifyContent: 'flex-start' }}
                >
                  {opt}
                </button>
              ))}
            </div>

            {lastFeedback && (
              <div className="badge badge-yellow" style={{ justifyContent: 'center', padding: '8px 12px' }}>
                {lastFeedback}
              </div>
            )}
          </div>
        )}

        {battleStage === 'result' && (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            {myScore >= oppScore ? (
              <CheckCircle2 size={44} color="var(--success)" />
            ) : (
              <XCircle size={44} color="var(--error)" />
            )}
            <h2 className="h2">
              {myScore >= oppScore ? 'Victory!' : 'Close Match!'} ({myScore} – {oppScore})
            </h2>
            <p className="text-sm text-muted">
              Your match has been logged in Battle History and XP added to your profile.
            </p>
            <button type="button" className="btn btn-primary" onClick={() => setBattleStage('idle')}>
              Done
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

