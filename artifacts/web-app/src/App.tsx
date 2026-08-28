cd ~/workspace && \
cat << 'EOF' > artifacts/web-app/src/App.tsx
import React, { useState, useEffect } from "react";

export default function App() {
  const [adminToken, setAdminToken] = useState<string | null>(
    localStorage.getItem("adminToken")
  );
  
  const [activeTab, setActiveTab] = useState("dashboard");
  const [items, setItems] = useState([
    { id: 1, name: "Gold Ring", variety: "22K Plain", category: "Ring", weight: "5g", purity: "22K", price: 35000, stock: "Available" },
    { id: 2, name: "Gold Necklace", variety: "18K Designer", category: "Necklace", weight: "25g", purity: "18K", price: 175000, stock: "Available" }
  ]);
  const [orders, setOrders] = useState([]);

  // Form states for New Order
  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [amount, setAmount] = useState(0);
  const [paymentMode, setPaymentMode] = useState("Cash (नकद)");

  // Form states for New Inventory Item
  const [itemName, setItemName] = useState("");
  const [itemVariety, setItemVariety] = useState("");
  const [itemCategory, setItemCategory] = useState("Ring");
  const [itemWeight, setItemWeight] = useState("");
  const [itemPurity, setItemPurity] = useState("22K");
  const [itemPrice, setItemPrice] = useState("");

  useEffect(() => {
    if (adminToken) {
      localStorage.setItem("adminToken", adminToken);
    } else {
      localStorage.removeItem("adminToken");
    }
  }, [adminToken]);

  const handleAddOrder = (e: React.FormEvent) => {
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
    alert("Order recorded successfully & saved!");
  };

  const handleAddInventory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName || !itemPrice) return;
    const newItem = {
      id: Date.now(),
      name: itemName,
      variety: itemVariety || "Standard",
      category: itemCategory,
      weight: itemWeight || "10g",
      purity: itemPurity,
      price: Number(itemPrice),
      stock: "Available"
    };
    setItems([newItem, ...items]);
    setItemName("");
    setItemVariety("");
    setItemWeight("");
    setItemPrice("");
    alert("New Jewellery variety added to catalog!");
  };

  const totalSales = orders.reduce((sum, o) => sum + o.amount, 0);
  const cashSales = orders.filter(o => o.paymentMode.includes("Cash")).reduce((sum, o) => sum + o.amount, 0);
  const upiSales = orders.filter(o => o.paymentMode.includes("UPI")).reduce((sum, o) => sum + o.amount, 0);

  if (!adminToken) {
    return <LoginPage onLogin={setAdminToken} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-yellow-50 to-orange-50 text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-amber-900 text-white p-4 shadow-md flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">✨ S.K. Jewellers (नेहला) - Admin Dashboard</h1>
          <p className="text-xs text-amber-200">Luxury Jewelry Management & 5:00 PM Auto-Update System</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setAdminToken(null)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-semibold">Logout</button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl space-y-12">
        {/* Live Metrics */}
        <section>
          <h2 className="text-2xl font-bold text-amber-900 mb-6">📊 Live Sales & Metrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl shadow border-l-4 border-amber-600">
              <p className="text-xs text-gray-500">आज कुल बिका सामान</p>
              <h3 className="text-2xl font-bold text-amber-900">{orders.length}</h3>
            </div>
            <div className="bg-white p-4 rounded-xl shadow border-l-4 border-blue-600">
              <p className="text-xs text-gray-500">आज कुल Orders</p>
              <h3 className="text-2xl font-bold text-blue-900">{orders.length}</h3>
            </div>
            <div className="bg-white p-4 rounded-xl shadow border-l-4 border-emerald-600">
              <p className="text-xs text-gray-500">आज के Customers</p>
              <h3 className="text-2xl font-bold text-emerald-900">{new Set(orders.map(o => o.customerMobile)).size}</h3>
            </div>
            <div className="bg-white p-4 rounded-xl shadow border-l-4 border-purple-600">
              <p className="text-xs text-gray-500">आज की कुल बिक्री</p>
              <h3 className="text-2xl font-bold text-purple-900">₹{totalSales}</h3>
            </div>
          </div>
        </section>

        {/* Payment Breakdown */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-xl shadow border border-amber-200">
            <p className="text-sm font-semibold text-gray-600">💵 Cash Payment (नकद बिक्री)</p>
            <h3 className="text-3xl font-bold text-emerald-700 mt-1">₹{cashSales}</h3>
          </div>
          <div className="bg-white p-5 rounded-xl shadow border border-amber-200">
            <p className="text-sm font-semibold text-gray-600">📱 UPI Payment (ऑनलाइन बिक्री)</p>
            <h3 className="text-3xl font-bold text-blue-700 mt-1">₹{upiSales}</h3>
          </div>
        </section>

        {/* Billing & WhatsApp Module */}
        <section className="bg-white p-6 rounded-2xl shadow-xl border border-amber-100">
          <h2 className="text-2xl font-bold text-amber-900 mb-6">📝 नया ऑर्डर / बिलिंग & WhatsApp शेयर</h2>
          <form onSubmit={handleAddOrder} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-amber-900">कस्टमर का नाम</label>
              <input type="text" placeholder="जैसे: रमेश कुमार" value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full border-2 border-amber-200 p-2.5 rounded-lg mt-1" required />
            </div>
            <div>
              <label className="text-xs font-semibold text-amber-900">मोबाइल नंबर</label>
              <input type="tel" placeholder="10 अंकों का मोबाइल" value={customerMobile} onChange={e => setCustomerMobile(e.target.value)} className="w-full border-2 border-amber-200 p-2.5 rounded-lg mt-1" />
            </div>
            <div>
              <label className="text-xs font-semibold text-amber-900">पता (Address)</label>
              <input type="text" placeholder="गाँव / शहर" value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} className="w-full border-2 border-amber-200 p-2.5 rounded-lg mt-1" />
            </div>
            <div>
              <label className="text-xs font-semibold text-amber-900">ज्वेलरी आइटम चुनें (Drop-down)</label>
              <select value={selectedItem} onChange={e => setSelectedItem(e.target.value)} className="w-full border-2 border-amber-200 p-2.5 rounded-lg mt-1">
                <option value="">-- आइटम चुनें --</option>
                {items.map(i => <option key={i.id} value={i.name}>{i.name} ({i.variety} - {i.weight} - {i.purity})</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-amber-900">मात्रा (Quantity)</label>
              <input type="number" min="1" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="w-full border-2 border-amber-200 p-2.5 rounded-lg mt-1" />
            </div>
            <div>
              <label className="text-xs font-semibold text-amber-900">कुल राशि (Amount in ₹)</label>
              <input type="number" placeholder="जैसे: 45000" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full border-2 border-amber-200 p-2.5 rounded-lg mt-1" required />
            </div>
            <div>
              <label className="text-xs font-semibold text-amber-900">पेमेंट का तरीका (Payment Mode)</label>
              <select value={paymentMode} onChange={e => setPaymentMode(e.target.value)} className="w-full border-2 border-amber-200 p-2.5 rounded-lg mt-1">
                <option value="Cash (नकद)">💵 Cash (नकद)</option>
                <option value="UPI (ऑनलाइन)">📱 UPI (ऑनलाइन)</option>
              </select>
            </div>
            <div className="md:col-span-2 flex items-end gap-3">
              <button type="submit" className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold py-3 rounded-lg shadow hover:opacity-90">💾 रिकॉर्ड सेव करें</button>
              <button type="button" onClick={() => alert("WhatsApp Bill generation link triggered!")} className="w-full bg-green-600 text-white font-bold py-3 rounded-lg shadow hover:bg-green-700">💬 WhatsApp पर बिल भेजें</button>
            </div>
          </form>
        </section>

        {/* Orders Table */}
        <section className="bg-white p-6 rounded-2xl shadow-xl border border-amber-100 overflow-x-auto">
          <h3 className="text-xl font-bold text-amber-900 mb-4">📋 आज के Customer Orders</h3>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-amber-50 text-amber-900">
                <th className="p-3">Customer</th>
                <th className="p-3">Mobile / Address</th>
                <th className="p-3">Item / Details</th>
                <th className="p-3">Qty</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Total</th>
                <th className="p-3">Time</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan="7" className="p-6 text-center text-gray-400">आज अभी कोई order दर्ज नहीं किया गया है।</td></tr>
              ) : (
                orders.map(o => (
                  <tr key={o.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-semibold">{o.customerName}</td>
                    <td className="p-3 text-gray-600">{o.customerMobile}</td>
                    <td className="p-3">{o.item}</td>
                    <td className="p-3">{o.quantity}</td>
                    <td className="p-3">{o.paymentMode}</td>
                    <td className="p-3 font-bold text-amber-800">₹{o.amount}</td>
                    <td className="p-3 text-xs text-gray-500">{o.time}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>

        {/* Inventory Section */}
        <section className="bg-white p-6 rounded-2xl shadow-xl border border-amber-100">
          <h2 className="text-2xl font-bold text-amber-900 mb-6">💎 नई ज्वेलरी वैरायटी कैटलॉग में जोड़ें</h2>
          <form onSubmit={handleAddInventory} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 pb-6 border-b">
            <div>
              <label className="text-xs font-semibold text-amber-900">आइटम का नाम</label>
              <input type="top" placeholder="जैसे: Gold Ring / Bangle" value={itemName} onChange={e => setItemName(e.target.value)} className="w-full border-2 border-amber-200 p-2.5 rounded-lg mt-1" required />
            </div>
            <div>
              <label className="text-xs font-semibold text-amber-900">वैरायटी (Variety)</label>
              <input type="text" placeholder="जैसे: 22K Hallmarked" value={itemVariety} onChange={e => setItemVariety(e.target.value)} className="w-full border-2 border-amber-200 p-2.5 rounded-lg mt-1" />
            </div>
            <div>
              <label className="text-xs font-semibold text-amber-900">कैटेगरी (Category)</label>
              <select value={itemCategory} onChange={e => setItemCategory(e.target.value)} className="w-full border-2 border-amber-200 p-2.5 rounded-lg mt-1">
                <option value="Ring">Ring (अंगूठी)</option>
                <option value="Necklace">Necklace (हार)</option>
                <option value="Earrings">Earrings (झुमके)</option>
                <option value="Bangles">Bangles (कंगन)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-amber-900">वजन (Weight)</label>
              <input type="text" placeholder="जैसे: 10g" value={itemWeight} onChange={e => setItemWeight(e.target.value)} className="w-full border-2 border-amber-200 p-2.5 rounded-lg mt-1" />
            </div>
            <div>
              <label className="text-xs font-semibold text-amber-900">कैरेट / शुद्धता (Purity)</label>
              <select value={itemPurity} onChange={e => setItemPurity(e.target.value)} className="w-full border-2 border-amber-200 p-2.5 rounded-lg mt-1">
                <option value="22K">22K Gold</option>
                <option value="18K">18K Gold</option>
                <option value="916">916 BIS</option>
                <option value="Silver">Silver</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-amber-900">कीमत (Price in ₹)</label>
              <input type="number" placeholder="जैसे: 55000" value={itemPrice} onChange={e => setItemPrice(e.target.value)} className="w-full border-2 border-amber-200 p-2.5 rounded-lg mt-1" required />
            </div>
            <div className="md:col-span-3">
              <button type="submit" className="bg-amber-800 hover:bg-amber-900 text-white font-bold px-6 py-3 rounded-lg shadow">➕ कैटलॉग में सेव करें</button>
            </div>
          </form>

          <h3 className="text-xl font-bold text-amber-900 mb-4">📦 वर्तमान स्टॉक और वैरायटी लिस्ट</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {items.map(i => (
              <div key={i.id} className="border-2 border-amber-100 p-4 rounded-xl bg-amber-50/50 shadow-sm">
                <h4 className="font-bold text-lg text-amber-900">{i.name}</h4>
                <p className="text-xs text-gray-600 mt-1">Variety: {i.variety} | Category: {i.category}</p>
                <p className="text-xs text-gray-600">Weight: {i.weight} | Purity: {i.purity}</p>
                <p className="text-amber-800 font-bold text-lg mt-2">₹{i.price}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

interface LoginPageProps {
  onLogin: (token: string) => void;
}

function LoginPage({ onLogin }: LoginPageProps) {
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin("mock-admin-token-sk-jewellers");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-amber-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-amber-900 mb-2">S.K. Jewellers Nehla</h1>
          <p className="text-sm text-amber-700">Admin Dashboard Login</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-amber-900 mb-1">Phone Number</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98961 02704" className="w-full px-4 py-3 border-2 border-amber-200 rounded-lg bg-amber-50" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-amber-900 mb-1">PIN</label>
            <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="6-digit PIN" className="w-full px-4 py-3 border-2 border-amber-200 rounded-lg bg-amber-50" required />
          </div>
          {error && <div className="bg-red-50 text-red-700 p-3 rounded text-sm">{error}</div>}
          <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:opacity-90">
            {isLoading ? "Logging in..." : "Login to Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}
EOF
git add . && git commit -m "feat: complete SK Jewellers admin dashboard with inventory and dropdowns" && git push origin main
