import { useEffect, type ReactNode, type MutableRefObject } from "react";
import { Box } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import type { Card as CardType } from "@/types";
import { DotIndicators } from "./DotIndicators";

import "swiper/css";
import "swiper/css/effect-cards";

interface CardSwiperProps {
  cards: CardType[];
  initialCardIndex?: number;
  cardWidth: number;
  cardHeight: number;
  isMobile: boolean;
  renderCard: (card: CardType) => ReactNode;
  onSlideChange?: (index: number) => void;
  swiperRef?: MutableRefObject<SwiperType | null>;
  disableTouch?: boolean;
  showDotIndicators?: boolean;
  dotColors?: { active: string; inactive: string };
  activeIndex?: number;
}

export function CardSwiper({
  cards,
  initialCardIndex = 0,
  cardWidth,
  cardHeight,
  isMobile,
  renderCard,
  onSlideChange,
  swiperRef,
  disableTouch = false,
  showDotIndicators = false,
  dotColors = { active: "primary.main", inactive: "grey.300" },
  activeIndex = 0,
}: CardSwiperProps) {
  // Disable touch when dragging
  useEffect(() => {
    if (swiperRef?.current) {
      swiperRef.current.allowTouchMove = !disableTouch;
    }
  }, [disableTouch, swiperRef]);

  const handleDotClick = (index: number) => {
    swiperRef?.current?.slideTo(index);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Box
        sx={{
          width: cardWidth + 24,
          height: cardHeight + 24,
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          touchAction: "pan-y pinch-zoom",
        }}
      >
        <Swiper
          onSwiper={(swiper) => {
            if (swiperRef) swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => onSlideChange?.(swiper.activeIndex)}
          initialSlide={initialCardIndex}
          effect="cards"
          grabCursor
          modules={[EffectCards]}
          cardsEffect={{
            perSlideOffset: isMobile ? 8 : 12,
            perSlideRotate: isMobile ? 3 : 5,
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
            width: cardWidth,
            height: cardHeight,
          }}
        >
          {cards.map((card) => (
            <SwiperSlide
              key={card.id}
              style={{
                borderRadius: isMobile ? "12px" : "16px",
                overflow: "hidden",
              }}
            >
              {renderCard(card)}
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>

      {showDotIndicators && cards.length > 1 && (
        <DotIndicators
          count={cards.length}
          activeIndex={activeIndex}
          onDotClick={handleDotClick}
          activeColor={dotColors.active}
          inactiveColor={dotColors.inactive}
        />
      )}
    </Box>
  );
}
