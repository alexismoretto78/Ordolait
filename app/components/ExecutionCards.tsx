"use client"

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../lib/store';
import { 
  TLS_TANKS, CF_TANKS, TLC_TANKS, milkTypeConfigs, 
  initTlsTransfer, validateTlsTransferEnd, validateTlsOsmoseStart, validateTlsOsmoseEnd, validateTlsPastoStart, validateTlsPastoEnd,
  initCfRemplissage, validateCfMaturationStart, validateCfMaturationEnd, validateCfSoutirageStart, validateCfVide
} from '../lib/orderSlice';

function getTheoTime(startMin: number, prodStart: string) {
  if (!prodStart || isNaN(startMin)) return "--:--";
  const d = new Date(prodStart);
  d.setMinutes(d.getMinutes() + startMin);
  return d.toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' });
}

function formatRealTime(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' });
}

export function ExecutionCards() {
  const dispatch = useDispatch();
  const { tlsExecution, cfExecution, commands, simulationResults, productionStartTime, tlcBatches } = useSelector((state: RootState) => state.order);

  // Modals state for TLS
  const [tlsActiveTank, setTlsActiveTank] = useState<string | null>(null);
  
  // Modals
  const [showInitTls, setShowInitTls] = useState(false);
  const [showTransferTls, setShowTransferTls] = useState(false);
  const [showOsmoseEndTls, setShowOsmoseEndTls] = useState(false);
  
  const [showInitCf, setShowInitCf] = useState(false);
  const [cfActiveTank, setCfActiveTank] = useState<string | null>(null);
  const [showMaturationStart, setShowMaturationStart] = useState(false);

  // Form states
  const [selectedCmdId, setSelectedCmdId] = useState("");
  const [transferVol, setTransferVol] = useState(15000);
  const [tlcDeductions, setTlcDeductions] = useState<{tlcKey: string, volume: number}[]>([{tlcKey: "tlc1", volume: 15000}]);
  
  const [permeatVol, setPermeatVol] = useState(0);
  const [fcvApplied, setFcvApplied] = useState(0);

  const [cfVol, setCfVol] = useState(0);

  const handleInitTls = (tlsName: string) => {
    setTlsActiveTank(tlsName);
    setSelectedCmdId(commands.length > 0 ? commands[0].id : "");
    setShowInitTls(true);
  }

  const submitInitTls = () => {
    if (tlsActiveTank && selectedCmdId) {
      dispatch(initTlsTransfer({ tlsName: tlsActiveTank, commandId: selectedCmdId }));
    }
    setShowInitTls(false);
  }

  const handleTransferEnd = (tlsName: string) => {
    setTlsActiveTank(tlsName);
    setTransferVol(15000);
    setTlcDeductions([{tlcKey: "tlc1", volume: 15000}]);
    setShowTransferTls(true);
  }

  const submitTransferEnd = () => {
    if (tlsActiveTank) {
      dispatch(validateTlsTransferEnd({ tlsName: tlsActiveTank, volume: transferVol, tlcDeductions }));
    }
    setShowTransferTls(false);
  }

  const handleOsmoseEnd = (tlsName: string) => {
    setTlsActiveTank(tlsName);
    setPermeatVol(0);
    setFcvApplied(0);
    setShowOsmoseEndTls(true);
  }

  const submitOsmoseEnd = () => {
    if (tlsActiveTank) {
      dispatch(validateTlsOsmoseEnd({ tlsName: tlsActiveTank, permeatVol, fcvApplied }));
    }
    setShowOsmoseEndTls(false);
  }

  const handleInitCf = (cfName: string) => {
    setCfActiveTank(cfName);
    setSelectedCmdId(commands.length > 0 ? commands[0].id : "");
    setShowInitCf(true);
  }

  const submitInitCf = () => {
    if (cfActiveTank && selectedCmdId) {
      dispatch(initCfRemplissage({ cfName: cfActiveTank, commandId: selectedCmdId }));
    }
    setShowInitCf(false);
  }

  const handleMaturationStart = (cfName: string) => {
    setCfActiveTank(cfName);
    setCfVol(5000);
    setShowMaturationStart(true);
  }

  const submitMaturationStart = () => {
    if (cfActiveTank) {
      dispatch(validateCfMaturationStart({ cfName: cfActiveTank, volume: cfVol }));
    }
    setShowMaturationStart(false);
  }

  const renderTime = (label: string, theoStr: string, realStr?: string) => {
    return (
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", padding: "4px 0", borderBottom: "1px dashed #e2e8f0" }}>
        <span style={{ color: "var(--text-muted)" }}>{label}</span>
        <div style={{ display: "flex", gap: "8px" }}>
          {theoStr && !realStr && <span style={{ color: "#64748b" }}>Théo: {theoStr}</span>}
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

          return (
            <div key={tank.name} style={{ border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "16px", background: "#fff", display: "flex", flexDirection: "column", gap: "12px", boxShadow: "var(--shadow-sm)" }}>
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
                  {renderTime("Début Transfert", getTheoTime(simCmd.transferStart, productionStartTime))}
                  {renderTime("Fin Transfert", getTheoTime(simCmd.transferEnd, productionStartTime), formatRealTime(exec.times.transferEnd))}
                  {renderTime("Début Osmose", getTheoTime(simCmd.osmoseStart, productionStartTime), formatRealTime(exec.times.osmoseStart))}
                  {renderTime("Fin Osmose", getTheoTime(simCmd.osmoseEnd, productionStartTime), formatRealTime(exec.times.osmoseEnd))}
                  {renderTime("Début Pasto", getTheoTime(simCmd.pastoStart, productionStartTime), formatRealTime(exec.times.pastoStart))}
                  {renderTime("Fin Pasto", getTheoTime(simCmd.pastoEnd, productionStartTime), formatRealTime(exec.times.pastoEnd))}
                </div>
              )}

              <div style={{ fontSize: "0.95rem", textAlign: "right", color: "var(--text-main)", fontWeight: 600 }}>
                {exec.currentVolume.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} L
              </div>

              <div style={{ marginTop: "auto", paddingTop: "8px" }}>
                {exec.status === "vide" && <button onClick={() => handleInitTls(tank.name)} className="btn btn-secondary" style={{ width: "100%" }}>Démarrer Transfert</button>}
                {exec.status === "transfert_en_cours" && <button onClick={() => handleTransferEnd(tank.name)} className="btn btn-primary" style={{ width: "100%" }}>Valider Fin Transfert</button>}
                {exec.status === "attente_osmose" && <button onClick={() => dispatch(validateTlsOsmoseStart({ tlsName: tank.name }))} className="btn btn-primary" style={{ width: "100%" }}>Valider Début Osmose</button>}
                {exec.status === "osmose_en_cours" && <button onClick={() => handleOsmoseEnd(tank.name)} className="btn btn-primary" style={{ width: "100%" }}>Valider Fin Osmose</button>}
                {exec.status === "attente_pasto" && <button onClick={() => dispatch(validateTlsPastoStart({ tlsName: tank.name }))} className="btn btn-primary" style={{ width: "100%" }}>Valider Début Pasto</button>}
                {exec.status === "pasto_en_cours" && <button onClick={() => dispatch(validateTlsPastoEnd({ tlsName: tank.name }))} className="btn btn-primary" style={{ width: "100%" }}>Valider Fin Pasto</button>}
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

          return (
            <div key={tank.name} style={{ border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "16px", background: "#fff", display: "flex", flexDirection: "column", gap: "10px", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong style={{ fontSize: "1.1rem", color: "var(--primary-dark)" }}>{tank.name}</strong>
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
                  <strong>Commande:</strong> {cmd.name}
                </div>
              )}

              {exec.status !== "vide" && simCmd && (
                <div style={{ background: "#f8fafc", padding: "8px", borderRadius: "6px" }}>
                  {renderTime("Début Maturation", getTheoTime(simCmd.maturationStart, productionStartTime), formatRealTime(exec.times.maturationStart))}
                  {renderTime("Fin Maturation", getTheoTime(simCmd.maturationEnd, productionStartTime), formatRealTime(exec.times.maturationEnd))}
                  {renderTime("Soutirage", getTheoTime(simCmd.maturationEnd, productionStartTime), formatRealTime(exec.times.soutirageStart))}
                </div>
              )}

              <div style={{ fontSize: "0.95rem", textAlign: "right", color: "var(--text-main)", fontWeight: 600 }}>
                {exec.currentVolume.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} L
              </div>

              <div style={{ marginTop: "auto", paddingTop: "8px" }}>
                {exec.status === "vide" && <button onClick={() => handleInitCf(tank.name)} className="btn btn-secondary" style={{ width: "100%" }}>Début Remplissage</button>}
                {exec.status === "remplissage" && <button onClick={() => handleMaturationStart(tank.name)} className="btn btn-primary" style={{ width: "100%" }}>Valider Début Maturation</button>}
                {exec.status === "attente_maturation" && <button onClick={() => handleMaturationStart(tank.name)} className="btn btn-primary" style={{ width: "100%" }}>Valider Début Maturation</button>}
                {exec.status === "maturation_en_cours" && <button onClick={() => dispatch(validateCfMaturationEnd({ cfName: tank.name }))} className="btn btn-primary" style={{ width: "100%" }}>Valider Fin Maturation</button>}
                {exec.status === "attente_soutirage" && <button onClick={() => dispatch(validateCfSoutirageStart({ cfName: tank.name }))} className="btn btn-primary" style={{ width: "100%" }}>Valider Soutirage</button>}
                {exec.status === "soutirage_en_cours" && <button onClick={() => dispatch(validateCfVide({ cfName: tank.name }))} className="btn btn-success" style={{ width: "100%" }}>Terminer (Vide)</button>}
              </div>
            </div>
          )
        })}
      </div>

      {/* Modals */}
      {showInitTls && (
        <div className="modal" style={{ display: "block", background: "rgba(0,0,0,0.5)", position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 }}>
          <div className="modal-content" style={{ background: "white", width: "400px", margin: "100px auto", padding: "20px", borderRadius: "8px" }}>
            <h3>Démarrer Transfert dans {tlsActiveTank}</h3>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Commande:</label>
              <select value={selectedCmdId} onChange={e => setSelectedCmdId(e.target.value)} style={{ width: "100%", padding: "8px" }}>
                {commands.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button onClick={() => setShowInitTls(false)} className="btn btn-secondary">Annuler</button>
              <button onClick={submitInitTls} className="btn btn-primary">Démarrer</button>
            </div>
          </div>
        </div>
      )}

      {showTransferTls && (
        <div className="modal" style={{ display: "block", background: "rgba(0,0,0,0.5)", position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 }}>
          <div className="modal-content" style={{ background: "white", width: "500px", margin: "100px auto", padding: "20px", borderRadius: "8px" }}>
            <h3>Valider Fin Transfert ({tlsActiveTank})</h3>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Volume Transféré (L):</label>
              <input type="number" value={transferVol} onChange={e => setTransferVol(Number(e.target.value))} style={{ width: "100%", padding: "8px" }} />
            </div>
            
            <h4>Déduction TLC</h4>
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
                }} style={{ width: "120px", padding: "8px" }} />
                <button onClick={() => setTlcDeductions(tlcDeductions.filter((_, i) => i !== index))} className="btn btn-secondary">X</button>
              </div>
            ))}
            <button onClick={() => setTlcDeductions([...tlcDeductions, {tlcKey: "tlc1", volume: 0}])} className="btn btn-secondary" style={{ marginBottom: "20px" }}>+ Ajouter un TLC</button>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button onClick={() => setShowTransferTls(false)} className="btn btn-secondary">Annuler</button>
              <button onClick={submitTransferEnd} className="btn btn-primary">Valider</button>
            </div>
          </div>
        </div>
      )}

      {showOsmoseEndTls && (
        <div className="modal" style={{ display: "block", background: "rgba(0,0,0,0.5)", position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 }}>
          <div className="modal-content" style={{ background: "white", width: "400px", margin: "100px auto", padding: "20px", borderRadius: "8px" }}>
            <h3>Valider Fin Osmose ({tlsActiveTank})</h3>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Volume de Perméat tiré (L):</label>
              <input type="number" value={permeatVol} onChange={e => setPermeatVol(Number(e.target.value))} style={{ width: "100%", padding: "8px" }} />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>FCV Appliqué:</label>
              <input type="number" value={fcvApplied} onChange={e => setFcvApplied(Number(e.target.value))} style={{ width: "100%", padding: "8px" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button onClick={() => setShowOsmoseEndTls(false)} className="btn btn-secondary">Annuler</button>
              <button onClick={submitOsmoseEnd} className="btn btn-primary">Valider</button>
            </div>
          </div>
        </div>
      )}

      {showInitCf && (
        <div className="modal" style={{ display: "block", background: "rgba(0,0,0,0.5)", position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 }}>
          <div className="modal-content" style={{ background: "white", width: "400px", margin: "100px auto", padding: "20px", borderRadius: "8px" }}>
            <h3>Début Remplissage {cfActiveTank}</h3>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Commande:</label>
              <select value={selectedCmdId} onChange={e => setSelectedCmdId(e.target.value)} style={{ width: "100%", padding: "8px" }}>
                {commands.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button onClick={() => setShowInitCf(false)} className="btn btn-secondary">Annuler</button>
              <button onClick={submitInitCf} className="btn btn-primary">Démarrer</button>
            </div>
          </div>
        </div>
      )}

      {showMaturationStart && (
        <div className="modal" style={{ display: "block", background: "rgba(0,0,0,0.5)", position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 }}>
          <div className="modal-content" style={{ background: "white", width: "400px", margin: "100px auto", padding: "20px", borderRadius: "8px" }}>
            <h3>Début Maturation {cfActiveTank}</h3>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Volume Rempli (L):</label>
              <input type="number" value={cfVol} onChange={e => setCfVol(Number(e.target.value))} style={{ width: "100%", padding: "8px" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button onClick={() => setShowMaturationStart(false)} className="btn btn-secondary">Annuler</button>
              <button onClick={submitMaturationStart} className="btn btn-primary">Valider</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
