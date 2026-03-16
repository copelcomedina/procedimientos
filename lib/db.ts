import { createClient, Client } from "@libsql/client";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), "data", "procedimientos.sqlite");
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

let client: Client;

export function getDb(): Client {
  if (!client) {
    client = createClient({ url: `file:${DB_PATH}` });
  }
  return client;
}

export async function initDb() {
  const db = getDb();
  await db.executeMultiple(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      rol TEXT NOT NULL DEFAULT 'empleado',
      sector TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS sectores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      descripcion TEXT,
      color TEXT DEFAULT '#2563eb',
      icono TEXT DEFAULT 'folder'
    );

    CREATE TABLE IF NOT EXISTS procedimientos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      descripcion TEXT,
      sector_id INTEGER NOT NULL,
      autor_id INTEGER NOT NULL,
      estado TEXT DEFAULT 'activo',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (sector_id) REFERENCES sectores(id),
      FOREIGN KEY (autor_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS archivos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      procedimiento_id INTEGER NOT NULL,
      nombre_original TEXT NOT NULL,
      nombre_archivo TEXT NOT NULL,
      tipo TEXT NOT NULL,
      tamanio INTEGER,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (procedimiento_id) REFERENCES procedimientos(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      procedimiento_id INTEGER NOT NULL,
      titulo TEXT NOT NULL,
      url TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (procedimiento_id) REFERENCES procedimientos(id) ON DELETE CASCADE
    );
  `);

  // Seed sectores
  const sectores = await db.execute("SELECT COUNT(*) as c FROM sectores");
  if ((sectores.rows[0].c as number) === 0) {
    await db.executeMultiple(`
      INSERT INTO sectores (nombre, slug, descripcion, color) VALUES ('RRHH', 'rrhh', 'Recursos Humanos', '#2563eb');
      INSERT INTO sectores (nombre, slug, descripcion, color) VALUES ('Medicina Laboral', 'medicina-laboral', 'Medicina y Salud Laboral', '#0891b2');
      INSERT INTO sectores (nombre, slug, descripcion, color) VALUES ('Liquidaciones', 'liquidaciones', 'Liquidaciones y Haberes', '#7c3aed');
    `);
  }

  // Seed admin user
  const users = await db.execute("SELECT COUNT(*) as c FROM users");
  if ((users.rows[0].c as number) === 0) {
    const hash = await bcrypt.hash("password", 10);
    await db.execute({
      sql: "INSERT INTO users (nombre, email, password, rol) VALUES (?, ?, ?, ?)",
      args: ["Administrador", "admin@copelco.com.ar", hash, "admin_global"],
    });
  }
}
