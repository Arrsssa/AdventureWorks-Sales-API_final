import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { api } from "../api/api";
import ChartCard from "../components/ChartCard";

function formatCurrency(value) {
  if (value === null || value === undefined) return "-";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-2xl border border-zinc-700 bg-black/95 px-4 py-3 shadow-xl">
      <p className="mb-1 text-sm font-semibold text-white">{label}</p>
      <p className="text-sm text-zinc-300">
        Sales: {formatCurrency(payload[0].value)}
      </p>
    </div>
  );
}

export default function EDA() {
  const [monthlySales, setMonthlySales] = useState([]);
  const [regionSales, setRegionSales] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [categorySales, setCategorySales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEdaData() {
      try {
        setLoading(true);

        const [monthlyData, regionData, productData, categoryData] =
          await Promise.all([
            api.getMonthlySales(),
            api.getRegionSales(),
            api.getTopProducts(10),
            api.getCategorySales(),
          ]);

        setMonthlySales(monthlyData);
        setRegionSales(regionData);
        setTopProducts(productData);
        setCategorySales(categoryData);
      } catch (err) {
        setError("Cannot load EDA data from FastAPI backend.");
      } finally {
        setLoading(false);
      }
    }

    loadEdaData();
  }, []);

  if (loading) {
    return (
      <section>
        <h2 className="text-4xl font-bold text-white">EDA</h2>
        <p className="mt-2 text-zinc-500">
          Loading exploratory sales analytics...
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-96 animate-pulse rounded-3xl border border-zinc-800 bg-zinc-950/70"
            />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <h2 className="text-4xl font-bold text-white">EDA</h2>
        <div className="mt-8 rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
          {error}
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h2 className="text-4xl font-bold text-white">EDA</h2>
          <p className="mt-2 text-zinc-500">
            Explore monthly sales, regional performance, product ranking and
            category distribution.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-700 bg-white/5 px-4 py-3 text-sm text-zinc-300">
          Live charts from FastAPI
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartCard
          title="Monthly Sales Trend"
          subtitle="Total sales amount by month"
          className="xl:col-span-2"
        >
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis
                  dataKey="MonthKey"
                  stroke="#71717a"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  stroke="#71717a"
                  tick={{ fontSize: 12 }}
                  tickFormatter={formatCurrency}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="Sales Amount"
                  stroke="#d4d4d8"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#d4d4d8" }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Sales by Region"
          subtitle="Total sales amount by region"
        >
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionSales} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis
                  type="number"
                  stroke="#71717a"
                  tick={{ fontSize: 12 }}
                  tickFormatter={formatCurrency}
                />
                <YAxis
                  type="category"
                  dataKey="Region"
                  width={120}
                  stroke="#71717a"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="Sales Amount"
                  fill="#a1a1aa"
                  radius={[0, 10, 10, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Top Products"
          subtitle="Top 10 products by sales amount"
        >
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis
                  type="number"
                  stroke="#71717a"
                  tick={{ fontSize: 12 }}
                  tickFormatter={formatCurrency}
                />
                <YAxis
                  type="category"
                  dataKey="Product"
                  width={190}
                  stroke="#71717a"
                  tick={{ fontSize: 11 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="Sales Amount"
                  fill="#d4d4d8"
                  radius={[0, 10, 10, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Sales by Category"
          subtitle="Total sales amount by product category"
          className="xl:col-span-2"
        >
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categorySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis
                  dataKey="Category"
                  stroke="#71717a"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  stroke="#71717a"
                  tick={{ fontSize: 12 }}
                  tickFormatter={formatCurrency}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="Sales Amount"
                  fill="#a1a1aa"
                  radius={[10, 10, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </section>
  );
}