// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";


export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store;
