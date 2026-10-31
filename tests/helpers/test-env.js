// tests/helpers/test-env.js
// Synthetic browser environment and DOM simulator for opaque-box testing

export function createMockLocalStorage(initial = {}) {
  const store = new Map(Object.entries(initial));
  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(String(key), String(value));
    },
    removeItem(key) {
      store.delete(String(key));
    },
    clear() {
      store.clear();
    },
    get length() {
      return store.size;
    },
    key(index) {
      return Array.from(store.keys())[index] || null;
    },
    _dump() {
      return Object.fromEntries(store.entries());
    },
  };
}

export function createMockDocument() {
  const elements = new Map();
  const docElement = {
    dataset: {},
    classList: {
      _classes: new Set(),
      add(...cls) {
        cls.forEach(c => this._classes.add(c));
      },
      remove(...cls) {
        cls.forEach(c => this._classes.delete(c));
      },
      contains(c) {
        return this._classes.has(c);
      },
      toggle(c) {
        if (this._classes.has(c)) {
          this._classes.delete(c);
          return false;
        } else {
          this._classes.add(c);
          return true;
        }
      },
    },
    attributes: {},
    setAttribute(name, val) {
      this.attributes[name] = String(val);
      if (name.startsWith('data-')) {
        const key = name.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        this.dataset[key] = String(val);
      }
    },
    getAttribute(name) {
      return this.attributes[name] !== undefined ? this.attributes[name] : null;
    },
    removeAttribute(name) {
      delete this.attributes[name];
      if (name.startsWith('data-')) {
        const key = name.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        delete this.dataset[key];
      }
    },
    style: {},
  };

  return {
    documentElement: docElement,
    body: {
      classList: docElement.classList,
      style: {},
    },
    title: '',
    getElementById(id) {
      return elements.get(id) || null;
    },
    _registerElement(id, el) {
      elements.set(id, el);
    },
  };
}

export function createMockWindow(options = {}) {
  const localStorage = options.localStorage || createMockLocalStorage();
  const document = options.document || createMockDocument();
  let reducedMotion = options.reducedMotion || false;
  let currentPath = options.pathname || '/';
  let currentSearch = options.search || '';
  let currentHash = options.hash || '';

  const parseUrl = (u) => {
    let p = u || '/';
    let s = '';
    let h = '';
    const hashIdx = p.indexOf('#');
    if (hashIdx !== -1) {
      h = p.slice(hashIdx);
      p = p.slice(0, hashIdx);
    }
    const qIdx = p.indexOf('?');
    if (qIdx !== -1) {
      s = p.slice(qIdx);
      p = p.slice(0, qIdx);
    }
    return { pathname: p, search: s, hash: h };
  };

  const initialParsed = parseUrl(currentPath);
  currentPath = initialParsed.pathname;
  if (!currentSearch && initialParsed.search) currentSearch = initialParsed.search;
  if (!currentHash && initialParsed.hash) currentHash = initialParsed.hash;

  const historyStack = [{ pathname: currentPath, search: currentSearch, hash: currentHash }];
  let historyIndex = 0;

  const listeners = new Map();

  return {
    innerWidth: options.innerWidth || 1280,
    innerHeight: options.innerHeight || 800,
    localStorage,
    document,
    location: {
      get pathname() {
        return currentPath;
      },
      set pathname(p) {
        const parsed = parseUrl(p);
        currentPath = parsed.pathname;
        currentSearch = parsed.search || currentSearch;
        currentHash = parsed.hash || currentHash;
        historyStack.push({ pathname: currentPath, search: currentSearch, hash: currentHash });
        historyIndex = historyStack.length - 1;
      },
      get search() {
        return currentSearch;
      },
      set search(s) {
        currentSearch = s;
      },
      get hash() {
        return currentHash;
      },
      set hash(h) {
        currentHash = h;
      },
      get href() {
        return `http://localhost${currentPath}${currentSearch}${currentHash}`;
      },
    },
    history: {
      pushState(state, title, url) {
        const parsed = parseUrl(url);
        currentPath = parsed.pathname;
        currentSearch = parsed.search;
        currentHash = parsed.hash;
        historyStack.push(parsed);
        historyIndex = historyStack.length - 1;
      },
      replaceState(state, title, url) {
        const parsed = parseUrl(url);
        currentPath = parsed.pathname;
        currentSearch = parsed.search;
        currentHash = parsed.hash;
        historyStack[historyIndex] = parsed;
      },
      back() {
        if (historyIndex > 0) {
          historyIndex--;
          const item = historyStack[historyIndex];
          currentPath = item.pathname;
          currentSearch = item.search;
          currentHash = item.hash;
        }
      },
      forward() {
        if (historyIndex < historyStack.length - 1) {
          historyIndex++;
          const item = historyStack[historyIndex];
          currentPath = item.pathname;
          currentSearch = item.search;
          currentHash = item.hash;
        }
      },
      get length() {
        return historyStack.length;
      },
    },
    matchMedia(query) {
      if (query.includes('prefers-reduced-motion')) {
        return {
          matches: reducedMotion,
          media: query,
          addEventListener: () => {},
          removeEventListener: () => {},
        };
      }
      return {
        matches: false,
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
      };
    },
    setReducedMotion(enabled) {
      reducedMotion = enabled;
    },
    addEventListener(event, handler) {
      if (!listeners.has(event)) listeners.set(event, []);
      listeners.get(event).push(handler);
    },
    removeEventListener(event, handler) {
      if (listeners.has(event)) {
        const filtered = listeners.get(event).filter(h => h !== handler);
        listeners.set(event, filtered);
      }
    },
    dispatchEvent(event) {
      const handlers = listeners.get(event.type) || [];
      handlers.forEach(h => h(event));
    },
    scrollTo: () => {},
    requestAnimationFrame(cb) {
      return setTimeout(cb, 16);
    },
    cancelAnimationFrame(id) {
      clearTimeout(id);
    },
  };
}

export function matchClientRoute(routes, pathname) {
  for (const route of routes) {
    if (route === pathname) return { matched: true, route, params: {} };
    if (route.includes(':')) {
      const parts = route.split('/');
      const pathParts = pathname.split('/');
      if (parts.length === pathParts.length) {
        const params = {};
        let matches = true;
        for (let i = 0; i < parts.length; i++) {
          if (parts[i].startsWith(':')) {
            params[parts[i].slice(1)] = pathParts[i];
          } else if (parts[i] !== pathParts[i]) {
            matches = false;
            break;
          }
        }
        if (matches) return { matched: true, route, params };
      }
    }
  }
  const wildcard = routes.find(r => r === '*');
  if (wildcard) return { matched: true, route: '*', params: { path: pathname } };
  return { matched: false, route: null, params: {} };
}
