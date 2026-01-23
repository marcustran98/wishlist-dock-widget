export interface Stack {
  id: string;
  name: string;
  coverUrl: string;
  cardCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Card {
  id: string;
  stackId: string;
  name: string;
  description?: string;
  coverUrl: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStackRequest {
  name: string;
  coverUrl: string;
}

export interface UpdateStackRequest {
  name?: string;
  coverUrl?: string;
}

export interface CreateCardRequest {
  stackId: string;
  name: string;
  description?: string;
  coverUrl: string;
}

export interface UpdateCardRequest {
  stackId?: string;
  name?: string;
  description?: string;
  coverUrl?: string;
}

export interface Notification {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

export type ThemeMode = "light" | "dark";
