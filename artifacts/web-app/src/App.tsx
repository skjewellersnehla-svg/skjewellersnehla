import React, { useState, useEffect } from "react";

const CONTACT_NUMBER = "9896102704";
const ADMIN_SECRET_PIN = CONTACT_NUMBER.slice(0, 6); // 989610

export default function App() {
  const [viewMode, setViewMode] = useState<'home' | 'catalog' | 'order_maker' | 'admin_login' | 'admin_dashboard'>('home');
  
  const [items, setItems] = useState<any[]>([]);
  const [bills, setBills] = useState<any[]>([]);

  // 5:00 PM Auto Report State & Check
  const [autoReportNotice, setAutoReportNotice] = useState(false);

  useEffect(() => {
    // Check if it's 5:00 PM or later to trigger auto-summary notification for Sandip Soni
    const checkTimeForAutoReport = () => {
      const now = new Date();
      const hours = now.getHours();
      // If time is 17:00 (5 PM) or more, enable evening summary banner
      if (hours >= 17) {
        setAutoReportNotice(true);
      }
    };
    checkTimeForAutoReport();
    const interval = setInterval(checkTimeForAutoReport, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const [activeCategory, setActiveCategory] = useState("all");
  
  // Customer Order Form
  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [custAddress, setCustAddress] = useState("");
  const [formCat, setFormCat] = useState("Ring");
  const [formPurity, setFormPurity] = useState("22K");

  // Admin Login State
  const [inputAuthPhone, setInputAuthPhone] = useState("");
  const [inputAuthPin, setInputAuthPin] = useState("");

  // Admin Add Item State
  const [newItemName, setNewItemName] = useState("");
  const [newItemCat, setNewItemCat] = useState("Ring");
  const [newItemWeight, setNewItemWeight] = useState("");
  const [newItemPurity, setNewItemPurity] = useState("22K");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemImage, setNewItemImage] = useState("");

  // Admin Billing State
  const [billCustomer, setBillCustomer] = useState("");
  const [billItemDesc, setBillItemDesc] = useState("");
  const [billAmount, setBillAmount] = useState("");
  const [billPaymentMode, setBillPaymentMode] = useState("Cash");

  const handleWhatsAppOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custPhone) {
      alert("कृपया अपना नाम और मोबाइल नंबर अवश्य भरें!");
      return;
    }
    const msg = `✨ *नया डिजिटल आभूषण आर्डर - S.K. Jewellers, नेहला* ✨\n\n👤 *ग्राहक:* ${custName}\n📱 *मोबाइल:* ${custPhone}\n📍 *पता:* ${custAddress || 'N/A'}\n💍 *आभूषण प्रकार:* ${formCat}\n✨ *शुद्धता:* ${formPurity}`;
    window.open(`https://wa.me/91${CONTACT_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputAuthPhone.trim() === CONTACT_NUMBER && inputAuthPin.trim() === ADMIN_SECRET_PIN) {
      setViewMode('admin_dashboard');
      setInputAuthPhone('');
      setInputAuthPin('');
    } else {
      alert("❌ अमान्य मोबाइल नंबर या गलत पिन! (पिन आपके मोबाइल नंबर के पहले 6 अंक 989610 हैं)।");
    }
  };

  const handleAddCatalogItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice) {
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
    alert("✅ नया आभूषण कैटलॉग में जोड़ दिया गया है!");
  };

  const handleCreateBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!billCustomer || !billAmount) {
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
    
    const billMsg = `🧾 *S.K. Jewellers - पक्का बिल / रसीद* 🧾\n\n👤 *ग्राहक:* ${billCustomer}\n💎 *विवरण:* ${billItemDesc}\n💰 *कुल राशि:* ₹${billAmount}\n💳 *भुगतान प्रकार:* ${billPaymentMode}\n📅 *दिनांक:* ${newBill.date} (${newBill.time})\n\n🙏 धन्यवाद! आपकी सेवा में सदैव तत्पर - S.K. Jewellers, नेहला`;
    window.open(`https://wa.me/91${CONTACT_NUMBER}?text=${encodeURIComponent(billMsg)}`, '_blank');

    setBillCustomer("");
    setBillItemDesc("");
    setBillAmount("");
    alert("✅ बिल बन गया है और WhatsApp पर शेयर होने के लिए तैयार है!");
  };

  // Calculations for Admin Dashboard & Auto Report
  const totalRevenue = bills.reduce((acc, curr) => acc + (parseFloat(curr.amount.replace(/,/g, '')) || 0), 0);
  const cashRevenue = bills.filter(b => b.mode === 'Cash').reduce((acc, curr) => acc + (parseFloat(curr.amount.replace(/,/g, '')) || 0), 0);
  const upiRevenue = bills.filter(b => b.mode === 'UPI').reduce((acc, curr) => acc + (parseFloat(curr.amount.replace(/,/g, '')) || 0), 0);

  return (
    <div className="min-h-screen bg-amber-50/30 text-gray-900 font-sans pb-24">
      {/* Top Professional Header */}
      <header className="bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 text-white p-5 text-center shadow-lg border-b-2 border-amber-500/40">
        <h1 className="text-xl md:text-2xl font-black tracking-wide">✨ S.K. Jewellers, नेहला ✨</h1>
        <p className="text-xs text-amber-200 mt-1 font-semibold">शुद्धता और भरोसे का प्रतीक - हॉलमार्क आभूषण</p>
      </header>

      {/* Customer Quick Navigation Bar */}
      <div className="bg-white border-b shadow-sm px-4 py-3 flex justify-between items-center sticky top-0 z-50">
        <button onClick={() => setViewMode('home')} className="text-xs font-black bg-amber-950 text-white px-4 py-2 rounded-xl shadow hover:bg-amber-900 transition">
          🏠 होम पेज
        </button>
        <div className="flex gap-2">
          <button onClick={() => setViewMode('catalog')} className="text-xs font-bold bg-amber-100 text-amber-950 border border-amber-300 px-3.5 py-2 rounded-xl shadow-sm hover:bg-amber-200 transition">
            🔍 व्यू ज्वेलरी
          </button>
          <button onClick={() => setViewMode('order_maker')} className="text-xs font-bold bg-emerald-700 text-white px-3.5 py-2 rounded-xl shadow hover:bg-emerald-800 transition">
            🛒 आर्डर नाउ
          </button>
        </div>
      </div>

      {/* ================= PAGE 1: HOME ================= */}
      {viewMode === 'home' && (
        <div className="p-4 max-w-md mx-auto space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-md border border-amber-200 text-center space-y-4">
            <h2 className="text-lg font-black text-amber-950">जी आर्यां नूं देवस्टे ऐस.के. ज्वैलर्स</h2>
            <p className="text-xs text-gray-600 leading-relaxed font-medium">
              हमारे यहाँ शुद्ध सोने और चांदी के हॉलमार्क आभूषण, फैंसी रिंग, नेकलेस और कंगन उचित मूल्य पर उपलब्ध हैं।
            </p>
            
            <div className="flex justify-center gap-3 pt-2">
              <a href={`tel:${CONTACT_NUMBER}`} className="bg-amber-950 text-white px-5 py-3 rounded-2xl text-xs font-black shadow flex items-center gap-1.5">
                📞 कॉल करें
              </a>
              <a href={`https://wa.me/91${CONTACT_NUMBER}?text=${encodeURIComponent("नमस्ते, मुझे ज्वेलरी की जानकारी चाहिए।")}`} target="_blank" rel="noreferrer" className="bg-emerald-600 text-white px-5 py-3 rounded-2xl text-xs font-black shadow flex items-center gap-1.5">
                💬 WhatsApp
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setViewMode('catalog')} className="bg-white p-4 rounded-2xl shadow border border-amber-100 text-left space-y-1 hover:border-amber-400 transition">
              <span className="text-xs font-black text-amber-950 block">🔍 व्यू ज्वेलरी</span>
              <p className="text-[10px] text-gray-500">सभी डिज़ाइन और कैटलॉग देखें</p>
            </button>
            <button onClick={() => setViewMode('order_maker')} className="bg-white p-4 rounded-2xl shadow border border-emerald-100 text-left space-y-1 hover:border-emerald-400 transition">
              <span className="text-xs font-black text-emerald-800 block">🛒 आर्डर नाउ</span>
              <p className="text-[10px] text-gray-500">पसंद का आभूषण आर्डर करें</p>
            </button>
          </div>

          <div className="pt-10 text-center border-t border-gray-200">
            <button onClick={() => setViewMode('admin_login')} className="text-xs font-bold text-gray-500 bg-gray-100 px-4 py-2 rounded-xl border hover:bg-gray-200 transition">
              🔐 दुकान मालिक लॉगिन (Admin Panel)
            </button>
          </div>
        </div>
      )}

      {/* ================= PAGE 2: VIEW JEWELRY (CATALOG) ================= */}
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
            <div className="bg-white border-2 border-dashed border-amber-300 rounded-3xl p-10 text-center space-y-2 shadow-sm">
              <p className="text-xs font-bold text-gray-600">अभी कैटलॉग में कोई आभूषण नहीं है।</p>
              <p className="text-[11px] text-gray-400">दुकान मालिक अपने एडमिन पैनल से नए आभूषण जोड़ेंगे तो यहाँ दिखेंगे।</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.filter(i => activeCategory === 'all' || i.category === activeCategory).map(item => (
                <div key={item.id} className="bg-white p-4 rounded-3xl shadow-md border border-amber-100 space-y-3">
                  <div className="h-44 bg-amber-50 rounded-2xl overflow-hidden flex items-center justify-center text-amber-900 font-bold text-xs">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>✨ {item.name} (फोटो उपलब्ध नहीं)</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-amber-950">{item.name}</h3>
                    <p className="text-xs font-bold text-gray-500 mt-0.5">श्रेणी: {item.category} • वजन: {item.weight} • शुद्धता: {item.purity}</p>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <span className="text-emerald-700 font-black text-base">₹{item.price}</span>
                    <a href={`https://wa.me/91${CONTACT_NUMBER}?text=${encodeURIComponent(`नमस्ते, मुझे यह आभूषण खरीदना है:\nनाम: ${item.name}\nवजन: ${item.weight}\nशुद्धता: ${item.purity}\nकीमत: ₹${item.price}`)}`} target="_blank" rel="noreferrer" className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-black shadow hover:bg-emerald-700 transition">
                      💬 WhatsApp पर पूछें
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= PAGE 3: ORDER NOW ================= */}
      {viewMode === 'order_maker' && (
        <div className="p-4 max-w-md mx-auto">
          <form onSubmit={handleWhatsAppOrder} className="bg-white p-6 rounded-3xl shadow-md border border-amber-100 space-y-4">
            <h2 className="text-lg font-black text-amber-950 text-center">🛒 आर्डर बुक करें</h2>
            <div>
              <label className="text-xs font-bold text-gray-700">आपका नाम:</label>
              <input type="text" value={custName} onChange={e => setCustName(e.target.value)} placeholder="पूरा नाम लिखें" className="w-full mt-1 p-3 border rounded-xl text-xs font-bold bg-gray-50 focus:bg-white transition" required />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700">मोबाइल नंबर:</label>
              <input type="tel" value={custPhone} onChange={e => setCustPhone(e.target.value)} placeholder="10 अंकों का मोबाइल नंबर" className="w-full mt-1 p-3 border rounded-xl text-xs font-bold bg-gray-50 focus:bg-white transition" required />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700">पता (गाँव/शहर):</label>
              <input type="text" value={custAddress} onChange={e => setCustAddress(e.target.value)} placeholder="अपना पता लिखें" className="w-full mt-1 p-3 border rounded-xl text-xs font-bold bg-gray-50 focus:bg-white transition" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700">आभूषण प्रकार:</label>
              <select value={formCat} onChange={e => setFormCat(e.target.value)} className="w-full mt-1 p-3 border rounded-xl text-xs font-bold bg-gray-50">
                <option value="Ring">Ring (अंगूठी)</option>
                <option value="Necklace">Necklace (हार)</option>
                <option value="Earrings">Earrings (कान के झुमके)</option>
                <option value="Bangles">Bangles (कंगन)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700">शुद्धता (कैरेट):</label>
              <select value={formPurity} onChange={e => setFormPurity(e.target.value)} className="w-full mt-1 p-3 border rounded-xl text-xs font-bold bg-gray-50">
                <option value="22K">22K हॉलमार्क</option>
                <option value="18K">18K डिज़ाइनर</option>
                <option value="916 Gold">916 पूरे शुद्ध</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-emerald-600 text-white py-3.5 rounded-2xl font-black text-xs shadow-lg hover:bg-emerald-700 transition">
              🚀 WhatsApp पर आर्डर भेजें
            </button>
          </form>
        </div>
      )}

      {/* ================= PAGE 4: SECURE ADMIN LOGIN ================= */}
      {viewMode === 'admin_login' && (
        <div className="p-4 max-w-md mx-auto">
          <form onSubmit={handleAdminLogin} className="bg-white p-6 rounded-3xl shadow-md border border-amber-200 space-y-4">
            <h2 className="text-lg font-black text-amber-950 text-center">🔐 एडमिन सुरक्षित लॉगिन</h2>
            <p className="text-[11px] text-gray-500 text-center">गुप्त पिन = आपके मोबाइल नंबर के पहले 6 अक्षर (989610)</p>
            <div>
              <label className="text-xs font-bold text-gray-700">मालिक का मोबाइल नंबर:</label>
              <input type="tel" value={inputAuthPhone} onChange={e => setInputAuthPhone(e.target.value)} placeholder="मोबाइल नंबर दर्ज करें" className="w-full mt-1 p-3 border rounded-xl text-xs font-bold bg-gray-50" required />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700">गुप्त PIN (शुरुआती 6 अंक):</label>
              <input type="password" value={inputAuthPin} onChange={e => setInputAuthPin(e.target.value)} placeholder="6 अंकों का पिन दर्ज करें" className="w-full mt-1 p-3 border rounded-xl text-xs font-bold bg-gray-50" required />
            </div>
            <button type="submit" className="w-full bg-amber-950 text-white py-3.5 rounded-2xl font-black text-xs shadow-lg hover:bg-amber-900 transition">
              🔓 लॉगिन करें
            </button>
            <button type="button" onClick={() => setViewMode('home')} className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-2xl font-bold text-xs hover:bg-gray-200 transition">
              वापस होम पर जाएं
            </button>
          </form>
        </div>
      )}

      {/* ================= PAGE 5: ADMIN DASHBOARD (SANDIP SONI VIP PANEL WITH 5 PM AUTO REPORT) ================= */}
      {viewMode === 'admin_dashboard' && (
        <div className="p-4 max-w-md mx-auto space-y-5">
          <div className="bg-amber-950 text-white p-4 rounded-2xl flex justify-between items-center shadow-md border-b-2 border-amber-500">
            <div>
              <h2 className="text-sm font-black">📊 संदीप सोनी एडमिन पैनल</h2>
              <p className="text-[10px] text-amber-200">स्टॉक, बिलिंग और 5 PM ऑटो-रिपोर्ट</p>
            </div>
            <button onClick={() => setViewMode('home')} className="bg-amber-800 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold hover:bg-amber-700 transition">लॉगआउट</button>
          </div>

          {/* 5:00 PM Daily Auto Update Summary Banner for Sandip Soni */}
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-4 rounded-3xl shadow-md space-y-2 border border-amber-400">
            <div className="flex justify-between items-center border-b border-amber-500/50 pb-1.5">
              <span className="text-xs font-black uppercase tracking-wider">⚡ 5:00 PM ऑटो-डेली रिपोर्ट</span>
              <span className="text-[10px] bg-amber-900 px-2 py-0.5 rounded-full font-bold">लाइव अपडेट</span>
            </div>
            <p className="text-[11px] text-amber-100">
              संदीप सोनी जी, आज की कुल बिक्री और पेमेंट का ऑटोमैटिक हिसाब नीचे दर्ज है। किसी रजिस्टर की जरूरत नहीं!
            </p>
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

          {/* SECTION 1: ADD JEWELRY TO CATALOG */}
          <form onSubmit={handleAddCatalogItem} className="bg-white p-5 rounded-3xl shadow-md border border-amber-200 space-y-3">
            <h3 className="text-xs font-black text-amber-950 pb-1.5 border-b flex items-center gap-1">➕ नया आभूषण कैटलॉग में जोड़ें</h3>
            
            <div>
              <label className="text-[11px] font-bold text-gray-700">आभूषण का नाम:</label>
              <input type="text" value={newItemName} onChange={e => setNewItemName(e.target.value)} placeholder="जैसे: Gold Ring / Bridal Necklace" className="w-full mt-1 p-2.5 border rounded-xl text-xs bg-gray-50 font-bold" required />
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-700">आइटम कैटेगरी (ड्रॉपडाउन):</label>
              <select value={newItemCat} onChange={e => setNewItemCat(e.target.value)} className="w-full mt-1 p-2.5 border rounded-xl text-xs bg-gray-50 font-bold">
                <option value="Ring">Ring (अंगूठी)</option>
                <option value="Necklace">Necklace (हार)</option>
                <option value="Earrings">Earrings (कान के झुमके)</option>
                <option value="Bangles">Bangles (कंगन)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-700">वजन (मैनुअल):</label>
              <input type="text" value={newItemWeight} onChange={e => setNewItemWeight(e.target.value)} placeholder="जैसे: 15g / 25g" className="w-full mt-1 p-2.5 border rounded-xl text-xs bg-gray-50 font-bold" />
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-700">शुद्धता / कैरेट (ड्रॉपडाउन):</label>
              <select value={newItemPurity} onChange={e => setNewItemPurity(e.target.value)} className="w-full mt-1 p-2.5 border rounded-xl text-xs bg-gray-50 font-bold">
                <option value="22K">22K हॉलमार्क</option>
                <option value="18K">18K डिज़ाइनर</option>
                <option value="916 Gold">916 पूरे शुद्ध</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-700">कीमत (₹):</label>
              <input type="text" value={newItemPrice} onChange={e => setNewItemPrice(e.target.value)} placeholder="जैसे: 45,000" className="w-full mt-1 p-2.5 border rounded-xl text-xs bg-gray-50 font-bold" required />
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-700">फोटो लिंक (या इमेज URL):</label>
              <input type="text" value={newItemImage} onChange={e => setNewItemImage(e.target.value)} placeholder="फोटो का लिंक यहाँ पेस्ट करें (वैकल्पिक)" className="w-full mt-1 p-2.5 border rounded-xl text-xs bg-gray-50" />
            </div>

            <button type="submit" className="w-full bg-amber-950 text-white py-3 rounded-xl font-black text-xs shadow hover:bg-amber-900 transition">
              💾 रिकॉर्ड सेव करें & लाइव करें
            </button>
          </form>

          {/* SECTION 2: BILLING & PAYMENT MANAGER */}
          <form onSubmit={handleCreateBill} className="bg-white p-5 rounded-3xl shadow-md border border-emerald-200 space-y-3">
            <h3 className="text-xs font-black text-emerald-900 pb-1.5 border-b flex items-center gap-1">🧾 डिजिटल बिल बनाएं & WhatsApp भेजें</h3>
            
            <div>
              <label className="text-[11px] font-bold text-gray-700">ग्राहक का नाम:</label>
              <input type="text" value={billCustomer} onChange={e => setBillCustomer(e.target.value)} placeholder="ग्राहक का नाम" className="w-full mt-1 p-2.5 border rounded-xl text-xs bg-gray-50 font-bold" required />
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-700">आइटम विवरण:</label>
              <input type="text" value={billItemDesc} onChange={e => setBillItemDesc(e.target.value)} placeholder="जैसे: 22K गोल्ड रिंग (10g)" className="w-full mt-1 p-2.5 border rounded-xl text-xs bg-gray-50 font-bold" />
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-700">कुल राशि (₹):</label>
              <input type="text" value={billAmount} onChange={e => setBillAmount(e.target.value)} placeholder="जैसे: 55,000" className="w-full mt-1 p-2.5 border rounded-xl text-xs bg-gray-50 font-bold" required />
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-700">भुगतान का माध्यम (Payment Mode):</label>
              <select value={billPaymentMode} onChange={e => setBillPaymentMode(e.target.value)} className="w-full mt-1 p-2.5 border rounded-xl text-xs bg-gray-50 font-bold">
                <option value="Cash">Cash (नकद)</option>
                <option value="UPI">UPI (ऑनलाइन / QR)</option>
              </select>
            </div>

            <button type="submit" className="w-full bg-emerald-700 text-white py-3 rounded-xl font-black text-xs shadow hover:bg-emerald-800 transition">
              🖨️ बिल सेव करें & WhatsApp पर भेजें
            </button>
          </form>

          {/* Recent Bills History */}
          {bills.length > 0 && (
            <div className="bg-white p-4 rounded-3xl shadow-md border space-y-3">
              <h4 className="text-xs font-black text-gray-800 border-b pb-1">📋 बिल और बिक्री रिकॉर्ड ({bills.length})</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {bills.map(b => (
                  <div key={b.id} className="bg-gray-50 p-2.5 rounded-xl border flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-gray-900 block">{b.customer}</span>
                      <span className="text-[10px] text-gray-500">{b.desc} • {b.date} ({b.time})</span>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-emerald-700 block">₹{b.amount}</span>
                      <span className="text-[9px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-bold">{b.mode}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
