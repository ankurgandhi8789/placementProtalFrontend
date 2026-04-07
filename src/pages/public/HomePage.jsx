import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SliderPkg from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { publicAPI } from '../../api';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap, School, Phone, Briefcase, Star, Users,
  TrendingUp, Award, ArrowRight, CheckCircle, ChevronRight
} from 'lucide-react';
import FloatingHelpButton from '../../components/common/FloatingHelpButton'
import RoleCards from '../../components/common/RoleCards';

const useCountUp = (end, duration = 2000, start = 0) => {
  const [count, setCount] = useState(start);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(start + (end - start) * easeOut));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [isVisible, end, duration, start]);

  return [count, ref];
};

const Slider = SliderPkg.default ?? SliderPkg;

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 600,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 4000,
  arrows: false,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 640,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true,
      },
    },
  ],
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

const StatCard = ({ icon: Icon, label, value, suffix = '', trend, iconBg, iconColor, numColor }) => {
  const numValue = parseInt(value);
  const [count, ref] = useCountUp(numValue, 2000);

  return (
    <div
      ref={ref}
      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 text-center"
    >
      <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center mx-auto mb-4`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      <p className={`text-3xl font-extrabold ${numColor}`}>
        {count}{suffix}
      </p>
      <p className="text-gray-500 text-sm font-medium mt-1">{label}</p>
      <p className="text-emerald-500 text-xs font-semibold mt-2">{trend}</p>
    </div>
  );
};

const HomePage = () => {
  const [content, setContent] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    publicAPI.getContent().then(({ data }) => setContent(data)).catch(() => {});
  }, []);

  const handlePostJobClick = (e) => {
    if (user) {
      e.preventDefault();
      if (user.role === 'teacher') {
        navigate('/teacher/dashboard');
      } else if (user.role === 'school') {
        navigate('/school/dashboard');
      } else if (user.role === 'admin' || user.role === 'superadmin') {
        navigate('/admin/dashboard');
      }
    }
  };

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

      <section className="relative overflow-hidden px-6 py-12 bg-gradient-to-br from-blue-900 via-blue-800 to-[#1a3a6e]">

        {/* Content */}
        <div className="max-w-4xl mx-auto text-center relative z-10">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs rounded-full 
            bg-white/10 border border-white/20 text-white/80">
            <span>🇮🇳</span>
            <span>India's Teacher Placement Consultancy • माँ सावित्री कंसल्टेंसी सेवा</span>
          </div>

          {/* Title */}
          <h1 className="text-white font-extrabold leading-tight mb-3 
            text-3xl sm:text-4xl md:text-5xl">
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Maa Savitri
            </span>{" "}
            Consultancy <br />
            Teacher Placement Service
          </h1>

          {/* Subtitle */}
          <p className="text-white/70 text-base leading-relaxed mb-6">
            माँ सावित्री कंसल्टेंसी सेवा <br />
            <span className="text-white/50 text-sm">
              Connecting qualified teachers with the right schools since day one.
            </span>
          </p>

          {/* CTA Cards */}
          <RoleCards />
        </div>

        {/* Decorative Blobs */}
        <div className="absolute w-[500px] h-[500px] bg-blue-400/20 rounded-full top-[-200px] right-[-100px]" />
        <div className="absolute w-[400px] h-[400px] bg-indigo-400/20 rounded-full bottom-[-150px] left-[-100px]" />

      </section> 

      {/* ── IMAGE SLIDER ─────────────────────────────────── */}
<section className="bg-white py-6 sm:py-10">
  <div className="max-w-[1400px] mx-auto px-2 sm:px-4 lg:px-8">
    <Slider {...sliderSettings}>
      {slides.map((slide, i) => (
        <div key={i} className="px-2 sm:px-3">
          <div
            className="rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-xl"
            style={{ aspectRatio: '210 / 297' }}
          >
            <div className="relative w-full h-full">
              <img
                src={slide.url}
                alt={slide.title || `Slide ${i + 1}`}
                className="w-full h-full object-cover"
              />
              {(slide.title || slide.subtitle) && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3 sm:p-6">
                  <div>
                    {slide.title && (
                      <h3 className="text-white text-sm sm:text-xl lg:text-2xl font-extrabold drop-shadow leading-tight">
                        {slide.title}
                      </h3>
                    )}
                    {slide.subtitle && (
                      <p className="text-white/90 text-xs sm:text-sm lg:text-base mt-0.5 sm:mt-1">
                        {slide.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </Slider>
  </div>
</section>

      {/* ── ABOUT SECTION ────────────────────────────────── */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* Accent bar */}
              <div className="h-1 w-12 rounded-full mb-5" style={{ background: 'linear-gradient(to right, #2563EB, #F59E0B)' }} />
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">About Us</span>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mt-2 mb-5">
                M. S. Consultancy Services
              </h2>
              <p className="text-gray-600 text-base leading-relaxed mb-4">
                M. S. Consultancy Services is a premier educational consultancy firm based in <strong>Siwan, Bihar</strong>.
              </p>
              <p className="text-gray-600 text-base leading-relaxed mb-4">
                We are dedicated to fostering educational excellence by providing highly trained, educated, and diligent teachers to schools across Bihar and the eastern region of Uttar Pradesh.
              </p>
              <p className="text-gray-600 text-base leading-relaxed mb-6">
                Our mission is to enhance the quality of education by ensuring that every school we serve has access to top-notch teaching professionals who are passionate about nurturing young minds and shaping the future of education.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-md text-sm"
              >
                Read More <ChevronRight className="w-4 h-4" />
              </Link>
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
      <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl p-8 lg:p-12 text-center shadow-xl">
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
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1 text-center lg:text-left">
              <span className="text-xs font-semibold uppercase tracking-widest text-blue-300">For Schools & Organizations</span>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-white mt-2 mb-4">
                School/Institute and Organizations can post your requirements
              </h2>
              <h3 className="text-xl font-bold text-amber-400 mb-4">
                Post Your Job / Requirements
              </h3>
              <p className="text-blue-200 leading-relaxed mb-4">
                All schools, institutes, and organizations can easily post their job vacancies through our platform using a single streamlined process.
              </p>
              <ul className="space-y-3 mb-8 text-blue-100">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm leading-relaxed">
                    Click on the <strong>"Post Your Job Here"</strong> button below to open a Google Form. Fill in your specific requirements, including position details, qualifications, and other relevant information.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm leading-relaxed">
                    Once the form is submitted, our team will review your request and contact you for confirmation and further processing.
                  </span>
                </li>
              </ul>
              <a
                target="_blank"
                rel="noopener noreferrer"
                onClick={handlePostJobClick}
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-400 text-gray-900 font-bold rounded-xl hover:bg-amber-300 transition-all shadow-lg"
              >
                <School className="w-5 h-5" /> Post Your Job Here →
              </a>
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
      <section className="bg-gradient-to-br from-white via-blue-50 to-indigo-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="h-1 w-12 rounded-full mx-auto mb-4" style={{ background: 'linear-gradient(to right, #2563EB, #F59E0B)' }} />
            <h2 className="text-3xl font-extrabold text-gray-900">Our Impact in Numbers</h2>
            <p className="text-gray-500 mt-2 text-sm">Trusted by teachers and schools across India</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard icon={Users} label="Happy Clients" value={stats.happyClients} suffix="+" trend="+12% this year" iconBg="bg-blue-50" iconColor="text-blue-600" numColor="text-blue-600" />
            <StatCard icon={TrendingUp} label="Successful Placements" value={stats.successfulPlacements} suffix="+" trend="+18% this year" iconBg="bg-emerald-50" iconColor="text-emerald-600" numColor="text-emerald-600" />
            <StatCard icon={Star} label="Conversion Rate" value={stats.conversionRate} suffix="%" trend="Industry leading" iconBg="bg-amber-50" iconColor="text-amber-500" numColor="text-amber-500" />
            <StatCard icon={Award} label="Awards Won" value={stats.awards} suffix="+" trend="National recognition" iconBg="bg-purple-50" iconColor="text-purple-600" numColor="text-purple-600" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
