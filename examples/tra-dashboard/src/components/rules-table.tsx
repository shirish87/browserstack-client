import { StatusBadge } from "@/components/status";
import { displayValue, humanize } from "@/lib/utils";

/** Quality gate rules: TRA doesn't fix their columns, so the table shows whichever keys the rules carry. */
export function RulesTable({ rules }: { rules: Record<string, unknown>[] }) {
  const columns = [...new Set(rules.flatMap((r) => Object.keys(r)))];
  if (columns.length === 0) return <p className="px-5 py-3 text-muted">No rules.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="border-y border-border bg-surface-2 text-[13px] text-muted">
          <tr>{columns.map((c) => <th key={c} scope="col" className="px-5 py-2 font-medium">{humanize(c)}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rules.map((r, i) => (
            <tr key={i}>
              {columns.map((c) => (
                <td key={c} className="px-5 py-2">
                  {c.toLowerCase() === "result" ? <StatusBadge status={displayValue(r[c])} /> : displayValue(r[c])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
