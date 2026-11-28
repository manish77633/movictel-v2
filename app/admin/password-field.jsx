'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export function PasswordField() {
  const [visible, setVisible] = useState(false)
  const Icon = visible ? EyeOff : Eye
  return <div className="admin-password-field">
    <label htmlFor="admin-password">Admin password</label>
    <div className="admin-password-input">
      <input id="admin-password" name="password" type={visible ? 'text' : 'password'} autoComplete="current-password" required/>
      <button type="button" aria-label={visible ? 'Hide password' : 'Show password'} aria-controls="admin-password"
        onClick={() => setVisible(value => !value)}><Icon size={18} aria-hidden="true"/></button>
    </div>
  </div>
}
