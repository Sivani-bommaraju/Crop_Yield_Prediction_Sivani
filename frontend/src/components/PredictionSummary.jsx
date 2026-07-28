import {
  BrainCircuit,
  TrendingUp,
  Wheat,
  BarChart3,
} from "lucide-react";

export default function PredictionSummary() {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 h-full">

      <div className="flex items-center gap-3 mb-8">

        <div className="bg-green-100 p-3 rounded-2xl">
          <BrainCircuit className="text-green-700" />
        </div>

        <div>
          <h2 className="text-2xl font-bold">
            Prediction Summary
          </h2>

          <p className="text-gray-500">
            AI Forecast Overview
          </p>
        </div>

      </div>

      {/* Expected Yield */}

      <div className="bg-green-50 rounded-2xl p-5 mb-6">

        <p className="text-sm text-gray-500">
          Expected Yield
        </p>

        <h1 className="text-4xl font-bold text-green-700 mt-2">
          8.6
        </h1>

        <p className="text-gray-600">
          Tons / Hectare
        </p>

      </div>

      {/* Confidence */}

      <div className="mb-6">

        <div className="flex justify-between mb-2">

          <span className="font-medium">
            Prediction Confidence
          </span>

          <span className="font-bold text-green-700">
            94%
          </span>

        </div>

        <div className="w-full bg-gray-200 rounded-full h-3">

          <div
            className="bg-green-600 h-3 rounded-full"
            style={{ width: "94%" }}
          ></div>

        </div>

      </div>

      {/* Details */}

      <div className="space-y-4">

        <div className="flex justify-between items-center">

          <div className="flex items-center gap-2">
            <Wheat
              size={18}
              className="text-green-700"
            />
            <span>Recommended Crop</span>
          </div>

          <span className="font-semibold">
            Rice
          </span>

        </div>

        <div className="flex justify-between items-center">

          <div className="flex items-center gap-2">
            <TrendingUp
              size={18}
              className="text-blue-600"
            />
            <span>Growth Potential</span>
          </div>

          <span className="font-semibold text-blue-600">
            High
          </span>

        </div>

        <div className="flex justify-between items-center">

          <div className="flex items-center gap-2">
            <BarChart3
              size={18}
              className="text-purple-600"
            />
            <span>Model Status</span>
          </div>

          <span className="font-semibold text-green-600">
            Ready
          </span>

        </div>

      </div>

    </div>
  );
}