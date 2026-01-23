import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { mockApi } from "@/utils/mockApi";
import type {
  Stack,
  Card,
  CreateStackRequest,
  UpdateStackRequest,
  CreateCardRequest,
  UpdateCardRequest,
} from "@/types";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Stack", "Card"],
  endpoints: (builder) => ({
    // Stack endpoints
    getStacks: builder.query<Stack[], void>({
      queryFn: async () => {
        try {
          const stacks = await mockApi.getStacks();
          return { data: stacks };
        } catch (error) {
          return { error: { message: String(error) } };
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Stack" as const, id })),
              { type: "Stack", id: "LIST" },
            ]
          : [{ type: "Stack", id: "LIST" }],
    }),

    createStack: builder.mutation<Stack, CreateStackRequest>({
      queryFn: async (request) => {
        try {
          const stack = await mockApi.createStack(request);
          return { data: stack };
        } catch (error) {
          return { error: { message: String(error) } };
        }
      },
      invalidatesTags: [{ type: "Stack", id: "LIST" }],
    }),

    updateStack: builder.mutation<Stack, { id: string; request: UpdateStackRequest }>({
      queryFn: async ({ id, request }) => {
        try {
          const stack = await mockApi.updateStack(id, request);
          return { data: stack };
        } catch (error) {
          return { error: { message: String(error) } };
        }
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Stack", id },
        { type: "Stack", id: "LIST" },
      ],
    }),

    deleteStack: builder.mutation<void, string>({
      queryFn: async (id) => {
        try {
          await mockApi.deleteStack(id);
          return { data: undefined };
        } catch (error) {
          return { error: { message: String(error) } };
        }
      },
      invalidatesTags: [
        { type: "Stack", id: "LIST" },
        { type: "Card", id: "LIST" },
      ],
    }),

    // Card endpoints
    getCards: builder.query<Card[], string | void>({
      queryFn: async (stackId) => {
        try {
          const cards = await mockApi.getCards(stackId || undefined);
          return { data: cards };
        } catch (error) {
          return { error: { message: String(error) } };
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Card" as const, id })),
              { type: "Card", id: "LIST" },
            ]
          : [{ type: "Card", id: "LIST" }],
    }),

    createCard: builder.mutation<Card, CreateCardRequest>({
      queryFn: async (request) => {
        try {
          const card = await mockApi.createCard(request);
          return { data: card };
        } catch (error) {
          return { error: { message: String(error) } };
        }
      },
      invalidatesTags: [
        { type: "Card", id: "LIST" },
        { type: "Stack", id: "LIST" },
      ],
    }),

    updateCard: builder.mutation<Card, { id: string; request: UpdateCardRequest }>({
      queryFn: async ({ id, request }) => {
        try {
          const card = await mockApi.updateCard(id, request);
          return { data: card };
        } catch (error) {
          return { error: { message: String(error) } };
        }
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Card", id },
        { type: "Card", id: "LIST" },
        { type: "Stack", id: "LIST" },
      ],
    }),

    deleteCard: builder.mutation<void, string>({
      queryFn: async (id) => {
        try {
          await mockApi.deleteCard(id);
          return { data: undefined };
        } catch (error) {
          return { error: { message: String(error) } };
        }
      },
      invalidatesTags: [
        { type: "Card", id: "LIST" },
        { type: "Stack", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetStacksQuery,
  useCreateStackMutation,
  useUpdateStackMutation,
  useDeleteStackMutation,
  useGetCardsQuery,
  useCreateCardMutation,
  useUpdateCardMutation,
  useDeleteCardMutation,
} = apiSlice;
