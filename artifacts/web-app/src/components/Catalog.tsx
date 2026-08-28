import React, { useState } from "react";
import { Item } from "../types";
import ProductCard from "./ProductCard";
import { SHOP_NAME, SHOP_PHONE } from "../utils/whatsapp";

export default function Catalog({ items }: { items: Item[] }) {
  const [activeTab, setActiveTab] = useState("All");
  const categories = ["All", "Ring", "Necklace", "Earrings", "Bangles"];
  const filtered = activeTab === "All" ? items : items.filter(i => i.category === activeTab);

  return (
    <section className="px-2 py-4 space-y-6">
      <div className="bg-gradient-to-r from-amber-900 to-amber-950 text-white p-6 rounded-3xl shadow-xl text-center border border-amber-700">
        <h2 className="text-xl sm:text-2xl font-black mb-2">नमस्कार! आपकी अपनी {SHOP_NAME} में स्वागत है! ✨</h2>
        <p className="text-xs sm:text-sm text-amber-200 font-medium mb-4">शुद्धता और भरोसे का प्रतीक - बेहतरीन आभूषणों की विशाल रेंज।</p>
        <div className="flex justify-center gap-3">
          <a href={`tel:${SHOP_PHONE}`} className="bg-amber-500 hover:bg-amber-600 text-amber-950 px-4 py-2.5 rounded-2xl text-xs font-black shadow-md transition-all">
            📞 अभी कॉल करें
          </a>
          <a href={`https://wa.me/${SHOP_PHONE}`} target="_blank" rel="noreferrer" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-2xl text-xs font-black shadow-md transition-all">
            💬 WhatsApp
          </a>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveTab(cat)} className={`px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap shadow-sm transition-all ${activeTab === cat ? "bg-amber-900 text-white shadow-md" : "bg-white text-amber-900 border border-amber-200 hover:bg-amber-50"}`}>
            {cat === "All" ? "सभी आभूषण" : cat}
          </button>
        ))}
      </div>

      <div>
        <h3 className="text-lg font-black text-amber-950 mb-1">💎 हमारी विशेष ज्वेलरी वैरायटी</h3>
        <p className="text-xs text-amber-800 font-semibold mb-4">पसंद का आभूषण चुनें, लाइक करें और सीधे WhatsApp पर शेयर करें।</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map(it => <ProductCard key={it.id} item={it} />)}
        </div>
      </div>
    </section>
  );
}
