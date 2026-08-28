import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardHeader from "./components/DashboardHeader";
import LiveMetrics from "./components/LiveMetrics";
import BillingModule from "./components/BillingModule";
import InventorySection from "./components/InventorySection";
import { getAdminSummary } from "./api/client";

export default function App() {
  const [adminToken, setAdminToken] = useState<string | null>(
    localStorage.getItem("adminToken")
  );

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ["adminSummary"],
    queryFn: () => getAdminSummary(adminToken!),
    enabled: !!adminToken,
  });

  useEffect(() => {
    if (adminToken) {
      localStorage.setItem("adminToken", adminToken);
    } else {
      localStorage.removeItem("adminToken");
    }
  }, [adminToken]);

  if (!adminToken) {
    return <LoginPage onLogin={setAdminToken} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-yellow-50 to-orange-50">
      <DashboardHeader onLogout={() => setAdminToken(null)} />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Live Metrics Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-amber-900 mb-6">Live Sales Metrics</h2>
          <LiveMetrics summary={summary} isLoading={summaryLoading} />
        </section>

        {/* Billing & WhatsApp Module */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-amber-900 mb-6">Fast Billing & Share</h2>
          <BillingModule adminToken={adminToken} />
        </section>

        {/* Inventory Management */}
        <section>
          <h2 className="text-3xl font-bold text-amber-900 mb-6">Inventory Management</h2>
          <InventorySection adminToken={adminToken} />
        </section>
      </main>
    </div>
  );
}

interface LoginPageProps {
  onLogin: (token: string) => void;
}

function LoginPage({ onLogin }: LoginPageProps) {
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, pin }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      onLogin(data.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-amber-100">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-br from-amber-400 to-orange-500 rounded-full p-4 mb-4">
              <svg
                className="w-12 h-12 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-amber-900 mb-2">
              S.K. Jewellers Nehla
            </h1>
            <p className="text-sm text-amber-700">Admin Dashboard</p>
            <p className="text-xs text-amber-600 mt-1">Luxury Jewelry Management</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98961 02704"
                className="w-full px-4 py-3 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-500 bg-amber-50 text-amber-900 placeholder-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">
                PIN
              </label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter 6-digit PIN"
                className="w-full px-4 py-3 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-500 bg-amber-50 text-amber-900 placeholder-amber-400"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isLoading ? "Logging in..." : "Login to Dashboard"}
            </button>
          </form>

          <p className="text-center text-xs text-amber-600 mt-6">
            Secure admin access only
          </p>
        </div>
      </div>
    </div>
  );
}
