import { Smartphone, Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <Smartphone className="w-8 h-8 text-[#0A2540]" />
              <span className="text-xl font-bold tracking-tight text-[#0A2540]">
                VILLA GADGETS
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Kenya's premium destination for genuine smartphones and
              accessories. Fast delivery and reliable service.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-[#0A2540] transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#0A2540] transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#0A2540] transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-6">Shop</h4>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/shop?brand=Apple"
                  className="text-gray-500 hover:text-[#0A2540] text-sm"
                >
                  iPhone
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?brand=Samsung"
                  className="text-gray-500 hover:text-[#0A2540] text-sm"
                >
                  Samsung
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=budget"
                  className="text-gray-500 hover:text-[#0A2540] text-sm"
                >
                  Budget Phones
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className="text-gray-500 hover:text-[#0A2540] text-sm"
                >
                  All Gadgets
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-6">Support</h4>
            <ul className="space-y-4">

              <li>
                <a
                  href="#"
                  className="text-gray-500 hover:text-[#0A2540] text-sm"
                >
                  Warranty Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-500 hover:text-[#0A2540] text-sm"
                >
                  Delivery Info
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-500 hover:text-[#0A2540] text-sm"
                >
                  Track Order
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-500 hover:text-[#0A2540] text-sm"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-6">Location</h4>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Nairobi Central Complex,
              <br />
              Luthuli Avenue, 2nd Floor
              <br />
              Nairobi, Kenya
            </p>
            <p className="text-[#0A2540] font-medium text-sm">
              +254 700 000 000
            </p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-400 text-xs text-center md:text-left">
            © {new Date().getFullYear()} Villa Gadgets. All rights reserved.
            Registered in Kenya.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-gray-600 text-xs">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-600 text-xs">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
