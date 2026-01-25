import { useEffect, useDeferredValue } from "react";
import { Box } from "@mui/material";
import { Layers as LayersIcon } from "@mui/icons-material";
import { FullScreenHeader } from "./FullScreenHeader";
import { StackSection } from "./StackSection";
import { EmptyState } from "./EmptyState";
import { CardView } from "@/components/Cards";
import { Z_INDEX } from "@/constants";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  openProjectedCardView,
  closeProjectedCardView,
} from "@/store/slices/uiSlice";
import type { Card, Stack } from "@/types";

interface FullScreenViewProps {
  stacks: Stack[];
  cards: Card[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClose: () => void;
  onAddStack: () => void;
  onEditStack: (stack: Stack) => void;
  onDeleteStack: (stack: Stack) => void;
  onAddCard: (stackId: string) => void;
  onEditCard: (card: Card) => void;
  onDeleteCard: (card: Card) => void;
  onMoveCard: (card: Card, targetStackId: string) => void;
  themeMode: "light" | "dark";
  onToggleTheme: () => void;
}

export function FullScreenView({
  stacks,
  cards,
  searchQuery,
  onSearchChange,
  onClose,
  onAddStack,
  onEditStack,
  onDeleteStack,
  onAddCard,
  onEditCard,
  onDeleteCard,
  onMoveCard,
  themeMode,
  onToggleTheme,
}: FullScreenViewProps) {
  const dispatch = useAppDispatch();
  const { projectedCardView } = useAppSelector((state) => state.ui);

  // ESC key to close (when card view modal is not open)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !projectedCardView.isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, projectedCardView.isOpen]);

  const handleOpenProjectedView = (stackId: string, cardIndex: number) => {
    dispatch(openProjectedCardView({ stackId, cardIndex }));
  };

  const handleCloseProjectedView = () => {
    dispatch(closeProjectedCardView());
  };

  const deferredSearchQuery = useDeferredValue(searchQuery);

  const filteredStacks = deferredSearchQuery
    ? stacks.filter((stack) =>
        stack.name.toLowerCase().includes(deferredSearchQuery.toLowerCase()),
      )
    : stacks;

  const projectedStack =
    projectedCardView.isOpen && projectedCardView.stackId
      ? stacks.find((s) => s.id === projectedCardView.stackId)
      : null;

  const projectedCards =
    projectedCardView.isOpen && projectedCardView.stackId
      ? cards.filter((c) => c.stackId === projectedCardView.stackId)
      : [];

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: Z_INDEX.FULLSCREEN,
        backgroundColor: "background.default",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <FullScreenHeader
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onClose={onClose}
        onAddStack={onAddStack}
        themeMode={themeMode}
        onToggleTheme={onToggleTheme}
      />

      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          py: { xs: 2, sm: 2.5, md: 3 },
          px: { xs: 1, sm: 1.5, md: 2 },
        }}
      >
        {filteredStacks.length === 0 ? (
          <EmptyState
            icon={<LayersIcon sx={{ fontSize: { xs: 48, md: 64 } }} />}
            message={
              searchQuery
                ? "No stacks match your search"
                : "No stacks yet - Create your first stack"
            }
            actionLabel={searchQuery ? "Clear Search" : "Create Stack"}
            onAction={searchQuery ? () => onSearchChange("") : onAddStack}
          />
        ) : (
          filteredStacks.map((stack) => (
            <StackSection
              key={stack.id}
              stack={stack}
              cards={cards.filter((c) => c.stackId === stack.id)}
              allStacks={stacks}
              onAddCard={() => onAddCard(stack.id)}
              onExpandStack={() => handleOpenProjectedView(stack.id, 0)}
              onEditStack={() => onEditStack(stack)}
              onDeleteStack={() => onDeleteStack(stack)}
              onEditCard={onEditCard}
              onDeleteCard={onDeleteCard}
              onMoveCard={onMoveCard}
              onCardClick={(cardIndex) =>
                handleOpenProjectedView(stack.id, cardIndex)
              }
            />
          ))
        )}
      </Box>

      {projectedCardView.isOpen && projectedStack && (
        <CardView
          displayMode="modal"
          stack={projectedStack}
          cards={projectedCards}
          initialCardIndex={projectedCardView.initialCardIndex}
          allStacks={stacks}
          onClose={handleCloseProjectedView}
          onAddCard={() => onAddCard(projectedStack.id)}
          onEditCard={onEditCard}
          onTrashDrop={onDeleteCard}
          onMoveCard={onMoveCard}
        />
      )}
    </Box>
  );
}
