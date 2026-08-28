import React, { useState } from "react";
import { Item } from "../types";
import { whatsappLink } from "../utils/whatsapp";
export default function ProductCard({ item }: { item: Item }) {
  const [liked, setLiked] = useState(false);
  const shareMessage = `${item.name} - ${item.variety}\nWeight: ${item.weight}\nPurity: ${item.purity}\nPrice: ₹${item.price}\nFrom: S.K. Jewellers, Nehla`;
  return (
    <article className="bg-white rounded-2xl p-4 shadow-sm flex flex-col border border-amber-100">
      <div className="h-36 bg-amber-50 rounded-lg flex items-center justify-center text-amber-700 font-semibold text-sm">✨ S.K. Jewellers</div>
      <div className="mt-3 flex-1">
        <h3 className="text-lg font-bold text-amber-900">{item.name}</h3>
        <p className="text-xs text-gray-500 mt-1">{item.variety} • {item.weight} • {item.purity}</p>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div>
          <div className="text-amber-800 font-bold text-lg">₹{item.price}</div>
          <div className="text-xs text-emerald-600 font-medium">{item.stock ?? "Available"}</div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setLiked(!liked)} className={`px-3 py-1.5 rounded-lg text-xs border font-medium ${liked ? "bg-amber-600 text-white" : "bg-white text-amber-700 border-amber-300"}`}>
            {liked ? "Liked ❤️" : "Like"}
          </button>
          <a className="px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-medium flex items-center" href={whatsappLink("", shareMessage)} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
