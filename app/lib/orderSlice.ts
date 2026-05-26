import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type OrderState = {
  orderQty: number
  gramPerPot: number
  whiteMassKg: number
  milkReceivedVolume: number
  milkReceptionValue: number
  targetValue: number
  osmosedVolume: number
  pasteurized: boolean
  cuve: string
  sentAtia: boolean
  sentGrunwald: boolean
  status: "idle" | "order" | "osmosis" | "pasto" | "cuve" | "dispatched"
}

const initialState: OrderState = {
  orderQty: 0,
  gramPerPot: 0,
  whiteMassKg: 0,
  milkReceivedVolume: 0,
  milkReceptionValue: 0,
  targetValue: 0,
  osmosedVolume: 0,
  pasteurized: false,
  cuve: "",
  sentAtia: false,
  sentGrunwald: false,
  status: "idle",
}

const computeWhiteMass = (orderQty: number, gramPerPot: number) =>
  Number(((orderQty * gramPerPot) / 1000).toFixed(3))

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrderQty(state, action: PayloadAction<number>) {
      state.orderQty = action.payload
      state.whiteMassKg = computeWhiteMass(state.orderQty, state.gramPerPot)
      state.status = state.orderQty > 0 ? "order" : "idle"
    },
    setGramPerPot(state, action: PayloadAction<number>) {
      state.gramPerPot = action.payload
      state.whiteMassKg = computeWhiteMass(state.orderQty, state.gramPerPot)
      state.status = state.gramPerPot > 0 ? "order" : state.status
    },
    setMilkReceivedVolume(state, action: PayloadAction<number>) {
      state.milkReceivedVolume = action.payload
    },
    setMilkReceptionValue(state, action: PayloadAction<number>) {
      state.milkReceptionValue = action.payload
    },
    setTargetValue(state, action: PayloadAction<number>) {
      state.targetValue = action.payload
    },
    performOsmose(state) {
      if (state.milkReceivedVolume <= 0 || state.milkReceptionValue <= 0 || state.targetValue <= 0) {
        return
      }
      state.osmosedVolume = Number(
        (state.milkReceivedVolume * state.milkReceptionValue / state.targetValue).toFixed(3)
      )
      state.status = "osmosis"
    },
    performPasteurize(state) {
      if (state.osmosedVolume <= 0) {
        return
      }
      state.pasteurized = true
      state.status = "pasto"
    },
    assignCuve(state, action: PayloadAction<string>) {
      state.cuve = action.payload
      state.status = "cuve"
    },
    sendToMachine(state, action: PayloadAction<"atia" | "grunwald">) {
      if (action.payload === "atia") {
        state.sentAtia = true
      } else {
        state.sentGrunwald = true
      }
      if (state.sentAtia && state.sentGrunwald) {
        state.status = "dispatched"
      }
    },
    resetOrder() {
      return initialState
    },
  },
})

export const {
  setOrderQty,
  setGramPerPot,
  setMilkReceivedVolume,
  setMilkReceptionValue,
  setTargetValue,
  performOsmose,
  performPasteurize,
  assignCuve,
  sendToMachine,
  resetOrder,
} = orderSlice.actions

export default orderSlice.reducer
