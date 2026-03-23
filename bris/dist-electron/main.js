import { app, BrowserWindow, ipcMain, dialog } from "electron";
import { fileURLToPath } from "node:url";
import path$1 from "node:path";
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
const dbPath = path.join(app.getPath("userData"), "bris.db");
let db = new Database(dbPath);
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
function deleteResident(id) {
  const info = db.prepare("DELETE FROM residents WHERE id = ?").run(id);
  return info.changes > 0;
}
function deleteTransaction(id) {
  const info = db.prepare("DELETE FROM transactions WHERE id = ?").run(id);
  return info.changes > 0;
}
function updateResident(resident) {
  const info = db.prepare(`
    UPDATE residents 
    SET name = ?, birthday = ?, address = ?, telephone = ?, is_voter = ?, occupation = ?, image_url = ?
    WHERE id = ?
  `).run(
    resident.name,
    resident.birthday,
    resident.address,
    resident.telephone,
    resident.isVoter ? 1 : 0,
    resident.occupation,
    resident.imageUrl,
    resident.id
  );
  return info.changes > 0;
}
async function backupDatabase(destPath) {
  try {
    await db.backup(destPath);
    return true;
  } catch (error) {
    console.error("Backup failed:", error);
    throw error;
  }
}
async function restoreDatabase(srcPath) {
  try {
    db.close();
    fs.copyFileSync(srcPath, dbPath);
    db = new Database(dbPath);
    return true;
  } catch (error) {
    console.error("Restore failed:", error);
    db = new Database(dbPath);
    throw error;
  }
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
  ipcMain.handle("db:delete-resident", async (_, id) => {
    return deleteResident(id);
  });
  ipcMain.handle("db:delete-transaction", async (_, id) => {
    return deleteTransaction(id);
  });
  ipcMain.handle("db:update-resident", async (_, resident) => {
    return updateResident(resident);
  });
  ipcMain.handle("db:backup", async () => {
    if (!win) return false;
    const { filePath } = await dialog.showSaveDialog(win, {
      title: "Backup Database",
      defaultPath: "bris_backup.db",
      filters: [{ name: "SQLite Database", extensions: ["db"] }]
    });
    if (filePath) {
      await backupDatabase(filePath);
      return true;
    }
    return false;
  });
  ipcMain.handle("db:restore", async () => {
    if (!win) return false;
    const { filePaths } = await dialog.showOpenDialog(win, {
      title: "Restore Database",
      filters: [{ name: "SQLite Database", extensions: ["db"] }],
      properties: ["openFile"]
    });
    if (filePaths && filePaths.length > 0) {
      await restoreDatabase(filePaths[0]);
      return true;
    }
    return false;
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
