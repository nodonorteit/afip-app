import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { FacturacionContent } from '@/components/FacturacionContent';

export default function FacturacionPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <FacturacionContent />
        </main>
      </div>
    </div>
  );
} 