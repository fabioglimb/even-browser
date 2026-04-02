import { useState } from 'react'
import { Dialog, Input, Toggle } from 'even-toolkit/web'
import { useTranslation } from '../../hooks/useTranslation'

interface AuthDialogProps {
  open: boolean
  domain: string
  onSubmit: (username: string, password: string, remember: boolean) => void
  onCancel: () => void
}

export function AuthDialog({ open, domain, onSubmit, onCancel }: AuthDialogProps) {
  const { t } = useTranslation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)

  const handleSubmit = () => {
    if (username && password) {
      onSubmit(username, password, remember)
      setUsername('')
      setPassword('')
    }
  }

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
        <Input
          placeholder={t('auth.username')}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="password"
          placeholder={t('auth.password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex items-center justify-between">
          <span className="text-[13px] tracking-[-0.13px] text-text-dim">{t('auth.remember')}</span>
          <Toggle checked={remember} onChange={setRemember} />
        </div>
      </div>
    </Dialog>
  )
}
