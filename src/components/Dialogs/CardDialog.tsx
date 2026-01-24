import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import CasinoIcon from "@mui/icons-material/Casino";
import type { Stack, Card } from "@/types";

interface CardDialogProps {
  open: boolean;
  onClose: () => void;
  card?: Card;
  stacks: Stack[];
  initialStackId?: string;
  onSave: (data: {
    name: string;
    description: string;
    coverUrl: string;
    stackId: string;
  }) => void;
}

interface CardDialogFormProps {
  card?: Card;
  stacks: Stack[];
  initialStackId?: string;
  onClose: () => void;
  onSave: (data: {
    name: string;
    description: string;
    coverUrl: string;
    stackId: string;
  }) => void;
}

function CardDialogForm({
  card,
  stacks,
  initialStackId,
  onClose,
  onSave,
}: CardDialogFormProps) {
  const [name, setName] = useState(card?.name ?? "");
  const [description, setDescription] = useState(card?.description ?? "");
  const [coverUrl, setCoverUrl] = useState(card?.coverUrl ?? "");
  const [stackId, setStackId] = useState(
    card?.stackId ?? initialStackId ?? stacks[0]?.id ?? "",
  );

  const handleRandomImage = () => {
    setCoverUrl(`https://picsum.photos/400/600?random=${Date.now()}`);
  };

  const handleSave = () => {
    onSave({
      name: name.trim(),
      description: description.trim(),
      coverUrl,
      stackId,
    });
    onClose();
  };

  const isEditMode = Boolean(card);
  const canSave = name.trim() && coverUrl;

  return (
    <>
      <DialogTitle>{isEditMode ? "Edit Card" : "Add Card"}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Name"
          fullWidth
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          label="Description"
          fullWidth
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <TextField
            margin="dense"
            label="Cover URL"
            fullWidth
            required
            value={coverUrl}
            onChange={(e) => setCoverUrl(e.target.value)}
          />
          <Button
            variant="outlined"
            onClick={handleRandomImage}
            startIcon={<CasinoIcon />}
            sx={{ mt: 1, whiteSpace: "nowrap" }}
          >
            Random
          </Button>
        </Box>
        {coverUrl && (
          <Box
            sx={{
              height: 150,
              borderRadius: "8px",
              backgroundImage: `url(${coverUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundColor: "grey.200",
              mb: 2,
            }}
          />
        )}
        <FormControl fullWidth margin="dense">
          <InputLabel>Stack</InputLabel>
          <Select
            value={stackId}
            label="Stack"
            onChange={(e) => setStackId(e.target.value)}
          >
            {stacks.map((stack) => (
              <MenuItem key={stack.id} value={stack.id}>
                {stack.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={!canSave}>
          Save
        </Button>
      </DialogActions>
    </>
  );
}

export function CardDialog({
  open,
  onClose,
  card,
  stacks,
  initialStackId,
  onSave,
}: CardDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      {open && (
        <CardDialogForm
          card={card}
          stacks={stacks}
          initialStackId={initialStackId}
          onClose={onClose}
          onSave={onSave}
        />
      )}
    </Dialog>
  );
}
