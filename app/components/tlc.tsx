"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../lib/store"
import { TLC_TANKS, setTLCVolume, setTLCMilkType, MilkType } from "../lib/orderSlice"

export default function TLC() {
  const dispatch = useDispatch()
  const { tlcVolumes, tlcMilkTypes } = useSelector((state: RootState) => state.order)

  const [localTlcVolumes, setLocalTlcVolumes] = useState(() => ({
    tlc1: tlcVolumes.tlc1.toString(),
    tlc2: tlcVolumes.tlc2.toString(),
    tlc3: tlcVolumes.tlc3.toString(),
    tlc4: tlcVolumes.tlc4.toString(),
  }))

  useEffect(() => {
    const keys: (keyof typeof tlcVolumes)[] = ["tlc1", "tlc2", "tlc3", "tlc4"]
    const updated = { ...localTlcVolumes }
    let changed = false
    for (const key of keys) {
      const parsed = Number(localTlcVolumes[key].trim().replace(",", ".") || "0")
      if (parsed !== tlcVolumes[key]) {
        updated[key] = tlcVolumes[key].toString()
        changed = true
      }
    }
    if (changed) {
      setLocalTlcVolumes(updated)
    }
  }, [tlcVolumes])

  const parseNumber = (value: string) => {
    const cleanVal = value.trim().replace(",", ".")
    return Number(cleanVal || "0")
  }

  const handleVolumeChange = (tank: keyof typeof tlcVolumes, valueStr: string) => {
    setLocalTlcVolumes((prev) => ({ ...prev, [tank]: valueStr }))
    const volume = parseNumber(valueStr)
    const maxCapacity = 30000
    const clampedVolume = Math.min(maxCapacity, Math.max(0, volume))
    dispatch(setTLCVolume({ tank, volume: clampedVolume }))
  }

  const handleMilkTypeChange = (tank: "tlc1" | "tlc2" | "tlc3" | "tlc4", milkType: MilkType) => {
    dispatch(setTLCMilkType({ tank, milkType }))
  }

  const totalVolume = Object.values(tlcVolumes).reduce((sum, vol) => sum + vol, 0)
  const totalCapacity = 120000
  const totalPct = (totalVolume / totalCapacity) * 100

  // Style configurations per Milk Type
  const milkTypeConfigs = {
    bio: {
      label: "Lait Bio",
      color: "var(--success)",
      gradient: "linear-gradient(180deg, #34d399 0%, #10b981 100%)",
      shadow: "0 0 12px rgba(16, 185, 129, 0.3)",
      bgActive: "rgba(16, 185, 129, 0.12)",
      textClass: "text-success",
    },
    fcv3: {
      label: "Lait FCV3",
      color: "var(--primary)",
      gradient: "linear-gradient(180deg, #60a5fa 0%, #2563eb 100%)",
      shadow: "0 0 12px rgba(37, 99, 235, 0.3)",
      bgActive: "rgba(37, 99, 235, 0.12)",
      textClass: "text-primary",
    },
    savoie: {
      label: "Lait de Savoie",
      color: "var(--warning)",
      gradient: "linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%)",
      shadow: "0 0 12px rgba(245, 158, 11, 0.3)",
      bgActive: "rgba(245, 158, 11, 0.12)",
      textClass: "text-warning",
    },
    montagne: {
      label: "Lait de montagne",
      color: "var(--violet)",
      gradient: "linear-gradient(180deg, #a78bfa 0%, #8b5cf6 100%)",
      shadow: "0 0 12px rgba(139, 92, 246, 0.3)",
      bgActive: "rgba(139, 92, 246, 0.12)",
      textClass: "text-violet",
    },
  }

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: 16, marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: "1.8rem" }}>🥛</span>
          <h2 style={{ margin: 0, borderBottom: "none", paddingBottom: 0 }}>Gestion du Stock de Lait Cru (TLC)</h2>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>STOCK GLOBAL</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
            <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-main)" }}>
              {totalVolume.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} / {totalCapacity.toLocaleString()} L
            </span>
            <span style={{ fontSize: "0.85rem", padding: "2px 8px", borderRadius: "10px", backgroundColor: "var(--primary-light)", color: "var(--primary)", fontWeight: 700 }}>
              {totalPct.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Global Stock Progress Bar */}
      <div style={{ background: "#f1f5f9", borderRadius: 8, height: 10, width: "100%", overflow: "hidden", marginBottom: 24, border: "1px solid var(--border-color)" }}>
        <div style={{ background: "linear-gradient(90deg, var(--primary) 0%, var(--success) 100%)", height: "100%", width: `${totalPct}%`, transition: "width 0.4s ease-out" }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20 }}>
        {TLC_TANKS.map((tank, idx) => {
          const key = `tlc${idx + 1}` as keyof typeof tlcVolumes
          const currentVol = tlcVolumes[key]
          const pct = (currentVol / tank.capacity) * 100
          const currentType = tlcMilkTypes[key] as MilkType
          const config = milkTypeConfigs[currentType]

          return (
            <div
              key={tank.name}
              style={{
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-lg)",
                padding: "20px 16px",
                background: "#ffffff",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                boxShadow: "var(--shadow-sm)",
                position: "relative",
                transition: "var(--transition)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)"
                e.currentTarget.style.boxShadow = "var(--shadow-md)"
                e.currentTarget.style.borderColor = config.color
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none"
                e.currentTarget.style.boxShadow = "var(--shadow-sm)"
                e.currentTarget.style.borderColor = "var(--border-color)"
              }}
            >
              {/* Card top border glow with active milk type color */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: config.gradient, borderTopLeftRadius: "var(--radius-lg)", borderTopRightRadius: "var(--radius-lg)" }} />

              <div style={{ display: "flex", justifyContent: "space-between", width: "100%", marginBottom: 16, alignItems: "center" }}>
                <strong style={{ fontSize: "1.1rem", color: "#0f172a" }}>{tank.name}</strong>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                  Max: {(tank.capacity / 1000).toFixed(0)}k L
                </span>
              </div>

              {/* Graphical Cylinder visualization */}
              <div 
                style={{ 
                  position: "relative", 
                  width: "90px", 
                  height: "120px", 
                  background: "#f8fafc", 
                  borderRadius: "20px 20px 24px 24px", 
                  border: "2px solid #cbd5e1",
                  boxShadow: "inset 0 4px 10px rgba(0,0,0,0.04), 0 4px 6px -1px rgba(0,0,0,0.02)",
                  overflow: "hidden", 
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "flex-end"
                }}
              >
                {/* Visual Fluid fill with active color gradient and subtle glow */}
                <div 
                  style={{ 
                    width: "100%", 
                    height: `${pct}%`, 
                    background: config.gradient, 
                    boxShadow: config.shadow,
                    transition: "height 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    position: "relative",
                    borderRadius: "0 0 10px 10px"
                  }}
                >
                  {/* Fluid surface reflection animation effect */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: "rgba(255,255,255,0.4)", borderRadius: "50%" }} />
                </div>
                
                {/* Cylinder reflective overlay */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(90deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 30%, rgba(0,0,0,0.03) 70%, rgba(255,255,255,0.08) 100%)", pointerEvents: "none", borderRadius: "18px 18px 22px 22px" }} />
                
                {/* Percentage label in center */}
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: "0.85rem", fontWeight: 800, color: pct > 45 ? "white" : "var(--text-muted)", textShadow: pct > 45 ? "0 1px 2px rgba(0,0,0,0.3)" : "none", pointerEvents: "none" }}>
                  {pct.toFixed(0)}%
                </div>
              </div>

              {/* Volume Numeric input */}
              <div style={{ width: "100%", marginBottom: 14 }}>
                <label className="form-label" style={{ alignItems: "center" }}>
                  <div style={{ display: "flex", width: "100%", position: "relative", alignItems: "center" }}>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={localTlcVolumes[key]}
                      onFocus={(e) => e.currentTarget.select()}
                      onChange={(e) => handleVolumeChange(key, e.target.value)}
                      className="form-input"
                      style={{ 
                        textAlign: "center", 
                        fontWeight: 700, 
                        fontSize: "1.05rem", 
                        paddingRight: "40px",
                        borderWidth: "1px",
                        borderColor: config.color,
                        marginTop: 0
                      }}
                    />
                    <span style={{ position: "absolute", right: 14, fontWeight: 700, fontSize: "0.9rem", color: "var(--text-muted)", pointerEvents: "none" }}>L</span>
                  </div>
                </label>
              </div>

              {/* Milk Type Segmented Selector */}
              <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: 6 }}>
                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.03em", textTransform: "uppercase", marginBottom: 2 }}>
                  Type de lait
                </span>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                  {(Object.keys(milkTypeConfigs) as MilkType[]).map((type) => {
                    const isSelected = currentType === type
                    const typeConfig = milkTypeConfigs[type]
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleMilkTypeChange(key, type)}
                        style={{
                          padding: "6px 8px",
                          borderRadius: "var(--radius-sm)",
                          fontSize: "0.75rem",
                          fontWeight: isSelected ? "800" : "600",
                          border: `1px solid ${isSelected ? typeConfig.color : "var(--border-color)"}`,
                          background: isSelected ? typeConfig.bgActive : "#ffffff",
                          color: isSelected ? typeConfig.color : "var(--text-muted)",
                          cursor: "pointer",
                          transition: "var(--transition)",
                          boxShadow: isSelected ? "inset 0 1px 2px rgba(0,0,0,0.02)" : "none",
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.borderColor = typeConfig.color
                            e.currentTarget.style.color = typeConfig.color
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.borderColor = "var(--border-color)"
                            e.currentTarget.style.color = "var(--text-muted)"
                          }
                        }}
                      >
                        {type === "bio" && "🌱 Bio"}
                        {type === "fcv3" && "🧪 FCV3"}
                        {type === "savoie" && "🏔️ Savoie"}
                        {type === "montagne" && "⛰️ Montagne"}
                      </button>
                    )
                  })}
                </div>
              </div>

            </div>
          )
        })}
      </div>
    </div>
  )
}
