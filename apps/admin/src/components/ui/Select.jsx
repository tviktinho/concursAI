import { classNames } from './classNames.js'

export default function Select({ className = '', children, ...props }) {
  return (
    <select
      className={classNames(
        'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  )
}

