export const LAYOUT = {
  DOCK_HEIGHT: 120,
  DOCK_HEIGHT_MOBILE: 80,
  THUMBNAIL_SIZE: 64,
  THUMBNAIL_GAP: 8,
} as const;

export const Z_INDEX = {
  DOCK: 1000,
  CARD_DECK: 999,
  DIALOG: 1100,
  DRAG_OVERLAY: 1200,
} as const;

export const GRADIENTS = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
  "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
] as const;

export const CARD_DECK = {
  CARD_WIDTH: 280,
  CARD_HEIGHT: 400,
} as const;
