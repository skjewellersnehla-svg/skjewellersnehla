import { useState } from "react";
import { MessageCircle, CheckCircle } from "lucide-react";

interface BillingModuleProps {
  adminToken: string;
}

export default function BillingModule({ adminToken }: BillingModuleProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    productId: "",
    quantity: 1,
    paymentMethod: "cash",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "quantity" ? parseInt(value) || 1 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          productId: formData.productId,
          quantity: formData.quantity,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      setSuccess(true);
      setFormData({
        fullName: "",
        phone: "",
        address: "",
        productId: "",
        quantity: 1,
        paymentMethod: "cash",
      });

      // Auto-hide success message
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Order creation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const shareViaWhatsApp = () => {
    const text = `Hi ${formData.fullName}, your jewelry order has been confirmed! Visit our store or call us for more details.`;
    const whatsappUrl = `https://wa.me/${formData.phone.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="bg-white rounded-xl border-2 border-amber-200 p-8 shadow-md">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-amber-900 mb-2">
              Customer Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter customer name"
              className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-amber-900 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+91 98961 02704"
              className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-amber-900 mb-2">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Delivery address"
              rows={3}
              className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">
                Product ID
              </label>
              <input
                type="text"
                name="productId"
                value={formData.productId}
                onChange={handleInputChange}
                placeholder="Enter product ID"
                className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                min="1"
                className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-amber-900 mb-2">
              Payment Method
            </label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-500"
            >
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="check">Check</option>
            </select>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
              <CheckCircle size={18} />
              Order created successfully!
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            {isSubmitting ? "Creating Order..." : "Create Order"}
          </button>
        </form>

        {/* WhatsApp Share Section */}
        <div className="flex flex-col justify-between bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg p-6 border-2 border-emerald-200">
          <div>
            <h3 className="text-xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
              <MessageCircle className="text-emerald-600" />
              WhatsApp Invoice Sharing
            </h3>
            <p className="text-emerald-700 text-sm mb-4">
              Send order confirmation & invoice directly to customer via WhatsApp for instant confirmation and tracking.
            </p>

            <div className="bg-white rounded-lg p-4 mb-4 border border-emerald-200">
              <h4 className="font-semibold text-emerald-900 mb-2">Quick Actions:</h4>
              <ul className="text-sm text-emerald-700 space-y-1 list-disc list-inside">
                <li>Instant order confirmation</li>
                <li>Share payment details securely</li>
                <li>Direct customer communication</li>
                <li>Order tracking updates</li>
              </ul>
            </div>
          </div>

          <button
            onClick={shareViaWhatsApp}
            disabled={!formData.phone}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <MessageCircle size={20} />
            Send via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
