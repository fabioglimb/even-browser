/**
 * Shared action button bar for G2 glasses display.
 *
 * Renders a row of named buttons with triangle indicators:
 *   ▶Timer◀  Scroll  ▷Steps◁
 *
 * - Selected button (in button-select mode): solid triangles ▶Name◀
 * - Active button (mode entered): blinking triangles ▶Name◀ / ▷Name◁
 * - Inactive button: plain  Name
 */
/**
 * Build an action bar string from a list of button names.
 *
 * @param buttons   Array of button label strings, e.g. ['Timer', 'Scroll', 'Steps']
 * @param selectedIndex  Index of the currently highlighted button (in button-select mode)
 * @param activeLabel    Label of the currently active mode button (e.g. 'Scroll'), or null if in button-select mode
 * @param flashPhase     Current blink phase (true = filled triangles, false = empty)
 */
export declare function buildActionBar(buttons: string[], selectedIndex: number, activeLabel: string | null, flashPhase: boolean): string;
/**
 * Build a static action bar (no blinking, always solid triangles on selected).
 * Useful for screens like recipe detail or completion where there's no mode switching.
 */
export declare function buildStaticActionBar(buttons: string[], selectedIndex: number): string;
//# sourceMappingURL=action-bar.d.ts.map