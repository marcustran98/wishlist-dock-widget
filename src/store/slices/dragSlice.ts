import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Card } from "@/types";

interface DragState {
  isDragging: boolean;
  draggedCard: Card | null;
  sourceStackId: string | null;
  hoveredStackId: string | null;
  dragPosition: { x: number; y: number } | null;
}

const initialState: DragState = {
  isDragging: false,
  draggedCard: null,
  sourceStackId: null,
  hoveredStackId: null,
  dragPosition: null,
};

const dragSlice = createSlice({
  name: "drag",
  initialState,
  reducers: {
    startDrag(state, action: PayloadAction<Card>) {
      state.isDragging = true;
      state.draggedCard = action.payload;
      state.sourceStackId = action.payload.stackId;
    },
    updateDragPosition(
      state,
      action: PayloadAction<{ x: number; y: number }>
    ) {
      state.dragPosition = action.payload;
    },
    setHoveredStack(state, action: PayloadAction<string | null>) {
      state.hoveredStackId = action.payload;
    },
    endDrag(state) {
      state.isDragging = false;
      state.draggedCard = null;
      state.sourceStackId = null;
      state.hoveredStackId = null;
      state.dragPosition = null;
    },
  },
});

export const { startDrag, updateDragPosition, setHoveredStack, endDrag } =
  dragSlice.actions;

export default dragSlice.reducer;
