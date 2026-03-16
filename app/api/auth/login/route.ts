import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb, initDb } from "@/lib/db";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  await initDb();
  const { email, password } = await req.json();
  if (!email || !password) return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  const db = getDb();
  const result = await db.execute({ sql: "SELECT * FROM users WHERE email = ?", args: [email] });
  const user = result.rows[0] as any;
  if (!user) return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 });
  const valid = await bcrypt.compare(password, user.password as string);
  if (!valid) return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 });
  const token = signToken({ id: user.id as number, nombre: user.nombre as string, email: user.email as string, rol: user.rol as string, sector: user.sector as string | null });
  const res = NextResponse.json({ ok: true, user: { id: user.id, nombre: user.nombre, rol: user.rol, sector: user.sector } });
  res.cookies.set("auth_token", token, { httpOnly: true, maxAge: 60 * 60 * 8, path: "/procedimientos" });
  return res;
}
