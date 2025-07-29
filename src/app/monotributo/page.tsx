import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { MonotributoContent } from '@/components/MonotributoContent';

export default function MonotributoPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <MonotributoContent />
        </main>
      </div>
    </div>
  );
} 