import { useState } from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { LAYOUT, Z_INDEX, CARD_DECK } from "@/constants";
import { type Card as CardType } from "./Card";
import { SwipeableCard } from "./SwipeableCard";

interface CardDeckProps {
  stackId: string;
  stackName: string;
  cards: CardType[];
  onClose: () => void;
  onAddCard: () => void;
  onEditCard: (card: CardType) => void;
  onDeleteCard: (card: CardType) => void;
}

function getVisibleCards(
  cards: CardType[],
  currentIndex: number,
  count: number
): CardType[] {
  if (cards.length === 0) return [];

  const result: CardType[] = [];
  const visibleCount = Math.min(count, cards.length);
  for (let i = 0; i < visibleCount; i++) {
    const index = (currentIndex + i) % cards.length;
    result.push(cards[index]);
  }
  return result;
}

export function CardDeck({
  stackName,
  cards,
  onClose,
  onAddCard,
  onEditCard,
  onDeleteCard,
}: CardDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const safeCurrentIndex =
    cards.length === 0
      ? 0
      : ((currentIndex % cards.length) + cards.length) % cards.length;

  const handleSwipe = (direction: "left" | "right") => {
    if (cards.length <= 1) return;

    if (direction === "left") {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    } else {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }
  };

  const handlePrevious = () => {
    if (cards.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleNext = () => {
    if (cards.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const visibleCards = getVisibleCards(
    cards,
    safeCurrentIndex,
    CARD_DECK.VISIBLE_CARDS
  );

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: LAYOUT.DOCK_HEIGHT + 16,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: Z_INDEX.CARD_DECK,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 2,
          backgroundColor: "background.paper",
          borderRadius: "12px",
          px: 2,
          py: 1,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="subtitle1" fontWeight={600}>
          {stackName}
        </Typography>
        {cards.length > 0 && (
          <Typography variant="body2" color="text.secondary">
            {safeCurrentIndex + 1} / {cards.length}
          </Typography>
        )}
        <IconButton size="small" onClick={onAddCard} color="primary">
          <AddIcon />
        </IconButton>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Swipe hint */}
      {cards.length > 1 && safeCurrentIndex === 0 && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mb: 1, opacity: 0.7 }}
        >
          Swipe or use arrows to browse
        </Typography>
      )}

      {/* Card area */}
      {cards.length > 0 ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton
            onClick={handlePrevious}
            disabled={cards.length <= 1}
            sx={{
              backgroundColor: "background.paper",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              "&:hover": { backgroundColor: "grey.100" },
              "&:disabled": {
                backgroundColor: "background.paper",
                opacity: 0.4,
              },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>

          <Box
            sx={{
              width: CARD_DECK.CARD_WIDTH + 40,
              height: CARD_DECK.CARD_HEIGHT + 20,
              position: "relative",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                width: CARD_DECK.CARD_WIDTH,
                height: CARD_DECK.CARD_HEIGHT,
                position: "relative",
              }}
            >
              {visibleCards
                .map((card, index) => (
                  <SwipeableCard
                    key={card.id}
                    card={card}
                    isTop={index === 0}
                    stackIndex={index}
                    onSwipe={handleSwipe}
                    onEdit={() => onEditCard(card)}
                    onDelete={() => onDeleteCard(card)}
                  />
                ))
                .reverse()}
            </Box>
          </Box>

          <IconButton
            onClick={handleNext}
            disabled={cards.length <= 1}
            sx={{
              backgroundColor: "background.paper",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              "&:hover": { backgroundColor: "grey.100" },
              "&:disabled": {
                backgroundColor: "background.paper",
                opacity: 0.4,
              },
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>
      ) : (
        <Box
          sx={{
            width: CARD_DECK.CARD_WIDTH,
            height: CARD_DECK.CARD_HEIGHT,
            borderRadius: "16px",
            backgroundColor: "background.paper",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography variant="body1" color="text.secondary">
            No cards yet
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddCard}
          >
            Add Card
          </Button>
        </Box>
      )}

      {/* Dot indicators */}
      {cards.length > 1 && (
        <Box sx={{ display: "flex", gap: 0.75, mt: 2 }}>
          {cards.map((card, index) => (
            <Box
              key={card.id}
              onClick={() => setCurrentIndex(index)}
              sx={{
                width: index === safeCurrentIndex ? 16 : 8,
                height: 8,
                borderRadius: "4px",
                backgroundColor:
                  index === safeCurrentIndex ? "primary.main" : "grey.300",
                transition: "all 0.2s",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor:
                    index === safeCurrentIndex ? "primary.main" : "grey.400",
                },
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
