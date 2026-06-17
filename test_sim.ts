import { runMultiCommandSimulation } from './app/lib/orderSlice';
type MilkType = "bio" | "fcv3" | "savoie" | "montagne" | "creme" | "ecreme_savoie" | "ecreme_montagne";

// Create a dummy command based on the structure expected
const commands = [
  {
    id: "cmd-1",
    name: "Commande Test",
    startDate: new Date().toISOString(),
    expectedEndDate: "",
    calculatedEndDate: 0,
    references: [
      { id: "ref-1", name: "BAIKO", potsQty: 80000, gramPerPot: 105, milkType: "montagne" as MilkType },
      { id: "ref-2", name: "MDD", potsQty: 40000, gramPerPot: 105, milkType: "montagne" as MilkType },
    ],
    refDestinations: { "ref-1": "atia", "ref-2": "grunwald" } as any,
    refSentStatus: { "ref-1": { atia: false, grunwald: false }, "ref-2": { atia: false, grunwald: false } },
    refPotsLaunched: {},
    whiteMassKg: 14800,
    milkReceivedVolume: 18385.366,
    milkReceptionValue: 33,
    targetValue: 41,
    tlsVolumes: { tls1: 7985, tls2: 5200, tls3: 5200 },
    selectedTLSs: ["TLS1", "TLS2", "TLS3"],
    selectedCFs: ["CF1", "CF2", "CF11"],
    cfDestinations: {},
    cfSentStatus: {},
    timing: { transferTime: 70, osmoseTime: 318, powderTime: 111, pastoTime: 177, startTime: 0, maturationTime: 360 },
    status: "cuve" as any,
    osmosedVolume: 14800,
    pasteurized: true,
    milkType: "montagne" as MilkType,
    isSkyr: false,
  }
];

const now = Date.now();
const tlcBatchesInitial = {
  tlc1: [{ id: "b1", lotNumber: "1", volume: 30000, protein: 33, fat: 38, milkType: "montagne" as MilkType, deliveryDate: now }],
  tlc2: [],
  tlc3: [],
  tlc4: [],
};

const res = runMultiCommandSimulation(commands as any, tlcBatchesInitial, { needs48hWash: false, needsC3Wash: false });

console.log("=== TÂCHES PLANIFIÉES ===");
res.ganttTasks.filter(t => t.label.includes("ATIA") || t.label.includes("GRUN") || t.label.includes("Lavage") || t.label.includes("Changement")).forEach(t => {
  const startH = Math.floor(t.startMinute / 60);
  const startM = Math.round(t.startMinute % 60);
  const endMin = t.startMinute + t.durationMinutes;
  const endH = Math.floor(endMin / 60);
  const endM = Math.round(endMin % 60);
  console.log(`- [${startH}h${startM.toString().padStart(2, '0')} -> ${endH}h${endM.toString().padStart(2, '0')}] (${Math.round(t.durationMinutes)} min) : ${t.label}`);
});
