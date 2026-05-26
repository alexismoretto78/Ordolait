import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type SimulatorState = {
  time: number
  running: boolean
  value: number
}

const initialState: SimulatorState = {
  time: 0,
  running: true,
  value: 0,
}

const simulatorSlice = createSlice({
  name: "simulator",
  initialState,
  reducers: {
    toggleRunning(state) {
      state.running = !state.running
    },
    reset(state) {
      state.time = 0
      state.value = 0
      state.running = true
    },
    step(state, action: PayloadAction<number>) {
      state.time += action.payload
      state.value += Math.random() - 0.5
    },
  },
})

export const { toggleRunning, reset, step } = simulatorSlice.actions
export default simulatorSlice.reducer
