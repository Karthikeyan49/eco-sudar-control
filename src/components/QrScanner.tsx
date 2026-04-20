import { useEffect, useRef, useState } from "react";
import { Camera, CameraOff, Keyboard } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  onScan: (token: string) => void;
  /** Disable scanner from auto-firing while parent processes a result */
  busy?: boolean;
}

export function QrScanner({ onScan, busy }: Props) {
  const containerId = "qr-scanner-region";
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manual, setManual] = useState("");
  const lastFiredRef = useRef<{ token: string; at: number }>({ token: "", at: 0 });

  const stop = async () => {
    try { await scannerRef.current?.stop(); } catch { /* ignore */ }
    try { await scannerRef.current?.clear(); } catch { /* ignore */ }
    scannerRef.current = null;
    setActive(false);
  };

  const start = async () => {
    setError(null);
    try {
      const inst = new Html5Qrcode(containerId);
      scannerRef.current = inst;
      await inst.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (decoded) => {
          const now = Date.now();
          if (busy) return;
          if (decoded === lastFiredRef.current.token && now - lastFiredRef.current.at < 2500) return;
          lastFiredRef.current = { token: decoded, at: now };
          onScan(decoded);
        },
        () => undefined,
      );
      setActive(true);
    } catch (e: any) {
      setError(e?.message ?? "Camera unavailable");
      setActive(false);
    }
  };

  useEffect(() => () => { stop(); }, []);

  return (
    <div className="space-y-3">
      <div id={containerId} className="rounded-lg overflow-hidden border bg-muted/40 aspect-square max-w-sm mx-auto" />
      {error && <p className="text-xs text-destructive text-center">{error}</p>}
      <div className="flex gap-2 justify-center">
        {!active
          ? <Button onClick={start} size="sm"><Camera className="h-4 w-4" /> Start camera</Button>
          : <Button onClick={stop} size="sm" variant="outline"><CameraOff className="h-4 w-4" /> Stop</Button>}
      </div>
      <div className="border-t pt-3">
        <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1"><Keyboard className="h-3 w-3" /> Or enter token manually</p>
        <div className="flex gap-2">
          <Input placeholder="ESD-XX-000-XXXX" value={manual} onChange={(e) => setManual(e.target.value)} />
          <Button size="sm" disabled={!manual.trim() || busy} onClick={() => { onScan(manual.trim()); setManual(""); }}>Submit</Button>
        </div>
      </div>
    </div>
  );
}
