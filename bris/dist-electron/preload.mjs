"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  },
  // You can expose other APTs you need here.
  db: {
    getResidents: () => electron.ipcRenderer.invoke("db:get-residents"),
    searchResidents: (query) => electron.ipcRenderer.invoke("db:search-residents", query),
    addResident: (resident) => electron.ipcRenderer.invoke("db:add-resident", resident),
    addTransaction: (transaction) => electron.ipcRenderer.invoke("db:add-transaction", transaction),
    deleteResident: (id) => electron.ipcRenderer.invoke("db:delete-resident", id),
    deleteTransaction: (id) => electron.ipcRenderer.invoke("db:delete-transaction", id),
    updateResident: (resident) => electron.ipcRenderer.invoke("db:update-resident", resident),
    backup: () => electron.ipcRenderer.invoke("db:backup"),
    restore: () => electron.ipcRenderer.invoke("db:restore")
  }
});
