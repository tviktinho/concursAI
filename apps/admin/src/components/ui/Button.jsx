import { classNames } from './classNames.js'

const VARIANTS = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500',
  secondary: 'bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-500 dark:bg-slate-100 dark:text-slate-900',
  outline: 'border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800',
  ghost: 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
}

const SIZES = {
  sm: 'px-2.5 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-3 text-base',
}

export default function Button({ as: Component = 'button', variant = 'primary', size = 'md', className = '', disabled = false, ...props }) {
  const base = 'inline-flex items-center justify-center rounded-md font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed'
  return (
    <Component
      className={classNames(base, VARIANTS[variant] || VARIANTS.primary, SIZES[size] || SIZES.md, className)}
      disabled={disabled}
      {...props}
    />
  )
}

