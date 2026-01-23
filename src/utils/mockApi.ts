import type {
  Stack,
  Card,
  CreateStackRequest,
  UpdateStackRequest,
  CreateCardRequest,
  UpdateCardRequest,
} from "@/types";
import { GRADIENTS } from "@/constants";

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

// Seed data
function getSeedData(): StorageData {
  const timestamp = now();
  const stacks: Stack[] = [
    {
      id: "1",
      name: "Favorites",
      coverUrl: GRADIENTS[0],
      cardCount: 3,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: "2",
      name: "Read Later",
      coverUrl: GRADIENTS[1],
      cardCount: 2,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: "3",
      name: "Shopping",
      coverUrl: GRADIENTS[2],
      cardCount: 1,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ];

  const cards: Card[] = [
    {
      id: "c1",
      stackId: "1",
      name: "Beautiful Sunset",
      description: "A stunning view of the sunset over the mountains",
      coverUrl: "https://picsum.photos/seed/sunset/280/400",
      position: 0,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: "c2",
      stackId: "1",
      name: "City Lights",
      description: "Night view of the city skyline",
      coverUrl: "https://picsum.photos/seed/city/280/400",
      position: 1,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: "c3",
      stackId: "1",
      name: "Ocean Waves",
      description: "Peaceful beach scene with rolling waves",
      coverUrl: "https://picsum.photos/seed/ocean/280/400",
      position: 2,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: "c4",
      stackId: "2",
      name: "Forest Trail",
      coverUrl: "https://picsum.photos/seed/forest/280/400",
      position: 0,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: "c5",
      stackId: "2",
      name: "Mountain Peak",
      description: "Snow-capped mountain at sunrise",
      coverUrl: "https://picsum.photos/seed/mountain/280/400",
      position: 1,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: "c6",
      stackId: "3",
      name: "Desert Dunes",
      coverUrl: "https://picsum.photos/seed/desert/280/400",
      position: 0,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ];

  return { stacks, cards };
}

function loadFromStorage(): StorageData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as StorageData;
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

// Initialize data
let data: StorageData = loadFromStorage();

// Stack methods
async function getStacks(): Promise<Stack[]> {
  await delay();
  return [...data.stacks];
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
  return stack;
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
  return data.stacks[index];
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
  if (stackId) {
    return data.cards
      .filter((c) => c.stackId === stackId)
      .sort((a, b) => a.position - b.position);
  }
  return [...data.cards];
}

async function createCard(request: CreateCardRequest): Promise<Card> {
  await delay();
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

  // Update stack card count
  const stackIndex = data.stacks.findIndex((s) => s.id === request.stackId);
  if (stackIndex !== -1) {
    data.stacks[stackIndex].cardCount++;
    data.stacks[stackIndex].updatedAt = now();
  }

  saveToStorage(data);
  return card;
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

  // If moving to different stack, update card counts
  if (request.stackId && request.stackId !== oldCard.stackId) {
    const oldStackIndex = data.stacks.findIndex(
      (s) => s.id === oldCard.stackId
    );
    const newStackIndex = data.stacks.findIndex((s) => s.id === request.stackId);

    if (oldStackIndex !== -1) {
      data.stacks[oldStackIndex].cardCount--;
      data.stacks[oldStackIndex].updatedAt = now();
    }
    if (newStackIndex !== -1) {
      data.stacks[newStackIndex].cardCount++;
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
  return data.cards[index];
}

async function deleteCard(id: string): Promise<void> {
  await delay();
  const index = data.cards.findIndex((c) => c.id === id);
  if (index === -1) {
    throw new Error(`Card not found: ${id}`);
  }

  const card = data.cards[index];

  // Update stack card count
  const stackIndex = data.stacks.findIndex((s) => s.id === card.stackId);
  if (stackIndex !== -1) {
    data.stacks[stackIndex].cardCount--;
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
