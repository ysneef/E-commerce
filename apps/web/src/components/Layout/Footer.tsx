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

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 py-10 font-sans">
      <div className="max-w-7xl mx-auto px-5 flex flex-wrap justify-between">
        <div className="w-full md:w-1/5 mb-8">
          <h3 className="text-sm font-bold mb-5 uppercase text-gray-800">Company</h3>
          <ul>
            <li className="mb-2">
              <a href="#" className="text-sm text-gray-600 hover:text-black">About</a>
            </li>
            <li className="mb-2">
              <a href="#" className="text-sm text-gray-600 hover:text-black">Features</a>
            </li>
            <li className="mb-2">
              <a href="#" className="text-sm text-gray-600 hover:text-black">Works</a>
            </li>
            <li className="mb-2">
              <a href="#" className="text-sm text-gray-600 hover:text-black">Career</a>
            </li>
          </ul>
        </div>

        <div className="w-full md:w-1/5 mb-8">
          <h3 className="text-sm font-bold mb-5 uppercase text-gray-800">Help</h3>
          <ul>
            <li className="mb-2">
              <a href="#" className="text-sm text-gray-600 hover:text-black">Customer Support</a>
            </li>
            <li className="mb-2">
              <a href="#" className="text-sm text-gray-600 hover:text-black">Delivery Details</a>
            </li>
            <li className="mb-2">
              <a href="#" className="text-sm text-gray-600 hover:text-black">Terms & Conditions</a>
            </li>
            <li className="mb-2">
              <a href="#" className="text-sm text-gray-600 hover:text-black">Privacy Policy</a>
            </li>
          </ul>
        </div>

        <div className="w-full md:w-1/5 mb-8">
          <h3 className="text-sm font-bold mb-5 uppercase text-gray-800">FAQ</h3>
          <ul>
            <li className="mb-2">
              <a href="#" className="text-sm text-gray-600 hover:text-black">Account</a>
            </li>
            <li className="mb-2">
              <a href="#" className="text-sm text-gray-600 hover:text-black">Manage Deliveries</a>
            </li>
            <li className="mb-2">
              <a href="#" className="text-sm text-gray-600 hover:text-black">Orders</a>
            </li>
            <li className="mb-2">
              <a href="#" className="text-sm text-gray-600 hover:text-black">Payments</a>
            </li>
          </ul>
        </div>

        <div className="w-full md:w-1/5 mb-8">
          <h3 className="text-sm font-bold mb-5 uppercase text-gray-800">Resources</h3>
          <ul>
            <li className="mb-2">
              <a href="#" className="text-sm text-gray-600 hover:text-black">Free eBooks</a>
            </li>
            <li className="mb-2">
              <a href="#" className="text-sm text-gray-600 hover:text-black">Development Tutorial</a>
            </li>
            <li className="mb-2">
              <a href="#" className="text-sm text-gray-600 hover:text-black">How to - Blog</a>
            </li>
            <li className="mb-2">
              <a href="#" className="text-sm text-gray-600 hover:text-black">YouTube Playlist</a>
            </li>
          </ul>
        </div>

        <div className="w-full md:w-1/5 mb-8">
          <h3 className="text-sm font-bold mb-5 uppercase text-gray-800">Follow Us</h3>
          <ul className="flex gap-4">
            {[faTwitter, faFacebookF, faInstagram, faYoutube].map((icon, index) => (
              <li key={index}>
                <a href="#" className="text-gray-600 hover:text-black text-xl">
                  <FontAwesomeIcon icon={icon} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-6 px-5 pt-6 border-t border-gray-300 flex flex-col md:flex-row items-center justify-between">
        <p className="text-xs text-gray-600 mb-4 md:mb-0">
          Shoes Store © 2026, All Rights Reserved
        </p>
        <div className="flex gap-4">
          {[faCcVisa, faCcMastercard, faCcPaypal, faCcApplePay, faGoogle].map((icon, index) => (
            <FontAwesomeIcon key={index} icon={icon} className="text-xl text-gray-600" />
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
