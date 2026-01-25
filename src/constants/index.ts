export const LAYOUT = {
  DOCK_HEIGHT: 120,
  DOCK_HEIGHT_MOBILE: 80,
  THUMBNAIL_SIZE: 64,
  THUMBNAIL_GAP: 8,
} as const;

export const Z_INDEX = {
  DOCK: 1000,
  CARD_DECK: 999,
  FULLSCREEN: 1050,
  PROJECTED_CARD: 1075,
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

export const CARD_DIMENSIONS = {
  dock: {
    mobile: { width: 240, height: 340 },
    tablet: { width: 260, height: 370 },
    desktop: { width: 280, height: 400 },
  },
  modal: {
    mobile: { width: 260, height: 374 },
    tablet: { width: 290, height: 417 },
    desktop: { width: 320, height: 460 },
  },
} as const;

export const TRASH_ZONE = {
  SIZE: 64,
  TOP_OFFSET: 32,
} as const;

export const FULLSCREEN = {
  HEADER_HEIGHT: 64,
  SECTION_PADDING: 24,
  CARD_THUMBNAIL_WIDTH: 160,
  CARD_THUMBNAIL_HEIGHT: 220,
  PROJECTED_CARD_WIDTH: 320,
  PROJECTED_CARD_HEIGHT: 460,
} as const;
