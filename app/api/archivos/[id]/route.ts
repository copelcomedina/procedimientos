import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb, initDb } from "@/lib/db";
import path from "path";
import fs from "fs";

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  const { id } = await params;
  await initDb();
  const db = getDb();
  const result = await db.execute({ sql: "SELECT * FROM archivos WHERE id = ?", args: [id] });
  const archivo = result.rows[0] as any;
  if (!archivo) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  const filePath = path.join(UPLOAD_DIR, archivo.nombre_archivo);
  if (!fs.existsSync(filePath)) return NextResponse.json({ error: "Archivo no encontrado" }, { status: 404 });
  const buffer = fs.readFileSync(filePath);
  return new NextResponse(buffer, {
    headers: { "Content-Type": archivo.tipo, "Content-Disposition": `${_req.nextUrl.searchParams.get("inline") ? "inline" : "attachment"}; filename="${archivo.nombre_original}"` },
  });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.rol === "empleado") return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  const { id } = await params;
  await initDb();
  const db = getDb();
  const result = await db.execute({ sql: "SELECT * FROM archivos WHERE id = ?", args: [id] });
  const archivo = result.rows[0] as any;
  if (!archivo) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  const filePath = path.join(UPLOAD_DIR, archivo.nombre_archivo);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  await db.execute({ sql: "DELETE FROM archivos WHERE id = ?", args: [id] });
  return NextResponse.json({ ok: true });
}
