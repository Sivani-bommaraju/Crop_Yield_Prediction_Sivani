import {
  Clock3,
  CheckCircle,
} from "lucide-react";

export default function RecentActivity() {

  const activity = [
    "Logged in successfully",
    "Farmer profile created",
    "Weather information loaded",
    "Dashboard initialized",
  ];

  return (

    <div className="bg-white rounded-3xl shadow-lg p-8">

      <div className="flex items-center gap-3 mb-8">

        <Clock3 className="text-green-700"/>

        <h2 className="text-2xl font-bold">
          Recent Activity
        </h2>

      </div>

      <div className="space-y-5">

        {activity.map((item,index)=>(

          <div
            key={index}
            className="flex items-center gap-4"
          >

            <CheckCircle
              className="text-green-600"
              size={20}
            />

            <span>{item}</span>

          </div>

        ))}

      </div>

    </div>

  );

}