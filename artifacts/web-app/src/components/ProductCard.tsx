import React, { useState } from "react";
import { Item } from "../types";
import { whatsappLink } from "../utils/whatsapp";
export default function ProductCard({ item }: { item: Item }) {
  const [liked, setLiked] = useState(false);
  const shareMessage = `${item.name} - ${item.variety}\nWeight: ${item.weight}\nPurity: ${item.purity}\nPrice: ₹${item.price}\nFrom: S.K. Jewellers, Nehla`;
  return (
    <article className="bg-white rounded-2xl p-4 shadow-md flex flex-col border border-amber-200 transition-all hover:shadow-lg">
      <div className="h-36 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center text-amber-900 font-bold text-sm shadow-inner">✨ S.K. Jewellers</div>
      <div className="mt-3 flex-1">
        <h3 className="text-lg font-bold text-amber-950">{item.name}</h3>
        <p className="text-xs text-gray-500 mt-1 font-medium">{item.variety} • {item.weight} • {item.purity}</p>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-amber-50 pt-3">
        <div>
          <div className="text-amber-900 font-extrabold text-lg">₹{item.price}</div>
          <div className="text-xs text-emerald-600 font-semibold">{item.stock ?? "Available"}</div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setLiked(!liked)} className={`px-3 py-1.5 rounded-xl text-xs border font-bold transition-colors ${liked ? "bg-amber-700 text-white border-amber-700" : "bg-white text-amber-800 border-amber-300 hover:bg-amber-50"}`}>
            {liked ? "Liked ❤️" : "Like"}
          </button>
          <a className="px-3 py-1.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-bold shadow-sm flex items-center" href={whatsappLink("", shareMessage)} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
