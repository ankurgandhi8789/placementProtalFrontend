import { Phone, Mail, MapPin, Clock } from 'lucide-react';

import FloatingHelpButton from '../../components/common/FloatingHelpButton'

const ContactPage = () => (
  <div>
    <FloatingHelpButton></FloatingHelpButton> 
    <div className="bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] text-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-blue-100 max-w-xl mx-auto">Get in touch with our team for any queries or assistance.</p>
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h2>
          <div className="space-y-4 mb-8">
            {[
              { icon: Phone, label: 'Phone', value: '+91 98765 43210', color: 'bg-blue-100 text-blue-600' },
              { icon: Mail, label: 'Email', value: 'info@maasavitri.com', color: 'bg-green-100 text-green-600' },
              { icon: MapPin, label: 'Address', value: 'New Delhi, India', color: 'bg-red-100 text-red-600' },
              { icon: Clock, label: 'Working Hours', value: 'Mon–Sat: 9AM – 6PM', color: 'bg-amber-100 text-amber-600' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100">
                <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">{label}</p>
                  <p className="text-gray-800 font-medium">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h2>
          <form className="space-y-4" onSubmit={e => { e.preventDefault(); alert('Message sent! We will get back to you soon.'); }}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" required placeholder="Your name"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" required placeholder="your@email.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input type="text" required placeholder="How can we help?"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea rows={4} required placeholder="Your message..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
            <button type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
);

export default ContactPage;
