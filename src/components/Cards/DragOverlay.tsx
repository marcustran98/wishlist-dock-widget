import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Box } from "@mui/material";
import { useAppSelector } from "@/store/hooks";
import { Z_INDEX, CARD_DECK } from "@/constants";
import { TrashDropZone } from "./TrashDropZone";

export function DragOverlay() {
  const { isDragging, draggedCard, dragPosition } = useAppSelector(
    (state) => state.drag
  );

  const showOverlay = isDragging && draggedCard && dragPosition;

  return createPortal(
    <>
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            key="drag-preview"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.05, opacity: 1, rotate: 3 }}
            exit={{ scale: 0.8, opacity: 0 }}
            style={{
              position: "fixed",
              left: dragPosition.x,
              top: dragPosition.y,
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
              zIndex: Z_INDEX.DRAG_OVERLAY,
              width: CARD_DECK.CARD_WIDTH * 0.3,
              height: CARD_DECK.CARD_HEIGHT * 0.3,
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "100%",
                borderRadius: "16px",
                overflow: "hidden",
                backgroundImage: `url(${draggedCard.coverUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "50%",
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
                }}
              />
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isDragging && <TrashDropZone key="trash-zone" />}
      </AnimatePresence>
    </>,
    document.body
  );
}
