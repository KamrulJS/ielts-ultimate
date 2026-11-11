'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BarChart3,
  Award,
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  Layers,
  CalendarCheck,
  Sparkles,
  MessageSquareQuote,
  Wrench,
  Swords,
  Users,
  GraduationCap,
  Gift,
  UserCog,
  Bookmark,
  Trophy,
  HelpCircle,
  PanelLeftClose,
  PanelLeftOpen,
  Zap,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { STUDENT_NAV_GROUPS } from '@/lib/navigation';
import { useApp } from '@/context/AppContext';
import { SafeAvatar } from '@/components/common/SafeAvatar';
import styles from './Sidebar.module.css';

const ICON_MAP = {
  LayoutDashboard,
  BarChart3,
  Award,
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  Layers,
  CalendarCheck,
  Sparkles,
  MessageSquareQuote,
  Wrench,
  Swords,
  Users,
  GraduationCap,
  Gift,
  UserCog,
  Bookmark,
  Trophy,
  HelpCircle,
};

export function BrandLogo({ collapsed = false }) {
  return (
    <Link href="/dashboard" className={styles.brandLink}>
      <span className={styles.brandMark} aria-hidden="true">
        <Sparkles size={16} strokeWidth={2.4} />
      </span>
      {!collapsed && <span>IELTSWIST</span>}
    </Link>
  );
}

export function SidebarNavContent({ collapsed = false, onNavigate }) {
  const pathname = usePathname();

  return (
    <div className={styles.navScroll}>
      {STUDENT_NAV_GROUPS.map((group) => (
        <div key={group.label}>
          {!collapsed && <div className={styles.groupLabel}>{group.label}</div>}
          <nav className={styles.navList} aria-label={group.label}>
            {group.items.map((item) => {
              const Icon = ICON_MAP[item.icon] || LayoutDashboard;
              const isActive =
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`) ||
                item.matchPaths?.some((p) => pathname === p || pathname.startsWith(`${p}/`));

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={onNavigate}
                  title={collapsed ? item.label : undefined}
                  className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                  style={collapsed ? { justifyContent: 'center', padding: '10px' } : undefined}
                >
                  <Icon
                    size={18}
                    className={isActive ? styles.navIconActive : ''}
                    style={{ flexShrink: 0 }}
                  />
                  {!collapsed && <span>{item.label}</span>}
                  {!collapsed && item.badge && <span className={styles.navBadge}>{item.badge}</span>}
                  {!collapsed && item.dot && <span className={styles.navDot} />}
                </Link>
              );
            })}
          </nav>
        </div>
      ))}

      {!collapsed && (
        <div>
          <div className={styles.groupLabel}>Workspace</div>
          <Link href="/admin" onClick={onNavigate} className={styles.navItem}>
            <ShieldCheck size={18} style={{ flexShrink: 0 }} />
            <span>Admin Console</span>
          </Link>
        </div>
      )}
    </div>
  );
}

export function AppSidebar() {
  const { profile, sidebarCollapsed, setSidebarCollapsed } = useApp();

  return (
    <aside
      className={`${styles.sidebar} ${sidebarCollapsed ? styles.sidebarCollapsed : ''}`}
      aria-label="Primary sidebar navigation"
    >
      <div className={styles.brandRow} style={sidebarCollapsed ? { justifyContent: 'center', padding: '0 8px' } : undefined}>
        <BrandLogo collapsed={sidebarCollapsed} />
        {!sidebarCollapsed && (
          <button
            type="button"
            className={styles.collapseBtn}
            onClick={() => setSidebarCollapsed(true)}
            aria-label="Collapse sidebar"
            title="Collapse sidebar"
          >
            <PanelLeftClose size={15} />
          </button>
        )}
      </div>

      {sidebarCollapsed && (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10 }}>
          <button
            type="button"
            className={styles.collapseBtn}
            onClick={() => setSidebarCollapsed(false)}
            aria-label="Expand sidebar"
            title="Expand sidebar"
          >
            <PanelLeftOpen size={15} />
          </button>
        </div>
      )}

      <SidebarNavContent collapsed={sidebarCollapsed} />

      <div className={styles.sidebarFooter}>
        {!sidebarCollapsed && (
          <div className={styles.upgradeCard}>
            <span className={styles.upgradeIconBadge}>
              <Zap size={14} strokeWidth={2.5} />
            </span>
            <div className={styles.upgradeTitle}>Level up your Band with Plus</div>
            <Link href="/subscription" className={styles.upgradeBtn}>
              <span>Upgrade Now</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        )}

        <Link
          href="/profile"
          className={styles.profileChip}
          style={sidebarCollapsed ? { justifyContent: 'center', padding: 6 } : undefined}
          title={profile.name}
        >
          <SafeAvatar src={profile.avatar} name={profile.name} size={34} />
          {!sidebarCollapsed && (
            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {profile.name}
              </div>
              <div className="text-xs text-muted">
                Target {profile.targetBand} • {profile.plan}
              </div>
            </div>
          )}
        </Link>
      </div>
    </aside>
  );
}

