import { useState, useEffect } from 'react'
import { Dialog, Input, Toggle } from 'even-toolkit/web'
import { useTranslation } from '../../hooks/useTranslation'

interface AuthDialogProps {
  open: boolean
  domain: string
  /** Optional message shown when a previous auth attempt failed (e.g. invalid credentials). */
  error?: string
  onSubmit: (username: string, password: string, remember: boolean) => void
  onCancel: () => void
}

export function AuthDialog({ open, domain, error, onSubmit, onCancel }: AuthDialogProps) {
  const { t } = useTranslation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [submitted, setSubmitted] = useState(false)

  // Reset the "submitted" affordance whenever the dialog opens/closes.
  useEffect(() => {
    if (!open) setSubmitted(false)
  }, [open])

  const handleSubmit = () => {
    setSubmitted(true)
    if (username && password) {
      onSubmit(username, password, remember)
      setUsername('')
      setPassword('')
      setSubmitted(false)
    }
  }

  const usernameError = submitted && !username
  const passwordError = submitted && !password

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      title={t('auth.loginTo', { domain })}
      actions={[
        { label: t('auth.cancel'), onClick: onCancel },
        { label: t('auth.login'), onClick: handleSubmit },
      ]}
    >
      <div className="space-y-3">
        {error && (
          <p className="text-[13px] tracking-[-0.13px] text-negative">{error}</p>
        )}
        <Input
          placeholder={t('auth.username')}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={usernameError ? t('auth.required') : false}
        />
        <Input
          type="password"
          placeholder={t('auth.password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={passwordError ? t('auth.required') : false}
        />
        <div className="flex items-center justify-between">
          <span className="text-[13px] tracking-[-0.13px] text-text-dim">{t('auth.remember')}</span>
          <Toggle checked={remember} onChange={setRemember} />
        </div>
      </div>
    </Dialog>
  )
}
