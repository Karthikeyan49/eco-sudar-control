import { useEffect, useRef, useState } from "react";
import { Camera, CameraOff, Keyboard, X } from "lucide-react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  onScan: (token: string) => void;
  /** Disable scanner from auto-firing while parent processes a result */
  busy?: boolean;
  /** Render scanner as a fixed full-viewport overlay */
  fullscreen?: boolean;
  /** Called when user clicks the X close button (only used when fullscreen) */
  onClose?: () => void;
}

export function QrScanner({ onScan, busy, fullscreen, onClose }: Props) {
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
      const inst = new Html5Qrcode(containerId, {
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        verbose: false,
      });
      scannerRef.current = inst;
      const minDim = Math.min(window.innerWidth, window.innerHeight);
      const box = Math.max(240, Math.floor(minDim * 0.75));
      await inst.start(
        { facingMode: "environment" },
        { fps: 15, qrbox: { width: box, height: box }, aspectRatio: 1.0, disableFlip: false },
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

  // Auto-start when full-screen
  useEffect(() => {
    if (fullscreen) start();
    return () => { stop(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullscreen]);

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 text-white">
          <div>
            <p className="font-semibold">Scan Employee QR</p>
            <p className="text-xs text-white/70">Hold the QR steady inside the frame</p>
          </div>
          <Button size="icon" variant="ghost" className="text-white hover:bg-white/10" onClick={() => { stop(); onClose?.(); }}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        <div className="flex-1 relative">
          <div id={containerId} className="absolute inset-0 [&>video]:!w-full [&>video]:!h-full [&>video]:!object-cover" />
        </div>
        {error && <p className="text-xs text-destructive text-center bg-black/60 py-2">{error}</p>}
        <div className="bg-black/80 px-4 py-3 space-y-2">
          <div className="flex items-center gap-2 text-white/80 text-xs"><Keyboard className="h-3 w-3" /> Or enter token manually</div>
          <div className="flex gap-2">
            <Input className="bg-white" placeholder="ESD-XX-000-XXXX" value={manual} onChange={(e) => setManual(e.target.value)} />
            <Button size="sm" disabled={!manual.trim() || busy} onClick={() => { onScan(manual.trim()); setManual(""); }}>Submit</Button>
          </div>
        </div>
      </div>
    );
  }

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
