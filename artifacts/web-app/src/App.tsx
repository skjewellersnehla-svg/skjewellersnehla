import React, { useState } from "react";

const CONTACT_NUMBER = "9896102704";
// Admin secret PIN is strictly the first 6 digits of the phone number: "989610"
const ADMIN_SECRET_PIN = CONTACT_NUMBER.slice(0, 6);

export default function App() {
  const [viewMode, setViewMode] = useState<'home' | 'catalog' | 'order_maker' | 'admin_login' | 'admin_dashboard'>('home');
  const [items, setItems] = useState<any[]>([]);

  const [activeCategory, setActiveCategory] = useState("all");
  
  // Customer Order Form State
  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [custAddress, setCustAddress] = useState("");
  const [formCat, setFormCat] = useState("Ring");
  const [formPurity, setFormPurity] = useState("22K");

  // Admin Secure Login State
  const [inputAuthPhone, setInputAuthPhone] = useState("");
  const [inputAuthPin, setInputAuthPin] = useState("");

  // Admin Add Item State
  const [newItemName, setNewItemName] = useState("");
  const [newItemCat, setNewItemCat] = useState("Ring");
  const [newItemWeight, setNewItemWeight] = useState("");
  const [newItemPurity, setNewItemPurity] = useState("22K");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemImage, setNewItemImage] = useState("");

  const handleWhatsAppOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custPhone) {
      alert("कृपया अपना नाम और मोबाइल नंबर अवश्य भरें!");
      return;
    }
    const msg = `✨ *नया डिजिटल आभूषण आर्डर - S.K. Jewellers* ✨\n\n👤 *ग्राहक:* ${custName}\n📱 *मोबाइल:* ${custPhone}\n📍 *पता:* ${custAddress || 'N/A'}\n💍 *आभूषण प्रकार:* ${formCat}\n✨ *शुद्धता:* ${formPurity}`;
    window.open(`https://wa.me/91${CONTACT_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputAuthPhone.trim() === CONTACT_NUMBER && inputAuthPin.trim() === ADMIN_SECRET_PIN) {
      setViewMode('admin_dashboard');
      setInputAuthPhone('');
      setInputAuthPin('');
    } else {
      alert("❌ अमान्य मोबाइल नंबर या गलत पिन! (पिन आपके मोबाइल नंबर के शुरुआती 6 अंक हैं)।");
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
    alert("✅ नया आभूषण सफलतापूर्वक जोड़ दिया गया है! अब यह कस्टमर के कैटलॉग में दिखने लगा है।");
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans pb-24">
      {/* Top Header Banner */}
      <header className="bg-gradient-to-r from-amber-950 to-amber-900 text-white p-4 text-center shadow-md">
        <h1 className="text-xl font-black">✨ S.K. Jewellers, नेहला ✨</h1>
        <p className="text-xs text-amber-200 mt-1">शुद्धता और भरोसे का प्रतीक - हॉलमार्क आभूषण</p>
      </header>

      {/* Customer Navigation Bar */}
      <div className="bg-gray-100 border-b px-4 py-2.5 flex justify-between items-center shadow-sm">
        <button onClick={() => setViewMode('home')} className="text-xs font-black bg-amber-950 text-white px-3.5 py-2 rounded-xl shadow">
          🏠 होम पेज
        </button>
        <div className="flex gap-2">
          <button onClick={() => setViewMode('catalog')} className="text-xs font-bold bg-white text-amber-950 border border-amber-300 px-3.5 py-2 rounded-xl shadow-sm">
            🔍 व्यू ज्वेलरी
          </button>
          <button onClick={() => setViewMode('order_maker')} className="text-xs font-bold bg-emerald-700 text-white px-3.5 py-2 rounded-xl shadow">
            🛒 आर्डर नाउ
          </button>
        </div>
      </div>

      {/* PAGE 1: HOME */}
      {viewMode === 'home' && (
        <div className="p-4 max-w-md mx-auto space-y-6">
          <div className="bg-amber-50/60 p-6 rounded-3xl shadow-sm border border-amber-200 text-center space-y-4">
            <h2 className="text-xl font-black text-amber-950">जी आर्यां नूं देवस्टे ऐस.के. ज्वैलर्स</h2>
            <p className="text-xs text-gray-700 font-medium leading-relaxed">
              हजारों परिवारों का विश्वासी ठिकाना - शुद्ध सोने व चांदी के हॉलमार्क आभूषण।
            </p>
            
            <div className="flex justify-center gap-3 pt-2">
              <a href={`tel:${CONTACT_NUMBER}`} className="bg-amber-950 text-white px-5 py-2.5 rounded-2xl text-xs font-black shadow">
                📞 कॉल करें
              </a>
              <a href={`https://wa.me/91${CONTACT_NUMBER}?text=${encodeURIComponent("नमस्ते, मुझे ज्वेलरी देखनी है।")}`} target="_blank" rel="noreferrer" className="bg-emerald-600 text-white px-5 py-2.5 rounded-2xl text-xs font-black shadow">
                💬 WhatsApp
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setViewMode('catalog')} className="bg-white p-4 rounded-2xl shadow-md border border-gray-200 text-left space-y-1">
              <span className="text-xs font-black text-amber-950">🔍 व्यू ज्वेलरी</span>
              <p className="text-[10px] text-gray-500">कैटलॉग और डिज़ाइन देखें</p>
            </button>
            <button onClick={() => setViewMode('order_maker')} className="bg-white p-4 rounded-2xl shadow-md border border-gray-200 text-left space-y-1">
              <span className="text-xs font-black text-emerald-800">🛒 आर्डर नाउ</span>
              <p className="text-[10px] text-gray-500">पसंद का आर्डर बुक करें</p>
            </button>
          </div>

          <div className="pt-12 text-center border-t border-gray-100">
            <button onClick={() => setViewMode('admin_login')} className="text-[11px] font-bold text-gray-400 hover:text-gray-900 transition-colors">
              🔐 दुकान मालिक लॉगिन (Admin Portal)
            </button>
          </div>
        </div>
      )}

      {/* PAGE 2: VIEW JEWELRY */}
      {viewMode === 'catalog' && (
        <div className="p-4 max-w-md mx-auto space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-black text-gray-900">💎 उपलब्ध आभूषण कैटलॉग</h2>
            <span className="text-xs font-bold text-gray-500">{items.length} आइटम उपलब्ध</span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {['all', 'Ring', 'Necklace', 'Earrings', 'Bangles'].map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${activeCategory === cat ? 'bg-amber-950 text-white shadow' : 'bg-gray-100 text-gray-700'}`}>
                {cat === 'all' ? 'सभी आभूषण' : cat}
              </button>
            ))}
          </div>

          {items.length === 0 ? (
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-10 text-center space-y-2">
              <p className="text-xs font-bold text-gray-500">अभी कोई आभूषण उपलब्ध नहीं है।</p>
              <p className="text-[11px] text-gray-400">दुकान मालिक द्वारा एडमिन पैनल से नया सामान जोड़ते ही यहाँ दिखाई देगा।</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.filter(i => activeCategory === 'all' || i.category === activeCategory).map(item => (
                <div key={item.id} className="bg-white p-4 rounded-3xl shadow-md border border-gray-200 space-y-3">
                  <div className="h-40 bg-amber-50 rounded-2xl overflow-hidden flex items-center justify-center text-amber-900 font-bold text-xs">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>✨ {item.name} फोटो</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-gray-900">{item.name}</h3>
                    <p className="text-xs font-bold text-gray-500">{item.category} • वजन: {item.weight} • शुद्धता: {item.purity}</p>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <span className="text-emerald-700 font-black text-base">₹{item.price}</span>
                    <a href={`https://wa.me/91${CONTACT_NUMBER}?text=${encodeURIComponent(`नमस्ते, मुझे यह आभूषण खरीदना है:\nनाम: ${item.name}\nवजन: ${item.weight}\nशुद्धता: ${item.purity}\nकीमत: ₹${item.price}`)}`} target="_blank" rel="noreferrer" className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-black shadow">
                      💬 WhatsApp पर पूछें
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PAGE 3: ORDER NOW */}
      {viewMode === 'order_maker' && (
        <div className="p-4 max-w-md mx-auto">
          <form onSubmit={handleWhatsAppOrder} className="bg-white p-6 rounded-3xl shadow-md border border-gray-200 space-y-4">
            <h2 className="text-lg font-black text-amber-950 text-center">🛒 आर्डर बुक करें</h2>
            <div>
              <label className="text-xs font-bold text-gray-700">आपका नाम:</label>
              <input type="text" value={custName} onChange={e => setCustName(e.target.value)} placeholder="पूरा नाम लिखें" className="w-full mt-1 p-3 border rounded-xl text-xs font-bold bg-gray-50" required />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700">मोबाइल नंबर:</label>
              <input type="tel" value={custPhone} onChange={e => setCustPhone(e.target.value)} placeholder="10 अंकों का मोबाइल नंबर" className="w-full mt-1 p-3 border rounded-xl text-xs font-bold bg-gray-50" required />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700">पता (गाँव/शहर):</label>
              <input type="text" value={custAddress} onChange={e => setCustAddress(e.target.value)} placeholder="अपना पता लिखें" className="w-full mt-1 p-3 border rounded-xl text-xs font-bold bg-gray-50" />
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
            <button type="submit" className="w-full bg-emerald-600 text-white py-3.5 rounded-2xl font-black text-xs shadow-lg">
              🚀 WhatsApp पर आर्डर भेजें
            </button>
          </form>
        </div>
      )}

      {/* PAGE 4: SECURE ADMIN LOGIN */}
      {viewMode === 'admin_login' && (
        <div className="p-4 max-w-md mx-auto">
          <form onSubmit={handleAdminLogin} className="bg-white p-6 rounded-3xl shadow-md border border-gray-200 space-y-4">
            <h2 className="text-lg font-black text-gray-900 text-center">🔐 एडमिन सुरक्षित लॉगिन</h2>
            <p className="text-[11px] text-gray-500 text-center">गुप्त पिन = आपके मोबाइल नंबर के पहले 6 अक्षर (989610)</p>
            <div>
              <label className="text-xs font-bold text-gray-700">मालिक का मोबाइल नंबर:</label>
              <input type="tel" value={inputAuthPhone} onChange={e => setInputAuthPhone(e.target.value)} placeholder="मोबाइल नंबर दर्ज करें" className="w-full mt-1 p-3 border rounded-xl text-xs font-bold bg-gray-50" required />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700">गुप्त PIN (शुरुआती 6 अंक):</label>
              <input type="password" value={inputAuthPin} onChange={e => setInputAuthPin(e.target.value)} placeholder="6 अंकों का पिन दर्ज करें" className="w-full mt-1 p-3 border rounded-xl text-xs font-bold bg-gray-50" required />
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

      {/* PAGE 5: ADMIN DASHBOARD */}
      {viewMode === 'admin_dashboard' && (
        <div className="p-4 max-w-md mx-auto space-y-5">
          <div className="bg-amber-950 text-white p-4 rounded-2xl flex justify-between items-center shadow-md">
            <div>
              <h2 className="text-sm font-black">📊 एडमिन डैशबोर्ड (मालिक पैनल)</h2>
              <p className="text-[10px] text-amber-200">यहाँ से नए गहने कैटलॉग में डालें</p>
            </div>
            <button onClick={() => setViewMode('home')} className="bg-amber-800 text-white px-3 py-1.5 rounded-xl text-xs font-bold">लॉगआउट</button>
          </div>

          <form onSubmit={handleAddCatalogItem} className="bg-white p-5 rounded-3xl shadow-md border border-gray-200 space-y-3">
            <h3 className="text-xs font-black text-amber-950 pb-1 border-b">➕ नया आभूषण जोड़ें</h3>
            
            <div>
              <label className="text-[11px] font-bold text-gray-600">आभूषण का नाम:</label>
              <input type="text" value={newItemName} onChange={e => setNewItemName(e.target.value)} placeholder="जैसे: Gold Ring / Bridal Necklace" className="w-full mt-1 p-2.5 border rounded-xl text-xs bg-gray-50 font-bold" required />
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-600">आइटम कैटेगरी (ड्रॉपडाउन):</label>
              <select value={newItemCat} onChange={e => setNewItemCat(e.target.value)} className="w-full mt-1 p-2.5 border rounded-xl text-xs bg-gray-50 font-bold">
                <option value="Ring">Ring</option>
                <option value="Necklace">Necklace</option>
                <option value="Earrings">Earrings</option>
                <option value="Bangles">Bangles</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-600">वजन (मैनुअल):</label>
              <input type="text" value={newItemWeight} onChange={e => setNewItemWeight(e.target.value)} placeholder="जैसे: 15g / 25g" className="w-full mt-1 p-2.5 border rounded-xl text-xs bg-gray-50 font-bold" />
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-600">शुद्धता / कैरेट (ड्रॉपडाउन):</label>
              <select value={newItemPurity} onChange={e => setNewItemPurity(e.target.value)} className="w-full mt-1 p-2.5 border rounded-xl text-xs bg-gray-50 font-bold">
                <option value="22K">22K हॉलमार्क</option>
                <option value="18K">18K डिज़ाइनर</option>
                <option value="916 Gold">916 पूरे शुद्ध</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-600">कीमत (₹):</label>
              <input type="text" value={newItemPrice} onChange={e => setNewItemPrice(e.target.value)} placeholder="जैसे: 45,000" className="w-full mt-1 p-2.5 border rounded-xl text-xs bg-gray-50 font-bold" required />
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-600">फोटो लिंक (या इमेज URL):</label>
              <input type="text" value={newItemImage} onChange={e => setNewItemImage(e.target.value)} placeholder="फोटो का लिंक यहाँ पेस्ट करें (वैकल्पिक)" className="w-full mt-1 p-2.5 border rounded-xl text-xs bg-gray-50" />
            </div>

            <button type="submit" className="w-full bg-amber-950 text-white py-3 rounded-xl font-black text-xs shadow-md">
              💾 रिकॉर्ड सेव करें & लाइव करें
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
