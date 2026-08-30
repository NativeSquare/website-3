/* NativeSquare mark: 3×3 grid of rounded squares, ink (#060504), opacity
   cascade flowing from full (top-left) to faint (bottom-right) along the
   anti-diagonals:
     1.00  .80  .55
      .80  .55  .32
      .55  .32  .16 */
export default function NsMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="#060504">
        <rect x="0" y="0" width="12" height="12" rx="3.6" />
        <rect x="18" y="0" width="12" height="12" rx="3.6" opacity=".8" />
        <rect x="36" y="0" width="12" height="12" rx="3.6" opacity=".55" />
        <rect x="0" y="18" width="12" height="12" rx="3.6" opacity=".8" />
        <rect x="18" y="18" width="12" height="12" rx="3.6" opacity=".55" />
        <rect x="36" y="18" width="12" height="12" rx="3.6" opacity=".32" />
        <rect x="0" y="36" width="12" height="12" rx="3.6" opacity=".55" />
        <rect x="18" y="36" width="12" height="12" rx="3.6" opacity=".32" />
        <rect x="36" y="36" width="12" height="12" rx="3.6" opacity=".16" />
      </g>
    </svg>
  );
}
