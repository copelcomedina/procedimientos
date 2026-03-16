"use client";
import { useState } from "react";
import { UserPayload } from "@/lib/auth";

interface Sector { id: number; nombre: string; slug: string; color: string; }
interface Link { titulo: string; url: string; }

export default function ProcedimientoModal({
  sectores, user, onClose, onSave, inicial
}: {
  sectores: Sector[];
  user: UserPayload;
  onClose: () => void;
  onSave: () => void;
  inicial?: { id: number; titulo: string; descripcion: string; sector_id: number; links: Link[] };
}) {
  const [titulo, setTitulo] = useState(inicial?.titulo || "");
  const [descripcion, setDescripcion] = useState(inicial?.descripcion || "");
  const [sectorId, setSectorId] = useState<number>(
    inicial?.sector_id ||
    (user.rol === "admin_sector" ? sectores.find(s => s.slug === user.sector)?.id || sectores[0]?.id : sectores[0]?.id)
  );
  const [links, setLinks] = useState<Link[]>(inicial?.links || [{ titulo: "", url: "" }]);
  const [archivos, setArchivos] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sectoresDisponibles = user.rol === "admin_sector"
    ? sectores.filter(s => s.slug === user.sector)
    : sectores;

  function addLink() { setLinks([...links, { titulo: "", url: "" }]); }
  function removeLink(i: number) { setLinks(links.filter((_, idx) => idx !== i)); }
  function updateLink(i: number, field: "titulo" | "url", val: string) {
    setLinks(links.map((l, idx) => idx === i ? { ...l, [field]: val } : l));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!titulo.trim()) { setError("El título es obligatorio"); return; }
    setLoading(true); setError("");

    const url = inicial
      ? `/procedimientos/api/procedimientos/${inicial.id}`
      : "/procedimientos/api/procedimientos";
    const method = inicial ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titulo, descripcion, sector_id: sectorId,
        links: links.filter(l => l.titulo && l.url),
      }),
    });

    if (!res.ok) {
      const d = await res.json();
      setError(d.error || "Error al guardar");
      setLoading(false); return;
    }

    const data = await res.json();
    const procId = inicial?.id || data.id;

    // Upload files
    for (const file of archivos) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("procedimiento_id", String(procId));
      await fetch("/procedimientos/api/upload", { method: "POST", body: fd });
    }

    onSave();
  }

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 50, padding: 20,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: "white", borderRadius: 20, width: "100%", maxWidth: 580,
        maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        animation: "fadeIn 0.2s ease",
      }}>
        {/* Header */}
        <div style={{ padding: "24px 28px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>
            {inicial ? "Editar procedimiento" : "Nuevo procedimiento"}
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 4 }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "20px 28px 28px" }}>
          {/* Sector */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Sector</label>
            <select
              value={sectorId}
              onChange={e => setSectorId(Number(e.target.value))}
              disabled={user.rol === "admin_sector"}
              style={inputStyle}
            >
              {sectoresDisponibles.map(s => (
                <option key={s.id} value={s.id}>{s.nombre}</option>
              ))}
            </select>
          </div>

          {/* Titulo */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Título <span style={{ color: "#ef4444" }}>*</span></label>
            <input
              type="text"
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              placeholder="Ej: Procedimiento de ingreso de personal"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#2563eb"}
              onBlur={e => e.target.style.borderColor = "#e5e7eb"}
            />
          </div>

          {/* Descripcion */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Descripción</label>
            <textarea
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              placeholder="Descripción detallada del procedimiento..."
              rows={4}
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
              onFocus={e => e.target.style.borderColor = "#2563eb"}
              onBlur={e => e.target.style.borderColor = "#e5e7eb"}
            />
          </div>

          {/* Links */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <label style={labelStyle}>Links relacionados</label>
              <button type="button" onClick={addLink} style={btnSecondaryStyle}>+ Agregar link</button>
            </div>
            {links.map((link, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input
                  type="text"
                  value={link.titulo}
                  onChange={e => updateLink(i, "titulo", e.target.value)}
                  placeholder="Título"
                  style={{ ...inputStyle, flex: "0 0 35%" }}
                  onFocus={e => e.target.style.borderColor = "#2563eb"}
                  onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                />
                <input
                  type="url"
                  value={link.url}
                  onChange={e => updateLink(i, "url", e.target.value)}
                  placeholder="https://..."
                  style={{ ...inputStyle, flex: 1 }}
                  onFocus={e => e.target.style.borderColor = "#2563eb"}
                  onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                />
                <button type="button" onClick={() => removeLink(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", padding: "0 4px" }}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Archivos */}
          {!inicial && (
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Archivos (PDF o Word)</label>
              <div
                style={{
                  border: "2px dashed #e5e7eb", borderRadius: 12, padding: "20px",
                  textAlign: "center", cursor: "pointer", transition: "border-color 0.2s",
                  background: archivos.length > 0 ? "#f0fdf4" : "#fafafa",
                }}
                onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = "#2563eb"; }}
                onDragLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; }}
                onDrop={e => {
                  e.preventDefault();
                  e.currentTarget.style.borderColor = "#e5e7eb";
                  const files = Array.from(e.dataTransfer.files).filter(f =>
                    f.type === "application/pdf" || f.type.includes("word")
                  );
                  setArchivos(prev => [...prev, ...files]);
                }}
                onClick={() => document.getElementById("file-input")?.click()}
              >
                <svg width="24" height="24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{ margin: "0 auto 8px" }}>
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                </svg>
                <p style={{ fontSize: 13, color: "#6b7280" }}>Arrastrá archivos acá o <span style={{ color: "#2563eb", fontWeight: 600 }}>hacé clic para seleccionar</span></p>
                <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>PDF o Word únicamente</p>
                <input
                  id="file-input" type="file" multiple accept=".pdf,.doc,.docx" style={{ display: "none" }}
                  onChange={e => {
                    const files = Array.from(e.target.files || []);
                    setArchivos(prev => [...prev, ...files]);
                  }}
                />
              </div>
              {archivos.length > 0 && (
                <div style={{ marginTop: 10 }}>
                  {archivos.map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", background: "#f0fdf4", borderRadius: 8, marginBottom: 4 }}>
                      <svg width="14" height="14" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                      </svg>
                      <span style={{ fontSize: 12, color: "#374151", flex: 1 }}>{f.name}</span>
                      <button type="button" onClick={() => setArchivos(archivos.filter((_, idx) => idx !== i))}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", marginBottom: 16, color: "#dc2626", fontSize: 13 }}>
              {error}
            </div>
          )}

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button type="button" onClick={onClose} style={{ ...btnSecondaryStyle, padding: "10px 20px" }}>
              Cancelar
            </button>
            <button
              type="submit" disabled={loading}
              style={{
                padding: "10px 24px",
                background: loading ? "#93c5fd" : "linear-gradient(135deg, #2563eb, #1d4ed8)",
                color: "white", border: "none", borderRadius: 10,
                fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "inherit",
              }}
            >
              {loading ? "Guardando..." : inicial ? "Guardar cambios" : "Crear procedimiento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6
};
const inputStyle: React.CSSProperties = {
  width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb",
  borderRadius: 10, fontSize: 13, outline: "none",
  fontFamily: "inherit", color: "#111827", background: "white",
  transition: "border-color 0.2s",
};
const btnSecondaryStyle: React.CSSProperties = {
  background: "none", border: "1.5px solid #e5e7eb", borderRadius: 10,
  fontSize: 13, fontWeight: 500, color: "#374151", cursor: "pointer",
  padding: "6px 12px", fontFamily: "inherit",
};
