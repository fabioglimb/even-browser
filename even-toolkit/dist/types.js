// ── Display line types (legacy, still used for single-text pages) ──
export function line(text, style = 'normal', inverted = false) {
    return { text, inverted, style };
}
export function separator() {
    return { text: '', inverted: false, style: 'separator' };
}
//# sourceMappingURL=types.js.map