export function OfflineBanner() {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex h-8 w-full items-center justify-center bg-destructive text-destructive-foreground"
      style={{ paddingTop: `env(safe-area-inset-top)` }}
      role="status"
    >
      <p className="animate-flash text-sm font-semibold tracking-wider">OFFLINE</p>
    </div>
  );
}
