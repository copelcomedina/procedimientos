"use client";
import { useState, useEffect, useCallback } from "react";
import { UserPayload } from "@/lib/auth";
import ProcedimientoModal from "./ProcedimientoModal";
import ProcedimientoDetalle from "./ProcedimientoDetalle";

interface Sector {
  id: number; nombre: string; slug: string; color: string; descripcion: string;
}
interface Procedimiento {
  id: number; titulo: string; descripcion: string;
  sector_nombre: string; sector_slug: string; sector_color: string;
  autor_nombre: string; created_at: string; updated_at: string;
  total_archivos: number; total_links: number;
}

const ICONS: Record<string, string> = {
  rrhh: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm14 0a4 4 0 1 0-4 4 4 4 0 0 0 4-4zm-4 8h6",
  "medicina-laboral": "M22 12h-4l-3 9L9 3l-3 9H2",
  liquidaciones: "M9 7H6a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-3M13 3h6m0 0v6m0-6L9 13",
};

export default function Dashboard({ user }: { user: UserPayload }) {
  const [sectores, setSectores] = useState<Sector[]>([]);
  const [procedimientos, setProcedimientos] = useState<Procedimiento[]>([]);
  const [sectorActivo, setSectorActivo] = useState<string | null>(null);
  const [buscar, setBuscar] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [detalle, setDetalle] = useState<number | null>(null);

  const canEdit = user.rol === "admin_global" || user.rol === "admin_sector";

  useEffect(() => {
    fetch("/procedimientos/api/sectores").then(r => r.json()).then(setSectores);
  }, []);

  const loadProcedimientos = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (sectorActivo) params.set("sector", sectorActivo);
    if (buscar) params.set("q", buscar);
    const res = await fetch(`/procedimientos/api/procedimientos?${params}`);
    const data = await res.json();
    setProcedimientos(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [sectorActivo, buscar]);

  useEffect(() => { loadProcedimientos(); }, [loadProcedimientos]);

  async function handleLogout() {
    await fetch("/procedimientos/api/auth/logout", { method: "POST" });
    window.location.href = "/procedimientos/login";
  }

  const sidebarW = 240;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarW, flexShrink: 0,
        background: "white",
        borderRight: "1px solid #e5e7eb",
        display: "flex", flexDirection: "column",
        position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 10,
      }}>
        {/* Brand */}
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid #f3f4f6" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", lineHeight: 1.2 }}>COPELCO</div>
              <div style={{ fontSize: 11, color: "#9ca3af" }}>Procedimientos</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: "16px 12px", flex: 1, overflowY: "auto" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.06em", textTransform: "uppercase", padding: "0 8px", marginBottom: 8 }}>
            Sectores
          </div>

          {/* All */}
          <button
            onClick={() => setSectorActivo(null)}
            style={{
              width: "100%", textAlign: "left", padding: "9px 10px",
              borderRadius: 8, border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 500,
              background: sectorActivo === null ? "#eff6ff" : "transparent",
              color: sectorActivo === null ? "#2563eb" : "#374151",
              transition: "all 0.15s",
            }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
            </svg>
            Todos los sectores
          </button>

          {sectores.map(s => (
            <button
              key={s.id}
              onClick={() => setSectorActivo(s.slug)}
              style={{
                width: "100%", textAlign: "left", padding: "9px 10px",
                borderRadius: 8, border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 500,
                background: sectorActivo === s.slug ? `${s.color}15` : "transparent",
                color: sectorActivo === s.slug ? s.color : "#374151",
                transition: "all 0.15s",
              }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d={ICONS[s.slug] || "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"}/>
              </svg>
              {s.nombre}
            </button>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding: "16px 12px", borderTop: "1px solid #f3f4f6" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px" }}>
            <div style={{
              width: 32, height: 32, borderRadius: 50,
              background: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700, color: "#2563eb", flexShrink: 0,
            }}>
              {user.nombre[0].toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.nombre}</div>
              <div style={{ fontSize: 11, color: "#9ca3af" }}>{user.rol === "admin_global" ? "Admin global" : user.rol === "admin_sector" ? `Admin ${user.sector}` : "Empleado"}</div>
            </div>
            <button
              onClick={handleLogout}
              title="Cerrar sesión"
              style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 4, borderRadius: 6 }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft: sidebarW, flex: 1, padding: "32px 32px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", letterSpacing: "-0.5px" }}>
              {sectorActivo ? sectores.find(s => s.slug === sectorActivo)?.nombre : "Todos los procedimientos"}
            </h1>
            <p style={{ color: "#6b7280", fontSize: 13, marginTop: 2 }}>
              {procedimientos.length} procedimiento{procedimientos.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {/* Search */}
            <div style={{ position: "relative" }}>
              <svg style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Buscar procedimientos..."
                value={buscar}
                onChange={e => setBuscar(e.target.value)}
                style={{
                  paddingLeft: 32, paddingRight: 14, paddingTop: 9, paddingBottom: 9,
                  border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 13,
                  outline: "none", background: "white", width: 240,
                  fontFamily: "inherit", color: "#374151",
                }}
                onFocus={e => e.target.style.borderColor = "#2563eb"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"}
              />
            </div>
            {canEdit && (
              <button
                onClick={() => setShowModal(true)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "9px 16px",
                  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  color: "white", border: "none", borderRadius: 10,
                  fontSize: 13, fontWeight: 600, cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
                  fontFamily: "inherit",
                }}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                Nuevo procedimiento
              </button>
            )}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{ height: 160, borderRadius: 14, background: "#f3f4f6", animation: "pulse 1.5s infinite" }}/>
            ))}
          </div>
        ) : procedimientos.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ width: 64, height: 64, background: "#f3f4f6", borderRadius: 16, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <svg width="28" height="28" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <p style={{ color: "#6b7280", fontSize: 15 }}>No hay procedimientos{buscar ? ` para "${buscar}"` : ""}</p>
            {canEdit && <p style={{ color: "#9ca3af", fontSize: 13, marginTop: 4 }}>Creá el primero haciendo clic en "Nuevo procedimiento"</p>}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
            {procedimientos.map((p, i) => (
              <div
                key={p.id}
                onClick={() => setDetalle(p.id)}
                style={{
                  background: "white", borderRadius: 14, padding: "20px",
                  border: "1.5px solid #f3f4f6", cursor: "pointer",
                  transition: "all 0.2s", animation: `fadeIn 0.3s ease ${i * 0.05}s both`,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "#dbeafe";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 16px rgba(37,99,235,0.08)";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "#f3f4f6";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLDivElement).style.transform = "none";
                }}
              >
                {/* Sector badge */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
                    background: `${p.sector_color}15`, color: p.sector_color,
                    letterSpacing: "0.02em",
                  }}>
                    {p.sector_nombre}
                  </span>
                  <span style={{ fontSize: 11, color: "#9ca3af" }}>
                    {new Date(p.updated_at).toLocaleDateString("es-AR", { day: "2-digit", month: "short" })}
                  </span>
                </div>

                <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginBottom: 8, lineHeight: 1.4 }}>{p.titulo}</h3>
                {p.descripcion && (
                  <p style={{
                    fontSize: 13, color: "#6b7280", lineHeight: 1.5,
                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                    overflow: "hidden", marginBottom: 16,
                  }}>
                    {p.descripcion}
                  </p>
                )}

                {/* Footer */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: "auto", paddingTop: 12, borderTop: "1px solid #f9fafb" }}>
                  {p.total_archivos > 0 && (
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#6b7280" }}>
                      <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
                      </svg>
                      {p.total_archivos} archivo{p.total_archivos !== 1 ? "s" : ""}
                    </span>
                  )}
                  {p.total_links > 0 && (
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#6b7280" }}>
                      <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
                      </svg>
                      {p.total_links} link{p.total_links !== 1 ? "s" : ""}
                    </span>
                  )}
                  <span style={{ marginLeft: "auto", fontSize: 12, color: "#9ca3af" }}>{p.autor_nombre}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <ProcedimientoModal
          sectores={sectores}
          user={user}
          onClose={() => setShowModal(false)}
          onSave={() => { setShowModal(false); loadProcedimientos(); }}
        />
      )}

      {detalle && (
        <ProcedimientoDetalle
          id={detalle}
          user={user}
          onClose={() => setDetalle(null)}
          onUpdate={loadProcedimientos}
        />
      )}
    </div>
  );
}
