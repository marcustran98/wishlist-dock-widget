import { Box, Typography, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface Card {
  id: string;
  name: string;
  description?: string;
  coverUrl: string;
}

interface CardProps {
  card: Card;
  onEdit: () => void;
  onDelete: () => void;
}

export function Card({ card, onEdit, onDelete }: CardProps) {
  return (
    <Box
      sx={{
        width: 280,
        height: 400,
        borderRadius: "16px",
        position: "relative",
        overflow: "hidden",
        backgroundImage: `url(${card.coverUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
      }}
    >
      {/* Gradient overlay */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "50%",
          background:
            "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
        }}
      />

      {/* Action buttons */}
      <Box
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          display: "flex",
          gap: 1,
        }}
      >
        <IconButton
          onClick={onEdit}
          size="small"
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            color: "white",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.3)",
            },
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton
          onClick={onDelete}
          size="small"
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            color: "white",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.3)",
            },
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Card content */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
        }}
      >
        <Typography variant="h6" sx={{ color: "white", fontWeight: 600 }}>
          {card.name}
        </Typography>
        {card.description && (
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              mt: 0.5,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {card.description}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
