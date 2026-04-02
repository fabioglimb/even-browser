import { useState } from 'react'
import { Dialog, Input, Toggle } from 'even-toolkit/web'

interface AuthDialogProps {
  open: boolean
  domain: string
  onSubmit: (username: string, password: string, remember: boolean) => void
  onCancel: () => void
}

export function AuthDialog({ open, domain, onSubmit, onCancel }: AuthDialogProps) {
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
      title={`Login to ${domain}`}
      actions={[
        { label: 'Cancel', onClick: onCancel },
        { label: 'Login', onClick: handleSubmit },
      ]}
    >
      <div className="space-y-3">
        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex items-center justify-between">
          <span className="text-[13px] tracking-[-0.13px] text-text-dim">Remember credentials</span>
          <Toggle checked={remember} onChange={setRemember} />
        </div>
      </div>
    </Dialog>
  )
}
