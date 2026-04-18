import { quickLinks } from '../../data/quick-links'
import { Card } from 'even-toolkit/web'

interface QuickLinksProps {
  onNavigate: (url: string) => void
}

export function QuickLinks({ onNavigate }: QuickLinksProps) {
  return (
    <div className="grid grid-cols-2 gap-3 mt-3">
      {quickLinks.map((link) => (
        <Card
          key={link.url}
          variant="interactive"
          padding="sm"
          className="cursor-pointer"
          onClick={() => onNavigate(link.url)}
        >
          <div className="text-[15px] tracking-[-0.15px] font-normal text-text">{link.label}</div>
          <div className="text-[13px] tracking-[-0.13px] text-text-dim mt-0.5">{link.description}</div>
        </Card>
      ))}
    </div>
  )
}
