import React, { useState } from "react";
import { Item } from "../types";
import ProductCard from "./ProductCard";
import { SHOP_NAME, SHOP_PHONE } from "../utils/whatsapp";

export default function Catalog({ items }: { items: Item[] }) {
  const [activeTab, setActiveTab] = useState("All");
  const categories = ["All", "Ring", "Necklace", "Earrings", "Bangles"];
  const filtered = activeTab === "All" ? items : items.filter(i => i.category === activeTab);

  return (
    <section className="px-3 py-6 space-y-6 bg-white min-h-screen text-gray-900">
      <div className="bg-gradient-to-r from-amber-950 to-amber-900 text-white p-6 sm:p-8 rounded-3xl shadow-2xl text-center border border-amber-800">
        <h2 className="text-2xl sm:text-3xl font-black mb-3">✨ {SHOP_NAME} ✨</h2>
        <p className="text-sm text-amber-200 font-medium mb-6">शुद्धता और भरोसे का प्रतीक - बेहतरीन आभूषणों की विशाल रेंज।</p>
        <div className="flex justify-center gap-4">
          <a href={`tel:${SHOP_PHONE}`} className="bg-amber-500 hover:bg-amber-600 text-amber-950 px-6 py-3.5 rounded-2xl text-sm font-black shadow-lg transition-all">
            📞 Call Now
          </a>
          <a href={`https://wa.me/${SHOP_PHONE}`} target="_blank" rel="noreferrer" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3.5 rounded-2xl text-sm font-black shadow-lg transition-all">
            💬 WhatsApp
          </a>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveTab(cat)} className={`px-5 py-3 rounded-2xl text-xs font-black whitespace-nowrap shadow-sm transition-all ${activeTab === cat ? "bg-amber-950 text-white shadow-md scale-105" : "bg-white text-amber-950 border-2 border-amber-200 hover:bg-amber-50"}`}>
            {cat === "All" ? "सभी आभूषण" : cat}
          </button>
        ))}
      </div>

      <div>
        <h3 className="text-xl font-black text-gray-900 mb-1">💎 हमारी आभूषण रेंज</h3>
        <p className="text-xs text-gray-500 font-semibold mb-6">चुनें अपना पसंदीदा आभूषण, लाइक करें और सीधे WhatsApp पर शेयर करें।</p>
        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-200 shadow-sm">
            <p className="text-base font-bold text-gray-400">अभी कैटलॉग में कोई आभूषण नहीं है।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {filtered.map(it => <ProductCard key={it.id} item={it} />)}
          </div>
        )}
      </div>
    </section>
  );
}
