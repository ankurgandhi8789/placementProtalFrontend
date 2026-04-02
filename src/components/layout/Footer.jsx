import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageCircle, Send, Share2, Camera, AtSign } from 'lucide-react';

const Footer = () => (
  <footer className="bg-blue-900 text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

        {/* About */}
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <span className="text-white font-extrabold text-sm">MS</span>
            </div>
            <div>
              <p className="font-extrabold text-white text-sm leading-tight">Maa Savitri</p>
              <p className="text-blue-300 text-xs">Consultancy Services</p>
            </div>
          </div>
          <p className="text-blue-200 text-sm leading-relaxed mb-5">
            Connecting skilled teachers with top schools, ensuring quality education and professional growth across India.
          </p>
          {/* Social Icons */}
          <div className="flex gap-2">
            {[
              { icon: Share2, label: 'Facebook', href: '#' },
              { icon: Camera, label: 'Instagram', href: '#' },
              { icon: AtSign, label: 'Twitter/X', href: '#' },
              { icon: MessageCircle, label: 'WhatsApp', href: '#' },
              { icon: Send, label: 'Telegram', href: '#' },
            ].map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
              >
                <Icon className="w-4 h-4 text-white" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-4">Quick Links</h3>
          <ul className="space-y-2.5">
            {[
              { label: 'Home', to: '/' },
              { label: 'About Us', to: '/about' },
              { label: 'Services', to: '/services' },
              { label: 'Vacancies', to: '/vacancy' },
              { label: 'T&C for Teachers', to: '/terms/teacher' },
              { label: 'T&C for Schools', to: '/terms/school' },
              { label: 'Contact Us', to: '/contact' },
            ].map(({ label, to }) => (
              <li key={to}>
                <Link to={to} className="text-blue-200 hover:text-amber-400 text-sm transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* For Users */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-4">Join Us</h3>
          <ul className="space-y-2.5">
            {[
              { label: 'Apply as Teacher', to: '/register?role=teacher' },
              { label: 'Post Requirement', to: '/register?role=school' },
              { label: 'Teacher Login', to: '/login' },
              { label: 'School Login', to: '/login' },
            ].map(({ label, to }) => (
              <li key={label}>
                <Link to={to} className="text-blue-200 hover:text-amber-400 text-sm transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-4">Contact</h3>
          <ul className="space-y-3">
            {[
              { icon: Phone, value: '+91 98765 43210' },
              { icon: Mail, value: 'info@maasavitri.com' },
              { icon: MapPin, value: 'New Delhi, India' },
              { icon: MessageCircle, value: 'WhatsApp: +91 98765 43210' },
            ].map(({ icon: Icon, value }) => (
              <li key={value} className="flex items-start gap-2.5 text-sm text-blue-200">
                <Icon className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                {value}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>

    {/* Bottom Bar */}
    <div className="border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center">
        <p className="text-white/50 text-xs">
          © {new Date().getFullYear()} Maa Savitri Consultancy Services. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
