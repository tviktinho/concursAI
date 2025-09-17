import { classNames } from './classNames.js'

export default function Card({ title, description, actions = null, children, className = '' }) {
  return (
    <div className={classNames('rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900', className)}>
      {(title || description || actions) && (
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            {title && <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3>}
            {description && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={classNames(title || description || actions ? 'mt-4' : '')}>{children}</div>
    </div>
  )
}

