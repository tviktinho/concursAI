import { classNames } from './classNames.js'

export function Table({ children, className = '' }) {
  return (
    <div className="overflow-x-auto">
      <table className={classNames('min-w-full text-sm text-slate-700 dark:text-slate-200', className)}>{children}</table>
    </div>
  )
}

export function THead({ children }) {
  return <thead className="bg-slate-100 text-left text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800/40 dark:text-slate-400">{children}</thead>
}

export function TBody({ children }) {
  return <tbody className="divide-y divide-slate-100 dark:divide-slate-800">{children}</tbody>
}

export function TR({ children, className = '' }) {
  return <tr className={className}>{children}</tr>
}

export function TH({ children, className = '' }) {
  return <th className={classNames('px-3 py-2 font-semibold', className)}>{children}</th>
}

export function TD({ children, className = '' }) {
  return <td className={classNames('px-3 py-2 align-top', className)}>{children}</td>
}

