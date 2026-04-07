import { Search, Bell, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function TopNavbar() {
  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="lg:hidden" />
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products, orders..."
            className="pl-10 w-72 bg-background border-border"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-destructive rounded-full" />
        </button>
        <button className="p-2 rounded-lg hover:bg-muted transition-colors">
          <User className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
}
