import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SliderPkg from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { publicAPI } from '../../api';
import {
  GraduationCap, School, Phone, Briefcase, Star, Users,
  TrendingUp, Award, ArrowRight, CheckCircle, ChevronRight
} from 'lucide-react';

import FloatingHelpButton from '../../components/common/FloatingHelpButton'

const Slider = SliderPkg.default ?? SliderPkg;

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 600,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 4000,
  arrows: false,
};

const defaultSlides = [
  {
    url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1400&q=80',
    title: 'Empowering Education Across India',
    subtitle: 'Connecting the best teachers with top schools',
  },
  {
    url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1400&q=80',
    title: 'Quality Placements, Guaranteed',
    subtitle: 'Your teaching career growth starts here',
  },
  {
    url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1400&q=80',
    title: 'Trusted by 500+ Schools',
    subtitle: 'Building the future of education together',
  },
];

const HomePage = () => {
  const [content, setContent] = useState(null);

  useEffect(() => {
    publicAPI.getContent().then(({ data }) => setContent(data)).catch(() => {});
  }, []);

  const slides =
    content?.sliderImages?.filter((s) => s.isActive).length > 0
      ? content.sliderImages.filter((s) => s.isActive)
      : defaultSlides;

  const stats = content?.stats || {
    happyClients: 500,
    successfulPlacements: 1200,
    conversionRate: 95,
    awards: 15,
  };

  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────── */}  

      <FloatingHelpButton></FloatingHelpButton>   

      <section className="relative overflow-hidden px-6 py-20 md:py-24 bg-gradient-to-br from-blue-900 via-blue-800 to-[#1a3a6e]">

        {/* Content */}
        <div className="max-w-4xl mx-auto text-center relative z-10 animate-fadeUp">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-7 text-sm rounded-full 
            bg-white/10 border border-white/20 text-white/80">
            <span>🇮🇳</span>
            <span>India's Teacher Placement Consultancy • माँ सावित्री कंसल्टेंसी सेवा</span>
          </div>

          {/* Title */}
          <h1 className="text-white font-extrabold leading-tight mb-5 
            text-4xl sm:text-5xl md:text-6xl">
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Maa Savitri
            </span>{" "}
            Consultancy <br />
            Teacher Placement Service
          </h1>

          {/* Subtitle */}
          <p className="text-white/70 text-lg leading-relaxed mb-12">
            माँ सावित्री कंसल्टेंसी सेवा <br />
            <span className="text-white/50 text-base">
              Connecting qualified teachers with the right schools since day one.
            </span>
          </p>

          {/* CTA Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">

            {/* Teacher Card */}
            <Link to="/register?role=teacher"
              className="relative bg-white rounded-2xl p-6 text-left flex flex-col gap-3 
              transition-all duration-300 border-2 border-transparent hover:-translate-y-1.5 
              hover:shadow-2xl hover:border-blue-300 overflow-hidden">

              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-indigo-100/20" />

              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl
                bg-gradient-to-br from-blue-600 to-indigo-600 text-white relative z-10">
                👨‍🏫
              </div>

              <div className="relative z-10">
                <h2 className="text-xl font-bold text-blue-900">I am a Teacher</h2>
                <p className="text-sm text-gray-400 -mt-1">मैं एक शिक्षक हूँ</p>
                <p className="text-sm text-gray-600">
                  Submit your profile and qualifications to get placed in the right school.
                </p>
              </div>

              <div className="text-xl text-blue-400 mt-1 transition-transform group-hover:translate-x-1 relative z-10">
                →
              </div>
            </Link>

            {/* School Card */}
            <Link to="/register?role=school" 
              className="relative bg-white rounded-2xl p-6 text-left flex flex-col gap-3 
              transition-all duration-300 border-2 border-transparent hover:-translate-y-1.5 
              hover:shadow-2xl hover:border-blue-300 overflow-hidden">

              <div className="absolute inset-0 bg-gradient-to-br from-green-100/20 to-blue-100/20" />

              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl
                bg-gradient-to-br from-green-600 to-blue-600 text-white relative z-10">
                🏫
              </div>

              <div className="relative z-10">
                <h2 className="text-xl font-bold text-blue-900">I represent a School</h2>
                <p className="text-sm text-gray-400 -mt-1">मैं एक विद्यालय का प्रतिनिधि हूँ</p>
                <p className="text-sm text-gray-600">
                  Register your school and tell us what teachers you need.
                </p>
              </div>

              <div className="text-xl text-blue-400 mt-1 relative z-10">
                →
              </div>
            </Link>

          </div>
        </div>

        {/* Decorative Blobs */}
        <div className="absolute w-[500px] h-[500px] bg-blue-400/20 rounded-full top-[-200px] right-[-100px]" />
        <div className="absolute w-[400px] h-[400px] bg-indigo-400/20 rounded-full bottom-[-150px] left-[-100px]" />

      </section> 

      {/* ── IMAGE SLIDER ─────────────────────────────────── */}
      <section className="bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <Slider {...sliderSettings}>
              {slides.map((slide, i) => (
                <div key={i} className="relative">
                  <img
                    src={slide.url}
                    alt={slide.title || `Slide ${i + 1}`}
                    className="w-full h-64 sm:h-80 lg:h-[420px] object-cover"
                  />
                  {(slide.title || slide.subtitle) && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6 sm:p-8">
                      <div>
                        {slide.title && (
                          <h3 className="text-white text-xl sm:text-3xl font-extrabold drop-shadow">
                            {slide.title}
                          </h3>
                        )}
                        {slide.subtitle && (
                          <p className="text-white/80 text-sm sm:text-base mt-1">{slide.subtitle}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>

      {/* ── ABOUT SECTION ────────────────────────────────── */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* Accent bar */}
              <div className="h-1 w-12 rounded-full mb-5" style={{ background: 'linear-gradient(to right, #2563EB, #F59E0B)' }} />
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">About Us</span>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mt-2 mb-5">
                Bridging Education with{' '}
                <span className="text-blue-600">Excellence</span>
              </h2>
              <p className="text-gray-600 text-base leading-relaxed mb-6">
                {content?.aboutText ||
                  'Maa Savitri Consultancy Services connects skilled teachers with top schools, ensuring quality education and professional growth.'}
              </p>
              <ul className="space-y-3">
                {[
                  'Verified teacher profiles',
                  'Trusted school network',
                  'Transparent hiring process',
                  'Dedicated support team',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-700 text-sm">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: GraduationCap, title: 'For Teachers', desc: 'Find your dream teaching position with top schools across India.', bg: 'bg-blue-600', text: 'text-blue-100' },
                { icon: School, title: 'For Schools', desc: 'Hire qualified, verified teachers for your institution quickly.', bg: 'bg-amber-400', text: 'text-amber-900', mt: 'mt-6' },
                { icon: Star, title: 'Quality First', desc: 'Every placement is carefully managed by our expert team.', bg: 'bg-blue-900', text: 'text-blue-200', mt: '-mt-6' },
                { icon: Award, title: 'Trusted', desc: '15+ awards for excellence in education consultancy.', bg: 'bg-emerald-600', text: 'text-emerald-100' },
              ].map(({ icon: Icon, title, desc, bg, text, mt }) => (
                <div key={title} className={`${bg} rounded-2xl p-5 text-white ${mt || ''}`}>
                  <Icon className="w-7 h-7 mb-3 opacity-90" />
                  <h3 className="font-bold text-base">{title}</h3>
                  <p className={`${text} text-xs mt-1.5 leading-relaxed`}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ──────────────────────────────────── */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-amber-400 rounded-2xl p-8 lg:p-12 text-center">
            <h3 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-3">
              Ready to Get Started?
            </h3>
            <p className="text-gray-800/70 mb-8 max-w-md mx-auto">
              Join thousands of teachers and schools who trust Maa Savitri Consultancy Services.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm"
              >
                <Phone className="w-4 h-4" /> Contact Us
              </Link>
              <Link
                to="/vacancy"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-sm"
              >
                <Briefcase className="w-4 h-4" /> Vacancies
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-900/20 text-gray-900 font-bold rounded-xl hover:bg-amber-300 transition-all"
              >
                Services <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SCHOOL PROMO SECTION ─────────────────────────── */}
      <section className="bg-blue-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1 text-center lg:text-left">
              <span className="text-xs font-semibold uppercase tracking-widest text-blue-300">For Schools</span>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-white mt-2 mb-4">
                Find the Perfect Teacher for Your School
              </h2>
              <p className="text-blue-200 leading-relaxed mb-6 max-w-lg">
                Post your teacher requirements and let us handle the rest. Our expert team will match you with qualified, verified teachers who fit your school's culture and needs.
              </p>
              <ul className="space-y-2 mb-8">
                {[
                  'Post requirements in minutes',
                  'Get matched with verified teachers',
                  'Admin-managed hiring pipeline',
                  'No direct contact needed',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-blue-100 text-sm">
                    <CheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/register?role=school"
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-400 text-gray-900 font-bold rounded-xl hover:bg-amber-300 transition-all shadow-lg"
              >
                <School className="w-5 h-5" /> Post Your Requirement →
              </Link>
            </div>
            <div className="flex-shrink-0">
              <div className="w-52 h-52 bg-gradient-to-br from-blue-700 to-blue-500 rounded-3xl flex items-center justify-center shadow-2xl border border-white/10">
                <School className="w-28 h-28 text-white/80" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS SECTION ────────────────────────────────── */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="h-1 w-12 rounded-full mx-auto mb-4" style={{ background: 'linear-gradient(to right, #2563EB, #F59E0B)' }} />
            <h2 className="text-3xl font-extrabold text-gray-900">Our Impact in Numbers</h2>
            <p className="text-gray-500 mt-2 text-sm">Trusted by teachers and schools across India</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Users, label: 'Happy Clients', value: stats.happyClients + '+', trend: '+12% this year', iconBg: 'bg-blue-50', iconColor: 'text-blue-600', numColor: 'text-blue-600' },
              { icon: TrendingUp, label: 'Successful Placements', value: stats.successfulPlacements + '+', trend: '+18% this year', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', numColor: 'text-emerald-600' },
              { icon: Star, label: 'Conversion Rate', value: stats.conversionRate + '%', trend: 'Industry leading', iconBg: 'bg-amber-50', iconColor: 'text-amber-500', numColor: 'text-amber-500' },
              { icon: Award, label: 'Awards Won', value: stats.awards + '+', trend: 'National recognition', iconBg: 'bg-purple-50', iconColor: 'text-purple-600', numColor: 'text-purple-600' },
            ].map(({ icon: Icon, label, value, trend, iconBg, iconColor, numColor }) => (
              <div
                key={label}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 text-center"
              >
                <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>
                <p className={`text-3xl font-extrabold ${numColor}`}>{value}</p>
                <p className="text-gray-500 text-sm font-medium mt-1">{label}</p>
                <p className="text-emerald-500 text-xs font-semibold mt-2">{trend}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
