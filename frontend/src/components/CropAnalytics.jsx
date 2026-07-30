import {
  Wheat,
  Sprout,
  Droplets,
  TrendingUp,
} from "lucide-react";

export default function CropAnalytics() {

  const analytics = [
    {
      title: "Current Crop",
      value: "Rice",
      icon: <Wheat className="text-green-700" />,
      color: "bg-green-50",
    },
    {
      title: "Soil Fertility",
      value: "92%",
      icon: <Sprout className="text-emerald-600" />,
      color: "bg-emerald-50",
    },
    {
      title: "Water Level",
      value: "Good",
      icon: <Droplets className="text-blue-600" />,
      color: "bg-blue-50",
    },
    {
      title: "Expected Growth",
      value: "+18%",
      icon: <TrendingUp className="text-purple-600" />,
      color: "bg-purple-50",
    },
  ];

  return (

    <section className="max-w-7xl mx-auto px-8 mt-14">

      <div className="flex justify-between items-center mb-8">

        <div>

          <h2 className="text-3xl font-bold">
            Farm Analytics
          </h2>

          <p className="text-gray-500">
            AI-powered monitoring of your agricultural field.
          </p>

        </div>

      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

        {analytics.map((card, index) => (

          <div
            key={index}
            className={`${card.color} rounded-3xl p-7 shadow hover:shadow-xl transition`}
          >

            <div className="flex justify-between">

              <div>

                <p className="text-gray-500">
                  {card.title}
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {card.value}
                </h2>

              </div>

              <div className="bg-white p-3 rounded-2xl shadow">
                {card.icon}
              </div>

            </div>

          </div>

        ))}

      </div>

    </section>

  );

}