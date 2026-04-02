import { GraduationCap, Target, Heart, Shield, Users, Award } from 'lucide-react';

const AboutPage = () => (
  <div>
    <div className="bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <p className="text-blue-100 max-w-2xl mx-auto text-lg">
          Maa Savitri Consultancy Services — Empowering education through quality teacher placements since 2010.
        </p>
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Maa Savitri Consultancy Services connects skilled teachers with top schools, ensuring quality education and professional growth. We believe every student deserves a great teacher, and every teacher deserves a great opportunity.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Our platform acts as a trusted mediator between educators and institutions, managing the entire hiring pipeline with transparency and professionalism.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: Target, title: 'Our Mission', desc: 'Quality placements for every teacher', color: 'bg-blue-600' },
            { icon: Heart, title: 'Our Values', desc: 'Integrity, trust, and excellence', color: 'bg-amber-500' },
            { icon: Shield, title: 'Our Promise', desc: 'Verified and secure placements', color: 'bg-green-600' },
            { icon: Award, title: 'Our Legacy', desc: '15+ years of trusted service', color: 'bg-purple-600' },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-gray-900">{title}</h3>
              <p className="text-gray-500 text-sm mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 rounded-3xl p-8 lg:p-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Why Choose Us?</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Users, title: '500+ Happy Clients', desc: 'Trusted by teachers and schools across India' },
            { icon: GraduationCap, title: '1200+ Placements', desc: 'Successful teacher placements completed' },
            { icon: Shield, title: 'Verified Profiles', desc: 'All teachers are thoroughly verified' },
            { icon: Target, title: '95% Success Rate', desc: 'Industry-leading placement success rate' },
            { icon: Heart, title: 'Dedicated Support', desc: 'Our team is always here to help you' },
            { icon: Award, title: '15+ Awards', desc: 'Recognized for excellence in education' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <p className="text-gray-500 text-sm mt-1">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default AboutPage;
