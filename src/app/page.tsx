'use client';

import { AppContent } from '@/components/TrainingDashboard';
import { AuthGate } from '@/components/AuthGate';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <AuthGate>
        <AppContent />
      </AuthGate>
    </main>
  );
}
