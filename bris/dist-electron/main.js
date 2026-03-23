import { app, BrowserWindow, ipcMain } from "electron";
import { fileURLToPath } from "node:url";
import path$1 from "node:path";
import Database from "better-sqlite3";
import path from "path";
const dbPath = path.join(app.getPath("userData"), "bris.db");
const db = new Database(dbPath);
function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS residents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      birthday TEXT,
      address TEXT,
      telephone TEXT,
      is_voter INTEGER DEFAULT 0,
      occupation TEXT,
      image_url TEXT
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      resident_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      transaction_date TEXT NOT NULL,
      purpose TEXT,
      FOREIGN KEY (resident_id) REFERENCES residents (id) ON DELETE CASCADE
    );
  `);
}
function getAllResidents() {
  const residents = db.prepare("SELECT * FROM residents").all();
  return residents.map((r) => ({
    ...r,
    isVoter: Boolean(r.is_voter),
    imageUrl: r.image_url,
    transactions: db.prepare("SELECT * FROM transactions WHERE resident_id = ?").all(r.id).map((t) => ({
      ...t,
      date: t.transaction_date
    }))
  }));
}
function searchResidents(query) {
  const residents = db.prepare("SELECT * FROM residents WHERE name LIKE ?").all(`%${query}%`);
  return residents.map((r) => ({
    ...r,
    isVoter: Boolean(r.is_voter),
    imageUrl: r.image_url,
    transactions: db.prepare("SELECT * FROM transactions WHERE resident_id = ?").all(r.id).map((t) => ({
      ...t,
      date: t.transaction_date
    }))
  }));
}
function addResident(resident) {
  const info = db.prepare(`
    INSERT INTO residents (name, birthday, address, telephone, is_voter, occupation, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    resident.name,
    resident.birthday,
    resident.address,
    resident.telephone,
    resident.isVoter ? 1 : 0,
    resident.occupation,
    resident.imageUrl
  );
  return info.lastInsertRowid;
}
function addTransaction(transaction) {
  const info = db.prepare(`
    INSERT INTO transactions (resident_id, type, transaction_date, purpose)
    VALUES (?, ?, ?, ?)
  `).run(
    transaction.residentId,
    transaction.type,
    transaction.date,
    transaction.purpose
  );
  return info.lastInsertRowid;
}
const __filename$1 = fileURLToPath(import.meta.url);
const __dirname$1 = path$1.dirname(__filename$1);
process.env.APP_ROOT = path$1.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path$1.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path$1.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path$1.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    icon: path$1.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path$1.join(__dirname$1, "preload.mjs"),
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  ipcMain.handle("db:get-residents", async () => {
    return getAllResidents();
  });
  ipcMain.handle("db:search-residents", async (_, query) => {
    return searchResidents(query);
  });
  ipcMain.handle("db:add-resident", async (_, resident) => {
    return addResident(resident);
  });
  ipcMain.handle("db:add-transaction", async (_, transaction) => {
    return addTransaction(transaction);
  });
  initDatabase();
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path$1.join(RENDERER_DIST, "index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(createWindow);
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
