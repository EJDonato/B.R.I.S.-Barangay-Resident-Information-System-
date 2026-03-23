export {};

declare global {
  interface Window {
    ipcRenderer: {
      on: (channel: string, listener: (...args: any[]) => void) => void;
      off: (channel: string, ...args: any[]) => void;
      send: (channel: string, ...args: any[]) => void;
      invoke: (channel: string, ...args: any[]) => Promise<any>;
      db: {
        getResidents: () => Promise<any[]>;
        searchResidents: (query: string) => Promise<any[]>;
        addResident: (resident: any) => Promise<number>;
        addTransaction: (transaction: any) => Promise<number>;
      };
    };
  }
}
