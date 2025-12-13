import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  Legend as ReLegend,
  BarChart,
  Bar,
} from "recharts";

export default function ModelMonitoring() {
  // ---------- mock accuracy + error data ----------
  const weeks = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"];

  const accuracyData = weeks.map((w, i) => {
    const base = 80 + Math.random() * 10; // 80–90
    return {
      week: w,
      accuracy: Math.round(
        base + (i - 3) * (Math.random() * 2 - 1) * 3
      ),
    };
  });

  const errorData = weeks.map((w) => ({
    week: w,
    mape: +(5 + Math.random() * 20).toFixed(1), // 5–25 %
  }));

  const latestAccuracy =
    accuracyData[accuracyData.length - 1]?.accuracy ?? 0;

  let health = "Stable";
  let healthColor = "bg-emerald-500";
  let healthText = "Accuracy > 85% · model is performing well.";
  if (latestAccuracy < 70) {
    health = "Retrain Needed";
    healthColor = "bg-red-500";
    healthText = "Accuracy < 70% · schedule a retrain.";
  } else if (latestAccuracy < 85) {
    health = "Caution";
    healthColor = "bg-yellow-400";
    healthText = "Accuracy 70–85% · monitor drift closely.";
  }

  const lastRetrainDate = "24 Nov 2025";

  return (
    <div className="p-8 min-h-screen bg-[#fffff0] dark:bg-gray-900 transition-colors duration-500">
      <div className="mb-6">
        <h2 className="text-3xl font-extrabold mb-2 text-[#2d2a1f] dark:bg-gradient-to-r dark:from-fuchsia-400 dark:to-orange-300 dark:bg-clip-text dark:text-transparent">
          Model Monitoring
        </h2>
        <p className="text-xs md:text-sm text-[#6b6a5a] dark:text-gray-400">
          Monitor forecast accuracy, detect error drift, and track retraining
          activity for your Azure demand models.
        </p>
      </div>

      {/* top: accuracy trend + health card */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* accuracy line chart */}
        <div className="xl:col-span-2 bg-white dark:bg-gray-900/70 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Model accuracy trend
          </h3>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-3">
            Weekly forecast accuracy based on backtested actuals.
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={accuracyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="week" stroke="#6b7280" />
                <YAxis domain={[50, 100]} stroke="#6b7280" />
                <ReTooltip />
                <ReLegend />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* traffic light health + retrain date */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-900/70 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Forecast health
            </h3>
            <div className="flex items-center gap-3 mb-2">
              <span
                className={`inline-flex w-4 h-4 rounded-full ${healthColor} shadow-sm`}
              />
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {health}
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  Latest accuracy: {latestAccuracy}%
                </p>
              </div>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              {healthText}
            </p>

            <div className="mt-4 border-t border-gray-200 dark:border-gray-800 pt-3 space-y-1 text-[11px]">
              <p className="flex items-center gap-2">
                <span className="inline-flex w-3 h-3 rounded-full bg-emerald-500" />
                <span>Stable → Accuracy &gt; 85%</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="inline-flex w-3 h-3 rounded-full bg-yellow-400" />
                <span>Caution → Accuracy 70–85%</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="inline-flex w-3 h-3 rounded-full bg-red-500" />
                <span>Retrain Needed → Accuracy &lt; 70%</span>
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900/70 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
              Last retrain
            </h3>
            <p className="text-sm text-gray-800 dark:text-gray-200">
              {lastRetrainDate}
            </p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
              Triggered by drift in West Europe Storage MAPE.
            </p>
          </div>
        </div>
      </div>

      {/* bottom: error drift alerts + bar chart */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* error drift alerts */}
        <div className="bg-white dark:bg-gray-900/70 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-sm xl:col-span-1">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Error drift alerts
          </h3>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-3">
            Recent deviations between forecast and actuals.
          </p>
          <ul className="space-y-3 text-xs">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 inline-flex w-2 h-2 rounded-full bg-red-500" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  High drift in East US Compute
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  Week 7 MAPE exceeded 22% vs 10% baseline.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 inline-flex w-2 h-2 rounded-full bg-yellow-400" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  Gradual drift in West Europe Storage
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  Error increasing 3 weeks in a row; monitor closely.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 inline-flex w-2 h-2 rounded-full bg-emerald-500" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  Network bandwidth forecasts stable
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  Errors remain within ±5% tolerance.
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* error bar chart */}
        <div className="bg-white dark:bg-gray-900/70 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-sm xl:col-span-2">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Error drift (MAPE by week)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={errorData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="week" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <ReTooltip />
                <ReLegend />
                <Bar dataKey="mape" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
