import { Logo } from "@/components/logo";
import { WifiOff } from "lucide-react";

export function OfflineScreen() {
  return (
    <div
      className="fixed inset-0 z-50 flex h-screen w-screen flex-col items-center justify-center bg-background p-4 text-center"
      aria-label="Offline"
      role="status"
    >
      <div className="flex flex-col items-center gap-4">
        <WifiOff className="h-16 w-16 text-muted-foreground" />
        <div className="relative w-32 md:w-40 overflow-hidden">
          <Logo className="w-full" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">You are offline</h1>
        <p className="max-w-sm text-muted-foreground">
          Please check your internet connection to get the latest news from Amironews.
        </p>
      </div>
    </div>
  );
}
