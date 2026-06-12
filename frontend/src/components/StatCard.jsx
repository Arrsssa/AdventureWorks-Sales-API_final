import { motion } from "framer-motion";

export default function StatCard({ title, value, icon: Icon }) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.015 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className="glass-card group rounded-3xl p-6"
    >
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-700/80 bg-black/50 text-zinc-200 transition group-hover:border-zinc-500 group-hover:text-white">
        <Icon size={24} />
      </div>

      <p className="text-sm font-medium text-zinc-500">{title}</p>
      <p className="mt-3 text-3xl font-bold tracking-tight text-white">
        {value}
      </p>

      <div className="mt-5 inline-flex rounded-full border border-zinc-800 bg-black/40 px-3 py-1 text-xs text-zinc-500">
        Live data from API
      </div>
    </motion.div>
  );
}