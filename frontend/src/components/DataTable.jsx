export default function DataTable({ columns, rows }) {
  return (
    <div className="glass-card overflow-hidden rounded-3xl">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead className="bg-black/50 text-zinc-300">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="border-b border-zinc-800 px-5 py-4 font-semibold"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={`${row.CustomerKey || row.customer_key || "row"}-${
                  row.Product || row.rank || rowIndex
                }`}
                className="border-b border-zinc-800/70 text-zinc-300 transition-colors hover:bg-white/[0.03]"
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-5 py-4">
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length === 0 && (
        <div className="px-5 py-8 text-center text-zinc-500">
          No data available.
        </div>
      )}
    </div>
  );
}