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

// Database Synchronization logic
let lastSyncedStateStr = "";
let syncTimeout: any;

if (typeof window !== 'undefined') {
  // Push to DB
  store.subscribe(() => {
    const state = store.getState();
    try {
      localStorage.setItem('ordolait_state', JSON.stringify(state));
    } catch (e) {
      console.error("Error saving state to localStorage", e);
    }

    const stateStr = JSON.stringify(state);
    if (stateStr !== lastSyncedStateStr) {
      lastSyncedStateStr = stateStr;
      
      clearTimeout(syncTimeout);
      syncTimeout = setTimeout(async () => {
        try {
          await fetch('/api/state', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: stateStr
          });
        } catch (e) {
          console.error("Error pushing state", e);
        }
      }, 500); // Debounce
    }
  });
}

export const syncStateFromDB = async () => {
  try {
    const res = await fetch('/api/state');
    if (res.ok) {
      const json = await res.json();
      if (json.data) {
        lastSyncedStateStr = JSON.stringify(json.data);
        store.dispatch({ type: 'HYDRATE_STATE', payload: json.data });
      }
    }
  } catch (e) {
    console.error("Error fetching state", e);
  }
}

export type RootState = ReturnType<typeof appReducer>
export type AppDispatch = typeof store.dispatch

