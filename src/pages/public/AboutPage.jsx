// src/pages/AboutPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap, Target, Heart, Shield, Users, Award,
  MapPin, CheckCircle, ChevronDown, ChevronUp, ArrowUp,
  Cpu, Video, ClipboardCheck, ArrowRight, Star, BookOpen,
  Briefcase, Search, FileText, MessageSquare, UserCheck,
  Package, RefreshCw
} from 'lucide-react';
import FloatingHelpButton from '../../components/common/FloatingHelpButton';

// ─── Scroll-to-top button ──────────────────────────────────────────────────
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

// ─── Read-more expandable block ────────────────────────────────────────────
const ReadMore = ({ children, previewLines = 3 }) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className={`overflow-hidden transition-all duration-500 ${open ? 'max-h-[2000px]' : 'max-h-[120px]'}`}>
        {children}
      </div>
      {!open && (
        <div className="h-8 -mt-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      )}
      <button
        onClick={() => setOpen(o => !o)}
        className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-blue-600
          hover:text-blue-800 transition-colors"
      >
        {open ? (
          <><ChevronUp size={15} /> Read Less</>
        ) : (
          <><ChevronDown size={15} /> Read More</>
        )}
      </button>
    </div>
  );
};

// ─── Section divider ───────────────────────────────────────────────────────
const Divider = () => (
  <div className="flex items-center gap-4 my-12">
    <div className="flex-1 h-px bg-gradient-to-r from-transparent to-blue-100" />
    <div className="w-2 h-2 rounded-full bg-blue-300" />
    <div className="w-3 h-3 rounded-full bg-blue-500" />
    <div className="w-2 h-2 rounded-full bg-blue-300" />
    <div className="flex-1 h-px bg-gradient-to-l from-transparent to-blue-100" />
  </div>
);

// ─── Recruitment step card ─────────────────────────────────────────────────
const StepCard = ({ num, title, points }) => (
  <div className="flex gap-4">
    <div className="flex flex-col items-center">
      <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-black text-sm
        flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-200">
        {num}
      </div>
      <div className="flex-1 w-px bg-gradient-to-b from-blue-300 to-transparent mt-2" />
    </div>
    <div className="pb-8 flex-1 min-w-0">
      <h4 className="font-bold text-gray-900 text-base mb-2">{title}</h4>
      <ul className="space-y-1.5">
        {points.map((p, i) => (
          <li key={i} className="flex items-start gap-2 text-gray-600 text-sm leading-relaxed">
            <CheckCircle size={13} className="text-blue-500 flex-shrink-0 mt-0.5" />
            {p}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────
const AboutPage = () => (
  <div className="bg-[#F8FAFC]">
    <FloatingHelpButton />
    <ScrollTopButton />

    {/* ── Hero ─────────────────────────────────────────────────────────── */}
    

    {/* ── Stats strip ──────────────────────────────────────────────────── */}
    

    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-0">

      {/* ── About section ─────────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-10 items-start">
        <div>
          {/* <span className="inline-block text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">
            Who We Are
          </span> */}
          <h2 className="text-3xl font-black text-gray-900 mb-5 leading-tight">
            Maa Savitri<br />Consultancy Services
          </h2>
          <div className="space-y-4 text-gray-600 leading-relaxed text-[15px]">
            <p>
              Maa Savitri Consultancy Services is a premier educational consultancy firm
              headquartered in <strong className="text-gray-800">Siwan, Bihar</strong>. We are
              committed to promoting academic excellence by connecting schools with highly
              qualified, trained, and dedicated teaching professionals.
            </p>
            <p>
              With a strong presence across <strong className="text-gray-800">Bihar and the eastern
              region of Uttar Pradesh</strong>, we specialise in providing skilled educators who are
              passionate about shaping young minds and delivering quality education.
            </p>
            <p>
              Our mission is to empower educational institutions by ensuring access to top-tier
              teaching talent, thereby enhancing learning outcomes and contributing to the overall
              development of students.
            </p>
          </div>
        </div>

        {/* Value cards */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Target,       title: 'Our Mission',  desc: 'Quality placements for every teacher and school',      color: 'bg-blue-600'   },
            { icon: Heart,        title: 'Our Values',   desc: 'Integrity, trust, and relentless excellence',           color: 'bg-amber-500'  },
            { icon: Shield,       title: 'Our Promise',  desc: 'Verified, secure, and transparent placements',          color: 'bg-emerald-600'},
            { icon: Award,        title: 'Our Legacy',   desc: '15+ years of trusted educational consultancy service',  color: 'bg-purple-600' },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div key={title}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm
                hover:shadow-md hover:border-blue-100 transition-all group">
              <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-3
                group-hover:scale-105 transition-transform`}>
                <Icon size={18} className="text-white" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm">{title}</h3>
              <p className="text-gray-400 text-xs mt-1 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <Divider />

      {/* ── Why Choose Us ─────────────────────────────────────────────── */}
      <div>
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">
            Our Advantage
          </span>
          <h2 className="text-3xl font-black text-gray-900">Why Choose Us?</h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              icon: Star,
              title: 'Expertise & Experience',
              color: 'bg-blue-50 text-blue-600',
              desc: 'With a team of seasoned education professionals, we bring extensive knowledge and experience to both teacher recruitment and admission consultancy.',
            },
            {
              icon: CheckCircle,
              title: 'Quality Assurance',
              color: 'bg-emerald-50 text-emerald-600',
              desc: 'Our commitment to quality ensures schools receive teachers who are not only qualified but also enthusiastic about teaching, while students receive the best possible academic guidance.',
            },
            {
              icon: Users,
              title: 'Personalised Approach',
              color: 'bg-amber-50 text-amber-600',
              desc: 'We understand that every school and student is unique. Our services are tailored to meet individual needs, ensuring optimal outcomes for all clients.',
            },
          ].map(({ icon: Icon, title, color, desc }) => (
            <div key={title}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm
                hover:shadow-md hover:border-blue-100 transition-all">
              <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center mb-4`}>
                <Icon size={22} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <Divider />

      {/* ── Teacher Recruitment System ────────────────────────────────── */}
      <div>
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">
            How We Work
          </span>
          <h2 className="text-3xl font-black text-gray-900 mb-3">
            Teacher Recruitment System
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-[15px] leading-relaxed">
            Maa Savitri Consultancy Services follows a well-defined and systematic process to ensure
            that the most suitable candidates are selected to meet the diverse educational needs of
            schools and institutions.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">
            Our Recruitment Process
          </p>

          <ReadMore>
            <div className="space-y-0">
              {[
                {
                  num: 1, title: 'Understanding Client Requirements',
                  points: [
                    'Consultation with clients to understand subject needs, grade levels, and expectations.',
                    'Preparation of detailed job descriptions including qualifications, skills, and responsibilities.',
                  ],
                },
                {
                  num: 2, title: 'Sourcing Candidates',
                  points: [
                    'Advertisement: Posting vacancies on job portals, social media, and official platforms.',
                    'Networking: Leveraging professional connections and institutional networks.',
                    'Database Utilisation: Using internal candidate databases.',
                  ],
                },
                {
                  num: 3, title: 'Application Process',
                  points: [
                    'Online Application: Resume and document submission system.',
                    'Pre-screening: Questionnaire-based candidate evaluation.',
                  ],
                },
                {
                  num: 4, title: 'Screening and Shortlisting',
                  points: [
                    'Resume Screening: Qualification verification.',
                    'Initial Interview: Communication and suitability assessment.',
                    'Background Check: Credential and reference verification.',
                  ],
                },
                {
                  num: 5, title: 'Assessment and Evaluation',
                  points: [
                    'Teaching Demonstration: Mock or recorded teaching sessions.',
                    'Written Test: Subject knowledge assessment.',
                  ],
                },
                {
                  num: 6, title: 'Final Interview',
                  points: [
                    'Panel Interview: Conducted by experts and client representatives.',
                    'Behavioural Interview: Evaluating adaptability and problem-solving.',
                  ],
                },
                {
                  num: 7, title: 'Selection and Offer',
                  points: [
                    'Evaluation: Final decision based on all stages.',
                    'Job Offer: Formal offer with terms and conditions.',
                    'Negotiation: Handling offer-related discussions.',
                  ],
                },
                {
                  num: 8, title: 'Onboarding',
                  points: [
                    'Documentation: Collection of necessary records.',
                    'Orientation: Introduction to school policies and culture.',
                  ],
                },
                {
                  num: 9, title: 'Follow-up',
                  points: [
                    'Initial Check-ins: Monitoring early-stage performance.',
                    'Ongoing Support: Continuous guidance and development.',
                  ],
                },
                {
                  num: 10, title: 'Feedback and Improvement',
                  points: [
                    'Feedback Collection: From both schools and teachers.',
                    'Process Improvement: Continuous refinement of recruitment strategy.',
                  ],
                },
              ].map(step => (
                <StepCard key={step.num} {...step} />
              ))}
            </div>
          </ReadMore>
        </div>
      </div>

      <Divider />

      {/* ── Tools and Technologies ────────────────────────────────────── */}
      <div>
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">
            Technology
          </span>
          <h2 className="text-3xl font-black text-gray-900 mb-3">Tools &amp; Technologies</h2>
          <p className="text-gray-500 max-w-xl mx-auto text-[15px]">
            We leverage modern, industry-standard technology to deliver efficient,
            transparent, and professional recruitment services.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              icon: Cpu,
              title: 'Applicant Tracking System (ATS)',
              color: 'bg-blue-50 text-blue-600 border-blue-100',
              desc: 'We utilise advanced ATS solutions to streamline the application and screening process efficiently, ensuring no candidate is missed.',
            },
            {
              icon: Video,
              title: 'Interview Platforms',
              color: 'bg-purple-50 text-purple-600 border-purple-100',
              desc: 'Reliable video conferencing tools are used to conduct smooth and professional remote interviews without geographic barriers.',
            },
            {
              icon: ClipboardCheck,
              title: 'Assessment Tools',
              color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
              desc: 'Standardised assessment systems evaluate teaching abilities and subject expertise with consistency and fairness.',
            },
          ].map(({ icon: Icon, title, color, desc }) => (
            <div key={title}
              className={`bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition-all ${color.split(' ')[2]}`}>
              <div className={`w-12 h-12 ${color.split(' ').slice(0, 2).join(' ')} rounded-2xl flex items-center justify-center mb-4 border`}>
                <Icon size={22} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-sm">{title}</h3>
              <ReadMore>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </ReadMore>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-gray-500 text-sm leading-relaxed max-w-2xl mx-auto">
          By following these steps, Maa Savitri Consultancy Services ensures a thorough and efficient
          teacher recruitment process that meets the high standards expected by client schools.
        </p>
      </div>

      <Divider />

      {/* ── CTA bottom ───────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <h2 className="text-3xl font-black mb-3">Ready to Get Started?</h2>
          <p className="text-blue-200 mb-8 max-w-xl mx-auto">
            Whether you're a teacher looking for the right school or a school looking for the right teacher —
            we're here to make it happen.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register?role=teacher"
              className="flex items-center gap-2 bg-amber-400 text-gray-900 font-bold
                px-6 py-3 rounded-full text-sm hover:bg-amber-300 transition-colors shadow-lg">
              <GraduationCap size={16} /> Apply as Teacher
            </Link>
            <Link to="/register?role=school"
              className="flex items-center gap-2 bg-white/15 text-white border border-white/25
                font-semibold px-6 py-3 rounded-full text-sm hover:bg-white/25 transition-colors">
              <Briefcase size={16} /> Post Requirement
            </Link>
            <Link to="/contact"
              className="flex items-center gap-2 bg-white/10 text-white border border-white/20
                font-semibold px-6 py-3 rounded-full text-sm hover:bg-white/20 transition-colors">
              <MessageSquare size={16} /> Contact Us
            </Link>
          </div>
        </div>
      </div>

      <div className="pb-8" />
    </div>
  </div>
);

export default AboutPage;