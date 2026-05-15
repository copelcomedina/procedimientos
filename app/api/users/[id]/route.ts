import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.rol !== "admin_global") return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  const { id } = await params;
  const db = getDb();
  await db.execute({ sql: "DELETE FROM users WHERE id = ?", args: [id] });
  return NextResponse.json({ ok: true });
}