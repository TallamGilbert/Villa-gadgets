import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="pt-28 pb-24 min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm font-medium text-gray-500 hover:text-[#0A2540] mb-10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>

        <h1 className="text-4xl font-black text-[#0A2540] mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-400 mb-12">
          Last updated:{" "}
          {new Date().toLocaleDateString("en-KE", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>

        <div className="prose prose-slate max-w-none space-y-10 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[#0A2540] mb-3">
              1. Who We Are
            </h2>
            <p>
              Villa Gadgets is an electronics retailer based in Nairobi, Kenya.
              We sell genuine smartphones, laptops, TVs, accessories, and other
              consumer electronics. This Privacy Policy explains how we collect,
              use, and protect your personal information when you use our
              website at{" "}
              <a
                href="https://villagadgets.co.ke"
                className="text-blue-600 underline"
              >
                villagadgets.co.ke
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A2540] mb-3">
              2. Information We Collect
            </h2>
            <p className="mb-3">
              We collect information you provide directly to us:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Account information</strong> — name, email address, and
                password when you create an account.
              </li>
              <li>
                <strong>Order information</strong> — name, phone number, and
                delivery location when you place an order.
              </li>
              <li>
                <strong>Payment information</strong> — payment is processed by
                Paystack. We do not store your card details or M-Pesa PIN. We
                only store a payment reference for reconciliation.
              </li>
              <li>
                <strong>Usage data</strong> — pages visited, products viewed,
                and cart activity. This helps us improve the shopping
                experience.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A2540] mb-3">
              3. How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To process and deliver your orders.</li>
              <li>
                To contact you about your order status via WhatsApp or phone.
              </li>
              <li>To maintain your account and order history.</li>
              <li>
                To send you updates about products or promotions if you have
                opted in.
              </li>
              <li>To improve our website and product listings.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A2540] mb-3">
              4. Sharing Your Information
            </h2>
            <p className="mb-3">
              We do not sell or rent your personal information. We may share it
              only in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Paystack</strong> — to process your payment securely.
              </li>
              <li>
                <strong>Delivery partners</strong> — your name and location may
                be shared with our delivery team to fulfil your order.
              </li>
              <li>
                <strong>Legal requirements</strong> — if required by Kenyan law
                or a valid court order.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A2540] mb-3">
              5. Data Storage & Security
            </h2>
            <p>
              Your data is stored securely on Supabase, which uses
              industry-standard encryption. We implement Row Level Security
              (RLS) to ensure your account data is only accessible to you.
              Passwords are hashed and never stored in plain text. We take
              reasonable steps to protect your information but cannot guarantee
              absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A2540] mb-3">
              6. Cookies
            </h2>
            <p>
              We use browser local storage to maintain your shopping cart
              session. We do not use advertising or tracking cookies. We use
              Supabase Auth tokens to keep you logged in across sessions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A2540] mb-3">
              7. Your Rights
            </h2>
            <p className="mb-3">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access the personal data we hold about you.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request deletion of your account and associated data.</li>
              <li>Opt out of marketing communications at any time.</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us via WhatsApp or email
              below.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A2540] mb-3">
              8. Third-Party Links
            </h2>
            <p>
              Our website may contain links to external sites such as
              manufacturer pages. We are not responsible for the privacy
              practices of those sites.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A2540] mb-3">
              9. Children's Privacy
            </h2>
            <p>
              Our services are not directed at children under 13. We do not
              knowingly collect personal information from children.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A2540] mb-3">
              10. Changes to This Policy
            </h2>
            <p>
              We may update this policy from time to time. Changes will be
              posted on this page with an updated date. Continued use of the
              site after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A2540] mb-3">
              11. Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy, contact us:
            </p>
            <div className="mt-3 space-y-1">
              <p>
                <strong>Villa Gadgets</strong>
              </p>
              <p>Luthuli Avenue, 2nd Floor, Nairobi, Kenya</p>
              <p>
                WhatsApp:{" "}
                <a
                  href="https://wa.me/254700000000"
                  className="text-blue-600 underline"
                >
                  +254 700 000 000
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
