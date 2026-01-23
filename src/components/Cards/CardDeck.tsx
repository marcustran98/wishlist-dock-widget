import { useRef, useState } from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper/modules";
import { Card } from "./Card";
import type { Swiper as SwiperType } from "swiper";
import { LAYOUT, Z_INDEX, CARD_DECK } from "@/constants";
import type { Card as CardType } from "@/types";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";

import "swiper/css";
import "swiper/css/effect-cards";

interface CardDeckProps {
  stackName: string;
  cards: CardType[];
  onClose: () => void;
  onAddCard: () => void;
  onEditCard: (card: CardType) => void;
  onDeleteCard: (card: CardType) => void;
}

export function CardDeck({
  stackName,
  cards,
  onClose,
  onAddCard,
  onEditCard,
  onDeleteCard,
}: CardDeckProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.activeIndex);
  };

  const handleDotClick = (index: number) => {
    swiperRef.current?.slideTo(index);
  };

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

      {/* Swipe hint */}
      {cards.length > 1 && activeIndex === 0 && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mb: 1, opacity: 0.7 }}
        >
          Swipe to browse
        </Typography>
      )}

      {/* Card area */}
      {cards.length > 0 ? (
        <Box
          sx={{
            width: CARD_DECK.CARD_WIDTH + 24,
            height: CARD_DECK.CARD_HEIGHT + 24,
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            touchAction: "pan-y pinch-zoom",
          }}
        >
          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            onSlideChange={handleSlideChange}
            effect="cards"
            grabCursor
            modules={[EffectCards]}
            cardsEffect={{
              perSlideOffset: 12,
              perSlideRotate: 5,
              rotate: true,
              slideShadows: true,
            }}
            speed={300}
            resistance={true}
            resistanceRatio={0.7}
            touchRatio={0.8}
            threshold={10}
            cssMode={false}
            touchStartPreventDefault={false}
            style={{
              width: CARD_DECK.CARD_WIDTH,
              height: CARD_DECK.CARD_HEIGHT,
            }}
          >
            {cards.map((card) => (
              <SwiperSlide
                key={card.id}
                style={{
                  borderRadius: "16px",
                  overflow: "hidden",
                }}
              >
                <Card
                  card={card}
                  onEdit={() => onEditCard(card)}
                  onDelete={() => onDeleteCard(card)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
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
              onClick={() => handleDotClick(index)}
              onKeyDown={(e) => e.key === "Enter" && handleDotClick(index)}
              role="button"
              tabIndex={0}
              aria-label={`Go to card ${index + 1}`}
              sx={{
                width: index === activeIndex ? 16 : 8,
                height: 8,
                borderRadius: "4px",
                backgroundColor:
                  index === activeIndex ? "primary.main" : "grey.300",
                transition: "all 0.2s",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor:
                    index === activeIndex ? "primary.main" : "grey.400",
                },
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
