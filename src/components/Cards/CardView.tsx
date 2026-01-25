import { useRef, useState, useEffect, memo } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import {
  Add as AddIcon,
  Close as CloseIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  DriveFileMove as MoveIcon,
} from "@mui/icons-material";
import type { Swiper as SwiperType } from "swiper";
import { Z_INDEX, CARD_DIMENSIONS } from "@/constants";
import { CardSwiper } from "@/components/CardSwiper";
import { DraggableCard } from "./DraggableCard";
import { useAppSelector } from "@/store/hooks";
import type { Card as CardType, Stack } from "@/types";

interface CardViewProps {
  cards: CardType[];
  onClose: () => void;
  onAddCard: () => void;
  onEditCard: (card: CardType) => void;
  onCardDrop?: (card: CardType, targetStackId: string) => void;
  onTrashDrop?: (card: CardType) => void;
  displayMode?: "dock" | "modal";
  stack?: Stack;
  allStacks?: Stack[];
  initialCardIndex?: number;
  onMoveCard?: (card: CardType, targetStackId: string) => void;
}

export const CardView = memo(function CardView({
  cards,
  onClose,
  onAddCard,
  onEditCard,
  onCardDrop,
  onTrashDrop,
  displayMode = "dock",
  stack,
  allStacks = [],
  initialCardIndex = 0,
  onMoveCard,
}: CardViewProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const isModal = displayMode === "modal";

  // Responsive dimensions
  const dimensions = CARD_DIMENSIONS[displayMode];
  const cardWidth = isMobile
    ? dimensions.mobile.width
    : isTablet
      ? dimensions.tablet.width
      : dimensions.desktop.width;
  const cardHeight = isMobile
    ? dimensions.mobile.height
    : isTablet
      ? dimensions.tablet.height
      : dimensions.desktop.height;
  const dockHeight = isMobile ? 80 : isTablet ? 100 : 120;

  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(initialCardIndex);
  const [moveAnchor, setMoveAnchor] = useState<null | HTMLElement>(null);
  const { isDragging } = useAppSelector((state) => state.drag);

  const currentCard = cards[activeIndex];
  const otherStacks = allStacks.filter((s) => s.id !== stack?.id);

  // Keyboard navigation (modal only)
  useEffect(() => {
    if (!isModal) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") swiperRef.current?.slidePrev();
      else if (e.key === "ArrowRight") swiperRef.current?.slideNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModal, onClose]);

  // Set initial slide (modal only)
  useEffect(() => {
    if (isModal && swiperRef.current && initialCardIndex > 0) {
      swiperRef.current.slideTo(initialCardIndex, 0);
    }
  }, [isModal, initialCardIndex]);

  // Handle backdrop click for modal mode
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isModal && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <Box
      onClick={handleContainerClick}
      sx={
        isModal
          ? {
              position: "fixed",
              inset: 0,
              zIndex: Z_INDEX.PROJECTED_CARD,
              backgroundColor: alpha(theme.palette.common.black, 0.7),
              backdropFilter: "blur(8px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }
          : {
              position: "fixed",
              bottom: dockHeight + 16,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: Z_INDEX.CARD_DECK,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }
      }
    >
      {/* Header - unified for both modes */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 1, sm: 1.5, md: 2 },
          mb: { xs: 1, md: isModal ? 3 : 1 },
          backgroundColor: "background.paper",
          borderRadius: { xs: 2, md: 3 },
          px: { xs: 1.5, md: 2 },
          py: { xs: 0.75, md: 1 },
          boxShadow: theme.shadows[8],
        }}
      >
        {stack?.name && (
          <Typography
            variant="subtitle1"
            fontWeight={600}
            sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
          >
            {stack.name}
          </Typography>
        )}
        {cards.length > 0 && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}
          >
            {activeIndex + 1} / {cards.length}
          </Typography>
        )}
        <IconButton size="small" onClick={onAddCard} color="primary">
          <AddIcon />
        </IconButton>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Card area */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {/* Left arrow (modal only) */}
        {isModal && cards.length > 0 && (
          <IconButton
            onClick={() => swiperRef.current?.slidePrev()}
            disabled={activeIndex === 0}
            sx={{
              backgroundColor: alpha(theme.palette.common.white, 0.1),
              "&:hover": {
                backgroundColor: alpha(theme.palette.common.white, 0.2),
              },
              "&.Mui-disabled": { opacity: 0.3 },
            }}
          >
            <ChevronLeftIcon sx={{ color: "common.white" }} />
          </IconButton>
        )}

        {/* Cards or empty state */}
        {cards.length > 0 ? (
          <CardSwiper
            cards={cards}
            initialCardIndex={initialCardIndex}
            cardWidth={cardWidth}
            cardHeight={cardHeight}
            isMobile={isMobile}
            swiperRef={swiperRef}
            disableTouch={isDragging}
            showDotIndicators={true}
            dotColors={{
              active: "primary.main",
              inactive: isModal ? "grey.500" : "grey.300",
            }}
            activeIndex={activeIndex}
            onSlideChange={setActiveIndex}
            renderCard={(card) => (
              <DraggableCard
                card={card}
                width={cardWidth}
                height={cardHeight}
                onEdit={() => onEditCard(card)}
                onDrop={isModal ? onMoveCard : onCardDrop}
                onTrashDrop={onTrashDrop}
              />
            )}
          />
        ) : (
          <Box
            sx={{
              width: cardWidth,
              height: cardHeight,
              borderRadius: { xs: "12px", md: "16px" },
              backgroundColor: "background.paper",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: { xs: 1.5, md: 2 },
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
            >
              No cards yet
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onAddCard}
              sx={{ fontSize: { xs: "0.8rem", md: "0.875rem" } }}
            >
              Add Card
            </Button>
          </Box>
        )}

        {/* Right arrow (modal only) */}
        {isModal && cards.length > 0 && (
          <IconButton
            onClick={() => swiperRef.current?.slideNext()}
            disabled={activeIndex === cards.length - 1}
            sx={{
              backgroundColor: alpha(theme.palette.common.white, 0.1),
              "&:hover": {
                backgroundColor: alpha(theme.palette.common.white, 0.2),
              },
              "&.Mui-disabled": { opacity: 0.3 },
            }}
          >
            <ChevronRightIcon sx={{ color: "common.white" }} />
          </IconButton>
        )}
      </Box>

      {/* Move menu (modal only, when other stacks exist) */}
      {isModal && currentCard && otherStacks.length > 0 && (
        <Box
          sx={{
            display: "flex",
            gap: { xs: 0.5, md: 1 },
            mt: { xs: 2, md: 3 },
            backgroundColor: "background.paper",
            borderRadius: { xs: 1.5, md: 2 },
            px: { xs: 1, md: 2 },
            py: { xs: 0.75, md: 1 },
          }}
        >
          <Button
            size="small"
            startIcon={<MoveIcon />}
            onClick={(e) => setMoveAnchor(e.currentTarget)}
          >
            Move
          </Button>
          <Menu
            anchorEl={moveAnchor}
            open={Boolean(moveAnchor)}
            onClose={() => setMoveAnchor(null)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            transformOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <MenuItem disabled sx={{ opacity: 0.7 }}>
              <Typography variant="caption">Move to...</Typography>
            </MenuItem>
            {otherStacks.map((s) => (
              <MenuItem
                key={s.id}
                onClick={() => {
                  onMoveCard?.(currentCard, s.id);
                  setMoveAnchor(null);
                }}
              >
                <ListItemIcon>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: 0.5,
                      background: s.coverUrl.startsWith("linear-gradient")
                        ? s.coverUrl
                        : `url(${s.coverUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                </ListItemIcon>
                <ListItemText primary={s.name} />
              </MenuItem>
            ))}
          </Menu>
        </Box>
      )}
    </Box>
  );
});
