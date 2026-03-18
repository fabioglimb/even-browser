export type LineStyle = 'normal' | 'meta' | 'separator' | 'inverted';
export interface DisplayLine {
    text: string;
    inverted: boolean;
    style: LineStyle;
}
export interface DisplayData {
    lines: DisplayLine[];
}
export declare function line(text: string, style?: LineStyle, inverted?: boolean): DisplayLine;
export declare function separator(): DisplayLine;
export interface ColumnData {
    /** One string per column — each column is a separate text container at a fixed pixel position */
    columns: string[];
}
export interface ImageTileData {
    tiles: {
        id: number;
        name: string;
        bytes: Uint8Array;
    }[];
    /** Text shown below images (or empty for no-bounce overlay) */
    text?: string;
}
export type PageMode = 'splash' | 'text' | 'columns' | 'home' | 'chart';
export type GlassActionType = 'HIGHLIGHT_MOVE' | 'SELECT_HIGHLIGHTED' | 'GO_BACK';
export type GlassAction = {
    type: 'HIGHLIGHT_MOVE';
    direction: 'up' | 'down';
} | {
    type: 'SELECT_HIGHLIGHTED';
} | {
    type: 'GO_BACK';
};
export interface GlassNavState {
    highlightedIndex: number;
    screen: string;
}
//# sourceMappingURL=types.d.ts.map