'use client'
import { useFormStatus } from 'react-dom'

export function Submit({ children, confirm, ...props }) {
  const { pending } = useFormStatus()
  return <button {...props} disabled={pending || props.disabled}
    onClick={event => { if (confirm && !window.confirm(confirm)) event.preventDefault() }}>
    {pending ? 'Working…' : children}
  </button>
}
