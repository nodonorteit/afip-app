import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { GananciasContent } from '@/components/GananciasContent';

export default function GananciasPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <GananciasContent />
        </main>
      </div>
    </div>
  );
} 