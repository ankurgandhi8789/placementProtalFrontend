

import FloatingHelpButton from '../../components/common/FloatingHelpButton'

const TermsPage = ({ role = 'teacher' }) => {
  const isTeacher = role === 'teacher';
  return (
    <div>
      <FloatingHelpButton></FloatingHelpButton> 
      <div className="bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Terms & Conditions</h1>
          <p className="text-blue-100">For {isTeacher ? 'Teachers' : 'Schools'}</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-6">
          {(isTeacher ? teacherTerms : schoolTerms).map(({ title, content }) => (
            <div key={title}>
              <h2 className="text-xl font-bold text-gray-900 mb-3">{title}</h2>
              <p className="text-gray-600 leading-relaxed">{content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const teacherTerms = [
  { title: '1. Registration', content: 'Teachers must provide accurate and complete information during registration. False information may result in immediate termination of account.' },
  { title: '2. Profile Completeness', content: 'Teachers are required to complete their profile including education details, subject expertise, experience, and upload a valid resume in PDF format.' },
  { title: '3. Placement Process', content: 'The placement process is managed entirely by Maa Savitri Consultancy Services. Teachers will be notified of their status updates through the portal.' },
  { title: '4. Confidentiality', content: 'Teachers agree not to share school information or contact details obtained through this platform with third parties.' },
  { title: '5. Code of Conduct', content: 'Teachers must maintain professional conduct throughout the hiring process. Any misconduct may result in disqualification.' },
  { title: '6. Service Fee', content: 'Maa Savitri Consultancy Services may charge a nominal service fee upon successful placement. Details will be communicated separately.' },
];

const schoolTerms = [
  { title: '1. Registration', content: 'Schools must provide accurate institution details including name, address, board affiliation, and contact information.' },
  { title: '2. Requirements Posting', content: 'Schools can post teacher requirements specifying subject, class level, salary range, and location. All requirements must be genuine.' },
  { title: '3. Hiring Process', content: 'The hiring process is managed by Maa Savitri Consultancy Services. Schools will not have direct access to teacher profiles to ensure privacy.' },
  { title: '4. Confidentiality', content: 'Schools agree to maintain confidentiality of teacher information shared during the placement process.' },
  { title: '5. Service Agreement', content: 'Schools agree to honor the placement once a teacher is assigned. Cancellation after assignment may incur charges.' },
  { title: '6. Payment', content: 'Service fees are applicable upon successful placement. Payment terms will be communicated by our team.' },
];

export default TermsPage;
