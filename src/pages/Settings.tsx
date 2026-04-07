import { User, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="bg-card rounded-xl border p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-2 text-card-foreground">
          <User className="h-5 w-5" />
          <h2 className="font-semibold">Company Profile</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-card-foreground">Company Name</label>
            <Input defaultValue="ECO SUDAR BIO ENERGY LLP" className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium text-card-foreground">GSTIN</label>
            <Input defaultValue="33AABCE1234F1Z5" className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium text-card-foreground">Email</label>
            <Input defaultValue="contact@ecosudar.com" className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium text-card-foreground">Phone</label>
            <Input defaultValue="+91 98765 43210" className="mt-1" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-card-foreground">Address</label>
          <Input defaultValue="Industrial Area, Chennai, Tamil Nadu 600001" className="mt-1" />
        </div>
        <Button>Save Changes</Button>
      </div>

      <div className="bg-card rounded-xl border p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-card-foreground">
          <Bell className="h-5 w-5" />
          <h2 className="font-semibold">Notifications</h2>
        </div>
        {[
          { title: "New order notifications", desc: "Get notified when a new order is placed", on: true },
          { title: "Low stock alerts", desc: "Alert when raw materials fall below threshold", on: true },
          { title: "Dealer commission updates", desc: "Weekly dealer earnings summary", on: false },
        ].map((n, i) => (
          <div key={i} className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm text-card-foreground">{n.title}</p>
              <p className="text-xs text-muted-foreground">{n.desc}</p>
            </div>
            <Switch defaultChecked={n.on} />
          </div>
        ))}
      </div>
    </div>
  );
}
