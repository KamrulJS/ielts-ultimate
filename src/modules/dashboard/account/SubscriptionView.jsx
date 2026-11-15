'use client';
import styles from './SubscriptionView.module.css';

import React, { useState } from 'react';
import { CheckCircle2, Zap } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PageHeader, Badge } from '@/components/common/UiPrimitives';
import { DataTable } from '@/components/common/DataControls';
import plansData from '@/data/subscription/plans.json';

export function SubscriptionView() {
  const { profile, updateProfile, showToast } = useApp();
  const [annual, setAnnual] = useState(true);

  const selectPlan = (planName) => {
    updateProfile({ plan: planName });
    showToast(`Switched to ${planName} (demo billing preview)`, 'success');
  };

  return (
    <div className={styles.subs_div_1}>
      <PageHeader
        title="Subscription & Plans"
        description="Compare IELTS Ultimate study tiers and manage your membership (frontend billing demonstration)."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Subscription' }]}
        actions={
          <div className="tabs-list">
            <button type="button" className={`tab-trigger ${!annual ? 'active' : ''}`} onClick={() => setAnnual(false)}>
              Monthly
            </button>
            <button type="button" className={`tab-trigger ${annual ? 'active' : ''}`} onClick={() => setAnnual(true)}>
              Annual (Save 25%)
            </button>
          </div>
        }
      />

      <div className="grid-3">
        {plansData.plans.map((pl) => {
          const isCurrent = profile.plan.toLowerCase().includes(pl.id) || (pl.id === 'free' && profile.plan === 'Free Plan');
          const price = annual ? pl.priceAnnual : pl.priceMonthly;
          return (
            <div
              key={pl.id}
              className={`${pl.highlight ? 'card-dark' : 'card'} ${styles.subs_div_2}`}
              
            >
              <div className={styles.subs_div_3}>
                <span className={styles.subs_span_4}>{pl.name}</span>
                <Badge variant={pl.highlight ? 'yellow' : 'purple'}>{isCurrent ? 'Active' : pl.badge}</Badge>
              </div>
              <div className={styles.subs_div_5}>
                ${price}
                <span className={`text-xs ${styles.subs_span_6}`} > / month</span>
              </div>
              <p className={`text-xs ${styles.subs_p_7}`} >{pl.description}</p>
              <ul className={styles.subs_ul_8}>
                {pl.features.map((f) => (
                  <li key={f} className={`text-xs ${styles.subs_li_9}`} >
                    <CheckCircle2 size={14} style={{ color: pl.highlight ? 'var(--accent-yellow)' : 'var(--success)', flexShrink: 0 }} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                disabled={isCurrent}
                onClick={() => selectPlan(pl.name)}
                className={`btn ${pl.highlight ? 'btn-accent' : 'btn-primary'} ${styles.subs_button_10}`}
                
              >
                <Zap size={14} /> {isCurrent ? 'Current Plan' : `Choose ${pl.name}`}
              </button>
            </div>
          );
        })}
      </div>

      <div className={styles.subs_div_11}>
        <h2 className={`h2 ${styles.subs_h2_12}`} >Billing History</h2>
        <DataTable
          data={plansData.billingHistory}
          columns={[
            { key: 'id', label: 'Invoice' },
            { key: 'date', label: 'Date' },
            { key: 'plan', label: 'Plan' },
            { key: 'amount', label: 'Amount' },
            {
              key: 'status',
              label: 'Status',
              render: (r) => <Badge variant="success">{r.status}</Badge>,
            },
          ]}
        />
      </div>
    </div>
  );
}

