import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Package2, Phone, MessageCircle, ShieldCheck, LogOut, ImagePlus, Trash2, PlusCircle, Edit3 } from 'lucide-react';
import { Toaster, toast } from 'sonner';

const translations: Record<string, any> = {
  'हिंदी': {
    title: 'S.K. Jewellers, नेहला',
    tagline: '✨ शुद्धता की गारंटी, आपका विश्वास ✨',
    welcome: '👋 नमस्कार दोस्तों, स्वागत है आपका अपनी एस.के. ज्वेलर्स शॉप, नेहला में! ✨',
    desc: 'सच्चा सोना, पक्का बिल और बेसमिसाल डिज़ाइन - जहाँ आपका विश्वास ही हमारी असली पहचान है। आइए, अपने परिवार के लिए शुद्धता और भरोसे के आभूषण चुनें।',
    varieties: '1000+ से भी अधिक वैराइटीज के लिए उपयुक्त आभूषण।',
    subDesc: 'आकर्षक नेकलेस, फैंसी रिंग, केंसर, और शानदार डिज़ाइनूर गहनों की पूरी जानकारी देखें।',
    callBtn: '📞 कॉल करें',
    whatsappBtn: '💬 WhatsApp',
    viewCatalog: '🔍 ज्वेलरी - सभी डिज़ाइन देखें',
    orderBtn: '🛒 आर्डर नाउ - आभूषण आर्डर करें',
    adminTitle: '🔐 दुकान मालिक लॉगिन (Admin Panel)',
    adminPlaceholder: 'गुप्त पिन दर्ज करें',
    loginBtn: '🔐 लॉगिन करें',
    logoutBtn: '🚪 लॉगिन आउट',
    adminActive: '📊 संदीप सोनी - एडमिन पैनल सक्रिय',
    adminDesc: 'यहाँ से आप नई ज्वेलरी या गहनों की फोटो अपलोड कर सकते हैं, कीमत बदल सकते हैं या डिलीट कर सकते हैं।',
    addItemButton: '➕ नई ज्वेलरी जोड़ें',
    itemNamePlaceholder: 'ज्वेलरी का नाम (जैसे - फैंसी हार)',
    itemPricePlaceholder: 'कीमत / वजन (जैसे - ₹50,000 या 20 gram)',
    uploadPrompt: 'मोबाइल गैलरी से फोटो चुनें:',
  },
  'English': {
    title: 'S.K. Jewellers, Nehla',
    tagline: '✨ Symbol of Purity & Trust - Hallmark Jewelry ✨',
    welcome: '👋 Hello Friends! Welcome to your own S.K. Jewellers Shop, Nehla! 🛡️',
    desc: 'True gold, clean billing, and unmatched designs - where your trust is our real identity. Come and choose jewelry for your family.',
    varieties: 'Jewelry showroom suitable for 1000+ more varieties available.',
    subDesc: 'Check out full details of bridal necklaces, fancy rings, bangles, and favorite designs.',
    callBtn: '📞 Call Now',
    whatsappBtn: '💬 WhatsApp',
    viewCatalog: '🔍 View Catalog',
    orderBtn: '🛒 Order Now',
    adminTitle: '🔐 Shop Owner Login (Admin Panel)',
    adminPlaceholder: 'Enter Secret PIN',
    loginBtn: '🔐 Login',
    logoutBtn: 'Logout',
    adminActive: '📊 Sandeep Soni - Admin Panel Active',
    adminDesc: 'You can upload new jewelry photos directly from your gallery or camera here.',
    addItemButton: '+ Add New Jewelry',
    itemNamePlaceholder: 'Jewelry Name (e.g. Fancy Necklace)',
    itemPricePlaceholder: 'Price / Weight (e.g. ₹50,000)',
    uploadPrompt: 'Select photo from gallery:',
  }
};

interface JewelryItem {
  id: string;
  name: string;
  price: string;
  image: string;
  karat: string;
}

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [lang, setLang] = useState('हिंदी');
  const t = translations[lang] || translations['हिंदी'];

  const [items, setItems] = useState<JewelryItem[]>([
    {
      id: '1',
      name: 'ब्राइडल नेकलेस सेट (Bridal Set)',
      price: 'विशेष छूट पर उपलब्ध',
      karat: '22K',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: '2',
      name: 'डिज़ाइनर सोने की अंगूठी (Gold Ring)',
      karat: '22K',
      price: 'हॉलमार्क शुद्धता',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80'
    }
  ]);

  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemKarat, setNewItemKarat] = useState('22K');
  const [newItemImage, setNewItemImage] = useState('https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80');

  const [editingId, setEditingId] = useState<string | null>(null);

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

    if (editingId) {
      setItems(items.map(item => item.id === editingId ? { ...item, name: newItemName, price: newItemPrice, karat: newItemKarat, image: newItemImage } : item));
      toast.success(lang === 'English' ? 'Jewelry updated successfully!' : 'ज्वेलरी सफलतापूर्वक अपडेट कर दी गई है!');
      setEditingId(null);
    } else {
      const newItem: JewelryItem = {
        id: Date.now().toString(),
        name: newItemName,
        price: newItemPrice || 'मूल्य पूछें',
        karat: newItemKarat,
        image: newItemImage
      };
      setItems([newItem, ...items]);
      toast.success(lang === 'English' ? 'New jewelry added successfully!' : 'नई ज्वेलरी सफलतापूर्वक जोड़ दी गई है!');
    }

    setNewItemName('');
    setNewItemPrice('');
    setNewItemKarat('22K');
    setNewItemImage('https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80');
  };

  const handleEditItem = (item: JewelryItem) => {
    setEditingId(item.id);
    setNewItemName(item.name);
    setNewItemPrice(item.price);
    setNewItemKarat(item.karat);
    setNewItemImage(item.image);
    window.scrollTo({ top: 500, behavior: 'smooth' });
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    toast.success(lang === 'English' ? 'Item removed' : 'आइटम हटा दिया गया है');
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin === '989610') {
      setIsAdmin(true);
      toast.success(lang === 'English' ? 'Welcome to Admin Panel' : 'एडमिन पैनल में स्वागत है!');
    } else {
      toast.error(lang === 'English' ? 'Invalid PIN!' : 'गलत पिन दर्ज किया गया!');
    }
  };

  const sendWhatsAppBill = (item: JewelryItem) => {
    const customerMobile = prompt(lang === 'English' ? "Enter Customer's WhatsApp Number (10 digits):" : "ग्राहक का 10 अंकों का व्हाट्सएप नंबर दर्ज करें:");
    if (!customerMobile || customerMobile.length !== 10) {
      toast.error(lang === 'English' ? 'Invalid mobile number!' : 'गलत मोबाइल नंबर!');
      return;
    }
    const billMessage = `✨ S.K. Jewellers, नेहला (हरियाणा) ✨\n\nनमस्ते जी, हमारी दुकान से खरीदारी करने के लिए आपका धन्यवाद!\n\n🛍️ आभूषण खरीद विवरण:\n• नाम: ${item.name}\n• शुद्धता/कैरेट: ${item.karat}\n• मूल्य/विवरण: ${item.price}\n\n🙏 'यहाँ विश्वास ही हमारी असली पहचान है।' 🙏\nदिनांक: ${new Date().toLocaleDateString()}`;
    const url = `https://wa.me/91${customerMobile}?text=${encodeURIComponent(billMessage)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Toaster position="top-center" richColors />

      
      <div className="bg-gradient-to-r from-amber-700 to-amber-900 text-white text-center py-2 px-4 text-sm font-medium shadow-sm">
        <span>{t.tagline}</span>
      </div>

      
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package2 className="w-8 h-8 text-amber-600" />
            <h1 className="text-2xl font-bold tracking-tight text-amber-700">{t.title}</h1>
          </div>

          <div className="flex items-center gap-4">
            
            <div className="relative">
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-semibold bg-white cursor-pointer focus:outline-none focus:border-amber-500"
              >
                <option value="हिंदी">हिंदी</option>
                <option value="English">English</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      
      <main className="max-w-5xl mx-auto px-4 py-6 space-y-8">
        
        
        <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-6 text-center space-y-4">
          <h2 className="text-xl md:text-2xl font-extrabold text-amber-800">{t.welcome}</h2>
          <p className="text-gray-700 font-medium max-w-2xl mx-auto text-sm md:text-base">{t.desc}</p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a href="tel:+919896102764" className="btn button-premium btn-call w-full sm:w-auto">{t.callBtn}</a>
            <a href="https://wa.me/919896102764" target="_blank" rel="noopener noreferrer" className="btn button-premium btn-whatsapp w-full sm:w-auto">{t.whatsappBtn}</a>
          </div>
        </div>

        
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          {!isAdmin ? (
            <form onSubmit={handleAdminLogin} className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="password"
                placeholder={t.adminPlaceholder}
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                className="px-3 py-2 border rounded-lg text-sm w-full sm:w-48"
              />
              <button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm whitespace-nowrap">
                {t.loginBtn}
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-between w-full">
              <div>
                <h3 className="font-bold text-amber-800 text-base">{t.adminActive}</h3>
                <p className="text-xs text-gray-600">कुल जोड़ी गई ज्वेलरी: <span className="font-bold text-amber-700">{items.length}</span></p>
              </div>
              <button onClick={() => setIsAdmin(false)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1">
                <LogOut className="w-4 h-4" /> {t.logoutBtn}
              </button>
            </div>
          )}
        </div>

        
        {isAdmin && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 shadow-md space-y-4">
            <h3 className="text-lg font-bold text-amber-900 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-amber-700" />
              {editingId ? 'ज्वेलरी अपडेट करें (Edit Jewelry)' : t.addItemButton}
            </h3>
            <form onSubmit={handleAddJewelry} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">आभूषण नाम (Name)</label>
                <input
                  type="text"
                  placeholder={t.itemNamePlaceholder}
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">कीमत या वजन (Price/Weight)</label>
                <input
                  type="text"
                  placeholder={t.itemPricePlaceholder}
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">शुद्धता (Karat)</label>
                <select
                  value={newItemKarat}
                  onChange={(e) => setNewItemKarat(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                >
                  <option value="22K">22K हॉलमार्क</option>
                  <option value="18K">18K हॉलमार्क</option>
                  <option value="916 Gold">916 Gold</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">फोटो अपलोड करें (Upload Image)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-700 hover:file:bg-amber-200"
                />
              </div>
              <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                {editingId && (
                  <button type="button" onClick={() => { setEditingId(null); setNewItemName(''); setNewItemPrice(''); }} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-bold">
                    रद्द करें (Cancel)
                  </button>
                )}
                <button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg text-sm font-bold shadow">
                  {editingId ? 'बदलाव सेव करें (Update)' : 'सूची में जोड़ें (Save)'}
                </button>
              </div>
            </form>
          </div>
        )}

        
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
            💎 {lang === 'English' ? 'Our Exclusive Designs' : 'हमारे विशेष आभूषण डिज़ाइन'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
                <div className="h-48 overflow-hidden bg-stone-100 flex items-center justify-center relative">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  <span className="absolute top-2 right-2 bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-full shadow">
                    {item.karat}
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  <h4 className="font-bold text-gray-800 line-clamp-2">{item.name}</h4>
                  <p className="text-amber-700 font-bold text-sm">💰 {item.price}</p>

                  
                  <div className="flex gap-2 pt-2">
                    <button onClick={() => sendWhatsAppBill(item)} className="btn button-premium btn-whatsapp flex-1 text-xs py-2">
                      💬 WhatsApp बिल
                    </button>
                    {isAdmin && (
                      <>
                        <button onClick={() => handleEditItem(item)} className="bg-blue-50 text-blue-600 hover:bg-blue-100 p-2 rounded-lg text-xs font-bold flex items-center justify-center" title="Edit">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteItem(item.id)} className="bg-red-50 text-red-600 hover:bg-red-100 p-2 rounded-lg text-xs font-bold flex items-center justify-center" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      
      <footer className="bg-amber-900 text-white text-center py-6 mt-12 text-sm space-y-1">
        <p>© S.K. Jewellers, नेहला (फतेहाबाद)</p>
        <p className="text-amber-200 text-xs">✨ शुद्धता, पक्का बिल और ग्राहकों का अटूट विश्वास ✨</p>
      </footer>
    </div>
  );
}
