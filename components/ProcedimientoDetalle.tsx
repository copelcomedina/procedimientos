"use client";
import { useState, useEffect } from "react";
import { UserPayload } from "@/lib/auth";
import ProcedimientoModal from "./ProcedimientoModal";

interface Archivo {
  id: number;
  nombre_original: string;
  tipo: string;
  tamanio: number;
}
interface Link {
  id: number;
  titulo: string;
  url: string;
}
interface Proc {
  id: number;
  titulo: string;
  descripcion: string;
  sector_id: number;
  sector_nombre: string;
  sector_color: string;
  autor_nombre: string;
  updated_at: string;
  created_at: string;
  archivos: Archivo[];
  links: Link[];
}

export default function ProcedimientoDetalle({
  id,
  user,
  onClose,
  onUpdate,
}: {
  id: number;
  user: UserPayload;
  onClose: () => void;
  onUpdate: () => void;
}) {
  const [proc, setProc] = useState<Proc | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [previewing, setPreviewing] = useState<Archivo | null>(null);

  const canEdit =
    user.rol === "admin_global" ||
    (user.rol === "admin_sector" &&
      proc &&
      user.sector === proc.sector_nombre.toLowerCase().replace(/ /g, "-"));

  async function load() {
    setLoading(true);
    const res = await fetch(`/procedimientos/api/procedimientos/${id}`);
    const data = await res.json();
    setProc(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [id]);

  async function handleDelete() {
    if (!confirm("¿Eliminar este procedimiento?")) return;
    await fetch(`/procedimientos/api/procedimientos/${id}`, {
      method: "DELETE",
    });
    onUpdate();
    onClose();
  }

  async function handleDeleteArchivo(archivoId: number) {
    if (!confirm("¿Eliminar este archivo?")) return;
    await fetch(`/procedimientos/api/archivos/${archivoId}`, {
      method: "DELETE",
    });
    load();
  }

  async function handleUploadArchivo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFile(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("procedimiento_id", String(id));
    await fetch("/procedimientos/api/upload", { method: "POST", body: fd });
    setUploadingFile(false);
    load();
    e.target.value = "";
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  function fileIcon(tipo: string) {
    if (tipo === "application/pdf") return { color: "#dc2626", label: "PDF" };
    return { color: "#2563eb", label: "DOC" };
  }

  const isPdf = (tipo: string) => tipo === "application/pdf";

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          zIndex: 50,
        }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div
          style={{
            background: "white",
            width: "100%",
            maxWidth: 520,
            height: "100vh",
            overflowY: "auto",
            boxShadow: "-8px 0 40px rgba(0,0,0,0.12)",
            animation: "slideIn 0.25s ease",
          }}
        >
          {loading ? (
            <div style={{ padding: 40, textAlign: "center", color: "#9ca3af" }}>
              Cargando...
            </div>
          ) : proc ? (
            <>
              <div style={{ padding: "28px 28px 0" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    marginBottom: 16,
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: "4px 10px",
                      borderRadius: 20,
                      background: `${proc.sector_color}15`,
                      color: proc.sector_color,
                    }}
                  >
                    {proc.sector_nombre}
                  </span>
                  <div style={{ display: "flex", gap: 8 }}>
                    {canEdit && (
                      <>
                        <button
                          onClick={() => setEditing(true)}
                          style={{
                            background: "none",
                            border: "1.5px solid #e5e7eb",
                            borderRadius: 8,
                            padding: "5px 12px",
                            fontSize: 12,
                            fontWeight: 500,
                            cursor: "pointer",
                            color: "#374151",
                            fontFamily: "inherit",
                          }}
                        >
                          Editar
                        </button>
                        <button
                          onClick={handleDelete}
                          style={{
                            background: "none",
                            border: "1.5px solid #fecaca",
                            borderRadius: 8,
                            padding: "5px 12px",
                            fontSize: 12,
                            fontWeight: 500,
                            cursor: "pointer",
                            color: "#dc2626",
                            fontFamily: "inherit",
                          }}
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                    <button
                      onClick={onClose}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#9ca3af",
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        viewBox="0 0 24 24"
                      >
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                <h2
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#111827",
                    lineHeight: 1.35,
                    marginBottom: 8,
                  }}
                >
                  {proc.titulo}
                </h2>
                <div
                  style={{
                    display: "flex",
                    gap: 16,
                    fontSize: 12,
                    color: "#9ca3af",
                    marginBottom: 24,
                  }}
                >
                  <span>Por {proc.autor_nombre}</span>
                  <span>
                    Actualizado{" "}
                    {new Date(proc.updated_at).toLocaleDateString("es-AR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div
                  style={{ height: 1, background: "#f3f4f6", marginBottom: 24 }}
                />
              </div>

              <div style={{ padding: "0 28px 40px" }}>
                {proc.descripcion && (
                  <div style={{ marginBottom: 28 }}>
                    <h3 style={sectionTitle}>Descripción</h3>
                    <p
                      style={{
                        fontSize: 14,
                        color: "#374151",
                        lineHeight: 1.7,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {proc.descripcion}
                    </p>
                  </div>
                )}

                {proc.links.length > 0 && (
                  <div style={{ marginBottom: 28 }}>
                    <h3 style={sectionTitle}>Links relacionados</h3>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      {proc.links.map((link) => (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "10px 14px",
                            background: "#f8fafc",
                            border: "1.5px solid #e5e7eb",
                            borderRadius: 10,
                            textDecoration: "none",
                            color: "#2563eb",
                            fontSize: 13,
                            fontWeight: 500,
                            transition: "all 0.15s",
                          }}
                          onMouseEnter={(e) => {
                            (
                              e.currentTarget as HTMLAnchorElement
                            ).style.background = "#eff6ff";
                            (
                              e.currentTarget as HTMLAnchorElement
                            ).style.borderColor = "#bfdbfe";
                          }}
                          onMouseLeave={(e) => {
                            (
                              e.currentTarget as HTMLAnchorElement
                            ).style.background = "#f8fafc";
                            (
                              e.currentTarget as HTMLAnchorElement
                            ).style.borderColor = "#e5e7eb";
                          }}
                        >
                          <svg
                            width="14"
                            height="14"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            viewBox="0 0 24 24"
                          >
                            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                          </svg>
                          {link.titulo}
                          <svg
                            style={{ marginLeft: "auto", color: "#9ca3af" }}
                            width="12"
                            height="12"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            viewBox="0 0 24 24"
                          >
                            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                          </svg>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 10,
                    }}
                  >
                    <h3 style={sectionTitle}>Archivos</h3>
                    {canEdit && (
                      <label
                        style={{
                          fontSize: 12,
                          fontWeight: 500,
                          color: "#2563eb",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <svg
                          width="13"
                          height="13"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          viewBox="0 0 24 24"
                        >
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                        </svg>
                        {uploadingFile ? "Subiendo..." : "Subir archivo"}
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          style={{ display: "none" }}
                          onChange={handleUploadArchivo}
                        />
                      </label>
                    )}
                  </div>

                  {proc.archivos.length === 0 ? (
                    <p
                      style={{
                        fontSize: 13,
                        color: "#9ca3af",
                        padding: "12px 0",
                      }}
                    >
                      Sin archivos adjuntos
                    </p>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      {proc.archivos.map((archivo) => {
                        const { color, label } = fileIcon(archivo.tipo);
                        return (
                          <div
                            key={archivo.id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                              padding: "12px 14px",
                              background: "#f8fafc",
                              border: "1.5px solid #e5e7eb",
                              borderRadius: 10,
                            }}
                          >
                            <div
                              style={{
                                width: 36,
                                height: 36,
                                borderRadius: 8,
                                flexShrink: 0,
                                background: `${color}15`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 10,
                                fontWeight: 700,
                                color,
                              }}
                            >
                              {label}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div
                                style={{
                                  fontSize: 13,
                                  fontWeight: 500,
                                  color: "#111827",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {archivo.nombre_original}
                              </div>
                              <div style={{ fontSize: 11, color: "#9ca3af" }}>
                                {formatSize(archivo.tamanio)}
                              </div>
                            </div>
                            <div style={{ display: "flex", gap: 6 }}>
                              {/* Botón Ver — solo para PDF */}
                              {isPdf(archivo.tipo) && (
                                <button
                                  onClick={() => setPreviewing(archivo)}
                                  style={{
                                    background: "#eff6ff",
                                    border: "1.5px solid #bfdbfe",
                                    borderRadius: 8,
                                    padding: "5px 10px",
                                    fontSize: 12,
                                    cursor: "pointer",
                                    color: "#2563eb",
                                    fontWeight: 500,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 4,
                                    fontFamily: "inherit",
                                  }}
                                >
                                  <svg
                                    width="13"
                                    height="13"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                    <circle cx="12" cy="12" r="3" />
                                  </svg>
                                  Ver
                                </button>
                              )}
                              <a
                                href={`/procedimientos/api/archivos/${archivo.id}`}
                                style={{
                                  background: "none",
                                  border: "1.5px solid #e5e7eb",
                                  borderRadius: 8,
                                  padding: "5px 10px",
                                  fontSize: 12,
                                  cursor: "pointer",
                                  color: "#374151",
                                  textDecoration: "none",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 4,
                                }}
                              >
                                <svg
                                  width="13"
                                  height="13"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                                </svg>
                                Descargar
                              </a>
                              {canEdit && (
                                <button
                                  onClick={() =>
                                    handleDeleteArchivo(archivo.id)
                                  }
                                  style={{
                                    background: "none",
                                    border: "1.5px solid #fecaca",
                                    borderRadius: 8,
                                    padding: "5px 8px",
                                    cursor: "pointer",
                                    color: "#dc2626",
                                  }}
                                >
                                  <svg
                                    width="13"
                                    height="13"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M3 6h18M19 6l-1 14H6L5 6M9 6V4h6v2" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div style={{ padding: 40, textAlign: "center", color: "#9ca3af" }}>
              No encontrado
            </div>
          )}
        </div>
      </div>

      {/* Modal de preview PDF */}
      {previewing && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: 24,
          }}
          onClick={(e) => e.target === e.currentTarget && setPreviewing(null)}
        >
          <div
            style={{
              background: "white",
              borderRadius: 16,
              width: "100%",
              maxWidth: 860,
              height: "90vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 24px 64px rgba(0,0,0,0.3)",
              animation: "fadeIn 0.2s ease",
            }}
          >
            {/* Header del modal */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 20px",
                borderBottom: "1px solid #f3f4f6",
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: "#fef2f2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#dc2626",
                  }}
                >
                  PDF
                </div>
                <div>
                  <div
                    style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}
                  >
                    {previewing.nombre_original}
                  </div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>
                    {formatSize(previewing.tamanio)}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <a
                  href={`/procedimientos/api/archivos/${previewing.id}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "7px 14px",
                    background: "#eff6ff",
                    border: "1.5px solid #bfdbfe",
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 500,
                    color: "#2563eb",
                    textDecoration: "none",
                  }}
                >
                  <svg
                    width="13"
                    height="13"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                  </svg>
                  Descargar
                </a>
                <button
                  onClick={() => setPreviewing(null)}
                  style={{
                    background: "none",
                    border: "1.5px solid #e5e7eb",
                    borderRadius: 8,
                    padding: "7px 10px",
                    cursor: "pointer",
                    color: "#374151",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            {/* iframe */}
            <iframe
              src={`/procedimientos/api/archivos/${previewing.id}?inline=true`}
              style={{ flex: 1, border: "none", borderRadius: "0 0 16px 16px" }}
              title={previewing.nombre_original}
            />
          </div>
        </div>
      )}

      {editing && proc && (
        <ProcedimientoModal
          sectores={[
            {
              id: proc.sector_id,
              nombre: proc.sector_nombre,
              slug: proc.sector_nombre,
              color: proc.sector_color,
            },
          ]}
          user={user}
          onClose={() => setEditing(false)}
          onSave={() => {
            setEditing(false);
            load();
            onUpdate();
          }}
          inicial={{
            id: proc.id,
            titulo: proc.titulo,
            descripcion: proc.descripcion || "",
            sector_id: proc.sector_id,
            links: proc.links.map((l) => ({ titulo: l.titulo, url: l.url })),
          }}
        />
      )}

      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </>
  );
}

const sectionTitle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: "#9ca3af",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: 10,
};
