import { ArrowRight } from "lucide-react";

export default function FeatureCard({
  icon,
  title,
  description,
  color,
  button,
}) {
  return (
    <div className="group bg-white rounded-3xl p-7 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">

      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center ${color} text-white shadow-lg`}
      >
        {icon}
      </div>

      <h2 className="mt-6 text-2xl font-bold text-gray-800">
        {title}
      </h2>

      <p className="mt-3 text-gray-500 leading-7">
        {description}
      </p>

      <button
        className="mt-8 flex items-center gap-2 text-green-700 font-semibold group-hover:gap-4 transition-all"
      >
        {button}

        <ArrowRight size={18} />
      </button>

    </div>
  );
}