"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/procedimientos/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
router.push("/dashboard");
    } else {
      setError(data.error || "Error al iniciar sesión");
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #eff6ff 0%, #f8fafc 50%, #e0f2fe 100%)",
    }}>
      <div style={{ width: "100%", maxWidth: 420, padding: "0 24px" }}>
        {/* Logo / Brand */}
 <div style={{ textAlign: "center", marginBottom: 40 }}>
  <img
    src="/procedimientos/logo.png"
    alt="COPELCO"
    style={{ width: 180, height: "auto", objectFit: "contain", marginBottom: 16, display: "block", margin: "0 auto 16px" }}
  />
  <p style={{ color: "#6b7280", marginTop: 4, fontSize: 14 }}>Plataforma de Procedimientos e instructivos Internos RRHH</p>
</div>

        {/* Card */}
        <div style={{
          background: "white", borderRadius: 20,
          padding: "36px 32px",
          boxShadow: "0 4px 32px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24, color: "#111827" }}>Iniciar sesión</h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6 }}>
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="usuario@copelco.com.ar"
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: 10,
                  border: "1.5px solid #e5e7eb", fontSize: 14,
                  outline: "none", transition: "border-color 0.2s",
                  fontFamily: "inherit",
                }}
                onFocus={e => e.target.style.borderColor = "#2563eb"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6 }}>
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: 10,
                  border: "1.5px solid #e5e7eb", fontSize: 14,
                  outline: "none", transition: "border-color 0.2s",
                  fontFamily: "inherit",
                }}
                onFocus={e => e.target.style.borderColor = "#2563eb"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"}
              />
            </div>

            {error && (
              <div style={{
                background: "#fef2f2", border: "1px solid #fecaca",
                borderRadius: 8, padding: "10px 14px", marginBottom: 16,
                color: "#dc2626", fontSize: 13,
              }}>{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "12px",
                background: loading ? "#93c5fd" : "linear-gradient(135deg, #2563eb, #1d4ed8)",
                color: "white", border: "none", borderRadius: 10,
                fontSize: 15, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s", fontFamily: "inherit",
                boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
              }}
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "#9ca3af" }}>
          © {new Date().getFullYear()} COPELCO · Todos los derechos reservados
        </p>
      </div>
    </div>
  );
}
