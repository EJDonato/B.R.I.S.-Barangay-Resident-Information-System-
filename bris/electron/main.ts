import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { initDatabase, getAllResidents, searchResidents, addResident, addTransaction, backupDatabase, restoreDatabase, deleteResident, deleteTransaction, updateResident } from './database'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

process.env.APP_ROOT = path.join(__dirname, '..')

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  // Register IPC handlers
  ipcMain.handle('db:get-residents', async () => {
    return getAllResidents()
  })

  ipcMain.handle('db:search-residents', async (_, query) => {
    return searchResidents(query)
  })

  ipcMain.handle('db:add-resident', async (_, resident) => {
    return addResident(resident)
  })

  ipcMain.handle('db:add-transaction', async (_, transaction) => {
    return addTransaction(transaction)
  })

  ipcMain.handle('db:delete-resident', async (_, id) => {
    return deleteResident(id)
  })

  ipcMain.handle('db:delete-transaction', async (_, id) => {
    return deleteTransaction(id)
  })

  ipcMain.handle('db:update-resident', async (_, resident) => {
    return updateResident(resident)
  })

  ipcMain.handle('db:backup', async () => {
    if (!win) return false;
    const { filePath } = await dialog.showSaveDialog(win, {
      title: 'Backup Database',
      defaultPath: 'bris_backup.db',
      filters: [{ name: 'SQLite Database', extensions: ['db'] }]
    });
    if (filePath) {
      await backupDatabase(filePath);
      return true;
    }
    return false;
  });

  ipcMain.handle('db:restore', async () => {
    if (!win) return false;
    const { filePaths } = await dialog.showOpenDialog(win, {
      title: 'Restore Database',
      filters: [{ name: 'SQLite Database', extensions: ['db'] }],
      properties: ['openFile']
    });
    if (filePaths && filePaths.length > 0) {
      await restoreDatabase(filePaths[0]);
      return true;
    }
    return false;
  });

  initDatabase()

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)
