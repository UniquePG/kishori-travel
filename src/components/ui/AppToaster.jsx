"use client";

import { Toaster } from "sonner";

export default function AppToaster() {
  return (
    <Toaster
      position="top-center"
      richColors
      closeButton
      duration={4200}
      offset="5.5rem"
      gap={12}
      toastOptions={{
        classNames: {
          toast:
            "rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-300/30 font-sans text-[15px]",
          title: "font-semibold text-slate-900",
          description: "text-slate-600 text-sm",
          closeButton:
            "left-auto right-3 top-3 border-0 bg-transparent text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg",
        },
      }}
    />
  );
}
