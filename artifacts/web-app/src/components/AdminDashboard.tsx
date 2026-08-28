import React, { useState, useMemo } from "react";
import { Item, Order, PaymentMode } from "../types";
import { whatsappLink, SHOP_PHONE, SHOP_NAME } from "../utils/whatsapp";

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

  function sendBillViaWhatsApp(order: Order, sendToCustomer: boolean) {
    const msg = `✨ *${SHOP_NAME}* ✨\n\nनमस्ते ${order.customerName} जी,\nहमारी दुकान से आभूषण खरीदने के लिए आपका बहुत-बहुत धन्यवाद! 🙏\n\n📋 खरीदारी का विवरण:\n• आभूषण: ${order.item} (Qty: ${order.quantity})\n• कुल राशि: ₹${order.amount}\n• भुगतान: ${order.paymentMode} (${order.paymentMode === "Cash" ? "नकद" : "ऑनलाइन"})\n\n✨ आपके आभूषण हमेशा चमकते रहें!\n📞 संपर्क: ${SHOP_PHONE}`;
    
    // If sending to customer, use customer mobile if available; otherwise use shop phone or general link
    const targetPhone = sendToCustomer ? (order.customerMobile || "") : SHOP_PHONE;
    const link = whatsappLink(targetPhone, msg);
    window.open(link, "_blank");
  }

  return (
    <div className="space-y-6 text-gray-800">
      {/* 4 Summary Cards */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-3xl border border-amber-200 shadow-sm">
          <p className="text-xs text-amber-800 font-extrabold">बिका सामान</p>
          <div className="font-black text-2xl text-amber-950 mt-1">{totalItemsSold}</div>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-amber-200 shadow-sm">
          <p className="text-xs text-blue-800 font-extrabold">कुल ऑर्डर्स</p>
          <div className="font-black text-2xl text-blue-950 mt-1">{orders.length}</div>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-amber-200 shadow-sm">
          <p className="text-xs text-emerald-800 font-extrabold">कुल ग्राहक</p>
          <div className="font-black text-2xl text-emerald-950 mt-1">{uniqueCustomers}</div>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-amber-200 shadow-sm">
          <p className="text-xs text-purple-800 font-extrabold">कुल बिक्री</p>
          <div className="font-black text-xl text-purple-950 mt-1">₹{totalSales}</div>
        </div>
      </section>

      {/* Cash & UPI breakdown */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-amber-200 shadow-sm">
          <div className="text-xs text-gray-500 font-extrabold">Cash Payment</div>
          <div className="text-2xl font-black text-amber-950 mt-1">₹{cash}</div>
          <div className="text-xs text-amber-700 font-semibold mt-0.5">नकद से कुल बिक्री</div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-amber-200 shadow-sm">
          <div className="text-xs text-gray-500 font-extrabold">UPI Payment</div>
          <div className="text-2xl font-black text-blue-950 mt-1">₹{upi}</div>
          <div className="text-xs text-blue-700 font-semibold mt-0.5">ऑनलाइन से कुल बिक्री</div>
        </div>
      </section>

      {/* New Order Form */}
      <section className="bg-white p-5 sm:p-6 rounded-3xl border border-amber-200 shadow-md">
        <h4 className="font-black text-amber-950 mb-1 text-base">📝 नया ऑर्डर / बिलिंग मैन्युअल दर्ज करें</h4>
        <p className="text-xs text-gray-500 mb-4">यहाँ से कस्टमर का रिकॉर्ड और आभूषण की बिक्री दर्ज करें। WhatsApp बिल भी भेज सकते हैं।</p>
        <form onSubmit={handleAddOrder} className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-amber-900">कस्टमर का नाम</label>
            <input type="text" placeholder="जैसे: रमेश कुमार" value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full border-2 border-amber-200 p-3 rounded-2xl text-sm bg-amber-50/20 focus:outline-none focus:border-amber-700 font-bold mt-1" required />
          </div>
          <div>
            <label className="text-xs font-bold text-amber-900">मोबाइल नंबर</label>
            <input type="tel" placeholder="10 अंकों का मोबाइल नंबर" value={customerMobile} onChange={e => setCustomerMobile(e.target.value)} className="w-full border-2 border-amber-200 p-3 rounded-2xl text-sm bg-amber-50/20 focus:outline-none focus:border-amber-700 font-bold mt-1" />
          </div>
          <div>
            <label className="text-xs font-bold text-amber-900">कस्टमर का पता (Address)</label>
            <input type="text" placeholder="गाँव / शहर का नाम" value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} className="w-full border-2 border-amber-200 p-3 rounded-2xl text-sm bg-amber-50/20 focus:outline-none focus:border-amber-700 font-bold mt-1" />
          </div>
          <div>
            <label className="text-xs font-bold text-amber-900">आभूषण / वैरायटी चुनें</label>
            <select value={selectedItem} onChange={e => setSelectedItem(e.target.value)} className="w-full border-2 border-amber-200 p-3 rounded-2xl text-sm bg-amber-50/20 focus:outline-none focus:border-amber-700 font-bold mt-1">
              <option value="">-- आभूषण चुनें --</option>
              {items.map(i => <option key={i.id} value={i.name}>{i.name} ({i.weight} - ₹{i.price})</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-amber-900">मात्रा (Quantity)</label>
            <input type="number" min="1" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="w-full border-2 border-amber-200 p-3 rounded-2xl text-sm bg-amber-50/20 focus:outline-none focus:border-amber-700 font-bold mt-1" />
          </div>
          <div>
            <label className="text-xs font-bold text-amber-900">कुल राशि (Amount in ₹)</label>
            <input type="number" placeholder="जैसे: 35000" value={amount || ""} onChange={e => setAmount(Number(e.target.value))} className="w-full border-2 border-amber-200 p-3 rounded-2xl text-sm bg-amber-50/20 focus:outline-none focus:border-amber-700 font-bold mt-1" required />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-bold text-amber-900">पेमेंट का तरीका (Payment Mode)</label>
            <select value={paymentMode} onChange={e => setPaymentMode(e.target.value as PaymentMode)} className="w-full border-2 border-amber-200 p-3 rounded-2xl text-sm bg-amber-50/20 focus:outline-none focus:border-amber-700 font-bold mt-1">
              <option value="Cash">Cash (नकद)</option>
              <option value="UPI">UPI (ऑनलाइन)</option>
            </select>
          </div>
          <div className="md:col-span-2 flex gap-3 pt-2">
            <button type="submit" className="flex-1 bg-amber-900 hover:bg-amber-950 text-white font-black py-3.5 rounded-2xl shadow-md text-sm transition-all">💾 रिकॉर्ड सेव करें</button>
          </div>
        </form>
      </section>

      {/* Orders Table */}
      <section className="bg-white p-5 rounded-3xl border border-amber-200 shadow-sm">
        <h4 className="font-black text-amber-950 mb-3 text-base">📋 आज के Customer Orders और WhatsApp बिल</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-amber-200 text-amber-900 font-black">
                <th className="pb-3">Customer</th>
                <th className="pb-3">Mobile / Address</th>
                <th className="pb-3">Item</th>
                <th className="pb-3">Qty</th>
                <th className="pb-3">Payment</th>
                <th className="pb-3">Total</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100 font-semibold text-gray-700">
              {orders.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-6 text-gray-400 font-medium">अभी कोई order नहीं मिला है।</td></tr>
              ) : (
                orders.map(o => (
                  <tr key={o.id} className="hover:bg-amber-50/50">
                    <td className="py-3 font-bold text-gray-900">{o.customerName}</td>
                    <td className="py-3 text-gray-500">{o.customerMobile || "-"}</td>
                    <td className="py-3 text-amber-950 font-bold">{o.item}</td>
                    <td className="py-3">{o.quantity}</td>
                    <td className="py-3"><span className="px-2 py-1 bg-amber-100 text-amber-900 rounded-lg">{o.paymentMode}</span></td>
                    <td className="py-3 font-black text-amber-950">₹{o.amount}</td>
                    <td className="py-3 text-right">
                      <button onClick={() => sendBillViaWhatsApp(o, true)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl font-bold shadow-sm transition-all inline-flex items-center gap-1">
                        💬 WhatsApp बिल
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Inventory Management */}
      <section className="bg-white p-5 sm:p-6 rounded-3xl border border-amber-200 shadow-sm">
        <h4 className="font-black text-amber-950 mb-1 text-base">➕ नया आभूषण Catalog में जोड़ें</h4>
        <p className="text-xs text-gray-500 mb-4">कैटलॉग में नए गहने और उनकी कीमत जोड़ें।</p>
        <form onSubmit={handleAddInventory} className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-amber-900">आइटम का नाम</label>
            <input type="text" placeholder="जैसे: Gold Ring" value={itemName} onChange={e => setItemName(e.target.value)} className="w-full border-2 border-amber-200 p-3 rounded-2xl text-sm font-bold mt-1 focus:outline-none focus:border-amber-700" required />
          </div>
          <div>
            <label className="text-xs font-bold text-amber-900">वैरायटी (Variety)</label>
            <input type="text" placeholder="जैसे: 22K Plain" value={itemVariety} onChange={e => setItemVariety(e.target.value)} className="w-full border-2 border-amber-200 p-3 rounded-2xl text-sm font-bold mt-1 focus:outline-none focus:border-amber-700" />
          </div>
          <div>
            <label className="text-xs font-bold text-amber-900">Category</label>
            <select value={itemCategory} onChange={e => setItemCategory(e.target.value)} className="w-full border-2 border-amber-200 p-3 rounded-2xl text-sm font-bold mt-1 focus:outline-none focus:border-amber-700">
              <option value="Ring">Ring</option>
              <option value="Necklace">Necklace</option>
              <option value="Earrings">Earrings</option>
              <option value="Bangles">Bangles</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-amber-900">वजन (Weight)</label>
            <input type="text" placeholder="जैसे: 10g" value={itemWeight} onChange={e => setItemWeight(e.target.value)} className="w-full border-2 border-amber-200 p-3 rounded-2xl text-sm font-bold mt-1 focus:outline-none focus:border-amber-700" />
          </div>
          <div>
            <label className="text-xs font-bold text-amber-900">शुद्धता (Purity)</label>
            <select value={itemPurity} onChange={e => setItemPurity(e.target.value)} className="w-full border-2 border-amber-200 p-3 rounded-2xl text-sm font-bold mt-1 focus:outline-none focus:border-amber-700">
              <option value="22K">22K</option>
              <option value="18K">18K</option>
              <option value="916">916 BIS</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-amber-900">कीमत (Price in ₹)</label>
            <input type="number" placeholder="जैसे: 50000" value={itemPrice} onChange={e => setItemPrice(e.target.value)} className="w-full border-2 border-amber-200 p-3 rounded-2xl text-sm font-bold mt-1 focus:outline-none focus:border-amber-700" required />
          </div>
          <div className="md:col-span-2 pt-2">
            <button type="submit" className="bg-amber-950 hover:bg-amber-900 text-white font-black px-6 py-3.5 rounded-2xl text-sm shadow-md transition-all">✨ कैटलॉग में जोड़ें</button>
          </div>
        </form>
      </section>
    </div>
  );
}
