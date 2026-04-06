import FloatingHelpButton from '../../components/common/FloatingHelpButton'

const TermsPage = ({ role = 'teacher' }) => {
  const isTeacher = role === 'teacher';
  const terms = isTeacher ? teacherTerms : schoolTerms;

  return (
    <div className="min-h-screen bg-gray-50">
      <FloatingHelpButton />

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-3">Terms & Conditions</h1>
          <p className="text-blue-100 text-lg">
            {isTeacher ? 'For Teachers — Payment Terms & Policy' : 'For Client Institutes — Agreement & Payment Terms'}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-5">
          {terms.map(({ title, content, items, subItems }) => (
            <div key={title} className="bg-white rounded-xl border border-blue-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-[#1E3A8A] mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#2563EB] inline-block"></span>
                {title}
              </h2>
              {content && <p className="text-gray-600 leading-relaxed">{content}</p>}
              {items && (
                <ul className="mt-2 space-y-2">
                  {items.map((item, i) => (
                    <li key={i} className="text-gray-600 flex gap-2">
                      <span className="text-[#2563EB] mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              {subItems && (
                <ul className="mt-3 space-y-3">
                  {subItems.map(({ label, points }, i) => (
                    <li key={i}>
                      <p className="text-gray-700 font-medium">{label}</p>
                      <ul className="mt-1 space-y-1 pl-4">
                        {points.map((p, j) => (
                          <li key={j} className="text-gray-600 flex gap-2">
                            <span className="text-[#2563EB]">–</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-gray-400 text-sm mt-10">
          © Maa Savitri Consultancy Services. All rights reserved.
        </p>
      </div>
    </div>
  );
};

const teacherTerms = [
  {
    title: '1. Payment Terms',
    content: 'Service Fee: The teacher agrees to pay Maa Savitri Consultancy Services a hiring charge equivalent to 50% of the first month\'s salary upon securing a teaching position through our services.',
    subItems: [
      {
        label: 'Payment Schedule: The teacher may choose to pay in one of the following ways:',
        points: [
          'One-Time Payment: Full payment must be made within 40 days of joining.',
          'Two Installments: First installment (25%) within 40 days of joining; second installment (remaining 25%) within 70 days thereafter.',
        ],
      },
      {
        label: 'Method of Payment:',
        points: ['Payment can be made via UPI: 7541014272@ybl'],
      },
    ],
  },
  {
    title: '2. Responsibilities of the Teacher',
    items: [
      'Provide accurate and updated information regarding qualifications and experience.',
      'Attend scheduled interviews and maintain timely communication.',
      'Ensure timely payment as per the agreed schedule.',
    ],
  },
  {
    title: '3. Confidentiality',
    content: 'Both parties agree to maintain the confidentiality of any sensitive information shared during the recruitment process.',
  },
  {
    title: '4. Term and Termination',
    items: [
      'Term: This agreement begins on the date of joining and continues until full payment is completed.',
      'Termination: Either party may terminate with 30 days\' notice. However, payment obligations remain applicable if the teacher has already secured a job.',
    ],
  },
  {
    title: '5. Liability',
    content: 'Maa Savitri Consultancy Services will perform its services to the best of its ability. However, we do not guarantee job suitability and are not liable for any employment-related issues thereafter.',
  },
];

const schoolTerms = [
  {
    title: '1. Payment Terms',
    subItems: [
      {
        label: 'Service Fee:',
        points: ['PRT – ₹3,000', 'TGT – ₹4,000', 'PGT – ₹5,000'],
      },
      {
        label: 'Payment Schedule:',
        points: [
          'Initial Deposit: 50% at agreement signing.',
          'Final Payment: 50% after successful placement.',
        ],
      },
    ],
  },
  {
    title: '2. Term and Termination',
    items: [
      'Agreement continues until recruitment completion.',
      '30 days\' notice required for termination.',
      'Initial deposit is non-refundable after service begins.',
    ],
  },
  {
    title: '3. Responsibilities of the Client',
    items: [
      'Provide clear job requirements.',
      'Maintain timely communication.',
      'Ensure prompt payments.',
    ],
  },
  {
    title: '4. Confidentiality',
    content: 'All shared information will remain strictly confidential.',
  },
  {
    title: '5. Liability',
    content: 'Maa Savitri Consultancy Services performs services professionally but is not liable for post-placement performance or issues.',
  },
];

export default TermsPage;