import { configureStore } from "@reduxjs/toolkit"
import simulatorReducer from "./simulatorSlice"

export const store = configureStore({
  reducer: {
    simulator: simulatorReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
