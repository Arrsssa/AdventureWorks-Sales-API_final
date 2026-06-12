import { motion } from "framer-motion";

export default function ChartCard({ title, subtitle, children, className = "" }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 180, damping: 18 }}
      className={`glass-card rounded-3xl p-6 ${className}`}
    >
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {subtitle && (
            <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
          )}
        </div>

        <div className="hidden rounded-full border border-zinc-800 bg-black/40 px-3 py-1 text-xs text-zinc-500 sm:block">
          Recharts
        </div>
      </div>

      {children}
    </motion.div>
  );
}