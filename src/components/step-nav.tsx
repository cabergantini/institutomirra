"use client";

import { usePathname } from "next/navigation";

const STEPS = [
  { href: "/mapeamento/negociaveis", label: "Negociáveis" },
  { href: "/mapeamento/rotina", label: "Rotina semanal" },
  { href: "/mapeamento/revisao", label: "Revisão e PDF" },
];

export function StepNav() {
  const pathname = usePathname();
  const activeIndex = STEPS.findIndex((s) => pathname.startsWith(s.href));

  return (
    <ol className="flex items-center gap-2 text-sm">
      {STEPS.map((step, i) => {
        const state =
          i === activeIndex ? "active" : i < activeIndex ? "done" : "todo";
        return (
          <li key={step.href} className="flex items-center gap-2">
            {i > 0 && <span className="h-px w-6 bg-line" aria-hidden />}
            <span
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-medium ${
                state === "active"
                  ? "bg-terracotta text-cream"
                  : state === "done"
                    ? "bg-sage/15 text-sage"
                    : "bg-cream-soft text-ink-soft"
              }`}
            >
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/40 text-[10px]">
                {i + 1}
              </span>
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
