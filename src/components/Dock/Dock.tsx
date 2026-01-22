import { useState } from "react";
import { GRADIENTS } from "@/constants";
import { DockMinimized } from "./DockMinimized";
import { DockExpanded } from "./DockExpanded";

interface Stack {
  id: string;
  name: string;
  coverUrl: string;
  cardCount: number;
}

const mockStacks: Stack[] = [
  { id: "1", name: "Favorites", coverUrl: GRADIENTS[0], cardCount: 3 },
  { id: "2", name: "Read Later", coverUrl: GRADIENTS[1], cardCount: 5 },
  { id: "3", name: "Shopping", coverUrl: GRADIENTS[2], cardCount: 2 },
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

  const filteredStacks = mockStacks.filter((stack) =>
    stack.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isExpanded) {
    return <DockMinimized onExpand={() => setIsExpanded(true)} />;
  }

  return (
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
  );
}
