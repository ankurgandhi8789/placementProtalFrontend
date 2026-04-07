import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const Footer = () => {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScroll(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <>
      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-gray-300 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">
            Copyright © 2026 M. S. Consultancy Services | Powered by:{' '}
            <a 
              href="https://mithleshkumar.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              mithleshkumar.in
            </a>
          </p>
          <p className="text-xs text-gray-500 mt-1">Contact for Website designing.</p>
        </div>
      </footer>

      {showScroll && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-50 hover:scale-110"
          aria-label="Go to top"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </>
  );
};

export default Footer;
