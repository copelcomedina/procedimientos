import { NextRequest, NextResponse } from "next/server";
import { getDb, initDb } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  await initDb();
  const db = getDb();
  const { searchParams } = new URL(req.url);
  const sector = searchParams.get("sector");
  const buscar = searchParams.get("q");

  let sql = `SELECT p.*, s.nombre as sector_nombre, s.slug as sector_slug, s.color as sector_color,
    u.nombre as autor_nombre,
    (SELECT COUNT(*) FROM archivos WHERE procedimiento_id = p.id) as total_archivos,
    (SELECT COUNT(*) FROM links WHERE procedimiento_id = p.id) as total_links
    FROM procedimientos p
    JOIN sectores s ON p.sector_id = s.id
    JOIN users u ON p.autor_id = u.id
    WHERE p.estado = 'activo'`;
  const args: any[] = [];

  if (sector) { sql += " AND s.slug = ?"; args.push(sector); }
  if (buscar) { sql += " AND (p.titulo LIKE ? OR p.descripcion LIKE ?)"; args.push(`%${buscar}%`, `%${buscar}%`); }
  sql += " ORDER BY p.updated_at DESC";

  const result = await db.execute({ sql, args });
  return NextResponse.json(result.rows);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  if (session.rol === "empleado") return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  await initDb();
  const { titulo, descripcion, sector_id, links } = await req.json();
  if (!titulo || !sector_id) return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  const db = getDb();

  if (session.rol === "admin_sector") {
    const s = await db.execute({ sql: "SELECT * FROM sectores WHERE id = ?", args: [sector_id] });
    if ((s.rows[0] as any)?.slug !== session.sector)
      return NextResponse.json({ error: "Sin permisos para este sector" }, { status: 403 });
  }

  const result = await db.execute({
    sql: "INSERT INTO procedimientos (titulo, descripcion, sector_id, autor_id) VALUES (?, ?, ?, ?)",
    args: [titulo, descripcion || null, sector_id, session.id],
  });
  const id = result.lastInsertRowid;

  if (links && Array.isArray(links)) {
    for (const link of links) {
      if (link.titulo && link.url)
        await db.execute({ sql: "INSERT INTO links (procedimiento_id, titulo, url) VALUES (?, ?, ?)", args: [id, link.titulo, link.url] });
    }
  }
  const proc = await db.execute({ sql: "SELECT p.*, s.nombre as sector_nombre FROM procedimientos p JOIN sectores s ON p.sector_id = s.id WHERE p.id = ?", args: [Number(id)] });
  return NextResponse.json(proc.rows[0], { status: 201 });
}
