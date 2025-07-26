import { Logo } from "@/components/logo";

export function SplashScreen() {
  return (
    <div
      className="splash-screen police-lights fixed inset-0 z-50 flex h-screen w-screen flex-col items-center justify-center"
      aria-label="Loading"
      role="status"
    >
      <div className="relative w-32 md:w-40 overflow-hidden">
        <Logo className="w-full" />
      </div>
      <div className="absolute top-safe-top left-0 h-1 w-full overflow-hidden">
        <div className="loading-line"></div>
      </div>
    </div>
  );
}
