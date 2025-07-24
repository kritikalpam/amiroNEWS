import { Logo } from "@/components/logo";

export function SplashScreen() {
  return (
    <div
      className="splash-screen fixed inset-0 z-50 flex h-screen w-screen flex-col items-center justify-center animate-in fade-in-0 duration-300"
      aria-label="Loading"
      role="status"
    >
      <Logo className="w-64 md:w-80" />
    </div>
  );
}
