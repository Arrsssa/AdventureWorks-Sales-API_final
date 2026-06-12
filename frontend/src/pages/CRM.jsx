import { useEffect, useState } from "react";
import {
  BadgeDollarSign,
  Boxes,
  ReceiptText,
  Search,
  ShoppingBag,
  Trophy,
  UserRound,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { api } from "../api/api";
import DataTable from "../components/DataTable";
import StatCard from "../components/StatCard";

function formatCurrency(value) {
  if (value === null || value === undefined) return "-";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatFullCurrency(value) {
  if (value === null || value === undefined) return "-";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatNumber(value) {
  if (value === null || value === undefined) return "-";

  return new Intl.NumberFormat("en-US").format(value);
}

const inputClass =
  "w-full rounded-2xl border border-zinc-700 bg-black/60 px-4 py-3 text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-zinc-400 focus:ring-2 focus:ring-white/10";

function ProfileMetric({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
      <div className="mb-3 flex items-center gap-2">
        <Icon size={18} className="text-zinc-400" />
        <p className="text-sm text-zinc-500">{label}</p>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

export default function CRM() {
  const [topCustomers, setTopCustomers] = useState([]);
  const [customerProducts, setCustomerProducts] = useState([]);
  const [customerKey, setCustomerKey] = useState(12301);
  const [customerSummary, setCustomerSummary] = useState(null);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [customerError, setCustomerError] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCrmData() {
      try {
        setLoading(true);

        const [topCustomersData, customerProductsData] = await Promise.all([
          api.getTopCustomers(10),
          api.getCustomerProductAnalysis(20),
        ]);

        setTopCustomers(topCustomersData);
        setCustomerProducts(customerProductsData);
      } catch (err) {
        setError("Cannot load CRM data from FastAPI backend.");
      } finally {
        setLoading(false);
      }
    }

    loadCrmData();
  }, []);

  async function handleCustomerSummarySubmit(event) {
    event.preventDefault();

    try {
      setCustomerLoading(true);
      setCustomerError("");
      setCustomerSummary(null);

      const result = await api.getCustomerSummary(customerKey);
      setCustomerSummary(result);
    } catch (err) {
      setCustomerError("Customer not found.");
    } finally {
      setCustomerLoading(false);
    }
  }

  if (loading) {
    return (
      <section>
        <h2 className="text-4xl font-bold text-white">CRM</h2>
        <p className="mt-2 text-zinc-500">Loading customer analytics...</p>

        <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-44 animate-pulse rounded-3xl border border-zinc-800 bg-zinc-950/70"
            />
          ))}
        </div>

        <div className="mt-6 h-96 animate-pulse rounded-3xl border border-zinc-800 bg-zinc-950/70" />
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <h2 className="text-4xl font-bold text-white">CRM</h2>
        <div className="mt-8 rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
          {error}
        </div>
      </section>
    );
  }

  const totalTopCustomerSales = topCustomers.reduce(
    (sum, item) => sum + Number(item["Sales Amount"] || 0),
    0
  );

  const bestCustomer = topCustomers[0];

  const uniqueCustomers = new Set(
    customerProducts.map((item) => item.CustomerKey)
  ).size;

  const totalQuantity = customerProducts.reduce(
    (sum, item) => sum + Number(item["Order Quantity"] || 0),
    0
  );

  const topCustomerColumns = [
    {
      key: "rank",
      label: "#",
      render: (_, row) => row.rank,
    },
    {
      key: "CustomerKey",
      label: "Customer Key",
    },
    {
      key: "Sales Amount",
      label: "Sales Amount",
      render: (value) => (
        <span className="font-semibold text-zinc-100">
          {formatFullCurrency(value)}
        </span>
      ),
    },
  ];

  const rankedTopCustomers = topCustomers.map((customer, index) => ({
    ...customer,
    rank: index + 1,
  }));

  const customerProductColumns = [
    {
      key: "CustomerKey",
      label: "Customer Key",
    },
    {
      key: "Product",
      label: "Product",
    },
    {
      key: "Category",
      label: "Category",
    },
    {
      key: "Order Quantity",
      label: "Order Quantity",
      render: (value) => formatNumber(value),
    },
    {
      key: "Sales Amount",
      label: "Sales Amount",
      render: (value) => (
        <span className="font-semibold text-zinc-100">
          {formatFullCurrency(value)}
        </span>
      ),
    },
  ];

  return (
    <section>
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h2 className="text-4xl font-bold text-white">CRM</h2>
          <p className="mt-2 text-zinc-500">
            Customer-focused analytics: top customers, customer-product behavior
            and individual CRM profile.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-700 bg-white/5 px-4 py-3 text-sm text-zinc-300">
          Customer analytics from FastAPI
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Top 10 Sales"
          value={formatCurrency(totalTopCustomerSales)}
          icon={ReceiptText}
        />

        <StatCard
          title="Best Customer"
          value={bestCustomer ? String(bestCustomer.CustomerKey) : "-"}
          icon={Trophy}
        />

        <StatCard
          title="Analyzed Customers"
          value={formatNumber(uniqueCustomers)}
          icon={Users}
        />

        <StatCard
          title="Total Quantity"
          value={formatNumber(totalQuantity)}
          icon={ShoppingBag}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card mt-8 rounded-3xl p-6"
      >
        <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-700 bg-black/50">
                <UserRound className="text-zinc-300" size={26} />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white">
                  Customer CRM Profile
                </h3>
                <p className="text-sm text-zinc-500">
                  Search customer profile by Customer Key.
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleCustomerSummarySubmit}
            className="flex w-full flex-col gap-3 md:w-auto md:flex-row"
          >
            <input
              className={`${inputClass} md:w-52`}
              type="number"
              value={customerKey}
              onChange={(event) => setCustomerKey(Number(event.target.value))}
              placeholder="Customer Key"
            />

            <button
              type="submit"
              disabled={customerLoading}
              className="rounded-2xl border border-zinc-700 bg-zinc-100 px-5 py-3 font-semibold text-black shadow-lg shadow-black/30 transition hover:bg-white hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="flex items-center justify-center gap-2">
                <Search size={18} />
                {customerLoading ? "Searching..." : "Find Customer"}
              </span>
            </button>
          </form>
        </div>

        {customerError && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
            {customerError}
          </div>
        )}

        {customerSummary && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5"
          >
            <ProfileMetric
              label="Customer Key"
              value={customerSummary.customer_key}
              icon={UserRound}
            />
            <ProfileMetric
              label="Total Sales"
              value={formatFullCurrency(customerSummary.total_sales_amount)}
              icon={BadgeDollarSign}
            />
            <ProfileMetric
              label="Order Quantity"
              value={formatNumber(customerSummary.total_order_quantity)}
              icon={ShoppingBag}
            />
            <ProfileMetric
              label="Unique Products"
              value={formatNumber(customerSummary.unique_products)}
              icon={Boxes}
            />
            <ProfileMetric
              label="Top Category"
              value={customerSummary.top_category || "-"}
              icon={Trophy}
            />
          </motion.div>
        )}
      </motion.div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-1">
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-white">
              Top Customers Ranking
            </h3>
            <p className="mt-1 text-zinc-500">
              Ranked customers by total sales amount.
            </p>
          </div>

          <DataTable columns={topCustomerColumns} rows={rankedTopCustomers} />
        </div>

        <div className="xl:col-span-2">
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-white">
              Customer-Product Analysis
            </h3>
            <p className="mt-1 text-zinc-500">
              Products purchased by customers with category, quantity and sales
              amount.
            </p>
          </div>

          <DataTable columns={customerProductColumns} rows={customerProducts} />
        </div>
      </div>

      <div className="glass-card mt-8 rounded-3xl p-6">
        <h3 className="text-xl font-bold text-white">CRM interpretation</h3>
        <p className="mt-3 max-w-4xl text-zinc-500">
          The CRM section combines customer ranking, individual customer profile
          search and customer-product analysis. This makes the dashboard closer
          to a real CRM analytics tool.
        </p>
      </div>
    </section>
  );
}