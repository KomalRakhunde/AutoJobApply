'use client';

import { PageShell } from '@/components/layout/page-shell';
import AdminCommandCenter from '@/app/admin/page';

export default function MasterExecutiveDashboard() {
  return (
    <PageShell title="" subtitle="">
      <AdminCommandCenter />
    </PageShell>
  );
}
