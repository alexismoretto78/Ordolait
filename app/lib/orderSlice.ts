import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type OrderState = {
  orderQty: number
  gramPerPot: number
  whiteMassKg: number
  milkReceivedVolume: number
  milkReceptionValue: number
  targetValue: number
  tlsVolumes: {
    tls1: number
    tls2: number
    tls3: number
  }
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
  tlsVolumes: { tls1: 0, tls2: 0, tls3: 0 },
  osmosedVolume: 0,
  pasteurized: false,
  cuve: "",
  sentAtia: false,
  sentGrunwald: false,
  status: "idle",
}

const computeWhiteMass = (orderQty: number, gramPerPot: number) =>
  Number(((orderQty * gramPerPot) / 1000).toFixed(3))

const TLS_CAPACITIES = [11000, 5200, 5200]

const CF_TANKS = [
  { name: "CF4", capacity: 550 },
  { name: "CF5", capacity: 550 },
  { name: "CF1", capacity: 1100 },
  { name: "CF2", capacity: 1100 },
  { name: "CF3", capacity: 1100 },
  { name: "CF11", capacity: 2200 },
  { name: "CF12", capacity: 2200 },
  { name: "CF13", capacity: 2200 },
  { name: "CF14", capacity: 2200 },
  { name: "CF15", capacity: 2200 },
  { name: "CF16", capacity: 2200 },
  { name: "CF17", capacity: 2200 },
]

const selectCuveForVolume = (volume: number) => {
  if (volume <= 0) return ""
  const sorted = CF_TANKS.slice().sort((a, b) => {
    if (a.capacity !== b.capacity) return a.capacity - b.capacity
    return a.name.localeCompare(b.name)
  })
  const tank = sorted.find((tank) => volume <= tank.capacity)
  return tank ? tank.name : ""
}

// calcule le volume de lait cru nécessaire pour obtenir un volume final
// finalVolume (L) sachant la concentration initiale Ci et la
// concentration finale Cf. Formule: V_initial = V_final * Cf / Ci
const computeRequiredRawMilk = (finalVolume: number, Ci: number, Cf: number) => {
  if (Ci <= 0) return 0
  return Number((finalVolume * Cf / Ci).toFixed(3))
}

const computeOsmosedVolume = (milkVolume: number, reception: number, target: number) => {
  if (milkVolume <= 0 || reception <= 0 || target <= 0) return 0
  return Number((milkVolume * reception / target).toFixed(3))
}

const distributeToTLS = (totalVolume: number) => {
  let remaining = totalVolume
  const alloc = { tls1: 0, tls2: 0, tls3: 0 }
  const caps = TLS_CAPACITIES.slice()
  const keys: (keyof typeof alloc)[] = ["tls1", "tls2", "tls3"]
  for (let i = 0; i < keys.length; i++) {
    const take = Math.min(remaining, caps[i])
    alloc[keys[i]] = Number(take.toFixed(3))
    remaining = Number((remaining - take).toFixed(3))
    if (remaining <= 0) break
  }
  return alloc
}

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrderQty(state, action: PayloadAction<number>) {
      state.orderQty = action.payload
      state.whiteMassKg = computeWhiteMass(state.orderQty, state.gramPerPot)
      state.status = state.orderQty > 0 ? "order" : "idle"
      // si les concentrations sont renseignées, calculer le lait cru nécessaire
      if (state.whiteMassKg > 0 && state.milkReceptionValue > 0 && state.targetValue > 0) {
        state.milkReceivedVolume = computeRequiredRawMilk(
          state.whiteMassKg,
          state.milkReceptionValue,
          state.targetValue
        )
        state.tlsVolumes = distributeToTLS(state.milkReceivedVolume)
      }
      state.osmosedVolume = computeOsmosedVolume(
        state.milkReceivedVolume,
        state.milkReceptionValue,
        state.targetValue
      )
    },
    setGramPerPot(state, action: PayloadAction<number>) {
      state.gramPerPot = action.payload
      state.whiteMassKg = computeWhiteMass(state.orderQty, state.gramPerPot)
      state.status = state.gramPerPot > 0 ? "order" : state.status
      if (state.whiteMassKg > 0 && state.milkReceptionValue > 0 && state.targetValue > 0) {
        state.milkReceivedVolume = computeRequiredRawMilk(
          state.whiteMassKg,
          state.milkReceptionValue,
          state.targetValue
        )
        state.tlsVolumes = distributeToTLS(state.milkReceivedVolume)
      }
      state.osmosedVolume = computeOsmosedVolume(
        state.milkReceivedVolume,
        state.milkReceptionValue,
        state.targetValue
      )
    },
    setMilkReceivedVolume(state, action: PayloadAction<number>) {
      state.milkReceivedVolume = action.payload
      state.tlsVolumes = distributeToTLS(state.milkReceivedVolume)
      state.osmosedVolume = computeOsmosedVolume(
        state.milkReceivedVolume,
        state.milkReceptionValue,
        state.targetValue
      )
    },
    setMilkReceptionValue(state, action: PayloadAction<number>) {
      state.milkReceptionValue = action.payload
      // recalculer le lait reçu si on a déjà la masse blanche et la cible
      if (state.whiteMassKg > 0 && state.milkReceptionValue > 0 && state.targetValue > 0) {
        state.milkReceivedVolume = computeRequiredRawMilk(
          state.whiteMassKg,
          state.milkReceptionValue,
          state.targetValue
        )
        state.tlsVolumes = distributeToTLS(state.milkReceivedVolume)
      }
      state.osmosedVolume = computeOsmosedVolume(
        state.milkReceivedVolume,
        state.milkReceptionValue,
        state.targetValue
      )
    },
    setTargetValue(state, action: PayloadAction<number>) {
      state.targetValue = action.payload
      if (state.whiteMassKg > 0 && state.milkReceptionValue > 0 && state.targetValue > 0) {
        state.milkReceivedVolume = computeRequiredRawMilk(
          state.whiteMassKg,
          state.milkReceptionValue,
          state.targetValue
        )
        state.tlsVolumes = distributeToTLS(state.milkReceivedVolume)
      }
      state.osmosedVolume = computeOsmosedVolume(
        state.milkReceivedVolume,
        state.milkReceptionValue,
        state.targetValue
      )
    },
    performPasteurize(state) {
      if (state.osmosedVolume <= 0) {
        return
      }
      state.pasteurized = true
      state.cuve = selectCuveForVolume(state.osmosedVolume)
      state.status = state.cuve ? "cuve" : "pasto"
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
  performPasteurize,
  assignCuve,
  sendToMachine,
  resetOrder,
} = orderSlice.actions

export { CF_TANKS }
export default orderSlice.reducer
