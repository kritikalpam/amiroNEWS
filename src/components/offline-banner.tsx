import { WifiOff } from "lucide-react";

export function OfflineBanner() {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex h-8 w-full items-center justify-center bg-destructive text-destructive-foreground"
      style={{ paddingTop: `env(safe-area-inset-top)` }}
      role="status"
    >
      <div className="flex items-center gap-2">
        <WifiOff className="h-4 w-4" />
        <p className="text-sm font-medium">You are offline</p>
      </div>
    </div>
  );
}
