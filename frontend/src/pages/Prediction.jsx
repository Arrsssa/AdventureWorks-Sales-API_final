import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  BadgeDollarSign,
  BrainCircuit,
  Calendar,
  DollarSign,
  Globe2,
  Package,
  ShoppingBag,
  User,
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
import ChartCard from "../components/ChartCard";

const inputClass =
  "w-full rounded-2xl border border-zinc-700 bg-black/60 px-4 py-3 text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-zinc-400 focus:ring-2 focus:ring-white/10";

const labelClass =
  "mb-2 flex items-center gap-2 text-sm font-medium text-zinc-300";

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

function Field({ label, icon: Icon, children }) {
  return (
    <label className="block">
      <span className={labelClass}>
        <Icon size={17} className="text-zinc-400" />
        {label}
      </span>
      {children}
    </label>
  );
}

function ResultCard({ title, icon: Icon, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="glass-card rounded-3xl p-6"
    >
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-700 bg-black/50">
          <Icon size={24} className="text-zinc-200" />
        </div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>

      {children}
    </motion.div>
  );
}

function ScenarioTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-2xl border border-zinc-700 bg-black/95 px-4 py-3 shadow-xl">
      <p className="mb-1 text-sm font-semibold text-white">
        Scenario {label}
      </p>
      <p className="text-sm text-zinc-300">
        Prediction: {formatCurrency(payload[0].value)}
      </p>
    </div>
  );
}

export default function Prediction() {
  const [salesForm, setSalesForm] = useState({
    order_quantity: 2,
    unit_price: 1000,
    product_key: 310,
    sales_territory_key: 1,
    month_key: 202001,
  });

  const [buyForm, setBuyForm] = useState({
    customer_key: 11000,
    product_key: 310,
    sales_territory_key: 1,
    month_key: 202001,
    unit_price: 1000,
  });

  const [scenarioForm, setScenarioForm] = useState({
    unit_price: 1000,
    product_key: 310,
    sales_territory_key: 1,
    month_key: 202001,
  });

  const [salesResult, setSalesResult] = useState(null);
  const [buyResult, setBuyResult] = useState(null);
  const [scenarioResult, setScenarioResult] = useState([]);
  const [salesLoading, setSalesLoading] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);
  const [scenarioLoading, setScenarioLoading] = useState(false);
  const [error, setError] = useState("");

  function updateSalesForm(field, value) {
    setSalesForm((prev) => ({
      ...prev,
      [field]: Number(value),
    }));
  }

  function updateBuyForm(field, value) {
    setBuyForm((prev) => ({
      ...prev,
      [field]: Number(value),
    }));
  }

  function updateScenarioForm(field, value) {
    setScenarioForm((prev) => ({
      ...prev,
      [field]: Number(value),
    }));
  }

  async function handleSalesSubmit(event) {
    event.preventDefault();

    try {
      setError("");
      setSalesLoading(true);
      const result = await api.predictSales(salesForm);
      setSalesResult(result);
    } catch (err) {
      setError("Cannot get sales prediction from FastAPI backend.");
    } finally {
      setSalesLoading(false);
    }
  }

  async function handleBuySubmit(event) {
    event.preventDefault();

    try {
      setError("");
      setBuyLoading(true);
      const result = await api.predictBuy(buyForm);
      setBuyResult(result);
    } catch (err) {
      setError("Cannot get buy prediction from FastAPI backend.");
    } finally {
      setBuyLoading(false);
    }
  }

  async function handleScenarioSubmit(event) {
    event.preventDefault();

    const payload = {
      scenarios: [1, 2, 3].map((quantity) => ({
        order_quantity: quantity,
        unit_price: scenarioForm.unit_price,
        product_key: scenarioForm.product_key,
        sales_territory_key: scenarioForm.sales_territory_key,
        month_key: scenarioForm.month_key,
      })),
    };

    try {
      setError("");
      setScenarioLoading(true);
      const result = await api.predictScenario(payload);
      setScenarioResult(result.results || []);
    } catch (err) {
      setError("Cannot get scenario prediction from FastAPI backend.");
    } finally {
      setScenarioLoading(false);
    }
  }

  return (
    <section>
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h2 className="text-4xl font-bold text-white">Prediction</h2>
          <p className="mt-2 text-zinc-500">
            Use machine learning models to predict sales amount, customer
            purchase probability and what-if sales scenarios.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-700 bg-white/5 px-4 py-3 text-sm text-zinc-300">
          ML models from FastAPI
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-3xl border border-red-500/30 bg-red-500/10 p-5 text-red-200">
          {error}
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <motion.form
          onSubmit={handleSalesSubmit}
          whileHover={{ y: -4 }}
          className="glass-card rounded-3xl p-6"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-700 bg-black/50">
              <BadgeDollarSign className="text-zinc-300" size={26} />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">
                Sales Amount Prediction
              </h3>
              <p className="text-sm text-zinc-500">
                Predict expected sales amount for an order.
              </p>
            </div>
          </div>

          <div className="grid gap-5">
            <Field label="Order Quantity" icon={ShoppingBag}>
              <input
                className={inputClass}
                type="number"
                value={salesForm.order_quantity}
                onChange={(e) =>
                  updateSalesForm("order_quantity", e.target.value)
                }
              />
            </Field>

            <Field label="Unit Price" icon={DollarSign}>
              <input
                className={inputClass}
                type="number"
                value={salesForm.unit_price}
                onChange={(e) => updateSalesForm("unit_price", e.target.value)}
              />
            </Field>

            <Field label="Product Key" icon={Package}>
              <input
                className={inputClass}
                type="number"
                value={salesForm.product_key}
                onChange={(e) => updateSalesForm("product_key", e.target.value)}
              />
            </Field>

            <Field label="Sales Territory Key" icon={Globe2}>
              <input
                className={inputClass}
                type="number"
                value={salesForm.sales_territory_key}
                onChange={(e) =>
                  updateSalesForm("sales_territory_key", e.target.value)
                }
              />
            </Field>

            <Field label="Month Key" icon={Calendar}>
              <input
                className={inputClass}
                type="number"
                value={salesForm.month_key}
                onChange={(e) => updateSalesForm("month_key", e.target.value)}
              />
            </Field>
          </div>

          <button
            type="submit"
            disabled={salesLoading}
            className="mt-6 w-full rounded-2xl border border-zinc-700 bg-zinc-100 px-5 py-4 font-semibold text-black shadow-lg shadow-black/30 transition hover:scale-[1.01] hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {salesLoading ? "Predicting..." : "Predict Sales Amount"}
          </button>
        </motion.form>

        <motion.form
          onSubmit={handleBuySubmit}
          whileHover={{ y: -4 }}
          className="glass-card rounded-3xl p-6"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-700 bg-black/50">
              <BrainCircuit className="text-zinc-300" size={26} />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">
                Buy or Not Buy Prediction
              </h3>
              <p className="text-sm text-zinc-500">
                Predict whether a customer will buy a product.
              </p>
            </div>
          </div>

          <div className="grid gap-5">
            <Field label="Customer Key" icon={User}>
              <input
                className={inputClass}
                type="number"
                value={buyForm.customer_key}
                onChange={(e) => updateBuyForm("customer_key", e.target.value)}
              />
            </Field>

            <Field label="Product Key" icon={Package}>
              <input
                className={inputClass}
                type="number"
                value={buyForm.product_key}
                onChange={(e) => updateBuyForm("product_key", e.target.value)}
              />
            </Field>

            <Field label="Sales Territory Key" icon={Globe2}>
              <input
                className={inputClass}
                type="number"
                value={buyForm.sales_territory_key}
                onChange={(e) =>
                  updateBuyForm("sales_territory_key", e.target.value)
                }
              />
            </Field>

            <Field label="Month Key" icon={Calendar}>
              <input
                className={inputClass}
                type="number"
                value={buyForm.month_key}
                onChange={(e) => updateBuyForm("month_key", e.target.value)}
              />
            </Field>

            <Field label="Unit Price" icon={DollarSign}>
              <input
                className={inputClass}
                type="number"
                value={buyForm.unit_price}
                onChange={(e) => updateBuyForm("unit_price", e.target.value)}
              />
            </Field>
          </div>

          <button
            type="submit"
            disabled={buyLoading}
            className="mt-6 w-full rounded-2xl border border-zinc-700 bg-zinc-100 px-5 py-4 font-semibold text-black shadow-lg shadow-black/30 transition hover:scale-[1.01] hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {buyLoading ? "Predicting..." : "Predict Buy or Not Buy"}
          </button>
        </motion.form>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        {salesResult && (
          <ResultCard title="Predicted Sales Amount" icon={BadgeDollarSign}>
            <p className="text-5xl font-bold text-white">
              {formatCurrency(salesResult.predicted_sales_amount)}
            </p>
            <p className="mt-3 text-zinc-500">USD predicted by ML model</p>
          </ResultCard>
        )}

        {buyResult && (
          <ResultCard title="Buy or Not Buy Prediction" icon={ShoppingBag}>
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-zinc-500">Prediction</p>
                <p className="mt-2 text-4xl font-bold text-white">
                  {buyResult.prediction_label}
                </p>
              </div>

              <div className="rounded-full border border-zinc-700 bg-black/40 px-8 py-6 text-center">
                <p className="text-4xl font-bold text-white">
                  {(buyResult.buy_probability * 100).toFixed(1)}%
                </p>
                <p className="mt-1 text-sm text-zinc-500">Buy probability</p>
              </div>
            </div>
          </ResultCard>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card mt-8 rounded-3xl p-6"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-700 bg-black/50">
            <BarChart3 className="text-zinc-300" size={26} />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white">
              What-if Scenario Prediction
            </h3>
            <p className="text-sm text-zinc-500">
              Compare predicted sales for order quantities 1, 2 and 3.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleScenarioSubmit}
          className="grid grid-cols-1 gap-5 lg:grid-cols-4"
        >
          <Field label="Base Unit Price" icon={DollarSign}>
            <input
              className={inputClass}
              type="number"
              value={scenarioForm.unit_price}
              onChange={(e) => updateScenarioForm("unit_price", e.target.value)}
            />
          </Field>

          <Field label="Product Key" icon={Package}>
            <input
              className={inputClass}
              type="number"
              value={scenarioForm.product_key}
              onChange={(e) => updateScenarioForm("product_key", e.target.value)}
            />
          </Field>

          <Field label="Sales Territory Key" icon={Globe2}>
            <input
              className={inputClass}
              type="number"
              value={scenarioForm.sales_territory_key}
              onChange={(e) =>
                updateScenarioForm("sales_territory_key", e.target.value)
              }
            />
          </Field>

          <Field label="Month Key" icon={Calendar}>
            <input
              className={inputClass}
              type="number"
              value={scenarioForm.month_key}
              onChange={(e) => updateScenarioForm("month_key", e.target.value)}
            />
          </Field>

          <button
            type="submit"
            disabled={scenarioLoading}
            className="rounded-2xl border border-zinc-700 bg-zinc-100 px-5 py-4 font-semibold text-black shadow-lg shadow-black/30 transition hover:scale-[1.01] hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 lg:col-span-4"
          >
            {scenarioLoading ? "Calculating scenarios..." : "Run What-if Analysis"}
          </button>
        </form>

        {scenarioResult.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="grid gap-4 xl:col-span-1">
              {scenarioResult.map((item) => (
                <div
                  key={item.scenario_id}
                  className="rounded-2xl border border-zinc-800 bg-black/40 p-5"
                >
                  <p className="text-sm text-zinc-500">
                    Scenario {item.scenario_id}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-white">
                    {formatCurrency(item.predicted_sales_amount)}
                  </p>
                  <p className="mt-1 text-sm text-zinc-600">
                    Order quantity: {item.scenario_id}
                  </p>
                </div>
              ))}
            </div>

            <div className="xl:col-span-2">
              <ChartCard
                title="Scenario Comparison"
                subtitle="Predicted sales amount by scenario"
              >
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={scenarioResult}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                      <XAxis
                        dataKey="scenario_id"
                        stroke="#71717a"
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis
                        stroke="#71717a"
                        tick={{ fontSize: 12 }}
                        tickFormatter={formatCompactCurrency}
                      />
                      <Tooltip content={<ScenarioTooltip />} />
                      <Bar
                        dataKey="predicted_sales_amount"
                        fill="#d4d4d8"
                        radius={[10, 10, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
            </div>
          </div>
        )}
      </motion.div>
    </section>
  );
}