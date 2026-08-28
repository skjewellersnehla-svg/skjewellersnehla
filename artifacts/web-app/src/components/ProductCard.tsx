import React, { useState } from "react";
import { Item } from "../types";
import { whatsappLink, SHOP_PHONE, SHOP_NAME } from "../utils/whatsapp";

export default function ProductCard({ item }: { item: Item }) {
  const [liked, setLiked] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  const shareMessage = `✨ *${SHOP_NAME}* ✨\n\nआभूषण: ${item.name} (${item.variety})\nवजन: ${item.weight} | शुद्धता: ${item.purity}\nकीमत: ₹${item.price}\n\n📞 संपर्क: ${SHOP_PHONE}`;

  return (
    <>
      <article className="bg-white rounded-3xl p-5 shadow-lg flex flex-col border-2 border-gray-100 transition-all hover:shadow-xl">
        <div className="h-44 bg-gradient-to-br from-amber-50 to-yellow-100 rounded-2xl flex items-center justify-center text-amber-900 font-black text-sm shadow-inner relative overflow-hidden">
          {item.image ? (
            <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-2xl" />
          ) : (
            <span>✨ {SHOP_NAME}</span>
          )}
          <span className="absolute top-3 right-3 bg-emerald-100 text-emerald-800 text-[10px] font-black px-3 py-1 rounded-full shadow">
            {item.stock ?? "उपलब्ध है"}
          </span>
        </div>
        
        <div className="mt-4 flex-1">
          <h3 className="text-xl font-black text-gray-900">{item.name}</h3>
          <p className="text-xs text-gray-600 mt-1 font-bold">{item.variety} • {item.weight} • {item.purity}</p>
          
          {item.careTip && (
            <div className="mt-3 bg-amber-50/70 p-3 rounded-2xl border border-amber-200/60 text-xs text-amber-950 font-medium">
              💡 <span className="font-black">विशेषता:</span> {item.careTip}
            </div>
          )}
        </div>

        <div className="mt-5 border-t border-gray-100 pt-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-bold">कीमत:</span>
            <span className="text-gray-900 font-black text-2xl">₹{item.price}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setShowDetails(true)} className="bg-amber-950 hover:bg-amber-900 text-white py-3 rounded-2xl text-xs font-black shadow-md transition-all">
              🟢 Details
            </button>
            <a href={whatsappLink("", shareMessage)} target="_blank" rel="noreferrer" className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl text-xs font-black shadow-md text-center flex items-center justify-center gap-1">
              🟢 WhatsApp
            </a>
            <button onClick={() => setLiked(!liked)} className={`py-3 rounded-2xl text-xs border-2 font-black transition-all ${liked ? "bg-amber-900 text-white border-amber-900" : "bg-white text-amber-900 border-amber-300 hover:bg-amber-50"}`}>
              {liked ? "❤️ Liked" : "🤍 Like"}
            </button>
            <a href={whatsappLink("", shareMessage)} target="_blank" rel="noreferrer" className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-2xl text-xs font-black text-center flex items-center justify-center gap-1 border-2 border-gray-200">
              📤 Share
            </a>
          </div>
        </div>
      </article>

      {/* Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-xl font-black text-gray-900">{item.name}</h3>
              <button onClick={() => setShowDetails(false)} className="text-gray-500 font-black text-lg px-3 py-1 bg-gray-100 rounded-full">✕</button>
            </div>
            <div className="space-y-2 text-sm text-gray-700 font-medium">
              <p><span className="font-black">वैरायटी:</span> {item.variety}</p>
              <p><span className="font-black">वजन:</span> {item.weight}</p>
              <p><span className="font-black">शुद्धता:</span> {item.purity}</p>
              <p><span className="font-black">कीमत:</span> ₹{item.price}</p>
              <p><span className="font-black">स्टेatus:</span> {item.stock ?? "उपलब्ध है"}</p>
              {item.careTip && <p><span className="font-black">विवरण:</span> {item.careTip}</p>}
            </div>
            <div className="pt-2">
              <button onClick={() => setShowDetails(false)} className="w-full bg-amber-950 text-white py-3.5 rounded-2xl font-black text-sm">बंद करें</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
