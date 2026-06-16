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
  deliveryDate: number // timestamp
  temperature?: number
  snapTest?: boolean
  ph?: number
  aciditeDornic?: number
  litrageBL?: number
  fcv3Mp?: number
}

export type MilkOrder = {
  id: string
  milkType: MilkType
  supplier: string
  scheduledDate: string // YYYY-MM-DDTHH:mm
  quantity: number // L
  receivedQuantity?: number // L
  status: "pending" | "received"
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
  startDate?: string // YYYY-MM-DDTHH:mm
  expectedEndDate?: string // YYYY-MM-DDTHH:mm
  calculatedEndDate?: number // Timestamp
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
  cfSequence?: string[]
  cfVolumes?: { [cfName: string]: number }
  lastPastoData?: { dornic: string | number, tempPasto: string | number, pression: string | number }
  executedRawMilk?: number // Tracks actual transferred raw milk for execution
  producedWhiteMass?: number // Tracks actual white mass produced and put in CFs
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
  error?: string
}

export type GanttSegment = {
  startMinute: number
  durationMinutes: number
  color: string
  label?: string
  shortLabel?: string
  details?: string
}

export type GanttTask = {
  key: string
  label: string
  startMinute: number
  durationMinutes: number
  color: string
  segments?: GanttSegment[]
  details?: string
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
  milkShortages?: { [typeList: string]: number }
}

export type MilkType = "bio" | "fcv3" | "savoie" | "montagne" | "creme" | "ecreme_savoie" | "ecreme_montagne"

export const milkTypeConfigs: Record<string, any> = {
  bio: { label: "Bio", color: "var(--success)", gradient: "linear-gradient(180deg, #86efac 0%, #22c55e 100%)", emoji: "🌱" },
  fcv3: { label: "FCV3", color: "var(--primary)", gradient: "linear-gradient(180deg, #93c5fd 0%, #3b82f6 100%)", emoji: "🐄" },
  savoie: { label: "Savoie", color: "var(--info)", gradient: "linear-gradient(180deg, #67e8f9 0%, #06b6d4 100%)", emoji: "🏔️" },
  montagne: { label: "Montagne", color: "var(--violet)", gradient: "linear-gradient(180deg, #c4b5fd 0%, #8b5cf6 100%)", emoji: "⛰️" },
  creme: { label: "Crème", color: "var(--danger)", gradient: "linear-gradient(180deg, #fca5a5 0%, #ef4444 100%)", emoji: "🧈" },
  ecreme_savoie: { label: "Écrémé Savoie", color: "var(--warning)", gradient: "linear-gradient(180deg, #fde68a 0%, #f59e0b 100%)", emoji: "💧" },
  ecreme_montagne: { label: "Écrémé Montagne", color: "var(--violet)", gradient: "linear-gradient(180deg, #ddd6fe 0%, #8b5cf6 100%)", emoji: "💧" }
}

export type TlsStatus = "vide" | "transfert_en_cours" | "attente_osmose" | "osmose_en_cours" | "attente_pasto" | "pasto_en_cours" | "remplissage_en_cours"
export type CfStatus = "vide" | "attente_remplissage" | "remplissage" | "attente_maturation" | "maturation_en_cours" | "attente_soutirage" | "soutirage_en_cours" | "a_laver" | "en_lavage"

export type TlsExecution = {
  commandId?: string;
  status: TlsStatus;
  currentVolume: number;
  permeatVolume?: number;
  fcvApplied?: number;
  tlcDeductions?: { tlcKey: string, volume: number }[];
  pastoData?: { dornic: string | number, tempPasto: string | number, pression: string | number };
  times: {
    transferEnd?: string;
    osmoseStart?: string;
    osmoseEnd?: string;
    pastoStart?: string;
    pastoEnd?: string;
  }
}

export type CfExecution = {
  commandId?: string;
  status: CfStatus;
  currentVolume: number;
  dornic?: string | number;
  tempPasto?: string | number;
  pression?: string | number;
  times: {
    remplissageStart?: string;
    maturationStart?: string;
    maturationEnd?: string;
    soutirageStart?: string;
    soutirageEnd?: string;
  }
}

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
  completedCommands: Command[]

  milkOrders: MilkOrder[]

  // Execution States
  tlsExecution: { [tlsName: string]: TlsExecution }
  cfExecution: { [cfName: string]: CfExecution }
}

const initialCommand = (id: string, name: string, overrides?: Partial<Command>): Command => {
  const selectedCFs = ["CF4", "CF5", "CF1", "CF2", "CF3", "CF11", "CF12", "CF13", "CF14", "CF15"]
  const cfDestinations: { [tankName: string]: "atia" | "grunwald" | "both" } = {}
  const cfSentStatus: { [tankName: string]: { atia: boolean; grunwald: boolean } } = {}

  selectedCFs.forEach(name => {
    cfDestinations[name] = "both"
    cfSentStatus[name] = { atia: false, grunwald: false }
  })

  const references: ProductReference[] = [
    { id: "ref-1", name: "BAIKO", potsQty: 80000, gramPerPot: 105 },
    { id: "ref-2", name: "MDD", potsQty: 40000, gramPerPot: 105 },
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
    startDate: overrides?.startDate || new Date().toISOString().slice(0, 16),
    expectedEndDate: overrides?.expectedEndDate || "",
    calculatedEndDate: overrides?.calculatedEndDate || 0,
    references: overrides?.references || references,
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
    ...overrides,
  }
}

const initialBatches = () => {
  const now = Date.now()
  return {
    tlc1: [
      { id: "batch-1", lotNumber: "2605291200", volume: 30000, protein: 33, fat: 38, milkType: "bio" as MilkType, deliveryDate: now }
    ],
    tlc2: [
      { id: "batch-2", lotNumber: "2605291300", volume: 30000, protein: 34, fat: 39, milkType: "fcv3" as MilkType, deliveryDate: now }
    ],
    tlc3: [
      { id: "batch-3", lotNumber: "2605291400", volume: 30000, protein: 32, fat: 37, milkType: "savoie" as MilkType, deliveryDate: now }
    ],
    tlc4: [
      { id: "batch-4", lotNumber: "2605291500", volume: 30000, protein: 35, fat: 40, milkType: "montagne" as MilkType, deliveryDate: now }
    ],
    tankPermeat: [
      { id: "batch-5", lotNumber: "2605291600", volume: 15000, protein: 0, fat: 400, milkType: "ecreme_savoie" as MilkType, deliveryDate: now }
    ]
  }
}

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

  // Start with empty arrays
  commands: [],
  activeCommandId: "",
  completedCommands: [],

  milkOrders: [],

  tlsExecution: {
    "TLS1": { status: "vide", currentVolume: 0, times: {} },
    "TLS2": { status: "vide", currentVolume: 0, times: {} },
    "TLS3": { status: "vide", currentVolume: 0, times: {} },
  },
  cfExecution: ["CF1", "CF2", "CF3", "CF4", "CF5", "CF10", "CF11", "CF12", "CF13", "CF14", "CF15", "CF20"].reduce((acc, name) => {
    acc[name] = { status: "vide", currentVolume: 0, times: {} };
    return acc;
  }, {} as { [key: string]: CfExecution }),
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

const findBestCombination = (volume: number, availableCFs: typeof CF_TANKS) => {
  if (volume <= 0) return []
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
    return availableCFs
  }

  return bestCombination
}

export const selectCuvesForVolume = (volume: number, milkType: string, isSkyr: boolean = false, availableCFsParam?: typeof CF_TANKS) => {
  if (volume <= 0) return []
  if (isSkyr) return ["CF20"]

  const allowedForCF20 = ["fcv3", "ecreme_savoie", "ecreme_montagne"].includes(milkType)
  const baseTanks = availableCFsParam || CF_TANKS;
  const availableCFs = allowedForCF20 ? baseTanks : baseTanks.filter(t => t.name !== "CF20")
  
  // Imposer une CF de 2200L à la fin si possible
  const cfs2200 = availableCFs.filter(t => t.capacity === 2200)
  if (cfs2200.length > 0) {
    const chosen2200 = cfs2200[0]
    const remainingVolume = volume - chosen2200.capacity
    const otherCFs = availableCFs.filter(t => t.name !== chosen2200.name)
    const bestOther = findBestCombination(remainingVolume, otherCFs)
    return [...bestOther.map(t => t.name), chosen2200.name]
  }

  const bestCombination = findBestCombination(volume, availableCFs)
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

  // Keep distributing until remaining is 0
  while (remaining > 0) {
    let allocatedInCycle = false
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const tankName = key.toUpperCase() // "TLS2", "TLS3", "TLS1"
      const tank = TLS_TANKS.find((t) => t.name === tankName)
      const capacity = tank ? tank.capacity : 0

      const availableCapacity = capacity - alloc[key]
      const take = Math.min(remaining, availableCapacity)
      if (take > 0) {
        alloc[key] = Number((alloc[key] + take).toFixed(3))
        remaining = Number((remaining - take).toFixed(3))
        allocatedInCycle = true
      }
      if (remaining <= 0) break
    }
    if (!allocatedInCycle) break
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
  // Skyr is neither osmosed nor powdered. It is directly pasteurized.
  if (skyrWhiteMass > 0) {
    totalMilkReceivedVolume += skyrWhiteMass
    // We do NOT add to totalOsmosedVolume so it doesn't get powdered
    totalProtReceived += skyrWhiteMass * skyrCi
  }

  processGroup(baikoMddWhiteMass, baikoMddCi)
  processGroup(vdpWhiteMass, vdpCi)
  processGroup(natureWhiteMass, natureCi)

  active.milkReceivedVolume = totalMilkReceivedVolume
  active.osmosedVolume = totalOsmosedVolume

  const classicMax = Math.max(baikoMddWhiteMass, vdpWhiteMass, natureWhiteMass)
  if (classicMax > 0) {
    if (classicMax === vdpWhiteMass) active.milkType = "savoie"
    else if (classicMax === baikoMddWhiteMass) active.milkType = "montagne"
    else active.milkType = "bio"
  } else {
    active.milkType = active.skyrMilkType || "fcv3"
  }

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
        const nonSkyrCFs = selectCuvesForVolume(active.whiteMassKg - skyrWhiteMass, active.milkType, false)
        active.selectedCFs = ["CF20", ...nonSkyrCFs]
      } else if (hasSkyr) {
        active.selectedCFs = ["CF20"]
      } else {
        active.selectedCFs = selectCuvesForVolume(active.whiteMassKg, active.milkType, false)
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
  
  // Skyr skips osmosis and powdering
  const nonSkyrReceivedVolume = Math.max(0, active.milkReceivedVolume - skyrWhiteMass)
  active.timing.osmoseTime = computeOsmoseTime(nonSkyrReceivedVolume, active.milkReceptionValue, active.targetValue)
  active.timing.powderTime = computePowderTime(active.osmosedVolume)
  
  active.timing.pastoTime = computePastoTime(active.whiteMassKg)
  active.timing.maturationTime = DEFAULT_MATURATION_MINUTES

  // Calculate End Date
  if (active.startDate) {
    const totalMinutes = active.timing.transferTime + active.timing.osmoseTime + active.timing.powderTime + active.timing.pastoTime + active.timing.maturationTime
    const startMs = new Date(active.startDate).getTime()
    if (!isNaN(startMs)) {
      active.calculatedEndDate = startMs + totalMinutes * 60000
    }
  }
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
  config?: { needs48hWash: boolean; needsC3Wash: boolean; productionStartTime?: string }
): MultiCommandSimResults => {
  let timeTransferFree = 0
  let timeOsmosisFree = 0
  let timePowderFree = 0
  let timePastoFree = 0
  let timeGrunwald = 0
  let timeAtia = 0
  let timeWashLine1Free = 0
  let timeWashLine2Free = 0
  let timeSoutirageWashFree = 0
  let timeOsmoseWashFree = 0

  let osmosisCount = 0
  let pastoCount = 0
  let last48hWashEnd = 0

  const tlcBatches = {
    tlc1: tlcBatchesInitial.tlc1.map(b => ({ ...b })),
    tlc2: tlcBatchesInitial.tlc2.map(b => ({ ...b })),
    tlc3: tlcBatchesInitial.tlc3.map(b => ({ ...b })),
    tlc4: tlcBatchesInitial.tlc4.map(b => ({ ...b })),
    tankPermeat: tlcBatchesInitial.tankPermeat ? tlcBatchesInitial.tankPermeat.map(b => ({ ...b })) : [],
  }

  const cfAvailableAt: { [tankName: string]: number } = {}
  CF_TANKS.forEach(t => { cfAvailableAt[t.name] = 0 })

  const tlsAvailableAt = { TLS1: 0, TLS2: 0, TLS3: 0 }

  const ganttTasks: GanttTask[] = []

  const simStartMs = config?.productionStartTime ? new Date(config.productionStartTime).getTime() : Date.now()

  const readyTanks: { [type: string]: { cfName: string, readyTime: number, volume: number }[] } = {}
  const typesToProduce: any[] = []
  const milkShortages: { [type: string]: number } = {}

  const globalGroups = {
    skyr: { whiteMassKg: 0, refs: [] as { cmd: Command, ref: ProductReference }[] },
    baiko_mdd: { whiteMassKg: 0, refs: [] as { cmd: Command, ref: ProductReference }[] },
    vdp: { whiteMassKg: 0, refs: [] as { cmd: Command, ref: ProductReference }[] },
    nature: { whiteMassKg: 0, refs: [] as { cmd: Command, ref: ProductReference }[] },
    autres: { whiteMassKg: 0, refs: [] as { cmd: Command, ref: ProductReference }[] }
  }

  commands.forEach(cmd => {
    cmd.references.forEach(r => {
      const mass = (r.potsQty * r.gramPerPot) / 1000
      const name = r.name.toLowerCase()
      if (name.includes("skyr")) {
        globalGroups.skyr.whiteMassKg += mass
        globalGroups.skyr.refs.push({ cmd, ref: r })
      } else if (name.includes("baiko") || name.includes("mdd") || name.includes("nature")) {
        globalGroups.baiko_mdd.whiteMassKg += mass / 1.05
        globalGroups.baiko_mdd.refs.push({ cmd, ref: r })
      } else if (name.includes("val de praz") || name.includes("vdp")) {
        globalGroups.vdp.whiteMassKg += mass / 1.05
        globalGroups.vdp.refs.push({ cmd, ref: r })
      } else if (name.includes("bio")) {
        globalGroups.nature.whiteMassKg += mass
        globalGroups.nature.refs.push({ cmd, ref: r })
      } else {
        globalGroups.autres.whiteMassKg += mass
        globalGroups.autres.refs.push({ cmd, ref: r })
        if (!commandsResults[cmd.id]) {
          commandsResults[cmd.id] = { id: cmd.id, name: cmd.name, transferStart: 0, transferEnd: 0, osmoseStart: 0, osmoseEnd: 0, powderStart: 0, powderEnd: 0, pastoStart: 0, pastoEnd: 0, maturationStart: 0, maturationEnd: 0, packagingStart: 999999, packagingEnd: 0, packagingAtiaDuration: 0, packagingGrunDuration: 0, totalDuration: 0 }
        }
        commandsResults[cmd.id].error = `Erreur : Recettes inconnues (${globalGroups.autres.refs.filter((x: any) => x.cmd.id === cmd.id).map((x: any) => x.ref.name).join(", ")}). Le lait n'a pas pu être sélectionné et ces produits ne seront pas planifiés.`
      }
    })
  })

  if (globalGroups.skyr.whiteMassKg > 0) typesToProduce.push({ key: `skyr-global`, name: "MB Skyr", ...globalGroups.skyr, preferredTypes: ["fcv3", "ecreme_savoie", "ecreme_montagne", "creme"] as MilkType[], isSkyr: true })
  if (globalGroups.baiko_mdd.whiteMassKg > 0) typesToProduce.push({ key: `baiko_mdd-global`, name: "MB Baiko/MDD", ...globalGroups.baiko_mdd, preferredTypes: ["montagne", "savoie"] as MilkType[], isSkyr: false })
  if (globalGroups.vdp.whiteMassKg > 0) typesToProduce.push({ key: `vdp-global`, name: "MB VDP", ...globalGroups.vdp, preferredTypes: ["savoie"] as MilkType[], isSkyr: false })
  if (globalGroups.nature.whiteMassKg > 0) typesToProduce.push({ key: `nature-global`, name: "MB Nature", ...globalGroups.nature, preferredTypes: ["bio"] as MilkType[], isSkyr: false })

  const drawMilk = (reqVol: number, preferredTypes: MilkType[]) => {
    let remainingToDraw = reqVol
    let totalProtDrawn = 0
    let actualDrawn = 0
    let lastTypeDrawn = preferredTypes[0]
    let milkAvailableAt = 0
    let emptiedTLCs: string[] = []

    const tlcKeys: (keyof typeof tlcBatches)[] = ["tlc1", "tlc2", "tlc3", "tlc4", "tankPermeat"]

    for (const type of preferredTypes) {
      if (remainingToDraw <= 0) break
      for (const k of tlcKeys) {
        if (remainingToDraw <= 0) break
        const batches = tlcBatches[k]
        if (!batches) continue

        batches.sort((a, b) => a.deliveryDate - b.deliveryDate)
        const beforeLen = batches.filter(b => b.volume > 0).length

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
            milkAvailableAt = Math.max(milkAvailableAt, b.deliveryDate)
          }
        }
        const afterBatches = batches.filter(b => b.volume > 0)
        if (beforeLen > 0 && afterBatches.length === 0) {
          emptiedTLCs.push(k)
        }
        tlcBatches[k] = afterBatches
      }
    }
    return { actualDrawn, totalProtDrawn, lastTypeDrawn, milkAvailableAt, emptiedTLCs }
  }

  let colorIdx = 0
  const getNextColor = (step: string) => {
    const hues = [220, 142, 275, 38, 345, 95, 195]
    const hue = hues[colorIdx % hues.length]
    switch (step) {
      case "transfer": return `hsl(${hue}, 80%, 60%)`
      case "osmose": return `hsl(${hue}, 75%, 45%)`
      case "pasto": return `hsl(${hue}, 80%, 40%)`
      case "maturation": return `hsl(${hue}, 60%, 50%)`
      default: return `hsl(${hue}, 70%, 50%)`
    }
  }

  const commandsResults: { [id: string]: CommandSimResult } = {}
  commands.forEach(cmd => {
    commandsResults[cmd.id] = {
      id: cmd.id,
      name: cmd.name,
      transferStart: 0,
      transferEnd: 0,
      osmoseStart: 0,
      osmoseEnd: 0,
      powderStart: 0,
      powderEnd: 0,
      pastoStart: 0,
      pastoEnd: 0,
      maturationStart: 0,
      maturationEnd: 0,
      packagingStart: 999999,
      packagingEnd: 0,
      packagingAtiaDuration: 0,
      packagingGrunDuration: 0,
      totalDuration: 0,
      referencesResults: []
    }
  })

  const cfEmptyTimes: { [cfName: string]: number } = {}

  typesToProduce.forEach(group => {
    if (group.whiteMassKg <= 0) return

    // Calculate total emptying time dynamically based on the exact packaging speeds for this group's references
    let totalGroupEmptyMinutes = 0
    group.refs.forEach(({ cmd, ref }: { cmd: Command, ref: ProductReference }) => {
      let mass = (ref.potsQty * ref.gramPerPot) / 1000
      const dest = cmd.refDestinations?.[ref.id] || "both"

      let atiaKgPerHour = (3500 * ref.gramPerPot) / 1000
      let grunKgPerHour = (10000 * ref.gramPerPot) / 1000

      if (dest === "atia") {
        totalGroupEmptyMinutes += (mass / atiaKgPerHour) * 60
      } else if (dest === "grunwald") {
        totalGroupEmptyMinutes += (mass / grunKgPerHour) * 60
      } else {
        let bothKgPerHour = atiaKgPerHour + grunKgPerHour
        totalGroupEmptyMinutes += (mass / bothKgPerHour) * 60
      }
    })

    let remWhiteMass = group.whiteMassKg

    const CHUNK_SIZE = 5200

    let groupPackagingAvailableAt = 0

    while (remWhiteMass > 0) {
      const chunkMass = Math.min(remWhiteMass, CHUNK_SIZE)
      remWhiteMass -= chunkMass

      const targetVal = 41
      const reqRaw = chunkMass * (targetVal / 33.0)
      const { actualDrawn, totalProtDrawn, lastTypeDrawn, milkAvailableAt, emptiedTLCs } = drawMilk(reqRaw, group.preferredTypes)
      
      if (actualDrawn < reqRaw) {
        const shortage = reqRaw - actualDrawn
        const typeKey = group.preferredTypes.join(" / ")
        milkShortages[typeKey] = (milkShortages[typeKey] || 0) + shortage
      }

      const ci = actualDrawn > 0 ? totalProtDrawn / actualDrawn : 33.0

      const transferDuration = computeTransferTime(reqRaw)
      const availableTLS = ["TLS1", "TLS2", "TLS3"].sort((a, b) => tlsAvailableAt[a as keyof typeof tlsAvailableAt] - tlsAvailableAt[b as keyof typeof tlsAvailableAt])[0] as keyof typeof tlsAvailableAt
      
      let deliveryDelayMinutes = 0
      if (milkAvailableAt > simStartMs) {
        deliveryDelayMinutes = Math.ceil((milkAvailableAt - simStartMs) / 60000)
      }

      const transferStart = Math.max(tlsAvailableAt[availableTLS], timeTransferFree, deliveryDelayMinutes)
      const transferEnd = transferStart + transferDuration
      timeTransferFree = transferEnd
      // tlsAvailableAt will be updated after the TLS is washed (after osmosis)
      
      const uniqueCmdIds = Array.from(new Set(group.refs.map((r: any) => r.cmd.id))) as string[]
      uniqueCmdIds.forEach(cmdId => {
        const res = commandsResults[cmdId]
        if (res.transferStart === 0 || transferStart < res.transferStart) res.transferStart = transferStart
        res.transferEnd = Math.max(res.transferEnd, transferEnd)
      })

      ganttTasks.push({
        key: `transfer-${group.key}-${Date.now()}-${Math.random()}`,
        label: `${group.name} : Transfert TLC ➔ ${availableTLS}`,
        startMinute: transferStart,
        durationMinutes: transferDuration,
        color: getNextColor("transfer"),
      })

      emptiedTLCs.forEach(tlcName => {
        ganttTasks.push({
          key: `tlc-wash-${tlcName}-${Date.now()}-${Math.random()}`,
          label: `Lavage ${tlcName.toUpperCase()}`,
          startMinute: transferEnd,
          durationMinutes: 50,
          color: "#94a3b8",
        })
      })

      // Osmosis Wash Check
      let osmoseWashInserted = false
      let osmoseEnd = transferEnd

      const refsList = group.refs.map((r: any) => `- ${r.ref.name} (${r.ref.potsQty} pots)`).join('\n')
      const groupDetails = `Commande : ${group.name}\nTLS : ${availableTLS}\nRéférences :\n${refsList}`

      if (!group.isSkyr) {
        if (timeOsmosisFree > 0 && Math.max(transferEnd, timeOsmosisFree) - timeOsmosisFree >= 60) {
          const washStart = Math.max(timeOsmosisFree, timeOsmoseWashFree)
          ganttTasks.push({
            key: `osm-wash-${group.key}-court-${Math.random()}`,
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
            key: `osm-wash-${group.key}-long-${Math.random()}`,
            label: `Lavage Osmoseur (LONG)`,
            startMinute: washStart,
            durationMinutes: 150,
            color: "#cbd5e1",
          })
          timeOsmoseWashFree = washStart + 150
          timeOsmosisFree = Math.max(timeOsmosisFree, timeOsmoseWashFree)
          osmoseWashInserted = true
        }
        if (osmoseWashInserted) osmosisCount = 0

        const osmoseStart = Math.max(transferEnd, timeOsmosisFree)
        const osmoseDuration = computeOsmoseTime(reqRaw, ci, targetVal)
        osmoseEnd = osmoseStart + osmoseDuration
        timeOsmosisFree = osmoseEnd
        osmosisCount++

        uniqueCmdIds.forEach(cmdId => {
          const res = commandsResults[cmdId]
          if (res.osmoseStart === 0 || osmoseStart < res.osmoseStart) res.osmoseStart = osmoseStart
          res.osmoseEnd = Math.max(res.osmoseEnd, osmoseEnd)
        })

        ganttTasks.push({
          key: `osmose-${group.key}-${Date.now()}-${Math.random()}`,
          label: `${group.name} : Osmose ${availableTLS}`,
          startMinute: osmoseStart,
          durationMinutes: osmoseDuration,
          color: getNextColor("osmose"),
          details: groupDetails,
        })
      }

      const powderDuration = group.isSkyr ? 0 : computePowderTime(chunkMass)
      const pastoDuration = computePastoTime(chunkMass)

      // Pasto Wash Check
      let pastoWashInserted = false
      const waitPasto = Math.max(osmoseEnd + powderDuration, timePastoFree) - timePastoFree
      if (timePastoFree > 0 && waitPasto >= 60) {
        const washStart = Math.max(timePastoFree, timeWashLine2Free)
        ganttTasks.push({
          key: `pasto-wash-${group.key}-court-${Math.random()}`,
          label: `Lavage C4 (Pasteurisateur COURT)`,
          startMinute: washStart,
          durationMinutes: 90,
          color: "#cbd5e1",
        })
        timeWashLine2Free = washStart + 90
        timePastoFree = Math.max(timePastoFree, timeWashLine2Free)
        pastoWashInserted = true
      } else if (pastoCount >= 3) {
        const washStart = Math.max(osmoseEnd + powderDuration, timePastoFree, timeWashLine2Free)
        ganttTasks.push({
          key: `pasto-wash-${group.key}-long-${Math.random()}`,
          label: `Lavage C4 (Pasteurisateur LONG)`,
          startMinute: washStart,
          durationMinutes: 150,
          color: "#cbd5e1",
        })
        timeWashLine2Free = washStart + 150
        timePastoFree = Math.max(timePastoFree, timeWashLine2Free)
        pastoWashInserted = true
      }
      if (pastoWashInserted) pastoCount = 0

      let requiredPastoStart = Math.max(osmoseEnd + powderDuration, timePastoFree)

      const pastoStart = requiredPastoStart
      const pastoEnd = pastoStart + pastoDuration
      timePastoFree = pastoEnd
      timePowderFree = pastoStart - powderDuration
      pastoCount++

      uniqueCmdIds.forEach(cmdId => {
        const res = commandsResults[cmdId]
        if (!group.isSkyr) {
          if (res.powderStart === 0 || timePowderFree < res.powderStart) res.powderStart = timePowderFree
          res.powderEnd = Math.max(res.powderEnd, timePowderFree + powderDuration)
        }
        if (res.pastoStart === 0 || pastoStart < res.pastoStart) res.pastoStart = pastoStart
        res.pastoEnd = Math.max(res.pastoEnd, pastoEnd)
      })

      ganttTasks.push({
        key: `pasto-${group.key}-${Date.now()}-${Math.random()}`,
        label: group.isSkyr ? `${group.name} : Pasto` : `${group.name} : Poudrage + Pasto`,
        startMinute: group.isSkyr ? pastoStart : timePowderFree,
        durationMinutes: powderDuration + pastoDuration,
        color: getNextColor("pasto"),
        details: groupDetails,
      })

      // Lavage TLS immediately after pasto is empty
      const tlsWashStart = pastoEnd
      const tlsWashDuration = 20
      ganttTasks.push({
        key: `tls-wash-${availableTLS}-${group.key}-${Date.now()}-${Math.random()}`,
        label: `Lavage ${availableTLS}`,
        startMinute: tlsWashStart,
        durationMinutes: tlsWashDuration,
        color: "#cbd5e1",
      })
      tlsAvailableAt[availableTLS] = tlsWashStart + tlsWashDuration

      let remToFill = chunkMass
      while (remToFill > 0) {
        const availableCFs = CF_TANKS.filter(t => group.isSkyr ? t.name === "CF20" : t.name !== "CF20")
        availableCFs.sort((a, b) => (cfAvailableAt[a.name] || 0) - (cfAvailableAt[b.name] || 0))
        const cfTank = availableCFs[0]

        const fillAmount = Math.min(remToFill, cfTank.capacity)
        remToFill -= fillAmount

        const fillStart = Math.max(pastoEnd, cfAvailableAt[cfTank.name])
        const fillDuration = (fillAmount / 5000) * 60
        const maturationStart = fillStart + fillDuration
        const maturationEnd = maturationStart + 360

        // Sequentially estimate empty time for this chunk
        const chunkEmptyDuration = (fillAmount / group.whiteMassKg) * totalGroupEmptyMinutes
        const emptyStart = Math.max(maturationEnd, groupPackagingAvailableAt)
        const emptyEnd = emptyStart + chunkEmptyDuration
        groupPackagingAvailableAt = emptyEnd

        const estimatedWashDuration = (cfTank.name === "CF20") ? 110 : 20 // 20m wash + 90m soutirage
        cfAvailableAt[cfTank.name] = emptyEnd + estimatedWashDuration

        ganttTasks.push({
          key: `maturation-${cfTank.name}-${Date.now()}-${Math.random()}`,
          label: `Maturation ${cfTank.name} (${group.name})`,
          startMinute: maturationStart,
          durationMinutes: 360,
          color: getNextColor("maturation"),
        })

        if (!readyTanks[group.key]) readyTanks[group.key] = []
        readyTanks[group.key].push({ cfName: cfTank.name, readyTime: maturationEnd, volume: fillAmount })
        
        uniqueCmdIds.forEach(cmdId => {
          const res = commandsResults[cmdId]
          if (res.maturationStart === 0 || maturationStart < res.maturationStart) {
            res.maturationStart = maturationStart
            res.firstTankName = cfTank.name
          }
          res.maturationEnd = Math.max(res.maturationEnd, maturationEnd)
          res.firstTankMaturationEnd = res.maturationEnd
        })
      }
    }

    // Now immediately empty the tanks for this group
    const tanks = readyTanks[group.key]?.sort((a: any, b: any) => a.readyTime - b.readyTime) || []

    group.refs.forEach(({ cmd, ref }: { cmd: Command, ref: ProductReference }) => {
      let gramPerPot = ref.gramPerPot || 125
      let refVol = (ref.potsQty * gramPerPot) / 1000
      const dest = cmd.refDestinations?.[ref.id] || "both"
      const customPots = cmd.refPotsLaunched?.[ref.id]
      const potsDefault = ref.potsQty

      let potsAtia = 0
      let potsGrun = 0
      if (dest === "atia") {
        potsAtia = customPots?.atia !== undefined ? customPots.atia : potsDefault
      } else if (dest === "grunwald") {
        potsGrun = customPots?.grunwald !== undefined ? customPots.grunwald : potsDefault
      } else {
        potsAtia = customPots?.atia !== undefined ? customPots.atia : potsDefault * (3500 / 13500)
        potsGrun = customPots?.grunwald !== undefined ? customPots.grunwald : potsDefault * (10000 / 13500)
      }

      let refStart = 999999
      let refEnd = 0

      while (refVol > 0 && tanks.length > 0) {
        const t = tanks[0]
        if (t.volume <= 0) {
          tanks.shift()
          continue
        }

        const take = Math.min(refVol, t.volume)
        t.volume -= take
        refVol -= take

        const takeRatio = (potsAtia + potsGrun) > 0 ? take / ((potsAtia + potsGrun) * gramPerPot / 1000) : 0
        const takePotsAtia = potsAtia * takeRatio
        const takePotsGrun = potsGrun * takeRatio

        let chunkStart = 0
        let chunkEnd = 0

        // Check 48h wash dynamically for this reference chunk
        const expectedAtiaDuration = dest === "atia" || dest === "both" ? (takePotsAtia / 3500) * 60 : 0
        const expectedGrunDuration = dest === "grunwald" || dest === "both" ? (takePotsGrun / 10000) * 60 : 0
        const expectedAtiaStart = Math.max(t.readyTime, timeAtia)
        const expectedGrunStart = Math.max(t.readyTime, timeGrunwald)

        const expectedPkgStart = dest === "both" ? Math.min(expectedAtiaStart, expectedGrunStart) : (dest === "atia" ? expectedAtiaStart : expectedGrunStart)
        const expectedPkgEnd = Math.max(
          dest === "atia" || dest === "both" ? expectedAtiaStart + expectedAtiaDuration : 0,
          dest === "grunwald" || dest === "both" ? expectedGrunStart + expectedGrunDuration : 0
        )

        const timeSinceLastWash = expectedPkgEnd - last48hWashEnd
        const maxLimit = 52 * 60
        const minLimit = 44 * 60

        if (timeSinceLastWash > maxLimit || (expectedPkgStart - last48hWashEnd >= minLimit)) {
          let c5Start = Math.max(timeAtia, timeGrunwald, timeSoutirageWashFree)
          ganttTasks.push({
            key: `wash-c5-dyn-${cmd.id}-${ref.id}-${Math.random()}`,
            label: `Lavage 48H: C5 (Pré-Cond.)`,
            startMinute: c5Start,
            durationMinutes: 90,
            color: "#94a3b8",
          })
          let c5End = c5Start + 90
          timeSoutirageWashFree = c5End

          let atiaStart = c5End
          ganttTasks.push({
            key: `wash-atia-dyn-${cmd.id}-${ref.id}-${Math.random()}`,
            label: `Lavage 48H: ATIA`,
            startMinute: atiaStart,
            durationMinutes: 50,
            color: "#94a3b8",
          })

          let grunStart = c5End
          ganttTasks.push({
            key: `wash-grun-dyn-${cmd.id}-${ref.id}-${Math.random()}`,
            label: `Lavage 48H: Grunwald`,
            startMinute: grunStart,
            durationMinutes: 110,
            color: "#94a3b8",
          })

          timeAtia = atiaStart + 50
          timeGrunwald = grunStart + 110
          last48hWashEnd = Math.max(timeAtia, timeGrunwald)
        }

        if (dest === "grunwald") {
          chunkStart = Math.max(t.readyTime, timeGrunwald)
          const duration = (takePotsGrun / 10000) * 60
          chunkEnd = chunkStart + duration
          timeGrunwald = chunkEnd

          ganttTasks.push({
            key: `pkg-grun-${cmd.id}-${ref.id}-${Math.random()}`,
            label: `Cond. ${ref.name} (GRUN)`,
            startMinute: chunkStart,
            durationMinutes: duration,
            color: "hsl(200, 90%, 55%)",
          })
        } else if (dest === "atia") {
          chunkStart = Math.max(t.readyTime, timeAtia)
          const duration = (takePotsAtia / 3500) * 60
          chunkEnd = chunkStart + duration
          timeAtia = chunkEnd

          ganttTasks.push({
            key: `pkg-atia-${cmd.id}-${ref.id}-${Math.random()}`,
            label: `Cond. ${ref.name} (ATIA)`,
            startMinute: chunkStart,
            durationMinutes: duration,
            color: "hsl(220, 90%, 65%)",
          })
        } else {
          const startAtia = Math.max(t.readyTime, timeAtia)
          const startGrun = Math.max(t.readyTime, timeGrunwald)
          const atiaDuration = (takePotsAtia / 3500) * 60
          const grunDuration = (takePotsGrun / 10000) * 60
          chunkStart = Math.min(startAtia, startGrun)

          const endAtia = startAtia + atiaDuration
          const endGrun = startGrun + grunDuration
          chunkEnd = Math.max(endAtia, endGrun)

          timeAtia = endAtia
          timeGrunwald = endGrun

          if (takePotsAtia > 0) {
            ganttTasks.push({
              key: `pkg-atia-${cmd.id}-${ref.id}-${Math.random()}`,
              label: `Cond. ${ref.name} (ATIA)`,
              startMinute: startAtia,
              durationMinutes: atiaDuration,
              color: "hsl(220, 90%, 65%)",
            })
          }
          if (takePotsGrun > 0) {
            ganttTasks.push({
              key: `pkg-grun-${cmd.id}-${ref.id}-${Math.random()}`,
              label: `Cond. ${ref.name} (GRUN)`,
              startMinute: startGrun,
              durationMinutes: grunDuration,
              color: "hsl(200, 90%, 55%)",
            })
          }
        }

        ganttTasks.push({
          key: `empty-${t.cfName}-${Math.random()}`,
          label: `Vidage ${t.cfName}`,
          startMinute: chunkStart,
          durationMinutes: chunkEnd - chunkStart,
          color: "hsl(180, 50%, 45%)",
        })

        cfEmptyTimes[t.cfName] = Math.max(cfEmptyTimes[t.cfName] || 0, chunkEnd)

        refStart = Math.min(refStart, chunkStart)
        refEnd = Math.max(refEnd, chunkEnd)

        if (t.volume <= 0.001) {
          let washStart = 0
          if (t.cfName === "CF20") {
            washStart = chunkEnd // Lavage direct après vidage
            const washEnd = washStart + 20
            ganttTasks.push({
              key: `${t.cfName}-wash-${Math.random()}`,
              label: `Lavage ${t.cfName}`,
              startMinute: washStart,
              durationMinutes: 20,
              color: "#cbd5e1",
            })
            cfAvailableAt[t.cfName] = washEnd

            // Le lavage CF20 n'occupe plus la ligne de lavage principale pour ne pas bloquer
            // ou être bloqué.

            const soutirageCF20Start = Math.max(washEnd, timeSoutirageWashFree)
            ganttTasks.push({
              key: `wash-soutirage-cf20-${Math.random()}`,
              label: `Lavage Ligne Soutirage CF20`,
              startMinute: soutirageCF20Start,
              durationMinutes: 90,
              color: "#94a3b8",
            })
            const soutirageEnd = soutirageCF20Start + 90
            timeSoutirageWashFree = soutirageEnd
            cfEmptyTimes[t.cfName] = soutirageEnd
          } else {
            washStart = chunkEnd // Lavage direct après vidage
            const washEnd = washStart + 20
            ganttTasks.push({
              key: `${t.cfName}-wash-${Math.random()}`,
              label: `Lavage ${t.cfName}`,
              startMinute: washStart,
              durationMinutes: 20,
              color: "#cbd5e1",
            })
            cfAvailableAt[t.cfName] = washEnd
            cfEmptyTimes[t.cfName] = washEnd
          }
          if (t.cfName === commandsResults[cmd.id].firstTankName) {
            commandsResults[cmd.id].firstTankEmptyEnd = chunkEnd
          }
        }
      }

      const res = commandsResults[cmd.id]
      if (!res.referencesResults) res.referencesResults = []
      res.referencesResults.push({ refId: ref.id, name: ref.name, start: refStart, end: refEnd })

      res.packagingStart = Math.min(res.packagingStart, refStart)
      res.packagingEnd = Math.max(res.packagingEnd, refEnd)
      res.totalDuration = Math.max(res.totalDuration, refEnd)
    })
    colorIdx++
  })

  // Final Wash Lines
  let endWashTimeLine1 = Math.max(timeGrunwald, timeAtia, timePastoFree, ...Object.values(cfAvailableAt), ...Object.values(tlsAvailableAt))
  let endWashTimeLine2 = endWashTimeLine1

  const tlcWashStart = Math.max(endWashTimeLine1, timeWashLine1Free)
  ganttTasks.push({
    key: `wash-tlc`,
    label: `Lavages TLC & TLP (Vides)`,
    startMinute: tlcWashStart,
    durationMinutes: 50,
    color: "#94a3b8",
  })
  endWashTimeLine1 = tlcWashStart + 50

  if (config?.needs48hWash) {
    const c5Start = Math.max(endWashTimeLine2, timeSoutirageWashFree)
    ganttTasks.push({
      key: `wash-c5`,
      label: `Lavage C5 (Ligne de soutirage)`,
      startMinute: c5Start,
      durationMinutes: 90,
      color: "#94a3b8",
    })
    const c5End = c5Start + 90
    timeSoutirageWashFree = c5End
    endWashTimeLine2 = c5End

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
    let c3WashStart = Math.max(1320, endWashTimeLine1)
    ganttTasks.push({
      key: `wash-c3`,
      label: `Lavage C3 (Poudrage/Osmose/Pasto)`,
      startMinute: c3WashStart,
      durationMinutes: 60,
      color: "#94a3b8",
    })
    endWashTimeLine1 = c3WashStart + 60
  }

  ganttTasks.push({
    key: `wash-c2`,
    label: `Lavage C2 (Circuit Réception)`,
    startMinute: endWashTimeLine1,
    durationMinutes: 70,
    color: "#94a3b8",
  })
  endWashTimeLine1 += 70

  ganttTasks.push({
    key: `wash-c4`,
    label: `Lavage C4 (Pasto & Envoi)`,
    startMinute: endWashTimeLine2,
    durationMinutes: 120,
    color: "#94a3b8",
  })
  endWashTimeLine2 += 120

  const finalGanttTasks: GanttTask[] = []
  const createGroupedRow = (key: string, label: string, filterFn: (t: GanttTask) => boolean, shortLabelFn: (t: GanttTask) => string, defaultColor: string) => {
    const matchingTasks = ganttTasks.filter(filterFn)
    if (matchingTasks.length === 0) return
    const segments = matchingTasks.map(t => ({
      startMinute: t.startMinute,
      durationMinutes: t.durationMinutes,
      color: t.color,
      label: t.label,
      shortLabel: shortLabelFn(t),
      details: t.details,
    })).sort((a, b) => a.startMinute - b.startMinute)

    const startMin = Math.min(...matchingTasks.map(t => t.startMinute))
    const endMax = Math.max(...matchingTasks.map(t => t.startMinute + t.durationMinutes))

    finalGanttTasks.push({
      key, label, startMinute: startMin, durationMinutes: endMax - startMin, color: defaultColor, segments
    })
  }

  createGroupedRow("grouped-transfer", "1. Transfert TLC ➔ TLS / Écrémage", t => t.label.includes("Transfert") || (t.label.includes("Lavage") && !!t.label.match(/TLS\d+/)), t => {
    return t.label.includes("Lavage") ? "Lav. TLS" : "TLC-TLS"
  }, "hsl(220, 80%, 60%)")
  createGroupedRow("grouped-osmose", "2. Osmose Inverse", t => t.label.includes("Osmose"), t => "Osmose", "hsl(220, 75%, 45%)")
  createGroupedRow("grouped-pasto", "3. Poudrage & Pasteurisation", t => t.label.includes("Pasto") || t.label.includes("Lavage C4"), t => {
    return t.label.includes("Lavage") ? "Lav. C4" : "Pasto"
  }, "hsl(220, 80%, 40%)")
  createGroupedRow("grouped-maturation", "4. Maturation en Cuves", t => t.label.includes("Maturation"), t => {
    const match = t.label.match(/CF\d+/); return match ? match[0] : "Maturation";
  }, "hsl(220, 60%, 50%)")
  createGroupedRow("grouped-cf-empty", "5. Vidage CF (Début Cond.)", t => t.label.includes("Vidage"), t => {
    const match = t.label.match(/CF\d+/); return match ? match[0] : "Vidage";
  }, "hsl(180, 50%, 45%)")
  createGroupedRow("grouped-cf-wash", "6. Lavage Cuves CF", t => t.label.includes("Lavage") && !!t.label.match(/CF\d+/), t => {
    const match = t.label.match(/CF\d+/); return match ? match[0] : "Lavage";
  }, "#cbd5e1")
  createGroupedRow("grouped-packaging-atia", "7. Conditionnement (Ligne ATIA)", t => t.label.includes("(ATIA)") || t.label.includes("ATIA+GRUN"), t => "ATIA", "hsl(220, 90%, 65%)")
  createGroupedRow("grouped-packaging-grun", "8. Conditionnement (Ligne GRUNWALD)", t => t.label.includes("(GRUN)") || t.label.includes("ATIA+GRUN"), t => "GRUN", "hsl(200, 90%, 55%)")
  createGroupedRow("grouped-wash", "9. Lavages (C5, ATIA, C3, C2, Osm)", t => t.label.includes("Lavage") && !t.label.match(/CF\d+/) && !t.label.match(/TLS\d+/) && !t.label.includes("Lavage C4"), t => {
    return t.label.replace("Lavage ", "")
  }, "#94a3b8")

  let totalDurationMinutes = Math.max(endWashTimeLine1, endWashTimeLine2)

  return {
    totalDurationMinutes,
    commandsResults,
    tlcRemainingBatches: tlcBatches,
    ganttTasks: finalGanttTasks,
    milkShortages,
  }
}
const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    // Multi-command lifecycle management
    addCommand(state, action: PayloadAction<{ name: string; startDate: string; expectedEndDate: string; references: { refName: string; potsQty: number; gramPerPot: number }[] }>) {
      const { name, startDate, expectedEndDate, references } = action.payload
      const nextIdx = state.commands.length + 1
      const cmdName = name || `Commande ${nextIdx}`
      const newCmd = initialCommand(`cmd-${Date.now()}`, cmdName, {
        startDate,
        expectedEndDate,
        references: (references || []).map((r, i) => {
          let milkType: MilkType = "montagne"
          const n = r.refName.toLowerCase()
          if (n.includes("skyr")) milkType = "fcv3"
          else if (n.includes("val de praz") || n.includes("vdp")) milkType = "savoie"
          else if (n.includes("baiko") || n.includes("mdd") || n.includes("nature")) milkType = "montagne"
          else if (n.includes("bio")) milkType = "bio"
          return {
            id: `ref-${Date.now()}-${i}`,
            name: r.refName,
            potsQty: r.potsQty,
            gramPerPot: r.gramPerPot,
            milkType
          }
        })
      })
      state.commands.push(newCmd)
      state.activeCommandId = newCmd.id
      recalculateActiveCommandMetrics(state, newCmd)
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
    updateCommand(state, action: PayloadAction<{ id: string; name?: string; startDate?: string; expectedEndDate?: string; references?: { refName: string; potsQty: number; gramPerPot: number }[] }>) {
      const { id, name, startDate, expectedEndDate, references } = action.payload
      const cmd = state.commands.find(c => c.id === id)
      if (cmd) {
        if (name !== undefined) cmd.name = name
        if (startDate !== undefined) cmd.startDate = startDate
        if (expectedEndDate !== undefined) cmd.expectedEndDate = expectedEndDate
        if (references !== undefined) {
          cmd.references = references.map((r, i) => {
            let milkType: MilkType = "montagne"
            const n = r.refName.toLowerCase()
            if (n.includes("skyr")) milkType = "fcv3"
            else if (n.includes("val de praz") || n.includes("vdp")) milkType = "savoie"
            else if (n.includes("baiko") || n.includes("mdd") || n.includes("nature")) milkType = "montagne"
            else if (n.includes("bio")) milkType = "bio"
            return {
              id: `ref-${Date.now()}-${i}`,
              name: r.refName,
              potsQty: r.potsQty,
              gramPerPot: r.gramPerPot,
              milkType
            }
          })
        }
        recalculateActiveCommandMetrics(state, cmd)
        if (state.activeCommandId === cmd.id) {
          syncActiveCommandToRoot(state)
        }
      }
      state.simulationDone = false
    },
    deleteCommand(state, action: PayloadAction<string>) {
      const toDelete = action.payload
      state.commands = state.commands.filter(c => c.id !== toDelete)

      if (state.commands.length > 0) {
        if (state.activeCommandId === toDelete) {
          state.activeCommandId = state.commands[0].id
        }
      } else {
        state.activeCommandId = ""
      }
      syncActiveCommandToRoot(state)
      state.simulationDone = false
    },
    completeCommand(state, action: PayloadAction<string>) {
      const toCompleteId = action.payload
      const cmdIndex = state.commands.findIndex(c => c.id === toCompleteId)
      if (cmdIndex !== -1) {
        const cmd = state.commands[cmdIndex]
        cmd.status = "dispatched"
        state.completedCommands.push(cmd)
        state.commands.splice(cmdIndex, 1)

        if (state.commands.length > 0) {
          state.activeCommandId = state.commands[0].id
        } else {
          state.activeCommandId = ""
        }
        syncActiveCommandToRoot(state)
        state.simulationDone = false
      }
    },
    // TLS Execution Reducers
    initTlsTransfer(state, action: PayloadAction<{ tlsName: string, commandId: string, volume: number, tlcDeductions: { tlcKey: string, volume: number }[] }>) {
      const { tlsName, commandId, volume, tlcDeductions } = action.payload
      
      const cmd = state.commands.find(c => c.id === commandId)
      if (cmd) {
        cmd.executedRawMilk = (cmd.executedRawMilk || 0) + volume
      }

      state.tlsExecution[tlsName] = { 
        ...state.tlsExecution[tlsName], 
        status: "transfert_en_cours", 
        commandId, 
        currentVolume: volume,
        tlcDeductions,
        times: { transferStart: new Date().toISOString() } as any 
      }
    },
    validateTlsTransferEnd(state, action: PayloadAction<{ tlsName: string }>) {
      const { tlsName } = action.payload
      const exec = state.tlsExecution[tlsName]
      if (exec) {
        exec.status = "attente_osmose"
        exec.times.transferEnd = new Date().toISOString()
        
        // Deduct from TLCs
        if (exec.tlcDeductions) {
          exec.tlcDeductions.forEach(deduction => {
            const batches = state.tlcBatches[deduction.tlcKey as keyof typeof state.tlcBatches]
            if (batches) {
              let remainingToDeduct = deduction.volume
              // Deduct from oldest batches first
              batches.sort((a, b) => a.deliveryDate - b.deliveryDate)
              for (const batch of batches) {
                if (remainingToDeduct <= 0) break
                const take = Math.min(batch.volume, remainingToDeduct)
                batch.volume -= take
                remainingToDeduct -= take
              }
            }
          })
        }
      }
    },
    validateTlsOsmoseStart(state, action: PayloadAction<{ tlsName: string }>) {
      const exec = state.tlsExecution[action.payload.tlsName]
      if (exec) {
        exec.status = "osmose_en_cours"
        exec.times.osmoseStart = new Date().toISOString()
      }
    },
    validateTlsOsmoseEnd(state, action: PayloadAction<{ tlsName: string, permeatVol: number, fcvApplied: number }>) {
      const { tlsName, permeatVol, fcvApplied } = action.payload
      const exec = state.tlsExecution[tlsName]
      if (exec) {
        exec.status = "attente_pasto"
        exec.permeatVolume = permeatVol
        exec.fcvApplied = fcvApplied
        exec.currentVolume = Math.max(0, exec.currentVolume - permeatVol)
        exec.times.osmoseEnd = new Date().toISOString()
      }
    },
    validateTlsPastoStart(state, action: PayloadAction<{ tlsName: string }>) {
      const exec = state.tlsExecution[action.payload.tlsName]
      if (exec) {
        const cmdId = exec.commandId
        const cmd = state.commands.find(c => c.id === cmdId)
        
        // Find available CFs
        const availableCFs = CF_TANKS.filter(t => state.cfExecution[t.name]?.status === "vide")
        const sequence = selectCuvesForVolume(exec.currentVolume, cmd?.milkType || "", cmd?.isSkyr, availableCFs)
        
        // Allocate volumes
        const cfVolumes: {[key: string]: number} = {}
        let remaining = exec.currentVolume
        for (const cfName of sequence) {
          const cap = CF_TANKS.find(t => t.name === cfName)?.capacity || 0
          const take = Math.min(remaining, cap)
          cfVolumes[cfName] = take
          remaining -= take
          
          if (state.cfExecution[cfName]) {
            state.cfExecution[cfName] = {
              ...state.cfExecution[cfName],
              status: "attente_remplissage",
              commandId: cmdId,
              currentVolume: take
            }
          }
        }
        
        if (cmd) {
          cmd.cfSequence = sequence
          cmd.cfVolumes = cfVolumes
          cmd.producedWhiteMass = (cmd.producedWhiteMass || 0) + exec.currentVolume
        }

        exec.status = "vide"
        exec.currentVolume = 0
        exec.times.pastoStart = new Date().toISOString()
        exec.times.pastoEnd = new Date().toISOString()
        exec.commandId = undefined
      }
    },
    validateCfRemplissageStart(state, action: PayloadAction<{ cfName: string, pastoData: { dornic: number|string, tempPasto: number|string, pression: number|string } }>) {
      const { cfName, pastoData } = action.payload
      const exec = state.cfExecution[cfName]
      if (exec) {
        exec.status = "remplissage"
        exec.dornic = pastoData.dornic
        exec.tempPasto = pastoData.tempPasto
        exec.pression = pastoData.pression
        exec.times.remplissageStart = new Date().toISOString()
        
        const cmd = state.commands.find(c => c.id === exec.commandId)
        if (cmd) {
          cmd.lastPastoData = pastoData
        }
      }
    },
    validateCfRemplissageEnd(state, action: PayloadAction<{ cfName: string, volume?: number }>) {
      const exec = state.cfExecution[action.payload.cfName]
      if (exec) {
        exec.status = "attente_maturation"
        if (action.payload.volume !== undefined) {
          exec.currentVolume = action.payload.volume
        }
        
        const cmd = state.commands.find(c => c.id === exec.commandId)
        if (cmd && cmd.cfSequence && cmd.lastPastoData) {
          const currentIndex = cmd.cfSequence.indexOf(action.payload.cfName)
          if (currentIndex !== -1 && currentIndex + 1 < cmd.cfSequence.length) {
            const nextCfName = cmd.cfSequence[currentIndex + 1]
            const nextExec = state.cfExecution[nextCfName]
            if (nextExec && nextExec.status === "attente_remplissage") {
              nextExec.status = "remplissage"
              nextExec.dornic = cmd.lastPastoData.dornic
              nextExec.tempPasto = cmd.lastPastoData.tempPasto
              nextExec.pression = cmd.lastPastoData.pression
              nextExec.times.remplissageStart = new Date().toISOString()
            }
          }
        }
      }
    },
    // CF Execution Reducers
    initCfRemplissage(state, action: PayloadAction<{ cfName: string, commandId: string, dornic?: string | number, pression?: string | number, tempPasto?: string | number }>) {
      const { cfName, commandId, dornic, pression, tempPasto } = action.payload
      state.cfExecution[cfName] = { 
        ...state.cfExecution[cfName], 
        status: "remplissage", 
        commandId, 
        currentVolume: 0, 
        dornic,
        pression,
        tempPasto,
        times: { remplissageStart: new Date().toISOString() } 
      }
    },
    validateCfMaturationStart(state, action: PayloadAction<{ cfName: string }>) {
      const { cfName } = action.payload
      const exec = state.cfExecution[cfName]
      if (exec) {
        exec.status = "maturation_en_cours"
        exec.times.maturationStart = new Date().toISOString()
      }
    },
    validateCfMaturationEnd(state, action: PayloadAction<{ cfName: string }>) {
      const exec = state.cfExecution[action.payload.cfName]
      if (exec) {
        exec.status = "attente_soutirage"
        exec.times.maturationEnd = new Date().toISOString()
      }
    },
    validateCfSoutirageStart(state, action: PayloadAction<{ cfName: string }>) {
      const exec = state.cfExecution[action.payload.cfName]
      if (exec) {
        exec.status = "soutirage_en_cours"
        exec.times.soutirageStart = new Date().toISOString()
      }
    },
    validateCfSoutirageEnd(state, action: PayloadAction<{ cfName: string }>) {
      const exec = state.cfExecution[action.payload.cfName]
      if (exec) {
        exec.status = "a_laver"
        exec.times.soutirageEnd = new Date().toISOString()
      }
    },
    validateCfLavageStart(state, action: PayloadAction<{ cfName: string }>) {
      const exec = state.cfExecution[action.payload.cfName]
      if (exec) {
        exec.status = "en_lavage"
      }
    },
    validateCfLavageEnd(state, action: PayloadAction<{ cfName: string }>) {
      const exec = state.cfExecution[action.payload.cfName]
      if (exec) {
        exec.status = "vide"
        exec.commandId = undefined
        exec.currentVolume = 0
        exec.times = {}
        exec.dornic = undefined
        exec.pression = undefined
        exec.tempPasto = undefined
      }
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

      const currentBatches = state.tlcBatches[tank]
      // Enforce raw milk mixture rule: must have the same milkType as current batches, if not empty
      const currentType = currentBatches.length > 0 ? currentBatches[0].milkType : null
      if (currentType && currentType !== batch.milkType) {
        return // mix violation
      }

      if (currentBatches.length > 0) {
        const firstDelivery = currentBatches[0].deliveryDate
        if (batch.deliveryDate - firstDelivery > 48 * 3600 * 1000) {
          return // 48h violation
        }
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
    addMilkOrder(state, action: PayloadAction<Omit<MilkOrder, "id" | "status">>) {
      state.milkOrders.push({
        ...action.payload,
        id: `milk-order-${Date.now()}`,
        status: "pending"
      })
    },
    receiveMilkOrder(state, action: PayloadAction<{ orderId: string; tank: "tlc1" | "tlc2" | "tlc3" | "tlc4" | "tankPermeat"; batchData: Omit<Batch, "id" | "milkType">; isComplete: boolean }>) {
      const order = state.milkOrders.find(o => o.id === action.payload.orderId)
      if (order && order.status === "pending") {
        order.receivedQuantity = (order.receivedQuantity || 0) + action.payload.batchData.volume
        if (action.payload.isComplete) {
          order.status = "received"
        }
        const nextId = `batch-${Date.now()}`
        const newBatch: Batch = {
          ...action.payload.batchData,
          id: nextId,
          milkType: order.milkType,
        }
        state.tlcBatches[action.payload.tank].push(newBatch)
        state.commands.forEach(cmd => recalculateActiveCommandMetrics(state, cmd))
        syncActiveCommandToRoot(state)
        state.simulationDone = false
      }
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
        while (remainingVolume > 0) {
          let allocatedInCycle = false
          for (let tank of availableTanks) {
            const tState = tankStates[tank.name as keyof typeof tankStates]
            if (tState.remaining === 0 && remainingVolume > 0) {
              if (!cmd.selectedTLSs.includes(tank.name)) {
                cmd.selectedTLSs.push(tank.name)
              }
              const capacity = tank.capacity
              tState.milkType = cmdMilkType

              if (capacity >= remainingVolume) {
                cmd.tlsVolumes[tank.name.toLowerCase() as keyof typeof cmd.tlsVolumes] = Number((cmd.tlsVolumes[tank.name.toLowerCase() as keyof typeof cmd.tlsVolumes] || 0) + remainingVolume).toFixed(3) as any
                tState.remaining = capacity - remainingVolume
                remainingVolume = 0
              } else {
                cmd.tlsVolumes[tank.name.toLowerCase() as keyof typeof cmd.tlsVolumes] = Number((cmd.tlsVolumes[tank.name.toLowerCase() as keyof typeof cmd.tlsVolumes] || 0) + capacity).toFixed(3) as any
                remainingVolume -= capacity
                tState.remaining = 0
              }
              allocatedInCycle = true
            }
          }
          if (!allocatedInCycle) {
            for (let tank of availableTanks) {
              tankStates[tank.name as keyof typeof tankStates].remaining = 0
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
          cmd.selectedCFs = selectCuvesForVolume(cmd.osmosedVolume, cmd.milkType, false)
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
  updateCommand,
  deleteCommand,
  completeCommand,
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
  addMilkOrder,
  receiveMilkOrder,
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
  initTlsTransfer,
  validateTlsTransferEnd,
  validateTlsOsmoseStart,
  validateTlsOsmoseEnd,
  validateTlsPastoStart,
  validateCfRemplissageStart,
  validateCfRemplissageEnd,
  initCfRemplissage,
  validateCfMaturationStart,
  validateCfMaturationEnd,
  validateCfSoutirageStart,
  validateCfSoutirageEnd,
  validateCfLavageStart,
  validateCfLavageEnd,
} = orderSlice.actions

export { CF_TANKS, TLS_TANKS }
export default orderSlice.reducer
