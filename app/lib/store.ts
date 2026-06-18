import { configureStore, combineReducers } from "@reduxjs/toolkit"
import simulatorReducer from "./simulatorSlice"
import orderReducer from "./orderSlice"

const appReducer = combineReducers({
  simulator: simulatorReducer,
  order: orderReducer,
})

const rootReducer = (state: any, action: any) => {
  if (action.type === 'HYDRATE_STATE') {
    return {
      ...state,
      ...action.payload
    }
  }
  return appReducer(state, action)
}

export const store = configureStore({
  reducer: rootReducer,
})

// Subscribe to store changes to save the state
if (typeof window !== 'undefined') {
  store.subscribe(() => {
    const state = store.getState();
    try {
      localStorage.setItem('ordolait_state', JSON.stringify(state));
    } catch (e) {
      console.error("Error saving state to localStorage", e);
    }
  });
}

export type RootState = ReturnType<typeof appReducer>
export type AppDispatch = typeof store.dispatch
