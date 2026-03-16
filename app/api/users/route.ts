import { NextRequest, NextResponse } from "next/server";
import { getDb, initDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET() {
  const session = await getSession();
  if (!session || session.rol !== "admin_global") return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  await initDb();
  const db = getDb();
  const result = await db.execute("SELECT id, nombre, email, rol, sector, created_at FROM users ORDER BY nombre");
  return NextResponse.json(result.rows);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.rol !== "admin_global") return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  const { nombre, email, password, rol, sector } = await req.json();
  if (!nombre || !email || !password) return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  const hash = await bcrypt.hash(password, 10);
  await initDb();
  const db = getDb();
  try {
    const result = await db.execute({ sql: "INSERT INTO users (nombre, email, password, rol, sector) VALUES (?, ?, ?, ?, ?)", args: [nombre, email, hash, rol || "empleado", sector || null] });
    return NextResponse.json({ id: result.lastInsertRowid, nombre, email, rol }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Email ya existe" }, { status: 409 });
  }
}
