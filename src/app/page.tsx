import { Header } from '@/components/Header';
import { Dashboard } from '@/components/Dashboard';
import { Sidebar } from '@/components/Sidebar';

export default function Home() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <Dashboard />
        </main>
      </div>
    </div>
  );
}
