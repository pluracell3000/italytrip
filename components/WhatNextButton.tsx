"use client";

import Icon from "@/components/Icon";

type WhatNextButtonProps = {
  onClick: () => void;
};

export default function WhatNextButton({ onClick }: WhatNextButtonProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
      <button
        type="button"
        onClick={onClick}
        className="group pointer-events-auto flex min-h-14 w-full max-w-[360px] items-center gap-3 rounded-2xl border border-cream/20 bg-terracotta px-3.5 py-2.5 text-left text-cream shadow-[0_12px_32px_-8px_rgb(59_46_34/0.45)] transition hover:bg-terracotta-deep active:scale-[0.98]"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-cream/15">
          <Icon name="sparkles" className="size-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-sm font-bold leading-tight">Find my next stop</span>
          <span className="mt-0.5 block text-[11px] text-cream/90">Three picks for the weather, time and your pace</span>
        </span>
        <Icon name="chevron-right" className="size-5 transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}
