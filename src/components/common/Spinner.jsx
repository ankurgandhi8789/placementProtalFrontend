const Spinner = ({ size = 'md' }) => {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex justify-center items-center p-4">
      <div className={`${sizes[size]} border-4 border-blue-600 border-t-transparent rounded-full animate-spin`} />
    </div>
  );
};

export default Spinner;
