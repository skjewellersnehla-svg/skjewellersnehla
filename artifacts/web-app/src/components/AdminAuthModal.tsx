import React, { useState } from "react";
type Props = { onClose: () => void; onSuccess: () => void };
export default function AdminAuthModal({ onClose, onSuccess }: Props) {
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const cleanPhone = phone.trim();
    const cleanPin = pin.trim();
    
    // Validating phone and pin (PIN must match the first 6 digits of the phone number)
    if (cleanPhone.length >= 6 && cleanPin === cleanPhone.substring(0, 6)) {
      onSuccess();
      onClose();
      return;
    }
    setErr("गलत नंबर या पिन! पिन आपके मोबाइल नंबर के शुरुआती 6 अक्षर होने चाहिए।");
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-amber-200">
        <h3 className="text-xl font-bold text-amber-900 mb-1">🔐 दुकानदार लॉगिन (Admin)</h3>
        <p className="text-xs text-gray-500 mb-4">अपना रजिस्टर्ड फोन नंबर और शुरुआती 6 अंक पिन के रूप में दर्ज करें</p>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-amber-900">मोबाइल नंबर</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full border-2 border-amber-200 p-2.5 rounded-lg mt-1 text-sm" placeholder="पूरा मोबाइल नंबर दर्ज करें" required />
          </div>
          <div>
            <label className="text-xs font-semibold text-amber-900">सीक्रेट पिन (नंबर के पहले 6 अंक)</label>
            <input value={pin} onChange={e => setPin(e.target.value)} className="w-full border-2 border-amber-200 p-2.5 rounded-lg mt-1 text-sm" placeholder="शुरुआती 6 अंक" type="password" required />
          </div>
          {err && <div className="text-red-600 text-xs font-medium bg-red-50 p-2 rounded">{err}</div>}
          <div className="flex gap-2 pt-2">
            <button type="submit" className="flex-1 bg-amber-800 hover:bg-amber-900 text-white font-bold py-2.5 rounded-lg shadow text-sm">लॉगिन करें</button>
            <button type="button" onClick={onClose} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2.5 rounded-lg text-sm">रद्द करें</button>
          </div>
        </form>
      </div>
    </div>
  );
}
