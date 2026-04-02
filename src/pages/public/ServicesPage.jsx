import { GraduationCap, School, Users, FileText, CheckCircle, Star } from 'lucide-react';

const services = [
  { icon: GraduationCap, title: 'Teacher Placement', desc: 'We match qualified teachers with schools based on subject expertise, experience, and location preferences.', color: 'bg-blue-600' },
  { icon: School, title: 'School Staffing', desc: 'Schools post their requirements and we handle the entire hiring pipeline from sourcing to final placement.', color: 'bg-amber-500' },
  { icon: Users, title: 'Career Counseling', desc: 'We guide teachers on career growth, resume building, and interview preparation.', color: 'bg-green-600' },
  { icon: FileText, title: 'Profile Verification', desc: 'All teacher profiles are verified for authenticity, ensuring schools get only genuine candidates.', color: 'bg-purple-600' },
  { icon: CheckCircle, title: 'Pipeline Management', desc: 'Our admin team manages the entire hiring pipeline — from application to final assignment.', color: 'bg-red-500' },
  { icon: Star, title: 'Quality Assurance', desc: 'We ensure every placement meets the highest standards of quality and professionalism.', color: 'bg-teal-600' },
];

const ServicesPage = () => (
  <div>
    <div className="bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Our Services</h1>
        <p className="text-blue-100 max-w-2xl mx-auto">Comprehensive teacher placement and school staffing solutions.</p>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(({ icon: Icon, title, desc, color }) => (
          <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ServicesPage;
