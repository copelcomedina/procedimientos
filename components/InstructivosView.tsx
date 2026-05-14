"use client";
import { useState } from "react";
import { INSTRUCTIVOS, CarpetaInstructivos } from "@/lib/instructivos";

export default function InstructivosView({ carpetaSlug }: { carpetaSlug: string }) {
  const [buscar, setBuscar] = useState("");

  const carpeta = INSTRUCTIVOS.find(c => c.slug === carpetaSlug);
  const archivos = carpeta
    ? carpeta.archivos.filter(a => a.nombre.toLowerCase().includes(buscar.toLowerCase()))
    : [];

  const totalCarpeta = carpeta?.archivos.length ?? 0;

  return (
    <main style={{ flex: 1, padding: "32px 32px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", letterSpacing: "-0.5px" }}>
            Instructivos INWeb — {carpeta?.nombre}
          </h1>
          <p style={{ color: "#6b7280", fontSize: 13, marginTop: 2 }}>
            {totalCarpeta} instructivo{totalCarpeta !== 1 ? "s" : ""}
          </p>
        </div>
        <div style={{ position: "relative" }}>
          <svg style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Buscar instructivo..."
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
      </div>

      {/* Grid */}
      {archivos.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <div style={{ width: 64, height: 64, background: "#f3f4f6", borderRadius: 16, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
            <svg width="28" height="28" fill="none" stroke="#9ca3af" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            </svg>
          </div>
          <p style={{ color: "#6b7280", fontSize: 15 }}>No se encontraron instructivos{buscar ? ` para "${buscar}"` : ""}</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
          {archivos.map((archivo, i) => (
            <a
              key={archivo.archivo}
              href={`/procedimientos/instructivos/${carpeta!.nombre}/${encodeURIComponent(archivo.archivo)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "white", borderRadius: 14, padding: "18px 20px",
                border: "1.5px solid #f3f4f6", cursor: "pointer",
                transition: "all 0.2s",
                textDecoration: "none",
                display: "flex", alignItems: "flex-start", gap: 14,
                animation: `fadeIn 0.3s ease ${i * 0.04}s both`,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "#dbeafe";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 16px rgba(37,99,235,0.08)";
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "#f3f4f6";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
                (e.currentTarget as HTMLAnchorElement).style.transform = "none";
              }}
            >
              {/* PDF icon */}
              <div style={{
                width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                background: "#fef2f2",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="20" height="20" fill="none" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="9" y1="13" x2="15" y2="13"/>
                  <line x1="9" y1="17" x2="15" y2="17"/>
                </svg>
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", lineHeight: 1.4, marginBottom: 4 }}>
                  {archivo.nombre}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: "#dc2626",
                    background: "#fef2f2", borderRadius: 4, padding: "2px 6px",
                  }}>
                    PDF
                  </span>
                  <span style={{ fontSize: 11, color: "#9ca3af" }}>INWeb</span>
                </div>
              </div>

              {/* Arrow */}
              <svg style={{ flexShrink: 0, color: "#9ca3af", marginTop: 2 }} width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
              </svg>
            </a>
          ))}
        </div>
      )}
    </main>
  );
}
