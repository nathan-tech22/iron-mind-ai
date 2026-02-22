'use client';

import { AuthGate } from '@/components/AuthGate';
import { AppContent } from '@/components/TrainingDashboard';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <AuthGate>
        <AppContent />
      </AuthGate>
    </main>
  );
}
