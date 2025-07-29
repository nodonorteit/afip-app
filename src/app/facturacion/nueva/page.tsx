import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { FacturaCreator } from '@/components/FacturaCreator';

export default function NuevaFacturaPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <FacturaCreator />
        </main>
      </div>
    </div>
  );
} 