import { useRef, useEffect } from "react";
import { Box } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { Card } from "./Card";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  startDrag,
  updateDragPosition,
  endDrag,
} from "@/store/slices/dragSlice";
import type { Card as CardType } from "@/types";

interface DraggableCardProps {
  card: CardType;
  onEdit: () => void;
  onDrop?: (card: CardType, targetStackId: string) => void;
  onTrashDrop?: (card: CardType) => void;
  width?: number;
  height?: number;
}

export function DraggableCard({
  card,
  onEdit,
  onDrop,
  onTrashDrop,
  width,
  height,
}: DraggableCardProps) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { isDragging, draggedCard, hoveredStackId, isHoveringTrash } =
    useAppSelector((state) => state.drag);

  const isBeingDragged = isDragging && draggedCard?.id === card.id;

  // Use custom dimensions if provided, otherwise responsive defaults
  const boxWidth = width ?? { xs: 240, sm: 260, md: 280 };
  const boxHeight = height ?? { xs: 340, sm: 370, md: 400 };

  const handleDragHandlePointerDown = (e: React.PointerEvent) => {
    dispatch(startDrag(card));
    dispatch(updateDragPosition({ x: e.clientX, y: e.clientY }));
  };

  // Keep refs for latest values to avoid stale closures in global event handlers
  const hoveredStackIdRef = useRef(hoveredStackId);
  const isHoveringTrashRef = useRef(isHoveringTrash);
  const onDropRef = useRef(onDrop);
  const onTrashDropRef = useRef(onTrashDrop);

  useEffect(() => {
    hoveredStackIdRef.current = hoveredStackId;
  }, [hoveredStackId]);

  useEffect(() => {
    isHoveringTrashRef.current = isHoveringTrash;
  }, [isHoveringTrash]);

  useEffect(() => {
    onDropRef.current = onDrop;
  }, [onDrop]);

  useEffect(() => {
    onTrashDropRef.current = onTrashDrop;
  }, [onTrashDrop]);

  // Global pointer events for tracking drag movement and release
  useEffect(() => {
    if (!isDragging || !isBeingDragged) return;

    const handleGlobalMove = (e: PointerEvent) => {
      dispatch(updateDragPosition({ x: e.clientX, y: e.clientY }));
    };

    const handleGlobalUp = () => {
      // Check if we're over the trash zone
      if (isHoveringTrashRef.current && onTrashDropRef.current) {
        onTrashDropRef.current(card);
      } else {
        // Check if we're over a valid stack drop target
        const targetStackId = hoveredStackIdRef.current;
        if (
          targetStackId &&
          targetStackId !== card.stackId &&
          onDropRef.current
        ) {
          onDropRef.current(card, targetStackId);
        }
      }
      dispatch(endDrag());
    };

    window.addEventListener("pointermove", handleGlobalMove);
    window.addEventListener("pointerup", handleGlobalUp);
    window.addEventListener("pointercancel", handleGlobalUp);

    return () => {
      window.removeEventListener("pointermove", handleGlobalMove);
      window.removeEventListener("pointerup", handleGlobalUp);
      window.removeEventListener("pointercancel", handleGlobalUp);
    };
  }, [isDragging, isBeingDragged, dispatch, card]);

  return (
    <Box
      sx={{
        width: boxWidth,
        height: boxHeight,
        position: "relative",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          opacity: isBeingDragged ? 0.4 : 1,
          transition: "opacity 0.2s",
        }}
      >
        <Card
          card={card}
          onEdit={onEdit}
          width={width}
          height={height}
          onDragHandlePointerDown={handleDragHandlePointerDown}
        />
      </Box>

      {/* Ghost placeholder when dragging */}
      {isBeingDragged && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            borderRadius: { xs: "12px", md: "16px" },
            border: "2px dashed",
            borderColor: "primary.main",
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
            pointerEvents: "none",
          }}
        />
      )}
    </Box>
  );
}
