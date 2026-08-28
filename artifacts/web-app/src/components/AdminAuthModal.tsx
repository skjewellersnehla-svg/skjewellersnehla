import React, { useState } from "react";
import { SHOP_PHONE } from "../utils/whatsapp";

type Props = { onClose: () => void; onSuccess: () => void };
export default function AdminAuthModal({ onClose, onSuccess }: Props) {
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (phone.trim() === SHOP_PHONE && pin.trim() === "989610") {
      onSuccess();
      onClose();
      return;
    }
    setErr("गलत नंबर या पिन! (रजिस्टर्ड नंबर: 9896102704, पिन: पहले 6 अंक)");
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-amber-200">
        <h3 className="text-xl font-black text-amber-950 mb-1">🔐 दुकानदार लॉगिन (Admin)</h3>
        <p className="text-xs text-gray-500 mb-4">संदीप सोनी जी का रजिस्टर्ड नंबर और पिन दर्ज करें</p>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-xs font-bold text-amber-900">मोबाइल नंबर</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full border-2 border-amber-200 p-3 rounded-2xl mt-1 text-sm bg-amber-50/30 focus:outline-none focus:border-amber-700 font-bold" placeholder="9896102704" required />
          </div>
          <div>
            <label className="text-xs font-bold text-amber-900">सीक्रेट पिन (नंबर के शुरुआती 6 अंक)</label>
            <input value={pin} onChange={e => setPin(e.target.value)} className="w-full border-2 border-amber-200 p-3 rounded-2xl mt-1 text-sm bg-amber-50/30 focus:outline-none focus:border-amber-700 font-bold" placeholder="989610" type="password" required />
          </div>
          {err && <div className="text-red-600 text-xs font-extrabold bg-red-50 p-3 rounded-2xl border border-red-200">{err}</div>}
          <div className="flex gap-2 pt-3">
            <button type="submit" className="flex-1 bg-amber-900 hover:bg-amber-950 text-white font-extrabold py-3 rounded-2xl shadow-md text-sm transition-all">लॉगिन करें</button>
            <button type="button" onClick={onClose} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold py-3 rounded-2xl text-sm transition-all">रद्द करें</button>
          </div>
        </form>
      </div>
    </div>
  );
}
