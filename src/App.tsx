import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Package2, Phone, MessageCircle, ShieldCheck, LogOut, Languages, ImagePlus, Trash2, PlusCircle } from 'lucide-react';
import { Toaster, toast } from 'sonner';

const translations: Record<string, any> = {
  'हिन्दी': {
    title: 'S.K. Jewellers, नेहला',
    tagline: '✨ शुद्धता और भरोसे का प्रतीक - हॉलमार्क आभूषण ✨',
    welcome: 'नमस्कार दोस्तों! आपकी अपनी S.K. Jewellers में आपका हार्दिक स्वागत है! 💍',
    desc: '💎 S.K. Jewellers (नेहला) द्वारा अब तक हजारों संतुष्ट ग्राहकों को हॉलमार्क सोने व चांदी के आभूषण पहुंचाये जा चुके हैं। आज ही हमारी दुकान पर विजिट करें!',
    varieties: '1000+ से भी अधिक वैरायटियों के लिए उपयुक्त आभूषण उपलब्ध',
    subDesc: 'ब्राइडल नेकलेस, फैंसी रिंग्स, कंगन, और मनपसंद डिज़ाइन की पूरी जानकारी देखें।',
    callBtn: 'अभी कॉल करें',
    whatsappBtn: 'WhatsApp',
    viewCatBtn: '✨ कैटलॉग देखें',
    orderBtn: '🛒 आभूषण सूची',
    adminTitle: '🔐 दुकान मालिक लॉगिन (Admin Panel)',
    adminPlaceholder: 'गुप्त पिन दर्ज करें',
    loginBtn: 'लॉगिन करें',
    logoutBtn: 'लॉग आउट',
    adminActive: 'संदीप सोनी - एडमिन पैनल सक्रिय',
    adminDesc: 'यहाँ से आप सीधे गैलरी या कैमरे से नई ज्वेलरी की फोटो अपलोड कर सकते हैं!',
    addItemBtn: '✨ नई ज्वेलरी जोड़ें',
    itemNamePlaceholder: 'ज्वेलरी का नाम (जैसे - फैंसी हार)',
    itemPricePlaceholder: 'कीमत / वजन (जैसे - ₹50,000 या 20 ग्राम)',
    uploadPrompt: 'मोबाइल गैलरी से फोटो चुनें:'
  },
  'English': {
    title: 'S.K. Jewellers, Nehla',
    tagline: '✨ Symbol of Purity & Trust - Hallmark Jewelry ✨',
    welcome: 'Hello Friends! Welcome to your own S.K. Jewellers! 💍',
    desc: '💎 Thousands of satisfied customers have received hallmark gold and silver jewelry from S.K. Jewellers (Nehla). Visit our shop today!',
    varieties: 'Jewelry suitable for 1000+ more varieties available',
    subDesc: 'Check out full details of bridal necklaces, fancy rings, bangles, and favorite designs.',
    callBtn: 'Call Now',
    whatsappBtn: 'WhatsApp',
    viewCatBtn: '✨ View Catalog',
    orderBtn: '🛒 Jewelry List',
    adminTitle: '🔐 Shop Owner Login (Admin Panel)',
    adminPlaceholder: 'Enter Secret PIN',
    loginBtn: 'Login',
    logoutBtn: 'Logout',
    adminActive: 'Sandeep Soni - Admin Panel Active',
    adminDesc: 'You can upload new jewelry photos directly from your gallery or camera here!',
    addItemBtn: '✨ Add New Jewelry',
    itemNamePlaceholder: 'Jewelry Name (e.g. Fancy Necklace)',
    itemPricePlaceholder: 'Price / Weight (e.g. ₹50,000)',
    uploadPrompt: 'Select photo from gallery:'
  }
};

interface JewelryItem {
  id: string;
  name: string;
  price: string;
  image: string;
}

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [lang, setLang] = useState('हिन्दी');
  const t = translations[lang] || translations['हिन्दी'];

  // Initial demo jewelry items
  const [items, setItems] = useState<JewelryItem[]>([
    {
      id: '1',
      name: 'हॉलमार्क ब्राइडल सेट (Bridal Set)',
      price: 'विशेष छूट पर उपलब्ध',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: '2',
      name: 'डिज़ाइनर सोने की अंगूठी (Gold Ring)',
      price: 'हॉलमार्क शुद्धता',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80'
    }
  ]);

  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemImage, setNewItemImage] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin === '989610') {
      setIsAdmin(true);
      toast.success(lang === 'English' ? 'Welcome to Admin Panel!' : 'एडमिन पैनल में स्वागत है!');
    } else {
      toast.error(lang === 'English' ? 'Invalid PIN!' : 'गलत पिन दर्ज किया गया!');
    }
  };

  // Handle image upload from local device gallery / camera
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItemImage(reader.result as string);
        toast.success(lang === 'English' ? 'Photo loaded successfully!' : 'फोटो सफलतापूर्वक चुन ली गई है!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddJewelry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName) {
      toast.error(lang === 'English' ? 'Please enter item name' : 'कृपया ज्वेलरी का नाम दर्ज करें');
      return;
    }

    const newItem: JewelryItem = {
      id: Date.now().toString(),
      name: newItemName,
      price: newItemPrice || 'संपर्क करें',
      image: newItemImage || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80'
    };

    setItems([newItem, ...items]);
    setNewItemName('');
    setNewItemPrice('');
    setNewItemImage('');
    toast.success(lang === 'English' ? 'New jewelry added successfully!' : 'नई ज्वेलरी सफलतापूर्वक जोड़ दी गई है!');
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    toast.success(lang === 'English' ? 'Item removed' : 'आइटम हटा दिया गया है');
  };

  return (
    <Router>
      <div className="min-h-screen bg-white text-gray-900 font-sans">
        
        {/* Top Announcement Bar */}
        <div className="bg-amber-700 text-white text-center py-2 px-4 text-sm font-medium shadow-sm">
          <span>{t.tagline}</span>
        </div>

        {/* Header with Language Dropdown */}
        <header className="bg-white border-b border-stone-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package2 className="w-8 h-8 text-amber-600" />
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                {t.title}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {/* Multi-Language Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-3 text-base font-semibold text-gray-700 bg-stone-100 rounded-xl border border-stone-300 hover:bg-stone-200 min-h-[48px]">
                  <Languages className="w-5 h-5 text-amber-600" />
                  {lang}
                </button>
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-stone-200 hidden group-hover:block z-50">
                  <button onClick={() => setLang('हिन्दी')} className="block w-full text-left px-4 py-3 text-base font-medium hover:bg-amber-50 text-gray-700 rounded-t-xl">हिन्दी</button>
                  <button onClick={() => setLang('English')} className="block w-full text-left px-4 py-3 text-base font-medium hover:bg-amber-50 text-gray-700 rounded-b-xl">English</button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Layout */}
        <main className="max-w-5xl mx-auto px-4 py-6 space-y-8">
          
          {/* Hero Banner Section */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 md:p-8 text-center shadow-sm space-y-4">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              {t.welcome}
            </h2>
            <p className="text-gray-700 font-medium max-w-2xl mx-auto text-base md:text-lg">
              {t.desc}
            </p>
            <div className="text-amber-800 font-semibold text-lg pt-2">
              {t.varieties}
            </div>
            <p className="text-sm text-gray-600">
              {t.subDesc}
            </p>

            {/* Giant Premium Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <a href="tel:9896100000" className="flex items-center justify-center gap-2 bg-amber-700 hover:bg-amber-800 text-white font-bold px-8 py-4 rounded-xl shadow transition text-lg min-h-[56px]">
                <Phone className="w-6 h-6" /> {t.callBtn}
              </a>
              <a href="https://wa.me/919896100000" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 rounded-xl shadow transition text-lg min-h-[56px]">
                <MessageCircle className="w-6 h-6" /> {t.whatsappBtn}
              </a>
            </div>
          </div>

          {/* Catalog Grid Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900 text-center">{t.viewCatBtn}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {items.map((item) => (
                <div key={item.id} className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
                  <div className="h-48 overflow-hidden bg-stone-100">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-lg text-gray-800">{item.name}</h4>
                      <p className="text-amber-700 font-semibold">{item.price}</p>
                    </div>
                    {isAdmin && (
                      <button onClick={() => handleDeleteItem(item.id)} className="mt-2 w-full bg-red-50 text-red-600 hover:bg-red-100 py-2 rounded-xl font-bold flex items-center justify-center gap-2">
                        <Trash2 className="w-4 h-4" /> हटाएँ (Delete)
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Secure Admin Section with Local Gallery Photo Upload */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 max-w-xl mx-auto shadow-sm mt-10">
            {isAdmin ? (
              <div className="space-y-6">
                <div className="text-center space-y-2 border-b border-stone-200 pb-4">
                  <h3 className="text-xl font-bold text-gray-800">{t.adminActive}</h3>
                  <p className="text-sm text-gray-600">{t.adminDesc}</p>
                  <button onClick={() => setIsAdmin(false)} className="px-6 py-2 bg-gray-600 text-white rounded-xl font-bold hover:bg-gray-700 inline-flex items-center gap-2 text-sm">
                    <LogOut className="w-4 h-4" /> {t.logoutBtn}
                  </button>
                </div>

                {/* Form to Add Item with Image Upload */}
                <form onSubmit={handleAddJewelry} className="space-y-4">
                  <h4 className="font-bold text-lg text-amber-800">{t.addItemBtn}</h4>
                  
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder={t.itemNamePlaceholder}
                    className="w-full px-4 py-3 border border-stone-300 rounded-xl text-base focus:ring-2 focus:ring-amber-500 focus:outline-none min-h-[48px]"
                  />

                  <input
                    type="text"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    placeholder={t.itemPricePlaceholder}
                    className="w-full px-4 py-3 border border-stone-300 rounded-xl text-base focus:ring-2 focus:ring-amber-500 focus:outline-none min-h-[48px]"
                  />

                  {/* Native File Upload (Gallery / Camera) */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">{t.uploadPrompt}</label>
                    <div className="flex items-center gap-4">
                      <label className="flex-1 flex items-center justify-center gap-2 px-4 py-4 border-2 border-dashed border-amber-400 bg-amber-50 hover:bg-amber-100 rounded-xl cursor-pointer font-semibold text-amber-800 text-base min-h-[52px]">
                        <ImagePlus className="w-6 h-6" /> गैलरी से फोटो चुनें (Choose Photo)
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                    </div>
                    {newItemImage && (
                      <div className="mt-2 flex items-center gap-3 bg-white p-2 border border-stone-200 rounded-xl">
                        <img src={newItemImage} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />
                        <span className="text-sm font-medium text-green-600">✓ फोटो तैयार है! (Photo Selected)</span>
                      </div>
                    )}
                  </div>

                  <button type="submit" className="w-full bg-amber-700 hover:bg-amber-800 text-white font-bold py-4 rounded-xl shadow transition text-lg min-h-[56px] flex items-center justify-center gap-2">
                    <PlusCircle className="w-6 h-6" /> {t.addItemBtn}
                  </button>
                </form>
              </div>
            ) : (
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <h3 className="text-lg font-bold text-center text-gray-800">{t.adminTitle}</h3>
                <input
                  type="password"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  placeholder={t.adminPlaceholder}
                  className="w-full px-6 py-4 border border-stone-300 rounded-xl text-center text-xl focus:ring-2 focus:ring-amber-500 focus:outline-none min-h-[56px]"
                  required
                />
                <button type="submit" className="w-full bg-stone-800 hover:bg-stone-900 text-white font-bold py-4 rounded-xl shadow transition text-lg min-h-[56px]">
                  {t.loginBtn}
                </button>
              </form>
            )}
          </div>

        </main>

        {/* Footer */}
        <footer className="bg-amber-900 text-amber-100 py-6 mt-16 text-center space-y-2">
          <p className="font-medium">© S.K. Jewellers, नेहला (फतेहाबाद / हरियाणा)</p>
          <p className="text-xs text-amber-300">शुद्धता और भरोसे का प्रतीक - हॉलमार्क आभूषण</p>
        </footer>

        <Toaster position="top-center" richColors />
      </div>
    </Router>
  );
};

export default App;
