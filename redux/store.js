import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./userRedux";
import confettiReducer from "./confettiRedux";
import donationViewsReducer from "./donationViewsRedux";
import fullPageLoadingReducer from "./fullPageLoadingRedux";
import profileCompletionReducer from "./profileCompletionRedux";
import ticketArrReducer from "./addTicketRedux";
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";



const createNoopStorage = () => {
  return {
    getItem(_key) {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem(_key) {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

const persistUserStoreConfig = {
  key: "user",
  storage,
};

const rootReducer = combineReducers({
    user: persistReducer(persistUserStoreConfig, userReducer),
    confetti: confettiReducer,
    donationViews: donationViewsReducer,
    fullPageLoader: fullPageLoadingReducer,
    profileCompletion: profileCompletionReducer,
    ticketArr: ticketArrReducer
  });
  
  const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV === 'development',
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  });


  export const persistor = persistStore(store);
export default store;
