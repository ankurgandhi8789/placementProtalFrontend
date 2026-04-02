const stageStyles = {
  applied:        'bg-gray-100 text-gray-600',
  registered:     'bg-gray-100 text-gray-600',
  contacted:      'bg-blue-100 text-blue-700',
  test_scheduled: 'bg-purple-100 text-purple-700',
  interview:      'bg-amber-100 text-amber-700',
  assigned:       'bg-emerald-100 text-emerald-700',
  completed:      'bg-teal-100 text-teal-700',
  rejected:       'bg-red-100 text-red-700',
};

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize ${
      stageStyles[status] || 'bg-gray-100 text-gray-600'
    }`}
  >
    {status?.replace(/_/g, ' ') || 'unknown'}
  </span>
);

export default StatusBadge;
