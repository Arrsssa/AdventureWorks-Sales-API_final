import { Home, Info, LineChart, Target, Users } from "lucide-react";

const menuItems = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "eda", label: "EDA", icon: LineChart },
  { id: "crm", label: "CRM", icon: Users },
  { id: "prediction", label: "Prediction", icon: Target },
  { id: "about", label: "About", icon: Info },
];

export default function Sidebar({ activePage, setActivePage }) {
  return (
    <>
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-72 flex-col border-r border-zinc-800/80 bg-black/75 px-5 py-6 shadow-2xl shadow-black/50 backdrop-blur-2xl lg:flex">
        <div className="mb-10 flex items-center gap-3">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-950 text-2xl font-black text-white shadow-lg shadow-black/40">
            A
            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/60" />
          </div>

          <div>
            <h1 className="text-lg font-bold text-white">AdventureWorks</h1>
            <p className="text-sm text-zinc-500">Sales Dashboard</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`group relative flex items-center gap-4 overflow-hidden rounded-2xl px-4 py-4 text-left transition-all duration-300 ${
                  isActive
                    ? "bg-white/10 text-white shadow-lg shadow-white/5 ring-1 ring-white/15"
                    : "text-zinc-500 hover:bg-white/5 hover:text-zinc-100"
                }`}
              >
                {isActive && (
                  <span className="absolute inset-y-2 left-0 w-1 rounded-full bg-white/80" />
                )}

                <Icon
                  size={22}
                  className={isActive ? "text-white" : "text-zinc-500"}
                />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 shadow-lg shadow-emerald-500/5">
          <div className="mb-1 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />
            <p className="font-semibold text-white">API Connected</p>
          </div>
          <p className="text-sm text-zinc-500">FastAPI Backend</p>
        </div>

        <p className="mt-6 text-xs text-zinc-700">© 2026 AdventureWorks</p>
      </aside>

      <div className="sticky top-0 z-40 border-b border-zinc-800/80 bg-black/85 px-4 py-3 backdrop-blur-2xl lg:hidden">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-white">AdventureWorks</h1>
            <p className="text-xs text-zinc-500">Sales Dashboard</p>
          </div>

          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
            API
          </div>
        </div>

        <nav className="flex gap-2 overflow-x-auto pb-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`flex shrink-0 items-center gap-2 rounded-2xl px-3 py-2 text-sm transition ${
                  isActive
                    ? "bg-white/10 text-white ring-1 ring-white/15"
                    : "bg-zinc-950/80 text-zinc-500"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}