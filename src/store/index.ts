import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./slices/uiSlice";
import dragReducer from "./slices/dragSlice";
import { apiSlice } from "./api/apiSlice";

export function createStore() {
  return configureStore({
    reducer: {
      ui: uiReducer,
      drag: dragReducer,
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
  });
}

export const store = createStore();

export type AppStore = ReturnType<typeof createStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
