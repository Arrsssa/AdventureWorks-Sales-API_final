import { useEffect, useState } from "react";
import {
  BadgeDollarSign,
  Boxes,
  Globe2,
  PackageCheck,
  ReceiptText,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { api } from "../api/api";
import StatCard from "../components/StatCard";
import ChartCard from "../components/ChartCard";

function formatCurrency(value) {
  if (value === null || value === undefined) return "-";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatCompactCurrency(value) {
  if (value === null || value === undefined) return "-";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatNumber(value) {
  if (value === null || value === undefined) return "-";

  return new Intl.NumberFormat("en-US").format(value);
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-2xl border border-zinc-700 bg-black/95 px-4 py-3 shadow-xl">
      <p className="mb-1 text-sm font-semibold text-white">{label}</p>
      <p className="text-sm text-zinc-300">
        Sales: {formatCompactCurrency(payload[0].value)}
      </p>
    </div>
  );
}

export default function Overview() {
  const [overview, setOverview] = useState(null);
  const [health, setHealth] = useState(null);
  const [salesByYear, setSalesByYear] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOverview() {
      try {
        setLoading(true);

        const [overviewData, healthData, salesByYearData] = await Promise.all([
          api.getOverview(),
          api.health(),
          api.getSalesByYear(),
        ]);

        setOverview(overviewData);
        setHealth(healthData);
        setSalesByYear(salesByYearData);
      } catch (err) {
        setError(
          "Cannot connect to FastAPI backend. Check that uvicorn is running."
        );
      } finally {
        setLoading(false);
      }
    }

    loadOverview();
  }, []);

  if (loading) {
    return (
      <section>
        <h2 className="text-4xl font-bold text-white">Overview</h2>
        <p className="mt-2 text-zinc-500">
          Loading sales metrics from FastAPI backend...
        </p>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="h-44 animate-pulse rounded-3xl border border-zinc-800 bg-zinc-950/70"
            />
          ))}
        </div>

        <div className="mt-8 h-96 animate-pulse rounded-3xl border border-zinc-800 bg-zinc-950/70" />
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <h2 className="text-4xl font-bold text-white">Overview</h2>
        <div className="mt-8 rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
          {error}
        </div>
      </section>
    );
  }

  const cards = [
    {
      title: "Total Sales",
      value: formatCompactCurrency(overview.total_sales_amount),
      icon: BadgeDollarSign,
    },
    {
      title: "Average Sales",
      value: formatCurrency(overview.average_sales_amount),
      icon: ReceiptText,
    },
    {
      title: "Total Orders",
      value: formatNumber(overview.total_orders),
      icon: PackageCheck,
    },
    {
      title: "Total Customers",
      value: formatNumber(overview.total_customers),
      icon: Users,
    },
    {
      title: "Total Products",
      value: formatNumber(overview.total_products),
      icon: Boxes,
    },
    {
      title: "Total Regions",
      value: formatNumber(overview.total_regions),
      icon: Globe2,
    },
  ];

  return (
    <section>
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h2 className="text-4xl font-bold text-white">Overview</h2>
          <p className="mt-2 text-zinc-500">
            Key CRM sales metrics and performance overview with forecasting
            insights.
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          Backend status: {health?.status || "unknown"}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {cards.map((card) => (
          <StatCard
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
          />
        ))}
      </div>

      <div className="mt-8">
        <ChartCard
          title="Sales by Year"
          subtitle="Annual sales amount from AdventureWorks data"
        >
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesByYear}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis
                  dataKey="Fiscal Year"
                  stroke="#71717a"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  stroke="#71717a"
                  tick={{ fontSize: 12 }}
                  tickFormatter={formatCompactCurrency}
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

      <div className="glass-card mt-8 rounded-3xl p-6">
        <h3 className="text-xl font-semibold text-white">Dashboard summary</h3>
        <p className="mt-3 max-w-3xl text-zinc-500">
          This page receives live summary metrics from the FastAPI backend. The
          cards show total sales, average sales, order count, customer count,
          product count and regional coverage. The annual chart shows how sales
          changed across fiscal years.
        </p>
      </div>
    </section>
  );
}