import React, { useState, useMemo } from "react";
import { Item, Order, PaymentMode } from "../types";
import { whatsappLink } from "../utils/whatsapp";

type Props = { items: Item[]; orders: Order[]; onAddOrder: (o: Order) => void; onAddItem: (i: Item) => void; };

export default function AdminDashboard({ items, orders, onAddOrder, onAddItem }: Props) {
  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [amount, setAmount] = useState(0);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("Cash");

  const [itemName, setItemName] = useState("");
  const [itemVariety, setItemVariety] = useState("");
  const [itemCategory, setItemCategory] = useState("Ring");
  const [itemWeight, setItemWeight] = useState("");
  const [itemPurity, setItemPurity] = useState("22K");
  const [itemPrice, setItemPrice] = useState("");

  const totalSales = useMemo(() => orders.reduce((s, o) => s + o.amount, 0), [orders]);
  const cash = useMemo(() => orders.filter(o => o.paymentMode === "Cash").reduce((s, o) => s + o.amount, 0), [orders]);
  const upi = useMemo(() => orders.filter(o => o.paymentMode === "UPI").reduce((s, o) => s + o.amount, 0), [orders]);
  const totalItemsSold = orders.reduce((s, o) => s + o.quantity, 0);
  const uniqueCustomers = new Set(orders.map(o => o.customerMobile)).size;

  const handleAddOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !amount) return;
    const newOrder: Order = {
      id: Date.now(), customerName, customerMobile, customerAddress,
      item: selectedItem || "General Jewellery", quantity, amount: Number(amount),
      paymentMode, time: new Date().toLocaleTimeString()
    };
    onAddOrder(newOrder);
    setCustomerName(""); setCustomerMobile(""); setCustomerAddress(""); setAmount(0);
    alert("नया ऑर्डर सफलतापूर्वक दर्ज हो गया!");
  };

  const handleAddInventory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName || !itemPrice) return;
    const newItem: Item = {
      id: Date.now(), name: itemName, variety: itemVariety || "Standard",
      category: itemCategory, weight: itemWeight || "10g", purity: itemPurity,
      price: Number(itemPrice), stock: "Available"
    };
    onAddItem(newItem);
    setItemName(""); setItemVariety(""); setItemWeight(""); setItemPrice("");
    alert("नई ज्वेलरी कैटलॉग में जुड़ गई!");
  };

  function sendBillViaWhatsApp(order: Order) {
    const msg = `🧾 *S.K. Jewellers, Nehla* - बिल रसीद\n\nकस्टमर: ${order.customerName}\nआइटम: ${order.item} (Qty: ${order.quantity})\nकुल राशि: ₹${order.amount}\nपेमेंट: ${order.paymentMode}\n\nधन्यवाद! 🙏`;
    const link = whatsappLink(order.customerMobile || "", msg);
    window.open(link, "_blank");
  }

  return (
    <div className="space-y-6 text-gray-800">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 shadow-sm">
          <p className="text-xs text-amber-800 font-semibold">बिका सामान</p>
          <div className="font-extrabold text-2xl text-amber-950 mt-1">{totalItemsSold}</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200 shadow-sm">
          <p className="text-xs text-blue-800 font-semibold">कुल ऑर्डर्स</p>
          <div className="font-extrabold text-2xl text-blue-950 mt-1">{orders.length}</div>
        </div>
        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 shadow-sm">
          <p className="text-xs text-emerald-800 font-semibold">कस्टमर्स</p>
          <div className="font-extrabold text-2xl text-emerald-950 mt-1">{uniqueCustomers}</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200 shadow-sm">
          <p className="text-xs text-purple-800 font-semibold">कुल बिक्री</p>
          <div className="font-extrabold text-xl text-purple-950 mt-1">₹{totalSales}</div>
          <div className="text-[10px] text-purple-700 font-medium mt-0.5">Cash ₹{cash} | UPI ₹{upi}</div>
        </div>
      </section>

      {/* New Order Form */}
      <section className="bg-amber-50/70 p-5 rounded-3xl border border-amber-200 shadow-sm">
        <h4 className="font-extrabold text-amber-950 mb-4 text-base">📝 नया ऑर्डर दर्ज करें</h4>
        <form onSubmit={handleAddOrder} className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input type="text" placeholder="कस्टमर का नाम" value={customerName} onChange={e => setCustomerName(e.target.value)} className="border border-amber-200 p-3 rounded-xl text-sm bg-white focus:outline-none focus:border-amber-600" required />
          <input type="tel" placeholder="मोबाइल नंबर" value={customerMobile} onChange={e => setCustomerMobile(e.target.value)} className="border border-amber-200 p-3 rounded-xl text-sm bg-white focus:outline-none focus:border-amber-600" />
          <input type="text" placeholder="पता (Address)" value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} className="border border-amber-200 p-3 rounded-xl text-sm bg-white focus:outline-none focus:border-amber-600" />
          <select value={selectedItem} onChange={e => setSelectedItem(e.target.value)} className="border border-amber-200 p-3 rounded-xl text-sm bg-white focus:outline-none focus:border-amber-600">
            <option value="">-- ज्वेलरी आइटम चुनें --</option>
            {items.map(i => <option key={i.id} value={i.name}>{i.name} ({i.weight} - ₹{i.price})</option>)}
          </select>
          <input type="number" min="1" placeholder="मात्रा (Qty)" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="border border-amber-200 p-3 rounded-xl text-sm bg-white focus:outline-none focus:border-amber-600" />
          <input type="number" placeholder="कुल राशि (₹)" value={amount || ""} onChange={e => setAmount(Number(e.target.value))} className="border border-amber-200 p-3 rounded-xl text-sm bg-white focus:outline-none focus:border-amber-600" required />
          <select value={paymentMode} onChange={e => setPaymentMode(e.target.value as PaymentMode)} className="border border-amber-200 p-3 rounded-xl text-sm bg-white focus:outline-none focus:border-amber-600">
            <option value="Cash">Cash (नकद)</option>
            <option value="UPI">UPI (ऑनलाइन)</option>
          </select>
          <div className="md:col-span-2">
            <button type="submit" className="w-full bg-amber-900 hover:bg-amber-950 text-white font-extrabold py-3 rounded-xl shadow-md text-sm transition-all">💾 ऑर्डर सेव करें</button>
          </div>
        </form>
      </section>

      {/* Orders List */}
      <section className="bg-white p-5 rounded-3xl border border-amber-100 shadow-sm">
        <h4 className="font-extrabold text-amber-950 mb-3 text-base">📋 आज के ऑर्डर्स और WhatsApp बिल</h4>
        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
          {orders.length === 0 ? <div className="text-sm text-gray-400 py-6 text-center">अभी कोई ऑर्डर दर्ज नहीं किया गया है।</div> :
            orders.map(o => (
              <div key={o.id} className="flex items-center justify-between border-b border-amber-100 pb-3 pt-1">
                <div>
                  <div className="font-bold text-sm text-gray-900">{o.customerName} <span className="text-xs text-gray-500 font-normal">({o.customerMobile || "नंबर नहीं"})</span></div>
                  <div className="text-xs text-gray-600 mt-0.5">{o.item} (×{o.quantity}) • <span className="font-extrabold text-amber-900">₹{o.amount}</span> [{o.paymentMode}]</div>
                </div>
                <button onClick={() => sendBillViaWhatsApp(o)} className="bg-green-600 hover:bg-green-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all">
                  💬 WhatsApp बिल
                </button>
              </div>
            ))}
        </div>
      </section>

      {/* Inventory Management */}
      <section className="bg-white p-5 rounded-3xl border border-amber-100 shadow-sm">
        <h4 className="font-extrabold text-amber-950 mb-4 text-base">💎 नई ज्वेलरी वैरायटी जोड़ें</h4>
        <form onSubmit={handleAddInventory} className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input type="text" placeholder="आइटम का नाम (जैसे Gold Ring)" value={itemName} onChange={e => setItemName(e.target.value)} className="border border-amber-200 p-3 rounded-xl text-sm focus:outline-none focus:border-amber-600" required />
          <input type="text" placeholder="वैरायटी (जैसे 22K Plain)" value={itemVariety} onChange={e => setItemVariety(e.target.value)} className="border border-amber-200 p-3 rounded-xl text-sm focus:outline-none focus:border-amber-600" />
          <select value={itemCategory} onChange={e => setItemCategory(e.target.value)} className="border border-amber-200 p-3 rounded-xl text-sm focus:outline-none focus:border-amber-600">
            <option value="Ring">Ring</option>
            <option value="Necklace">Necklace</option>
            <option value="Earrings">Earrings</option>
            <option value="Bangles">Bangles</option>
          </select>
          <input type="text" placeholder="वजन (जैसे 10g)" value={itemWeight} onChange={e => setItemWeight(e.target.value)} className="border border-amber-200 p-3 rounded-xl text-sm focus:outline-none focus:border-amber-600" />
          <select value={itemPurity} onChange={e => setItemPurity(e.target.value)} className="border border-amber-200 p-3 rounded-xl text-sm focus:outline-none focus:border-amber-600">
            <option value="22K">22K</option>
            <option value="18K">18K</option>
            <option value="916">916 BIS</option>
          </select>
          <input type="number" placeholder="कीमत (₹)" value={itemPrice} onChange={e => setItemPrice(e.target.value)} className="border border-amber-200 p-3 rounded-xl text-sm focus:outline-none focus:border-amber-600" required />
          <div className="md:col-span-3 pt-2">
            <button type="submit" className="bg-amber-950 hover:bg-amber-900 text-white font-extrabold px-6 py-3 rounded-xl text-sm shadow-md transition-all">➕ कैटलॉग में जोड़ें</button>
          </div>
        </form>
      </section>
    </div>
  );
}
