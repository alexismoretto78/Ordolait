import { configureStore } from "@reduxjs/toolkit"
import simulatorReducer from "./simulatorSlice"
import orderReducer from "./orderSlice"

export const store = configureStore({
  reducer: {
    simulator: simulatorReducer,
    order: orderReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
