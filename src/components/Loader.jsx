const Loader = ({ size = 'md', label = 'Loading...' }) => {
  const sizes = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-2',
    lg: 'w-16 h-16 border-4',
  }

  return (
    <div
      className="flex flex-col items-center justify-center gap-3"
      role="status"
      aria-label={label}
    >
      <div
        className={`${sizes[size]} rounded-full animate-spin`}
        style={{
          borderColor: 'var(--border)',
          borderTopColor: 'var(--primary)',
        }}
      />
      <span
        className="text-sm font-medium tracking-wide"
        style={{ color: 'var(--text-secondary)' }}
      >
        {label}
      </span>
    </div>
  )
}

export default Loader
