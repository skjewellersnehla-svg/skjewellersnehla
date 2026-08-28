import React, { useState } from "react";
import { Item } from "../types";
import ProductCard from "./ProductCard";
import { SHOP_NAME, SHOP_PHONE, whatsappLink } from "../utils/whatsapp";

interface CatalogProps {
  items: Item[];
  onOpenAdmin: () => void;
  onOpenOrderMaker: () => void;
}

export default function Catalog({ items, onOpenAdmin, onOpenOrderMaker }: CatalogProps) {
  const [activeTab, setActiveTab] = useState("All");
  const categories = ["All", "Ring", "Necklace", "Earrings", "Bangles"];
  const filtered = activeTab === "All" ? items : items.filter(i => i.category === activeTab);

  return (
    <section className="px-3 py-6 space-y-6 bg-white min-h-screen text-gray-900 pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950 to-amber-900 text-white p-6 sm:p-8 rounded-3xl shadow-2xl text-center border border-amber-800">
        <h2 className="text-2xl sm:text-3xl font-black mb-2">✨ {SHOP_NAME} ✨</h2>
        <p className="text-xs text-amber-200 font-medium mb-5">शुद्धता और भरोसे का प्रतीक - 22K हॉलमार्क आभूषण।</p>
        
        {/* Top Call & WhatsApp Buttons */}
        <div className="flex justify-center gap-3">
          <a href={`tel:${SHOP_PHONE}`} className="bg-amber-500 hover:bg-amber-600 text-amber-950 px-5 py-3 rounded-2xl text-xs font-black shadow-md transition-all flex items-center gap-1.5">
            📞 Call Now
          </a>
          <a href={whatsappLink(SHOP_PHONE, "नमस्ते, मुझे आभूषणों की जानकारी चाहिए।")} target="_blank" rel="noreferrer" className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl text-xs font-black shadow-md transition-all flex items-center gap-1.5">
            💬 WhatsApp
          </a>
        </div>
      </div>

      {/* Main 2 Navigation Dropdown / Action Buttons (As requested) */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => window.scrollTo({ top: 350, behavior: 'smooth' })} className="bg-amber-950 text-white p-4 rounded-2xl font-black text-xs shadow-md text-center flex flex-col items-center gap-1">
          <span>🔍</span> व्यू ज्वेलरी (Catalog)
        </button>
        <button onClick={onOpenOrderMaker} className="bg-emerald-700 text-white p-4 rounded-2xl font-black text-xs shadow-md text-center flex flex-col items-center gap-1">
          <span>🛒</span> आर्डर बुक करें (Order Now)
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none pt-2">
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveTab(cat)} className={`px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap shadow-sm transition-all ${activeTab === cat ? "bg-amber-950 text-white shadow" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
            {cat === "All" ? "सभी आभूषण" : cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div>
        <h3 className="text-lg font-black text-gray-900 mb-1">💎 हमारी विशेष ज्वेलरी वैरायटी</h3>
        <p className="text-[11px] text-gray-500 font-medium mb-4">पसंद का आभूषण चुनें, डिटेल देखें और सीधे WhatsApp पर आर्डर करें।</p>
        
        {items.length === 0 ? (
          <div className="bg-gray-50 rounded-3xl p-10 text-center border-2 border-dashed border-gray-200">
            <p className="text-xs font-bold text-gray-400">कैटलॉग में कोई आइटम उपलब्ध नहीं है।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map(it => <ProductCard key={it.id} item={it} />)}
          </div>
        )}
      </div>

      {/* Footer / Admin Access Button (Strictly brought back as requested) */}
      <div className="mt-12 pt-6 border-t border-gray-200 flex flex-col items-center justify-center gap-3">
        <p className="text-[11px] text-gray-400 font-bold">© {SHOP_NAME} | संपर्क: {SHOP_PHONE}</p>
        <button onClick={onOpenAdmin} className="bg-gray-900 hover:bg-black text-amber-400 px-6 py-3 rounded-2xl text-xs font-black shadow-lg transition-all flex items-center gap-2 border border-amber-500/30">
          🔐 Shopkeeper Access (एडमिन लॉगिन)
        </button>
      </div>
    </section>
  );
}
