import { useState } from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
import { LAYOUT, Z_INDEX } from "@/constants";
import { Card } from "./Card";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface CardData {
  id: string;
  name: string;
  description?: string;
  coverUrl: string;
}

interface CardDeckProps {
  stackId: string;
  stackName: string;
  cards: CardData[];
  onClose: () => void;
  onAddCard: () => void;
  onEditCard: (card: CardData) => void;
  onDeleteCard: (card: CardData) => void;
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

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(cards.length - 1, prev + 1));
  };

  const currentCard = cards[currentIndex];

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
            {currentIndex + 1} / {cards.length}
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
      {cards.length > 0 ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Left navigation */}
          <IconButton
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            sx={{
              backgroundColor: "background.paper",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              "&:disabled": {
                backgroundColor: "background.paper",
                opacity: 0.5,
              },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>

          {/* Current card */}
          <Card
            card={currentCard}
            onEdit={() => onEditCard(currentCard)}
            onDelete={() => onDeleteCard(currentCard)}
          />

          {/* Right navigation */}
          <IconButton
            onClick={handleNext}
            disabled={currentIndex === cards.length - 1}
            sx={{
              backgroundColor: "background.paper",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              "&:disabled": {
                backgroundColor: "background.paper",
                opacity: 0.5,
              },
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>
      ) : (
        <Box
          sx={{
            width: 280,
            height: 400,
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
    </Box>
  );
}
