import { useState, useEffect } from "react";
import { DockMinimized } from "./DockMinimized";
import { DockExpanded } from "./DockExpanded";
import { CardDeck } from "@/components/Cards";
import { StackDialog, CardDialog } from "@/components/Dialogs";
import { mockApi } from "@/utils/mockApi";
import type { Stack, Card } from "@/types";

export function Dock() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeStackId, setActiveStackId] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Data state
  const [stacks, setStacks] = useState<Stack[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dialog state
  const [stackDialogOpen, setStackDialogOpen] = useState(false);
  const [editingStack, setEditingStack] = useState<Stack | undefined>();
  const [cardDialogOpen, setCardDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | undefined>();

  // Refresh stacks to get updated card counts
  const refreshStacks = async () => {
    const updatedStacks = await mockApi.getStacks();
    setStacks(updatedStacks);
  };

  // Load initial data
  useEffect(() => {
    async function loadData() {
      try {
        const [stacksData, cardsData] = await Promise.all([
          mockApi.getStacks(),
          mockApi.getCards(),
        ]);
        setStacks(stacksData);
        setCards(cardsData);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleStackClick = (stackId: string) => {
    setActiveStackId((prev) => (prev === stackId ? null : stackId));
  };

  const handleAddStack = () => {
    setEditingStack(undefined);
    setStackDialogOpen(true);
  };

  const handleSaveStack = async (name: string, coverUrl: string) => {
    try {
      if (editingStack) {
        const updated = await mockApi.updateStack(editingStack.id, {
          name,
          coverUrl,
        });
        setStacks((prev) =>
          prev.map((s) => (s.id === editingStack.id ? updated : s))
        );
      } else {
        const newStack = await mockApi.createStack({ name, coverUrl });
        setStacks((prev) => [...prev, newStack]);
      }
    } catch (error) {
      console.error("Failed to save stack:", error);
    }
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const handleAddCard = () => {
    setEditingCard(undefined);
    setCardDialogOpen(true);
  };

  const handleEditCard = (card: Card) => {
    setEditingCard(card);
    setCardDialogOpen(true);
  };

  const handleSaveCard = async (data: {
    name: string;
    description: string;
    coverUrl: string;
    stackId: string;
  }) => {
    try {
      if (editingCard) {
        const updated = await mockApi.updateCard(editingCard.id, {
          name: data.name,
          description: data.description || undefined,
          coverUrl: data.coverUrl,
          stackId: data.stackId,
        });
        setCards((prev) =>
          prev.map((c) => (c.id === editingCard.id ? updated : c))
        );
        await refreshStacks();
      } else {
        const newCard = await mockApi.createCard({
          name: data.name,
          description: data.description || undefined,
          coverUrl: data.coverUrl,
          stackId: data.stackId,
        });
        setCards((prev) => [...prev, newCard]);
        await refreshStacks();
      }
    } catch (error) {
      console.error("Failed to save card:", error);
    }
  };

  const handleDeleteCard = async (card: Card) => {
    try {
      await mockApi.deleteCard(card.id);
      setCards((prev) => prev.filter((c) => c.id !== card.id));
      await refreshStacks();
    } catch (error) {
      console.error("Failed to delete card:", error);
    }
  };

  const filteredStacks = stacks.filter((stack) =>
    stack.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeStack = stacks.find((s) => s.id === activeStackId);
  const activeStackCards = cards.filter((c) => c.stackId === activeStackId);

  if (!isExpanded) {
    return <DockMinimized onExpand={() => setIsExpanded(true)} />;
  }

  if (isLoading) {
    return <DockMinimized onExpand={() => setIsExpanded(true)} />;
  }

  return (
    <>
      {activeStackId && activeStack && (
        <CardDeck
          key={activeStackId}
          stackName={activeStack.name}
          cards={activeStackCards}
          onClose={() => setActiveStackId(null)}
          onAddCard={handleAddCard}
          onEditCard={handleEditCard}
          onDeleteCard={handleDeleteCard}
        />
      )}
      <DockExpanded
        stacks={filteredStacks}
        activeStackId={activeStackId}
        searchQuery={searchQuery}
        isSearchOpen={isSearchOpen}
        onMinimize={() => setIsExpanded(false)}
        onAddStack={handleAddStack}
        onStackClick={handleStackClick}
        onSearchChange={setSearchQuery}
        onSearchToggle={() => setIsSearchOpen(true)}
        onSearchClose={handleSearchClose}
      />

      <StackDialog
        open={stackDialogOpen}
        onClose={() => setStackDialogOpen(false)}
        stack={editingStack}
        onSave={handleSaveStack}
      />

      <CardDialog
        open={cardDialogOpen}
        onClose={() => setCardDialogOpen(false)}
        card={editingCard}
        stacks={stacks}
        initialStackId={activeStackId ?? undefined}
        onSave={handleSaveCard}
      />
    </>
  );
}
