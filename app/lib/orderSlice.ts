import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type TimingInfo = {
  transferTime: number // minutes TLC->TLS
  osmoseTime: number // minutes
  powderTime: number // minutes
  pastoTime: number // minutes
  startTime: number // timestamp
}

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
  tlcVolumes: {
    tlc1: number
    tlc2: number
    tlc3: number
    tlc4: number
  }
  osmosedVolume: number
  pasteurized: boolean
  selectedCFs: string[]
  selectedTLSs: string[]
  sentAtia: boolean
  sentGrunwald: boolean
  timing: TimingInfo
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
  tlcVolumes: { tlc1: 0, tlc2: 0, tlc3: 0, tlc4: 0 },
  osmosedVolume: 0,
  pasteurized: false,
  selectedCFs: [],
  selectedTLSs: [],
  sentAtia: false,
  sentGrunwald: false,
  timing: { transferTime: 0, osmoseTime: 0, powderTime: 0, pastoTime: 0, startTime: 0 },
  status: "idle",
}

const computeWhiteMass = (orderQty: number, gramPerPot: number) =>
  Number(((orderQty * gramPerPot) / 1000).toFixed(3))

const TLS_TANKS = [
  { name: "TLS1", capacity: 11000 },
  { name: "TLS2", capacity: 5200 },
  { name: "TLS3", capacity: 5200 },
]

const TLC_TANKS = [
  { name: "TLC1", capacity: 30000 },
  { name: "TLC2", capacity: 30000 },
  { name: "TLC3", capacity: 30000 },
  { name: "TLC4", capacity: 30000 },
]

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

const selectCuvesForVolume = (volume: number) => {
  const selected: string[] = []
  if (volume <= 0) return selected
  let accumulated = 0
  // trier par capacité décroissante pour utiliser d'abord les plus grosses cuves
  const sorted = CF_TANKS.slice().sort((a, b) => {
    if (a.capacity !== b.capacity) return b.capacity - a.capacity
    return a.name.localeCompare(b.name)
  })
  for (const tank of sorted) {
    selected.push(tank.name)
    accumulated += tank.capacity
    if (accumulated >= volume) break
  }
  return selected
}

const getSelectedCFCapacity = (selectedCFs: string[]) =>
  selectedCFs.reduce((total, name) => {
    const tank = CF_TANKS.find((t) => t.name === name)
    return total + (tank?.capacity ?? 0)
  }, 0)

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
  const caps = TLS_TANKS.map((t) => t.capacity)
  const keys: (keyof typeof alloc)[] = ["tls1", "tls2", "tls3"]
  for (let i = 0; i < keys.length; i++) {
    const take = Math.min(remaining, caps[i])
    alloc[keys[i]] = Number(take.toFixed(3))
    remaining = Number((remaining - take).toFixed(3))
    if (remaining <= 0) break
  }
  return alloc
}

const selectTLSForVolume = (volume: number) => {
  const selected: string[] = []
  if (volume <= 0) return selected
  let accumulated = 0
  // ordre fixe: TLS1 puis TLS2 puis TLS3
  const ordered = TLS_TANKS.slice()
  for (const tank of ordered) {
    selected.push(tank.name)
    accumulated += tank.capacity
    if (accumulated >= volume) break
  }
  return selected
}

const getSelectedTLSCapacity = (selectedTLSs: string[]) =>
  selectedTLSs.reduce((total, name) => {
    const tank = TLS_TANKS.find((t) => t.name === name)
    return total + (tank?.capacity ?? 0)
  }, 0)

// Calculs de temps pour chaque étape (en minutes)
const computeTransferTime = (volume: number) => {
  // 20 min pour 5200L -> proportionnel
  return Number((volume * 20 / 5200).toFixed(1))
}

const computeOsmoseTime = (volume: number) => {
  // 90 min pour 5200L -> proportionnel
  return Number((volume * 90 / 5200).toFixed(1))
}

const computePowderTime = (volume: number) => {
  // 30 min pour 4000L -> proportionnel
  return Number((volume * 30 / 4000).toFixed(1))
}

const computePastoTime = (volume: number) => {
  // 5000L/heure -> volume/5000*60 minutes
  return Number((volume / 5000 * 60).toFixed(1))
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
      // TLS toujours basés sur le volume de lait cru
      if (state.milkReceivedVolume > 0) {
        state.tlsVolumes = distributeToTLS(state.milkReceivedVolume)
        state.selectedTLSs = selectTLSForVolume(state.milkReceivedVolume)
      }
      // CF/pasteurisation se basent uniquement sur le volume osmosé
      if (state.osmosedVolume > 0) {
        state.pasteurized = true
        state.selectedCFs = selectCuvesForVolume(state.osmosedVolume)
        state.status = state.selectedCFs.length > 0 ? "cuve" : state.status
      }
      // Mettre à jour les timings
      state.timing.transferTime = computeTransferTime(state.milkReceivedVolume)
      state.timing.osmoseTime = computeOsmoseTime(state.milkReceivedVolume)
      state.timing.powderTime = computePowderTime(state.osmosedVolume)
      state.timing.pastoTime = computePastoTime(state.osmosedVolume)
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
      if (state.milkReceivedVolume > 0) {
        state.tlsVolumes = distributeToTLS(state.milkReceivedVolume)
        state.selectedTLSs = selectTLSForVolume(state.milkReceivedVolume)
      }
      if (state.osmosedVolume > 0) {
        state.pasteurized = true
        state.selectedCFs = selectCuvesForVolume(state.osmosedVolume)
        state.status = state.selectedCFs.length > 0 ? "cuve" : state.status
      }
      // Mettre à jour les timings
      state.timing.transferTime = computeTransferTime(state.milkReceivedVolume)
      state.timing.osmoseTime = computeOsmoseTime(state.milkReceivedVolume)
      state.timing.powderTime = computePowderTime(state.osmosedVolume)
      state.timing.pastoTime = computePastoTime(state.osmosedVolume)
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
      if (state.milkReceivedVolume > 0) {
        state.tlsVolumes = distributeToTLS(state.milkReceivedVolume)
        state.selectedTLSs = selectTLSForVolume(state.milkReceivedVolume)
      }
      if (state.osmosedVolume > 0) {
        state.pasteurized = true
        state.selectedCFs = selectCuvesForVolume(state.osmosedVolume)
        state.status = state.selectedCFs.length > 0 ? "cuve" : state.status
      }
      // Mettre à jour les timings
      state.timing.transferTime = computeTransferTime(state.milkReceivedVolume)
      state.timing.osmoseTime = computeOsmoseTime(state.milkReceivedVolume)
      state.timing.powderTime = computePowderTime(state.osmosedVolume)
      state.timing.pastoTime = computePastoTime(state.osmosedVolume)
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
      const volumeForCF = state.osmosedVolume > 0 ? state.osmosedVolume : state.milkReceivedVolume
      if (volumeForCF > 0) {
        state.pasteurized = true
        state.selectedCFs = selectCuvesForVolume(volumeForCF)
        state.selectedTLSs = selectTLSForVolume(state.milkReceivedVolume)
        state.status = state.selectedCFs.length > 0 ? "cuve" : state.status
      }
      // Mettre à jour les timings
      state.timing.transferTime = computeTransferTime(state.milkReceivedVolume)
      state.timing.osmoseTime = computeOsmoseTime(state.milkReceivedVolume)
      state.timing.powderTime = computePowderTime(state.osmosedVolume)
      state.timing.pastoTime = computePastoTime(state.osmosedVolume)
    },
    performPasteurize(state) {
      if (state.osmosedVolume <= 0) {
        return
      }
      state.pasteurized = true
      state.selectedCFs = selectCuvesForVolume(state.osmosedVolume)
      state.status = state.selectedCFs.length > 0 ? "cuve" : "pasto"
    },
    // sélection automatique des TLS selon le volume de lait cru
    autoFillTLS(state) {
      state.selectedTLSs = selectTLSForVolume(state.milkReceivedVolume)
    },
    toggleTLSSelection(state, action: PayloadAction<string>) {
      const selected = state.selectedTLSs.includes(action.payload)
      if (selected) {
        state.selectedTLSs = state.selectedTLSs.filter((name) => name !== action.payload)
      } else {
        const currentCapacity = getSelectedTLSCapacity(state.selectedTLSs)
        if (currentCapacity >= state.milkReceivedVolume) {
          return
        }
        state.selectedTLSs = [...state.selectedTLSs, action.payload]
      }
    },
    toggleCuveSelection(state, action: PayloadAction<string>) {
      const selected = state.selectedCFs.includes(action.payload)
      if (selected) {
        state.selectedCFs = state.selectedCFs.filter((name) => name !== action.payload)
      } else {
        const currentCapacity = getSelectedCFCapacity(state.selectedCFs)
        if (currentCapacity >= state.osmosedVolume) {
          return
        }
        state.selectedCFs = [...state.selectedCFs, action.payload]
      }
      state.status = state.selectedCFs.length > 0 ? "cuve" : state.status
    },
    assignCuve(state, action: PayloadAction<string>) {
      state.selectedCFs = [action.payload]
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
    setTLCVolume(state, action: PayloadAction<{ tank: keyof typeof state.tlcVolumes; volume: number }>) {
      state.tlcVolumes[action.payload.tank] = action.payload.volume
    },
    calculateTimings(state) {
      state.timing.startTime = Date.now()
      state.timing.transferTime = computeTransferTime(state.milkReceivedVolume)
      state.timing.osmoseTime = computeOsmoseTime(state.milkReceivedVolume)
      state.timing.powderTime = computePowderTime(state.osmosedVolume)
      state.timing.pastoTime = computePastoTime(state.osmosedVolume)
    },
    resetOrder() {
      return initialState
    },
  },
})

export const {
  setOrderQty,
  setGramPerPot,
  setMilkReceptionValue,
  setTargetValue,
  performPasteurize,
  autoFillTLS,
  toggleTLSSelection,
  toggleCuveSelection,
  assignCuve,
  sendToMachine,
  setTLCVolume,
  calculateTimings,
  resetOrder,
} = orderSlice.actions

export { CF_TANKS, TLS_TANKS, TLC_TANKS }
export default orderSlice.reducer
