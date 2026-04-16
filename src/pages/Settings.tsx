import { User, Bell, Mail, Phone, MapPin, Calculator, Fuel } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

  const [contactInfo, setContactInfo] = useState({
    email: "ecosudarbiomasspellets@gmail.com",
    phone: "+91 63799 35362",
    address: "49/D, EB Avenue, Kanchipuram, Tamil Nadu, India - 631502",
  });

  const [calculator, setCalculator] = useState({
    pelletPrice: "14",
    conversionFactor: "2.83",
    fuels: [
      { name: "LPG", unit: "/kg", defaultPrice: "85", enabled: true },
      { name: "Diesel", unit: "/L", defaultPrice: "92", enabled: true },
      { name: "Coal", unit: "/kg", defaultPrice: "12", enabled: true },
      { name: "Firewood", unit: "/kg", defaultPrice: "8", enabled: true },
    ],
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

  const handleContactSave = () => {
    if (!contactInfo.email || !contactInfo.phone || !contactInfo.address) {
      toast.error("All contact fields are required");
      return;
    }
    toast.success("Contact Us details updated — changes will reflect in the mobile app");
  };

  const handleCalcSave = () => {
    if (!calculator.pelletPrice || !calculator.conversionFactor) {
      toast.error("Pellet price and conversion factor are required");
      return;
    }
    toast.success("Savings Calculator settings updated — changes will reflect in the mobile app");
  };

  const updateFuel = (index: number, field: string, value: string | boolean) => {
    setCalculator(prev => ({
      ...prev,
      fuels: prev.fuels.map((f, i) => i === index ? { ...f, [field]: value } : f),
    }));
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
        <p className="text-muted-foreground">Manage your account, contact info, and preferences</p>
      </div>

      {/* Company Profile */}
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

      {/* Contact Us — shown in mobile app */}
      <div className="bg-card rounded-xl border p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-card-foreground">
            <Phone className="h-5 w-5" />
            <h2 className="font-semibold">Contact Us (Mobile App)</h2>
          </div>
          <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full">Shown in app</span>
        </div>
        <p className="text-xs text-muted-foreground -mt-3">These details are displayed in the "Contact Us" section of the mobile app.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-card-foreground flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" /> Email Address
            </label>
            <Input value={contactInfo.email} onChange={e => setContactInfo({ ...contactInfo, email: e.target.value })} className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium text-card-foreground flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-muted-foreground" /> Phone Number
            </label>
            <Input value={contactInfo.phone} onChange={e => setContactInfo({ ...contactInfo, phone: e.target.value })} className="mt-1" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-card-foreground flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground" /> Office Address
          </label>
          <Textarea value={contactInfo.address} onChange={e => setContactInfo({ ...contactInfo, address: e.target.value })} className="mt-1" rows={2} />
        </div>
        <Button onClick={handleContactSave}>Update Contact Info</Button>
      </div>

      {/* Savings Calculator Config */}
      <div className="bg-card rounded-xl border p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-card-foreground">
            <Calculator className="h-5 w-5" />
            <h2 className="font-semibold">Savings Calculator (Mobile App)</h2>
          </div>
          <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full">Shown in app</span>
        </div>
        <p className="text-xs text-muted-foreground -mt-3">Configure default prices and fuel options for the Savings Calculator in the mobile app.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-card-foreground">Biomass Pellet Price (₹/kg)</label>
            <Input type="number" value={calculator.pelletPrice} onChange={e => setCalculator(prev => ({ ...prev, pelletPrice: e.target.value }))} className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium text-card-foreground">Conversion Factor (pellet kg per fuel kg)</label>
            <Input type="number" step="0.01" value={calculator.conversionFactor} onChange={e => setCalculator(prev => ({ ...prev, conversionFactor: e.target.value }))} className="mt-1" />
            <p className="text-xs text-muted-foreground mt-1">e.g. 2.83 means 100kg LPG ≈ 283kg pellets</p>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-card-foreground mb-3 block">Fuel Types & Default Prices</label>
          <div className="space-y-3">
            {calculator.fuels.map((fuel, i) => (
              <div key={fuel.name} className="flex items-center gap-3 bg-muted/20 rounded-lg p-3">
                <Switch checked={fuel.enabled} onCheckedChange={v => updateFuel(i, "enabled", v)} />
                <div className="flex-1 grid grid-cols-3 gap-3 items-center">
                  <span className={`text-sm font-medium ${fuel.enabled ? "text-card-foreground" : "text-muted-foreground"}`}>{fuel.name}</span>
                  <div>
                    <Input
                      type="number"
                      value={fuel.defaultPrice}
                      onChange={e => updateFuel(i, "defaultPrice", e.target.value)}
                      className="h-8 text-sm"
                      disabled={!fuel.enabled}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">₹{fuel.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Button onClick={handleCalcSave}>Update Calculator Settings</Button>
      </div>

      {/* Notifications */}
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
