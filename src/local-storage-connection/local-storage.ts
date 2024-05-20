type SBase = {
  toString: () => string;
};

export default class LocalStorage {
  static set<T extends SBase>(key: string, value: T, formatter?: (value: T) => string) {
    if (formatter) localStorage.setItem(key, formatter(value));
    else localStorage.setItem(key, value.toString());
  }

  static get(key: string): string | null {
    return localStorage.getItem(key);
  }

  static expireSet<T extends SBase>(
    key: string,
    value: T,
    interval: number,
    formatter?: (value: T) => string
  ) {
    const currentTimestamp = Date.now();
    const expiredTimestamp = interval + currentTimestamp;
    const data = {
      value: formatter ? formatter(value) : value.toString(),
      timestamp: expiredTimestamp,
    };
    localStorage.setItem(key, JSON.stringify(data));
  }

  static expireGet(key: string): { data: string | null; error?: string } {
    const rawData = localStorage.getItem(key);
    if (rawData) {
      const data: { value: string; timestamp: string } = JSON.parse(rawData);
      const currentTimestamp = Date.now();
      if (Number(data.timestamp) < currentTimestamp) return { data: null, error: 'key is expired' };
      return { data: data.value };
    } else return { data: null, error: 'Invalid key' };
  }
}
