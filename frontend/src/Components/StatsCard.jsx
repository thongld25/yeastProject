const StatsCard = ({ title, value, linkText, icon }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-start gap-4">
        {/* Phần icon */}
        {icon && (
          <div className="p-3 bg-blue-100 rounded-full flex-shrink-0">
            <div className="w-6 h-6 text-blue-600">{icon}</div>
          </div>
        )}

        {/* Phần nội dung chính */}
        <div className="flex-1">
          <h3 className="text-gray-500 text-sm font-medium mb-2">{title}</h3>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-semibold text-gray-900">
              {value}
            </span>
          </div>
          {linkText && (
            <a
              href={linkText}
              className="mt-4 inline-block text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Xem tất cả
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
