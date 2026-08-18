"use client";

type WhatNextButtonProps = {
  onClick: () => void;
};

export default function WhatNextButton({ onClick }: WhatNextButtonProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
      <button
        type="button"
        onClick={onClick}
        className="pointer-events-auto rounded-full bg-terracotta px-8 py-3.5 font-display text-base font-bold uppercase tracking-widest text-cream shadow-card transition-transform duration-150 active:scale-95"
      >
        What next?
      </button>
    </div>
  );
}
