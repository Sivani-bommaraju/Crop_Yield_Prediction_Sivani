export default function StatCard({
  icon,
  title,
  value,
  color,
}) {

  return (

    <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-7">

      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center ${color}`}
      >

        {icon}

      </div>

      <h3 className="mt-6 text-gray-500 text-sm uppercase">

        {title}

      </h3>

      <p className="mt-2 text-2xl font-bold text-gray-800">

        {value}

      </p>

    </div>

  );

}