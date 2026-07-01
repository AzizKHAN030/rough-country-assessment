type PageProgressBarProps = {
  isVisible: boolean
}

export function PageProgressBar({ isVisible }: PageProgressBarProps) {
  return (
    <div
      role={isVisible ? "progressbar" : undefined}
      aria-hidden={!isVisible}
      aria-label="Loading compatible parts"
      className="fixed top-0 left-0 z-50 h-1 w-full overflow-hidden bg-primary/15"
      style={{
        transform: isVisible ? "translateY(0)" : "translateY(-100%)",
        transition: "transform 180ms ease-in-out",
      }}
    >
      <div
        className="absolute top-0 h-full bg-primary"
        style={{
          animation:
            "progress-indeterminate-primary 2s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite",
        }}
      />
      <div
        className="absolute top-0 h-full bg-primary/80"
        style={{
          animation:
            "progress-indeterminate-secondary 2s cubic-bezier(0.165, 0.84, 0.44, 1) infinite",
        }}
      />
    </div>
  )
}
