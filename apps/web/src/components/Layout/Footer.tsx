import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTwitter,
  faFacebookF,
  faInstagram,
  faYoutube,
  faCcVisa,
  faCcMastercard,
  faCcPaypal,
  faCcApplePay,
  faGoogle,
} from '@fortawesome/free-brands-svg-icons';
import {
  faMapMarkerAlt,
  faPhoneAlt,
  faEnvelope,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0a0a0a] text-gray-400 py-16 font-sans border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

        {/* Column 1: Brand & Social */}
        <div className="space-y-6">
          <Link to="/" className="text-2xl font-black text-white tracking-widest uppercase">
            SHOES <span className="text-[#8e00e8]">STORE</span>
          </Link>
          <p className="text-sm leading-relaxed">
            Elevate your style with our premium collection of footwear. From performance running shoes to elegant formal wear, we provide the perfect fit for every journey.
          </p>
          <div className="flex gap-4">
            {[faFacebookF, faInstagram, faTwitter, faYoutube].map((icon, index) => (
              <a
                key={index}
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-900 text-gray-400 hover:bg-[#8e00e8] hover:text-white transition-all duration-300"
              >
                <FontAwesomeIcon icon={icon} size="sm" />
              </a>
            ))}
          </div>
        </div>

        {/* Column 2: Shop Categories */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-white uppercase tracking-wider">Shop</h3>
          <ul className="space-y-3">
            {[
              { label: 'Men\'s Collection', path: '/category' },
              { label: 'Women\'s Collection', path: '/category' },
              { label: 'Kids\' Shoes', path: '/category' },
              { label: 'New Arrivals', path: '/category' },
              { label: 'Flash Sale', path: '/category' },
            ].map((link, index) => (
              <li key={index}>
                <Link
                  to={link.path}
                  className="text-sm hover:text-white hover:translate-x-1 inline-block transition-all duration-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Customer Support */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-white uppercase tracking-wider">Support</h3>
          <ul className="space-y-3">
            {[
              'Terms of Service',
              'Privacy Policy',
              'Shipping Options',
              'Returns & Exchanges',
              'Order Tracking',
              'Contact Us',
            ].map((item, index) => (
              <li key={index}>
                <a
                  href="#"
                  className="text-sm hover:text-white hover:translate-x-1 inline-block transition-all duration-300"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Newsletter & Contact */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-white uppercase tracking-wider">Join Our Newsletter</h3>
          <p className="text-sm">Get the latest news on sneaker drops and exclusive offers.</p>
          <div className="relative group">
            <input
              type="email"
              placeholder="Your email address"
              className="w-full bg-gray-900 border border-gray-800 rounded-lg py-3 px-4 text-sm focus:outline-none focus:border-[#8e00e8] transition-colors"
            />
            <button className="absolute right-2 top-2 bg-[#8e00e8] text-white p-1.5 rounded-md hover:scale-105 transition-transform">
              <FontAwesomeIcon icon={faArrowRight} size="xs" />
            </button>
          </div>

          <div className="pt-4 space-y-3">
            <div className="flex items-start gap-3 text-sm">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-[#8e00e8] mt-1" />
              <span>123 Shoe Street, Sneakers City, ST 12345</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <FontAwesomeIcon icon={faPhoneAlt} className="text-[#8e00e8]" />
              <span>+1 (234) 567-890</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <FontAwesomeIcon icon={faEnvelope} className="text-[#8e00e8]" />
              <span>support@shoestore.com</span>
            </div>
          </div>
        </div>

      </div>

      {/* Footer Bottom */}
      <div className="max-w-7xl mx-auto mt-16 px-6 pt-8 border-t border-gray-900 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-xs tracking-wide">
          © 2026 Shoes Store, All Rights Reserved
        </p>

        <div className="flex items-center gap-6">
          <div className="flex gap-3 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            {[faCcVisa, faCcMastercard, faCcPaypal, faCcApplePay, faGoogle].map((icon, index) => (
              <FontAwesomeIcon key={index} icon={icon} className="text-2xl" />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
