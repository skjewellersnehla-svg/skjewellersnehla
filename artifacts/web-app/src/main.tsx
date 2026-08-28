cd ~/workspace && \
cat << 'EOF' > artifacts/web-app/src/App.tsx
import React, { useState } from "react";

export default function App() {
  const [activeTab, setActiveTab] = useState("admin");
  const [items, setItems] = useState([
    { id: 1, name: "Gold Ring", variety: "22K Plain", category: "Ring", weight: "5g", price: 30000, stock: "Available" }
  ]);
  const [orders, setOrders] = useState([]);

  // Form states
  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [amount, setAmount] = useState(0);
  const [paymentMode, setPaymentMode] = useState("Cash (नकद)");

  const handleAddOrder = (e) => {
    e.preventDefault();
    if (!customerName || !amount) return;
    const newOrder = {
      id: Date.now(),
      customerName,
      customerMobile,
      customerAddress,
      item: selectedItem || "General Jewellery",
      quantity,
      amount: Number(amount),
      paymentMode,
      time: new Date().toLocaleTimeString()
    };
    setOrders([newOrder, ...orders]);
    setCustomerName("");
    setCustomerMobile("");
    setCustomerAddress("");
    setAmount(0);
  };

  const totalSales = orders.reduce((sum, o) => sum + o.amount, 0);
  const cashSales = orders.filter(o => o.paymentMode.includes("Cash")).reduce((sum, o) => sum + o.amount, 0);
  const upiSales = orders.filter(o => o.paymentMode.includes("UPI")).reduce((sum, o) => sum + o.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-emerald-800 text-white p-4 shadow-md flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">✨ S.K. Jewellers (नेहला)</h1>
          <p className="text-xs text-emerald-200">Jewellery Management & Sales Dashboard (5:00 PM Auto-Update)</p>
        </div>
        <div className="space-x-2">
          <button onClick={() => setActiveTab("admin")} className={`px-3 py-1 rounded text-sm ${activeTab === 'admin' ? 'bg-white text-emerald-900 font-bold' : 'bg-emerald-700'}`}>Admin Panel</button>
          <button onClick={() => setActiveTab("catalog")} className={`px-3 py-1 rounded text-sm ${activeTab === 'catalog' ? 'bg-white text-emerald-900 font-bold' : 'bg-emerald-700'}`}>Customer View</button>
        </div>
      </header>

      <main className="p-4 max-w-6xl mx-auto space-y-6">
        {activeTab === "admin" ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl shadow border-l-4 border-emerald-600">
                <p className="text-xs text-gray-500">आज कुल बिका सामान</p>
                <h3 className="text-2xl font-bold text-emerald-800">{orders.length}</h3>
              </div>
              <div className="bg-white p-4 rounded-xl shadow border-l-4 border-blue-600">
                <p className="text-xs text-gray-500">आज कुल Orders</p>
                <h3 className="text-2xl font-bold text-blue-800">{orders.length}</h3>
              </div>
              <div className="bg-white p-4 rounded-xl shadow border-l-4 border-amber-600">
                <p className="text-xs text-gray-500">आज के Customers</p>
                <h3 className="text-2xl font-bold text-amber-800">{new Set(orders.map(o => o.customerMobile)).size}</h3>
              </div>
              <div className="bg-white p-4 rounded-xl shadow border-l-4 border-purple-600">
                <p className="text-xs text-gray-500">आज की कुल बिक्री</p>
                <h3 className="text-2xl font-bold text-purple-800">₹{totalSales}</h3>
              </div>
            </div>

            {/* Manual Entry Form */}
            <div className="bg-white p-6 rounded-xl shadow border border-emerald-100">
              <h2 className="text-lg font-bold text-emerald-800 mb-4">➕ नया ऑर्डर / बिक्री मैन्युअल दर्ज करें</h2>
              <form onSubmit={handleAddOrder} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600">कस्टमर का नाम</label>
                  <input type="text" placeholder="जैसे: रमेश कुमार" value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full border p-2 rounded mt-1" required />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600">मोबाइल नंबर</label>
                  <input type="text" placeholder="10 अंकों का मोबाइल नंबर" value={customerMobile} onChange={e => setCustomerMobile(e.target.value)} className="w-full border p-2 rounded mt-1" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600">पता (Address)</label>
                  <input type="text" placeholder="गाँव / शहर का नाम" value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} className="w-full border p-2 rounded mt-1" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600">ज्वेलरी / वैरायटी चुनें (Drop-down)</label>
                  <select value={selectedItem} onChange={e => setSelectedItem(e.target.value)} className="w-full border p-2 rounded mt-1">
                    <option value="">-- आइटम चुनें --</option>
                    {items.map(i => <option key={i.id} value={i.name}>{i.name} ({i.variety} - {i.weight})</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600">मात्रा (Quantity)</label>
                  <input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} className="w-full border p-2 rounded mt-1" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600">कुल राशि (Amount in ₹)</label>
                  <input type="number" placeholder="जैसे: 25000" value={amount} onChange={e => setAmount(e.target.value)} className="w-full border p-2 rounded mt-1" required />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600">पेमेंट का तरीका (Payment Mode)</label>
                  <select value={paymentMode} onChange={e => setPaymentMode(e.target.value)} className="w-full border p-2 rounded mt-1">
                    <option value="Cash (नकद)">💵 Cash (नकद)</option>
                    <option value="UPI (ऑनलाइन)">📱 UPI (ऑनलाइन)</option>
                  </select>
                </div>
                <div className="flex items-end gap-2">
                  <button type="submit" className="w-full bg-emerald-700 text-white py-2 rounded font-bold hover:bg-emerald-800">💾 रिकॉर्ड सेव करें</button>
                  <button type="button" onClick={() => alert("WhatsApp Bill Shared!")} className="w-full bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700">💬 WhatsApp पर बिल</button>
                </div>
              </form>
            </div>

            {/* Payment Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl shadow">
                <p className="text-sm font-semibold text-gray-600">💵 Cash Payment</p>
                <h3 className="text-2xl font-bold text-emerald-700">₹{cashSales}</h3>
              </div>
              <div className="bg-white p-4 rounded-xl shadow">
                <p className="text-sm font-semibold text-gray-600">📱 UPI Payment</p>
                <h3 className="text-2xl font-bold text-blue-700">₹{upiSales}</h3>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white p-4 rounded-xl shadow overflow-x-auto">
              <h3 className="font-bold text-gray-700 mb-3">📋 आज के Customer Orders</h3>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b bg-gray-100">
                    <th className="p-2">Customer</th>
                    <th className="p-2">Mobile / Address</th>
                    <th className="p-2">Item / Variety</th>
                    <th className="p-2">Qty</th>
                    <th className="p-2">Payment</th>
                    <th className="p-2">Total</th>
                    <th className="p-2">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr><td colSpan="7" className="p-4 text-center text-gray-400">आज अभी कोई order नहीं मिला।</td></tr>
                  ) : (
                    orders.map(o => (
                      <tr key={o.id} className="border-b">
                        <td className="p-2 font-medium">{o.customerName}</td>
                        <td className="p-2 text-gray-600">{o.customerMobile}</td>
                        <td className="p-2">{o.item}</td>
                        <td className="p-2">{o.quantity}</td>
                        <td className="p-2">{o.paymentMode}</td>
                        <td className="p-2 font-bold text-emerald-700">₹{o.amount}</td>
                        <td className="p-2 text-xs text-gray-500">{o.time}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <h2 className="text-xl font-bold text-emerald-800 mb-2">💎 S.K. Jewellers Catalog</h2>
            <p className="text-gray-600 mb-4">यहाँ कस्टमर आपकी ज्वेलरी की वैरायटी, वजन और कैरेट देख सकता है।</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              {items.map(i => (
                <div key={i.id} className="border p-4 rounded-lg shadow-sm">
                  <h3 className="font-bold text-lg text-emerald-900">{i.name}</h3>
                  <p className="text-sm text-gray-600">Variety: {i.variety}</p>
                  <p className="text-sm text-gray-600">Weight: {i.weight}</p>
                  <p className="text-emerald-700 font-bold mt-2">₹{i.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
EOF
git add . && git commit -m "feat: update dashboard matching reference layout for jewellery" && git push origin main
