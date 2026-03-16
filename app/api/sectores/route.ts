import { NextResponse } from "next/server";
import { getDb, initDb } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  await initDb();
  const db = getDb();
  const result = await db.execute("SELECT * FROM sectores ORDER BY nombre");
  return NextResponse.json(result.rows);
}
