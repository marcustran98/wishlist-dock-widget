import { TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
}

export function SearchBar({ value, onChange, onClose }: SearchBarProps) {
  const handleClear = () => {
    onChange("");
    onClose();
  };

  return (
    <TextField
      value={value}
      onChange={(e) => onChange(e.target.value)}
      variant="outlined"
      size="small"
      placeholder="Search stacks..."
      autoFocus
      sx={{
        width: { xs: 140, sm: 170, md: 200 },
        "& .MuiInputBase-input": {
          fontSize: { xs: "0.8rem", sm: "0.875rem" },
        },
      }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton size="small" onClick={handleClear} edge="end">
                <CloseIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
}
