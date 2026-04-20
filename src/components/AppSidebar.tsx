import {
  LayoutDashboard,
  Store,
  Users,
  ShoppingCart,
  Package,
  FileText,
  Settings,
  ChevronLeft,
  UserCheck,
  MessageSquare,
  HelpCircle,
  Calculator,
  Wallet,
  LineChart,
  Receipt,
  FileBarChart2,
  Contact2,
  ClipboardCheck,
  BadgeIndianRupee,
  ListTodo,
  CalendarClock,
  BookOpen,
  GitBranch,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import logo from "@/assets/eco-sudar-logo.png";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Products", url: "/products", icon: Store },
  { title: "Orders", url: "/orders", icon: ShoppingCart },
  { title: "Customers", url: "/customers", icon: Users },
  { title: "Dealer Network", url: "/dealers", icon: UserCheck },
  { title: "Invoices", url: "/invoices", icon: FileText },
  { title: "Expenses", url: "/expenses", icon: Wallet },
  { title: "Profit & Loss", url: "/finance", icon: LineChart },
  { title: "GST Invoicing", url: "/gst-invoicing", icon: Receipt },
  { title: "Reports", url: "/reports", icon: FileBarChart2 },
  { title: "Employees", url: "/employees", icon: Contact2 },
  { title: "Attendance", url: "/attendance", icon: ClipboardCheck },
  { title: "Payroll", url: "/payroll", icon: BadgeIndianRupee },
  { title: "Tasks", url: "/tasks", icon: ListTodo },
  { title: "Meetings", url: "/meetings", icon: CalendarClock },
  { title: "SOPs", url: "/sops", icon: BookOpen },
  { title: "Workflows", url: "/workflows", icon: GitBranch },
  { title: "Queries", url: "/queries", icon: MessageSquare },
  { title: "Quote Requests", url: "/quote-requests", icon: Calculator },
  { title: "FAQ Management", url: "/faq", icon: HelpCircle },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <div className="flex items-center gap-3 px-4 py-5">
        <img src={logo} alt="Eco Sudar" className="h-9 w-9 rounded-md" />
        {!collapsed && (
          <div>
            <h1 className="text-sm font-bold text-sidebar-primary-foreground tracking-wide">ECO SUDAR</h1>
            <p className="text-xs text-sidebar-foreground/60">Bio Energy LLP</p>
          </div>
        )}
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const active = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={active}>
                      <NavLink
                        to={item.url}
                        end
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/80 hover:bg-sidebar-accent transition-colors"
                        activeClassName="bg-sidebar-primary text-sidebar-primary-foreground font-medium hover:bg-sidebar-primary"
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <button
          onClick={toggleSidebar}
          className="flex items-center gap-2 px-4 py-3 text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
        >
          <ChevronLeft className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
          {!collapsed && <span>Collapse</span>}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
