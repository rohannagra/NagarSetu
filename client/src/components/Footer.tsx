import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Github, Twitter, Linkedin } from 'lucide-react';

const Footer: FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="text-xl font-bold text-white">Nagar Setu</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              AI-powered smart complaint redressal system for better civic governance and transparent issue resolution.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-primary-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/heatmap" className="hover:text-primary-400 transition-colors">
                  Live Heatmap
                </Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-primary-400 transition-colors">
                  Track Complaint
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-primary-400 transition-colors">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#faq" className="hover:text-primary-400 transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <Mail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <span>support@nagarsetu.gov.in</span>
              </li>
              <li className="flex items-start space-x-2">
                <Phone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <span>1800-XXX-XXXX (Toll Free)</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <span>Ministry of Electronics & IT, New Delhi, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>
            © {new Date().getFullYear()} Nagar Setu. All rights reserved. | Built with ❤️ for
            better governance
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
