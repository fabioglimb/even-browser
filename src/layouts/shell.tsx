import { DrawerShell } from 'even-toolkit/web';
import type { SideDrawerItem } from 'even-toolkit/web';

const MENU_ITEMS: SideDrawerItem[] = [
  { id: '/', label: 'Home', section: 'Browser' },
];

const BOTTOM_ITEMS: SideDrawerItem[] = [
  { id: '/settings', label: 'Settings', section: 'App' },
];

function getPageTitle(pathname: string): string {
  if (pathname === '/') return 'EvenBrowser';
  if (pathname === '/browse') return 'Browse';
  if (pathname === '/settings') return 'Settings';
  return 'Browser';
}

function deriveActiveId(pathname: string): string {
  if (pathname === '/') return '/';
  if (pathname === '/browse') return '/browse';
  if (pathname === '/settings') return '/settings';
  return '/';
}

export function Shell() {
  return (
    <DrawerShell
      items={MENU_ITEMS}
      bottomItems={BOTTOM_ITEMS}
      title="EvenBrowser"
      getPageTitle={getPageTitle}
      deriveActiveId={deriveActiveId}
    />
  );
}
