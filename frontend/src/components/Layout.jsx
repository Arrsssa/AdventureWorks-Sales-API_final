import { Search } from "lucide-react";
import { motion } from "framer-motion";
import Sidebar from "./Sidebar";

export default function Layout({ activePage, setActivePage, children }) {
  return (
    <div className="app-shell min-h-screen text-zinc-100">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <main className="relative z-10 min-h-screen px-4 py-5 transition-all duration-300 lg:ml-72 lg:px-8 lg:py-6">
        <header className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex w-full max-w-xl items-center gap-3 rounded-2xl border border-zinc-800/80 bg-black/60 px-4 py-3 text-zinc-500 shadow-xl shadow-black/30 backdrop-blur-xl">
            <Search size={18} />
            <span className="truncate text-sm">
              Search metrics, reports, customers...
            </span>
            <span className="ml-auto hidden rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs text-zinc-500 sm:block">
              Ctrl K
            </span>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-300 shadow-lg shadow-emerald-500/5">
            ● API connected
          </div>
        </header>

        <motion.div
          key={activePage}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="relative z-10"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}