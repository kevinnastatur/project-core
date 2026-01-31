"use client";

type LoadingOverlayProps = {
  show?: boolean;
};

export default function LoadingOverlay({ show = false }: LoadingOverlayProps) {
  if (!show) return null;

  return (
    <div
      className="
    fixed inset-0
    bg-black/30
    backdrop-blur-xs
    flex items-center justify-center
    z-50
  "
    >
      <div className="loader" />
    </div>
  );
}
