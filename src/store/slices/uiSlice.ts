import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Stack, Card, Notification } from "@/types";

interface ProjectedCardViewState {
  isOpen: boolean;
  stackId: string | null;
  initialCardIndex: number;
}

interface UiState {
  isExpanded: boolean;
  isFullScreen: boolean;
  activeStackId: string | null;
  searchQuery: string;
  isSearchOpen: boolean;
  stackDialogOpen: boolean;
  cardDialogOpen: boolean;
  editingStack: Stack | undefined;
  editingCard: Card | undefined;
  notification: Notification | null;
  projectedCardView: ProjectedCardViewState;
}

const initialState: UiState = {
  isExpanded: false,
  isFullScreen: false,
  activeStackId: null,
  searchQuery: "",
  isSearchOpen: false,
  stackDialogOpen: false,
  cardDialogOpen: false,
  editingStack: undefined,
  editingCard: undefined,
  notification: null,
  projectedCardView: {
    isOpen: false,
    stackId: null,
    initialCardIndex: 0,
  },
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
    setFullScreen(state, action: PayloadAction<boolean>) {
      state.isFullScreen = action.payload;
      if (action.payload) {
        state.activeStackId = null;
      }
    },
    openProjectedCardView(
      state,
      action: PayloadAction<{ stackId: string; cardIndex: number }>
    ) {
      state.projectedCardView = {
        isOpen: true,
        stackId: action.payload.stackId,
        initialCardIndex: action.payload.cardIndex,
      };
    },
    closeProjectedCardView(state) {
      state.projectedCardView = {
        isOpen: false,
        stackId: null,
        initialCardIndex: 0,
      };
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
  setFullScreen,
  openProjectedCardView,
  closeProjectedCardView,
} = uiSlice.actions;

export default uiSlice.reducer;
