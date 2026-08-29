import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Package2, Phone, MessageCircle, ShieldCheck, LogOut, ImagePlus, Trash2, PlusCircle } from 'lucide-react';
import { Toaster, toast } from 'sonner';

const translations: Record<string, any> = {
  'हिंदी': {
    title: 'S.K. Jewellers, नेहला',
    tagline: '✨ शुद्धता की गारंटी, परंपरा का विश्वास ✨',
    welcome: '👋 नमस्कार दोस्तों, स्वागत है आपका अपनी एस.के. ज्वैलर्स शॉप, नेहला में! ✨',
    desc: 'सच्चा सोना, पक्का बिल और बेमिसाल डिज़ाइन – जहाँ आपका विश्वास ही हमारी असली पहचान है। आइए, और अपने परिवार के लिए शुद्धता और भरोसे के गहने चुनिए। 🙏',
    varieties: '1000+ से भी अधिक वैरायटीज़ के लिए उपयुक्त आभूषण शोरूम।',
    subDesc: 'आकर्षक नेकलेस, फैंसी रिंग, कंगन, और शानदार डिज़ाइनों की पूरी जानकारी देखें।',
    callBtn: '📞 कॉल करें',
    whatsappBtn: '💬 WhatsApp',
    viewCatalog: '🔍 कैटलॉग देखें',
    orderBtn: '🛒 आभूषण चुनें',
    adminTitle: '👑 दुकान मालिक लॉगिन (Admin Panel)',
    adminPlaceholder: 'गुप्त पिन दर्ज करें',
    loginBtn: 'लॉगिन करें',
    logoutBtn: 'लॉगिन आउट',
    adminActive: 'संदीप सोनी - एडमिन पैनल सक्रिय',
    adminDesc: 'यहाँ से आप सीधे गैलरी या कैमरे से नई ज्वेलरी की फोटो अपलोड कर सकते हैं।',
    addItemBtn: '➕ नई ज्वेलरी जोड़ें',
    itemNamePlaceholder: 'ज्वेलरी का नाम (जैसे - फैंसी हार)',
    itemPricePlaceholder: 'कीमत / वजन (जैसे - ₹50,000 या 20 gram)',
    uploadPrompt: 'मोबाइल गैलरी से फोटो चुनें:',
  },
  'English': {
    title: 'S.K. Jewellers, Nehla',
    tagline: '✨ Symbol of Purity & Trust - Hallmark Jewelry ✨',
    welcome: 'Hello Friends! Welcome to your own S.K. Jewellers Shop, Nehla! 👋',
    desc: 'True gold, clean billing, and unmatched designs – where your trust is our real identity. Come and choose jewelry of purity and trust for your family. 🙏',
    varieties: 'Jewelry showroom suitable for 1000+ more varieties available.',
    subDesc: 'Check out full details of bridal necklaces, fancy rings, bangles, and favorite designs.',
    callBtn: '📞 Call Now',
    whatsappBtn: '💬 WhatsApp',
    viewCatalog: '🔍 View Catalog',
    orderBtn: '🛒 Order Now',
    adminTitle: 'Shop Owner Login (Admin Panel)',
    adminPlaceholder: 'Enter Secret PIN',
    loginBtn: 'Login',
    logoutBtn: 'Logout',
    adminActive: 'Sandeep Soni - Admin Panel Active',
    adminDesc: 'You can upload new jewelry photos directly from your gallery or camera here.',
    addItemBtn: '➕ Add New Jewelry',
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

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [lang, setLang] = useState('हिंदी');
  const t = translations[lang] || translations['हिंदी'];

  const [items, setItems] = useState<JewelryItem[]>([
    {
      id: '1',
      name: 'ब्राइडल नैकलेस सेट (Bridal Set)',
      price: 'विशेष छूट पर उपलब्ध',
      karat: '22K',
      image: 'https://unsplash.com'
    },
    {
      id: '2',
      name: 'डिजाइनर सोने की अंगूठी (Gold Ring)',
      price: 'हॉलमार्क शुद्धता',
      karat: '22K',
      image: 'https://unsplash.com'
    }
  ]);

  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemKarat, setNewItemKarat] = useState('22K');
  const [newItemImage, setNewItemImage] = useState('');

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
      karat: newItemKarat,
      image: newItemImage || 'https://unsplash.com'
    };

    setItems([newItem, ...items]);
    setNewItemName('');
    setNewItemPrice('');
    setNewItemKarat('22K');
    setNewItemImage('');
    toast.success(lang === 'English' ? 'New jewelry added successfully!' : 'नई ज्वेलरी सफलतापूर्वक जोड़ दी गई है!');
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

  // 🧾 ग्राहक के नंबर पर डायनेमिक व्हाट्सएप बिल भेजने का फंक्शन
  const sendWhatsAppBill = (item: JewelryItem) => {
    const customerMobile = prompt(lang === 'English' ? "Enter Customer's WhatsApp Number (10 digits):" : "ग्राहक का 10 अंकों का व्हाट्सएप नंबर दर्ज करें:");
    if (!customerMobile || customerMobile.length !== 10) {
      toast.error(lang === 'English' ? "Invalid mobile number!" : "गलत मोबाइल नंबर!");
      return;
    }

    const billMessage = `✨ *S.K. Jewellers, नेहला (हरियाणा)* ✨\n\nनमस्ते जी, हमारी दुकान से खरीदारी करने के लिए आपका धन्यवाद!\n\n*🧾 आभूषण खरीद विवरण:*\n• मद/नाम: ${item.name}\n• शुद्धता/कैरेट: ${item.karat}\n• मूल्य/विवरण: ${item.price}\n\n*जहाँ विश्वास ही हमारी पहचान है।* 🙏\nतारीख: ${new Date().toLocaleDateString()}`;
    const url = `https://wa.me{customerMobile}?text=${encodeURIComponent(billMessage)}`;
    window.open(url, '_blank');
  };

  return (
    <Router>
      <div class="min-h-screen bg-white text-gray-900 font-sans">
        
        {/* Top Announcement Bar */}
        <div class="bg-gradient-to-r from-amber-700 to-amber-900 text-white text-center py-2 px-4 text-sm font-medium shadow-sm">
          <span>{t.tagline}</span>
        </div>

        {/* Header Setup */}
        <header class="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
          <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Package2 class="w-8 h-8 text-amber-600" />
              <h1 class="text-2xl font-bold tracking-tight text-amber-700">{t.title}</h1>
            </div>

            {/* Multi-Language Dropdown */}
            <div class="relative group">
              <select 
                value={lang} 
                onChange={(e) => setLang(e.target.value)}
                class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-semibold bg-white cursor-pointer focus:outline-none focus:border-amber-600"
              >
                <option value="हिंदी">हिन्दी</option>
                <option value="English">English</option>
              </select>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main class="max-w-5xl mx-auto px-4 py-6 space-y-8">
          
          {/* Hero Banner Section */}
          <div class="bg-amber-50/50 border border-amber-100 rounded-2xl p-6 text-center space-y-4">
            <h2 class="text-xl md:text-2xl font-extrabold text-amber-800">{t.welcome}</h2>
            <p class="text-gray-700 font-medium max-w-2xl mx-auto text-sm md:text-base">{t.desc}</p>
            <div class="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a href="tel:+919896102704" class="btn button-premium btn-call w-full sm:w-auto">{t.callBtn}</a>
            </div>
          </div>

          {/* Catalog Grid Section */}
          <div class="space-y-4">
            <h3 class="text-xl font-bold text-gray-800 border-b pb-2 flex items-center gap-2">💎 {lang === 'English' ? 'Our Exclusive Designs' : 'हमारे विशेष आभूषण डिज़ाइन'}</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {items.map((item) => (
                <div key={item.id} class="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
                  <div class="h-48 overflow-hidden bg-stone-100 flex items-center justify-center">
                    <img src={item.image} alt={item.name} class="w-full h-full object-cover" />
                  </div>
                  <div class="p-4 space-y-3">
                    <div class="flex items-start justify-between gap-2">
                      <h4 class="font-bold text-gray-850 line-clamp-2">{item.name}</h4>
                      <span class="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-md shrink-0">{item.karat}</span>
                    </div>
                    <p class="text-amber-700 font-bold text-sm">{item.price}</p>
                    
                    {/* Action Buttons */}
                    <div class="flex gap-2 pt-1">
                      <button onClick={() => sendWhatsAppBill(item)} class="btn button-premium btn-whatsapp flex-1 text-sm">{t.whatsappBtn}</button>
                    </div>

                    {isAdmin && (
    </div>
  );
}
