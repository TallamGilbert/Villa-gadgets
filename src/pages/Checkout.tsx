import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  Smartphone,
  MapPin,
  User,
  ChevronRight,
  CheckCircle2,
  Loader2,
  CreditCard,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useCart } from "../context/CartContext";
import { useSettings } from "../context/SettingsContext";
import { formatCurrency } from "../lib/utils";
import { Button } from "../components/ui/Button";
import { supabase } from "../lib/supabase";
import { usePaystackPayment } from "react-paystack";

const PAYSTACK_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

export default function Checkout() {
  const { user } = useAuth();
  const { cart, totalAmount, clearCart } = useCart();
  const { whatsapp_number } = useSettings();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    county: "Nairobi",
  });

  const counties = [
    "Nairobi",
    "Mombasa",
    "Kisumu",
    "Nakuru",
    "Eldoret",
    "Other",
  ];

  const isValidPhone = (phone: string) =>
    /^(07|01|\+2547|\+2541)[0-9]{8}$/.test(phone.replace(/\s/g, ""));

  // Paystack requires an email — we derive one from phone
  const derivedEmail = `${formData.phone.replace(/\s/g, "")}@villagadgets.co.ke`;

  // Paystack config
  const paystackConfig = {
    reference: `VG-${Date.now()}`,
    email: derivedEmail,
    amount: totalAmount * 100, // Paystack uses lowest currency unit (cents/kobo)
    currency: "KES",
    publicKey: PAYSTACK_KEY,
    channels: ["card", "mobile_money"] as any,
    metadata: {
      custom_fields: [
        {
          display_name: "Customer Name",
          variable_name: "customer_name",
          value: formData.name,
        },
        {
          display_name: "Phone Number",
          variable_name: "phone_number",
          value: formData.phone,
        },
      ],
    },
  };

  const initializePayment = usePaystackPayment(paystackConfig);

  // Step 1 → Step 2: save order as pending, then open Paystack
  const handleProceedToPayment = async () => {
    setIsSavingOrder(true);
    setError(null);

    try {
      // 1. Insert order
      const { data, error: insertError } = await supabase
        .from("orders")
        .insert([
          {
            customer_name: formData.name,
            phone_number: formData.phone,
            location: `${formData.location}, ${formData.county}`,
            total_amount: totalAmount,
            status: "pending",
            payment_reference: paystackConfig.reference,
            user_id: user?.id || null,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      // 2. Insert order items into order_items table
      const { error: itemsError } = await supabase.from("order_items").insert(
        cart.map((item) => ({
          order_id: data.id,
          product_id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image_url: item.image_url,
        })),
      );

      if (itemsError) throw itemsError;

      setOrderId(String(data.id));
      setStep(2);
    } catch (err: any) {
      setError(err.message || "Failed to create order. Please try again.");
    } finally {
      setIsSavingOrder(false);
    }
  };

  // Paystack success callback
  const onPaystackSuccess = async (response: any) => {
    try {
      await supabase
        .from("orders")
        .update({
          status: "paid",
          payment_reference: response.reference,
        })
        .eq("id", Number(orderId));

      clearCart();
      setStep(3);
    } catch (err: any) {
      setError(
        "Payment received but order update failed. Contact support with reference: " +
          response.reference,
      );
    }
  };

  // Paystack close/cancel callback
  const onPaystackClose = () => {
    setError("Payment was cancelled. Your order is saved — you can try again.");
  };

  const handleOpenPaystack = () => {
    initializePayment({
      onSuccess: onPaystackSuccess,
      onClose: onPaystackClose,
    });
  };

  if (cart.length === 0 && step !== 3) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="pt-28 pb-24 min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="flex items-center justify-center mb-12 space-x-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step >= s
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {s < step ? <CheckCircle2 className="w-5 h-5" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`w-20 h-1 mx-2 rounded ${
                    step > s ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1 — Delivery Details */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100"
            >
              <h2 className="text-2xl font-black text-[#0A2540] mb-8">
                Delivery Details
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="0700 000 000"
                      className={`w-full pl-12 pr-4 py-4 bg-gray-50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                        formData.phone && !isValidPhone(formData.phone)
                          ? "border-red-300"
                          : "border-gray-100"
                      }`}
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                  {formData.phone && !isValidPhone(formData.phone) && (
                    <p className="text-red-500 text-xs mt-1 ml-1">
                      Enter a valid Kenyan number (e.g. 0712 345 678)
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                    Delivery Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Apartment, Street, Landmark"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                    County
                  </label>
                  <select
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    value={formData.county}
                    onChange={(e) =>
                      setFormData({ ...formData, county: e.target.value })
                    }
                  >
                    {counties.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {error && (
                <div className="mt-6 bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl">
                  {error}
                </div>
              )}

              <Button
                onClick={handleProceedToPayment}
                className="w-full mt-10"
                disabled={
                  !formData.name ||
                  !formData.phone ||
                  !formData.location ||
                  !isValidPhone(formData.phone) ||
                  isSavingOrder
                }
              >
                {isSavingOrder ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Preparing order...
                  </>
                ) : (
                  <>
                    Continue to Payment
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
            </motion.div>
          )}

          {/* Step 2 — Confirm & Pay */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100"
            >
              <h2 className="text-2xl font-black text-[#0A2540] mb-8">
                Confirm & Pay
              </h2>

              {/* Order Items */}
              <div className="bg-gray-50 p-6 rounded-3xl mb-6 space-y-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                  Order Summary
                </p>
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {item.name}{" "}
                      <span className="text-gray-400">x{item.quantity}</span>
                    </span>
                    <span className="font-bold">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-xl font-black text-blue-600">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="bg-gray-50 p-6 rounded-3xl mb-6 space-y-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                  Delivery Info
                </p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Recipient</span>
                  <span className="font-bold text-[#0A2540]">
                    {formData.name}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Location</span>
                  <span className="font-bold text-[#0A2540]">
                    {formData.location}, {formData.county}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Phone</span>
                  <span className="font-bold text-[#0A2540]">
                    {formData.phone}
                  </span>
                </div>
              </div>

              {/* Payment Methods Info */}
              <div className="border border-gray-100 p-6 rounded-3xl mb-8">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                  Accepted Payments
                </p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Smartphone className="w-4 h-4 text-green-600" />
                    </div>
                    M-Pesa
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                    </div>
                    Card
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-3">
                  Secured by Paystack. Your payment details are encrypted.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl mb-6">
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleOpenPaystack}
                  className="flex-[2] bg-blue-600 border-none hover:bg-blue-700"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay {formatCurrency(totalAmount)}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3 — Success */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-12 rounded-[2.5rem] shadow-xl text-center"
            >
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="w-16 h-16 text-green-500" />
              </div>
              <h2 className="text-3xl font-black text-[#0A2540] mb-4">
                Payment Successful!
              </h2>
              <p className="text-gray-500 mb-10 max-w-sm mx-auto">
                Thank you for shopping with Villa Gadgets. Your gadgets are
                being prepared for delivery. You will receive a confirmation
                message shortly.
              </p>

              {orderId && (
                <div className="bg-gray-50 p-6 rounded-3xl mb-6 text-left">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">
                    Order ID
                  </p>
                  <p className="font-mono text-lg font-bold text-[#0A2540]">
                    VG-{orderId}
                  </p>
                </div>
              )}

              <a
                href={`https://wa.me/${whatsapp_number}?text=${encodeURIComponent(
                  `Hi! I just paid for order VG-${orderId}. Please confirm my delivery details.`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full mb-4 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-2xl transition-colors"
              >
                <Smartphone className="w-5 h-5" />
                Confirm via WhatsApp
              </a>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="flex-1" onClick={() => navigate("/")}>
                  Return Home
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate("/shop")}
                >
                  Continue Shopping
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
