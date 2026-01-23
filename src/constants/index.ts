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
  SWIPE_THRESHOLD: 100,
  SWIPE_VELOCITY_THRESHOLD: 500,
  VISIBLE_CARDS: 4,
  DRAG_RANGE: [-200, 0, 200] as const,
  DRAG_ROTATION_RANGE: [-25, 0, 25] as const,
  STACK_CONFIG: [
    { rotate: 0, x: 0, y: 0, scale: 1 },
    { rotate: 3, x: 8, y: 4, scale: 0.98 },
    { rotate: -2, x: -6, y: 8, scale: 0.96 },
    { rotate: 4, x: 10, y: 12, scale: 0.94 },
  ] as const,
} as const;

export const ANIMATION = {
  SPRING_SNAPPY: { type: "spring" as const, stiffness: 500, damping: 30 },
  SPRING_SMOOTH: { type: "spring" as const, stiffness: 300, damping: 30 },
  SPRING_GENTLE: { type: "spring" as const, stiffness: 300, damping: 25 },
} as const;

export const COLORS = {
  INDICATOR_NEXT_RIGHT: "rgba(76, 175, 80, 0.9)",
  INDICATOR_NEXT_LEFT: "rgba(33, 150, 243, 0.9)",
} as const;
