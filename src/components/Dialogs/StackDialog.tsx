import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
} from "@mui/material";
import { GRADIENTS } from "@/constants";
import type { Stack } from "@/types";

interface StackDialogProps {
  open: boolean;
  onClose: () => void;
  stack?: Stack;
  onSave: (name: string, coverUrl: string) => void;
}

interface StackDialogFormProps {
  stack?: Stack;
  onClose: () => void;
  onSave: (name: string, coverUrl: string) => void;
}

function StackDialogForm({ stack, onClose, onSave }: StackDialogFormProps) {
  const [name, setName] = useState(stack?.name ?? "");
  const [selectedGradient, setSelectedGradient] = useState<string>(
    stack?.coverUrl ?? GRADIENTS[0]
  );

  const handleSave = () => {
    onSave(name.trim(), selectedGradient);
    onClose();
  };

  const isEditMode = Boolean(stack);

  return (
    <>
      <DialogTitle>{isEditMode ? "Edit Stack" : "Create Stack"}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Stack Name"
          fullWidth
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 3 }}
        />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Choose a cover color
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(4, 40px)",
              sm: "repeat(4, 44px)",
              md: "repeat(4, 48px)",
            },
            gap: { xs: 0.75, md: 1 },
            justifyContent: "center",
          }}
        >
          {GRADIENTS.map((gradient) => (
            <Box
              key={gradient}
              onClick={() => setSelectedGradient(gradient)}
              sx={{
                width: { xs: 40, sm: 44, md: 48 },
                height: { xs: 40, sm: 44, md: 48 },
                borderRadius: { xs: "6px", md: "8px" },
                background: gradient,
                cursor: "pointer",
                border:
                  selectedGradient === gradient
                    ? "3px solid"
                    : "3px solid transparent",
                borderColor:
                  selectedGradient === gradient ? "primary.main" : "transparent",
                transition: "transform 0.15s, border-color 0.15s",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            />
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={!name.trim()}>
          Save
        </Button>
      </DialogActions>
    </>
  );
}

export function StackDialog({ open, onClose, stack, onSave }: StackDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      {open && (
        <StackDialogForm stack={stack} onClose={onClose} onSave={onSave} />
      )}
    </Dialog>
  );
}
