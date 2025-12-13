import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  DollarSign,
  Users,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import ModelMetricsBarChart from "../components/charts/ModelMetricsBarChart";
import ModelRadarChart from "../components/charts/ModelRadarChart";
import ModelComparisonTable from "../components/ModelComparisonTable";

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const generateRandomData = () => ({
  kpis: [
    {
      id: 1,
      title: "Total Revenue",
      value: "$" + getRandomInt(40000, 50000),
      change: "+12.5%",
      icon: DollarSign,
      color: "text-green-700",
      bgColor: "bg-green-100 dark:bg-green-900",
    },
    {
      id: 2,
      title: "New Customers",
      value: getRandomInt(2000, 3000).toString(),
      change: "+8.1%",
      icon: Users,
      color: "text-brown-600",
      bgColor: "bg-amber-100 dark:bg-amber-900",
    },
    {
      id: 3,
      title: "Active Projects",
      value: getRandomInt(40, 50).toString(),
      change: "-1.2%",
      icon: Activity,
      color: "text-magenta-600",
      bgColor: "bg-pink-100 dark:bg-pink-900",
    },
    {
      id: 4,
      title: "Avg. Order Value",
      value: "$" + getRandomInt(120, 130) + ".75",
      change: "+5.9%",
      icon: DollarSign,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900",
    },
  ],
  revenueTrend: [
    {
      name: "Jan",
      Revenue: getRandomInt(3500, 4500),
      Profit: getRandomInt(2000, 2900),
    },
    {
      name: "Feb",
      Revenue: getRandomInt(2500, 3500),
      Profit: getRandomInt(1100, 1800),
    },
    {
      name: "Mar",
      Revenue: getRandomInt(5500, 6500),
      Profit: getRandomInt(3300, 4300),
    },
    {
      name: "Apr",
      Revenue: getRandomInt(5200, 6000),
      Profit: getRandomInt(3400, 4100),
    },
    {
      name: "May",
      Revenue: getRandomInt(1600, 2200),
      Profit: getRandomInt(3900, 5000),
    },
    {
      name: "Jun",
      Revenue: getRandomInt(2000, 2600),
      Profit: getRandomInt(2600, 4200),
    },
    {
      name: "Jul",
      Revenue: getRandomInt(3000, 4010),
      Profit: getRandomInt(3300, 4300),
    },
  ],
  campaignPerformance: [
    {
      name: "Email Campaign",
      Sent: getRandomInt(3500, 4500),
      Clicked: getRandomInt(2000, 2900),
    },
    {
      name: "Social Ads",
      Sent: getRandomInt(2500, 3500),
      Clicked: getRandomInt(1100, 1800),
    },
    {
      name: "Partnership",
      Sent: getRandomInt(1500, 2500),
      Clicked: getRandomInt(700, 1300),
    },
    {
      name: "Retargeting",
      Sent: getRandomInt(2200, 3200),
      Clicked: getRandomInt(3400, 4200),
    },
  ],
  recentActivity: [
    { id: 1, text: "New lead assigned to John Doe.", time: "5 mins ago", tag: "Lead" },
    { id: 2, text: "Project Apollo budget adjusted.", time: "1 hour ago", tag: "Finance" },
    {
      id: 3,
      text: "System update completed successfully.",
      time: "4 hours ago",
      tag: "System",
    },
    { id: 4, text: "Customer feedback received.", time: "Yesterday", tag: "Support" },
  ],
});

const Card = ({ children }) => (
  <motion.div
    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"
    whileHover={{
      scale: 1.018,
      boxShadow:
        "0 10px 24px -3px rgba(0,0,0,0.12), 0 4px 12px -2px rgba(0,0,0,0.08)",
      borderColor: "#A7F3D0",
    }}
    whileTap={{ scale: 0.97 }}
    transition={{ type: "spring", stiffness: 340 }}
  >
    {children}
  </motion.div>
);

const KPICard = ({ title, value, change, icon: Icon, color, bgColor }) => {
  const isPositive = change.startsWith("+");
  const ChangeIcon = isPositive ? ArrowUpRight : ArrowDownRight;
  return (
    <motion.div
      className="flex flex-col p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 cursor-pointer"
      whileHover={{
        scale: 1.02,
        boxShadow:
          "0 10px 24px -3px rgba(0,0,0,0.13), 0 4px 12px -2px rgba(0,0,0,0.09)",
        borderColor: "#FCA311",
      }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 350 }}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </p>
        <div className={`p-2 rounded-full ${bgColor} ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-4 flex flex-col sm:flex-row sm:items-end sm:justify-between">
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          {value}
        </p>
        <div
          className={`mt-2 sm:mt-0 flex items-center text-sm font-semibold ${
            isPositive
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          <ChangeIcon className="w-4 h-4 mr-1" />
          {change}
        </div>
      </div>
    </motion.div>
  );
};

export default function Insights() {
  // fresh random dataset per mount / reload
  const [insightsData] = useState(() => generateRandomData());

  const modelMetrics = [
    {
      name: "LSTM",
      mae: 10,
      rmse: 15,
      mape: 7,
      trainingTime: 80,
      inferenceSpeed: 60,
    },
    {
      name: "RF",
      mae: 12,
      rmse: 18,
      mape: 9,
      trainingTime: 40,
      inferenceSpeed: 75,
    },
    {
      name: "ARIMA",
      mae: 14,
      rmse: 20,
      mape: 11,
      trainingTime: 30,
      inferenceSpeed: 50,
    },
  ];

  return (
    <div className="p-4 md:p-0">
      {/* Page title + subtitle */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          Insights Dashboard
        </h1>
        <p className="mt-1 text-xs md:text-sm text-gray-500 dark:text-gray-400">
          Business KPIs, campaign performance, and model health in a single unified view.
        </p>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {insightsData.kpis.map((kpi) => (
          <KPICard key={kpi.id} {...kpi} />
        ))}
      </div>

      {/* Row 1: two main charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-magenta-600 dark:text-pink-300" />
            Monthly Financial Trend
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={insightsData.revenueTrend}>
              <defs>
                {/* Teal for Revenue */}
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f766e" stopOpacity={0.85} />
                  <stop offset="95%" stopColor="#0f766e" stopOpacity={0} />
                </linearGradient>
                {/* Indigo for Profit */}
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.85} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #cbd5f5",
                  backgroundColor: "#f8fafc",
                  color: "#0f172a",
                  padding: "8px",
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="Revenue"
                stroke="#0f766e"
                fillOpacity={1}
                fill="url(#colorRevenue)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="Profit"
                stroke="#4f46e5"
                fillOpacity={1}
                fill="url(#colorProfit)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-orange-600 dark:text-orange-400" />
            Campaign Engagement
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={insightsData.campaignPerformance}
              layout="vertical"
              margin={{ top: 20, right: 20, left: 40, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" stroke="#64748b" />
              <YAxis
                dataKey="name"
                type="category"
                stroke="#64748b"
                width={120}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #cbd5f5",
                  backgroundColor: "#f8fafc",
                  color: "#0f172a",
                  padding: "8px",
                }}
              />
              <Legend wrapperStyle={{ paddingLeft: 16 }} />
              {/* Teal for Sent, Orange for Clicked */}
              <Bar dataKey="Sent" fill="#0f766e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Clicked" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Row 2: model comparison section with chip */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Model Performance Overview
            </h2>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Compare error metrics and speed across your forecasting models.
            </p>
          </div>
          <span className="hidden md:inline-flex items-center px-3 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200 border border-emerald-100 dark:border-emerald-700">
            Forecast models
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <ModelMetricsBarChart models={modelMetrics} />
          </Card>
          <Card>
            <ModelRadarChart models={modelMetrics} />
          </Card>
        </div>
        <Card>
          <ModelComparisonTable models={modelMetrics} />
        </Card>
      </div>

      {/* Recent activity full-width */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Recent Activity
        </h3>
        <ul className="divide-y divide-amber-200 dark:divide-amber-900">
          {insightsData.recentActivity.map((activity) => (
            <li
              key={activity.id}
              className="py-3 flex justify-between items-center"
            >
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 ${
                    activity.tag === "Lead"
                      ? "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300"
                      : activity.tag === "Finance"
                      ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                      : activity.tag === "System"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                  }`}
                >
                  {activity.tag}
                </span>
                {activity.text}
              </p>
              <span className="text-xs text-amber-600 dark:text-amber-200">
                {activity.time}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
