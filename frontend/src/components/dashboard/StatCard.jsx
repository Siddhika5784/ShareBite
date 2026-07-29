const StatCard = ({ title, value, color, icon: Icon }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center">

        <div>
          <h3 className="text-gray-500 text-sm">
            {title}
          </h3>

          <p className={`text-3xl font-bold mt-2 ${color}`}>
            {value}
          </p>
        </div>

        {Icon && (
          <Icon 
            size={40}
            className={color}
          />
        )}

      </div>
    </div>
  );
};

export default StatCard;