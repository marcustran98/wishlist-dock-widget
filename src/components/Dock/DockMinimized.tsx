import { Box, Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { Z_INDEX } from "@/constants";

interface DockMinimizedProps {
  onExpand: () => void;
}

export function DockMinimized({ onExpand }: DockMinimizedProps) {
  return (
    <Box
      onClick={onExpand}
      sx={{
        position: "fixed",
        bottom: { xs: 12, sm: 16 },
        left: "50%",
        transform: "translateX(-50%)",
        width: { xs: 120, sm: 130, md: 140 },
        height: { xs: 40, sm: 42, md: 44 },
        borderRadius: { xs: "20px", md: "22px" },
        backgroundColor: "primary.main",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: { xs: 0.5, sm: 1 },
        cursor: "pointer",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        zIndex: Z_INDEX.DOCK,
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateX(-50%) scale(1.05)",
          boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      <StarIcon sx={{ fontSize: { xs: 18, md: 20 } }} />
      <Typography
        variant="body1"
        fontWeight={600}
        sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
      >
        plugilo
      </Typography>
    </Box>
  );
}
