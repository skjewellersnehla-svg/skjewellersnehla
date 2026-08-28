import React from "react";
import { Item } from "../types";
import ProductCard from "./ProductCard";
export default function Catalog({ items }: { items: Item[] }) {
  return (
    <section className="px-2 py-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-amber-950">💎 हमारी विशेष ज्वेलरी वैरायटी</h2>
        <p className="text-xs text-amber-800 font-medium mt-1">शुद्धता और भरोसे का प्रतीक - S.K. Jewellers, नेहला</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((it) => <ProductCard key={it.id} item={it} />)}
      </div>
    </section>
  );
}
