import { useState, useDeferredValue } from "react";
import { DockMinimized } from "./DockMinimized";
import { DockExpanded } from "./DockExpanded";
import { CardView, DragOverlay } from "@/components/Cards";
import { FullScreenView } from "@/components/FullScreen";
import { StackDialog, CardDialog } from "@/components/Dialogs";
import { ConfirmDialog } from "@/components/common";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setExpanded,
  setActiveStack,
  setSearchQuery,
  setSearchOpen,
  openStackDialog,
  openCardDialog,
  closeDialogs,
  setFullScreen,
} from "@/store/slices/uiSlice";
import {
  useGetStacksQuery,
  useGetCardsQuery,
  useCreateStackMutation,
  useUpdateStackMutation,
  useDeleteStackMutation,
  useCreateCardMutation,
  useUpdateCardMutation,
  useDeleteCardMutation,
} from "@/store/api/apiSlice";
import type { Card, Stack } from "@/types";

interface DockProps {
  themeMode: "light" | "dark";
  onToggleTheme: () => void;
  // Portal container for Shadow DOM support
  portalContainer?: HTMLElement | null;
}

export function Dock({ themeMode, onToggleTheme, portalContainer }: DockProps) {
  const dispatch = useAppDispatch();

  const {
    isExpanded,
    isFullScreen,
    activeStackId,
    searchQuery,
    isSearchOpen,
    stackDialogOpen,
    cardDialogOpen,
    editingStack,
    editingCard,
  } = useAppSelector((state) => state.ui);

  const { data: stacks = [], isLoading: stacksLoading } = useGetStacksQuery();
  const { data: cards = [], isLoading: cardsLoading } = useGetCardsQuery();

  const [createStack] = useCreateStackMutation();
  const [updateStack] = useUpdateStackMutation();
  const [deleteStack] = useDeleteStackMutation();
  const [createCard] = useCreateCardMutation();
  const [updateCard] = useUpdateCardMutation();
  const [deleteCard] = useDeleteCardMutation();

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    stack: Stack | null;
  }>({ open: false, stack: null });

  // Confirm dialog state for cards
  const [cardConfirmDialog, setCardConfirmDialog] = useState<{
    open: boolean;
    card: Card | null;
  }>({ open: false, card: null });

  const handleStackClick = (stackId: string) => {
    dispatch(setActiveStack(activeStackId === stackId ? null : stackId));
  };

  const handleAddStack = () => {
    dispatch(openStackDialog(undefined));
  };

  const handleSaveStack = async (name: string, coverUrl: string) => {
    try {
      if (editingStack) {
        await updateStack({ id: editingStack.id, request: { name, coverUrl } });
      } else {
        await createStack({ name, coverUrl }).unwrap();
      }
    } catch (error) {
      console.error("Failed to save stack:", error);
    }
  };

  const handleEditStack = (stack: Stack) => {
    dispatch(openStackDialog(stack));
  };

  const handleDeleteStack = (stack: Stack) => {
    setConfirmDialog({ open: true, stack });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDialog.stack) return;
    const stackId = confirmDialog.stack.id;

    try {
      await deleteStack(stackId);
      if (activeStackId === stackId) {
        dispatch(setActiveStack(null));
      }
    } catch (error) {
      console.error("Failed to delete stack:", error);
    } finally {
      setConfirmDialog({ open: false, stack: null });
    }
  };

  const handleCancelDelete = () => {
    setConfirmDialog({ open: false, stack: null });
  };

  const handleSearchClose = () => {
    dispatch(setSearchOpen(false));
  };

  const handleEnterFullScreen = () => {
    dispatch(setFullScreen(true));
  };

  const handleExitFullScreen = () => {
    dispatch(setFullScreen(false));
  };

  const handleAddCard = () => {
    dispatch(openCardDialog(undefined));
  };

  const handleAddCardToStack = (stackId: string) => {
    dispatch(setActiveStack(stackId));
    dispatch(openCardDialog(undefined));
  };

  const handleEditCard = (card: Card) => {
    dispatch(openCardDialog(card));
  };

  const handleSaveCard = async (data: {
    name: string;
    description: string;
    coverUrl: string;
    stackId: string;
  }) => {
    try {
      if (editingCard) {
        await updateCard({
          id: editingCard.id,
          request: {
            name: data.name,
            description: data.description || undefined,
            coverUrl: data.coverUrl,
            stackId: data.stackId,
          },
        });
      } else {
        await createCard({
          name: data.name,
          description: data.description || undefined,
          coverUrl: data.coverUrl,
          stackId: data.stackId,
        }).unwrap();
      }
    } catch (error) {
      console.error("Failed to save card:", error);
    }
  };

  const handleDeleteCard = (card: Card) => {
    setCardConfirmDialog({ open: true, card });
  };

  const handleCloseCardDeck = () => {
    dispatch(setActiveStack(null));
  };

  const handleConfirmDeleteCard = async () => {
    if (!cardConfirmDialog.card) return;
    const cardId = cardConfirmDialog.card.id;

    try {
      await deleteCard(cardId).unwrap();
    } catch (error) {
      console.error("Failed to delete card:", error);
    } finally {
      setCardConfirmDialog({ open: false, card: null });
    }
  };

  const handleCancelDeleteCard = () => {
    setCardConfirmDialog({ open: false, card: null });
  };

  const handleCardDrop = async (card: Card, targetStackId: string) => {
    if (card.stackId === targetStackId) return;

    try {
      await updateCard({
        id: card.id,
        request: { stackId: targetStackId },
      });
    } catch (error) {
      console.error("Failed to move card:", error);
    }
  };

  const handleTrashDrop = async (card: Card) => {
    try {
      await deleteCard(card.id).unwrap();
    } catch (error) {
      console.error("Failed to delete card:", error);
    }
  };

  const deferredSearchQuery = useDeferredValue(searchQuery);

  const filteredStacks = stacks.filter((stack) =>
    stack.name.toLowerCase().includes(deferredSearchQuery.toLowerCase()),
  );

  const activeStack = stacks.find((s) => s.id === activeStackId);
  const activeStackCards = cards.filter((c) => c.stackId === activeStackId);

  const isLoading = stacksLoading || cardsLoading;

  if (!isExpanded) {
    return <DockMinimized onExpand={() => dispatch(setExpanded(true))} />;
  }

  if (isLoading) {
    return <DockMinimized onExpand={() => dispatch(setExpanded(true))} />;
  }

  if (isFullScreen) {
    return (
      <>
        <FullScreenView
          stacks={filteredStacks}
          cards={cards}
          searchQuery={searchQuery}
          onSearchChange={(value) => dispatch(setSearchQuery(value))}
          onClose={handleExitFullScreen}
          onAddStack={handleAddStack}
          onEditStack={handleEditStack}
          onDeleteStack={handleDeleteStack}
          onAddCard={handleAddCardToStack}
          onEditCard={handleEditCard}
          onDeleteCard={handleDeleteCard}
          onMoveCard={handleCardDrop}
          themeMode={themeMode}
          onToggleTheme={onToggleTheme}
        />

        <DragOverlay portalContainer={portalContainer} />

        <StackDialog
          open={stackDialogOpen}
          onClose={() => dispatch(closeDialogs())}
          stack={editingStack}
          onSave={handleSaveStack}
        />

        <CardDialog
          open={cardDialogOpen}
          onClose={() => dispatch(closeDialogs())}
          card={editingCard}
          stacks={stacks}
          initialStackId={activeStackId ?? undefined}
          onSave={handleSaveCard}
        />

        <ConfirmDialog
          open={confirmDialog.open}
          title="Delete Stack"
          message={`Are you sure you want to delete "${confirmDialog.stack?.name}"? This will also delete all cards in this stack.`}
          confirmText="Delete"
          cancelText="Cancel"
          severity="error"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />

        <ConfirmDialog
          open={cardConfirmDialog.open}
          title="Delete Card"
          message={`Are you sure you want to delete "${cardConfirmDialog.card?.name}"?`}
          confirmText="Delete"
          cancelText="Cancel"
          severity="warning"
          onConfirm={handleConfirmDeleteCard}
          onCancel={handleCancelDeleteCard}
        />
      </>
    );
  }

  return (
    <>
      {activeStackId && activeStack && !cardDialogOpen && (
        <CardView
          key={activeStackId}
          displayMode="dock"
          stack={activeStack}
          cards={activeStackCards}
          onClose={handleCloseCardDeck}
          onAddCard={handleAddCard}
          onEditCard={handleEditCard}
          onCardDrop={handleCardDrop}
          onTrashDrop={handleTrashDrop}
        />
      )}
      <DockExpanded
        stacks={filteredStacks}
        activeStackId={activeStackId}
        searchQuery={searchQuery}
        isSearchOpen={isSearchOpen}
        onMinimize={() => dispatch(setExpanded(false))}
        onFullScreen={handleEnterFullScreen}
        onAddStack={handleAddStack}
        onStackClick={handleStackClick}
        onEditStack={handleEditStack}
        onDeleteStack={handleDeleteStack}
        onSearchChange={(value) => dispatch(setSearchQuery(value))}
        onSearchToggle={() => dispatch(setSearchOpen(true))}
        onSearchClose={handleSearchClose}
      />

      <DragOverlay portalContainer={portalContainer} />

      <StackDialog
        open={stackDialogOpen}
        onClose={() => dispatch(closeDialogs())}
        stack={editingStack}
        onSave={handleSaveStack}
      />

      <CardDialog
        open={cardDialogOpen}
        onClose={() => dispatch(closeDialogs())}
        card={editingCard}
        stacks={stacks}
        initialStackId={activeStackId ?? undefined}
        onSave={handleSaveCard}
      />

      <ConfirmDialog
        open={confirmDialog.open}
        title="Delete Stack"
        message={`Are you sure you want to delete "${confirmDialog.stack?.name}"? This will also delete all cards in this stack.`}
        confirmText="Delete"
        cancelText="Cancel"
        severity="error"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <ConfirmDialog
        open={cardConfirmDialog.open}
        title="Delete Card"
        message={`Are you sure you want to delete "${cardConfirmDialog.card?.name}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        severity="warning"
        onConfirm={handleConfirmDeleteCard}
        onCancel={handleCancelDeleteCard}
      />
    </>
  );
}
