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
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 shadow-sm">
          <p className="text-xs text-gray-500">बिका सामान</p>
          <div className="font-bold text-2xl text-amber-900">{totalItemsSold}</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 shadow-sm">
          <p className="text-xs text-gray-500">कुल ऑर्डर्स</p>
          <div className="font-bold text-2xl text-blue-900">{orders.length}</div>
        </div>
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 shadow-sm">
          <p className="text-xs text-gray-500">कस्टमर्स</p>
          <div className="font-bold text-2xl text-emerald-900">{uniqueCustomers}</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-xl border border-purple-200 shadow-sm">
          <p className="text-xs text-gray-500">कुल बिक्री</p>
          <div className="font-bold text-xl text-purple-900">₹{totalSales}</div>
          <div className="text-[10px] text-gray-600 mt-1">Cash ₹{cash} | UPI ₹{upi}</div>
        </div>
      </section>

      {/* New Order Form */}
      <section className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200">
        <h4 className="font-bold text-amber-900 mb-4">📝 नया ऑर्डर दर्ज करें</h4>
        <form onSubmit={handleAddOrder} className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input type="text" placeholder="कस्टमर का नाम" value={customerName} onChange={e => setCustomerName(e.target.value)} className="border p-2 rounded text-sm bg-white" required />
          <input type="tel" placeholder="मोबाइल नंबर" value={customerMobile} onChange={e => setCustomerMobile(e.target.value)} className="border p-2 rounded text-sm bg-white" />
          <input type="text" placeholder="पता (Address)" value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} className="border p-2 rounded text-sm bg-white" />
          <select value={selectedItem} onChange={e => setSelectedItem(e.target.value)} className="border p-2 rounded text-sm bg-white">
            <option value="">-- ज्वेलरी आइटम चुनें --</option>
            {items.map(i => <option key={i.id} value={i.name}>{i.name} ({i.weight} - ₹{i.price})</option>)}
          </select>
          <input type="number" min="1" placeholder="मात्रा (Qty)" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="border p-2 rounded text-sm bg-white" />
          <input type="number" placeholder="कुल राशि (₹)" value={amount || ""} onChange={e => setAmount(Number(e.target.value))} className="border p-2 rounded text-sm bg-white" required />
          <select value={paymentMode} onChange={e => setPaymentMode(e.target.value as PaymentMode)} className="border p-2 rounded text-sm bg-white">
            <option value="Cash">Cash (नकद)</option>
            <option value="UPI">UPI (ऑनलाइन)</option>
          </select>
          <div className="md:col-span-2">
            <button type="submit" className="w-full bg-amber-800 hover:bg-amber-900 text-white font-bold py-2.5 rounded text-sm shadow">💾 ऑर्डर सेव करें</button>
          </div>
        </form>
      </section>

      {/* Orders List */}
      <section className="bg-white p-5 rounded-2xl border shadow-sm">
        <h4 className="font-bold text-amber-900 mb-3">📋 आज के ऑर्डर्स और WhatsApp बिल</h4>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {orders.length === 0 ? <div className="text-sm text-gray-400 py-4 text-center">अभी कोई ऑर्डर दर्ज नहीं किया गया है।</div> :
            orders.map(o => (
              <div key={o.id} className="flex items-center justify-between border-b pb-2 pt-1">
                <div>
                  <div className="font-semibold text-sm">{o.customerName} <span className="text-xs text-gray-500 font-normal">({o.customerMobile || "नंबर नहीं"})</span></div>
                  <div className="text-xs text-gray-600">{o.item} (×{o.quantity}) • <span className="font-bold text-amber-800">₹{o.amount}</span> [{o.paymentMode}]</div>
                </div>
                <button onClick={() => sendBillViaWhatsApp(o)} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1 shadow-sm">
                  💬 WhatsApp बिल
                </button>
              </div>
            ))}
        </div>
      </section>

      {/* Inventory Management */}
      <section className="bg-white p-5 rounded-2xl border shadow-sm">
        <h4 className="font-bold text-amber-900 mb-4">💎 नई ज्वेलरी वैरायटी जोड़ें</h4>
        <form onSubmit={handleAddInventory} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 pb-4 border-b">
          <input type="text" placeholder="आइटम का नाम (जैसे Gold Ring)" value={itemName} onChange={e => setItemName(e.target.value)} className="border p-2 rounded text-sm" required />
          <input type="text" placeholder="वैरायटी (जैसे 22K Plain)" value={itemVariety} onChange={e => setItemVariety(e.target.value)} className="border p-2 rounded text-sm" />
          <select value={itemCategory} onChange={e => setItemCategory(e.target.value)} className="border p-2 rounded text-sm">
            <option value="Ring">Ring</option>
            <option value="Necklace">Necklace</option>
            <option value="Earrings">Earrings</option>
            <option value="Bangles">Bangles</option>
          </select>
          <input type="text" placeholder="वजन (जैसे 10g)" value={itemWeight} onChange={e => setItemWeight(e.target.value)} className="border p-2 rounded text-sm" />
          <select value={itemPurity} onChange={e => setItemPurity(e.target.value)} className="border p-2 rounded text-sm">
            <option value="22K">22K</option>
            <option value="18K">18K</option>
            <option value="916">916 BIS</option>
          </select>
          <input type="number" placeholder="कीमत (₹)" value={itemPrice} onChange={e => setItemPrice(e.target.value)} className="border p-2 rounded text-sm" required />
          <div className="md:col-span-3">
            <button type="submit" className="bg-amber-900 hover:bg-amber-800 text-white font-bold px-5 py-2 rounded text-sm shadow">➕ कैटलॉग में जोड़ें</button>
          </div>
        </form>
      </section>
    </div>
  );
}
