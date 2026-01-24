import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Stack, Card, Notification } from "@/types";

interface UiState {
  isExpanded: boolean;
  activeStackId: string | null;
  searchQuery: string;
  isSearchOpen: boolean;
  stackDialogOpen: boolean;
  cardDialogOpen: boolean;
  editingStack: Stack | undefined;
  editingCard: Card | undefined;
  notification: Notification | null;
}

const initialState: UiState = {
  isExpanded: false,
  activeStackId: null,
  searchQuery: "",
  isSearchOpen: false,
  stackDialogOpen: false,
  cardDialogOpen: false,
  editingStack: undefined,
  editingCard: undefined,
  notification: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setExpanded(state, action: PayloadAction<boolean>) {
      state.isExpanded = action.payload;
    },
    setActiveStack(state, action: PayloadAction<string | null>) {
      state.activeStackId = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setSearchOpen(state, action: PayloadAction<boolean>) {
      state.isSearchOpen = action.payload;
      if (!action.payload) {
        state.searchQuery = "";
      }
    },
    openStackDialog(state, action: PayloadAction<Stack | undefined>) {
      state.stackDialogOpen = true;
      state.editingStack = action.payload;
    },
    openCardDialog(state, action: PayloadAction<Card | undefined>) {
      state.cardDialogOpen = true;
      state.editingCard = action.payload;
    },
    closeDialogs(state) {
      state.stackDialogOpen = false;
      state.cardDialogOpen = false;
      state.editingStack = undefined;
      state.editingCard = undefined;
    },
  },
});

export const {
  setExpanded,
  setActiveStack,
  setSearchQuery,
  setSearchOpen,
  openStackDialog,
  openCardDialog,
  closeDialogs,
} = uiSlice.actions;

export default uiSlice.reducer;
