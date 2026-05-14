import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb, initDb } from "@/lib/db";
import path from "path";
import fs from "fs";

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.rol === "empleado") return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const procedimiento_id = formData.get("procedimiento_id") as string;
  if (!file || !procedimiento_id) return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });

  const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
  if (!allowedTypes.includes(file.type)) return NextResponse.json({ error: "Solo PDF y Word permitidos" }, { status: 400 });

  const ext = file.name.split(".").pop();
  const nombreArchivo = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
  fs.writeFileSync(path.join(UPLOAD_DIR, nombreArchivo), Buffer.from(await file.arrayBuffer()));

  await initDb();
  const db = getDb();
  const result = await db.execute({
    sql: "INSERT INTO archivos (procedimiento_id, nombre_original, nombre_archivo, tipo, tamanio) VALUES (?, ?, ?, ?, ?)",
    args: [procedimiento_id, file.name, nombreArchivo, file.type, file.size],
  });
  return NextResponse.json({ id: result.lastInsertRowid, nombre_original: file.name });
}
