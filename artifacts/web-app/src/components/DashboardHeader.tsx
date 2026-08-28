import { LogOut, Settings } from "lucide-react";

interface DashboardHeaderProps {
  onLogout: () => void;
}

export default function DashboardHeader({ onLogout }: DashboardHeaderProps) {
  return (
    <header className="bg-white shadow-md border-b-2 border-amber-100">
      <div className="container mx-auto px-4 py-6 max-w-7xl flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            S.K. Jewellers Nehla
          </h1>
          <p className="text-sm text-amber-700 mt-1">Premium Luxury Jewelry • Trusted Since Day One</p>
        </div>
        
        <div className="flex gap-3">
          <button
            className="p-2 rounded-lg hover:bg-amber-50 text-amber-700 transition"
            title="Settings"
          >
            <Settings size={24} />
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-semibold transition border border-red-200"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
