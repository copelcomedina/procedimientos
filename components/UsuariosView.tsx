"use client";
import { useState, useEffect } from "react";
import { UserPayload } from "@/lib/auth";

interface Usuario {
  id: number; nombre: string; email: string; rol: string; sector: string | null; created_at: string;
}

const ROLES = ["empleado", "admin_sector", "admin_global"];
const SECTORES = ["rrhh", "medicina-laboral", "liquidaciones", "comunicacion", "desarrollo"];

export default function UsuariosView({ user }: { user: UserPayload }) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ nombre: "", email: "", password: "", rol: "empleado", sector: "" });
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  async function cargar() {
    setLoading(true);
    const res = await fetch("/procedimientos/api/users");
    const data = await res.json();
    setUsuarios(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => { cargar(); }, []);

  async function handleCrear() {
    setError("");
    if (!form.nombre || !form.email || !form.password) { setError("Completá todos los campos obligatorios"); return; }
    setGuardando(true);
    const res = await fetch("/procedimientos/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setGuardando(false);
    if (!res.ok) { setError(data.error || "Error al crear usuario"); return; }
    setForm({ nombre: "", email: "", password: "", rol: "empleado", sector: "" });
    setShowForm(false);
    cargar();
  }

  async function handleEliminar(id: number, nombre: string) {
    if (!confirm(`¿Eliminár a ${nombre}?`)) return;
    await fetch(`/procedimientos/api/users/${id}`, { method: "DELETE" });
    cargar();
  }

  const inputStyle = { width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 13, outline: "none", fontFamily: "inherit", color: "#374151", boxSizing: "border-box" as const };
  const labelStyle = { fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 4, display: "block" };

  return (
    <main style={{ flex: 1, padding: "32px 32px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", letterSpacing: "-0.5px" }}>Usuarios</h1>
          <p style={{ color: "#6b7280", fontSize: 13, marginTop: 2 }}>{usuarios.length} usuario{usuarios.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", background: "linear-gradient(135deg, #2563eb, #1d4ed8)", color: "white", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
          Nuevo usuario
        </button>
      </div>

      {showForm && (
        <div style={{ background: "white", border: "1.5px solid #e5e7eb", borderRadius: 14, padding: 24, marginBottom: 24 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 20 }}>Crear usuario</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Nombre *</label>
              <input style={inputStyle} value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} placeholder="Nombre completo" />
            </div>
            <div>
              <label style={labelStyle}>Email *</label>
              <input style={inputStyle} type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@copelco.com.ar" />
            </div>
            <div>
              <label style={labelStyle}>Contraseña *</label>
              <input style={inputStyle} type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••••" />
            </div>
            <div>
              <label style={labelStyle}>Rol</label>
              <select style={inputStyle} value={form.rol} onChange={e => setForm(f => ({ ...f, rol: e.target.value }))}>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Sector</label>
              <select style={inputStyle} value={form.sector} onChange={e => setForm(f => ({ ...f, sector: e.target.value }))}>
                <option value="">Sin sector</option>
                {SECTORES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          {error && <p style={{ color: "#dc2626", fontSize: 13, marginBottom: 12 }}>{error}</p>}
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={handleCrear} disabled={guardando} style={{ padding: "9px 20px", background: "#2563eb", color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              {guardando ? "Guardando..." : "Crear"}
            </button>
            <button onClick={() => { setShowForm(false); setError(""); }} style={{ padding: "9px 20px", background: "transparent", color: "#6b7280", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ color: "#6b7280", fontSize: 14 }}>Cargando...</div>
      ) : (
        <div style={{ background: "white", border: "1.5px solid #f3f4f6", borderRadius: 14, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1.5px solid #f3f4f6" }}>
                {["Nombre", "Email", "Rol", "Sector", ""].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {usuarios.map(u => (
                <tr key={u.id} style={{ borderBottom: "1px solid #f9fafb" }}>
                  <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: "#111827" }}>{u.nombre}</td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: "#6b7280" }}>{u.email}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: u.rol === "admin_global" ? "#eff6ff" : u.rol === "admin_sector" ? "#f0fdf4" : "#f9fafb", color: u.rol === "admin_global" ? "#2563eb" : u.rol === "admin_sector" ? "#16a34a" : "#6b7280" }}>
                      {u.rol}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: "#6b7280" }}>{u.sector || "—"}</td>
                  <td style={{ padding: "14px 16px", textAlign: "right" }}>
                    {u.email !== user.email && (
                      <button onClick={() => handleEliminar(u.id, u.nombre)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 4 }}>
                        <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}