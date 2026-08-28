import React, { useState, useEffect } from "react";

const CONTACT_NUMBER = "9896102704";
// सटीक और स्पष्ट रूप से शुरुआती 6 अंक पिन के लिए तय किए गए हैं
const ADMIN_SECRET_PIN = CONTACT_NUMBER.slice(0, 6); // "989610"

export default function App() {
  const [viewMode, setViewMode] = useState<'home' | 'catalog' | 'order_maker' | 'admin_login' | 'admin_dashboard'>('home');
  const [items, setItems] = useState<any[]>([
    { id: 1, name: "हॉलमार्क गोल्ड रिंग", category: "Ring", weight: "8g", purity: "22K", price: "52,000", image: "" },
    { id: 2, name: "शाही लेडीज़ नेकलेस", category: "Necklace", weight: "35g", purity: "22K", price: "2,45,000", image: "" }
  ]);
  const [bills, setBills] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [selectedPlatform, setSelectedPlatform] = useState('pwa');
  
  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [custAddress, setCustAddress] = useState("");
  const [formCat, setFormCat] = useState("Ring");
  const [formPurity, setFormPurity] = useState("22K");

  const [inputAuthPhone, setInputAuthPhone] = useState("");
  const [inputAuthPin, setInputAuthPin] = useState("");

  const [newItemName, setNewItemName] = useState("");
  const [newItemCat, setNewItemCat] = useState("Ring");
  const [newItemWeight, setNewItemWeight] = useState("");
  const [newItemPurity, setNewItemPurity] = useState("22K");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemImage, setNewItemImage] = useState("");

  const [billCustomer, setBillCustomer] = useState("");
  const [billItemDesc, setBillItemDesc] = useState("");
  const [billAmount, setBillAmount] = useState("");
  const [billPaymentMode, setBillPaymentMode] = useState("Cash");

  useEffect(() => {
    const handleStatusChange = () => {
      setIsOnline(navigator.onLine);
    };
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);
    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, []);

  const handlePlatformChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedPlatform(val);
    if (val === 'vercel') {
      window.location.href = "https://sk-jewellers.vercel.app"; 
    }
  };

  const handleWhatsAppOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName.trim() || !custPhone.trim()) {
      alert("कृपया अपना नाम और मोबाइल नंबर अवश्य भरें!");
      return;
    }
    const msg = `✨ *नया डिजिटल आभूषण आर्डर - S.K. Jewellers, नेहला* ✨\n\n👤 *ग्राहक:* ${custName}\n📱 *मोबाइल:* ${custPhone}\n📍 *पता:* ${custAddress || 'N/A'}\n💍 *आभूषण प्रकार:* ${formCat}\n✨ *शुद्धता:* ${formPurity}`;
    window.open(`https://wa.me/91${CONTACT_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = inputAuthPhone.trim();
    const cleanPin = inputAuthPin.trim();

    // पूरी तरह सुरक्षित और सटीक जांच: फोन नंबर और शुरुआती 6 डिजिट का पिन मिलान
    if (cleanPhone === CONTACT_NUMBER && cleanPin === ADMIN_SECRET_PIN) {
      setViewMode('admin_dashboard');
      setInputAuthPhone('');
      setInputAuthPin('');
    } else {
      alert(`❌ अमान्य मोबाइल नंबर या गलत पिन!\n(नोट: सही मोबाइल ${CONTACT_NUMBER} और पिन पहले 6 अंक यानी ${ADMIN_SECRET_PIN} है)`);
    }
  };

  const handleAddCatalogItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemPrice.trim()) {
      alert("कृपया आभूषण का नाम और कीमत दर्ज करें!");
      return;
    }
    const newItem = {
      id: Date.now(),
      name: newItemName,
      category: newItemCat,
      weight: newItemWeight || "10g",
      purity: newItemPurity,
      price: newItemPrice,
      image: newItemImage || ""
    };
    setItems([newItem, ...items]);
    setNewItemName("");
    setNewItemWeight("");
    setNewItemPrice("");
    setNewItemImage("");
    alert("✅ नया आभूषण कैटलॉग में सफलतापूर्वक जोड़ दिया गया है!");
  };

  const handleCreateBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!billCustomer.trim() || !billAmount.trim()) {
      alert("कृपया ग्राहक का नाम और कुल राशि दर्ज करें!");
      return;
    }
    const newBill = {
      id: Date.now(),
      customer: billCustomer,
      desc: billItemDesc || "ज्वेलरी खरीदी",
      amount: billAmount,
      mode: billPaymentMode,
      date: new Date().toLocaleDateString('hi-IN'),
      time: new Date().toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' })
    };
    setBills([newBill, ...bills]);
    
    const billMsg = `🧾 *S.K. Jewellers - पक्का बिल / रसीद* 🧾\n\n👤 *ग्राहक:* ${billCustomer}\n💎 *विवरण:* ${billItemDesc}\n💰 *कुल राशि:* ₹${billAmount}\n💳 *भुगतान प्रकार:* ${billPaymentMode}\n📅 *दिनांक:* ${newBill.date} (${newBill.time})\n\n🙏 धन्यवाद! S.K. Jewellers, नेहला`;
    window.open(`https://wa.me/91${CONTACT_NUMBER}?text=${encodeURIComponent(billMsg)}`, '_blank');

    setBillCustomer("");
    setBillItemDesc("");
    setBillAmount("");
    alert("✅ डिजिटल बिल बन गया है और WhatsApp पर शेयर होने के लिए तैयार है!");
  };

  const totalRevenue = bills.reduce((acc, curr) => acc + (parseFloat(curr.amount.replace(/,/g, '')) || 0), 0);
  const cashRevenue = bills.filter(b => b.mode === 'Cash').reduce((acc, curr) => acc + (parseFloat(curr.amount.replace(/,/g, '')) || 0), 0);
  const upiRevenue = bills.filter(b => b.mode === 'UPI').reduce((acc, curr) => acc + (parseFloat(curr.amount.replace(/,/g, '')) || 0), 0);

  return (
    <div className="min-h-screen bg-amber-50/30 text-gray-900 font-sans pb-24">
      <header className="bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 text-white p-4 text-center shadow-lg border-b-2 border-amber-500/40">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-lg md:text-xl font-black tracking-wide">✨ S.K. Jewellers, नेहला ✨</h1>
            <p className="text-[10px] text-amber-200 font-semibold">हॉलमार्क आभूषण एवं विश्वसनीयता</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${isOnline ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
              {isOnline ? '🟢 ऑनलाइन' : '🔴 ऑफलाइन PWA'}
            </span>
            <select 
              value={selectedPlatform} 
              onChange={handlePlatformChange}
              className="text-[10px] bg-amber-900 text-amber-100 border border-amber-400 rounded px-1.5 py-1 font-bold outline-none cursor-pointer"
            >
              <option value="pwa">📱 PWA (Replit App)</option>
              <option value="vercel">🌐 Vercel लिंक</option>
            </select>
          </div>
        </div>
      </header>

      <div className="bg-white border-b shadow-sm px-4 py-3 flex justify-between items-center sticky top-0 z-50 max-w-md mx-auto">
        <button onClick={() => setViewMode('home')} className="text-xs font-black bg-amber-950 text-white px-4 py-2 rounded-xl shadow hover:bg-amber-900 transition">
          🏠 होम पेज
        </button>
        <div className="flex gap-2">
          <button onClick={() => setViewMode('catalog')} className="text-xs font-bold bg-amber-100 text-amber-950 border border-amber-300 px-3.5 py-2 rounded-xl shadow-sm">
            🔍 व्यू ज्वेलरी
          </button>
          <button onClick={() => setViewMode('order_maker')} className="text-xs font-bold bg-emerald-700 text-white px-3.5 py-2 rounded-xl shadow">
            🛒 आर्डर नाउ
          </button>
        </div>
      </div>

      {viewMode === 'home' && (
        <div className="p-4 max-w-md mx-auto space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-md border border-amber-200 text-center space-y-4">
            <h2 className="text-lg font-black text-amber-950">जी आर्यां नूं देवस्टे ऐस.के. ज्वैलर्स</h2>
            <p className="text-xs text-gray-600 leading-relaxed font-medium">
              हमारे यहाँ शुद्ध सोने और चांदी के हॉलमार्क आभूषण, फैंसी रिंग, नेकलेस और कंगन उचित मूल्य पर उपलब्ध हैं।
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <a href={`tel:${CONTACT_NUMBER}`} className="bg-amber-950 text-white px-5 py-3 rounded-2xl text-xs font-black shadow flex items-center gap-1.5">📞 कॉल करें</a>
              <a href={`https://wa.me/91${CONTACT_NUMBER}?text=${encodeURIComponent("नमस्ते, मुझे ज्वेलरी की जानकारी चाहिए।")}`} target="_blank" rel="noreferrer" className="bg-emerald-600 text-white px-5 py-3 rounded-2xl text-xs font-black shadow flex items-center gap-1.5">💬 WhatsApp</a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setViewMode('catalog')} className="bg-white p-4 rounded-2xl shadow border border-amber-100 text-left space-y-1">
              <span className="text-xs font-black text-amber-950 block">🔍 व्यू ज्वेलरी</span>
              <p className="text-[10px] text-gray-500">सभी डिज़ाइन देखें</p>
            </button>
            <button onClick={() => setViewMode('order_maker')} className="bg-white p-4 rounded-2xl shadow border border-emerald-100 text-left space-y-1">
              <span className="text-xs font-black text-emerald-800 block">🛒 आर्डर नाउ</span>
              <p className="text-[10px] text-gray-500">आभूषण आर्डर करें</p>
            </button>
          </div>
          <div className="pt-10 text-center border-t border-gray-200">
            <button onClick={() => setViewMode('admin_login')} className="text-xs font-bold text-gray-600 bg-gray-100 px-4 py-2.5 rounded-xl border shadow-sm">
              🔐 दुकान मालिक लॉगिन (Admin Panel)
            </button>
          </div>
        </div>
      )}

      {viewMode === 'catalog' && (
        <div className="p-4 max-w-md mx-auto space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-black text-amber-950">💎 लाइव आभूषण कैटलॉग</h2>
            <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-lg">{items.length} आइटम उपलब्ध</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['all', 'Ring', 'Necklace', 'Earrings', 'Bangles'].map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${activeCategory === cat ? 'bg-amber-950 text-white shadow' : 'bg-white border text-gray-700'}`}>
                {cat === 'all' ? 'सभी आभूषण' : cat}
              </button>
            ))}
          </div>
          {items.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-amber-300 rounded-3xl p-10 text-center space-y-2">
              <p className="text-xs font-bold text-gray-600">अभी कैटलॉग में कोई आभूषण नहीं है।</p>
              <p className="text-[11px] text-gray-400">एडमिन पैनल से नए आभूषण जोड़ें।</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.filter(i => activeCategory === 'all' || i.category === activeCategory).map(item => (
                <div key={item.id} className="bg-white p-4 rounded-3xl shadow-md border border-amber-100 space-y-3">
                  <div className="h-44 bg-amber-50 rounded-2xl overflow-hidden flex items-center justify-center text-amber-900 font-bold text-xs">
                    {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <span>✨ {item.name}</span>}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-amber-950">{item.name}</h3>
                    <p className="text-xs font-bold text-gray-500 mt-0.5">श्रेणी: {item.category} • वजन: {item.weight} • शुद्धता: {item.purity}</p>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <span className="text-emerald-700 font-black text-base">₹{item.price}</span>
                    <a href={`https://wa.me/91${CONTACT_NUMBER}?text=${encodeURIComponent(`नमस्ते, मुझे यह खरीदना है: ${item.name} (₹${item.price})`)}`} target="_blank" rel="noreferrer" className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-black shadow">
                      💬 WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {viewMode === 'order_maker' && (
        <div className="p-4 max-w-md mx-auto">
          <form onSubmit={handleWhatsAppOrder} className="bg-white p-6 rounded-3xl shadow-md border border-amber-100 space-y-4">
            <h2 className="text-lg font-black text-amber-950 text-center">🛒 आर्डर बुक करें</h2>
            <div>
              <label className="text-xs font-bold text-gray-700">आपका नाम:</label>
              <input type="text" value={custName} onChange={e => setCustName(e.target.value)} placeholder="पूरा नाम लिखें" className="w-full mt-1 p-3 border rounded-xl text-xs font-bold bg-gray-50" required />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700">मोबाइल नंबर:</label>
              <input type="tel" value={custPhone} onChange={e => setCustPhone(e.target.value)} placeholder="10 अंकों का मोबाइल" className="w-full mt-1 p-3 border rounded-xl text-xs font-bold bg-gray-50" required />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700">पता:</label>
              <input type="text" value={custAddress} onChange={e => setCustAddress(e.target.value)} placeholder="गाँव / शहर" className="w-full mt-1 p-3 border rounded-xl text-xs font-bold bg-gray-50" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700">आभूषण प्रकार:</label>
              <select value={formCat} onChange={e => setFormCat(e.target.value)} className="w-full mt-1 p-3 border rounded-xl text-xs font-bold bg-gray-50">
                <option value="Ring">Ring (अंगूठी)</option>
                <option value="Necklace">Necklace (हार)</option>
                <option value="Earrings">Earrings (झुमके)</option>
                <option value="Bangles">Bangles (कंगन)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700">शुद्धता:</label>
              <select value={formPurity} onChange={e => setFormPurity(e.target.value)} className="w-full mt-1 p-3 border rounded-xl text-xs font-bold bg-gray-50">
                <option value="22K">22K हॉलमार्क</option>
                <option value="18K">18K डिज़ाइनर</option>
                <option value="916 Gold">916 पूरे शुद्ध</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-emerald-600 text-white py-3.5 rounded-2xl font-black text-xs shadow-lg">
              🚀 WhatsApp पर आर्डर भेजें
            </button>
          </form>
        </div>
      )}

      {viewMode === 'admin_login' && (
        <div className="p-4 max-w-md mx-auto">
          <form onSubmit={handleAdminLogin} className="bg-white p-6 rounded-3xl shadow-md border border-amber-200 space-y-4">
            <h2 className="text-lg font-black text-amber-950 text-center">🔐 एडमिन सुरक्षित लॉगिन</h2>
            <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-center">
              <p className="text-[11px] font-bold text-amber-900">व्यवसाय मोबाइल: {CONTACT_NUMBER}</p>
              <p className="text-[10px] text-amber-700 mt-0.5">गुप्त पिन = फोन नंबर के पहले 6 अंक (989610)</p>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700">मोबाइल नंबर दर्ज करें:</label>
              <input type="tel" value={inputAuthPhone} onChange={e => setInputAuthPhone(e.target.value)} placeholder="9896102704" className="w-full mt-1 p-3 border rounded-xl text-xs font-bold bg-gray-50" required />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700">सिक्योरिटी पिन (PIN):</label>
              <input type="password" value={inputAuthPin} onChange={e => setInputAuthPin(e.target.value)} maxLength={6} placeholder="6 अंकों का पिन (989610)" className="w-full mt-1 p-3 border rounded-xl text-xs font-bold bg-gray-50 tracking-widest" required />
            </div>
            <button type="submit" className="w-full bg-amber-950 text-white py-3.5 rounded-2xl font-black text-xs shadow-lg">
              🔓 लॉगिन करें
            </button>
            <button type="button" onClick={() => setViewMode('home')} className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-2xl font-bold text-xs">
              वापस होम पर जाएं
            </button>
          </form>
        </div>
      )}

      {viewMode === 'admin_dashboard' && (
        <div className="p-4 max-w-md mx-auto space-y-5">
          <div className="bg-amber-950 text-white p-4 rounded-2xl flex justify-between items-center shadow-md">
            <div>
              <h2 className="text-sm font-black">📊 संदीप सोनी एडमिन पैनल</h2>
              <p className="text-[10px] text-amber-200">स्टॉक और बिलिंग सिस्टम</p>
            </div>
            <button onClick={() => setViewMode('home')} className="bg-amber-800 text-white px-3 py-1.5 rounded-xl text-xs font-bold">लॉगआउट</button>
          </div>

          <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-4 rounded-3xl shadow-md space-y-2">
            <span className="text-xs font-black uppercase tracking-wider block border-b border-amber-500 pb-1">⚡ दैनिक बिक्री रिपोर्ट</span>
            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="bg-amber-900/60 p-2 rounded-xl">
                <span className="text-[9px] text-amber-200 block">कुल बिक्री</span>
                <span className="text-xs font-black">₹{totalRevenue}</span>
              </div>
              <div className="bg-emerald-900/60 p-2 rounded-xl">
                <span className="text-[9px] text-emerald-200 block">नकद (Cash)</span>
                <span className="text-xs font-black">₹{cashRevenue}</span>
              </div>
              <div className="bg-blue-900/60 p-2 rounded-xl">
                <span className="text-[9px] text-blue-200 block">UPI ऑनलाइन</span>
                <span className="text-xs font-black">₹{upiRevenue}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleAddCatalogItem} className="bg-white p-5 rounded-3xl shadow-md border space-y-3">
            <h3 className="text-xs font-black text-amber-950 border-b pb-1">➕ नया आभूषण जोड़ें</h3>
            <div>
              <label className="text-[11px] font-bold text-gray-700">आभूषण नाम:</label>
              <input type="text" value={newItemName} onChange={e => setNewItemName(e.target.value)} placeholder="जैसे: गोल्ड रिंग" className="w-full mt-1 p-2.5 border rounded-xl text-xs font-bold bg-gray-50" required />
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-700">कैटेगरी:</label>
              <select value={newItemCat} onChange={e => setNewItemCat(e.target.value)} className="w-full mt-1 p-2.5 border rounded-xl text-xs font-bold bg-gray-50">
                <option value="Ring">Ring</option>
                <option value="Necklace">Necklace</option>
                <option value="Earrings">Earrings</option>
                <option value="Bangles">Bangles</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-700">वजन:</label>
              <input type="text" value={newItemWeight} onChange={e => setNewItemWeight(e.target.value)} placeholder="10g" className="w-full mt-1 p-2.5 border rounded-xl text-xs font-bold bg-gray-50" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-700">शुद्धता:</label>
              <select value={newItemPurity} onChange={e => setNewItemPurity(e.target.value)} className="w-full mt-1 p-2.5 border rounded-xl text-xs font-bold bg-gray-50">
                <option value="22K">22K हॉलमार्क</option>
                <option value="18K">18K डिज़ाइनर</option>
                <option value="916 Gold">916 पूरे शुद्ध</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-700">कीमत (₹):</label>
              <input type="text" value={newItemPrice} onChange={e => setNewItemPrice(e.target.value)} placeholder="45,000" className="w-full mt-1 p-2.5 border rounded-xl text-xs font-bold bg-gray-50" required />
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-700">फोटो लिंक (वैकल्पिक):</label>
              <input type="text" value={newItemImage} onChange={e => setNewItemImage(e.target.value)} placeholder="Image URL" className="w-full mt-1 p-2.5 border rounded-xl text-xs bg-gray-50" />
            </div>
            <button type="submit" className="w-full bg-amber-950 text-white py-3 rounded-xl font-black text-xs shadow">
              💾 रिकॉर्ड सेव करें
            </button>
          </form>

          <form onSubmit={handleCreateBill} className="bg-white p-5 rounded-3xl shadow-md border space-y-3">
            <h3 className="text-xs font-black text-emerald-900 border-b pb-1">🧾 डिजिटल बिल बनाएं</h3>
            <div>
              <label className="text-[11px] font-bold text-gray-700">ग्राहक का नाम:</label>
              <input type="text" value={billCustomer} onChange={e => setBillCustomer(e.target.value)} placeholder="नाम" className="w-full mt-1 p-2.5 border rounded-xl text-xs font-bold bg-gray-50" required />
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-700">विवरण:</label>
              <input type="text" value={billItemDesc} onChange={e => setBillItemDesc(e.target.value)} placeholder="22K गोल्ड रिंग" className="w-full mt-1 p-2.5 border rounded-xl text-xs font-bold bg-gray-50" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-700">कुल राशि (₹):</label>
              <input type="text" value={billAmount} onChange={e => setBillAmount(e.target.value)} placeholder="55,000" className="w-full mt-1 p-2.5 border rounded-xl text-xs font-bold bg-gray-50" required />
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-700">भुगतान का माध्यम:</label>
              <select value={billPaymentMode} onChange={e => setBillPaymentMode(e.target.value)} className="w-full mt-1 p-2.5 border rounded-xl text-xs font-bold bg-gray-50">
                <option value="Cash">Cash (नकद)</option>
                <option value="UPI">UPI (ऑनलाइन)</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-emerald-700 text-white py-3 rounded-xl font-black text-xs shadow">
              🖨️ बिल सेव करें & WhatsApp भेजें
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
