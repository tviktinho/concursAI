import { useEffect } from 'react'
import Button from './Button.jsx'
import { classNames } from './classNames.js'

export default function Modal({ title, open, onClose, children, actions }) {
  useEffect(() => {
    if (!open) return
    function handleKey(event) {
      if (event.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/60" aria-hidden="true" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className={classNames('relative z-50 w-full max-w-lg rounded-lg border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900')}
      >
        <div className="flex items-start justify-between gap-4">
          {title && <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h2>}
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Fechar">
            ×
          </Button>
        </div>
        <div className="mt-4 text-sm text-slate-600 dark:text-slate-300">{children}</div>
        {actions && <div className="mt-6 flex justify-end gap-2">{actions}</div>}
      </div>
    </div>
  )
}

