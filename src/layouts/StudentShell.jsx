'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { AppSidebar } from '@/components/navigation/AppSidebar';
import { MobileNavigation } from '@/components/navigation/MobileNavigation';
import { DashboardHeader } from '@/components/navigation/DashboardHeader';
import { RightUtilityPanel } from '@/components/dashboard/RightUtilityPanel';
import { GlobalSearchModal } from '@/components/modals/GlobalSearchModal';

export function StudentShell({ children, showUtilityPanel = false }) {
  const { sidebarCollapsed } = useApp();

  return (
    <div className="app-shell">
      <AppSidebar />
      <MobileNavigation />
      <div className={`app-main-wrapper ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <DashboardHeader />
        <main className="app-content-grid">
          <div className="app-main-column">{children}</div>
          {showUtilityPanel && <RightUtilityPanel />}
        </main>
      </div>
      <GlobalSearchModal />
    </div>
  );
}

