import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TermsOfService() {
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
          Terms of Service
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
              1. Agreement to Terms
            </h2>
            <p>
              By accessing or using the Villa Gadgets website, you agree to be
              bound by these Terms of Service and our Privacy Policy. If you
              disagree with any part, you may not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A2540] mb-3">
              2. Products & Pricing
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                All products listed are genuine and sourced from authorized
                distributors unless explicitly stated otherwise.
              </li>
              <li>
                Prices are listed in Kenyan Shillings (KES) and are subject to
                change without notice.
              </li>
              <li>
                We reserve the right to refuse or cancel an order if a pricing
                error has occurred.
              </li>
              <li>
                Product images are for illustration purposes. Actual products
                may vary slightly in appearance.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A2540] mb-3">
              3. Orders & Payment
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Orders are confirmed only after successful payment via Paystack
                (M-Pesa or card).
              </li>
              <li>
                You must provide accurate delivery information. We are not
                liable for failed deliveries due to incorrect addresses.
              </li>
              <li>
                We reserve the right to cancel orders that appear fraudulent or
                suspicious.
              </li>
              <li>
                Order confirmation will be communicated via WhatsApp to the
                number provided at checkout.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A2540] mb-3">
              4. Delivery
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Same-day delivery is available within Nairobi for orders placed
                before 2:00 PM on business days.
              </li>
              <li>
                Delivery timelines for other counties vary and will be
                communicated at the time of order.
              </li>
              <li>
                Delivery fees are calculated at checkout based on your location.
              </li>
              <li>
                Risk of loss passes to you upon delivery to the provided
                address.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A2540] mb-3">
              5. Warranty
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Warranty terms vary per product and are stated on each product
                page.
              </li>
              <li>
                Warranty covers manufacturer defects only. Physical damage,
                water damage, and unauthorized repairs void the warranty.
              </li>
              <li>
                To make a warranty claim, contact us via WhatsApp with your
                order ID and a description of the issue.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A2540] mb-3">
              6. Returns & Refunds
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Returns are accepted within 7 days of delivery for items that
                are defective or not as described.
              </li>
              <li>
                Items must be returned in original packaging with all
                accessories included.
              </li>
              <li>
                Refunds are processed within 7 business days after the returned
                item is inspected and approved.
              </li>
              <li>
                We do not accept returns for items damaged by misuse or normal
                wear and tear.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A2540] mb-3">
              7. User Accounts
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                You are responsible for maintaining the confidentiality of your
                account credentials.
              </li>
              <li>
                You must notify us immediately of any unauthorized use of your
                account.
              </li>
              <li>
                We reserve the right to suspend or terminate accounts that
                violate these terms.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A2540] mb-3">
              8. Intellectual Property
            </h2>
            <p>
              All content on this website — including logos, product
              descriptions, and images — is the property of Villa Gadgets or its
              suppliers. You may not reproduce, distribute, or use any content
              without written permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A2540] mb-3">
              9. Limitation of Liability
            </h2>
            <p>
              Villa Gadgets is not liable for any indirect, incidental, or
              consequential damages arising from the use of our products or
              services. Our total liability shall not exceed the amount paid for
              the specific product or service in question.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A2540] mb-3">
              10. Governing Law
            </h2>
            <p>
              These Terms are governed by the laws of Kenya. Any disputes shall
              be subject to the exclusive jurisdiction of the courts of Nairobi,
              Kenya.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A2540] mb-3">
              11. Changes to Terms
            </h2>
            <p>
              We reserve the right to update these Terms at any time. Changes
              take effect immediately upon posting. Continued use of the site
              after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A2540] mb-3">
              12. Contact
            </h2>
            <p>For any questions regarding these Terms, contact us:</p>
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
                  target="_blank"
                  rel="noopener noreferrer"
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
