import { useRef, useEffect, useState } from "react";
import { Box, Paper, IconButton, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import StarIcon from "@mui/icons-material/Star";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import RemoveIcon from "@mui/icons-material/Remove";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { LAYOUT, Z_INDEX } from "@/constants";
import { StackThumbnail } from "./StackThumbnail";
import { SearchBar } from "./SearchBar";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setHoveredStack } from "@/store/slices/dragSlice";
import type { Stack } from "@/types";

import "swiper/css";

interface DockExpandedProps {
  stacks: Stack[];
  activeStackId: string | null;
  searchQuery: string;
  isSearchOpen: boolean;
  onMinimize: () => void;
  onFullScreen: () => void;
  onAddStack: () => void;
  onStackClick: (stackId: string) => void;
  onEditStack: (stack: Stack) => void;
  onDeleteStack: (stack: Stack) => void;
  onSearchChange: (value: string) => void;
  onSearchToggle: () => void;
  onSearchClose: () => void;
}

export function DockExpanded({
  stacks,
  activeStackId,
  searchQuery,
  isSearchOpen,
  onMinimize,
  onFullScreen,
  onAddStack,
  onStackClick,
  onEditStack,
  onDeleteStack,
  onSearchChange,
  onSearchToggle,
  onSearchClose,
}: DockExpandedProps) {
  const dispatch = useAppDispatch();
  const { isDragging, sourceStackId, hoveredStackId, dragPosition } =
    useAppSelector((state) => state.drag);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(true);
  const dropZonesRef = useRef<Map<string, HTMLElement>>(new Map());
  const swiperRef = useRef<SwiperType | null>(null);

  const handleRegisterDropZone = (
    stackId: string,
    element: HTMLElement | null,
  ) => {
    if (element) {
      dropZonesRef.current.set(stackId, element);
    } else {
      dropZonesRef.current.delete(stackId);
    }
  };

  // Check which stack is being hovered during drag
  useEffect(() => {
    if (!isDragging || !dragPosition) {
      if (hoveredStackId) {
        dispatch(setHoveredStack(null));
      }
      return;
    }

    let foundStackId: string | null = null;

    dropZonesRef.current.forEach((element, stackId) => {
      if (stackId === sourceStackId) return;

      const rect = element.getBoundingClientRect();
      if (
        dragPosition.x >= rect.left &&
        dragPosition.x <= rect.right &&
        dragPosition.y >= rect.top &&
        dragPosition.y <= rect.bottom
      ) {
        foundStackId = stackId;
      }
    });

    if (foundStackId !== hoveredStackId) {
      dispatch(setHoveredStack(foundStackId));
    }
  }, [isDragging, dragPosition, sourceStackId, hoveredStackId, dispatch]);

  return (
    <Paper
      elevation={8}
      sx={{
        position: "fixed",
        bottom: 0,
        width: { xs: "95vw", sm: 600, md: 800 },
        maxWidth: "95vw",
        left: "50%",
        transform: "translateX(-50%)",
        height: { xs: 90, sm: 100, md: 120 },
        zIndex: Z_INDEX.DOCK,
        display: "flex",
        alignItems: "center",
        px: { xs: 1, sm: 1.5, md: 2 },
        borderRadius: { xs: "12px 12px 0 0", md: "16px 16px 0 0" },
      }}
    >
      {/* Left: Logo - click to expand full screen */}
      <Box
        onClick={onFullScreen}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          cursor: "pointer",
          color: "primary.main",
          mr: 1,
          "&:hover": {
            opacity: 0.8,
          },
        }}
      >
        <StarIcon sx={{ fontSize: 24 }} />
        <Typography
          variant="body1"
          fontWeight={600}
          sx={{
            fontSize: { xs: 12, sm: 16 },
          }}
        >
          plugilo
        </Typography>
      </Box>

      {!isBeginning && (
        <IconButton
          size="small"
          onClick={() => swiperRef.current?.slidePrev()}
          sx={{ color: "text.secondary" }}
        >
          <ChevronLeftIcon />
        </IconButton>
      )}

      <Box sx={{ flex: 1, overflow: "hidden" }}>
        {stacks.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
            No stacks found
          </Typography>
        ) : (
          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}
            onSlideChange={(swiper) => {
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}
            onReachBeginning={() => setIsBeginning(true)}
            onReachEnd={() => setIsEnd(true)}
            slidesPerView="auto"
            spaceBetween={LAYOUT.THUMBNAIL_GAP}
            style={{ padding: "8px 0" }}
          >
            {stacks.map((stack) => (
              <SwiperSlide key={stack.id} style={{ width: "auto" }}>
                <StackThumbnail
                  stack={stack}
                  isActive={activeStackId === stack.id}
                  isDropTarget={isDragging && sourceStackId !== stack.id}
                  isHoveredDuringDrag={hoveredStackId === stack.id}
                  onClick={() => onStackClick(stack.id)}
                  onEdit={() => onEditStack(stack)}
                  onDelete={() => onDeleteStack(stack)}
                  onRegisterDropZone={handleRegisterDropZone}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </Box>

      {!isEnd && (
        <IconButton
          size="small"
          onClick={() => swiperRef.current?.slideNext()}
          sx={{ color: "text.secondary" }}
        >
          <ChevronRightIcon />
        </IconButton>
      )}

      {/* Right: Action buttons */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
          ml: 1,
          pt: 0.5,
        }}
      >
        {isSearchOpen ? (
          <SearchBar
            value={searchQuery}
            onChange={onSearchChange}
            onClose={onSearchClose}
          />
        ) : (
          <>
            <IconButton
              onClick={onAddStack}
              color="primary"
              sx={{
                borderRadius: { xs: "8px", md: "10px" },
                width: { xs: 48, sm: 56, md: 64 },
                height: { xs: 48, sm: 56, md: 64 },
                backgroundColor: "primary.main",
                color: "white",
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              }}
            >
              <AddIcon sx={{ fontSize: { xs: 20, sm: 22, md: 24 } }} />
            </IconButton>
            <Box display="flex">
              <IconButton
                color="default"
                onClick={onSearchToggle}
                sx={{ padding: 0.5 }}
              >
                <SearchIcon />
              </IconButton>
              <IconButton
                onClick={onMinimize}
                color="default"
                sx={{ padding: 0.5 }}
              >
                <RemoveIcon />
              </IconButton>
            </Box>
          </>
        )}
      </Box>
    </Paper>
  );
}
