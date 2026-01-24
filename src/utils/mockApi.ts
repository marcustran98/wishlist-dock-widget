import type {
  Stack,
  Card,
  CreateStackRequest,
  UpdateStackRequest,
  CreateCardRequest,
  UpdateCardRequest,
} from "@/types";

const STORAGE_KEY = "wishlist-dock-data";

// Random delay to simulate network latency
function delay(min = 200, max = 400): Promise<void> {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

function now(): string {
  return new Date().toISOString();
}

interface StorageData {
  stacks: Stack[];
  cards: Card[];
}

// Initial empty data (no seed data)
function getSeedData(): StorageData {
  return { stacks: [], cards: [] };
}

function loadFromStorage(): StorageData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as StorageData;
      // Validate data structure
      if (!Array.isArray(parsed.stacks)) parsed.stacks = [];
      if (!Array.isArray(parsed.cards)) parsed.cards = [];
      // Remove orphaned cards (cards with non-existent stackId)
      const stackIds = new Set(parsed.stacks.map((s) => s.id));
      parsed.cards = parsed.cards.filter((c) => stackIds.has(c.stackId));
      return parsed;
    }
  } catch (e) {
    console.error("Failed to load from localStorage:", e);
  }
  return getSeedData();
}

function saveToStorage(data: StorageData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save to localStorage:", e);
  }
}

// Ensure cardCount matches actual cards in each stack
function syncStackCardCounts(): void {
  data.stacks.forEach((stack) => {
    const actualCount = data.cards.filter((c) => c.stackId === stack.id).length;
    stack.cardCount = actualCount;
  });
}

// Initialize data and sync card counts
let data: StorageData = loadFromStorage();
syncStackCardCounts();
saveToStorage(data);

// Stack methods
async function getStacks(): Promise<Stack[]> {
  await delay();
  // Return deep copies to prevent RTK Query from freezing our internal state
  return data.stacks.map((stack) => ({ ...stack }));
}

async function createStack(request: CreateStackRequest): Promise<Stack> {
  await delay();
  const stack: Stack = {
    id: generateId(),
    name: request.name,
    coverUrl: request.coverUrl,
    cardCount: 0,
    createdAt: now(),
    updatedAt: now(),
  };
  data.stacks.push(stack);
  saveToStorage(data);
  return { ...stack };
}

async function updateStack(
  id: string,
  request: UpdateStackRequest
): Promise<Stack> {
  await delay();
  const index = data.stacks.findIndex((s) => s.id === id);
  if (index === -1) {
    throw new Error(`Stack not found: ${id}`);
  }
  data.stacks[index] = {
    ...data.stacks[index],
    ...request,
    updatedAt: now(),
  };
  saveToStorage(data);
  return { ...data.stacks[index] };
}

async function deleteStack(id: string): Promise<void> {
  await delay();
  const index = data.stacks.findIndex((s) => s.id === id);
  if (index === -1) {
    throw new Error(`Stack not found: ${id}`);
  }
  data.stacks.splice(index, 1);
  // Also delete all cards in this stack
  data.cards = data.cards.filter((c) => c.stackId !== id);
  saveToStorage(data);
}

// Card methods
async function getCards(stackId?: string): Promise<Card[]> {
  await delay();
  // Return deep copies to prevent RTK Query from freezing our internal state
  if (stackId) {
    return data.cards
      .filter((c) => c.stackId === stackId)
      .sort((a, b) => a.position - b.position)
      .map((card) => ({ ...card }));
  }
  return data.cards.map((card) => ({ ...card }));
}

async function createCard(request: CreateCardRequest): Promise<Card> {
  await delay();

  // Validate stack exists
  const stackIndex = data.stacks.findIndex((s) => s.id === request.stackId);
  if (stackIndex === -1) {
    throw new Error(`Stack not found: ${request.stackId}`);
  }

  const stackCards = data.cards.filter((c) => c.stackId === request.stackId);
  const maxPosition = stackCards.reduce(
    (max, c) => Math.max(max, c.position),
    -1
  );

  const card: Card = {
    id: generateId(),
    stackId: request.stackId,
    name: request.name,
    description: request.description,
    coverUrl: request.coverUrl,
    position: maxPosition + 1,
    createdAt: now(),
    updatedAt: now(),
  };
  data.cards.push(card);

  // Update stack card count (safe increment)
  data.stacks[stackIndex].cardCount =
    (data.stacks[stackIndex].cardCount || 0) + 1;
  data.stacks[stackIndex].updatedAt = now();

  saveToStorage(data);
  return { ...card };
}

async function updateCard(
  id: string,
  request: UpdateCardRequest
): Promise<Card> {
  await delay();
  const index = data.cards.findIndex((c) => c.id === id);
  if (index === -1) {
    throw new Error(`Card not found: ${id}`);
  }

  const oldCard = data.cards[index];
  const newStackId = request.stackId ?? oldCard.stackId;

  // If moving to different stack, update card counts safely
  if (request.stackId && request.stackId !== oldCard.stackId) {
    const oldStackIndex = data.stacks.findIndex(
      (s) => s.id === oldCard.stackId
    );
    const newStackIndex = data.stacks.findIndex(
      (s) => s.id === request.stackId
    );

    if (oldStackIndex !== -1) {
      data.stacks[oldStackIndex].cardCount = Math.max(
        0,
        (data.stacks[oldStackIndex].cardCount || 0) - 1
      );
      data.stacks[oldStackIndex].updatedAt = now();
    }
    if (newStackIndex !== -1) {
      data.stacks[newStackIndex].cardCount =
        (data.stacks[newStackIndex].cardCount || 0) + 1;
      data.stacks[newStackIndex].updatedAt = now();
    }
  }

  data.cards[index] = {
    ...oldCard,
    ...request,
    stackId: newStackId,
    updatedAt: now(),
  };

  saveToStorage(data);
  return { ...data.cards[index] };
}

async function deleteCard(id: string): Promise<void> {
  await delay();
  const index = data.cards.findIndex((c) => c.id === id);
  if (index === -1) {
    throw new Error(`Card not found: ${id}`);
  }

  const card = data.cards[index];

  // Update stack card count (prevent negative)
  const stackIndex = data.stacks.findIndex((s) => s.id === card.stackId);
  if (stackIndex !== -1) {
    data.stacks[stackIndex].cardCount = Math.max(
      0,
      (data.stacks[stackIndex].cardCount || 0) - 1
    );
    data.stacks[stackIndex].updatedAt = now();
  }

  data.cards.splice(index, 1);
  saveToStorage(data);
}

// Reset to seed data (useful for testing)
function resetData(): void {
  data = getSeedData();
  saveToStorage(data);
}

export const mockApi = {
  getStacks,
  createStack,
  updateStack,
  deleteStack,
  getCards,
  createCard,
  updateCard,
  deleteCard,
  resetData,
};
