import { Box } from "@mui/material";

interface DotIndicatorsProps {
  count: number;
  activeIndex: number;
  onDotClick: (index: number) => void;
  activeColor?: string;
  inactiveColor?: string;
}

export function DotIndicators({
  count,
  activeIndex,
  onDotClick,
  activeColor = "primary.main",
  inactiveColor = "grey.300",
}: DotIndicatorsProps) {
  return (
    <Box
      sx={{ display: "flex", gap: { xs: 0.5, md: 0.75 }, mt: { xs: 1.5, md: 2 } }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <Box
          key={index}
          onClick={() => onDotClick(index)}
          onKeyDown={(e) => e.key === "Enter" && onDotClick(index)}
          role="button"
          tabIndex={0}
          aria-label={`Go to card ${index + 1}`}
          sx={{
            width: index === activeIndex ? { xs: 12, md: 16 } : { xs: 6, md: 8 },
            height: { xs: 6, md: 8 },
            borderRadius: "4px",
            backgroundColor: index === activeIndex ? activeColor : inactiveColor,
            transition: "all 0.2s",
            cursor: "pointer",
            "&:hover": {
              backgroundColor: index === activeIndex ? activeColor : "grey.400",
            },
          }}
        />
      ))}
    </Box>
  );
}
