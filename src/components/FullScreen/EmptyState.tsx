import { Box, Typography, Button } from "@mui/material";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  message: string;
  actionLabel: string;
  onAction: () => void;
}

export function EmptyState({
  icon,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: { xs: 4, md: 6 },
        gap: { xs: 1.5, md: 2 },
      }}
    >
      {icon && (
        <Box sx={{ color: "text.secondary", opacity: 0.5 }}>{icon}</Box>
      )}
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{
          fontSize: { xs: "0.875rem", md: "1rem" },
          textAlign: "center",
          px: 2,
        }}
      >
        {message}
      </Typography>
      <Button
        variant="contained"
        size="small"
        onClick={onAction}
        sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}
      >
        {actionLabel}
      </Button>
    </Box>
  );
}
