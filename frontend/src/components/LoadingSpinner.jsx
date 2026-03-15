export default function LoadingSpinner({ message = 'Processing...', size = 'md' }) {
  const sizeClass = size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-16 h-16' : 'w-10 h-10'

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="relative">
        <div className={`${sizeClass} rounded-full border-4 border-azure-100 dark:border-azure-900`} />
        <div className={`${sizeClass} rounded-full border-4 border-t-azure-600 border-r-azure-600 border-b-transparent border-l-transparent absolute inset-0 animate-spin`} />
      </div>
      {message && (
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium animate-pulse">{message}</p>
      )}
    </div>
  )
}
