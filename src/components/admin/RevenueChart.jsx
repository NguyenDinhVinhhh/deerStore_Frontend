// components/Dashboard/RevenueChart.jsx
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { formatVND } from "../../utils/formatUtils";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

export default function RevenueChart({ tab, data }) {
  const isRevenue = tab === "revenue";

  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        {isRevenue ? (
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#eee"
            />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#666", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#666", fontSize: 12 }}
              tickFormatter={(val) =>
                val >= 1000000 ? `${val / 1000000}M` : val.toLocaleString()
              }
            />
            <Tooltip
              cursor={{ fill: "#f8f9fa" }}
              formatter={(val) => [formatVND(val), "Doanh thu"]}
            />
            <Bar
              dataKey="value"
              fill="#3b82f6"
              barSize={35}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        ) : (
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={120}
              paddingAngle={5}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(1)}%`
              }
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(val) => formatVND(val)} />
            <Legend verticalAlign="middle" align="right" layout="vertical" />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
