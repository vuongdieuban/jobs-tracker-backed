// IMPORTANT: Keep PositionTopOrBottom with the PositionTopOrBottomType in sync
export const PositionTopOrBottomType = ['top', 'bottom'];
export type PositionTopOrBottom = 'top' | 'bottom';
export type PositionSpecific = number;
export type PositionOption = PositionSpecific | PositionTopOrBottom;
