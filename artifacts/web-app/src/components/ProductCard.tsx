import React, { useState } from "react";
import { Item } from "../types";
import { whatsappLink, SHOP_PHONE, SHOP_NAME } from "../utils/whatsapp";

export default function ProductCard({ item }: { item: Item }) {
  const [liked, setLiked] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  const shareMessage = `✨ *${SHOP_NAME}* ✨\n\nआभूषण: ${item.name} (${item.variety})\nवजन: ${item.weight} | शुद्धता: ${item.purity}\nकीमत: ₹${item.price}\n\n📞 संपर्क: ${SHOP_PHONE}`;

  return (
    <>
      <article className="bg-white rounded-3xl p-4 shadow-md flex flex-col border border-gray-200 transition-all">
        <div className="h-40 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-900 font-black text-xs relative overflow-hidden">
          {item.image ? (
            <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-2xl" />
          ) : (
            <span>✨ {item.name} फोटो</span>
          )}
          <span className="absolute top-2.5 right-2.5 bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full">
            {item.stock ?? "उपलब्ध"}
          </span>
        </div>
        
        <div className="mt-3 flex-1">
          <h4 className="text-base font-black text-gray-900">{item.name}</h4>
          <p className="text-[11px] text-gray-500 font-bold mt-0.5">{item.variety} • {item.weight} • {item.purity}</p>
        </div>

        <div className="mt-3 border-t border-gray-100 pt-3 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-400 font-bold">मूल्य:</span>
            <span className="text-emerald-700 font-black text-lg">₹{item.price}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setShowDetails(true)} className="bg-amber-950 hover:bg-amber-900 text-white py-2.5 rounded-xl text-xs font-black shadow transition-all">
              🟢 Details
            </button>
            <a href={whatsappLink(SHOP_PHONE, shareMessage)} target="_blank" rel="noreferrer" className="bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-xs font-black shadow text-center flex items-center justify-center gap-1">
              💬 WhatsApp
            </a>
            <button onClick={() => setLiked(!liked)} className={`py-2 rounded-xl text-xs border font-black transition-all ${liked ? "bg-amber-900 text-white border-amber-900" : "bg-white text-amber-900 border-amber-300 hover:bg-amber-50"}`}>
              {liked ? "❤️ Liked" : "🤍 Like"}
            </button>
            <a href={whatsappLink(SHOP_PHONE, shareMessage)} target="_blank" rel="noreferrer" className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-xl text-xs font-black text-center flex items-center justify-center gap-1 border">
              📤 Share
            </a>
          </div>
        </div>
      </article>

      {/* Details Popup Modal (Fully working now) */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-black text-gray-900">{item.name}</h3>
              <button onClick={() => setShowDetails(false)} className="text-gray-500 font-black text-base px-3 py-1 bg-gray-100 rounded-full">✕</button>
            </div>
            <div className="space-y-2 text-xs text-gray-700 font-medium">
              <p><span className="font-black text-gray-900">वैरायटी:</span> {item.variety}</p>
              <p><span className="font-black text-gray-900">वजन:</span> {item.weight}</p>
              <p><span className="font-black text-gray-900">शुद्धता:</span> {item.purity}</p>
              <p><span className="font-black text-gray-900">कीमत:</span> ₹{item.price}</p>
              <p><span className="font-black text-gray-900">स्टॉक:</span> {item.stock ?? "उपलब्ध है"}</p>
              {item.careTip && <p><span className="font-black text-gray-900">विशेषता:</span> {item.careTip}</p>}
            </div>
            <div className="pt-2">
              <button onClick={() => setShowDetails(false)} className="w-full bg-amber-950 text-white py-3 rounded-2xl font-black text-xs shadow">बंद करें</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
