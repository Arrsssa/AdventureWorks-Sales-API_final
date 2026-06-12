import { motion } from "framer-motion";
import {
  BarChart3,
  BrainCircuit,
  Database,
  FileSpreadsheet,
  GitBranch,
  Layers3,
  Rocket,
  Server,
  Target,
  Users,
} from "lucide-react";

const cards = [
  {
    title: "Project Goal",
    icon: Target,
    text: "Build a CRM sales analytics dashboard for AdventureWorks data. The system helps analyze sales, customers, products and regions, and provides ML-based predictions.",
    items: [
      "Sales performance analysis",
      "Customer behavior insights",
      "Machine learning prediction",
    ],
  },
  {
    title: "Backend Stack",
    icon: Server,
    text: "The backend is built with FastAPI and provides REST API endpoints for EDA, CRM analytics and prediction.",
    items: ["FastAPI", "Pandas", "Pydantic", "Scikit-learn", "Joblib"],
  },
  {
    title: "Frontend Stack",
    icon: Layers3,
    text: "The frontend is a React dashboard that visualizes backend data in a clear and presentation-friendly interface.",
    items: ["React", "Vite", "Tailwind CSS", "Recharts", "Framer Motion"],
  },
  {
    title: "EDA Features",
    icon: BarChart3,
    text: "EDA endpoints summarize the sales dataset and show trends across time, regions, products and categories.",
    items: [
      "Monthly sales",
      "Regional sales",
      "Top products",
      "Category sales",
    ],
  },
  {
    title: "CRM Purpose",
    icon: Users,
    text: "CRM analytics helps identify valuable customers and understand what products customers buy.",
    items: [
      "Top customers",
      "Customer profile",
      "Customer-product analysis",
    ],
  },
  {
    title: "ML Models",
    icon: BrainCircuit,
    text: "The project uses machine learning models for sales amount prediction, buy/not-buy prediction and scenario analysis.",
    items: [
      "Sales regression model",
      "Buy classification model",
      "What-if scenario prediction",
    ],
  },
];

function InfoCard({ card, index }) {
  const Icon = card.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ y: -5 }}
      className="glass-card rounded-3xl p-6"
    >
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-700 bg-black/50 text-zinc-300">
          <Icon size={24} />
        </div>
        <h3 className="text-xl font-bold text-white">{card.title}</h3>
      </div>

      <p className="text-sm leading-6 text-zinc-400">{card.text}</p>

      <div className="mt-5 space-y-2">
        {card.items.map((item) => (
          <div key={item} className="flex items-center gap-2 text-sm text-zinc-400">
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
            {item}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function FlowCard({ icon: Icon, title, subtitle }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-black/40 p-5 text-center">
      <Icon className="mx-auto mb-3 text-zinc-300" />
      <h4 className="font-bold text-white">{title}</h4>
      <p className="mt-2 text-sm text-zinc-500">{subtitle}</p>
    </div>
  );
}

export default function About() {
  return (
    <section>
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h2 className="text-4xl font-bold text-white">About</h2>
          <p className="mt-2 max-w-3xl text-zinc-500">
            AdventureWorks Sales Dashboard is a full-stack educational project
            that combines FastAPI backend, EDA analysis, CRM insights, machine
            learning models and a React frontend dashboard.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-700 bg-white/5 px-4 py-3 text-sm text-zinc-300">
          Final project dashboard
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {cards.map((card, index) => (
          <InfoCard key={card.title} card={card} index={index} />
        ))}
      </div>

      <div className="glass-card mt-8 rounded-3xl p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-700 bg-black/50 text-zinc-300">
            <GitBranch size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">
              Architecture Overview
            </h3>
            <p className="text-sm text-zinc-500">
              Simplified data flow of the project.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <FlowCard
            icon={FileSpreadsheet}
            title="Excel Data"
            subtitle="AdventureWorks Sales.xlsx"
          />

          <FlowCard
            icon={Database}
            title="Data Processing"
            subtitle="Pandas cleaning and aggregation"
          />

          <FlowCard
            icon={Server}
            title="FastAPI Backend"
            subtitle="REST API, EDA and ML endpoints"
          />

          <FlowCard
            icon={Rocket}
            title="React Dashboard"
            subtitle="Interactive frontend visualization"
          />
        </div>
      </div>

      <div className="glass-card mt-8 rounded-3xl p-6">
        <h3 className="text-2xl font-bold text-white">
          Limitations and Future Improvements
        </h3>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4 text-zinc-400">
            Current predictions are baseline ML models, so they are useful for
            demonstration but can be improved with more feature engineering.
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4 text-zinc-400">
            The project currently reads data from Excel. For production, a
            database such as PostgreSQL could be added.
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4 text-zinc-400">
            Future versions can include authentication, cloud deployment,
            scheduled reports and more advanced forecasting.
          </div>
        </div>
      </div>
    </section>
  );
}