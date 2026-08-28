import React, { useState } from "react";
import Catalog from "./components/Catalog";
import AdminAuthModal from "./components/AdminAuthModal";
import AdminDashboard from "./components/AdminDashboard";
import { useLocalStorage } from "./hooks/useLocalStorage";
import type { Item, Order } from "./types";
import { SHOP_NAME, SHOP_PHONE } from "./utils/whatsapp";

const DEMO_ITEMS: Item[] = [
  { id: 1, name: "Gold Ring", variety: "22K Plain", category: "Ring", weight: "5g", purity: "22K", price: 35000, stock: "Available" },
  { id: 2, name: "Gold Necklace", variety: "18K Designer", category: "Necklace", weight: "25g", purity: "18K", price: 175000, stock: "Available" }
];

export default function App() {
  const [items, setItems] = useLocalStorage<Item[]>("sk_items_v3", DEMO_ITEMS);
  const [orders, setOrders] = useLocalStorage<Order[]>("sk_orders_v3", []);
  const [adminOpen, setAdminOpen] = useState(false);
  const [authenticated, setAuthenticated] = useLocalStorage<boolean>("sk_admin_authed_v3", false);

  const addItem = (i: Item) => setItems([i, ...items]);
  const addOrder = (o: Order) => setOrders([o, ...orders]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-yellow-50 to-orange-50 text-gray-800 font-sans pb-24">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-950 to-amber-900 text-white p-4 shadow-xl sticky top-0 z-30 border-b border-amber-800">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-wide">✨ {SHOP_NAME}</h1>
            <p className="text-[11px] text-amber-200 font-bold">संदीप सोनी जी • शुद्धता और विश्वास</p>
          </div>
          {authenticated && (
            <button onClick={() => setAuthenticated(false)} className="text-xs bg-red-700 hover:bg-red-800 text-white px-3.5 py-2 rounded-2xl shadow font-black transition-all">
              लॉगआउट (Logout)
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 px-4 space-y-6">
        {!authenticated ? (
          <Catalog items={items} />
        ) : (
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-amber-200">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-amber-200">
              <div>
                <h2 className="text-xl font-black text-amber-950">🛠️ Admin Dashboard</h2>
                <p className="text-xs text-amber-800 font-bold">संदीप सोनी जी का पैनल (सक्रिय)</p>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-900 px-3 py-1.5 rounded-full font-extrabold shadow-sm">Verified Admin</span>
            </div>
            <AdminDashboard items={items} orders={orders} onAddItem={addItem} onAddOrder={addOrder} />
          </div>
        )}
      </main>

      {/* Footer / Shopkeeper Access Button */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-amber-200 p-3 text-center flex justify-between items-center px-6 z-20 shadow-lg">
        <span className="text-xs text-gray-600 font-bold">© {SHOP_NAME} | संपर्क: {SHOP_PHONE}</span>
        {!authenticated && (
          <button
            onClick={() => setAdminOpen(true)}
            className="bg-amber-900 hover:bg-amber-950 text-white text-xs px-4 py-2.5 rounded-2xl shadow-md font-black transition-all"
          >
            🔐 Shopkeeper Access
          </button>
        )}
      </footer>

      {/* Admin Auth Modal */}
      {adminOpen && <AdminAuthModal onClose={() => setAdminOpen(false)} onSuccess={() => setAuthenticated(true)} />}
    </div>
  );
}
