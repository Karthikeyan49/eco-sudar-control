import { User, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: "ECO SUDAR BIO ENERGY LLP",
    gstin: "33AABCE1234F1Z5",
    email: "contact@ecosudar.com",
    phone: "+91 98765 43210",
    address: "Industrial Area, Chennai, Tamil Nadu 600001",
  });

  const [notifications, setNotifications] = useState([
    { title: "New order notifications", desc: "Get notified when a new order is placed", on: true },
    { title: "Low stock alerts", desc: "Alert when raw materials fall below threshold", on: true },
    { title: "Dealer commission updates", desc: "Weekly dealer earnings summary", on: false },
  ]);

  const handleSave = () => {
    if (!profile.name || !profile.email) { toast.error("Company name and email are required"); return; }
    toast.success("Company profile saved successfully");
  };

  const toggleNotification = (index: number) => {
    const updated = [...notifications];
    updated[index] = { ...updated[index], on: !updated[index].on };
    setNotifications(updated);
    toast.success(`${updated[index].title} ${updated[index].on ? "enabled" : "disabled"}`);
  };

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
            <Input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium text-card-foreground">GSTIN</label>
            <Input value={profile.gstin} onChange={e => setProfile({ ...profile, gstin: e.target.value })} className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium text-card-foreground">Email</label>
            <Input value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium text-card-foreground">Phone</label>
            <Input value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} className="mt-1" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-card-foreground">Address</label>
          <Input value={profile.address} onChange={e => setProfile({ ...profile, address: e.target.value })} className="mt-1" />
        </div>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>

      <div className="bg-card rounded-xl border p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-card-foreground">
          <Bell className="h-5 w-5" />
          <h2 className="font-semibold">Notifications</h2>
        </div>
        {notifications.map((n, i) => (
          <div key={i} className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm text-card-foreground">{n.title}</p>
              <p className="text-xs text-muted-foreground">{n.desc}</p>
            </div>
            <Switch checked={n.on} onCheckedChange={() => toggleNotification(i)} />
          </div>
        ))}
      </div>
    </div>
  );
}
