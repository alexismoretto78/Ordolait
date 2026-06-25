"use client"

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../lib/store';
import { 
  TLS_TANKS, CF_TANKS, TLC_TANKS, milkTypeConfigs, 
  initTlsTransfer, validateTlsTransferEnd, validateTlsOsmoseStart, validateTlsOsmoseEnd, validateTlsPastoStart,
  initCfRemplissage, initDirectTlcPasto, validateCfMaturationStart, validateCfMaturationEnd, validateCfSoutirageStart, pauseCfSoutirage, validateCfSoutirageEnd, validateCfLavageStart, validateCfLavageEnd,
  validateCfRemplissageStart, validateCfRemplissageEnd, autoCompleteCfRemplissage, selectCuvesForVolume
} from '../lib/orderSlice';

function getTheoTime(startMin: number, prodStart: string, delayMinutes: number = 0) {
  if (!prodStart || isNaN(startMin)) return "--:--";
  const d = new Date(prodStart);
  d.setMinutes(d.getMinutes() + startMin + delayMinutes);
  return d.toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' });
}

function formatRealTime(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' });
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "vide": return "var(--text-muted)";
    case "transfert_en_cours": return "hsl(220, 80%, 60%)";
    case "attente_osmose": return "hsl(38, 90%, 50%)";
    case "osmose_en_cours": return "hsl(220, 75%, 45%)";
    case "attente_pasto": return "hsl(275, 80%, 60%)";
    case "pasto_en_cours": return "hsl(220, 80%, 40%)";
    case "remplissage": return "hsl(195, 80%, 45%)";
    case "a_valider_remplissage": return "hsl(195, 60%, 55%)";
    case "maturation_en_cours": return "hsl(150, 60%, 45%)";
    case "attente_soutirage": return "hsl(95, 60%, 45%)";
    case "soutirage_en_cours": return "hsl(345, 80%, 55%)";
    default: return "var(--primary)";
  }
}

const getMilkColor = (milkType?: string) => {
  if (milkType === "montagne" || milkType === "ecreme_montagne") return "#000";
  if (milkType === "savoie" || milkType === "ecreme_savoie") return "#2563eb";
  if (milkType === "bio") return "#16a34a";
  return "var(--text-main)";
}

const BaseModal = ({ title, width = "400px", onClose, onSubmit, submitText = "Valider", children }: any) => (
  <div className="modal" style={{ display: "block", background: "rgba(0,0,0,0.5)", position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 }}>
    <form className="modal-content" onSubmit={(e) => { e.preventDefault(); onSubmit?.(); }} style={{ background: "white", width, margin: "100px auto", padding: "20px", borderRadius: "8px" }}>
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      {children}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
        <button type="button" onClick={onClose} className="btn btn-secondary">Annuler</button>
        <button type="submit" className="btn btn-primary">{submitText}</button>
      </div>
    </form>
  </div>
);

export function ExecutionCards() {
  const dispatch = useDispatch();
  const { tlsExecution, cfExecution, commands, simulationResults, productionStartTime, tlcBatches, tlcMilkTypes } = useSelector((state: RootState) => state.order);

  // Modals state for TLS
  const [tlsActiveTank, setTlsActiveTank] = useState<string | null>(null);

  const isAnyRemplissage = Object.values(cfExecution || {}).some((exec: any) => exec.status === "remplissage");

  useEffect(() => {
    const interval = setInterval(() => {
      Object.entries(cfExecution || {}).forEach(([cfName, exec]: [string, any]) => {
        if (exec.status === "remplissage" && exec.times.remplissageStart && exec.currentVolume > 0) {
          const fillTotalMs = (exec.currentVolume / 5000) * 3600 * 1000;
          const fillElapsedMs = Date.now() - new Date(exec.times.remplissageStart).getTime();
          if (fillElapsedMs >= fillTotalMs) {
            dispatch(autoCompleteCfRemplissage({ cfName }));
          }
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [cfExecution, dispatch]);
  
  // Modals
  const [showInitTls, setShowInitTls] = useState(false);
  const [showTransferEndTls, setShowTransferEndTls] = useState(false);
  const [showOsmoseEndTls, setShowOsmoseEndTls] = useState(false);
  const [showPastoStartTls, setShowPastoStartTls] = useState(false);
  
  const [cfSelectedForPasto, setCfSelectedForPasto] = useState<string[]>([]);
  const [cfVolumes, setCfVolumes] = useState<{ [cfName: string]: number }>({});
  const [pastoTemp, setPastoTemp] = useState<string>("89");
  const [pastoPression, setPastoPression] = useState<string>("200");
  const [pastoDornic, setPastoDornic] = useState<string>("");
  
  const [showInitCf, setShowInitCf] = useState(false);
  const [cfActiveTank, setCfActiveTank] = useState<string | null>(null);
  const [showRemplissageEndCf, setShowRemplissageEndCf] = useState(false);
  const [showMaturationStart, setShowMaturationStart] = useState(false);
  const [showMaturationEndCf, setShowMaturationEndCf] = useState(false);
  const [showSoutirageStart, setShowSoutirageStart] = useState(false);
  const [soutirageMachine, setSoutirageMachine] = useState<string>("ATIA");
  const [showPauseSoutirage, setShowPauseSoutirage] = useState(false);
  const [remainingVolume, setRemainingVolume] = useState<number | string>("");
  const [showDirectPasto, setShowDirectPasto] = useState(false);
  const [directPastoTlcKey, setDirectPastoTlcKey] = useState("tlc1");
  const [directPastoVol, setDirectPastoVol] = useState<number | string>("");
  const [cfFerments, setCfFerments] = useState<number | string>("");
  const [cfPh, setCfPh] = useState<string>("");
  const [initCfDornic, setInitCfDornic] = useState<number | string>("");
  const [initCfPression, setInitCfPression] = useState<number | string>("");
  const [initCfTempPasto, setInitCfTempPasto] = useState<number | string>("");

  // Form states
  const [selectedCmdId, setSelectedCmdId] = useState("");
  const [transferVol, setTransferVol] = useState(15000);
  const [tlcDeductions, setTlcDeductions] = useState<{tlcKey: string, volume: number}[]>([{tlcKey: "tlc1", volume: 15000}]);
  
  const [permeatVol, setPermeatVol] = useState<number | string>("");
  const [fcvApplied, setFcvApplied] = useState<number | string>("");
  const [mpFinal, setMpFinal] = useState<number | string>("");
  const [mgFinal, setMgFinal] = useState<number | string>("");

  const [cfVol, setCfVol] = useState(0);

  const handleInitTls = (tlsName: string) => {
    setTlsActiveTank(tlsName);
    
    // Sort commands to find priority (first by expectedEndDate, then startDate)
    const sortedCommands = [...commands].sort((a, b) => {
      const aEnd = a.expectedEndDate ? new Date(a.expectedEndDate).getTime() : Infinity;
      const bEnd = b.expectedEndDate ? new Date(b.expectedEndDate).getTime() : Infinity;
      if (aEnd !== bEnd) return aEnd - bEnd;
      const aStart = a.startDate ? new Date(a.startDate).getTime() : Infinity;
      const bStart = b.startDate ? new Date(b.startDate).getTime() : Infinity;
      return aStart - bStart;
    });

    const priorityCmd = sortedCommands.find(cmd => {
      const targetV = cmd.targetValue || 41;
      const recV = cmd.milkReceptionValue || 33;
      const totalRawNeeded = (cmd.whiteMassKg * targetV) / recV;
      const alreadyTransferred = cmd.executedRawMilk || 0;
      return (totalRawNeeded - alreadyTransferred) > 0;
    }) || sortedCommands[0];

    const initialCmdId = priorityCmd ? priorityCmd.id : "";
    setSelectedCmdId(initialCmdId);
    
    const maxVol = tlsName === "TLS1" ? 11900 : 5200;
    let suggestedVol = maxVol;
    
    let suggestedTlcKey = "tlc1";
    if (priorityCmd) {
      const targetV = priorityCmd.targetValue || 41;
      const recV = priorityCmd.milkReceptionValue || 33;
      const totalRawNeeded = (priorityCmd.whiteMassKg * targetV) / recV;
      const alreadyTransferred = priorityCmd.executedRawMilk || 0;
      const remainingNeeded = Math.max(0, totalRawNeeded - alreadyTransferred);
      
      suggestedVol = Math.round(Math.min(maxVol, remainingNeeded));

      const milkType = priorityCmd.milkType;
      let oldestDate = Infinity;
      
      Object.entries(tlcBatches).forEach(([key, batches]) => {
        if (key === "tankPermeat") return;
        batches.forEach(b => {
          if (b.milkType === milkType && b.volume > 0 && b.deliveryDate < oldestDate) {
            oldestDate = b.deliveryDate;
            suggestedTlcKey = key;
          }
        });
      });
      
      if (oldestDate === Infinity) {
        const tlc = TLC_TANKS.find(t => tlcMilkTypes[t.key as keyof typeof tlcMilkTypes] === milkType);
        if (tlc) suggestedTlcKey = tlc.key;
      }
    }
    
    setTransferVol(suggestedVol);
    setTlcDeductions([{ tlcKey: suggestedTlcKey, volume: suggestedVol }]);
    setShowInitTls(true);
  }

  const handleCommandChange = (cmdId: string) => {
    setSelectedCmdId(cmdId);
    const cmd = commands.find(c => c.id === cmdId);
    if (cmd) {
      const maxVol = tlsActiveTank === "TLS1" ? 11900 : 5200;
      const targetV = cmd.targetValue || 41;
      const recV = cmd.milkReceptionValue || 33;
      const totalRawNeeded = (cmd.whiteMassKg * targetV) / recV;
      const alreadyTransferred = cmd.executedRawMilk || 0;
      const remainingNeeded = Math.max(0, totalRawNeeded - alreadyTransferred);
      
      const suggestedVol = Math.round(Math.min(maxVol, remainingNeeded));
      setTransferVol(suggestedVol);

      let suggestedTlcKey = "tlc1";
      const milkType = cmd.milkType;
      let oldestDate = Infinity;
      
      Object.entries(tlcBatches).forEach(([key, batches]) => {
        if (key === "tankPermeat") return;
        batches.forEach(b => {
          if (b.milkType === milkType && b.volume > 0 && b.deliveryDate < oldestDate) {
            oldestDate = b.deliveryDate;
            suggestedTlcKey = key;
          }
        });
      });
      
      if (oldestDate === Infinity) {
        const tlc = TLC_TANKS.find(t => tlcMilkTypes[t.key as keyof typeof tlcMilkTypes] === milkType);
        if (tlc) suggestedTlcKey = tlc.key;
      }
      
      setTlcDeductions([{ tlcKey: suggestedTlcKey, volume: suggestedVol }]);
    }
  }

  const submitInitTls = () => {
    if (tlsActiveTank && selectedCmdId) {
      dispatch(initTlsTransfer({ tlsName: tlsActiveTank, commandId: selectedCmdId, volume: transferVol, tlcDeductions }));
    }
    setShowInitTls(false);
  }

  const handleTransferEnd = (tlsName: string) => {
    setTlsActiveTank(tlsName);
    setShowTransferEndTls(true);
  }

  const submitTransferEnd = () => {
    if (tlsActiveTank) {
      dispatch(validateTlsTransferEnd({ tlsName: tlsActiveTank }));
    }
    setShowTransferEndTls(false);
  }



  const handleOsmoseEnd = (tlsName: string) => {
    setTlsActiveTank(tlsName);
    setPermeatVol("");
    setFcvApplied("");
    setMpFinal("");
    setMgFinal("");
    setShowOsmoseEndTls(true);
  }

  const submitOsmoseEnd = () => {
    if (tlsActiveTank) {
      dispatch(validateTlsOsmoseEnd({ 
        tlsName: tlsActiveTank, 
        permeatVol: Number(permeatVol) || 0, 
        fcvApplied: Number(fcvApplied) || 0,
        mpFinal: Number(mpFinal) || 0,
        mgFinal: Number(mgFinal) || 0
      }));
    }
    setShowOsmoseEndTls(false);
  }

  const handlePastoStart = (tlsName: string) => {
    setTlsActiveTank(tlsName);
    const exec = tlsExecution[tlsName];
    if (exec) {
      const cmd = commands.find(c => c.id === exec.commandId);
      const availableCFs = CF_TANKS.filter(t => cfExecution[t.name]?.status === "vide");
      const preselected = selectCuvesForVolume(exec.currentVolume, cmd?.milkType || "", cmd?.isSkyr, availableCFs);
      setCfSelectedForPasto(preselected);
    } else {
      setCfSelectedForPasto([]);
    }
    setShowPastoStartTls(true);
  }

  const submitPastoStart = () => {
    if (cfSelectedForPasto.length === 0) {
      alert("Veuillez sélectionner au moins une cuve.");
      return;
    }
    if (tlsActiveTank) {
      dispatch(validateTlsPastoStart({ tlsName: tlsActiveTank, selectedCFs: cfSelectedForPasto }));
    }
    setShowPastoStartTls(false);
  }

  const handleInitCf = (cfName: string) => {
    setCfActiveTank(cfName);
    const exec = cfExecution?.[cfName];
    
    if (exec?.status === "attente_remplissage") {
      setSelectedCmdId(exec.commandId || "");
      const cmd = commands.find(c => c.id === exec.commandId);
      if (cmd?.lastPastoData) {
        setInitCfDornic(cmd.lastPastoData.dornic);
        setInitCfPression(cmd.lastPastoData.pression);
        setInitCfTempPasto(cmd.lastPastoData.tempPasto);
      } else {
        setInitCfDornic("");
        setInitCfPression("200");
        setInitCfTempPasto("89");
      }
    } else {
      const initialCmdId = commands.length > 0 ? commands[0].id : "";
      setSelectedCmdId(initialCmdId);
      
      const runningTls = Object.values(tlsExecution).find((t: any) => t.commandId === initialCmdId && t.pastoData);
      if (runningTls && (runningTls as any).pastoData) {
        const pData = (runningTls as any).pastoData;
        setInitCfDornic(pData.dornic);
        setInitCfPression(pData.pression);
        setInitCfTempPasto(pData.tempPasto);
      } else {
        setInitCfDornic("");
        setInitCfPression("200");
        setInitCfTempPasto("89");
      }
    }
    setShowInitCf(true);
  }

  const submitInitCf = () => {
    if (cfActiveTank && selectedCmdId) {
      const exec = cfExecution?.[cfActiveTank];
      if (exec?.status === "attente_remplissage") {
        dispatch(validateCfRemplissageStart({ 
          cfName: cfActiveTank, 
          pastoData: { dornic: initCfDornic, pression: initCfPression, tempPasto: initCfTempPasto } 
        }));
      } else {
        dispatch(initCfRemplissage({ 
          cfName: cfActiveTank, 
          commandId: selectedCmdId, 
          dornic: initCfDornic, 
          pression: initCfPression, 
          tempPasto: initCfTempPasto 
        }));
      }
    }
    setShowInitCf(false);
  }

  const handleRemplissageEnd = (cfName: string) => {
    setCfActiveTank(cfName);
    const exec = cfExecution?.[cfName];
    const tank = CF_TANKS.find(t => t.name === cfName);
    setCfVol(exec?.currentVolume && exec.currentVolume > 0 ? exec.currentVolume : tank?.capacity || 0);
    setShowRemplissageEndCf(true);
  }

  const submitRemplissageEnd = () => {
    if (cfActiveTank) {
      dispatch(validateCfRemplissageEnd({ cfName: cfActiveTank, volume: cfVol }));
    }
    setShowRemplissageEndCf(false);
  }

  const handleMaturationStart = (cfName: string) => {
    setCfActiveTank(cfName);
    setCfFerments("");
    setShowMaturationStart(true);
  }

  const submitMaturationStart = () => {
    if (cfActiveTank) {
      dispatch(validateCfMaturationStart({ cfName: cfActiveTank }));
    }
    setShowMaturationStart(false);
  }

  const handleMaturationEnd = (cfName: string) => {
    setCfActiveTank(cfName);
    setCfPh("");
    setShowMaturationEndCf(true);
  }

  const submitMaturationEnd = () => {
    if (cfActiveTank) {
      dispatch(validateCfMaturationEnd({ cfName: cfActiveTank }));
    }
    setShowMaturationEndCf(false);
  }

  const handleSoutirageStart = (cfName: string) => {
    setCfActiveTank(cfName);
    setSoutirageMachine("ATIA");
    setShowSoutirageStart(true);
  }

  const submitSoutirageStart = () => {
    if (cfActiveTank) {
      dispatch(validateCfSoutirageStart({ cfName: cfActiveTank, machine: soutirageMachine }));
    }
    setShowSoutirageStart(false);
  }

  const handlePauseSoutirage = (cfName: string) => {
    setCfActiveTank(cfName);
    const exec = cfExecution?.[cfName];
    const cmd = commands.find(c => c.id === exec?.commandId);
    const machine = exec?.machine;
    const speed = machine === "ATIA" ? 3500 : (machine === "GRUNWALD" ? 10000 : 0);
    let estimatedVol = exec?.currentVolume || 0;
    
    if (exec?.times?.soutirageStart && speed > 0) {
      const elapsedMinutes = (Date.now() - new Date(exec.times.soutirageStart).getTime()) / 60000;
      const gramPerPot = cmd?.references?.[0]?.gramPerPot || 105;
      const litersPerMinute = (speed / 60) * (gramPerPot / 1000);
      const drained = elapsedMinutes * litersPerMinute;
      estimatedVol = Math.max(0, estimatedVol - drained);
    }
    
    setRemainingVolume(Math.round(estimatedVol));
    setShowPauseSoutirage(true);
  }

  const submitPauseSoutirage = () => {
    if (cfActiveTank) {
      dispatch(pauseCfSoutirage({ cfName: cfActiveTank, remainingVolume: Number(remainingVolume) }));
    }
    setShowPauseSoutirage(false);
  }

  const handleDirectPasto = (cfName: string) => {
    setCfActiveTank(cfName);
    const fcv3Commands = commands.filter(c => ["fcv3", "ecreme_savoie", "ecreme_montagne"].includes(c.milkType) || c.isSkyr);
    if (fcv3Commands.length > 0) {
      setSelectedCmdId(fcv3Commands[0].id);
      setDirectPastoVol(CF_TANKS.find(t => t.name === cfName)?.capacity || 0);
    }
    setInitCfDornic("");
    setInitCfPression("200");
    setInitCfTempPasto("89");
    setShowDirectPasto(true);
  }

  const submitDirectPasto = () => {
    if (cfActiveTank && selectedCmdId) {
      dispatch(initDirectTlcPasto({
        cfName: cfActiveTank,
        commandId: selectedCmdId,
        tlcKey: directPastoTlcKey,
        volume: Number(directPastoVol),
        dornic: initCfDornic,
        pression: initCfPression,
        tempPasto: initCfTempPasto
      }));
    }
    setShowDirectPasto(false);
  }

  const renderTime = (label: string, theoStr: string, realStr?: string) => {
    return (
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", padding: "4px 0", borderBottom: "1px dashed #e2e8f0" }}>
        <span style={{ color: "var(--text-muted)" }}>{label}</span>
        <div style={{ display: "flex", gap: "8px" }}>
          {theoStr && theoStr !== "--:--" && !realStr && <span style={{ color: "#64748b" }}>Théo: {theoStr}</span>}
          {theoStr === "--:--" && !realStr && <span style={{ color: "#64748b", fontStyle: "italic", opacity: 0.5 }}>-</span>}
          {realStr && <span style={{ color: "var(--primary-dark)", fontWeight: 600 }}>Réel: {realStr}</span>}
        </div>
      </div>
    );
  }

  return (
    <>
      <h3 style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "8px", color: "var(--text-main)", marginTop: "32px", fontSize: "1.1rem" }}>Exécution TLS</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        {TLS_TANKS.map(tank => {
          const exec = tlsExecution?.[tank.name] || { status: "vide", currentVolume: 0, times: {} };
          const cmd = commands.find(c => c.id === exec?.commandId);
          const simCmd = cmd ? simulationResults?.commandsResults[cmd.id] : null;
          const config = cmd ? milkTypeConfigs[cmd.milkType] : null;

          let delayMinutes = 0;
          if (cmd && simCmd && productionStartTime) {
            const prodStartMs = new Date(productionStartTime).getTime();
            const events = [
              { real: exec.times.pastoEnd, sim: simCmd.pastoEnd },
              { real: exec.times.pastoStart, sim: simCmd.pastoStart },
              { real: exec.times.osmoseEnd, sim: simCmd.osmoseEnd },
              { real: exec.times.osmoseStart, sim: simCmd.osmoseStart },
              { real: exec.times.transferEnd, sim: simCmd.transferEnd },
              { real: (exec.times as any).transferStart, sim: simCmd.transferStart },
            ];
            for (let ev of events) {
              if (ev.real) {
                delayMinutes = (new Date(ev.real).getTime() - (prodStartMs + ev.sim * 60000)) / 60000;
                break;
              }
            }
          }

          return (
            <div key={tank.name} style={{ position: "relative", overflow: "hidden", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "16px", background: "#fff", display: "flex", flexDirection: "column", gap: "12px", boxShadow: "var(--shadow-sm)" }}>
              {(() => {
                if (exec.status !== "vide" && exec.currentVolume > 0) {
                  if (exec.status === "pasto_en_cours" && exec.times.pastoStart) {
                    const emptyTotalMs = (exec.currentVolume / 5000) * 3600 * 1000;
                    const emptyElapsedMs = Date.now() - new Date(exec.times.pastoStart).getTime();
                    return <div className="cf-liquid" style={{ animationName: "drainDown", animationDuration: `${emptyTotalMs}ms`, animationDelay: `-${emptyElapsedMs}ms` }} />;
                  } else {
                    return <div className="cf-liquid" style={{ height: "100%" }} />;
                  }
                }
                return null;
              })()}
              <div className="cf-content" style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1, zIndex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ fontSize: "1.1rem" }}>{tank.name}</strong>
                  {exec.status !== "vide" ? (
                    <span style={{ fontSize: "0.85rem", background: "var(--primary)", color: "white", padding: "4px 8px", borderRadius: "6px", fontWeight: 600 }}>
                      {exec.status.replace(/_/g, " ").toUpperCase()}
                    </span>
                  ) : (
                    <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontStyle: "italic" }}>Vide</span>
                  )}
                </div>

              {cmd && (
                <div style={{ background: "var(--bg-app)", padding: "8px", borderRadius: "6px", fontSize: "0.9rem" }}>
                  <strong>Commande:</strong> {cmd.name} <br/>
                  {config && <span>{config.emoji} {config.label || cmd.milkType}</span>}
                </div>
              )}

              {exec.status !== "vide" && simCmd && (
                <div style={{ background: "#f8fafc", padding: "8px", borderRadius: "6px" }}>
                  {renderTime("Début Transfert", getTheoTime(simCmd.transferStart, productionStartTime, delayMinutes), formatRealTime((exec.times as any).transferStart))}
                  {renderTime("Fin Transfert", getTheoTime(simCmd.transferEnd, productionStartTime, delayMinutes), formatRealTime(exec.times.transferEnd))}
                  {renderTime("Début Osmose", getTheoTime(simCmd.osmoseStart, productionStartTime, delayMinutes), formatRealTime(exec.times.osmoseStart))}
                  {renderTime("Fin Osmose", getTheoTime(simCmd.osmoseEnd, productionStartTime, delayMinutes), formatRealTime(exec.times.osmoseEnd))}
                  {renderTime("Début Pasto", getTheoTime(simCmd.pastoStart, productionStartTime, delayMinutes), formatRealTime(exec.times.pastoStart))}
                  {renderTime("Fin Pasto", getTheoTime(simCmd.pastoEnd, productionStartTime, delayMinutes), formatRealTime(exec.times.pastoEnd))}
                </div>
              )}

              <div style={{ fontSize: "0.95rem", textAlign: "right", color: "var(--text-main)", fontWeight: 600 }}>
                {(exec.currentVolume || 0).toLocaleString("fr-FR", { maximumFractionDigits: 0 })} L
                {(exec.mpFinal || exec.mgFinal) ? <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 4 }}>MP: {exec.mpFinal || "-"} | MG: {exec.mgFinal || "-"}</div> : null}
              </div>

              <div style={{ marginTop: "auto", paddingTop: "8px" }}>
                {exec.status === "vide" && <button onClick={() => handleInitTls(tank.name)} className="btn btn-secondary" style={{ width: "100%" }}>Démarrer Transfert</button>}
                {exec.status === "transfert_en_cours" && <button onClick={() => handleTransferEnd(tank.name)} className="btn btn-primary" style={{ width: "100%" }}>Valider Fin Transfert</button>}
                {exec.status === "attente_osmose" && <button onClick={() => dispatch(validateTlsOsmoseStart({ tlsName: tank.name }))} className="btn btn-primary" style={{ width: "100%" }}>Valider Début Osmose</button>}
                {exec.status === "osmose_en_cours" && <button onClick={() => handleOsmoseEnd(tank.name)} className="btn btn-primary" style={{ width: "100%" }}>Valider Fin Osmose</button>}
                {exec.status === "attente_pasto" && <button onClick={() => handlePastoStart(tank.name)} className="btn btn-primary" style={{ width: "100%" }}>Valider Début Pasto</button>}
              </div>
              </div>
            </div>
          )
        })}
      </div>

      <h3 style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "8px", color: "var(--text-main)", marginTop: "32px", fontSize: "1.1rem" }}>Exécution CF</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
        {CF_TANKS.map(tank => {
          const exec = cfExecution?.[tank.name] || { status: "vide", currentVolume: 0, times: {} };
          const cmd = commands.find(c => c.id === exec?.commandId);
          const simCmd = cmd ? simulationResults?.commandsResults[cmd.id] : null;

          let delayMinutes = 0;
          if (cmd && simCmd && productionStartTime) {
            const prodStartMs = new Date(productionStartTime).getTime();
            const events = [
              { real: exec.times.soutirageStart, sim: simCmd.maturationEnd },
              { real: exec.times.maturationEnd, sim: simCmd.maturationEnd },
              { real: exec.times.maturationStart, sim: simCmd.maturationStart },
              { real: (exec.times as any).remplissageStart, sim: simCmd.pastoEnd },
            ];
            for (let ev of events) {
              if (ev.real) {
                delayMinutes = (new Date(ev.real).getTime() - (prodStartMs + ev.sim * 60000)) / 60000;
                break;
              }
            }
          }

          let cardClass = "cuve-card";
          if (exec.status === "en_lavage") cardClass += " cf-card-washing";
          else if (exec.status === "maturation_en_cours") cardClass += " cf-card-maturation";
          else if (exec.status === "soutirage_en_cours") cardClass += " cf-card-soutirage";

          let isReport = false;
          if (["maturation_en_cours", "attente_soutirage"].includes(exec.status) && exec.times.maturationStart) {
            const elapsed = Date.now() - new Date(exec.times.maturationStart).getTime();
            if (elapsed > 24 * 3600 * 1000) {
               isReport = true;
               cardClass += " cf-card-report";
            }
          }

          const activeSoutirages = Object.values(cfExecution || {}).filter((e: any) => e.status === "soutirage_en_cours").length;
          const canSoutirer = activeSoutirages < 2;

          return (
            <div key={tank.name} className={cardClass} style={{ position: "relative", overflow: "hidden", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "16px", background: "#fff", display: "flex", flexDirection: "column", gap: "10px", boxShadow: "var(--shadow-sm)" }}>
              {(() => {
                if (exec.status !== "vide" && exec.currentVolume > 0) {
                  if ((exec.status === "remplissage" || exec.status === "a_valider_remplissage") && (exec.times as any).remplissageStart) {
                    if (exec.status === "a_valider_remplissage") {
                      return <div className="cf-liquid" style={{ height: "100%" }} />;
                    }
                    const fillTotalMs = (exec.currentVolume / 5000) * 3600 * 1000;
                    const fillElapsedMs = Date.now() - new Date((exec.times as any).remplissageStart).getTime();
                    return <div className="cf-liquid" style={{ animationName: "fillUp", animationDuration: `${fillTotalMs}ms`, animationDelay: `-${fillElapsedMs}ms` }} />;
                  } else if (exec.status === "soutirage_en_cours" && exec.times.soutirageStart) {
                    const drainTotalMs = 90 * 60 * 1000; // 90 min max
                    const drainElapsedMs = Date.now() - new Date(exec.times.soutirageStart).getTime();
                    return <div className="cf-liquid" style={{ animationName: "drainDown", animationDuration: `${drainTotalMs}ms`, animationDelay: `-${drainElapsedMs}ms` }} />;
                  } else if (exec.status !== "a_laver" && exec.status !== "en_lavage") {
                    return <div className="cf-liquid" style={{ height: "100%" }} />;
                  }
                }
                return null;
              })()}
              <div className="cf-content" style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ fontSize: "1.1rem", color: "var(--primary-dark)", display: "flex", alignItems: "center" }}>
                    {tank.name}
                    {isReport && <span style={{ marginLeft: "8px", fontSize: "0.7rem", background: "var(--danger)", color: "white", padding: "2px 6px", borderRadius: "10px", verticalAlign: "middle" }}>⚠️ REPORT</span>}
                  </strong>
                  {(exec.status === "soutirage_en_cours" || exec.status === "attente_soutirage") && exec.machine && (
                    <span style={{ fontSize: "0.7rem", background: "#f1f5f9", border: "1px solid #cbd5e1", color: "#334155", padding: "2px 6px", borderRadius: "4px", fontWeight: "bold", marginLeft: "auto", marginRight: "8px" }}>
                      {exec.machine}
                    </span>
                  )}
                {exec.status !== "vide" ? (
                  <span style={{ fontSize: "0.85rem", background: getStatusColor(exec.status), color: "white", padding: "4px 8px", borderRadius: "6px", fontWeight: 600 }}>
                    {exec.status.replace(/_/g, " ").toUpperCase()}
                  </span>
                ) : (
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontStyle: "italic" }}>Vide</span>
                )}
              </div>

              {cmd && (
                <div style={{ background: "var(--bg-app)", padding: "8px", borderRadius: "6px", fontSize: "0.9rem" }}>
                  <strong>Commande:</strong> {cmd.name}
                </div>
              )}

              {exec.status !== "vide" && simCmd && (
                <div style={{ background: "#f8fafc", padding: "8px", borderRadius: "6px" }}>
                  {renderTime("Début Remplissage", getTheoTime(simCmd.pastoEnd || 0, productionStartTime, delayMinutes), formatRealTime((exec.times as any).remplissageStart))}
                  {renderTime("Début Maturation", getTheoTime(simCmd.maturationStart || 0, productionStartTime, delayMinutes), formatRealTime(exec.times.maturationStart))}
                  {renderTime("Fin Maturation", getTheoTime(simCmd.maturationEnd || 0, productionStartTime, delayMinutes), formatRealTime(exec.times.maturationEnd))}
                  {renderTime("Soutirage", getTheoTime(simCmd.maturationEnd || 0, productionStartTime, delayMinutes), formatRealTime(exec.times.soutirageStart))}
                </div>
              )}

              <div style={{ fontSize: "1.1rem", textAlign: "right", color: getMilkColor(cmd?.milkType), fontWeight: 700 }}>
                {(exec.currentVolume || 0).toLocaleString("fr-FR", { maximumFractionDigits: 0 })} L
              </div>

              <div style={{ marginTop: "auto", paddingTop: "8px" }}>
                {exec.status === "remplissage" && (
                  <div style={{ background: "#f8fafc", padding: "8px", borderRadius: "6px", marginBottom: "8px", border: "1px solid var(--border-color)", fontSize: "0.85rem" }}>
                    <div style={{ marginBottom: 4 }}><span style={{ color: "var(--text-muted)", width: "80px", display: "inline-block" }}>Dornic :</span> <strong>{exec.dornic || "-"} °D</strong></div>
                    <div style={{ marginBottom: 4 }}><span style={{ color: "var(--text-muted)", width: "80px", display: "inline-block" }}>T° Pasto :</span> <strong>{exec.tempPasto || "-"} °C</strong></div>
                    <div><span style={{ color: "var(--text-muted)", width: "80px", display: "inline-block" }}>Pression :</span> <strong>{exec.pression || "-"} bars</strong></div>
                  </div>
                )}
                {exec.status === "attente_remplissage" && <button disabled={isAnyRemplissage} onClick={() => handleInitCf(tank.name)} className="btn btn-primary" style={{ width: "100%", opacity: isAnyRemplissage ? 0.5 : 1, cursor: isAnyRemplissage ? "not-allowed" : "pointer" }}>{isAnyRemplissage ? "Pasto occupée" : "Début Remplissage"}</button>}
                {(exec.status === "remplissage" || exec.status === "a_valider_remplissage") && <button onClick={() => handleRemplissageEnd(tank.name)} className="btn btn-primary" style={{ width: "100%" }}>Fin Remplissage</button>}
                {exec.status === "attente_maturation" && <button onClick={() => handleMaturationStart(tank.name)} className="btn btn-primary" style={{ width: "100%" }}>Valider Début Maturation</button>}
                {exec.status === "maturation_en_cours" && <button onClick={() => handleMaturationEnd(tank.name)} className="btn btn-primary" style={{ width: "100%" }}>Valider Fin Maturation</button>}
                {exec.status === "attente_soutirage" && <button disabled={!canSoutirer} onClick={() => handleSoutirageStart(tank.name)} className="btn btn-primary" style={{ width: "100%", opacity: canSoutirer ? 1 : 0.5, cursor: canSoutirer ? "pointer" : "not-allowed" }}>{canSoutirer ? "Valider Soutirage" : "Machines Occupées"}</button>}
                {exec.status === "soutirage_en_cours" && (
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => handlePauseSoutirage(tank.name)} className="btn btn-secondary" style={{ flex: 1 }}>Pause</button>
                    <button onClick={() => dispatch(validateCfSoutirageEnd({ cfName: tank.name }))} className="btn btn-primary" style={{ flex: 1 }}>Fin Soutirage</button>
                  </div>
                )}
                {exec.status === "soutirage_en_pause" && (
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button disabled={!canSoutirer} onClick={() => handleSoutirageStart(tank.name)} className="btn btn-primary" style={{ flex: 1, opacity: canSoutirer ? 1 : 0.5, cursor: canSoutirer ? "pointer" : "not-allowed" }}>{canSoutirer ? "Reprendre" : "Occupées"}</button>
                    <button onClick={() => dispatch(validateCfSoutirageEnd({ cfName: tank.name }))} className="btn btn-primary" style={{ flex: 1 }}>Fin Soutirage</button>
                  </div>
                )}
                {exec.status === "a_laver" && <button onClick={() => dispatch(validateCfLavageStart({ cfName: tank.name }))} className="btn btn-primary" style={{ width: "100%" }}>Laver</button>}
                {exec.status === "en_lavage" && <button onClick={() => dispatch(validateCfLavageEnd({ cfName: tank.name }))} className="btn btn-success" style={{ width: "100%" }}>Fin de lavage (Propre & Vide)</button>}
                {exec.status === "vide" && tank.name === "CF20" && commands.some(c => ["fcv3", "ecreme_savoie", "ecreme_montagne"].includes(c.milkType) || c.isSkyr) && (
                  <button onClick={() => handleDirectPasto(tank.name)} className="btn btn-secondary" style={{ width: "100%", marginTop: "8px" }}>Pasto depuis TLC (FCV3/Écrémé)</button>
                )}
              </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modals */}
      {showInitTls && (
        <BaseModal title={`Démarrer Transfert dans ${tlsActiveTank}`} width="500px" onClose={() => setShowInitTls(false)} onSubmit={submitInitTls} submitText="Démarrer">
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Commande:</label>
            <select value={selectedCmdId} onChange={e => handleCommandChange(e.target.value)} style={{ width: "100%", padding: "8px" }}>
              {commands.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Volume Transféré Prévu (L):</label>
            <input type="number" value={transferVol} onChange={e => {
              setTransferVol(Number(e.target.value));
            }} required style={{ width: "100%", padding: "8px", marginBottom: "15px" }} />
          </div>

          <h4 style={{ marginTop: "0" }}>Prélèvement TLC (Déduction finale)</h4>
          {tlcDeductions.map((deduction, index) => (
            <div key={index} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <select value={deduction.tlcKey} onChange={e => {
                const newDeds = [...tlcDeductions];
                newDeds[index].tlcKey = e.target.value;
                setTlcDeductions(newDeds);
              }} style={{ flex: 1, padding: "8px" }}>
                {TLC_TANKS.map(t => <option key={t.key} value={t.key}>{t.name}</option>)}
              </select>
              <input type="number" value={deduction.volume} onChange={e => {
                const newDeds = [...tlcDeductions];
                newDeds[index].volume = Number(e.target.value);
                setTlcDeductions(newDeds);
              }} required style={{ width: "120px", padding: "8px" }} />
              <button onClick={() => setTlcDeductions(tlcDeductions.filter((_, i) => i !== index))} className="btn btn-secondary">X</button>
            </div>
          ))}
          <button onClick={() => setTlcDeductions([...tlcDeductions, {tlcKey: "tlc1", volume: 0}])} className="btn btn-secondary" style={{ marginTop: "5px" }}>+ Ajouter un TLC</button>
        </BaseModal>
      )}

      {showTransferEndTls && (
        <BaseModal title={`Fin Transfert pour ${tlsActiveTank}`} width="400px" onClose={() => setShowTransferEndTls(false)} onSubmit={submitTransferEnd} submitText="Valider Fin">
          <p style={{ fontSize: "0.95rem", color: "var(--text-main)", marginBottom: "15px" }}>
            Confirmer la fin du transfert ? Les volumes renseignés au lancement seront déduits des cuves TLC.
          </p>
        </BaseModal>
      )}

      {showOsmoseEndTls && (
        <BaseModal title={`Valider Fin Osmose (${tlsActiveTank})`} onClose={() => setShowOsmoseEndTls(false)} onSubmit={submitOsmoseEnd}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Volume de Perméat tiré (L):</label>
            <input type="number" step="any" value={permeatVol} onChange={e => setPermeatVol(e.target.value)} required style={{ width: "100%", padding: "8px" }} />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>FCV Appliqué:</label>
            <input type="number" step="any" value={fcvApplied} onChange={e => setFcvApplied(e.target.value)} required style={{ width: "100%", padding: "8px" }} />
          </div>
          <div style={{ marginBottom: "15px", display: "flex", gap: "10px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: "5px" }}>MP Finale:</label>
              <input type="number" step="any" value={mpFinal} onChange={e => setMpFinal(e.target.value)} required style={{ width: "100%", padding: "8px" }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: "5px" }}>MG Finale:</label>
              <input type="number" step="any" value={mgFinal} onChange={e => setMgFinal(e.target.value)} required style={{ width: "100%", padding: "8px" }} />
            </div>
          </div>
        </BaseModal>
      )}

      {showPastoStartTls && (
        <BaseModal title={`Démarrer Pasteurisation (${tlsActiveTank})`} width="500px" onClose={() => setShowPastoStartTls(false)} onSubmit={submitPastoStart} submitText="Lancer Pasto">
          <p style={{ fontSize: "0.95rem", color: "var(--text-main)", marginBottom: "15px" }}>
            Sélectionnez les cuves de fermentation pour la réception de la masse blanche :
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "15px" }}>
            {CF_TANKS.filter(t => cfExecution[t.name]?.status === "vide").map(t => {
              const selectedIndex = cfSelectedForPasto.indexOf(t.name);
              const isSelected = selectedIndex !== -1;
              return (
                <label key={t.name} style={{ position: "relative", display: "flex", alignItems: "center", gap: "5px", background: isSelected ? "var(--primary-light)" : "#f1f5f9", padding: "8px 12px", borderRadius: "6px", cursor: "pointer", border: isSelected ? "1px solid var(--primary)" : "1px solid transparent" }}>
                  <input 
                    type="checkbox" 
                    checked={isSelected}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setCfSelectedForPasto([...cfSelectedForPasto, t.name]);
                      } else {
                        setCfSelectedForPasto(cfSelectedForPasto.filter(cf => cf !== t.name));
                      }
                    }}
                    style={{ display: "none" }}
                  />
                  {isSelected && (
                    <div style={{ position: "absolute", top: -6, left: -6, background: "var(--primary)", color: "white", width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: "bold", zIndex: 10 }}>
                      {selectedIndex + 1}
                    </div>
                  )}
                  <span style={{ fontWeight: 600, color: isSelected ? "var(--primary-dark)" : "var(--text-main)" }}>{t.name}</span>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>({t.capacity}L)</span>
                </label>
              );
            })}
          </div>
          {cfSelectedForPasto.length === 0 && (
            <p style={{ color: "var(--danger)", fontSize: "0.85rem", marginTop: "-5px", marginBottom: "15px" }}>⚠️ Veuillez sélectionner au moins une cuve.</p>
          )}
        </BaseModal>
      )}

      {showInitCf && (
        <BaseModal title={`Début Remplissage ${cfActiveTank}`} onClose={() => setShowInitCf(false)} onSubmit={submitInitCf} submitText="Démarrer">
          {cfExecution?.[cfActiveTank || ""]?.status !== "attente_remplissage" && (
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Commande:</label>
              <select value={selectedCmdId} onChange={e => setSelectedCmdId(e.target.value)} style={{ width: "100%", padding: "8px" }}>
                {commands.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          )}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Acidité dornique (°D):</label>
            <input type="number" step="any" value={initCfDornic} onChange={e => setInitCfDornic(e.target.value)} required style={{ width: "100%", padding: "8px" }} />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Pression (bars):</label>
            <input type="number" step="any" value={initCfPression} onChange={e => setInitCfPression(e.target.value)} required style={{ width: "100%", padding: "8px" }} />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Température de pasteurisation (°C):</label>
            <input type="number" step="any" value={initCfTempPasto} onChange={e => setInitCfTempPasto(e.target.value)} required style={{ width: "100%", padding: "8px" }} />
          </div>
        </BaseModal>
      )}

      {showRemplissageEndCf && (
        <BaseModal title={`Fin Remplissage ${cfActiveTank}`} onClose={() => setShowRemplissageEndCf(false)} onSubmit={submitRemplissageEnd} submitText="Valider le remplissage">
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Confirmer le Volume Rempli (L):</label>
            <input type="number" value={cfVol} onChange={e => setCfVol(Number(e.target.value))} required style={{ width: "100%", padding: "8px" }} />
          </div>
        </BaseModal>
      )}

      {showMaturationStart && (
        <BaseModal title={`Début Maturation ${cfActiveTank}`} onClose={() => setShowMaturationStart(false)} onSubmit={submitMaturationStart}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Quantité de Ferment (g):</label>
            <input type="number" step="any" value={cfFerments} onChange={e => setCfFerments(e.target.value)} required style={{ width: "100%", padding: "8px" }} />
          </div>
        </BaseModal>
      )}

      {showMaturationEndCf && (
        <BaseModal title={`Fin Maturation ${cfActiveTank}`} onClose={() => setShowMaturationEndCf(false)} onSubmit={submitMaturationEnd} submitText="Mettre en attente de soutirage">
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>pH :</label>
            <input type="number" step="any" value={cfPh} onChange={e => setCfPh(e.target.value)} required style={{ width: "100%", padding: "8px" }} />
          </div>
        </BaseModal>
      )}

      {showSoutirageStart && (
        <BaseModal title={`Démarrer Soutirage ${cfActiveTank}`} onClose={() => setShowSoutirageStart(false)} onSubmit={submitSoutirageStart} submitText="Valider">
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Machine de conditionnement :</label>
            <select value={soutirageMachine} onChange={e => setSoutirageMachine(e.target.value)} style={{ width: "100%", padding: "8px" }}>
              <option value="ATIA">ATIA</option>
              <option value="GRUNWALD">GRUNWALD</option>
            </select>
          </div>
        </BaseModal>
      )}

      {showPauseSoutirage && (
        <BaseModal title={`Mettre en pause le soutirage ${cfActiveTank}`} onClose={() => setShowPauseSoutirage(false)} onSubmit={submitPauseSoutirage} submitText="Mettre en pause">
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Volume Restant Estimé (L):</label>
            <input type="number" step="any" value={remainingVolume} onChange={e => setRemainingVolume(e.target.value)} required style={{ width: "100%", padding: "8px" }} />
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block", marginTop: "4px" }}>Calculé selon le temps écoulé et la machine (ATIA 3500 pts/h, GRUNWALD 10000 pts/h)</span>
          </div>
        </BaseModal>
      )}

      {showDirectPasto && (
        <BaseModal title={`Pasto Directe depuis TLC vers ${cfActiveTank}`} width="500px" onClose={() => setShowDirectPasto(false)} onSubmit={submitDirectPasto} submitText="Démarrer Remplissage">
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Commande (FCV3 / Skyr):</label>
            <select value={selectedCmdId} onChange={e => setSelectedCmdId(e.target.value)} style={{ width: "100%", padding: "8px" }}>
              {commands.filter(c => ["fcv3", "ecreme_savoie", "ecreme_montagne"].includes(c.milkType) || c.isSkyr).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Source (TLC):</label>
            <select value={directPastoTlcKey} onChange={e => setDirectPastoTlcKey(e.target.value)} style={{ width: "100%", padding: "8px" }}>
              {TLC_TANKS.map(t => <option key={t.key} value={t.key}>{t.name} ({tlcMilkTypes[t.key] || "Vide"})</option>)}
            </select>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Volume Transféré (L):</label>
            <input type="number" value={directPastoVol} onChange={e => setDirectPastoVol(Number(e.target.value))} required style={{ width: "100%", padding: "8px" }} />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Dornic initial (°D):</label>
            <input type="number" step="any" value={initCfDornic} onChange={e => setInitCfDornic(e.target.value)} required style={{ width: "100%", padding: "8px" }} />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Pression (bars):</label>
            <input type="number" step="any" value={initCfPression} onChange={e => setInitCfPression(e.target.value)} required style={{ width: "100%", padding: "8px" }} />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Température de pasteurisation (°C):</label>
            <input type="number" step="any" value={initCfTempPasto} onChange={e => setInitCfTempPasto(e.target.value)} required style={{ width: "100%", padding: "8px" }} />
          </div>
        </BaseModal>
      )}
    </>
  );
}
