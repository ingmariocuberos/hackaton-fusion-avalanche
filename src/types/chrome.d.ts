interface ChromeStorage {
  get(keys: string[], callback: (items: { [key: string]: any }) => void): void;
  set(items: { [key: string]: any }, callback?: () => void): void;
  remove(keys: string | string[], callback?: () => void): void;
  clear(callback?: () => void): void;
}

interface ChromeStorageArea {
  sync: ChromeStorage;
  local: ChromeStorage;
}

interface Chrome {
  storage: ChromeStorageArea;
}

declare global {
  interface Window {
    chrome?: Chrome;
  }
}

export {};
