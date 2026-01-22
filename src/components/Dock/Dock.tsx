import { useState } from "react";
import { GRADIENTS } from "@/constants";
import { DockMinimized } from "./DockMinimized";
import { DockExpanded } from "./DockExpanded";
import { CardDeck } from "@/components/Cards";

interface Stack {
  id: string;
  name: string;
  coverUrl: string;
  cardCount: number;
}

interface Card {
  id: string;
  name: string;
  description?: string;
  coverUrl: string;
}

const mockStacks: Stack[] = [
  { id: "1", name: "Favorites", coverUrl: GRADIENTS[0], cardCount: 3 },
  { id: "2", name: "Read Later", coverUrl: GRADIENTS[1], cardCount: 5 },
  { id: "3", name: "Shopping", coverUrl: GRADIENTS[2], cardCount: 2 },
];

const mockCards: Card[] = [
  {
    id: "c1",
    name: "Beautiful Sunset",
    description: "A stunning view of the sunset over the mountains",
    coverUrl: "https://picsum.photos/seed/sunset/280/400",
  },
  {
    id: "c2",
    name: "City Lights",
    description: "Night view of the city skyline",
    coverUrl: "https://picsum.photos/seed/city/280/400",
  },
  {
    id: "c3",
    name: "Ocean Waves",
    description: "Peaceful beach scene with rolling waves",
    coverUrl: "https://picsum.photos/seed/ocean/280/400",
  },
  {
    id: "c4",
    name: "Forest Trail",
    coverUrl: "https://picsum.photos/seed/forest/280/400",
  },
];

export function Dock() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeStackId, setActiveStackId] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleStackClick = (stackId: string) => {
    setActiveStackId((prev) => (prev === stackId ? null : stackId));
  };

  const handleAddStack = () => {
    console.log("Add stack clicked");
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const handleAddCard = () => {
    console.log("Add card clicked");
  };

  const handleEditCard = (card: Card) => {
    console.log("Edit card clicked", card);
  };

  const handleDeleteCard = (card: Card) => {
    console.log("Delete card clicked", card);
  };

  const filteredStacks = mockStacks.filter((stack) =>
    stack.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeStack = mockStacks.find((s) => s.id === activeStackId);

  if (!isExpanded) {
    return <DockMinimized onExpand={() => setIsExpanded(true)} />;
  }

  return (
    <>
      {activeStackId && activeStack && (
        <CardDeck
          stackId={activeStackId}
          stackName={activeStack.name}
          cards={mockCards}
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
    </>
  );
}
