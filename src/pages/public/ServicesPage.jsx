import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import FloatingHelpButton from '../../components/common/FloatingHelpButton';
import { useEffect, useState } from 'react';
import {ArrowUp} from 'lucide-react';


const ScrollTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className={`fixed bottom-6 left-6 z-50 w-11 h-11 bg-blue-600 text-white rounded-full
        shadow-lg flex items-center justify-center hover:bg-blue-700
        transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <ArrowUp size={18} />
    </button>
  );
};

// ── Service data ───────────────────────────────────────────
const services = [
  {
    number: '01',
    title: 'Teacher Recruitment',
    hindi: 'शिक्षक भर्ती',
    desc: 'Hiring qualified and experienced teachers for schools and colleges across various subjects.',
    accent: '#2563EB',
    bg: '#EFF6FF',
  },
  {
    number: '02',
    title: 'Non-Teaching Staff Hiring',
    hindi: 'गैर-शिक्षण कर्मचारी',
    desc: 'Providing administrative, technical, and support staff for schools and offices.',
    accent: '#D97706',
    bg: '#FFFBEB',
  },
  {
    number: '03',
    title: 'Advertising & Promotion',
    hindi: 'विज्ञापन एवं प्रचार',
    desc: 'Conducting online and offline marketing campaigns to enhance institutional visibility.',
    accent: '#059669',
    bg: '#ECFDF5',
  },
  {
    number: '04',
    title: 'Admission Campaigning',
    hindi: 'प्रवेश अभियान',
    desc: 'Organizing targeted outreach programs to boost student enrollment effectively.',
    accent: '#7C3AED',
    bg: '#F5F3FF',
  },
  {
    number: '05',
    title: 'Website Designing',
    hindi: 'वेबसाइट निर्माण',
    desc: 'Developing professional and responsive websites for educational institutions.',
    accent: '#DC2626',
    bg: '#FEF2F2',
  },
];

// ── CTA Button ─────────────────────────────────────────────
const CTAButton = ({ label, sublabel, color, onClick }) => (
  <button
    onClick={onClick}
    style={{ borderColor: color, color }}
    className="group relative flex flex-col items-start gap-0.5 px-6 py-4 rounded-2xl border-2
      bg-white hover:bg-opacity-90 transition-all duration-200 hover:-translate-y-0.5
      hover:shadow-lg text-left w-full sm:w-auto min-w-[200px]"
  >
    <span className="font-extrabold text-sm tracking-wide uppercase">{label}</span>
    {sublabel && <span className="text-xs opacity-60 font-medium">{sublabel}</span>}
    <span
      style={{ background: color }}
      className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-300 rounded-b-2xl"
    />
  </button>
);

// ══════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════
const ServicesPage = () => {
  const { user, openLogin } = useAuth();
  const navigate = useNavigate();

  const goOrLogin = (path) => {
    if (!user) { openLogin(); return; }
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
      <FloatingHelpButton />
      <ScrollTopButton />

      {/* ── HERO ─────────────────────────────────────────── */}
      

      {/* ── SERVICES GRID ────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s) => (
            <div
              key={s.number}
              className="group bg-white rounded-2xl p-6 border border-gray-100
                hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden relative"
            >
              {/* bg tint on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: s.bg }}
              />

              <div className="relative z-10">
                {/* Number */}
                <span
                  className="text-5xl font-black  leading-none block mb-3 select-none"
                  style={{ color: s.accent, fontFamily: 'Georgia, serif' }}
                >
                  {s.number}
                </span>

                {/* Accent bar */}
                <div className="w-8 h-1 rounded-full mb-4" style={{ background: s.accent }} />

                <h3
                  className="text-lg font-extrabold text-gray-900 mb-0.5 leading-tight"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {s.title}
                </h3>
                <p className="text-xs mb-3" style={{ color: s.accent, fontFamily: 'system-ui, sans-serif' }}>
                  {s.hindi}
                </p>
                <p className="text-gray-500 text-sm leading-relaxed" style={{ fontFamily: 'system-ui, sans-serif' }}>
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA STRIP ────────────────────────────────────── */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-12">

          <p className="text-xs font-bold text-gray-400 tracking-[0.2em] uppercase mb-6"
            style={{ fontFamily: 'system-ui, sans-serif' }}>
            Quick Actions
          </p>

          <div className="flex flex-wrap gap-4">
            <CTAButton
              label="Click Here Regarding Admission"
              sublabel="प्रवेश के लिए यहाँ क्लिक करें"
              color="#7C3AED"
              onClick={() => goOrLogin('/admission')}
            />
            <CTAButton
              label="Click Here Regarding Job Vacancies"
              sublabel="नौकरी रिक्तियों के लिए"
              color="#D97706"
              onClick={() => goOrLogin('/jobs')}
            />
            <CTAButton
              label="Apply for Teaching Job"
              sublabel="शिक्षण पद के लिए आवेदन करें"
              color="#2563EB"
              onClick={() => goOrLogin('/teacher/apply')}
            />
          </div>

          {/* Login hint when not logged in */}
          {!user && (
            <p className="mt-5 text-xs text-gray-400 flex items-center gap-1.5"
              style={{ fontFamily: 'system-ui, sans-serif' }}>
              <span className="text-blue-500">🔒</span>
              You'll need to log in to proceed with any of the above actions.
            </p>
          )}
        </div>
      </div>

      {/* ── FOOTER STRIP ─────────────────────────────────── */}
      <div className="bg-[#0F172A] text-slate-500 text-xs text-center py-5"
        style={{ fontFamily: 'system-ui, sans-serif' }}>
        M. S. Consultancy Services · Siwan, Bihar · Serving Bihar & Eastern UP
      </div>
    </div>
  );
};

export default ServicesPage;