import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 w-full px-4 sm:px-6 py-6 md:py-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-12 lg:gap-16">
          {/* About Section */}
          <div className="flex-1 min-w-[200px]">
            <h3 className="text-lg font-semibold text-white mb-3 md:mb-4">About</h3>
            <p className="text-sm text-green-500 leading-relaxed">
              Spotify Clone project made with MERN stack. Enjoy music, create playlists, and more!
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="flex-1 min-w-[200px]">
            <h3 className="text-lg font-semibold text-white mb-3 md:mb-4">Quick Links</h3>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <a href="#" className="hover:text-white transition duration-300 text-sm md:text-base">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition duration-300 text-sm md:text-base">
                  Search
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition duration-300 text-sm md:text-base">
                  Your Library
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="flex-1 min-w-[200px]">
            <h3 className="text-lg font-semibold text-white mb-3 md:mb-4">Connect With Us</h3>
            <div className="flex gap-6 md:gap-8">
              <a 
                href="#" 
                className="hover:text-green-500 transition duration-300"
                aria-label="Facebook"
              >
                <FaFacebook size={20} className="w-5 h-5 md:w-6 md:h-6" />
              </a>
              <a 
                href="#" 
                className="hover:text-blue-400 transition duration-300"
                aria-label="Twitter"
              >
                <FaTwitter size={20} className="w-5 h-5 md:w-6 md:h-6" />
              </a>
              <a 
                href="#" 
                className="hover:text-pink-500 transition duration-300"
                aria-label="Instagram"
              >
                <FaInstagram size={20} className="w-5 h-5 md:w-6 md:h-6" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Footer Bottom */}
        <div className="mt-8 md:mt-12 pt-6 border-t border-gray-700 text-center">
          <p className="text-xs sm:text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Bajate Raho. All rights reserved.
          </p>
        </div>

        <footer className="mt-4 text-center text-sm font-bold text-gray-300 lg:mb-0 lg:bottom-8 w-full">
        Created with 💚 from Tabrej
      </footer>
      </div>
    </footer>
  );
};

export default Footer;