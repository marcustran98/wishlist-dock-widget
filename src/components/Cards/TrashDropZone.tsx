import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Box, useMediaQuery } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setHoveringTrash } from "@/store/slices/dragSlice";
import { Z_INDEX } from "@/constants";

export function TrashDropZone() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useAppDispatch();
  const trashZoneRef = useRef<HTMLDivElement>(null);

  // Responsive dimensions
  const trashSize = isMobile ? 48 : 64;
  const topOffset = isMobile ? 16 : 32;

  const { isDragging, dragPosition, isHoveringTrash } = useAppSelector(
    (state) => state.drag
  );

  useEffect(() => {
    if (!isDragging || !dragPosition || !trashZoneRef.current) {
      if (isHoveringTrash) {
        dispatch(setHoveringTrash(false));
      }
      return;
    }

    const rect = trashZoneRef.current.getBoundingClientRect();
    const isOver =
      dragPosition.x >= rect.left &&
      dragPosition.x <= rect.right &&
      dragPosition.y >= rect.top &&
      dragPosition.y <= rect.bottom;

    if (isOver !== isHoveringTrash) {
      dispatch(setHoveringTrash(isOver));
    }
  }, [isDragging, dragPosition, isHoveringTrash, dispatch]);

  if (!isDragging) {
    return null;
  }

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      style={{
        position: "fixed",
        top: topOffset,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: Z_INDEX.DRAG_OVERLAY,
      }}
    >
      <Box
        ref={trashZoneRef}
        sx={{
          width: trashSize,
          height: trashSize,
          borderRadius: "50%",
          backgroundColor: isHoveringTrash
            ? theme.palette.error.main
            : alpha(theme.palette.error.main, 0.7),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: isHoveringTrash ? "scale(1.2)" : "scale(1)",
          boxShadow: isHoveringTrash
            ? `0 0 0 4px ${alpha(theme.palette.error.main, 0.3)}, 0 0 24px ${alpha(theme.palette.error.main, 0.5)}`
            : `0 4px 16px ${alpha(theme.palette.common.black, 0.3)}`,
          transition: "transform 0.2s, box-shadow 0.2s, background-color 0.2s",
        }}
      >
        <DeleteForeverIcon
          sx={{
            fontSize: isHoveringTrash
              ? { xs: 24, md: 32 }
              : { xs: 20, md: 28 },
            color: "white",
            transition: "font-size 0.2s",
          }}
        />
      </Box>
    </motion.div>
  );
}
