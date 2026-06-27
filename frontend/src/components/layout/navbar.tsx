"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/queries/use-profile";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import { useState } from "react";

export function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");

    router.push("/login");
  };

  const { data: profile } = useProfile();
  const [open, setOpen] = useState(false);

  return (
    <header className="flex h-16 w-full items-center justify-between border-b px-4 md:px-6">
      <div className="flex items-center gap-3">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="w-64! p-0">
            <Sidebar onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>

        <span className="font-semibold md:hidden">Mini ERP</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden sm:block">{profile?.role}</span>

        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
}
