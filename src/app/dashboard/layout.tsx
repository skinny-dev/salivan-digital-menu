import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-black text-white min-h-screen" dir="rtl">
      {children}
    </div>
  );
}
