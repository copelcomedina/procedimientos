import { NextRequest, NextResponse } from "next/server";
import { getDb, initDb } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  const { id } = await params;
  await initDb();
  const db = getDb();
  const result = await db.execute({
    sql: `SELECT p.*, s.nombre as sector_nombre, s.slug as sector_slug, s.color as sector_color, u.nombre as autor_nombre
          FROM procedimientos p JOIN sectores s ON p.sector_id = s.id JOIN users u ON p.autor_id = u.id WHERE p.id = ?`,
    args: [id],
  });
  if (!result.rows[0]) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  const archivos = await db.execute({ sql: "SELECT * FROM archivos WHERE procedimiento_id = ?", args: [id] });
  const links = await db.execute({ sql: "SELECT * FROM links WHERE procedimiento_id = ?", args: [id] });
  return NextResponse.json({ ...result.rows[0], archivos: archivos.rows, links: links.rows });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.rol === "empleado") return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  const { id } = await params;
  const { titulo, descripcion, links } = await req.json();
  await initDb();
  const db = getDb();
  await db.execute({ sql: "UPDATE procedimientos SET titulo = ?, descripcion = ?, updated_at = datetime('now') WHERE id = ?", args: [titulo, descripcion, id] });
  if (links) {
    await db.execute({ sql: "DELETE FROM links WHERE procedimiento_id = ?", args: [id] });
    for (const link of links) {
      if (link.titulo && link.url)
        await db.execute({ sql: "INSERT INTO links (procedimiento_id, titulo, url) VALUES (?, ?, ?)", args: [id, link.titulo, link.url] });
    }
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.rol === "empleado") return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  const { id } = await params;
  await initDb();
  const db = getDb();
  await db.execute({ sql: "UPDATE procedimientos SET estado = 'inactivo' WHERE id = ?", args: [id] });
  return NextResponse.json({ ok: true });
}
