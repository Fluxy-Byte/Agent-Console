import { configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { rootReducer } from "./rootReducer";

const persistConfig = {
  key: "agent-console",
  storage,
  // Cache de UI só — GET /api/auth/get-session é sempre revalidado no boot
  // (useBootstrapSession), então persistir aqui só evita um flash de "carregando"
  // no refresh, nunca é a fonte de verdade de autenticação/autorização.
  whitelist: ["auth", "activeCompany"] as string[],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE],
      },
    }),
});

export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;
