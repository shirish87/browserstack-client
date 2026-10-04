import { cn } from "@/lib/utils";

export interface TabItem<T extends string> {
  value: T;
  label: string;
}

export function TabBar<T extends string>({
  tabs,
  value,
  onChange,
  label,
}: {
  tabs: readonly TabItem<T>[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="tablist" aria-label={label} className="flex gap-1 border-b border-border">
      {tabs.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.value)}
            className={cn(
              "-mb-px cursor-pointer border-b-2 px-3 py-2 font-semibold t-fast transition-colors",
              active ? "border-primary text-text" : "border-transparent text-muted hover:text-text",
            )}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
