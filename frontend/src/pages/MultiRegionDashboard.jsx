import React, { useState, useEffect } from "react";
import api from "../api";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";

export default function MultiRegionDashboard() {
  const [allRegions, setAllRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRegions, setSelectedRegions] = useState([
    "East US",
    "West US",
  ]);

  // Fetch multi-region data from API
  useEffect(() => {
    const fetchMultiRegionData = async () => {
      try {
        setLoading(true);
        const data = await api.getMultiRegion();

        // Transform API response to match component structure
        const regions = data.regions.map(region => ({
          name: region.name,
          cpuUsage: region.cpuUsage,
          storageUsage: region.storageUsage,
          peakHours: region.peakHours || ["12:00-15:00"],
          forecast: region.forecast || [65, 70, 75, 80],
          recommendation: region.recommendation || "Monitor usage",
        }));

        setAllRegions(regions);
        setError(null);
      } catch (err) {
        console.error("Error fetching multi-region data:", err);
        setError(err.message);
        // Fallback to static data on error
        setAllRegions([
          {
            name: "East US",
            cpuUsage: 72,
            storageUsage: 14.2,
            peakHours: ["12:00–15:00"],
            forecast: [65, 70, 75, 80],
            recommendation: "Add +1500 units",
          },
          {
            name: "West Europe",
            cpuUsage: 58,
            storageUsage: 9.8,
            peakHours: ["18:00–21:00"],
            forecast: [55, 57, 60, 63],
            recommendation: "Reduce –700 TB",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchMultiRegionData();
  }, []);

  const visibleRegions = allRegions.filter((r) =>
    selectedRegions.includes(r.name)
  );

  const handleToggleRegion = (name) => {
    setSelectedRegions((prev) =>
      prev.includes(name)
        ? prev.filter((r) => r !== name)
        : [...prev, name]
    );
  };

  const capacityChartData = visibleRegions.map((r) => ({
    region: r.name,
    cpu: r.cpuUsage,
    storage: r.storageUsage,
  }));

  const horizonLabels = ["T+1", "T+2", "T+3", "T+4"];
  const forecastChartData = horizonLabels.map((label, idx) => {
    const point = { step: label };
    visibleRegions.forEach((r) => {
      point[r.name] = r.forecast[idx];
    });
    return point;
  });

  return (
    <div className="p-8 min-h-screen bg-[#fffff0] dark:bg-gray-900">
      <h2 className="text-3xl font-extrabold mb-2 text-[#2d2a1f] dark:text-white">
        Multi‑Region Capacity Comparison
      </h2>
      <p className="text-xs md:text-sm text-[#6b6a5a] dark:text-gray-400 mb-6">
        Compare CPU, storage, forecasts, peak hours, and recommendations across regions.
      </p>

      {/* Region selector */}
      <div className="mb-6 flex flex-wrap gap-3 text-xs">
        {allRegions.map((r) => (
          <label
            key={r.name}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-[#b7d2f7] dark:border-gray-700 bg-white dark:bg-gray-900 cursor-pointer"
          >
            <input
              type="checkbox"
              className="accent-[#2563eb]"
              checked={selectedRegions.includes(r.name)}
              onChange={() => handleToggleRegion(r.name)}
            />
            <span className="font-medium text-[#1f2933] dark:text-gray-100">
              {r.name}
            </span>
          </label>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        {/* CPU & Storage */}
        <div className="bg-white dark:bg-gray-900/70 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
            CPU & Storage by region
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={capacityChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="region" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Bar dataKey="cpu" name="CPU (%)" fill="#60a5fa" />
                <Bar dataKey="storage" name="Storage (TB)" fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Forecast comparison */}
        <div className="bg-white dark:bg-gray-900/70 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Forecast demand (relative units)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="step" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                {visibleRegions.map((r, idx) => (
                  <Line
                    key={r.name}
                    type="monotone"
                    dataKey={r.name}
                    stroke={["#3b82f6", "#22c55e", "#f97316"][idx % 3]}
                    strokeWidth={3}
                    dot={{ r: 3 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Peak hours + recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {visibleRegions.map((r) => (
          <div
            key={r.name}
            className="bg-white dark:bg-gray-900/70 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-sm text-xs"
          >
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
              {r.name}
            </p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-2">
              Peak hours: {r.peakHours.join(", ")}
            </p>
            <p className="text-[11px] font-medium text-[#1f2933] dark:text-gray-100">
              Recommendation:
            </p>
            <p className="text-[11px] text-gray-600 dark:text-gray-300">
              {r.recommendation}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
