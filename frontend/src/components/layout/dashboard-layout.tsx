import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar />

        <main className="flex-1">
          <div className="mx-auto w-full px-4 py-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
