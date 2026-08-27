import { useEffect, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import {
  getGetAdminSummaryQueryKey,
  getGetProductQueryKey,
  getListOrdersQueryKey,
  getListProductsQueryKey,
  setAuthTokenGetter,
  useAdminLogin,
  useCreateOrder,
  useCreateProduct,
  useDeleteProduct,
  useGetAdminSummary,
  useGetProduct,
  useListOrders,
  useListProducts,
  useUpdateOrderStatus,
  useUpdateProduct,
  type Order,
  type OrderStatusUpdateStatus,
  type Product,
} from '@workspace/api-client-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  ArrowLeft,
  ArrowRight,
  Box,
  Check,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  Copy,
  Edit3,
  ExternalLink,
  Heart,
  LayoutDashboard,
  Loader2,
  LockKeyhole,
  LogOut,
  Menu,
  Minus,
  PackageCheck,
  Phone,
  Plus,
  ReceiptText,
  Search,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trash2,
  Truck,
  UserRound,
  X,
} from 'lucide-react';
import { Link, Route, Switch, Router as WouterRouter, useLocation } from 'wouter';

const queryClient = new QueryClient();
const STORE_PHONE = import.meta.env.VITE_STORE_PHONE || '+91 98961 02704';

type Language = 'en' | 'hi' | 'pa' | 'bn';
type Dictionary = Record<string, string>;

const dictionary: Record<Language, Dictionary> = {
  en: {
    location: 'Nehla · Bhuna · Fatehabad',
    navCollection: 'The collection',
    navStory: 'Our house',
    navAdmin: 'Store desk',
    welcomeEyebrow: 'A private jeweller, close to home',
    welcomeBanner: 'Namaskar friends, welcome to your own jewellery shop SK Jewellers, Nehla, Bhuna, Fatehabad, Haryana.',
    welcomeTitle: 'Pieces with a quiet point of view.',
    heroA: 'Jewellery for',
    heroB: 'your chapter.',
    since: 'Since 1998 · Nehla',
    artLine1: 'The art of',
    artLine2: 'being remembered.',
    houseTitleA: 'Not a showroom.',
    houseTitleB: 'A familiar room.',
    houseBody: 'We keep the conversation personal, the gold honest, and the choices unhurried.',
    welcomeBody: 'Hand-finished gold and heirloom-worthy details, selected with the care of a family ledger.',
    browse: 'Browse the collection',
    whatsapp: 'WhatsApp the store',
    call: 'Call the store',
    featured: 'The edit',
    featuredCaption: 'Small-batch pieces, considered for everyday celebrations.',
    viewPiece: 'View piece',
    detailAction: 'Detail',
    inStock: 'In stock',
    lowStock: 'Only a few left',
    soldOut: 'Currently reserved',
    allPieces: 'All pieces',
    rings: 'Rings',
    chains: 'Chains',
    earrings: 'Earrings',
    bracelets: 'Bracelets',
    noPieces: 'The ledger is between entries.',
    noPiecesBody: 'Our newest pieces are being recorded. Speak to the store for a private preview.',
    loadError: 'The collection could not be opened.',
    retry: 'Try again',
    details: 'Piece details',
    close: 'Close',
    karat: 'Purity',
    weight: 'Approx. weight',
    sku: 'Ledger no.',
    addToEnquiry: 'Enquire to purchase',
    saved: 'Saved',
    share: 'Share',
    copied: 'Link copied',
    checkout: 'Checkout enquiry',
    checkoutBody: 'Leave your details and SK Jewellers will confirm availability personally.',
    fullName: 'Full name',
    phone: 'Mobile number',
    address: 'Delivery address',
    quantity: 'Quantity',
    placeOrder: 'Send enquiry',
    sending: 'Sending…',
    orderReceived: 'Your enquiry is with us.',
    orderReceivedBody: 'A member of the SK Jewellers family will call shortly to confirm the details.',
    reference: 'Reference',
    backCollection: 'Back to collection',
    language: 'Language',
    footerLine: 'A family jeweller in Nehla, Haryana.',
    storeHours: 'Open today · 10:00 to 19:30',
    adminDesk: 'Store desk',
    adminLogin: 'Sign in to the store desk',
    adminLoginBody: 'A private view of inventory and every new enquiry.',
    sixDigitPin: '6-digit PIN',
    signIn: 'Open desk',
    signingIn: 'Checking…',
    loginError: 'Those details did not match our ledger.',
    inventory: 'Inventory',
    orders: 'Incoming orders',
    overview: 'Overview',
    signOut: 'Sign out',
    products: 'Products',
    lowStockItems: 'Low stock',
    pending: 'Pending',
    orderValue: 'Order value',
    addPiece: 'Add a piece',
    editPiece: 'Edit piece',
    deletePiece: 'Delete piece',
    deleteConfirm: 'Remove this piece from the ledger?',
    deleteBody: 'This cannot be undone.',
    cancel: 'Cancel',
    savePiece: 'Save piece',
    saving: 'Saving…',
    productId: 'Product ID',
    productName: 'Name',
    imageUrl: 'Image URL',
    price: 'Price',
    stock: 'Stock',
    noOrders: 'No incoming orders yet.',
    noOrdersBody: 'New customer enquiries will appear here.',
    customer: 'Customer',
    item: 'Item',
    amount: 'Amount',
    status: 'Status',
    updateStatus: 'Update status',
    confirmed: 'Confirmed',
    dispatched: 'Dispatched',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    pendingStatus: 'Pending',
    previous: 'Previous',
    next: 'Next',
    protected: 'Protected store area',
    sendBill: 'Send bill',
  },
  hi: {
    location: 'नेहला · भूना · फतेहाबाद',
    navCollection: 'संग्रह',
    navStory: 'हमारा घर',
    navAdmin: 'स्टोर डेस्क',
    welcomeEyebrow: 'आपके पास का निजी जौहरी',
    welcomeBanner: 'नमस्कार दोस्तों, स्वागत है आपकी अपनी ज्वेलरी शॉप SK Jewellers, नेहला, भूना, फतेहाबाद, हरियाणा में।',
    welcomeTitle: 'हर टुकड़े की अपनी शांत पहचान।',
    heroA: 'आपके अध्याय के',
    heroB: 'आभूषण।',
    since: '1998 से · नेहला',
    artLine1: 'याद रह जाने',
    artLine2: 'की कला।',
    houseTitleA: 'शोरूम नहीं।',
    houseTitleB: 'अपना सा कमरा।',
    houseBody: 'हम बातचीत को व्यक्तिगत, सोने को ईमानदार और चुनाव को बेझिझक रखते हैं।',
    welcomeBody: 'हाथ से तैयार सोना और विरासत जैसे बारीक काम, परिवार की बहियों जैसी सावधानी से चुने हुए।',
    browse: 'संग्रह देखें',
    whatsapp: 'व्हाट्सऐप करें',
    call: 'स्टोर को कॉल करें',
    featured: 'विशेष चयन',
    featuredCaption: 'रोज़मर्रा की खुशियों के लिए चुने हुए छोटे-बैच आभूषण।',
    viewPiece: 'देखें',
    detailAction: 'विवरण',
    inStock: 'उपलब्ध',
    lowStock: 'कुछ ही शेष',
    soldOut: 'अभी आरक्षित',
    allPieces: 'सभी',
    rings: 'अंगूठियां',
    chains: 'चेन',
    earrings: 'बालियां',
    bracelets: 'कंगन',
    noPieces: 'बही में अगली प्रविष्टि बाकी है।',
    noPiecesBody: 'नए आभूषण दर्ज हो रहे हैं। निजी दिखाने के लिए स्टोर से बात करें।',
    loadError: 'संग्रह नहीं खुल सका।',
    retry: 'फिर कोशिश करें',
    details: 'आभूषण विवरण',
    close: 'बंद करें',
    karat: 'शुद्धता',
    weight: 'लगभग वजन',
    sku: 'बही नंबर',
    addToEnquiry: 'खरीदने के लिए पूछें',
    saved: 'सहेजा गया',
    share: 'साझा करें',
    copied: 'लिंक कॉपी हो गया',
    checkout: 'खरीद पूछताछ',
    checkoutBody: 'जानकारी छोड़ें, SK Jewellers व्यक्तिगत रूप से उपलब्धता की पुष्टि करेगा।',
    fullName: 'पूरा नाम',
    phone: 'मोबाइल नंबर',
    address: 'पता',
    quantity: 'मात्रा',
    placeOrder: 'पूछताछ भेजें',
    sending: 'भेज रहे हैं…',
    orderReceived: 'आपकी पूछताछ हमारे पास है।',
    orderReceivedBody: 'SK Jewellers परिवार का सदस्य जल्द ही विवरण की पुष्टि के लिए कॉल करेगा।',
    reference: 'संदर्भ',
    backCollection: 'संग्रह पर लौटें',
    language: 'भाषा',
    footerLine: 'नेहला, हरियाणा का पारिवारिक जौहरी।',
    storeHours: 'आज खुला · 10:00 से 19:30',
    adminDesk: 'स्टोर डेस्क',
    adminLogin: 'स्टोर डेस्क में प्रवेश',
    adminLoginBody: 'इन्वेंटरी और हर नई पूछताछ का निजी दृश्य।',
    sixDigitPin: '6 अंकों का पिन',
    signIn: 'डेस्क खोलें',
    signingIn: 'जांच रहे हैं…',
    loginError: 'ये विवरण हमारी बही से मेल नहीं खाते।',
    inventory: 'इन्वेंटरी',
    orders: 'आने वाले ऑर्डर',
    overview: 'अवलोकन',
    signOut: 'बाहर निकलें',
    products: 'उत्पाद',
    lowStockItems: 'कम स्टॉक',
    pending: 'लंबित',
    orderValue: 'ऑर्डर मूल्य',
    addPiece: 'आभूषण जोड़ें',
    editPiece: 'आभूषण संपादित करें',
    deletePiece: 'आभूषण हटाएं',
    deleteConfirm: 'इस आभूषण को बही से हटाएं?',
    deleteBody: 'इसे वापस नहीं किया जा सकता।',
    cancel: 'रद्द करें',
    savePiece: 'सहेजें',
    saving: 'सहेज रहे हैं…',
    productId: 'उत्पाद आईडी',
    productName: 'नाम',
    imageUrl: 'चित्र URL',
    price: 'कीमत',
    stock: 'स्टॉक',
    noOrders: 'अभी कोई ऑर्डर नहीं।',
    noOrdersBody: 'नई ग्राहक पूछताछ यहां दिखेगी।',
    customer: 'ग्राहक',
    item: 'आभूषण',
    amount: 'राशि',
    status: 'स्थिति',
    updateStatus: 'स्थिति बदलें',
    confirmed: 'पुष्टि हुई',
    dispatched: 'भेजा गया',
    delivered: 'पहुंचा दिया',
    cancelled: 'रद्द',
    pendingStatus: 'लंबित',
    previous: 'पिछला',
    next: 'अगला',
    protected: 'सुरक्षित स्टोर क्षेत्र',
    sendBill: 'बिल भेजें',
  },
  pa: {
    location: 'ਨੇਹਲਾ · ਭੂਨਾ · ਫਤਿਹਾਬਾਦ',
    navCollection: 'ਸੰਗ੍ਰਹਿ',
    navStory: 'ਸਾਡਾ ਘਰ',
    navAdmin: 'ਸਟੋਰ ਡੈਸਕ',
    welcomeEyebrow: 'ਤੁਹਾਡੇ ਨੇੜੇ ਨਿੱਜੀ ਜੌਹਰੀ',
    welcomeBanner: 'ਨਮਸਕਾਰ ਦੋਸਤੋ, ਤੁਹਾਡੀ ਆਪਣੀ ਜਵੈਲਰੀ ਸ਼ਾਪ SK Jewellers, ਨੇਹਲਾ, ਭੂਨਾ, ਫਤਿਹਾਬਾਦ, ਹਰਿਆਣਾ ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ।',
    welcomeTitle: 'ਹਰ ਗਹਿਣੇ ਦੀ ਆਪਣੀ ਸ਼ਾਂਤ ਪਹਿਚਾਣ।',
    heroA: 'ਤੁਹਾਡੇ ਅਧਿਆਇ ਲਈ',
    heroB: 'ਗਹਿਣੇ।',
    since: '1998 ਤੋਂ · ਨੇਹਲਾ',
    artLine1: 'ਯਾਦ ਰਹਿ ਜਾਣ',
    artLine2: 'ਦੀ ਕਲਾ।',
    houseTitleA: 'ਸ਼ੋਰੂਮ ਨਹੀਂ।',
    houseTitleB: 'ਆਪਣਾ ਜਿਹਾ ਕਮਰਾ।',
    houseBody: 'ਅਸੀਂ ਗੱਲਬਾਤ ਨੂੰ ਨਿੱਜੀ, ਸੋਨੇ ਨੂੰ ਸੱਚਾ ਅਤੇ ਚੋਣਾਂ ਨੂੰ ਬੇਝਿਜਕ ਰੱਖਦੇ ਹਾਂ।',
    welcomeBody: 'ਹੱਥ ਨਾਲ ਬਣਾਇਆ ਸੋਨਾ ਅਤੇ ਵਿਰਾਸਤ ਵਰਗਾ ਨਾਜ਼ੁਕ ਕੰਮ, ਪਰਿਵਾਰ ਦੀ ਬਹੀ ਵਾਂਗ ਧਿਆਨ ਨਾਲ ਚੁਣਿਆ।',
    browse: 'ਸੰਗ੍ਰਹਿ ਵੇਖੋ',
    whatsapp: 'ਵਟਸਐਪ ਕਰੋ',
    call: 'ਸਟੋਰ ਨੂੰ ਕਾਲ ਕਰੋ',
    featured: 'ਖਾਸ ਚੋਣ',
    featuredCaption: 'ਰੋਜ਼ ਦੀਆਂ ਖੁਸ਼ੀਆਂ ਲਈ ਚੁਣੇ ਛੋਟੇ-ਬੈਚ ਗਹਿਣੇ।',
    viewPiece: 'ਵੇਖੋ',
    detailAction: 'ਵੇਰਵਾ',
    inStock: 'ਉਪਲਬਧ',
    lowStock: 'ਕੁਝ ਹੀ ਬਾਕੀ',
    soldOut: 'ਹੁਣ ਰਾਖਵਾਂ',
    allPieces: 'ਸਾਰੇ',
    rings: 'ਅੰਗੂਠੀਆਂ',
    chains: 'ਚੇਨਾਂ',
    earrings: 'ਬਾਲੀਆਂ',
    bracelets: 'ਕੜੇ',
    noPieces: 'ਬਹੀ ਵਿੱਚ ਅਗਲੀ ਐਂਟਰੀ ਦੀ ਉਡੀਕ ਹੈ।',
    noPiecesBody: 'ਨਵੇਂ ਗਹਿਣੇ ਦਰਜ ਹੋ ਰਹੇ ਹਨ। ਨਿੱਜੀ ਝਲਕ ਲਈ ਸਟੋਰ ਨਾਲ ਗੱਲ ਕਰੋ।',
    loadError: 'ਸੰਗ੍ਰਹਿ ਖੁੱਲ੍ਹ ਨਹੀਂ ਸਕਿਆ।',
    retry: 'ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼',
    details: 'ਗਹਿਣੇ ਦਾ ਵੇਰਵਾ',
    close: 'ਬੰਦ',
    karat: 'ਸ਼ੁੱਧਤਾ',
    weight: 'ਲਗਭਗ ਭਾਰ',
    sku: 'ਬਹੀ ਨੰਬਰ',
    addToEnquiry: 'ਖਰੀਦ ਲਈ ਪੁੱਛੋ',
    saved: 'ਸੰਭਾਲਿਆ',
    share: 'ਸਾਂਝਾ ਕਰੋ',
    copied: 'ਲਿੰਕ ਕਾਪੀ ਹੋ ਗਿਆ',
    checkout: 'ਖਰੀਦ ਪੁੱਛਗਿੱਛ',
    checkoutBody: 'ਆਪਣੀ ਜਾਣਕਾਰੀ ਛੱਡੋ, SK Jewellers ਖੁਦ ਉਪਲਬਧਤਾ ਦੀ ਪੁਸ਼ਟੀ ਕਰੇਗਾ।',
    fullName: 'ਪੂਰਾ ਨਾਮ',
    phone: 'ਮੋਬਾਈਲ ਨੰਬਰ',
    address: 'ਪਤਾ',
    quantity: 'ਗਿਣਤੀ',
    placeOrder: 'ਪੁੱਛਗਿੱਛ ਭੇਜੋ',
    sending: 'ਭੇਜ ਰਹੇ ਹਾਂ…',
    orderReceived: 'ਤੁਹਾਡੀ ਪੁੱਛਗਿੱਛ ਸਾਡੇ ਕੋਲ ਹੈ।',
    orderReceivedBody: 'SK Jewellers ਪਰਿਵਾਰ ਦਾ ਮੈਂਬਰ ਜਲਦੀ ਹੀ ਵੇਰਵਿਆਂ ਦੀ ਪੁਸ਼ਟੀ ਲਈ ਕਾਲ ਕਰੇਗਾ।',
    reference: 'ਹਵਾਲਾ',
    backCollection: 'ਸੰਗ੍ਰਹਿ ’ਤੇ ਵਾਪਸ',
    language: 'ਭਾਸ਼ਾ',
    footerLine: 'ਨੇਹਲਾ, ਹਰਿਆਣਾ ਦਾ ਪਰਿਵਾਰਕ ਜੌਹਰੀ।',
    storeHours: 'ਅੱਜ ਖੁੱਲ੍ਹਾ · 10:00 ਤੋਂ 19:30',
    adminDesk: 'ਸਟੋਰ ਡੈਸਕ',
    adminLogin: 'ਸਟੋਰ ਡੈਸਕ ਵਿੱਚ ਦਾਖਲ ਹੋਵੋ',
    adminLoginBody: 'ਇਨਵੈਂਟਰੀ ਅਤੇ ਹਰ ਨਵੀਂ ਪੁੱਛਗਿੱਛ ਦਾ ਨਿੱਜੀ ਦ੍ਰਿਸ਼।',
    sixDigitPin: '6 ਅੰਕਾਂ ਦਾ ਪਿਨ',
    signIn: 'ਡੈਸਕ ਖੋਲ੍ਹੋ',
    signingIn: 'ਜਾਂਚ ਰਹੇ ਹਾਂ…',
    loginError: 'ਇਹ ਵੇਰਵੇ ਸਾਡੀ ਬਹੀ ਨਾਲ ਨਹੀਂ ਮਿਲੇ।',
    inventory: 'ਇਨਵੈਂਟਰੀ',
    orders: 'ਆਉਣ ਵਾਲੇ ਆਰਡਰ',
    overview: 'ਜਾਇਜ਼ਾ',
    signOut: 'ਬਾਹਰ ਜਾਓ',
    products: 'ਉਤਪਾਦ',
    lowStockItems: 'ਘੱਟ ਸਟਾਕ',
    pending: 'ਬਕਾਇਆ',
    orderValue: 'ਆਰਡਰ ਮੁੱਲ',
    addPiece: 'ਗਹਿਣਾ ਜੋੜੋ',
    editPiece: 'ਗਹਿਣਾ ਸੋਧੋ',
    deletePiece: 'ਗਹਿਣਾ ਹਟਾਓ',
    deleteConfirm: 'ਇਸ ਗਹਿਣੇ ਨੂੰ ਬਹੀ ਤੋਂ ਹਟਾਉਣਾ ਹੈ?',
    deleteBody: 'ਇਹ ਵਾਪਸ ਨਹੀਂ ਆ ਸਕਦਾ।',
    cancel: 'ਰੱਦ',
    savePiece: 'ਸੰਭਾਲੋ',
    saving: 'ਸੰਭਾਲ ਰਹੇ ਹਾਂ…',
    productId: 'ਉਤਪਾਦ ID',
    productName: 'ਨਾਮ',
    imageUrl: 'ਚਿੱਤਰ URL',
    price: 'ਕੀਮਤ',
    stock: 'ਸਟਾਕ',
    noOrders: 'ਹਾਲੇ ਕੋਈ ਆਰਡਰ ਨਹੀਂ।',
    noOrdersBody: 'ਨਵੀਂ ਗਾਹਕ ਪੁੱਛਗਿੱਛ ਇੱਥੇ ਦਿਖੇਗੀ।',
    customer: 'ਗਾਹਕ',
    item: 'ਗਹਿਣਾ',
    amount: 'ਰਕਮ',
    status: 'ਸਥਿਤੀ',
    updateStatus: 'ਸਥਿਤੀ ਬਦਲੋ',
    confirmed: 'ਪੁਸ਼ਟੀ ਹੋਈ',
    dispatched: 'ਭੇਜਿਆ',
    delivered: 'ਪਹੁੰਚਾਇਆ',
    cancelled: 'ਰੱਦ',
    pendingStatus: 'ਬਕਾਇਆ',
    previous: 'ਪਿਛਲਾ',
    next: 'ਅਗਲਾ',
    protected: 'ਸੁਰੱਖਿਅਤ ਸਟੋਰ ਖੇਤਰ',
    sendBill: 'ਬਿੱਲ ਭੇਜੋ',
  },
  bn: {
    location: 'নেহলা · ভুনা · ফতেহাবাদ',
    navCollection: 'সংগ্রহ',
    navStory: 'আমাদের ঘর',
    navAdmin: 'স্টোর ডেস্ক',
    welcomeEyebrow: 'আপনার কাছের ব্যক্তিগত জহুরি',
    welcomeBanner: 'নমস্কার বন্ধুরা, আপনাদের নিজের গয়নার দোকান SK Jewellers, নেহলা, ভুনা, ফতেহাবাদ, হরিয়ানায় স্বাগতম।',
    welcomeTitle: 'প্রতিটি গহনার নিজস্ব শান্ত স্বর।',
    heroA: 'আপনার অধ্যায়ের',
    heroB: 'গহনা।',
    since: '১৯৯৮ থেকে · নেহলা',
    artLine1: 'মনে থেকে যাওয়ার',
    artLine2: 'শিল্প।',
    houseTitleA: 'শোরুম নয়।',
    houseTitleB: 'পরিচিত একটি ঘর।',
    houseBody: 'কথা ব্যক্তিগত, সোনা খাঁটি এবং পছন্দ হোক ধীরস্থির—এটাই আমাদের রীতি।',
    welcomeBody: 'হাতে তৈরি সোনা এবং উত্তরাধিকারযোগ্য সূক্ষ্ম কাজ, পরিবারের খাতার যত্নে নির্বাচিত।',
    browse: 'সংগ্রহ দেখুন',
    whatsapp: 'হোয়াটসঅ্যাপ করুন',
    call: 'স্টোরে ফোন করুন',
    featured: 'বিশেষ বাছাই',
    featuredCaption: 'প্রতিদিনের আনন্দের জন্য বেছে নেওয়া ছোট ব্যাচের গহনা।',
    viewPiece: 'দেখুন',
    detailAction: 'বিবরণ',
    inStock: 'মজুত আছে',
    lowStock: 'অল্প কিছু বাকি',
    soldOut: 'এখন সংরক্ষিত',
    allPieces: 'সব',
    rings: 'আংটি',
    chains: 'চেন',
    earrings: 'দুল',
    bracelets: 'বালা',
    noPieces: 'খাতায় পরের নথির অপেক্ষা।',
    noPiecesBody: 'নতুন গহনা নথিভুক্ত হচ্ছে। ব্যক্তিগত দেখার জন্য স্টোরে কথা বলুন।',
    loadError: 'সংগ্রহ খোলা গেল না।',
    retry: 'আবার চেষ্টা করুন',
    details: 'গহনার বিবরণ',
    close: 'বন্ধ',
    karat: 'বিশুদ্ধতা',
    weight: 'প্রায় ওজন',
    sku: 'খাতা নম্বর',
    addToEnquiry: 'কেনার বিষয়ে জিজ্ঞাসা',
    saved: 'সংরক্ষিত',
    share: 'শেয়ার',
    copied: 'লিঙ্ক কপি হয়েছে',
    checkout: 'কেনার জিজ্ঞাসা',
    checkoutBody: 'আপনার তথ্য দিন, SK Jewellers ব্যক্তিগতভাবে মজুত নিশ্চিত করবে।',
    fullName: 'পুরো নাম',
    phone: 'মোবাইল নম্বর',
    address: 'ঠিকানা',
    quantity: 'পরিমাণ',
    placeOrder: 'জিজ্ঞাসা পাঠান',
    sending: 'পাঠানো হচ্ছে…',
    orderReceived: 'আপনার জিজ্ঞাসা আমাদের কাছে আছে।',
    orderReceivedBody: 'SK Jewellers পরিবারের একজন সদস্য শীঘ্রই তথ্য নিশ্চিত করতে ফোন করবেন।',
    reference: 'রেফারেন্স',
    backCollection: 'সংগ্রহে ফিরুন',
    language: 'ভাষা',
    footerLine: 'নেহলা, হরিয়ানার পারিবারিক জহুরি।',
    storeHours: 'আজ খোলা · 10:00 থেকে 19:30',
    adminDesk: 'স্টোর ডেস্ক',
    adminLogin: 'স্টোর ডেস্কে প্রবেশ',
    adminLoginBody: 'ইনভেন্টরি এবং প্রতিটি নতুন জিজ্ঞাসার ব্যক্তিগত দৃশ্য।',
    sixDigitPin: '6 সংখ্যার পিন',
    signIn: 'ডেস্ক খুলুন',
    signingIn: 'যাচাই হচ্ছে…',
    loginError: 'এই তথ্য আমাদের খাতার সঙ্গে মেলেনি।',
    inventory: 'ইনভেন্টরি',
    orders: 'আসা অর্ডার',
    overview: 'সারাংশ',
    signOut: 'সাইন আউট',
    products: 'পণ্য',
    lowStockItems: 'কম মজুত',
    pending: 'অমীমাংসিত',
    orderValue: 'অর্ডারের মূল্য',
    addPiece: 'গহনা যোগ করুন',
    editPiece: 'গহনা সম্পাদনা',
    deletePiece: 'গহনা মুছুন',
    deleteConfirm: 'এই গহনাটি খাতা থেকে সরাবেন?',
    deleteBody: 'এটি ফিরিয়ে আনা যাবে না।',
    cancel: 'বাতিল',
    savePiece: 'সংরক্ষণ',
    saving: 'সংরক্ষণ হচ্ছে…',
    productId: 'পণ্য ID',
    productName: 'নাম',
    imageUrl: 'ছবির URL',
    price: 'দাম',
    stock: 'মজুত',
    noOrders: 'এখনও কোনও অর্ডার নেই।',
    noOrdersBody: 'নতুন গ্রাহকের জিজ্ঞাসা এখানে দেখা যাবে।',
    customer: 'গ্রাহক',
    item: 'গহনা',
    amount: 'পরিমাণ',
    status: 'অবস্থা',
    updateStatus: 'অবস্থা বদলান',
    confirmed: 'নিশ্চিত',
    dispatched: 'পাঠানো হয়েছে',
    delivered: 'পৌঁছে গেছে',
    cancelled: 'বাতিল',
    pendingStatus: 'অমীমাংসিত',
    previous: 'আগের',
    next: 'পরের',
    protected: 'সুরক্ষিত স্টোর এলাকা',
    sendBill: 'বিল পাঠান',
  },
};

function useLanguage() {
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('sk-language') as Language) || 'en');
  const t = (key: string) => dictionary[language][key] || dictionary.en[key] || key;
  const changeLanguage = (value: Language) => {
    setLanguage(value);
    localStorage.setItem('sk-language', value);
  };
  return { language, t, changeLanguage };
}

function fallbackArt(index: number) {
  const palettes = [
    ['#8e6e3d', '#2f3742', '#d7bd7c'],
    ['#a66d50', '#252e3b', '#e0c889'],
    ['#6d827c', '#222b36', '#c9b57b'],
    ['#7a6375', '#242d3b', '#d6bd81'],
  ];
  const [a, b, c] = palettes[index % palettes.length];
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800"><defs><radialGradient id="g"><stop stop-color="${c}" stop-opacity=".45"/><stop offset="1" stop-color="${a}" stop-opacity="0"/></radialGradient><linearGradient id="b" x2="1" y2="1"><stop stop-color="${b}"/><stop offset="1" stop-color="#111722"/></linearGradient></defs><rect width="800" height="800" fill="url(#b)"/><circle cx="160" cy="110" r="230" fill="url(#g)"/><circle cx="670" cy="650" r="270" fill="url(#g)"/><path d="M400 180c-48 100-190 180-190 300a190 190 0 1 0 380 0c0-120-142-200-190-300Z" fill="none" stroke="${c}" stroke-width="7" opacity=".82"/><circle cx="400" cy="468" r="58" fill="none" stroke="${c}" stroke-width="5" opacity=".52"/><path d="M220 650h360" stroke="${c}" stroke-width="2" opacity=".35"/></svg>`)}`;
}

function formatPrice(value: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
}

function createOfflineOrder(product: Product, values: CheckoutValues): Order {
  const queued = JSON.parse(localStorage.getItem('sk-offline-orders') || '[]') as Array<Record<string, unknown>>;
  const order: Order = {
    id: -Date.now(),
    fullName: values.fullName.trim(),
    phone: values.phone.trim(),
    address: values.address.trim(),
    productId: product.id,
    productName: product.name,
    quantity: values.quantity,
    totalPrice: product.price * values.quantity,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  queued.push({ ...values, productId: product.id });
  localStorage.setItem('sk-offline-orders', JSON.stringify(queued));
  return order;
}

async function syncOfflineOrders() {
  const queued = JSON.parse(localStorage.getItem('sk-offline-orders') || '[]') as Array<Record<string, unknown>>;
  if (!queued.length || !navigator.onLine) return;
  const remaining = [...queued];
  for (const payload of queued) {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) remaining.shift();
      else break;
    } catch {
      break;
    }
  }
  localStorage.setItem('sk-offline-orders', JSON.stringify(remaining));
}

function ImageWithFallback({ product, index, className = '' }: { product: Product; index: number; className?: string }) {
  const [src, setSrc] = useState(product.imageUrl || fallbackArt(index));
  return <img src={src} onError={() => setSrc(fallbackArt(index))} alt={product.name} className={`object-cover ${className}`} />;
}

function LanguageSelect({ language, changeLanguage, t }: { language: Language; changeLanguage: (v: Language) => void; t: (key: string) => string }) {
  return (
    <label className="relative flex items-center gap-2 text-[10px] uppercase tracking-[.18em] text-slate-400">
      <span className="sr-only">{t('language')}</span>
      <select data-testid="select-language" value={language} onChange={(e) => changeLanguage(e.target.value as Language)} className="cursor-pointer appearance-none bg-transparent pr-4 text-[10px] font-semibold text-[#d7c38d] outline-none">
        <option value="en" className="bg-[#1b2330]">EN</option>
        <option value="hi" className="bg-[#1b2330]">हि</option>
        <option value="pa" className="bg-[#1b2330]">ਪੰ</option>
        <option value="bn" className="bg-[#1b2330]">বা</option>
      </select>
      <ChevronDown size={12} className="pointer-events-none absolute right-0" />
    </label>
  );
}

function Header({ language, changeLanguage, t, onMenu }: { language: Language; changeLanguage: (v: Language) => void; t: (key: string) => string; onMenu?: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[.08] bg-[#11161fee] backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between px-5 md:h-[84px] md:px-9">
        <Link href="/" data-testid="link-home" className="group flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center border border-[#cdb575]/45 text-[#d7c38d] transition-transform group-hover:rotate-45"><span className="-rotate-45 font-ledger text-xl">S</span></span>
          <span><span className="block font-ledger text-lg tracking-[.14em] text-[#eee3c2]">SK</span><span className="block font-mono-ledger text-[8px] uppercase tracking-[.25em] text-slate-500">Jewellers</span></span>
        </Link>
        <nav className="hidden items-center gap-9 text-[10px] font-semibold uppercase tracking-[.19em] text-slate-400 md:flex">
          <a href="#collection" data-testid="link-collection" className="transition-colors hover:text-[#dec681]">{t('navCollection')}</a>
          <a href="#house" data-testid="link-house" className="transition-colors hover:text-[#dec681]">{t('navStory')}</a>
          <Link href="/admin" data-testid="link-admin" className="transition-colors hover:text-[#dec681]">{t('navAdmin')}</Link>
        </nav>
        <div className="flex items-center gap-5">
          <LanguageSelect language={language} changeLanguage={changeLanguage} t={t} />
          {onMenu && <button type="button" onClick={onMenu} data-testid="button-open-menu" className="text-slate-300 md:hidden"><Menu size={20} /></button>}
        </div>
      </div>
    </header>
  );
}

function ProductCard({ product, index, t, liked, onLike, onShare, onOpen }: { product: Product; index: number; t: (key: string) => string; liked: boolean; onLike: () => void; onShare: () => void; onOpen: () => void }) {
  return (
    <article data-testid={`card-product-${product.id}`} className="group relative overflow-hidden border border-white/[.09] bg-[#1b2330]/80 transition-all duration-500 hover:-translate-y-1 hover:border-[#cdb575]/40 hover:shadow-[0_20px_45px_rgba(5,8,13,.35)]">
      <div className="block w-full">
        <div className="product-art relative aspect-[.93] overflow-hidden">
          <ImageWithFallback product={product} index={index} className="h-full w-full opacity-90 mix-blend-screen transition duration-700 group-hover:scale-105 group-hover:opacity-100" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#131923] via-transparent to-transparent opacity-80" />
        </div>
        <div className="px-5 pb-4 pt-5">
          <h3 data-testid={`text-product-name-${product.id}`} className="font-ledger text-[21px] leading-tight text-[#eee3c2]">{product.name}</h3>
        </div>
      </div>
      <div className="flex gap-2 border-t border-white/[.08] p-3">
        <button type="button" onClick={onLike} aria-label={liked ? t('saved') : t('saved')} data-testid={`button-like-product-${product.id}`} className={`flex h-8 w-8 items-center justify-center border border-white/10 bg-[#11161e]/75 backdrop-blur transition ${liked ? 'text-[#d7c38d]' : 'text-slate-400 hover:text-[#d7c38d]'}`}><Heart size={14} fill={liked ? 'currentColor' : 'none'} /></button>
        <button type="button" onClick={onShare} aria-label={t('share')} data-testid={`button-share-product-${product.id}`} className="flex h-8 w-8 items-center justify-center border border-white/10 bg-[#11161e]/75 text-slate-400 backdrop-blur transition hover:text-[#d7c38d]"><Share2 size={14} /></button>
        <button type="button" onClick={onOpen} data-testid={`button-open-product-${product.id}`} className="ml-auto flex h-8 items-center gap-2 border border-[#cdb575]/25 px-3 text-[9px] font-bold uppercase tracking-[.15em] text-[#d7c38d] transition hover:border-[#cdb575]/60">{t('detailAction')} <ChevronRight size={12} /></button>
      </div>
    </article>
  );
}

function Modal({ children, onClose, label }: { children: React.ReactNode; onClose: () => void; label: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#080b11]/75 p-0 backdrop-blur-sm md:items-center md:p-6" role="dialog" aria-modal="true" aria-label={label}>
      <button type="button" data-testid="button-close-backdrop" aria-label={label} onClick={onClose} className="absolute inset-0 cursor-default" />
      <div className="relative z-10 max-h-[94dvh] w-full overflow-y-auto border border-[#cdb575]/25 bg-[#19212d] shadow-[0_25px_100px_rgba(0,0,0,.55)] md:max-w-2xl">{children}</div>
    </div>
  );
}

function DetailModal({ product, index, t, onClose, onCheckout, liked, onLike, onShare }: { product: Product; index: number; t: (key: string) => string; onClose: () => void; onCheckout: () => void; liked: boolean; onLike: () => void; onShare: () => void }) {
  const { data: fetched } = useGetProduct(product.id, { query: { enabled: Boolean(product.id), queryKey: getGetProductQueryKey(product.id) } });
  const detail = fetched || product;
  return (
    <Modal onClose={onClose} label={t('details')}>
      <div className="grid md:grid-cols-[.9fr_1.1fr]">
        <div className="product-art relative min-h-[300px] md:min-h-[500px]"><ImageWithFallback product={detail} index={index} className="h-full w-full mix-blend-screen" /><span className="absolute left-6 top-6 font-mono-ledger text-[9px] uppercase tracking-[.22em] text-[#d7c38d]">{detail.productId}</span></div>
        <div className="p-7 md:p-10">
          <div className="mb-10 flex items-center justify-between"><span className="font-mono-ledger text-[9px] uppercase tracking-[.2em] text-slate-500">{t('details')}</span><button type="button" onClick={onClose} data-testid="button-close-detail" className="text-slate-400 hover:text-[#e9d697]"><X size={19} /></button></div>
          <p className="font-mono-ledger text-[10px] uppercase tracking-[.2em] text-[#c7a963]">{detail.karat} · {detail.weight}g</p>
          <h2 data-testid={`text-detail-name-${detail.id}`} className="mt-3 font-ledger text-4xl leading-[1.02] text-[#f1e7c8]">{detail.name}</h2>
          <p className="mt-6 font-mono-ledger text-xl text-[#dfc77f]">{formatPrice(detail.price)}</p>
          <div className="my-8 gold-rule" />
          <dl className="grid grid-cols-2 gap-5">
            <div><dt className="font-mono-ledger text-[9px] uppercase tracking-[.17em] text-slate-500">{t('karat')}</dt><dd className="mt-1 text-sm text-slate-200">{detail.karat}</dd></div>
            <div><dt className="font-mono-ledger text-[9px] uppercase tracking-[.17em] text-slate-500">{t('weight')}</dt><dd className="mt-1 text-sm text-slate-200">{detail.weight}g</dd></div>
            <div><dt className="font-mono-ledger text-[9px] uppercase tracking-[.17em] text-slate-500">{t('sku')}</dt><dd className="mt-1 text-sm text-slate-200">{detail.productId}</dd></div>
            <div><dt className="font-mono-ledger text-[9px] uppercase tracking-[.17em] text-slate-500">{t('stock')}</dt><dd className="mt-1 text-sm text-slate-200">{detail.stock}</dd></div>
          </dl>
          <div className="mt-10 flex gap-2">
            <button type="button" onClick={onLike} data-testid={`button-detail-like-${detail.id}`} className={`flex h-12 w-12 items-center justify-center border border-white/10 ${liked ? 'text-[#d7c38d]' : 'text-slate-400'}`}><Heart size={17} fill={liked ? 'currentColor' : 'none'} /></button>
            <button type="button" onClick={onShare} data-testid={`button-detail-share-${detail.id}`} className="flex h-12 w-12 items-center justify-center border border-white/10 text-slate-400"><Share2 size={17} /></button>
            <button type="button" disabled={detail.stock < 1} onClick={onCheckout} data-testid={`button-checkout-${detail.id}`} className="gold-shimmer ml-auto flex h-12 flex-1 items-center justify-center gap-2 px-4 text-xs font-bold uppercase tracking-[.15em] text-[#1d1a14] disabled:cursor-not-allowed disabled:opacity-40">{t('addToEnquiry')} <ArrowRight size={15} /></button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

const checkoutSchema = z.object({ fullName: z.string().min(2), phone: z.string().min(10), address: z.string().min(5), quantity: z.coerce.number().min(1).max(20) });
type CheckoutValues = z.infer<typeof checkoutSchema>;

function CheckoutModal({ product, t, onClose, onComplete }: { product: Product; t: (key: string) => string; onClose: () => void; onComplete: (order: Order) => void }) {
  const createOrder = useCreateOrder();
  const form = useForm<CheckoutValues>({ resolver: zodResolver(checkoutSchema), defaultValues: { fullName: '', phone: '', address: '', quantity: 1 } });
  const submit = (values: CheckoutValues) => createOrder.mutate({ data: { ...values, productId: product.id } }, { onSuccess: onComplete, onError: () => { if (!navigator.onLine) onComplete(createOfflineOrder(product, values)); } });
  return (
    <Modal onClose={onClose} label={t('checkout')}>
      <div className="p-7 md:p-10">
        <div className="mb-8 flex items-start justify-between"><div><span className="font-mono-ledger text-[9px] uppercase tracking-[.2em] text-[#c7a963]">{product.productId}</span><h2 className="mt-2 font-ledger text-3xl text-[#f1e7c8]">{t('checkout')}</h2></div><button type="button" onClick={onClose} data-testid="button-close-checkout" className="text-slate-400"><X size={19} /></button></div>
        <p className="mb-7 max-w-md text-sm leading-6 text-slate-400">{t('checkoutBody')}</p>
        <div className="mb-7 flex items-center gap-4 border-y border-white/[.08] py-4"><div className="h-16 w-16 overflow-hidden product-art"><ImageWithFallback product={product} index={0} className="h-full w-full mix-blend-screen" /></div><div><p className="font-ledger text-lg text-[#eee3c2]">{product.name}</p><p className="font-mono-ledger text-xs text-[#d7c38d]">{formatPrice(product.price)}</p></div></div>
        <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
          <Field label={t('fullName')} error={form.formState.errors.fullName?.message}><input data-testid="input-order-full-name" {...form.register('fullName')} /></Field>
          <Field label={t('phone')} error={form.formState.errors.phone?.message}><input data-testid="input-order-phone" type="tel" {...form.register('phone')} /></Field>
          <Field label={t('address')} error={form.formState.errors.address?.message}><textarea data-testid="input-order-address" rows={3} {...form.register('address')} /></Field>
          <Field label={t('quantity')} error={form.formState.errors.quantity?.message}><input data-testid="input-order-quantity" type="number" min="1" max="20" {...form.register('quantity')} /></Field>
          <button type="submit" disabled={createOrder.isPending} data-testid="button-submit-order" className="gold-shimmer mt-3 flex h-12 w-full items-center justify-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-[#1d1a14]">{createOrder.isPending ? <Loader2 size={15} className="animate-spin" /> : <ShoppingBag size={15} />}{createOrder.isPending ? t('sending') : t('placeOrder')}</button>
          {createOrder.isError && <p data-testid="status-order-error" className="flex items-center gap-2 text-xs text-[#e7a092]"><CircleAlert size={14} /> {t('loadError')}</p>}
        </form>
      </div>
    </Modal>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className="block text-xs text-slate-400"><span className="mb-2 block font-mono-ledger text-[9px] uppercase tracking-[.16em] text-slate-500">{label}</span>{children}{error && <span className="mt-1 block text-[10px] text-[#e7a092]">{error}</span>}</label>;
}

function Confirmation({ order, t, onClose }: { order: Order; t: (key: string) => string; onClose: () => void }) {
  return <Modal onClose={onClose} label={t('orderReceived')}><div className="px-7 py-14 text-center md:px-16"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#cdb575]/45 text-[#d7c38d]"><Check size={27} /></div><h2 data-testid="status-order-confirmed" className="mt-7 font-ledger text-4xl text-[#f1e7c8]">{t('orderReceived')}</h2><p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-slate-400">{t('orderReceivedBody')}</p><p className="mt-8 font-mono-ledger text-[10px] uppercase tracking-[.18em] text-slate-500">{t('reference')} <span className="text-[#d7c38d]">SK-{String(order.id).padStart(5, '0')}</span></p><button type="button" onClick={onClose} data-testid="button-close-confirmation" className="mt-9 border border-[#cdb575]/35 px-7 py-3 text-[10px] font-bold uppercase tracking-[.17em] text-[#d7c38d]">{t('backCollection')}</button></div></Modal>;
}

function Home() {
  const { language, t, changeLanguage } = useLanguage();
  const { data, isLoading, isError, refetch } = useListProducts();
  const products = useMemo(() => data && data.length ? data : isError ? fallbackProducts : [], [data, isError]);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const [checkout, setCheckout] = useState<Product | null>(null);
  const [confirmation, setConfirmation] = useState<Order | null>(null);
  const [liked, setLiked] = useState<number[]>(() => JSON.parse(localStorage.getItem('sk-liked') || '[]'));
  const [filter, setFilter] = useState('all');
  const [notice, setNotice] = useState('');
  const toggleLike = (id: number) => setLiked((old) => { const next = old.includes(id) ? old.filter((x) => x !== id) : [...old, id]; localStorage.setItem('sk-liked', JSON.stringify(next)); return next; });
  const shareProduct = async (product: Product) => {
    const url = `${window.location.origin}/?piece=${product.id}`;
    if (navigator.share) await navigator.share({ title: `SK Jewellers · ${product.name}`, url });
    else { await navigator.clipboard?.writeText(url); setNotice(t('copied')); window.setTimeout(() => setNotice(''), 2200); }
  };
  const filtered = products.filter((p) => filter === 'all' || p.name.toLowerCase().includes(filter.slice(0, -1)));
  return (
    <div className="min-h-[100dvh] text-[#ede5cf]">
      <Header language={language} changeLanguage={changeLanguage} t={t} onMenu={() => setMobileMenu(!mobileMenu)} />
      {mobileMenu && <div className="fixed inset-x-0 top-[72px] z-30 border-b border-white/10 bg-[#151c28] p-6 md:hidden"><div className="flex flex-col gap-5 text-xs uppercase tracking-[.16em] text-slate-300"><a href="#collection" onClick={() => setMobileMenu(false)} data-testid="link-mobile-collection">{t('navCollection')}</a><a href="#house" onClick={() => setMobileMenu(false)} data-testid="link-mobile-house">{t('navStory')}</a><Link href="/admin" data-testid="link-mobile-admin">{t('navAdmin')}</Link></div></div>}
      {notice && <div data-testid="status-share-notice" className="fixed right-5 top-24 z-50 flex items-center gap-2 border border-[#cdb575]/35 bg-[#1c2633] px-4 py-3 text-xs text-[#e4d49f]"><Check size={14} /> {notice}</div>}
      <main>
        <div className="border-b border-[#cdb575]/15 bg-[#171e2a]/80 px-5 py-3 text-center font-mono-ledger text-[10px] leading-5 tracking-[.04em] text-[#d7c38d] md:px-9">{t('welcomeBanner')}</div>
        <section className="relative overflow-hidden px-5 pb-20 pt-14 md:px-9 md:pb-32 md:pt-24">
          <div className="mx-auto grid max-w-[1240px] items-end gap-12 md:grid-cols-[1.13fr_.87fr]">
            <div className="rise-in">
              <p className="mb-7 flex items-center gap-3 font-mono-ledger text-[9px] uppercase tracking-[.24em] text-[#c6a966]"><span className="h-px w-8 bg-[#c6a966]" />{t('welcomeEyebrow')}</p>
              <h1 data-testid="text-welcome-title" className="max-w-[760px] font-ledger text-[clamp(3.3rem,8vw,7.4rem)] leading-[.91] tracking-[-.045em] text-[#f0e5c4]">{t('heroA')}<br /><em className="font-normal text-[#c9ae6a]">{t('heroB')}</em></h1>
              <p className="mt-8 max-w-[470px] text-[15px] leading-7 text-slate-400">{t('welcomeBody')}</p>
              <div className="mt-9 flex flex-wrap gap-3"><a href="#collection" data-testid="link-browse-collection" className="gold-shimmer flex items-center gap-3 px-5 py-3 text-[10px] font-bold uppercase tracking-[.17em] text-[#1d1a14]">{t('browse')} <ArrowRight size={14} /></a><a href={`https://wa.me/${STORE_PHONE.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" data-testid="link-whatsapp" className="flex items-center gap-3 border border-white/15 px-5 py-3 text-[10px] font-bold uppercase tracking-[.17em] text-[#d7c38d] transition hover:border-[#cdb575]/55">{t('whatsapp')} <ExternalLink size={13} /></a><a href={`tel:${STORE_PHONE.replace(/\s/g, '')}`} data-testid="link-hero-call" className="flex items-center gap-2 border border-white/15 px-4 py-3 text-[10px] font-bold uppercase tracking-[.17em] text-[#d7c38d] transition hover:border-[#cdb575]/55"><Phone size={13} /> {t('call')}</a></div>
            </div>
            <div className="rise-in delay-2 relative min-h-[290px] border border-[#cdb575]/18 bg-[#202938] p-7 md:min-h-[390px] md:p-10">
              <div className="absolute right-0 top-0 h-28 w-28 border-l border-b border-[#cdb575]/25" /><div className="absolute bottom-0 left-0 h-28 w-28 border-r border-t border-[#cdb575]/25" />
              <div className="absolute inset-8 border border-white/[.06]" />
              <div className="relative flex h-full min-h-[235px] flex-col justify-between md:min-h-[335px]"><span className="font-mono-ledger text-[9px] uppercase tracking-[.22em] text-slate-500">{t('since')}</span><div className="text-center"><Sparkles size={24} className="mx-auto mb-4 text-[#cdb575]" strokeWidth={1} /><p className="font-ledger text-3xl leading-tight text-[#e7d7a9]">{t('artLine1')}<br />{t('artLine2')}</p></div><div className="flex items-end justify-between font-mono-ledger text-[9px] uppercase tracking-[.17em] text-slate-500"><span>{t('location')}</span><span className="text-[#cdb575]">01 — 04</span></div></div>
            </div>
          </div>
        </section>
        <div className="mx-5 gold-rule md:mx-9" />
        <section id="collection" className="mx-auto max-w-[1240px] scroll-mt-24 px-5 py-20 md:px-9 md:py-28">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="font-mono-ledger text-[9px] uppercase tracking-[.24em] text-[#c6a966]">01 / {t('featured')}</p><h2 className="mt-3 font-ledger text-4xl text-[#efe4c4] md:text-5xl">{t('featured')}</h2><p className="mt-3 text-sm text-slate-500">{t('featuredCaption')}</p></div><div className="flex flex-wrap gap-2">{[['all', 'allPieces'], ['rings', 'rings'], ['chains', 'chains'], ['earrings', 'earrings'], ['bracelets', 'bracelets']].map(([value, label]) => <button key={value} type="button" onClick={() => setFilter(value)} data-testid={`button-filter-${value}`} className={`border px-3 py-2 text-[9px] font-bold uppercase tracking-[.14em] transition ${filter === value ? 'border-[#cdb575]/55 bg-[#cdb575]/10 text-[#dfc77f]' : 'border-white/10 text-slate-500 hover:text-slate-300'}`}>{t(label)}</button>)}</div></div>
          {isLoading && <div data-testid="status-products-loading" className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">{[1, 2, 3, 4].map((n) => <div key={n} className="h-[330px] animate-pulse border border-white/[.06] bg-white/[.03]" />)}</div>}
          {isError && <div data-testid="status-products-error" className="mb-6 flex items-center justify-between border border-[#8b5a50]/45 bg-[#3a2525]/30 p-4 text-sm text-[#e3aaa0]"><span className="flex items-center gap-2"><CircleAlert size={16} /> {t('loadError')}</span><button type="button" onClick={() => refetch()} data-testid="button-retry-products" className="text-xs uppercase tracking-[.15em] underline">{t('retry')}</button></div>}
          {!isLoading && filtered.length > 0 && <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">{filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} t={t} liked={liked.includes(p.id)} onLike={() => toggleLike(p.id)} onShare={() => shareProduct(p)} onOpen={() => setSelected(p)} />)}</div>}
          {!isLoading && filtered.length === 0 && <div data-testid="status-products-empty" className="border border-dashed border-[#cdb575]/25 px-6 py-20 text-center"><Box size={26} className="mx-auto text-[#cdb575]" /><h3 className="mt-5 font-ledger text-2xl text-[#e7d7a9]">{t('noPieces')}</h3><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">{t('noPiecesBody')}</p></div>}
        </section>
        <section id="house" className="scroll-mt-24 border-y border-white/[.07] bg-[#171e2a]/70 px-5 py-20 md:px-9 md:py-28">
          <div className="mx-auto grid max-w-[1240px] gap-12 md:grid-cols-[.75fr_1.25fr] md:items-center"><div><p className="font-mono-ledger text-[9px] uppercase tracking-[.24em] text-[#c6a966]">02 / {t('navStory')}</p><h2 className="mt-4 max-w-sm font-ledger text-4xl leading-tight text-[#eee3c2]">{t('houseTitleA')}<br /><span className="text-[#c9ae6a]">{t('houseTitleB')}</span></h2></div><div className="grid gap-8 border-l border-[#cdb575]/30 pl-7 md:grid-cols-2 md:pl-12"><p className="text-[15px] leading-8 text-slate-400">{t('footerLine')} {t('houseBody')}</p><div><p className="font-mono-ledger text-[9px] uppercase tracking-[.2em] text-slate-500">{t('storeHours')}</p><a href={`tel:${STORE_PHONE.replace(/\s/g, '')}`} data-testid="link-call-store" className="mt-5 flex items-center gap-3 text-sm text-[#d7c38d]"><Phone size={15} /> {t('call')}</a></div></div></div>
        </section>
      </main>
      <footer className="mx-auto flex max-w-[1240px] flex-col gap-4 px-5 py-9 text-[10px] uppercase tracking-[.15em] text-slate-600 md:flex-row md:items-center md:justify-between md:px-9"><span>© SK Jewellers · {t('location')}</span><span>{t('footerLine')}</span></footer>
      {selected && <DetailModal product={selected} index={products.findIndex((p) => p.id === selected.id)} t={t} onClose={() => setSelected(null)} onCheckout={() => { setCheckout(selected); setSelected(null); }} liked={liked.includes(selected.id)} onLike={() => toggleLike(selected.id)} onShare={() => shareProduct(selected)} />}
      {checkout && <CheckoutModal product={checkout} t={t} onClose={() => setCheckout(null)} onComplete={(order) => { setCheckout(null); setConfirmation(order); queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() }); queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() }); }} />}
      {confirmation && <Confirmation order={confirmation} t={t} onClose={() => setConfirmation(null)} />}
    </div>
  );
}

const fallbackProducts: Product[] = [
  { id: 101, productId: 'SK-24-001', name: 'Saanjh Band', karat: '22K', weight: 4.8, price: 38200, stock: 3, imageUrl: fallbackArt(0), createdAt: '', updatedAt: '' },
  { id: 102, productId: 'SK-24-014', name: 'Nazaara Chain', karat: '22K', weight: 8.2, price: 65400, stock: 6, imageUrl: fallbackArt(1), createdAt: '', updatedAt: '' },
  { id: 103, productId: 'SK-24-021', name: 'Gulzar Drops', karat: '18K', weight: 3.1, price: 29800, stock: 2, imageUrl: fallbackArt(2), createdAt: '', updatedAt: '' },
  { id: 104, productId: 'SK-24-031', name: 'Rehmat Kada', karat: '22K', weight: 11.4, price: 91400, stock: 4, imageUrl: fallbackArt(3), createdAt: '', updatedAt: '' },
];

function Login({ t, onLoggedIn }: { t: (key: string) => string; onLoggedIn: (token: string, expiresAt: string) => void }) {
  const login = useAdminLogin();
  const form = useForm<{ phone: string; pin: string }>({ defaultValues: { phone: '', pin: '' } });
  return <div className="min-h-[100dvh] px-5 py-6 text-[#ede5cf] md:px-9"><div className="mx-auto flex max-w-[1240px] items-center justify-between"><Link href="/" data-testid="link-login-home" className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center border border-[#cdb575]/45 text-[#d7c38d] font-ledger text-xl">S</span><span className="font-ledger text-lg tracking-[.14em]">SK</span></Link><Link href="/" data-testid="link-login-back" className="flex items-center gap-2 text-[10px] uppercase tracking-[.17em] text-slate-500"><ArrowLeft size={14} /> {t('backCollection')}</Link></div><div className="mx-auto grid max-w-[1000px] items-center gap-14 py-20 md:grid-cols-[.85fr_1.15fr] md:py-28"><div><p className="flex items-center gap-3 font-mono-ledger text-[9px] uppercase tracking-[.2em] text-[#c6a966]"><LockKeyhole size={14} /> {t('protected')}</p><h1 className="mt-6 font-ledger text-5xl leading-[.98] text-[#efe4c4] md:text-7xl">{t('adminLogin')}</h1><p className="mt-6 max-w-sm text-sm leading-7 text-slate-500">{t('adminLoginBody')}</p></div><div className="glass-panel p-7 md:p-10"><form onSubmit={form.handleSubmit((values) => login.mutate({ data: values }, { onSuccess: (session) => onLoggedIn(session.token, session.expiresAt) }))} className="space-y-5"><Field label={t('phone')}><input data-testid="input-admin-phone" type="tel" {...form.register('phone')} /></Field><Field label={t('sixDigitPin')}><input data-testid="input-admin-pin" type="password" inputMode="numeric" maxLength={6} {...form.register('pin')} /></Field><button type="submit" disabled={login.isPending} data-testid="button-admin-login" className="gold-shimmer mt-3 flex h-12 w-full items-center justify-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-[#1d1a14]">{login.isPending ? <Loader2 size={15} className="animate-spin" /> : <ShieldCheck size={15} />}{login.isPending ? t('signingIn') : t('signIn')}</button>{login.isError && <p data-testid="status-admin-login-error" className="text-xs text-[#e7a092]">{t('loginError')}</p>}</form></div></div></div>;
}

const productSchema = z.object({ productId: z.string().min(1), name: z.string().min(1), karat: z.string().min(1), weight: z.coerce.number().min(0), price: z.coerce.number().min(0), stock: z.coerce.number().min(0), imageUrl: z.string().min(1) });
type ProductValues = z.infer<typeof productSchema>;

function ProductEditor({ product, t, onClose, onDone }: { product?: Product; t: (key: string) => string; onClose: () => void; onDone: () => void }) {
  const create = useCreateProduct();
  const update = useUpdateProduct();
  const editing = Boolean(product);
  const form = useForm<ProductValues>({ resolver: zodResolver(productSchema), defaultValues: product ? { productId: product.productId, name: product.name, karat: product.karat, weight: product.weight, price: product.price, stock: product.stock, imageUrl: product.imageUrl } : { productId: '', name: '', karat: '22K', weight: 0, price: 0, stock: 0, imageUrl: fallbackArt(0) } });
  const submit = (values: ProductValues) => {
    if (product) update.mutate({ id: product.id, data: values }, { onSuccess: onDone });
    else create.mutate({ data: values }, { onSuccess: onDone });
  };
  const pending = create.isPending || update.isPending;
  return <Modal onClose={onClose} label={editing ? t('editPiece') : t('addPiece')}><div className="p-7 md:p-10"><div className="mb-8 flex items-center justify-between"><h2 className="font-ledger text-3xl text-[#f1e7c8]">{editing ? t('editPiece') : t('addPiece')}</h2><button type="button" onClick={onClose} data-testid="button-close-product-editor" className="text-slate-400"><X size={19} /></button></div><form onSubmit={form.handleSubmit(submit)} className="grid gap-4 md:grid-cols-2"><Field label={t('productId')}><input data-testid="input-product-id" {...form.register('productId')} /></Field><Field label={t('productName')}><input data-testid="input-product-name" {...form.register('name')} /></Field><Field label={t('karat')}><input data-testid="input-product-karat" {...form.register('karat')} /></Field><Field label={t('weight')}><input data-testid="input-product-weight" type="number" step=".1" {...form.register('weight')} /></Field><Field label={t('price')}><input data-testid="input-product-price" type="number" {...form.register('price')} /></Field><Field label={t('stock')}><input data-testid="input-product-stock" type="number" {...form.register('stock')} /></Field><div className="md:col-span-2"><Field label={t('imageUrl')}><input data-testid="input-product-image-url" {...form.register('imageUrl')} /></Field></div><button type="submit" disabled={pending} data-testid="button-save-product" className="gold-shimmer mt-3 flex h-12 items-center justify-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-[#1d1a14] md:col-span-2">{pending ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}{pending ? t('saving') : t('savePiece')}</button></form></div></Modal>;
}

function AdminDashboard({ t, onSignOut }: { t: (key: string) => string; onSignOut: () => void }) {
  const client = useQueryClient();
  const { data: summary } = useGetAdminSummary({ query: { enabled: true, queryKey: getGetAdminSummaryQueryKey() } });
  const { data: products, isLoading: productsLoading } = useListProducts();
  const { data: orders, isLoading: ordersLoading } = useListOrders({ query: { enabled: true, queryKey: getListOrdersQueryKey() } });
  const updateStatus = useUpdateOrderStatus();
  const remove = useDeleteProduct();
  const [tab, setTab] = useState<'overview' | 'inventory' | 'orders'>('overview');
  const [editor, setEditor] = useState<Product | 'new' | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const invalidate = () => { client.invalidateQueries({ queryKey: getListProductsQueryKey() }); client.invalidateQueries({ queryKey: getListOrdersQueryKey() }); client.invalidateQueries({ queryKey: getGetAdminSummaryQueryKey() }); };
  const stats = [{ label: t('products'), value: summary?.productCount ?? products?.length ?? 0, icon: Box }, { label: t('lowStockItems'), value: summary?.lowStockCount ?? products?.filter((p) => p.stock < 4).length ?? 0, icon: CircleAlert }, { label: t('pending'), value: summary?.pendingOrderCount ?? orders?.filter((o) => o.status === 'pending').length ?? 0, icon: PackageCheck }, { label: t('orderValue'), value: formatPrice(summary?.orderValue ?? orders?.reduce((n, o) => n + o.totalPrice, 0) ?? 0), icon: Sparkles }];
  return <div className="min-h-[100dvh] text-[#ede5cf]"><header className="border-b border-white/[.08] bg-[#11161e]/75"><div className="mx-auto flex h-[74px] max-w-[1400px] items-center justify-between px-5 md:px-9"><Link href="/" data-testid="link-admin-logo" className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center border border-[#cdb575]/45 font-ledger text-lg text-[#d7c38d]">S</span><span><span className="block font-ledger tracking-[.15em]">SK desk</span><span className="block font-mono-ledger text-[8px] uppercase tracking-[.2em] text-slate-600">{t('location')}</span></span></Link><button type="button" onClick={onSignOut} data-testid="button-admin-signout" className="flex items-center gap-2 text-[10px] uppercase tracking-[.15em] text-slate-500 hover:text-[#d7c38d]"><LogOut size={14} /> {t('signOut')}</button></div></header><div className="mx-auto grid max-w-[1400px] md:grid-cols-[220px_1fr]"><aside className="border-b border-white/[.08] p-5 md:min-h-[calc(100dvh-74px)] md:border-b-0 md:border-r md:p-7"><p className="mb-5 font-mono-ledger text-[9px] uppercase tracking-[.2em] text-slate-600">{t('overview')}</p><nav className="flex gap-2 overflow-x-auto md:block">{[['overview', LayoutDashboard], ['inventory', Box], ['orders', ShoppingBag]].map(([key, Icon]) => <button key={key as string} type="button" onClick={() => setTab(key as 'overview' | 'inventory' | 'orders')} data-testid={`button-admin-tab-${key}`} className={`flex min-w-max items-center gap-3 px-3 py-3 text-left text-xs transition md:w-full ${tab === key ? 'bg-[#cdb575]/10 text-[#d9c487]' : 'text-slate-500 hover:text-slate-300'}`}>{typeof Icon === 'function' && <Icon size={15} />}{t(key as string)}</button>)}</nav></aside><main className="p-5 md:p-10">{tab === 'overview' && <><div className="mb-10"><p className="font-mono-ledger text-[9px] uppercase tracking-[.22em] text-[#c6a966]">SK / 01</p><h1 className="mt-3 font-ledger text-4xl text-[#eee3c2]">{t('overview')}</h1></div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{stats.map(({ label, value, icon: Icon }, i) => <div key={label} className={`glass-panel rise-in delay-${i + 1} p-5`}><Icon size={17} className="text-[#cdb575]" /><p className="mt-8 font-mono-ledger text-[9px] uppercase tracking-[.17em] text-slate-500">{label}</p><p data-testid={`metric-${label}`} className="mt-2 font-ledger text-3xl text-[#eee3c2]">{value}</p></div>)}</div><div className="mt-10 grid gap-5 lg:grid-cols-[1.15fr_.85fr]"><div className="glass-panel p-6"><div className="mb-6 flex items-center justify-between"><h2 className="font-ledger text-2xl text-[#eee3c2]">{t('orders')}</h2><button type="button" onClick={() => setTab('orders')} data-testid="button-view-orders" className="text-[10px] uppercase tracking-[.14em] text-[#cdb575]">{t('next')} <ChevronRight size={13} className="inline" /></button></div><OrderRows orders={(orders || []).slice(0, 4)} t={t} onStatus={(id, status) => updateStatus.mutate({ id, data: { status } }, { onSuccess: invalidate })} loading={ordersLoading} /></div><div className="glass-panel p-6"><div className="mb-6 flex items-center justify-between"><h2 className="font-ledger text-2xl text-[#eee3c2]">{t('inventory')}</h2><button type="button" onClick={() => setTab('inventory')} data-testid="button-view-inventory" className="text-[10px] uppercase tracking-[.14em] text-[#cdb575]">{t('next')} <ChevronRight size={13} className="inline" /></button></div><div className="space-y-4">{(products || []).slice(0, 4).map((p) => <div key={p.id} className="flex items-center justify-between border-b border-white/[.07] pb-3"><span className="font-ledger text-base text-slate-300">{p.name}</span><span className={`font-mono-ledger text-[10px] ${p.stock < 4 ? 'text-[#d7977e]' : 'text-slate-500'}`}>{p.stock} {t('stock')}</span></div>)}</div></div></div></>}{tab === 'inventory' && <Inventory products={products || []} loading={productsLoading} t={t} onAdd={() => setEditor('new')} onEdit={setEditor} onDelete={setDeleteTarget} />}{tab === 'orders' && <section><div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="font-mono-ledger text-[9px] uppercase tracking-[.22em] text-[#c6a966]">SK / 03</p><h1 className="mt-3 font-ledger text-4xl text-[#eee3c2]">{t('orders')}</h1></div></div><div className="glass-panel overflow-hidden"><OrderRows orders={orders || []} t={t} onStatus={(id, status) => updateStatus.mutate({ id, data: { status } }, { onSuccess: invalidate })} loading={ordersLoading} detailed /></div></section>}</main></div>{editor && <ProductEditor product={editor === 'new' ? undefined : editor} t={t} onClose={() => setEditor(null)} onDone={() => { setEditor(null); invalidate(); }} />}{deleteTarget && <Modal onClose={() => setDeleteTarget(null)} label={t('deletePiece')}><div className="p-8"><Trash2 size={23} className="text-[#d7977e]" /><h2 className="mt-5 font-ledger text-3xl text-[#eee3c2]">{t('deleteConfirm')}</h2><p className="mt-2 text-sm text-slate-500">{t('deleteBody')}</p><div className="mt-8 flex gap-3"><button type="button" onClick={() => setDeleteTarget(null)} data-testid="button-cancel-delete" className="flex-1 border border-white/10 py-3 text-[10px] uppercase tracking-[.15em] text-slate-400">{t('cancel')}</button><button type="button" onClick={() => remove.mutate({ id: deleteTarget.id }, { onSuccess: () => { setDeleteTarget(null); invalidate(); } })} data-testid="button-confirm-delete" className="flex-1 bg-[#74463e] py-3 text-[10px] uppercase tracking-[.15em] text-[#f1d5cc]">{t('deletePiece')}</button></div></div></Modal>}</div>;
}

function Inventory({ products, loading, t, onAdd, onEdit, onDelete }: { products: Product[]; loading: boolean; t: (key: string) => string; onAdd: () => void; onEdit: (p: Product) => void; onDelete: (p: Product) => void }) {
  return <section><div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="font-mono-ledger text-[9px] uppercase tracking-[.22em] text-[#c6a966]">SK / 02</p><h1 className="mt-3 font-ledger text-4xl text-[#eee3c2]">{t('inventory')}</h1></div><button type="button" onClick={onAdd} data-testid="button-add-product" className="gold-shimmer flex items-center gap-2 px-4 py-3 text-[10px] font-bold uppercase tracking-[.14em] text-[#1d1a14]"><Plus size={14} /> {t('addPiece')}</button></div><div className="glass-panel overflow-x-auto">{loading ? <div data-testid="status-inventory-loading" className="space-y-3 p-6">{[1, 2, 3].map((i) => <div key={i} className="h-12 animate-pulse bg-white/[.04]" />)}</div> : <table className="w-full min-w-[680px] text-left"><thead className="border-b border-white/[.08] font-mono-ledger text-[9px] uppercase tracking-[.15em] text-slate-600"><tr><th className="px-6 py-4">{t('productName')}</th><th className="px-4 py-4">{t('productId')}</th><th className="px-4 py-4">{t('price')}</th><th className="px-4 py-4">{t('stock')}</th><th className="px-6 py-4 text-right">{t('overview')}</th></tr></thead><tbody>{products.map((p) => <tr key={p.id} data-testid={`row-inventory-${p.id}`} className="border-b border-white/[.06] text-sm last:border-0"><td className="px-6 py-5 font-ledger text-lg text-slate-200">{p.name}<span className="ml-2 font-mono-ledger text-[9px] text-slate-600">{p.karat}</span></td><td className="px-4 py-5 font-mono-ledger text-[10px] text-slate-500">{p.productId}</td><td className="px-4 py-5 font-mono-ledger text-xs text-[#d7c38d]">{formatPrice(p.price)}</td><td className={`px-4 py-5 font-mono-ledger text-xs ${p.stock < 4 ? 'text-[#d7977e]' : 'text-slate-400'}`}>{p.stock}</td><td className="px-6 py-5 text-right"><button type="button" onClick={() => onEdit(p)} data-testid={`button-edit-product-${p.id}`} className="mr-3 text-slate-500 hover:text-[#d7c38d]"><Edit3 size={15} /></button><button type="button" onClick={() => onDelete(p)} data-testid={`button-delete-product-${p.id}`} className="text-slate-500 hover:text-[#d7977e]"><Trash2 size={15} /></button></td></tr>)}</tbody></table>}</div></section>;
}

function billLink(order: Order) {
  const recipient = order.phone.replace(/\D/g, '');
  const phone = recipient.startsWith('91') ? recipient : `91${recipient}`;
  const bill = [
    'SK Jewellers',
    `Bill reference: SK-${String(order.id).padStart(5, '0')}`,
    `Customer: ${order.fullName}`,
    `Piece: ${order.productName}`,
    `Quantity: ${order.quantity}`,
    `Total: ${formatPrice(order.totalPrice)}`,
    'Thank you for choosing SK Jewellers, Nehla.',
  ].join('\n');
  return `https://wa.me/${phone}?text=${encodeURIComponent(bill)}`;
}

function OrderRows({ orders, t, onStatus, loading, detailed = false }: { orders: Order[]; t: (key: string) => string; onStatus: (id: number, status: OrderStatusUpdateStatus) => void; loading: boolean; detailed?: boolean }) {
  if (loading) return <div data-testid="status-orders-loading" className="space-y-3 p-5">{[1, 2, 3].map((i) => <div key={i} className="h-11 animate-pulse bg-white/[.04]" />)}</div>;
  if (!orders.length) return <div data-testid="status-orders-empty" className="px-5 py-12 text-center"><ShoppingBag size={22} className="mx-auto text-[#cdb575]" /><p className="mt-4 font-ledger text-xl text-[#e7d7a9]">{t('noOrders')}</p><p className="mt-1 text-xs text-slate-500">{t('noOrdersBody')}</p></div>;
  return <div className={detailed ? 'min-w-[860px]' : ''}>{detailed && <div className="grid grid-cols-[1.15fr_1fr_.7fr_1fr_.4fr] border-b border-white/[.08] px-6 py-4 font-mono-ledger text-[9px] uppercase tracking-[.14em] text-slate-600"><span>{t('customer')}</span><span>{t('item')}</span><span>{t('amount')}</span><span>{t('status')}</span><span className="text-right">{t('sendBill')}</span></div>}{orders.map((o) => <div key={o.id} data-testid={`row-order-${o.id}`} className={`grid gap-3 border-b border-white/[.06] px-5 py-4 last:border-0 ${detailed ? 'grid-cols-[1.15fr_1fr_.7fr_1fr_.4fr] items-center px-6' : 'grid-cols-[1fr_auto] items-start'}`}><div><p className="font-ledger text-base text-slate-200">{o.fullName}</p><p className="mt-1 font-mono-ledger text-[9px] text-slate-600">SK-{String(o.id).padStart(5, '0')} · {o.phone}</p></div><div className="text-xs text-slate-400">{o.productName} <span className="text-slate-600">× {o.quantity}</span></div><div className="font-mono-ledger text-xs text-[#d7c38d]">{formatPrice(o.totalPrice)}</div><select aria-label={t('updateStatus')} data-testid={`select-order-status-${o.id}`} value={o.status} onChange={(e) => onStatus(o.id, e.target.value as OrderStatusUpdateStatus)} className={`border border-white/10 bg-[#141b26] px-2 py-2 text-[10px] uppercase tracking-[.1em] outline-none ${o.status === 'pending' ? 'text-[#d7b274]' : 'text-slate-400'}`}><option value="pending">{t('pendingStatus')}</option><option value="confirmed">{t('confirmed')}</option><option value="dispatched">{t('dispatched')}</option><option value="delivered">{t('delivered')}</option><option value="cancelled">{t('cancelled')}</option></select>{detailed && <a href={billLink(o)} target="_blank" rel="noreferrer" aria-label={t('sendBill')} data-testid={`link-order-bill-${o.id}`} className="justify-self-end text-[#cdb575] transition hover:text-[#f2dfa3]"><ReceiptText size={17} /></a>}</div>)}</div>;
}

function Admin() {
  const { t } = useLanguage();
  const [session, setSession] = useState<{ token: string; expiresAt: string } | null>(() => { try { const value = JSON.parse(localStorage.getItem('sk-admin-session') || 'null'); return value && new Date(value.expiresAt) > new Date() ? value : null; } catch { return null; } });
  const onLoggedIn = (token: string, expiresAt: string) => { const value = { token, expiresAt }; localStorage.setItem('sk-admin-session', JSON.stringify(value)); setSession(value); };
  const signOut = () => { localStorage.removeItem('sk-admin-session'); setSession(null); };
  return session ? <AdminDashboard t={t} onSignOut={signOut} /> : <Login t={t} onLoggedIn={onLoggedIn} />;
}

function Router() {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}><Switch><Route path="/" component={Home} /><Route path="/admin" component={Admin} /><Route component={() => <div className="flex min-h-[100dvh] items-center justify-center text-[#ede5cf]"><div className="text-center"><h1 className="font-ledger text-5xl">The page is not in this ledger.</h1><Link href="/" data-testid="link-not-found-home" className="mt-6 inline-block text-xs uppercase tracking-[.16em] text-[#d7c38d]">Return home</Link></div></div>} /></Switch></ErrorBoundary>;
}

function App() {
  useEffect(() => {
    setAuthTokenGetter(() => {
      try {
        const session = JSON.parse(localStorage.getItem('sk-admin-session') || 'null') as { token?: string; expiresAt?: string } | null;
        return session?.token && session.expiresAt && new Date(session.expiresAt) > new Date() ? session.token : null;
      } catch {
        return null;
      }
    });
    return () => setAuthTokenGetter(null);
  }, []);

  useEffect(() => {
    void syncOfflineOrders();
    window.addEventListener('online', syncOfflineOrders);
    return () => window.removeEventListener('online', syncOfflineOrders);
  }, []);

  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;