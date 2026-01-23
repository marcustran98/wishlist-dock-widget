import { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  type PanInfo,
  type MotionValue,
} from "framer-motion";
import { CARD_DECK, ANIMATION, COLORS } from "@/constants";
import type { Card as CardType } from "@/types";
import { Card } from "./Card";

export interface SwipeableCardProps {
  card: CardType;
  isTop: boolean;
  stackIndex: number;
  onSwipe: (direction: "left" | "right") => void;
  onEdit: () => void;
  onDelete: () => void;
}

interface SwipeIndicatorProps {
  type: "right" | "left";
  opacity: MotionValue<number>;
}

function SwipeIndicator({ type, opacity }: SwipeIndicatorProps) {
  const isRight = type === "right";

  return (
    <motion.div
      style={{
        position: "absolute",
        top: 20,
        [isRight ? "right" : "left"]: 20,
        opacity,
        zIndex: 20,
        padding: "8px 16px",
        borderRadius: "8px",
        backgroundColor: isRight
          ? COLORS.INDICATOR_NEXT_RIGHT
          : COLORS.INDICATOR_NEXT_LEFT,
        color: "white",
        fontWeight: 600,
        fontSize: 18,
        border: "3px solid white",
        transform: `rotate(${isRight ? 15 : -15}deg)`,
      }}
    >
      NEXT
    </motion.div>
  );
}

export function SwipeableCard({
  card,
  isTop,
  stackIndex,
  onSwipe,
  onEdit,
  onDelete,
}: SwipeableCardProps) {
  const x = useMotionValue(0);
  const dragRotate = useTransform(
    x,
    CARD_DECK.DRAG_RANGE as unknown as number[],
    CARD_DECK.DRAG_ROTATION_RANGE as unknown as number[],
  );
  const likeOpacity = useTransform(x, [0, CARD_DECK.SWIPE_THRESHOLD], [0, 1]);
  const passOpacity = useTransform(x, [-CARD_DECK.SWIPE_THRESHOLD, 0], [1, 0]);
  const isAnimating = useRef(false);

  useEffect(() => {
    if (isTop) {
      x.set(0);
    }
  }, [isTop, x]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (isAnimating.current) return;

    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (
      Math.abs(offset) > CARD_DECK.SWIPE_THRESHOLD ||
      Math.abs(velocity) > CARD_DECK.SWIPE_VELOCITY_THRESHOLD
    ) {
      isAnimating.current = true;
      const direction = offset > 0 ? "right" : "left";
      const targetX =
        direction === "right"
          ? CARD_DECK.CARD_WIDTH * 2
          : -CARD_DECK.CARD_WIDTH * 2;

      animate(x, targetX, {
        ...ANIMATION.SPRING_SMOOTH,
        onComplete: () => {
          onSwipe(direction);
          isAnimating.current = false;
        },
      });
    } else {
      animate(x, 0, ANIMATION.SPRING_SNAPPY);
    }
  };

  const config =
    CARD_DECK.STACK_CONFIG[
      Math.min(stackIndex, CARD_DECK.STACK_CONFIG.length - 1)
    ];

  return (
    <motion.div
      style={{
        position: "absolute",
        x: isTop ? x : config.x,
        rotate: isTop ? dragRotate : config.rotate,
        scale: config.scale,
        y: config.y,
        zIndex: 10 - stackIndex,
        transformOrigin: "center bottom",
      }}
      initial={false}
      animate={
        !isTop
          ? {
              x: config.x,
              rotate: config.rotate,
              scale: config.scale,
              y: config.y,
            }
          : undefined
      }
      transition={ANIMATION.SPRING_GENTLE}
      drag={isTop ? "x" : false}
      dragElastic={0.9}
      onDragEnd={isTop ? handleDragEnd : undefined}
      whileDrag={{ cursor: "grabbing", scale: 1.02 }}
      whileHover={isTop ? { scale: 1.01 } : undefined}
    >
      {isTop && <SwipeIndicator type="right" opacity={likeOpacity} />}
      {isTop && <SwipeIndicator type="left" opacity={passOpacity} />}

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          borderRadius: "16px",
          boxShadow: isTop
            ? "0 10px 40px rgba(0, 0, 0, 0.3)"
            : "0 5px 20px rgba(0, 0, 0, 0.15)",
          pointerEvents: "none",
        }}
      />

      <Card card={card} onEdit={onEdit} onDelete={onDelete} />
    </motion.div>
  );
}
