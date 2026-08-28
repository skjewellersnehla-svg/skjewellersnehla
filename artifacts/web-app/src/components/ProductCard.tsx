import React, { useState } from "react";
import { Item } from "../types";
import { whatsappLink, SHOP_PHONE, SHOP_NAME } from "../utils/whatsapp";

export default function ProductCard({ item }: { item: Item }) {
  const [liked, setLiked] = useState(false);
  const shareMessage = `✨ *${SHOP_NAME}* ✨\n\nआभूषण: ${item.name} (${item.variety})\nवजन: ${item.weight} | शुद्धता: ${item.purity}\nकीमत: ₹${item.price}\n\n📞 संपर्क: ${SHOP_PHONE}`;

  return (
    <article className="bg-white rounded-3xl p-4 shadow-md flex flex-col border border-amber-200 transition-all hover:shadow-xl">
      <div className="h-36 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center text-amber-950 font-black text-base shadow-inner">
        ✨ {SHOP_NAME}
      </div>
      <div className="mt-3 flex-1">
        <h3 className="text-lg font-extrabold text-amber-950">{item.name}</h3>
        <p className="text-xs text-amber-800 mt-1 font-bold">{item.variety} • {item.weight} • {item.purity}</p>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-amber-100 pt-3">
        <div>
          <div className="text-amber-950 font-black text-lg">₹{item.price}</div>
          <div className="text-xs text-emerald-700 font-extrabold">{item.stock ?? "उपलब्ध है"}</div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setLiked(!liked)} className={`px-3 py-2 rounded-xl text-xs border font-extrabold transition-all ${liked ? "bg-amber-900 text-white border-amber-900" : "bg-white text-amber-900 border-amber-300 hover:bg-amber-50"}`}>
            {liked ? "पसंद किया ❤️" : "पसंद"}
          </button>
          <a className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm flex items-center gap-1" href={whatsappLink("", shareMessage)} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
