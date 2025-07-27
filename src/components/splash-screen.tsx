import { Logo } from "@/components/logo";

interface SplashScreenProps {
  isVisible: boolean;
}

export function SplashScreen({ isVisible }: SplashScreenProps) {
  return (
    <div
      className={`splash-screen police-lights fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      aria-hidden={!isVisible}
    >
      <div className="loading-line" />
      <div className="relative w-32 md:w-40 overflow-hidden animate-pulse">
        <Logo className="w-full" />
      </div>
    </div>
  );
}
