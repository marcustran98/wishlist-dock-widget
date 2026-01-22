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
        bottom: 16,
        left: "50%",
        transform: "translateX(-50%)",
        width: 140,
        height: 44,
        borderRadius: "22px",
        backgroundColor: "primary.main",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
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
      <StarIcon sx={{ fontSize: 20 }} />
      <Typography variant="body1" fontWeight={600}>
        plugilo
      </Typography>
    </Box>
  );
}
