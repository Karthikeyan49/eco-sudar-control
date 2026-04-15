import { Bell, LogOut, ShoppingCart, Truck, AlertTriangle, UserCheck, RefreshCcw } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface Notification {
  id: number;
  icon: React.ElementType;
  iconColor: string;
  message: string;
  time: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  { id: 1, icon: ShoppingCart, iconColor: "text-primary", message: "New order ORD-2024-157 received from Ravi Kumar", time: "2 min ago", read: false },
  { id: 2, icon: Truck, iconColor: "text-status-shipped", message: "Order ORD-2024-154 marked as Delivered", time: "1 hr ago", read: false },
  { id: 3, icon: AlertTriangle, iconColor: "text-status-processing", message: "Low stock alert: Pellets 6mm — 45 kg remaining", time: "3 hrs ago", read: false },
  { id: 4, icon: UserCheck, iconColor: "text-status-confirmed", message: "Dealer Arun Logistics placed a new order", time: "Yesterday", read: false },
  { id: 5, icon: RefreshCcw, iconColor: "text-status-returned", message: "Refund processed for ORD-2024-148", time: "Yesterday", read: true },
];

export function TopNavbar() {
  const { logout, adminEmail } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="lg:hidden" />
      </div>
      <div className="flex items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell className="h-5 w-5 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4.5 w-4.5 min-w-[18px] flex items-center justify-center bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full px-1">
                  {unreadCount}
                </span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h4 className="text-sm font-semibold text-card-foreground">Notifications</h4>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" className="text-xs h-7" onClick={markAllRead}>Mark all as read</Button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.map(n => (
                <div key={n.id} className={`flex items-start gap-3 px-4 py-3 border-b last:border-0 transition-colors ${!n.read ? "bg-muted/30" : ""}`}>
                  <div className="pt-0.5"><n.icon className={`h-4 w-4 ${n.iconColor}`} /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-card-foreground leading-snug">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                  </div>
                  {!n.read && <span className="h-2 w-2 bg-primary rounded-full mt-1.5 shrink-0" />}
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        <span className="text-sm text-muted-foreground hidden md:inline">{adminEmail}</span>
        <button
          onClick={handleLogout}
          className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
          title="Logout"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
