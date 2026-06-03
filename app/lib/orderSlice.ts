import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type TimingInfo = {
  transferTime: number // minutes TLC->TLS
  osmoseTime: number // minutes
  powderTime: number // minutes
  pastoTime: number // minutes
  startTime: number // timestamp
  maturationTime: number // minutes (maturation in cuves)
}

export type Batch = {
  id: string
  lotNumber: string // aammjjhhmm
  volume: number // L
  protein: number // g/L (matière protéique)
  fat: number // g/L (matière grasse)
  milkType: MilkType
}

export type ProductReference = {
  id: string
  name: string
  potsQty: number
  gramPerPot: number
  milkType?: MilkType
}

export type Command = {
  id: string
  name: string
  references: ProductReference[]
  whiteMassKg: number
  milkReceivedVolume: number
  milkReceptionValue: number // Ci - calculated dynamically from TLC batches used
  targetValue: number // Cf - target protein level after osmosis
  tlsVolumes: { tls1: number; tls2: number; tls3: number }
  selectedTLSs: string[]
  selectedCFs: string[]
  cfDestinations: { [tankName: string]: "atia" | "grunwald" | "both" }
  cfSentStatus: { [tankName: string]: { atia: boolean; grunwald: boolean } }
  refDestinations: { [refId: string]: "atia" | "grunwald" | "both" }
  refSentStatus: { [refId: string]: { atia: boolean; grunwald: boolean } }
  refPotsLaunched: { [refId: string]: { atia?: number; grunwald?: number } }
  timing: TimingInfo
  status: "idle" | "order" | "osmosis" | "pasto" | "cuve" | "dispatched"
  osmosedVolume: number
  pasteurized: boolean
  milkType: MilkType
  isSkyr: boolean
  skyrMilkType?: "fcv3" | "ecreme_savoie" | "ecreme_montagne"
  skyrDirectPasto?: boolean
  isCFManual?: boolean
}

export type CommandSimResult = {
  id: string
  name: string
  transferStart: number
  transferEnd: number
  osmoseStart: number
  osmoseEnd: number
  powderStart: number
  powderEnd: number
  pastoStart: number
  pastoEnd: number
  maturationStart: number
  maturationEnd: number
  packagingStart: number
  packagingEnd: number
  packagingAtiaDuration: number
  packagingGrunDuration: number
  totalDuration: number
  firstTankName?: string
  firstTankMaturationEnd?: number
  firstTankEmptyEnd?: number
  referencesResults?: { refId: string; name: string; start: number; end: number }[]
}

export type GanttSegment = {
  startMinute: number
  durationMinutes: number
  color: string
  label?: string
  shortLabel?: string
}

export type GanttTask = {
  key: string
  label: string
  startMinute: number
  durationMinutes: number
  color: string
  segments?: GanttSegment[]
}

export type MultiCommandSimResults = {
  totalDurationMinutes: number
  commandsResults: { [id: string]: CommandSimResult }
  tlcRemainingBatches: {
    tlc1: Batch[]
    tlc2: Batch[]
    tlc3: Batch[]
    tlc4: Batch[]
  }
  ganttTasks: GanttTask[]
}

export type MilkType = "bio" | "fcv3" | "savoie" | "montagne" | "creme" | "ecreme_savoie" | "ecreme_montagne"

export type OrderState = {
  orderQty: number
  gramPerPot: number
  whiteMassKg: number
  milkReceivedVolume: number
  milkReceptionValue: number
  targetValue: number
  tlsVolumes: { tls1: number; tls2: number; tls3: number }
  tlcVolumes: { tlc1: number; tlc2: number; tlc3: number; tlc4: number }
  tlcRemaining: { tlc1: number; tlc2: number; tlc3: number; tlc4: number }
  tlcMilkTypes: { tlc1: MilkType; tlc2: MilkType; tlc3: MilkType; tlc4: MilkType }
  milkType: MilkType
  osmosedVolume: number
  pasteurized: boolean
  selectedCFs: string[]
  selectedTLSs: string[]
  sentAtia: boolean
  sentGrunwald: boolean
  timing: TimingInfo
  status: "idle" | "order" | "osmosis" | "pasto" | "cuve" | "dispatched"
  cfDestinations: { [tankName: string]: "atia" | "grunwald" | "both" }
  cfSentStatus: { [tankName: string]: { atia: boolean; grunwald: boolean } }
  productionStartTime: string
  isSkyr: boolean
  skyrMilkType?: "fcv3" | "ecreme_savoie" | "ecreme_montagne"
  skyrDirectPasto?: boolean

  // TLC Batches State
  tlcBatches: {
    tlc1: Batch[]
    tlc2: Batch[]
    tlc3: Batch[]
    tlc4: Batch[]
    tankPermeat: Batch[]
  }

  // Simulation status fields
  isSimulating: boolean
  simulationDone: boolean
  simulationProgress: number
  simulationStepText: string

  // Washing Configuration
  needs48hWash: boolean
  needsC3Wash: boolean

  // Results
  simulatedTiming: TimingInfo
  simulatedMilkReceivedVolume: number
  simulatedOsmosedVolume: number

  // Multi-command states
  commands: Command[]
  activeCommandId: string
  simulationResults?: MultiCommandSimResults
}

const initialCommand = (id: string, name: string): Command => {
  const selectedCFs = ["CF4", "CF5", "CF1", "CF2", "CF3", "CF11", "CF12", "CF13", "CF14", "CF15"]
  const cfDestinations: { [tankName: string]: "atia" | "grunwald" | "both" } = {}
  const cfSentStatus: { [tankName: string]: { atia: boolean; grunwald: boolean } } = {}

  selectedCFs.forEach(name => {
    cfDestinations[name] = "both"
    cfSentStatus[name] = { atia: false, grunwald: false }
  })

  const references: ProductReference[] = [
    { id: "ref-1", name: "Baiko Nature 125g", potsQty: 80000, gramPerPot: 125 },
    { id: "ref-2", name: "MDD Fraise 120g", potsQty: 40000, gramPerPot: 120 },
  ]

  const refDestinations: { [refId: string]: "atia" | "grunwald" | "both" } = {
    "ref-1": "both",
    "ref-2": "both",
  }

  const refSentStatus: { [refId: string]: { atia: boolean; grunwald: boolean } } = {
    "ref-1": { atia: false, grunwald: false },
    "ref-2": { atia: false, grunwald: false },
  }

  const refPotsLaunched: { [refId: string]: { atia?: number; grunwald?: number } } = {
    "ref-1": {},
    "ref-2": {},
  }

  return {
    id,
    name,
    references,
    refDestinations,
    refSentStatus,
    refPotsLaunched,
    whiteMassKg: 14800, // 80000 * 0.125 + 40000 * 0.12 = 10000 + 4800 = 14800
    milkReceivedVolume: 18385.366,
    milkReceptionValue: 33,
    targetValue: 41,
    tlsVolumes: { tls1: 7985.366, tls2: 5200, tls3: 5200 },
    selectedTLSs: ["TLS1", "TLS2", "TLS3"],
    selectedCFs,
    cfDestinations,
    cfSentStatus,
    timing: { transferTime: 70.7, osmoseTime: 318.2, powderTime: 111, pastoTime: 177.6, startTime: 0, maturationTime: 360 },
    status: "cuve",
    osmosedVolume: 14800,
    pasteurized: true,
    milkType: "bio",
    isSkyr: false,
    skyrMilkType: "fcv3",
    skyrDirectPasto: false,
    isCFManual: false,
  }
}

const initialBatches = () => ({
  tlc1: [
    { id: "batch-1", lotNumber: "2605291200", volume: 30000, protein: 33, fat: 38, milkType: "bio" as MilkType }
  ],
  tlc2: [
    { id: "batch-2", lotNumber: "2605291300", volume: 30000, protein: 34, fat: 39, milkType: "fcv3" as MilkType }
  ],
  tlc3: [
    { id: "batch-3", lotNumber: "2605291400", volume: 30000, protein: 32, fat: 37, milkType: "savoie" as MilkType }
  ],
  tlc4: [
    { id: "batch-4", lotNumber: "2605291500", volume: 30000, protein: 35, fat: 40, milkType: "montagne" as MilkType }
  ],
  tankPermeat: [
    { id: "batch-5", lotNumber: "2605291600", volume: 15000, protein: 0, fat: 400, milkType: "ecreme_savoie" as MilkType }
  ]
})

const initialState: OrderState = {
  orderQty: 120000,
  gramPerPot: 105,
  whiteMassKg: 14800,
  milkReceivedVolume: 18385.366,
  milkReceptionValue: 33,
  targetValue: 41,
  tlsVolumes: { tls1: 7985.366, tls2: 5200, tls3: 5200 },
  tlcVolumes: { tlc1: 30000, tlc2: 30000, tlc3: 30000, tlc4: 30000 },
  tlcRemaining: { tlc1: 30000, tlc2: 30000, tlc3: 30000, tlc4: 30000 },
  tlcMilkTypes: { tlc1: "bio", tlc2: "fcv3", tlc3: "savoie", tlc4: "montagne" },
  milkType: "bio",
  osmosedVolume: 14800,
  pasteurized: true,
  selectedCFs: ["CF4", "CF5", "CF1", "CF2", "CF3", "CF11", "CF12", "CF13", "CF14", "CF15"],
  selectedTLSs: ["TLS1", "TLS2", "TLS3"],
  sentAtia: false,
  sentGrunwald: false,
  timing: { transferTime: 70.7, osmoseTime: 318.2, powderTime: 111, pastoTime: 177.6, startTime: 0, maturationTime: 360 },
  status: "cuve",
  cfDestinations: {},
  cfSentStatus: {},
  productionStartTime: "",
  isSkyr: false,
  skyrMilkType: "fcv3",
  skyrDirectPasto: false,

  tlcBatches: initialBatches(),

  isSimulating: false,
  simulationDone: false,
  simulationProgress: 0,
  simulationStepText: "",

  needs48hWash: false,
  needsC3Wash: false,

  simulatedTiming: { transferTime: 70.7, osmoseTime: 318.2, powderTime: 111, pastoTime: 177.6, startTime: 0, maturationTime: 360 },
  simulatedMilkReceivedVolume: 0,
  simulatedOsmosedVolume: 0,

  // Start with one default command
  commands: [initialCommand("cmd-1", "Commande 1")],
  activeCommandId: "cmd-1",
}

export const getTLCStats = (batches: Batch[]) => {
  if (batches.length === 0) {
    return { volume: 0, protein: 0, fat: 0 }
  }
  const volume = batches.reduce((sum, b) => sum + b.volume, 0)
  const protein = batches.reduce((sum, b) => sum + b.volume * b.protein, 0) / volume
  const fat = batches.reduce((sum, b) => sum + b.volume * b.fat, 0) / volume
  return { volume, protein: Number(protein.toFixed(3)), fat: Number(fat.toFixed(3)) }
}

const TLS_TANKS = [
  { name: "TLS1", capacity: 11000 },
  { name: "TLS2", capacity: 5200 },
  { name: "TLS3", capacity: 5200 },
]

export const TLC_TANKS = [
  { key: "tlc1", name: "TLC1", capacity: 30000 },
  { key: "tlc2", name: "TLC2", capacity: 30000 },
  { key: "tlc3", name: "TLC3", capacity: 30000 },
  { key: "tlc4", name: "TLC4", capacity: 30000 },
  { key: "tankPermeat", name: "Tank Perméat", capacity: 15000 },
] as const

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
  { name: "CF20", capacity: 12000 },
]

export const selectCuvesForVolume = (volume: number, isSkyr: boolean = false) => {
  if (volume <= 0) return []
  if (isSkyr) return ["CF20"]

  const availableCFs = CF_TANKS.filter(t => t.name !== "CF20")
  const n = availableCFs.length
  let bestCombination: typeof CF_TANKS = []
  let bestTotalCapacity = Infinity

  for (let i = 1; i < (1 << n); i++) {
    const currentCombination: typeof CF_TANKS = []
    let currentCapacity = 0

    for (let j = 0; j < n; j++) {
      if ((i & (1 << j)) !== 0) {
        currentCombination.push(availableCFs[j])
        currentCapacity += availableCFs[j].capacity
      }
    }

    if (currentCapacity >= volume) {
      if (currentCapacity < bestTotalCapacity) {
        bestTotalCapacity = currentCapacity
        bestCombination = currentCombination
      } else if (currentCapacity === bestTotalCapacity) {
        if (currentCombination.length < bestCombination.length) {
          bestCombination = currentCombination
        } else if (currentCombination.length === bestCombination.length) {
          const namesCurrent = currentCombination.map(t => t.name).sort().join(",")
          const namesBest = bestCombination.map(t => t.name).sort().join(",")
          if (namesCurrent < namesBest) {
            bestCombination = currentCombination
          }
        }
      }
    }
  }

  if (bestCombination.length === 0) {
    return availableCFs.map(t => t.name)
  }

  return bestCombination.map(t => t.name)
}

const getSelectedCFCapacity = (selectedCFs: string[]) =>
  selectedCFs.reduce((total, name) => {
    const tank = CF_TANKS.find((t) => t.name === name)
    return total + (tank?.capacity ?? 0)
  }, 0)

const initializeNewCFs = (command: Command) => {
  if (!command.cfDestinations) {
    command.cfDestinations = {}
  }
  if (!command.cfSentStatus) {
    command.cfSentStatus = {}
  }

  // Clean up removed tanks
  Object.keys(command.cfDestinations).forEach((name) => {
    if (!command.selectedCFs.includes(name)) {
      delete command.cfDestinations[name]
    }
  })
  Object.keys(command.cfSentStatus).forEach((name) => {
    if (!command.selectedCFs.includes(name)) {
      delete command.cfSentStatus[name]
    }
  })

  // Initialize selected tanks
  command.selectedCFs.forEach((name) => {
    if (!command.cfDestinations[name]) {
      command.cfDestinations[name] = "both"
    }
    if (!command.cfSentStatus[name]) {
      command.cfSentStatus[name] = { atia: false, grunwald: false }
    }
  })
}

const checkIfDispatched = (command: Command) => {
  if (command.references.length === 0) return

  let allDone = true

  command.references.forEach((ref) => {
    const dest = command.refDestinations?.[ref.id] || "both"
    const sent = command.refSentStatus?.[ref.id] || { atia: false, grunwald: false }

    const needsAtia = dest === "atia" || dest === "both"
    const needsGrunwald = dest === "grunwald" || dest === "both"

    if (needsAtia && !sent.atia) {
      allDone = false
    }

    if (needsGrunwald && !sent.grunwald) {
      allDone = false
    }
  })

  if (allDone) {
    command.status = "dispatched"
  } else {
    if (command.status === "dispatched") {
      command.status = "cuve"
    }
  }
}

export const computeRequiredRawMilk = (finalVolume: number, Ci: number, Cf: number) => {
  if (Ci <= 0) return 0
  return Number((finalVolume * Cf / Ci).toFixed(3))
}

export const computeOsmosedVolume = (milkVolume: number, reception: number, target: number) => {
  if (milkVolume <= 0 || reception <= 0 || target <= 0) return 0
  return Number((milkVolume * reception / target).toFixed(3))
}

export const distributeToTLS = (totalVolume: number) => {
  let remaining = totalVolume
  const alloc = { tls1: 0, tls2: 0, tls3: 0 }

  // Priority order: tls2, tls3, tls1
  const keys: (keyof typeof alloc)[] = ["tls2", "tls3", "tls1"]

  // 1. Initial distribution
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const tankName = key.toUpperCase() // "TLS2", "TLS3", "TLS1"
    const tank = TLS_TANKS.find((t) => t.name === tankName)
    const capacity = tank ? tank.capacity : 0

    const take = Math.min(remaining, capacity)
    alloc[key] = Number(take.toFixed(3))
    remaining = Number((remaining - take).toFixed(3))
    if (remaining <= 0) break
  }

  // 2. Adjustments: no less than 1000 L in active TLS
  for (let i = keys.length - 1; i >= 0; i--) {
    const key = keys[i]
    const volume = alloc[key]

    if (volume > 0 && volume < 1000) {
      let needed = Number((1000 - volume).toFixed(3))

      for (let d = 1; d < keys.length; d++) {
        const j = (i - d + keys.length) % keys.length
        const otherKey = keys[j]
        const otherVolume = alloc[otherKey]

        if (otherVolume > 1000) {
          const available = Number((otherVolume - 1000).toFixed(3))
          const toTake = Math.min(needed, available)

          alloc[otherKey] = Number((otherVolume - toTake).toFixed(3))
          alloc[key] = Number((alloc[key] + toTake).toFixed(3))
          needed = Number((needed - toTake).toFixed(3))

          if (needed <= 0) break
        }
      }
    }
  }

  return alloc
}

const selectTLSForVolume = (volume: number) => {
  const alloc = distributeToTLS(volume)
  const selected: string[] = []
  if (alloc.tls1 > 0) selected.push("TLS1")
  if (alloc.tls2 > 0) selected.push("TLS2")
  if (alloc.tls3 > 0) selected.push("TLS3")
  return selected
}

const getSelectedTLSCapacity = (selectedTLSs: string[]) =>
  selectedTLSs.reduce((total, name) => {
    const tank = TLS_TANKS.find((t) => t.name === name)
    return total + (tank?.capacity ?? 0)
  }, 0)

export const computeTransferTime = (volume: number) => {
  return Number((volume * 20 / 5200).toFixed(1))
}

export const computeOsmoseTime = (volume: number, reception: number, target: number) => {
  const fcv = reception > 0 ? target / reception : 1.28
  return Number((volume * (fcv / 1.28) * (90 / 5200)).toFixed(1))
}

export const computePowderTime = (volume: number) => {
  return Number((volume * 25 / 4000).toFixed(1))
}

export const computePastoTime = (volume: number) => {
  return Number((volume / 5000 * 60).toFixed(1))
}

const DEFAULT_MATURATION_MINUTES = 360

const syncActiveCommandToRoot = (state: OrderState) => {
  const active = state.commands.find(c => c.id === state.activeCommandId)
  if (active) {
    const totalPots = active.references.reduce((sum, r) => sum + r.potsQty, 0)
    state.orderQty = totalPots
    state.gramPerPot = totalPots > 0 ? active.references.reduce((sum, r) => sum + r.potsQty * r.gramPerPot, 0) / totalPots : 120
    state.whiteMassKg = active.whiteMassKg
    state.milkReceivedVolume = active.milkReceivedVolume
    state.milkReceptionValue = active.milkReceptionValue
    state.targetValue = active.targetValue
    state.tlsVolumes = active.tlsVolumes
    state.selectedTLSs = active.selectedTLSs
    state.selectedCFs = active.selectedCFs
    state.cfDestinations = active.cfDestinations
    state.cfSentStatus = active.cfSentStatus
    state.timing = active.timing
    state.status = active.status
    state.osmosedVolume = active.osmosedVolume
    state.pasteurized = active.pasteurized
    state.milkType = active.milkType as MilkType
    state.isSkyr = active.isSkyr
    state.skyrMilkType = active.skyrMilkType
    state.skyrDirectPasto = active.skyrDirectPasto

    // Update tlcVolumes derived from tlcBatches
    const keys: (keyof typeof state.tlcVolumes)[] = ["tlc1", "tlc2", "tlc3", "tlc4"]
    keys.forEach(k => {
      const stats = getTLCStats(state.tlcBatches[k])
      state.tlcVolumes[k] = stats.volume
    })
  }
}

const updateActiveCommandFromRoot = (state: OrderState) => {
  const activeIdx = state.commands.findIndex(c => c.id === state.activeCommandId)
  if (activeIdx !== -1) {
    state.commands[activeIdx] = {
      ...state.commands[activeIdx],
      whiteMassKg: state.whiteMassKg,
      milkReceivedVolume: state.milkReceivedVolume,
      milkReceptionValue: state.milkReceptionValue,
      targetValue: state.targetValue,
      tlsVolumes: state.tlsVolumes,
      selectedTLSs: state.selectedTLSs,
      selectedCFs: state.selectedCFs,
      cfDestinations: state.cfDestinations,
      cfSentStatus: state.cfSentStatus,
      timing: state.timing,
      status: state.status,
      osmosedVolume: state.osmosedVolume,
      pasteurized: state.pasteurized,
      milkType: state.milkType,
      isSkyr: state.isSkyr,
      skyrMilkType: state.skyrMilkType,
      skyrDirectPasto: state.skyrDirectPasto,
    }
  }
}

export const recalculateActiveCommandMetrics = (state: OrderState, active: Command) => {
  // 1. Detect which parts are active
  const hasSkyr = active.references.some(r => r.name.toLowerCase().includes("skyr"))
  const hasClassic = active.references.some(r => !r.name.toLowerCase().includes("skyr"))

  active.isSkyr = hasSkyr

  // Helper to get protein level for a given preferred milk type list
  const getCiForTypes = (preferredTypes: MilkType[]) => {
    let totalVol = 0
    let totalProt = 0
    const keys: (keyof typeof state.tlcBatches)[] = ["tlc1", "tlc2", "tlc3", "tlc4", "tankPermeat"]
    
    for (const type of preferredTypes) {
      keys.forEach(k => {
        state.tlcBatches[k].forEach(b => {
          if (b.milkType === type) {
            totalVol += b.volume
            totalProt += b.volume * b.protein
          }
        })
      })
      if (totalVol > 0) return totalProt / totalVol
    }
    return 33.0 // Default if no stock found for preferred types
  }

  // Calculate masses by group
  let skyrWhiteMass = 0
  let baikoMddWhiteMass = 0 // Baiko and MDD
  let vdpWhiteMass = 0      // Val de Praz
  let natureWhiteMass = 0   // Others (Nature)

  active.references.forEach(r => {
    const mass = (r.potsQty * r.gramPerPot) / 1000
    const name = r.name.toLowerCase()
    
    if (name.includes("skyr")) {
      skyrWhiteMass += mass
    } else if (name.includes("baiko") || name.includes("mdd")) {
      baikoMddWhiteMass += mass / 1.05 // Sweetened roughly
    } else if (name.includes("val de praz") || name.includes("vdp")) {
      vdpWhiteMass += mass / 1.05 // Sweetened roughly
    } else {
      // Nature or others
      natureWhiteMass += mass // Unsweetened
    }
  })

  const classicWhiteMass = baikoMddWhiteMass + vdpWhiteMass + natureWhiteMass
  active.whiteMassKg = skyrWhiteMass + (baikoMddWhiteMass * 1.05) + (vdpWhiteMass * 1.05) + natureWhiteMass
  active.status = active.references.length > 0 ? "order" : "idle"

  // Compute Ci for each group
  const skyrCi = getCiForTypes(["fcv3", "ecreme_savoie", "ecreme_montagne", "creme"])
  const baikoMddCi = getCiForTypes(["montagne", "savoie"])
  const vdpCi = getCiForTypes(["savoie"])
  const natureCi = getCiForTypes(["bio"])

  // Variables to accumulate
  let totalMilkReceivedVolume = 0
  let totalOsmosedVolume = 0
  let totalProtReceived = 0 // for average Ci
  
  const processGroup = (whiteMass: number, ci: number) => {
    if (whiteMass <= 0) return { received: 0, osmosed: 0 }
    const received = computeRequiredRawMilk(whiteMass, ci, active.targetValue)
    const osmosed = computeOsmosedVolume(received, ci, active.targetValue)
    totalMilkReceivedVolume += received
    totalOsmosedVolume += osmosed
    totalProtReceived += received * ci
    return { received, osmosed }
  }

  // 3. Compute volumes independently
  if (skyrWhiteMass > 0) {
    if (active.skyrMilkType === "fcv3" && active.skyrDirectPasto) {
      totalMilkReceivedVolume += skyrWhiteMass
      totalOsmosedVolume += skyrWhiteMass
      totalProtReceived += skyrWhiteMass * skyrCi
    } else {
      processGroup(skyrWhiteMass, skyrCi)
    }
  }

  processGroup(baikoMddWhiteMass, baikoMddCi)
  processGroup(vdpWhiteMass, vdpCi)
  processGroup(natureWhiteMass, natureCi)

  active.milkReceivedVolume = totalMilkReceivedVolume
  active.osmosedVolume = totalOsmosedVolume

  const tlsAlloc = distributeToTLS(active.milkReceivedVolume)
  active.tlsVolumes = tlsAlloc
  active.selectedTLSs = selectTLSForVolume(active.milkReceivedVolume)

  // Weighted average protein level
  if (active.milkReceivedVolume > 0) {
    active.milkReceptionValue = Number((totalProtReceived / active.milkReceivedVolume).toFixed(3))
  } else {
    active.milkReceptionValue = 33.0
  }

  // 5. Select Cuves (CF)
  if (active.osmosedVolume > 0) {
    active.pasteurized = true

    if (active.isCFManual) {
      active.selectedCFs = active.selectedCFs.filter(name => {
        const isCF20 = name === "CF20"
        if (isCF20 && !hasSkyr) return false
        if (!isCF20 && !hasClassic) return false
        return true
      })
    } else {
      if (hasSkyr && hasClassic) {
        const nonSkyrCFs = selectCuvesForVolume(active.whiteMassKg - skyrWhiteMass, false)
        active.selectedCFs = Array.from(new Set(["CF20", ...nonSkyrCFs]))
      } else if (hasSkyr) {
        active.selectedCFs = ["CF20"]
      } else {
        active.selectedCFs = selectCuvesForVolume(active.whiteMassKg, false)
      }
    }

    initializeNewCFs(active)
    active.status = active.selectedCFs.length > 0 ? "cuve" : active.status
  } else {
    active.pasteurized = false
    active.selectedCFs = []
  }

  // 6. Calculate Timing
  // We approximate the global timing based on total volumes to keep UI simple
  active.timing.transferTime = computeTransferTime(active.milkReceivedVolume)
  active.timing.osmoseTime = computeOsmoseTime(active.milkReceivedVolume, active.milkReceptionValue, active.targetValue)
  active.timing.powderTime = computePowderTime(active.osmosedVolume)
  active.timing.pastoTime = computePastoTime(active.whiteMassKg)
  active.timing.maturationTime = DEFAULT_MATURATION_MINUTES
}

type TLSToSchedule = {
  commandId: string
  commandIdx: number
  commandName: string
  tlsKey: "tls1" | "tls2" | "tls3" | "direct"
  rawVolume: number
  osmosedVolume: number
  milkType: MilkType
}

// Global simulation executor
export const runMultiCommandSimulation = (
  commands: Command[],
  tlcBatchesInitial: { tlc1: Batch[]; tlc2: Batch[]; tlc3: Batch[]; tlc4: Batch[]; tankPermeat?: Batch[] },
  config?: { needs48hWash: boolean; needsC3Wash: boolean }
): MultiCommandSimResults => {
  let timeOsmosisFree = 0
  let timePowderFree = 0
  let timePastoFree = 0
  let timeGrunwald = 0
  let timeAtia = 0
  let timeWashLine1Free = 0
  let timeWashLine2Free = 0
  let timeOsmoseWashFree = 0
  let timeSoutirageWashFree = 0

  let osmosisCount = 0
  let pastoCount = 0

  // Clone TLC batches to consume them during simulation
  const tlcBatches = {
    tlc1: tlcBatchesInitial.tlc1.map(b => ({ ...b })),
    tlc2: tlcBatchesInitial.tlc2.map(b => ({ ...b })),
    tlc3: tlcBatchesInitial.tlc3.map(b => ({ ...b })),
    tlc4: tlcBatchesInitial.tlc4.map(b => ({ ...b })),
    tankPermeat: tlcBatchesInitial.tankPermeat ? tlcBatchesInitial.tankPermeat.map(b => ({ ...b })) : [],
  }

  let last48hWashEnd = 0

  const cfAvailableAt: { [tankName: string]: number } = {}
  CF_TANKS.forEach(t => { cfAvailableAt[t.name] = 0 })

  const maturationEndAt: { [tankName: string]: number } = {}
  CF_TANKS.forEach(t => { maturationEndAt[t.name] = 0 })

  const tlsAvailableAt = { TLS1: 0, TLS2: 0, TLS3: 0 }
  const commandTankMaturationEnd: { [commandId: string]: { [cfName: string]: number } } = {}

  const commandsResults: { [id: string]: CommandSimResult } = {}
  const ganttTasks: GanttTask[] = []

  const getCommandColor = (idx: number, step: string) => {
    const hues = [220, 142, 275, 38, 345, 95, 195]
    const hue = hues[idx % hues.length]
    switch (step) {
      case "transfer": return `hsl(${hue}, 80%, 60%)`
      case "osmose": return `hsl(${hue}, 75%, 45%)`
      case "pasto": return `hsl(${hue}, 80%, 40%)`
      case "maturation": return `hsl(${hue}, 60%, 50%)`
      case "packaging_atia": return `hsl(${hue}, 50%, 65%)`
      case "packaging_grun": return `hsl(${hue}, 90%, 55%)`
      default: return `hsl(${hue}, 70%, 50%)`
    }
  }

  const commandCFAllocations: { [commandId: string]: { [cfName: string]: number } } = {}
  const commandCFSelectedList: { [commandId: string]: string[] } = {}

  const getCiForTypes = (preferredTypes: MilkType[], batchesState: typeof tlcBatches) => {
    let totalVol = 0
    let totalProt = 0
    const keys: (keyof typeof batchesState)[] = ["tlc1", "tlc2", "tlc3", "tlc4", "tankPermeat"]
    for (const type of preferredTypes) {
      keys.forEach(k => {
        batchesState[k]?.forEach(b => {
          if (b.milkType === type) {
            totalVol += b.volume
            totalProt += b.volume * b.protein
          }
        })
      })
      if (totalVol > 0) return totalProt / totalVol
    }
    return 33.0
  }

  commands.forEach((cmd) => {
    let skyrWhiteMass = 0
    let baikoMddWhiteMass = 0
    let vdpWhiteMass = 0
    let natureWhiteMass = 0

    cmd.references.forEach(r => {
      const mass = (r.potsQty * r.gramPerPot) / 1000
      const name = r.name.toLowerCase()
      if (name.includes("skyr")) skyrWhiteMass += mass
      else if (name.includes("baiko") || name.includes("mdd")) baikoMddWhiteMass += mass / 1.05
      else if (name.includes("val de praz") || name.includes("vdp")) vdpWhiteMass += mass / 1.05
      else natureWhiteMass += mass
    })

    const classicWhiteMass = baikoMddWhiteMass + vdpWhiteMass + natureWhiteMass
    const hasSkyr = skyrWhiteMass > 0
    const hasClassic = classicWhiteMass > 0

    let selectedCFs = cmd.selectedCFs
    if (selectedCFs.length === 0) {
      if (hasSkyr && hasClassic) {
        const nonSkyrCFs = selectCuvesForVolume(classicWhiteMass, false)
        selectedCFs = ["CF20", ...nonSkyrCFs]
      } else if (hasSkyr) {
        selectedCFs = ["CF20"]
      } else {
        selectedCFs = selectCuvesForVolume(classicWhiteMass, false)
      }
    }
    commandCFSelectedList[cmd.id] = selectedCFs

    const cfAllocatedVolumes: { [tank: string]: number } = {}
    let remSkyrVol = skyrWhiteMass
    let remNonSkyrVol = classicWhiteMass

    selectedCFs.forEach(cfName => {
      const tank = CF_TANKS.find(t => t.name === cfName)
      const cap = tank?.capacity ?? 0
      if (cfName === "CF20") {
        const allocated = Math.min(remSkyrVol, cap)
        cfAllocatedVolumes[cfName] = Number(allocated.toFixed(3))
        remSkyrVol = Math.max(0, remSkyrVol - allocated)
      } else {
        const allocated = Math.min(remNonSkyrVol, cap)
        cfAllocatedVolumes[cfName] = Number(allocated.toFixed(3))
        remNonSkyrVol = Math.max(0, remNonSkyrVol - allocated)
      }
    })
    commandCFAllocations[cmd.id] = cfAllocatedVolumes
  })

  // Build sequential list of all active TLS tasks across all commands
  const tlsList: TLSToSchedule[] = []
  
  commands.forEach((cmd, cmdIdx) => {
    let skyrWhiteMass = 0
    let baikoMddWhiteMass = 0
    let vdpWhiteMass = 0
    let natureWhiteMass = 0

    cmd.references.forEach(r => {
      const mass = (r.potsQty * r.gramPerPot) / 1000
      const name = r.name.toLowerCase()
      if (name.includes("skyr")) skyrWhiteMass += mass
      else if (name.includes("baiko") || name.includes("mdd")) baikoMddWhiteMass += mass / 1.05
      else if (name.includes("val de praz") || name.includes("vdp")) vdpWhiteMass += mass / 1.05
      else natureWhiteMass += mass
    })

    const scheduleGroup = (whiteMass: number, preferredTypes: MilkType[], groupName: string) => {
      if (whiteMass <= 0) return
      
      const ci = getCiForTypes(preferredTypes, tlcBatches)
      const reqVol = computeRequiredRawMilk(whiteMass, ci, cmd.targetValue)
      const tlsAlloc = distributeToTLS(reqVol)

      const activeTLSKeys: (keyof typeof tlsAlloc)[] = ["tls2", "tls3", "tls1"]
      activeTLSKeys.forEach((key) => {
        const vol = tlsAlloc[key]
        if (vol > 0) {
          let remainingToDraw = vol
          let totalProtDrawn = 0
          let actualDrawn = 0
          let lastTypeDrawn = preferredTypes[0]

          const tlcKeys: (keyof typeof tlcBatches)[] = ["tlc1", "tlc2", "tlc3", "tlc4", "tankPermeat"]
          
          for (const type of preferredTypes) {
            if (remainingToDraw <= 0) break
            for (const k of tlcKeys) {
              if (remainingToDraw <= 0) break
              const batches = tlcBatches[k]
              if (!batches) continue
              for (let i = 0; i < batches.length; i++) {
                if (remainingToDraw <= 0) break
                const b = batches[i]
                if (b.milkType === type && b.volume > 0) {
                  const draw = Math.min(b.volume, remainingToDraw)
                  b.volume = Number((b.volume - draw).toFixed(3))
                  remainingToDraw = Number((remainingToDraw - draw).toFixed(3))
                  totalProtDrawn += draw * b.protein
                  actualDrawn += draw
                  lastTypeDrawn = type
                }
              }
              tlcBatches[k] = batches.filter(b => b.volume > 0)
            }
          }

          const tlsDrawnProtein = actualDrawn > 0 ? totalProtDrawn / actualDrawn : ci
          const osmVol = computeOsmosedVolume(vol, tlsDrawnProtein, cmd.targetValue)

          tlsList.push({
            commandId: cmd.id,
            commandIdx: cmdIdx,
            commandName: cmd.name + " (" + groupName + ")",
            tlsKey: key,
            rawVolume: vol,
            osmosedVolume: osmVol,
            milkType: lastTypeDrawn,
          })
        }
      })
    }

    if (skyrWhiteMass > 0) {
      if (cmd.skyrMilkType === "fcv3" && cmd.skyrDirectPasto) {
        let remainingToDraw = skyrWhiteMass
        const type = "fcv3"
        const tlcKeys: (keyof typeof tlcBatches)[] = ["tlc1", "tlc2", "tlc3", "tlc4", "tankPermeat"]
        for (const k of tlcKeys) {
          if (remainingToDraw <= 0) break
          const batches = tlcBatches[k]
          if (!batches) continue
          for (let i = 0; i < batches.length; i++) {
            if (remainingToDraw <= 0) break
            const b = batches[i]
            if (b.milkType === type && b.volume > 0) {
              const draw = Math.min(b.volume, remainingToDraw)
              b.volume = Number((b.volume - draw).toFixed(3))
              remainingToDraw = Number((remainingToDraw - draw).toFixed(3))
            }
          }
          tlcBatches[k] = batches.filter(b => b.volume > 0)
        }

        tlsList.push({
          commandId: cmd.id,
          commandIdx: cmdIdx,
          commandName: cmd.name + " (Skyr)",
          tlsKey: "direct",
          rawVolume: skyrWhiteMass,
          osmosedVolume: skyrWhiteMass,
          milkType: type,
        })
      } else {
        scheduleGroup(skyrWhiteMass, ["fcv3", "ecreme_savoie", "ecreme_montagne", "creme"], "Skyr")
      }
    }

    scheduleGroup(baikoMddWhiteMass, ["montagne", "savoie"], "Baiko/MDD")
    scheduleGroup(vdpWhiteMass, ["savoie"], "Val de Praz")
    scheduleGroup(natureWhiteMass, ["bio"], "Nature")
  })

  // Track the filled volumes of CF tanks per command
  const cfTanksFilledForCommand: { [commandId: string]: { [cfName: string]: number } } = {}
  commands.forEach((cmd) => {
    cfTanksFilledForCommand[cmd.id] = {}
    commandCFSelectedList[cmd.id].forEach(cf => {
      cfTanksFilledForCommand[cmd.id][cf] = 0
    })
  })

  // Track detailed metrics for command results
  const cmdMinStart: { [id: string]: number } = {}
  const cmdMaxEnd: { [id: string]: number } = {}
  const cmdTransStart: { [id: string]: number } = {}
  const cmdTransEnd: { [id: string]: number } = {}
  const cmdOsmoseStart: { [id: string]: number } = {}
  const cmdOsmoseEnd: { [id: string]: number } = {}
  const cmdPastoStart: { [id: string]: number } = {}
  const cmdPastoEnd: { [id: string]: number } = {}

  // Process all commands sequentially to ensure cfAvailableAt is correctly propagated
  commands.forEach((cmd, cmdIdx) => {
    const cmdTlsItems = tlsList.filter(t => t.commandId === cmd.id)
    
    // 1. Process TLSs chronologically for this command
    cmdTlsItems.forEach((tlsItem) => {
    const isDirect = tlsItem.tlsKey === "direct"
    const cmd = commands.find(c => c.id === tlsItem.commandId)!

    if (isDirect) {
      // 1. Direct Transfer TLC -> Pasto (CF20)
      const transferStart = 0
      const transferDuration = computeTransferTime(tlsItem.rawVolume)
      const transferEnd = transferStart + transferDuration

      if (cmdTransStart[tlsItem.commandId] === undefined) {
        cmdTransStart[tlsItem.commandId] = transferStart
      } else {
        cmdTransStart[tlsItem.commandId] = Math.min(cmdTransStart[tlsItem.commandId], transferStart)
      }
      cmdTransEnd[tlsItem.commandId] = Math.max(cmdTransEnd[tlsItem.commandId] || 0, transferEnd)

      cmdOsmoseStart[tlsItem.commandId] = transferEnd
      cmdOsmoseEnd[tlsItem.commandId] = transferEnd

      ganttTasks.push({
        key: `${tlsItem.commandId}-skyr-direct-transfer`,
        label: `${tlsItem.commandName} : Transfert direct TLC ➔ Pasto`,
        startMinute: transferStart,
        durationMinutes: transferDuration,
        color: getCommandColor(tlsItem.commandIdx, "transfer"),
      })

      // 2. Direct Pasteurization
      const pastoStart = Math.max(transferEnd, Math.max(timePastoFree, cfAvailableAt["CF20"] || 0))
      const pastoDuration = computePastoTime(tlsItem.osmosedVolume)
      const pastoEnd = pastoStart + pastoDuration
      timePastoFree = pastoEnd

      if (cmdPastoStart[tlsItem.commandId] === undefined) {
        cmdPastoStart[tlsItem.commandId] = pastoStart
      } else {
        cmdPastoStart[tlsItem.commandId] = Math.min(cmdPastoStart[tlsItem.commandId], pastoStart)
      }
      cmdPastoEnd[tlsItem.commandId] = Math.max(cmdPastoEnd[tlsItem.commandId] || 0, pastoEnd)

      ganttTasks.push({
        key: `${tlsItem.commandId}-skyr-direct-pasto`,
        label: `${tlsItem.commandName} : Pasteurisation Directe (CF20)`,
        startMinute: pastoStart,
        durationMinutes: pastoDuration,
        color: getCommandColor(tlsItem.commandIdx, "pasto"),
      })

      // 3. Maturation in CF20
      const maturationStart = pastoEnd
      const maturationEnd = pastoEnd + 360
      maturationEndAt["CF20"] = maturationEnd
      if (!commandTankMaturationEnd[tlsItem.commandId]) {
        commandTankMaturationEnd[tlsItem.commandId] = {}
      }
      commandTankMaturationEnd[tlsItem.commandId]["CF20"] = maturationEnd

      ganttTasks.push({
        key: `${tlsItem.commandId}-skyr-maturation-cf20`,
        label: `${tlsItem.commandName} : Maturation CF20`,
        startMinute: maturationStart,
        durationMinutes: 360,
        color: getCommandColor(tlsItem.commandIdx, "maturation"),
      })

      if (cmdMinStart[tlsItem.commandId] === undefined) {
        cmdMinStart[tlsItem.commandId] = transferStart
      } else {
        cmdMinStart[tlsItem.commandId] = Math.min(cmdMinStart[tlsItem.commandId], transferStart)
      }
    } else {
      // Normal TLS-based processing
      const TLS_NAME = tlsItem.tlsKey.toUpperCase() as "TLS1" | "TLS2" | "TLS3"
      const isEcreme = tlsItem.commandName.includes("Skyr") && (cmd.skyrMilkType === "ecreme_savoie" || cmd.skyrMilkType === "ecreme_montagne")

      let transferStart = tlsAvailableAt[TLS_NAME]
      let transferDuration = computeTransferTime(tlsItem.rawVolume)
      let transferEnd = transferStart + transferDuration

      if (isEcreme) {
        // Skimming step: TLC -> Tank Retentat
        const skimmingStart = 0
        const skimmingDuration = computeTransferTime(tlsItem.rawVolume)
        const skimmingEnd = skimmingStart + skimmingDuration

        ganttTasks.push({
          key: `${tlsItem.commandId}-${TLS_NAME}-skimming`,
          label: `${tlsItem.commandName} : Écrémage TLC ➔ Tank Retentat`,
          startMinute: skimmingStart,
          durationMinutes: skimmingDuration,
          color: "hsl(200, 40%, 75%)",
        })

        // Then transfer Retentat -> TLS
        transferStart = Math.max(skimmingEnd, tlsAvailableAt[TLS_NAME])
        transferEnd = transferStart + transferDuration

        ganttTasks.push({
          key: `${tlsItem.commandId}-${TLS_NAME}-transfer`,
          label: `${tlsItem.commandName} : Transfert Retentat ➔ ${TLS_NAME}`,
          startMinute: transferStart,
          durationMinutes: transferDuration,
          color: getCommandColor(tlsItem.commandIdx, "transfer"),
        })
      } else {
        ganttTasks.push({
          key: `${tlsItem.commandId}-${TLS_NAME}-transfer`,
          label: `${tlsItem.commandName} : Transfert ${TLS_NAME}`,
          startMinute: transferStart,
          durationMinutes: transferDuration,
          color: getCommandColor(tlsItem.commandIdx, "transfer"),
        })
      }

      if (cmdTransStart[tlsItem.commandId] === undefined) {
        cmdTransStart[tlsItem.commandId] = isEcreme ? 0 : transferStart
      } else {
        cmdTransStart[tlsItem.commandId] = Math.min(cmdTransStart[tlsItem.commandId], isEcreme ? 0 : transferStart)
      }
      cmdTransEnd[tlsItem.commandId] = Math.max(cmdTransEnd[tlsItem.commandId] || 0, transferEnd)

      // Get protein level for this specific GANTT task to calculate osmosis time
      let tVol = 0
      let tProt = 0
      const tKeys: (keyof typeof tlcBatches)[] = ["tlc1", "tlc2", "tlc3", "tlc4"]
      tKeys.forEach(k => {
        tlcBatches[k].forEach(b => {
          if (b.milkType === tlsItem.milkType) {
            tVol += b.volume
            tProt += b.volume * b.protein
          }
        })
      })
      const tlsItemCi = tVol > 0 ? tProt / tVol : 33.0

      // 2. Schedule Osmosis
      let osmoseWashInserted = false
      if (timeOsmosisFree > 0 && Math.max(transferEnd, timeOsmosisFree) - timeOsmosisFree >= 60) {
        const washStart = Math.max(timeOsmosisFree, timeOsmoseWashFree)
        ganttTasks.push({
          key: `osm-wash-${tlsItem.commandId}-${TLS_NAME}-court`,
          label: `Lavage Osmoseur (COURT)`,
          startMinute: washStart,
          durationMinutes: 90,
          color: "#cbd5e1",
        })
        timeOsmoseWashFree = washStart + 90
        timeOsmosisFree = Math.max(timeOsmosisFree, timeOsmoseWashFree)
        osmoseWashInserted = true
      } else if (osmosisCount >= 3) {
        const washStart = Math.max(transferEnd, timeOsmosisFree, timeOsmoseWashFree)
        ganttTasks.push({
          key: `osm-wash-${tlsItem.commandId}-${TLS_NAME}-long`,
          label: `Lavage Osmoseur (LONG)`,
          startMinute: washStart,
          durationMinutes: 150,
          color: "#cbd5e1",
        })
        timeOsmoseWashFree = washStart + 150
        timeOsmosisFree = Math.max(timeOsmosisFree, timeOsmoseWashFree)
        osmoseWashInserted = true
      }

      if (osmoseWashInserted) {
        osmosisCount = 0
      }

      const osmoseStart = Math.max(transferEnd, timeOsmosisFree)
      const osmoseDuration = computeOsmoseTime(tlsItem.rawVolume, tlsItemCi, cmd.targetValue)
      const osmoseEnd = osmoseStart + osmoseDuration
      timeOsmosisFree = osmoseEnd
      osmosisCount++

      if (cmdOsmoseStart[tlsItem.commandId] === undefined) {
        cmdOsmoseStart[tlsItem.commandId] = osmoseStart
      } else {
        cmdOsmoseStart[tlsItem.commandId] = Math.min(cmdOsmoseStart[tlsItem.commandId], osmoseStart)
      }
      cmdOsmoseEnd[tlsItem.commandId] = Math.max(cmdOsmoseEnd[tlsItem.commandId] || 0, osmoseEnd)

      ganttTasks.push({
        key: `${tlsItem.commandId}-${TLS_NAME}-osmose`,
        label: `${tlsItem.commandName} : Osmose ${TLS_NAME}`,
        startMinute: osmoseStart,
        durationMinutes: osmoseDuration,
        color: getCommandColor(tlsItem.commandIdx, "osmose"),
      })

      // 3. Schedule Powdering & Pasteurization
      const cfTanksToFill: string[] = []
      const cfFillVolumes: { [cfName: string]: number } = {}
      let remTLSVol = tlsItem.osmosedVolume

      const preAllocated = commandCFAllocations[tlsItem.commandId]
      const selectedCFs = commandCFSelectedList[tlsItem.commandId]

      selectedCFs.forEach(cfName => {
        if (remTLSVol <= 0) return
        const maxAllocated = preAllocated[cfName] || 0
        const alreadyFilled = cfTanksFilledForCommand[tlsItem.commandId][cfName] || 0
        const capRemaining = maxAllocated - alreadyFilled
        if (capRemaining > 0) {
          const fill = Math.min(remTLSVol, capRemaining)
          cfTanksToFill.push(cfName)
          cfFillVolumes[cfName] = fill
          remTLSVol = Number((remTLSVol - fill).toFixed(3))
          cfTanksFilledForCommand[tlsItem.commandId][cfName] = Number((alreadyFilled + fill).toFixed(3))
        }
      })

      // Sort cfTanksToFill so we fill the ones that are ready earliest first
      cfTanksToFill.sort((a, b) => (cfAvailableAt[a] || 0) - (cfAvailableAt[b] || 0))

      const powderDuration = computePowderTime(tlsItem.osmosedVolume)
      const pastoDuration = computePastoTime(tlsItem.osmosedVolume)

      let requiredPastoStart = Math.max(
        osmoseEnd + powderDuration,
        Math.max(timePastoFree, timePowderFree + powderDuration)
      )

      let cumDuration = 0
      cfTanksToFill.forEach((cfName) => {
        const fillVol = cfFillVolumes[cfName]
        const fillDuration = (fillVol / 5000) * 60
        const tankReady = cfAvailableAt[cfName] || 0

        requiredPastoStart = Math.max(requiredPastoStart, tankReady - cumDuration)
        cumDuration += fillDuration
      })

      if (pastoCount >= 3) {
        const washStart = Math.max(requiredPastoStart, timeWashLine2Free)
        ganttTasks.push({
          key: `pasto-wash-${tlsItem.commandId}-${TLS_NAME}`,
          label: `Lavage C4 (Pasteurisateur COURT)`,
          startMinute: washStart,
          durationMinutes: 120,
          color: "#cbd5e1",
        })
        requiredPastoStart = washStart + 120
        timeWashLine2Free = requiredPastoStart
        pastoCount = 0
      }

      const pastoStart = requiredPastoStart
      const powderStart = pastoStart - powderDuration
      const pastoEnd = pastoStart + pastoDuration

      timePowderFree = pastoStart
      timePastoFree = pastoEnd
      pastoCount++

      // Lavage du TLS après la pasteurisation (le TLS est alors vide)
      const tlsWashStart = Math.max(pastoEnd, timeWashLine1Free)
      const tlsWashDuration = 40 // LONG
      const tlsWashEnd = tlsWashStart + tlsWashDuration
      tlsAvailableAt[TLS_NAME] = tlsWashEnd
      timeWashLine1Free = tlsWashEnd

      ganttTasks.push({
        key: `tls-wash-${tlsItem.commandId}-${TLS_NAME}`,
        label: `Lavage ${TLS_NAME}`,
        startMinute: tlsWashStart,
        durationMinutes: tlsWashDuration,
        color: "#cbd5e1",
      })

      if (cmdPastoStart[tlsItem.commandId] === undefined) {
        cmdPastoStart[tlsItem.commandId] = powderStart
      } else {
        cmdPastoStart[tlsItem.commandId] = Math.min(cmdPastoStart[tlsItem.commandId], powderStart)
      }
      cmdPastoEnd[tlsItem.commandId] = Math.max(cmdPastoEnd[tlsItem.commandId] || 0, pastoEnd)

      ganttTasks.push({
        key: `${tlsItem.commandId}-${TLS_NAME}-pasto`,
        label: `${tlsItem.commandName} : Poudrage + Pasto ${TLS_NAME}`,
        startMinute: powderStart,
        durationMinutes: powderDuration + pastoDuration,
        color: getCommandColor(tlsItem.commandIdx, "pasto"),
      })

      // 4. Schedule Maturation: tanks fill and mature sequentially as they are filled
      let currentFillTime = pastoStart
      cfTanksToFill.forEach((cfName) => {
        const fillVol = cfFillVolumes[cfName]
        const fillDuration = (fillVol / 5000) * 60
        const maturationStart = currentFillTime + fillDuration
        currentFillTime = maturationStart

        ganttTasks.push({
          key: `${tlsItem.commandId}-${cfName}-maturation`,
          label: `${tlsItem.commandName} : Maturation ${cfName} (${fillVol.toFixed(0)}L)`,
          startMinute: maturationStart,
          durationMinutes: 360,
          color: getCommandColor(tlsItem.commandIdx, "maturation"),
        })

        maturationEndAt[cfName] = maturationStart + 360
        if (!commandTankMaturationEnd[tlsItem.commandId]) {
          commandTankMaturationEnd[tlsItem.commandId] = {}
        }
        commandTankMaturationEnd[tlsItem.commandId][cfName] = maturationStart + 360
      })

      if (cmdMinStart[tlsItem.commandId] === undefined) {
        cmdMinStart[tlsItem.commandId] = transferStart
      } else {
        cmdMinStart[tlsItem.commandId] = Math.min(cmdMinStart[tlsItem.commandId], transferStart)
      }
    }
    }) // End of cmdTlsItems.forEach

    // 2. Finalize command results timelines with intermediate states for this command
    if (cmd.references.length === 0) return // Skip if no references

    const tStart = cmdMinStart[cmd.id] || 0

    // Earliest maturation end of the selected CF tanks determines when packaging starts!
    const selectedCFs = commandCFSelectedList[cmd.id] || []

    const sortedCFs = [...selectedCFs].sort((a, b) => (commandTankMaturationEnd[cmd.id]?.[a] || 0) - (commandTankMaturationEnd[cmd.id]?.[b] || 0))
    const firstTankName = sortedCFs.length > 0 ? sortedCFs[0] : undefined
    const firstTankMaturationEnd = firstTankName ? commandTankMaturationEnd[cmd.id]?.[firstTankName] : undefined

    const maturationEnds = selectedCFs.map(cf => commandTankMaturationEnd[cmd.id]?.[cf] || 0).filter(t => t > 0)
    const tEndMaturation = maturationEnds.length > 0 ? Math.min(...maturationEnds) : (cmdPastoEnd[cmd.id] || 0) + 360

    const hasSkyr = cmd.references.some(r => r.name.toLowerCase().includes("skyr"))
    const hasClassic = cmd.references.some(r => !r.name.toLowerCase().includes("skyr"))
    const isDirectSkyr = hasSkyr && cmd.skyrMilkType === "fcv3" && cmd.skyrDirectPasto

    commandsResults[cmd.id] = {
      id: cmd.id,
      name: cmd.name,
      transferStart: tStart,
      transferEnd: cmdTransEnd[cmd.id] || 0,
      osmoseStart: cmdOsmoseStart[cmd.id] || 0,
      osmoseEnd: cmdOsmoseEnd[cmd.id] || 0,
      powderStart: isDirectSkyr && !hasClassic ? (cmdOsmoseEnd[cmd.id] || 0) : (cmdOsmoseEnd[cmd.id] || 0),
      powderEnd: isDirectSkyr && !hasClassic ? (cmdPastoStart[cmd.id] || 0) : (cmdPastoStart[cmd.id] || 0),
      pastoStart: cmdPastoStart[cmd.id] || 0,
      pastoEnd: cmdPastoEnd[cmd.id] || 0,
      maturationStart: cmdPastoEnd[cmd.id] || 0,
      maturationEnd: tEndMaturation,
      packagingStart: tEndMaturation,
      packagingEnd: tEndMaturation,
      packagingAtiaDuration: 0,
      packagingGrunDuration: 0,
      totalDuration: tEndMaturation,
      firstTankName,
      firstTankMaturationEnd,
    }

    // 3. Schedule Reference Packaging sequentially for this command after maturation is complete
    const cmdRes = commandsResults[cmd.id]
    if (!cmdRes) return

    const refResults: { refId: string; name: string; start: number; end: number }[] = []
    const cfMaxEnd: Record<string, number> = {}

    const classicCFs = (commandCFSelectedList[cmd.id] || []).filter(cf => cf !== "CF20")
    classicCFs.sort((a, b) => (commandTankMaturationEnd[cmd.id]?.[a] || 0) - (commandTankMaturationEnd[cmd.id]?.[b] || 0))
    const classicCFVolumes = classicCFs.map(cf => ({ cf, vol: cfTanksFilledForCommand[cmd.id]?.[cf] || 0 }))

    cmd.references.forEach((ref) => {
      const dest = cmd.refDestinations?.[ref.id] || "both"
      const customPots = cmd.refPotsLaunched?.[ref.id]
      const potsDefault = ref.potsQty

      let potsAtia = 0
      let potsGrun = 0

      if (dest === "atia") {
        potsAtia = customPots?.atia !== undefined ? customPots.atia : potsDefault
      } else if (dest === "grunwald") {
        potsGrun = customPots?.grunwald !== undefined ? customPots.grunwald : potsDefault
      } else { // both
        potsAtia = customPots?.atia !== undefined ? customPots.atia : potsDefault * (3500 / 13500)
        potsGrun = customPots?.grunwald !== undefined ? customPots.grunwald : potsDefault * (10000 / 13500)
      }

      // Compute maturation end specifically for this reference!
      const isRefSkyr = ref.name.toLowerCase().includes("skyr")
      let refMaturationEnd = 0
      if (isRefSkyr) {
        refMaturationEnd = commandTankMaturationEnd[cmd.id]?.["CF20"] || 0
      } else {
        const classicCFs = (commandCFSelectedList[cmd.id] || []).filter(cf => cf !== "CF20")
        const classicEnds = classicCFs.map(cf => commandTankMaturationEnd[cmd.id]?.[cf] || 0).filter(t => t > 0)
        refMaturationEnd = classicEnds.length > 0 ? Math.min(...classicEnds) : (cmdPastoEnd[cmd.id] || 0) + 360
      }

      // --- 48h Wash Logic Check ---
      const expectedAtiaDuration = dest === "atia" || dest === "both" ? (potsAtia / 3500) * 60 : 0
      const expectedGrunDuration = dest === "grunwald" || dest === "both" ? (potsGrun / 10000) * 60 : 0
      
      const expectedAtiaStart = Math.max(refMaturationEnd, timeAtia)
      const expectedGrunStart = Math.max(refMaturationEnd, timeGrunwald)
      
      const expectedPkgStart = dest === "both" ? Math.min(expectedAtiaStart, expectedGrunStart) : (dest === "atia" ? expectedAtiaStart : expectedGrunStart)
      const expectedPkgEnd = Math.max(
         dest === "atia" || dest === "both" ? expectedAtiaStart + expectedAtiaDuration : 0,
         dest === "grunwald" || dest === "both" ? expectedGrunStart + expectedGrunDuration : 0
      )

      const timeSinceLastWash = expectedPkgEnd - last48hWashEnd
      const maxLimit = 52 * 60 // 3120
      const minLimit = 44 * 60 // 2640

      if (timeSinceLastWash > maxLimit || (expectedPkgStart - last48hWashEnd >= minLimit)) {
         let c5Start = Math.max(timeAtia, timeGrunwald, timeSoutirageWashFree)
         ganttTasks.push({
           key: `wash-c5-dyn-${cmd.id}-${ref.id}`,
           label: `Lavage 48H: C5 (Pré-Cond.)`,
           startMinute: c5Start,
           durationMinutes: 90,
           color: "#94a3b8",
         })
         let c5End = c5Start + 90
         timeSoutirageWashFree = c5End
         
         let atiaStart = c5End
         ganttTasks.push({
           key: `wash-atia-dyn-${cmd.id}-${ref.id}`,
           label: `Lavage 48H: ATIA`,
           startMinute: atiaStart,
           durationMinutes: 50,
           color: "#94a3b8",
         })
         
         let grunStart = c5End
         ganttTasks.push({
           key: `wash-grun-dyn-${cmd.id}-${ref.id}`,
           label: `Lavage 48H: Grunwald`,
           startMinute: grunStart,
           durationMinutes: 110,
           color: "#94a3b8",
         })
         
         timeAtia = atiaStart + 50
         timeGrunwald = grunStart + 110
         last48hWashEnd = Math.max(timeAtia, timeGrunwald)
      }
      // ----------------------------

      let refStart = -1
      let refEnd = -1

      if (isRefSkyr) {
        const tankReady = commandTankMaturationEnd[cmd.id]?.["CF20"] || 0
        let pkgStart = 0
        let emptyTime = 0

        if (dest === "grunwald") {
          pkgStart = Math.max(tankReady, timeGrunwald)
          const pkgDuration = (potsGrun / 10000) * 60
          emptyTime = pkgStart + pkgDuration
          timeGrunwald = emptyTime

          ganttTasks.push({
            key: `${cmd.id}-${ref.id}-pkg-grun`,
            label: `${cmd.name} : Cond. ${ref.name} (GRUN)`,
            startMinute: pkgStart,
            durationMinutes: pkgDuration,
            color: getCommandColor(cmdIdx, "packaging_grun"),
          })
        } else if (dest === "atia") {
          pkgStart = Math.max(tankReady, timeAtia)
          const pkgDuration = (potsAtia / 3500) * 60
          emptyTime = pkgStart + pkgDuration
          timeAtia = emptyTime

          ganttTasks.push({
            key: `${cmd.id}-${ref.id}-pkg-atia`,
            label: `${cmd.name} : Cond. ${ref.name} (ATIA)`,
            startMinute: pkgStart,
            durationMinutes: pkgDuration,
            color: getCommandColor(cmdIdx, "packaging_atia"),
          })
        } else { // both
          const atiaStart = Math.max(tankReady, timeAtia)
          const grunStart = Math.max(tankReady, timeGrunwald)

          const atiaDuration = (potsAtia / 3500) * 60
          const grunDuration = (potsGrun / 10000) * 60

          const atiaEnd = atiaStart + atiaDuration
          const grunEnd = grunStart + grunDuration

          pkgStart = Math.min(atiaStart, grunStart)
          emptyTime = Math.max(atiaEnd, grunEnd)
          
          timeAtia = atiaEnd
          timeGrunwald = grunEnd

          ganttTasks.push({
            key: `${cmd.id}-${ref.id}-pkg-both`,
            label: `${cmd.name} : Cond. ${ref.name} (ATIA+GRUN)`,
            startMinute: pkgStart,
            durationMinutes: emptyTime - pkgStart,
            color: getCommandColor(cmdIdx, "packaging_grun"),
          })
        }

        refStart = pkgStart
        refEnd = emptyTime

        cfMaxEnd["CF20"] = Math.max(cfMaxEnd["CF20"] || 0, emptyTime)
        ganttTasks.push({
          key: `${cmd.id}-${ref.id}-CF20-empty`,
          label: `${cmd.name} : Vidage CF20`,
          startMinute: pkgStart,
          durationMinutes: emptyTime - pkgStart,
          color: "hsl(180, 50%, 45%)",
        })
      } else {
        let refVol = (potsAtia + potsGrun) * ref.gramPerPot / 1000
        const totalPots = potsAtia + potsGrun

        for (let i = 0; i < classicCFVolumes.length; i++) {
          if (classicCFVolumes[i].vol <= 0) continue
          if (refVol <= 0) break

          const take = Math.min(classicCFVolumes[i].vol, refVol)
          classicCFVolumes[i].vol -= take
          refVol -= take

          const tankReady = commandTankMaturationEnd[cmd.id]?.[classicCFVolumes[i].cf] || 0
          
          const takeRatio = totalPots > 0 ? take / (totalPots * ref.gramPerPot / 1000) : 0
          const takePotsAtia = potsAtia * takeRatio
          const takePotsGrun = potsGrun * takeRatio

          let chunkStart = 0
          let chunkEnd = 0

          if (dest === "grunwald") {
            chunkStart = Math.max(tankReady, timeGrunwald)
            const duration = (takePotsGrun / 10000) * 60
            chunkEnd = chunkStart + duration
            timeGrunwald = chunkEnd

            ganttTasks.push({
              key: `${cmd.id}-${ref.id}-${classicCFVolumes[i].cf}-pkg-grun`,
              label: `${cmd.name} : Cond. ${ref.name} (GRUN)`,
              startMinute: chunkStart,
              durationMinutes: duration,
              color: getCommandColor(cmdIdx, "packaging_grun"),
            })
          } else if (dest === "atia") {
            chunkStart = Math.max(tankReady, timeAtia)
            const duration = (takePotsAtia / 3500) * 60
            chunkEnd = chunkStart + duration
            timeAtia = chunkEnd

            ganttTasks.push({
              key: `${cmd.id}-${ref.id}-${classicCFVolumes[i].cf}-pkg-atia`,
              label: `${cmd.name} : Cond. ${ref.name} (ATIA)`,
              startMinute: chunkStart,
              durationMinutes: duration,
              color: getCommandColor(cmdIdx, "packaging_atia"),
            })
          } else {
            const startAtia = Math.max(tankReady, timeAtia)
            const startGrun = Math.max(tankReady, timeGrunwald)
            
            const atiaDuration = (takePotsAtia / 3500) * 60
            const grunDuration = (takePotsGrun / 10000) * 60
            
            chunkStart = Math.min(startAtia, startGrun)
            
            const endAtia = startAtia + atiaDuration
            const endGrun = startGrun + grunDuration
            chunkEnd = Math.max(endAtia, endGrun)
            
            timeAtia = endAtia
            timeGrunwald = endGrun
            
            ganttTasks.push({
              key: `${cmd.id}-${ref.id}-${classicCFVolumes[i].cf}-pkg-both`,
              label: `${cmd.name} : Cond. ${ref.name} (ATIA+GRUN)`,
              startMinute: chunkStart,
              durationMinutes: chunkEnd - chunkStart,
              color: getCommandColor(cmdIdx, "packaging_grun"),
            })
          }

          cfMaxEnd[classicCFVolumes[i].cf] = chunkEnd
          
          ganttTasks.push({
            key: `${cmd.id}-${ref.id}-${classicCFVolumes[i].cf}-empty`,
            label: `${cmd.name} : Vidage ${classicCFVolumes[i].cf}`,
            startMinute: chunkStart,
            durationMinutes: chunkEnd - chunkStart,
            color: "hsl(180, 50%, 45%)",
          })

          if (refStart === -1) refStart = chunkStart
          refEnd = chunkEnd
        }
      }

      refResults.push({
        refId: ref.id,
        name: ref.name,
        start: refStart,
        end: refEnd
      })

      if (cmdMaxEnd[cmd.id] === undefined || refEnd > cmdMaxEnd[cmd.id]) {
        cmdMaxEnd[cmd.id] = refEnd
      }
    })

    cmdRes.referencesResults = refResults

    // Group CF tank washing tasks at the end of reference packaging
    const cmdPkgEnd = cmdMaxEnd[cmd.id] || cmdRes.maturationEnd
    cmdRes.packagingEnd = cmdPkgEnd
    cmdRes.totalDuration = cmdPkgEnd

    if (cmdRes.firstTankName) {
      cmdRes.firstTankEmptyEnd = cfMaxEnd[cmdRes.firstTankName] || commandTankMaturationEnd[cmd.id]?.[cmdRes.firstTankName] || cmdRes.maturationEnd
    }

    const washSelectedCFs = commandCFSelectedList[cmd.id]
    
    // Sort CFs by empty time to wash them in order
    const cfsToWash = [...washSelectedCFs].sort((a, b) => {
      const emptyA = cfMaxEnd[a] || commandTankMaturationEnd[cmd.id]?.[a] || cmdRes.maturationEnd
      const emptyB = cfMaxEnd[b] || commandTankMaturationEnd[cmd.id]?.[b] || cmdRes.maturationEnd
      return emptyA - emptyB
    })

    cfsToWash.forEach(cfName => {
      const emptyTime = cfMaxEnd[cfName] || commandTankMaturationEnd[cmd.id]?.[cfName] || cmdRes.maturationEnd
      
      let washStart = 0
      if (cfName === "CF20") {
        washStart = Math.max(emptyTime, timeWashLine1Free)
        const washEnd = washStart + 20 // COURT
        ganttTasks.push({
          key: `${cmd.id}-${cfName}-wash`,
          label: `${cmd.name} : Lavage ${cfName}`,
          startMinute: washStart,
          durationMinutes: 20,
          color: "#cbd5e1",
        })
        cfAvailableAt[cfName] = washEnd
        timeWashLine1Free = washEnd

        // Lavage de la ligne de soutirage CF20 dès que possible
        const soutirageCF20Start = Math.max(timeWashLine1Free, timeSoutirageWashFree)
        ganttTasks.push({
          key: `wash-soutirage-cf20-${cmd.id}`,
          label: `Lavage Ligne Soutirage CF20`,
          startMinute: soutirageCF20Start,
          durationMinutes: 90,
          color: "#94a3b8",
        })
        const soutirageEnd = soutirageCF20Start + 90
        timeSoutirageWashFree = soutirageEnd
        timeWashLine1Free = soutirageEnd
      } else {
        washStart = Math.max(emptyTime, timeWashLine2Free)
        const washEnd = washStart + 20 // COURT
        ganttTasks.push({
          key: `${cmd.id}-${cfName}-wash`,
          label: `${cmd.name} : Lavage ${cfName}`,
          startMinute: washStart,
          durationMinutes: 20,
          color: "#cbd5e1",
        })
        cfAvailableAt[cfName] = washEnd
        timeWashLine2Free = washEnd
      }
    })
  }) // End of main commands.forEach loop

  // Lavage TLC et TLP dès que les transferts sont terminés
  const maxTransEnd = Math.max(0, ...Object.values(cmdTransEnd))
  if (maxTransEnd > 0) {
    const tlcWashStart = Math.max(maxTransEnd, timeWashLine1Free)
    ganttTasks.push({
      key: `wash-tlc`,
      label: `Lavages TLC & TLP (Vides)`,
      startMinute: tlcWashStart,
      durationMinutes: 50, // LONG
      color: "#94a3b8",
    })
    timeWashLine1Free = tlcWashStart + 50
  }

  let totalDurationMinutes = Math.max(
    timeGrunwald,
    timeAtia,
    timePastoFree,
    ...Object.values(cfAvailableAt),
    ...Object.values(tlsAvailableAt)
  )

  // 8. Lavages de fin de cycle (C5, ATIA, Grunwald, C3, C2, TLC, C4)
  let endWashTimeLine1 = totalDurationMinutes
  let endWashTimeLine2 = totalDurationMinutes

  if (config?.needs48hWash) {
    const c5Start = Math.max(endWashTimeLine2, timeSoutirageWashFree)
    ganttTasks.push({
      key: `wash-c5`,
      label: `Lavage C5 (Ligne de soutirage)`,
      startMinute: c5Start,
      durationMinutes: 90, // LONG
      color: "#94a3b8",
    })
    const c5End = c5Start + 90
    timeSoutirageWashFree = c5End
    endWashTimeLine2 = c5End

    const aFaitCF20 = commands.some(c => commandCFSelectedList[c.id]?.includes("CF20"))
    // Le lavage de la ligne de soutirage CF20 a été déplacé juste après le lavage de la CF20

    const atiaStart = endWashTimeLine1
    ganttTasks.push({
      key: `wash-atia`,
      label: `Lavage ATIA`,
      startMinute: atiaStart,
      durationMinutes: 50,
      color: "#94a3b8",
    })
    endWashTimeLine1 += 50

    const grunStart = endWashTimeLine2
    ganttTasks.push({
      key: `wash-grun`,
      label: `Lavage Grunwald`,
      startMinute: grunStart,
      durationMinutes: 110,
      color: "#94a3b8",
    })
    endWashTimeLine2 += 110
  }

  if (config?.needsC3Wash) {
    let c3WashStart = Math.max(1320, endWashTimeLine1) // 1320 = 22h00
    ganttTasks.push({
      key: `wash-c3`,
      label: `Lavage C3 (Poudrage/Osmose/Pasto)`,
      startMinute: c3WashStart,
      durationMinutes: 60, // LONG
      color: "#94a3b8",
    })
    endWashTimeLine1 = c3WashStart + 60
  }

  // Lavage C2 en fin de journée
  ganttTasks.push({
    key: `wash-c2`,
    label: `Lavage C2 (Circuit Réception)`,
    startMinute: endWashTimeLine1,
    durationMinutes: 70, // LONG 1h10
    color: "#94a3b8",
  })
  endWashTimeLine1 += 70
  
  // Lavage C4 en fin de journée
  ganttTasks.push({
    key: `wash-c4`,
    label: `Lavage C4 (Pasto & Envoi)`,
    startMinute: endWashTimeLine2,
    durationMinutes: 120, // LONG
    color: "#94a3b8",
  })
  endWashTimeLine2 += 120

  totalDurationMinutes = Math.max(endWashTimeLine1, endWashTimeLine2)

  // Post-process ganttTasks into exactly 6 global grouped rows (Transfer, Osmosis, Pasteurization, Maturation, Packaging, Washing)
  const finalGanttTasks: GanttTask[] = []

  const createGroupedRow = (
    key: string,
    label: string,
    filterFn: (t: GanttTask) => boolean,
    shortLabelFn: (t: GanttTask) => string,
    defaultColor: string
  ) => {
    const matchingTasks = ganttTasks.filter(filterFn)
    if (matchingTasks.length === 0) return

    const segments = matchingTasks.map(t => ({
      startMinute: t.startMinute,
      durationMinutes: t.durationMinutes,
      color: t.color,
      label: t.label,
      shortLabel: shortLabelFn(t),
    }))

    // Sort segments chronologically
    segments.sort((a, b) => a.startMinute - b.startMinute)

    const startMin = Math.min(...matchingTasks.map(t => t.startMinute))
    const endMax = Math.max(...matchingTasks.map(t => t.startMinute + t.durationMinutes))

    finalGanttTasks.push({
      key,
      label,
      startMinute: startMin,
      durationMinutes: endMax - startMin,
      color: defaultColor,
      segments,
    })
  }

  // 1. Transfert
  createGroupedRow(
    "grouped-transfer",
    "1. Transfert TLC ➔ TLS / Écrémage",
    t => t.key.includes("-transfer") || t.key.includes("-skimming") || t.key.includes("direct-transfer"),
    t => {
      if (t.key.includes("direct-transfer")) return "Direct (CF20)";
      if (t.key.includes("-skimming")) return "Écrémage";
      const match = t.key.match(/TLS[1-3]/);
      return match ? match[0] : "TLC-TLS";
    },
    "hsl(220, 80%, 60%)"
  )

  // 2. Osmose Inverse
  createGroupedRow(
    "grouped-osmose",
    "2. Osmose Inverse",
    t => t.key.includes("-osmose"),
    t => {
      const match = t.key.match(/TLS[1-3]/);
      return match ? match[0] : "Osmose";
    },
    "hsl(220, 75%, 45%)"
  )

  // 3. Poudrage & Pasteurisation
  createGroupedRow(
    "grouped-pasto",
    "3. Poudrage & Pasteurisation",
    t => t.key.includes("-pasto") || t.key.includes("direct-pasto"),
    t => {
      if (t.key.includes("direct-pasto")) return "CF20";
      const match = t.key.match(/TLS[1-3]/);
      return match ? match[0] : "Pasto";
    },
    "hsl(220, 80%, 40%)"
  )

  // 4. Maturation en Cuves
  createGroupedRow(
    "grouped-maturation",
    "4. Maturation en Cuves",
    t => t.key.includes("-maturation"),
    t => {
      const match = t.key.match(/CF\d+/);
      return match ? match[0] : "Maturation";
    },
    "hsl(220, 60%, 50%)"
  )

  // 5. Vidage CF (Début Conditionnement CF)
  createGroupedRow(
    "grouped-cf-empty",
    "5. Vidage CF (Début Cond.)",
    t => t.key.includes("-empty"),
    t => {
      const match = t.key.match(/CF\d+/);
      return match ? match[0] : "Vidage";
    },
    "hsl(180, 50%, 45%)"
  )

  // 6. Conditionnement ATIA
  createGroupedRow(
    "grouped-packaging-atia",
    "6. Conditionnement (Ligne ATIA)",
    t => t.key.includes("-pkg-atia") || (t.key.includes("-pkg-both") && t.key.endsWith("-atia")), // using -pkg-atia only actually
    t => {
      const cmdMatch = t.label.match(/(Commande \d+|Cmd \d+)/i) || t.label.match(/(C\d+)/);
      return cmdMatch ? cmdMatch[0] : "Cmd";
    },
    "hsl(220, 90%, 65%)"
  )

  // 7. Conditionnement GRUNWALD
  createGroupedRow(
    "grouped-packaging-grun",
    "7. Conditionnement (Ligne GRUNWALD)",
    t => t.key.includes("-pkg-grun") || (t.key.includes("-pkg-both") && t.key.endsWith("-grun")), // using -pkg-grun only actually
    t => {
      const cmdMatch = t.label.match(/(Commande \d+|Cmd \d+)/i) || t.label.match(/(C\d+)/);
      return cmdMatch ? cmdMatch[0] : "Cmd";
    },
    "hsl(200, 90%, 55%)"
  )

  // 7. Lavages (CF, C5, ATIA, C3, C2, Osm, Pasto...)
  createGroupedRow(
    "grouped-wash",
    "7. Lavages (CF, C5, ATIA, C3, C2, Osm, Pasto...)",
    t => t.key.includes("-wash") || t.key.includes("wash-"),
    t => {
      if (t.key.includes("-wash")) {
        const match = t.key.match(/CF\d+|TLS[1-3]|osm|pasto/);
        return match ? match[0] : "Lavage";
      }
      return t.label.replace("Lavage ", "");
    },
    "#94a3b8"
  )

  return {
    totalDurationMinutes,
    commandsResults,
    tlcRemainingBatches: tlcBatches,
    ganttTasks: finalGanttTasks,
  }
}

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    // Multi-command lifecycle management
    addCommand(state) {
      const nextIdx = state.commands.length + 1
      const newCmd = initialCommand(`cmd-${Date.now()}`, `Commande ${nextIdx}`)
      state.commands.push(newCmd)
      state.activeCommandId = newCmd.id
      syncActiveCommandToRoot(state)
      state.simulationDone = false
    },
    updateCommandName(state, action: PayloadAction<{ id: string; name: string }>) {
      const { id, name } = action.payload
      const cmd = state.commands.find(c => c.id === id)
      if (cmd) {
        cmd.name = name
      }
      state.simulationDone = false
    },
    deleteCommand(state, action: PayloadAction<string>) {
      if (state.commands.length <= 1) return

      const toDelete = action.payload
      state.commands = state.commands.filter(c => c.id !== toDelete)

      if (state.activeCommandId === toDelete) {
        state.activeCommandId = state.commands[0].id
      }
      syncActiveCommandToRoot(state)
      state.simulationDone = false
    },
    setActiveCommand(state, action: PayloadAction<string>) {
      state.activeCommandId = action.payload
      syncActiveCommandToRoot(state)
    },
    setCommandMilkType(state, action: PayloadAction<{ id: string; milkType: MilkType }>) {
      const { id, milkType } = action.payload
      const cmd = state.commands.find(c => c.id === id)
      if (cmd) {
        cmd.milkType = milkType
        recalculateActiveCommandMetrics(state, cmd)
        if (state.activeCommandId === id) {
          state.milkType = milkType
        }
      }
      syncActiveCommandToRoot(state)
      state.simulationDone = false
    },

    // Product Reference Reducers
    addReference(state, action: PayloadAction<{ cmdId: string }>) {
      const { cmdId } = action.payload
      const cmd = state.commands.find(c => c.id === cmdId)
      if (cmd) {
        const nextId = `ref-${Date.now()}`
        const name = cmd.isSkyr ? "Skyr" : "Nature"

        // Helper inline
        const determineMilkTypeForRef = (refName: string): MilkType => {
          const nameL = refName.toLowerCase()
          if (nameL.includes("baiko")) {
            const hasSavoie = state.tlcBatches.tlc3.some(b => b.milkType === "savoie" && b.volume > 0)
            const hasMontagne = state.tlcBatches.tlc4.some(b => b.milkType === "montagne" && b.volume > 0)
            if (hasMontagne) return "montagne"
            if (hasSavoie) return "savoie"
            return "montagne"
          }
          if (nameL.includes("skyr")) {
            const hasFCV3 = state.tlcBatches.tlc2.some(b => b.milkType === "fcv3" && b.volume > 0)
            return hasFCV3 ? "fcv3" : "ecreme_savoie"
          }
          if (nameL.includes("val de praz")) {
            return "savoie"
          }
          return "bio"
        }

        cmd.references.push({
          id: nextId,
          name: name,
          potsQty: 20000,
          gramPerPot: 125,
          milkType: determineMilkTypeForRef(name)
        })
        cmd.refDestinations[nextId] = "both"
        cmd.refSentStatus[nextId] = { atia: false, grunwald: false }
        cmd.refPotsLaunched[nextId] = {}
        recalculateActiveCommandMetrics(state, cmd)
        syncActiveCommandToRoot(state)
      }
      state.simulationDone = false
    },
    updateReference(
      state,
      action: PayloadAction<{ cmdId: string; refId: string; fields: Partial<ProductReference> }>
    ) {
      const { cmdId, refId, fields } = action.payload
      const cmd = state.commands.find(c => c.id === cmdId)
      if (cmd) {
        const ref = cmd.references.find(r => r.id === refId)
        if (ref) {
          Object.assign(ref, fields)
          if (fields.name) {
            const nameL = fields.name.toLowerCase()
            if (nameL.includes("baiko")) {
              const hasSavoie = state.tlcBatches.tlc3.some(b => b.milkType === "savoie" && b.volume > 0)
              const hasMontagne = state.tlcBatches.tlc4.some(b => b.milkType === "montagne" && b.volume > 0)
              ref.milkType = hasMontagne ? "montagne" : (hasSavoie ? "savoie" : "montagne")
            } else if (nameL.includes("skyr")) {
              const hasFCV3 = state.tlcBatches.tlc2.some(b => b.milkType === "fcv3" && b.volume > 0)
              ref.milkType = hasFCV3 ? "fcv3" : "ecreme_savoie"
            } else if (nameL.includes("val de praz")) {
              ref.milkType = "savoie"
            } else {
              ref.milkType = "bio"
            }
          }
          recalculateActiveCommandMetrics(state, cmd)
          syncActiveCommandToRoot(state)
        }
      }
      state.simulationDone = false
    },
    deleteReference(state, action: PayloadAction<{ cmdId: string; refId: string }>) {
      const { cmdId, refId } = action.payload
      const cmd = state.commands.find(c => c.id === cmdId)
      if (cmd && cmd.references.length > 1) {
        cmd.references = cmd.references.filter(r => r.id !== refId)
        delete cmd.refDestinations[refId]
        delete cmd.refSentStatus[refId]
        delete cmd.refPotsLaunched[refId]
        recalculateActiveCommandMetrics(state, cmd)
        syncActiveCommandToRoot(state)
      }
      state.simulationDone = false
    },

    // Reference packaging destination and launch controllers
    setRefDestination(state, action: PayloadAction<{ cmdId: string; refId: string; destination: "atia" | "grunwald" | "both" }>) {
      const { cmdId, refId, destination } = action.payload
      const cmd = state.commands.find(c => c.id === cmdId)
      if (cmd) {
        if (!cmd.refDestinations) cmd.refDestinations = {}
        cmd.refDestinations[refId] = destination

        if (!cmd.refSentStatus) cmd.refSentStatus = {}
        if (!cmd.refSentStatus[refId]) {
          cmd.refSentStatus[refId] = { atia: false, grunwald: false }
        }
        checkIfDispatched(cmd)
        syncActiveCommandToRoot(state)
      }
      state.simulationDone = false
    },
    setRefPotsLaunched(state, action: PayloadAction<{ cmdId: string; refId: string; atia?: number; grunwald?: number }>) {
      const { cmdId, refId, atia, grunwald } = action.payload
      const cmd = state.commands.find(c => c.id === cmdId)
      if (cmd) {
        if (!cmd.refPotsLaunched) cmd.refPotsLaunched = {}
        if (!cmd.refPotsLaunched[refId]) cmd.refPotsLaunched[refId] = {}
        if (atia !== undefined) cmd.refPotsLaunched[refId].atia = atia
        if (grunwald !== undefined) cmd.refPotsLaunched[refId].grunwald = grunwald
        syncActiveCommandToRoot(state)
      }
      state.simulationDone = false
    },
    launchRefToMachine(state, action: PayloadAction<{ cmdId: string; refId: string; machine: "atia" | "grunwald" }>) {
      const { cmdId, refId, machine } = action.payload
      const cmd = state.commands.find(c => c.id === cmdId)
      if (cmd) {
        if (!cmd.refSentStatus) cmd.refSentStatus = {}
        if (!cmd.refSentStatus[refId]) {
          cmd.refSentStatus[refId] = { atia: false, grunwald: false }
        }
        cmd.refSentStatus[refId][machine] = true
        checkIfDispatched(cmd)
        syncActiveCommandToRoot(state)
      }
    },

    // TLC Batch Reducers
    addBatch(state, action: PayloadAction<{ tank: "tlc1" | "tlc2" | "tlc3" | "tlc4" | "tankPermeat"; batch: Omit<Batch, "id"> }>) {
      const { tank, batch } = action.payload
      const nextId = `batch-${Date.now()}`

      // Enforce raw milk mixture rule: must have the same milkType as current batches, if not empty
      const currentType = state.tlcBatches[tank].length > 0 ? state.tlcBatches[tank][0].milkType : null
      if (currentType && currentType !== batch.milkType) {
        return // mix violation
      }

      state.tlcBatches[tank].push({
        id: nextId,
        ...batch
      })

      // Recalculate metrics for all commands because raw milk properties changed
      state.commands.forEach(cmd => recalculateActiveCommandMetrics(state, cmd))
      syncActiveCommandToRoot(state)
      state.simulationDone = false
    },
    deleteBatch(state, action: PayloadAction<{ tank: "tlc1" | "tlc2" | "tlc3" | "tlc4" | "tankPermeat"; batchId: string }>) {
      const { tank, batchId } = action.payload
      state.tlcBatches[tank] = state.tlcBatches[tank].filter(b => b.id !== batchId)

      // Recalculate metrics for all commands
      state.commands.forEach(cmd => recalculateActiveCommandMetrics(state, cmd))
      syncActiveCommandToRoot(state)
      state.simulationDone = false
    },

    setTargetValue(state, action: PayloadAction<number>) {
      state.targetValue = action.payload
      updateActiveCommandFromRoot(state)

      const active = state.commands.find(c => c.id === state.activeCommandId)
      if (active) {
        recalculateActiveCommandMetrics(state, active)
        syncActiveCommandToRoot(state)
      }
      state.simulationDone = false
    },
    autoFillTLS(state) {
      // Clear all TLS selections
      state.commands.forEach(cmd => {
        cmd.selectedTLSs = []
        cmd.tlsVolumes = { tls1: 0, tls2: 0, tls3: 0 }
      })

      const availableTanks = [
        { name: "TLS2", capacity: 5200 },
        { name: "TLS3", capacity: 5200 },
        { name: "TLS1", capacity: 11000 },
      ]

      let tankStates = {
        TLS2: { remaining: 0, milkType: null as string | null },
        TLS3: { remaining: 0, milkType: null as string | null },
        TLS1: { remaining: 0, milkType: null as string | null },
      }

      for (let cmd of state.commands) {
        const isDirectSkyr = cmd.isSkyr && cmd.skyrMilkType === "fcv3" && cmd.skyrDirectPasto
        if (isDirectSkyr && !cmd.references.some(r => !r.name.toLowerCase().includes("skyr"))) {
          continue // no TLS needed
        }

        // Use first ref's milk type as main type (approximation for now)
        const cmdMilkType = cmd.references[0]?.milkType || "bio"
        let remainingVolume = cmd.milkReceivedVolume; // wait, if direct skyr + classic, only classic volume goes to TLS.

        // Approximate volume for TLS if mixed
        if (isDirectSkyr) {
          const classicWhiteMass = cmd.references
            .filter(r => !r.name.toLowerCase().includes("skyr"))
            .reduce((sum, r) => sum + (r.potsQty * r.gramPerPot) / 1000, 0)
          remainingVolume = (classicWhiteMass * cmd.targetValue) / 33.0 // rough approximation
        }

        // First use any tank that already has the same milk type and remaining capacity
        for (let tank of availableTanks) {
          const tState = tankStates[tank.name as keyof typeof tankStates]
          if (tState.remaining > 0 && tState.milkType === cmdMilkType) {
            const take = Math.min(remainingVolume, tState.remaining)
            cmd.selectedTLSs.push(tank.name)
            cmd.tlsVolumes[tank.name.toLowerCase() as keyof typeof cmd.tlsVolumes] = Number(take.toFixed(3))
            tState.remaining -= take
            remainingVolume -= take
            if (tState.remaining <= 0) tState.milkType = null
            if (remainingVolume <= 0) break
          }
        }

        // If still need volume, assign new tanks
        if (remainingVolume > 0) {
          for (let tank of availableTanks) {
            const tState = tankStates[tank.name as keyof typeof tankStates]
            if (tState.remaining === 0 && remainingVolume > 0) {
              cmd.selectedTLSs.push(tank.name)
              const capacity = tank.capacity
              tState.milkType = cmdMilkType

              if (capacity >= remainingVolume) {
                cmd.tlsVolumes[tank.name.toLowerCase() as keyof typeof cmd.tlsVolumes] = Number(remainingVolume.toFixed(3))
                tState.remaining = capacity - remainingVolume
                remainingVolume = 0
              } else {
                cmd.tlsVolumes[tank.name.toLowerCase() as keyof typeof cmd.tlsVolumes] = Number(capacity.toFixed(3))
                remainingVolume -= capacity
                tState.remaining = 0
              }
            }
          }
        }

        syncActiveCommandToRoot(state)
      }
      state.simulationDone = false
    },
    autoFillCF(state) {
      state.commands.forEach(cmd => {
        if (!cmd.isCFManual) {
          cmd.selectedCFs = []
        }
      })

      let tankStates: { [key: string]: { remaining: number, milkType: string | null } } = {}
      const availableTanks = [
        { name: "CF20", capacity: 12000 },
        { name: "CF17", capacity: 2200 },
        { name: "CF16", capacity: 2200 },
        { name: "CF15", capacity: 2200 },
        { name: "CF14", capacity: 2200 },
        { name: "CF13", capacity: 2200 },
        { name: "CF12", capacity: 2200 },
        { name: "CF11", capacity: 2200 },
        { name: "CF3", capacity: 1100 },
        { name: "CF2", capacity: 1100 },
        { name: "CF1", capacity: 1100 },
        { name: "CF5", capacity: 550 },
        { name: "CF4", capacity: 550 },
      ]

      availableTanks.forEach(t => tankStates[t.name] = { remaining: 0, milkType: null })

      for (let cmd of state.commands) {
        if (cmd.isCFManual) {
          // just subtract capacity from global tracking
          cmd.selectedCFs.forEach(cf => {
            tankStates[cf].remaining = 0
            tankStates[cf].milkType = cmd.references[0]?.milkType || "bio"
          })
          continue;
        }

        const cmdMilkType = cmd.references[0]?.milkType || "bio"
        let remainingVolume = cmd.osmosedVolume

        if (cmd.isSkyr) {
          cmd.selectedCFs = ["CF20"]
          tankStates["CF20"].remaining = Math.max(0, 12000 - remainingVolume)
          tankStates["CF20"].milkType = cmdMilkType
          continue
        }

        // First use any tank that already has the same milk type and remaining capacity
        for (let tank of availableTanks) {
          const tState = tankStates[tank.name]
          if (tState.remaining > 0 && tState.milkType === cmdMilkType) {
            const take = Math.min(remainingVolume, tState.remaining)
            cmd.selectedCFs.push(tank.name)
            tState.remaining -= take
            remainingVolume -= take
            if (tState.remaining <= 0) tState.milkType = null
            if (remainingVolume <= 0) break
          }
        }

        // Assign new tanks
        if (remainingVolume > 0) {
          for (let tank of availableTanks) {
            if (tank.name === "CF20") continue // reserved for Skyr

            const tState = tankStates[tank.name]
            if (tState.remaining === 0 && remainingVolume > 0) {
              cmd.selectedCFs.push(tank.name)
              const capacity = tank.capacity
              tState.milkType = cmdMilkType

              if (capacity >= remainingVolume) {
                tState.remaining = capacity - remainingVolume
                remainingVolume = 0
              } else {
                remainingVolume -= capacity
                tState.remaining = 0
              }
            }
          }
        }

        initializeNewCFs(cmd)
        syncActiveCommandToRoot(state)
      }
      state.simulationDone = false
    },
    toggleTLSSelection(state, action: PayloadAction<string>) {
      const active = state.commands.find(c => c.id === state.activeCommandId)
      if (active) {
        const selected = active.selectedTLSs.includes(action.payload)
        if (selected) {
          active.selectedTLSs = active.selectedTLSs.filter((name) => name !== action.payload)
        } else {
          const currentCapacity = getSelectedTLSCapacity(active.selectedTLSs)
          if (currentCapacity >= active.milkReceivedVolume) return
          active.selectedTLSs = [...active.selectedTLSs, action.payload]
        }
        syncActiveCommandToRoot(state)
      }
      state.simulationDone = false
    },
    toggleCuveSelection(state, action: PayloadAction<string>) {
      const active = state.commands.find(c => c.id === state.activeCommandId)
      if (active) {
        const selected = active.selectedCFs.includes(action.payload)
        if (selected) {
          active.selectedCFs = active.selectedCFs.filter((name) => name !== action.payload)
        } else {
          active.selectedCFs = [...active.selectedCFs, action.payload]
        }
        active.isCFManual = true
        initializeNewCFs(active)
        checkIfDispatched(active)
        active.status = active.selectedCFs.length > 0 ? "cuve" : active.status
        syncActiveCommandToRoot(state)
      }
      state.simulationDone = false
    },
    resetCuveSelection(state, action: PayloadAction<{ id: string }>) {
      const cmd = state.commands.find(c => c.id === action.payload.id)
      if (cmd) {
        cmd.isCFManual = false
        recalculateActiveCommandMetrics(state, cmd)
        syncActiveCommandToRoot(state)
      }
      state.simulationDone = false
    },
    setProductionStartTime(state, action: PayloadAction<string>) {
      state.productionStartTime = action.payload
      state.simulationDone = false
    },
    setCommandIsSkyr(state, action: PayloadAction<{ id: string; isSkyr: boolean }>) {
      const cmd = state.commands.find(c => c.id === action.payload.id)
      if (cmd) {
        cmd.isSkyr = action.payload.isSkyr
        if (cmd.isSkyr) {
          cmd.skyrMilkType = "fcv3"
          cmd.skyrDirectPasto = false
          cmd.selectedCFs = ["CF20"]
          cmd.references = [
            { id: "ref-1", name: "Skyr Nature 125g", potsQty: 80000, gramPerPot: 125 },
            { id: "ref-2", name: "Skyr Fraise 120g", potsQty: 40000, gramPerPot: 120 },
          ]
        } else {
          cmd.selectedCFs = selectCuvesForVolume(cmd.osmosedVolume, false)
          cmd.references = [
            { id: "ref-1", name: "Nature 125g", potsQty: 80000, gramPerPot: 125 },
            { id: "ref-2", name: "Fraise 120g", potsQty: 40000, gramPerPot: 120 },
          ]
        }
        recalculateActiveCommandMetrics(state, cmd)
        syncActiveCommandToRoot(state)
      }
      state.simulationDone = false
    },
    setSkyrMilkType(state, action: PayloadAction<{ id: string; skyrMilkType: "fcv3" | "ecreme_savoie" | "ecreme_montagne" }>) {
      const cmd = state.commands.find(c => c.id === action.payload.id)
      if (cmd) {
        cmd.skyrMilkType = action.payload.skyrMilkType
        if (cmd.skyrMilkType !== "fcv3") {
          cmd.skyrDirectPasto = false
        }
        recalculateActiveCommandMetrics(state, cmd)
        syncActiveCommandToRoot(state)
      }
      state.simulationDone = false
    },
    setSkyrDirectPasto(state, action: PayloadAction<{ id: string; direct: boolean }>) {
      const cmd = state.commands.find(c => c.id === action.payload.id)
      if (cmd) {
        cmd.skyrDirectPasto = action.payload.direct
        recalculateActiveCommandMetrics(state, cmd)
        syncActiveCommandToRoot(state)
      }
      state.simulationDone = false
    },

    // Simulation controls
    startSimulation(state) {
      state.isSimulating = true
      state.simulationDone = false
      state.simulationProgress = 0
      state.simulationStepText = "Optimisation de l'overlap des commandes et calculs de conditionnement..."
    },
    updateSimulationProgress(state, action: PayloadAction<{ progress: number; stepText: string }>) {
      state.simulationProgress = action.payload.progress
      state.simulationStepText = action.payload.stepText
    },
    completeSimulation(state) {
      state.isSimulating = false
      state.simulationDone = true

      const results = runMultiCommandSimulation(state.commands, state.tlcBatches, {
        needs48hWash: state.needs48hWash,
        needsC3Wash: state.needsC3Wash
      })
      state.simulationResults = results

      const active = state.commands.find(c => c.id === state.activeCommandId)
      if (active && results.commandsResults[active.id]) {
        const ar = results.commandsResults[active.id]
        state.simulatedTiming = {
          transferTime: ar.transferEnd - ar.transferStart,
          osmoseTime: ar.osmoseEnd - ar.osmoseStart,
          powderTime: ar.powderEnd - ar.powderStart,
          pastoTime: ar.pastoEnd - ar.pastoStart,
          startTime: ar.transferStart,
          maturationTime: ar.maturationEnd - ar.maturationStart,
        }
      }
      state.simulatedMilkReceivedVolume = state.commands.reduce((t, c) => t + c.milkReceivedVolume, 0)
      state.simulatedOsmosedVolume = state.commands.reduce((t, c) => t + c.osmosedVolume, 0)
    },
    resetOrder() {
      return initialState
    },
    toggleNeeds48hWash(state) {
      state.needs48hWash = !state.needs48hWash
      state.simulationDone = false
    },
    toggleNeedsC3Wash(state) {
      state.needsC3Wash = !state.needsC3Wash
      state.simulationDone = false
    },
  },
})

export const {
  addCommand,
  updateCommandName,
  deleteCommand,
  setActiveCommand,
  setCommandMilkType,
  addReference,
  updateReference,
  deleteReference,
  setRefDestination,
  setRefPotsLaunched,
  launchRefToMachine,
  addBatch,
  deleteBatch,
  setTargetValue,
  autoFillTLS,
  autoFillCF,
  toggleTLSSelection,
  toggleCuveSelection,
  resetCuveSelection,
  setProductionStartTime,
  setCommandIsSkyr,
  setSkyrMilkType,
  setSkyrDirectPasto,
  startSimulation,
  updateSimulationProgress,
  completeSimulation,
  resetOrder,
  toggleNeeds48hWash,
  toggleNeedsC3Wash,
} = orderSlice.actions

export { CF_TANKS, TLS_TANKS }
export default orderSlice.reducer
