/**
 * Cathedral event bus: light client for the cathedral-core websocket.
 *
 * ND-safe choices:
 * - Lazy connection so offline/off-grid use does not stall page load.
 * - Calm logging helper rather than alerts (avoids sudden UI disruptions).
 * - Pure helpers that always return unsubscribe handles to keep control local.
 */

const WS_URL = "wss://cathedral-core.fly.dev/ws";

type Listener = (payload: unknown) => void;

type ListenerSet = Set<Listener>;

type ListenerMap = Map<string, ListenerSet>;

const listeners: ListenerMap = new Map();
let socket: WebSocket | null = null;
let socketReady: Promise<WebSocket> | null = null;

/**
 * Subscribe to a channel. Returns a function to remove the listener.
 */
export function subscribe(event: string, handler: Listener): () => void {
  if (!listeners.has(event)) {
    listeners.set(event, new Set());
  }
  const set = listeners.get(event) as ListenerSet;
  set.add(handler);
  return () => {
    set.delete(handler);
    if (set.size === 0) {
      listeners.delete(event);
    }
  };
}

/**
 * Publish an event to cathedral-core. Messages are wrapped with an event key.
 */
export async function publish(event: string, payload: unknown): Promise<void> {
  if (!event) {
    return;
  }
  const ws = await ensureSocket();
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    return;
  }
  const envelope = JSON.stringify({ event, payload });
  ws.send(envelope);
}

/**
 * Internal helper: open the socket only once and reuse it.
 */
async function ensureSocket(): Promise<WebSocket | null> {
  if (socket && socket.readyState === WebSocket.OPEN) {
    return socket;
  }
  if (socketReady) {
    return socketReady;
  }
  if (typeof WebSocket === "undefined") {
    return null;
  }
  socketReady = new Promise<WebSocket>((resolve) => {
    const ws = new WebSocket(WS_URL);
    ws.addEventListener("open", () => {
      socket = ws;
      resolve(ws);
    });
    ws.addEventListener("message", (event) => {
      dispatch(event.data);
    });
    ws.addEventListener("close", () => {
      socket = null;
      socketReady = null;
    });
    ws.addEventListener("error", () => {
      socket = null;
      socketReady = null;
    });
  });
  return socketReady;
}

/**
 * Dispatch inbound payloads to listeners in a trauma-aware way (no throw).
 */
function dispatch(raw: unknown): void {
  if (typeof raw !== "string") {
    return;
  }
  try {
    const message = JSON.parse(raw) as { event?: string; payload?: unknown };
    if (!message || typeof message.event !== "string") {
      return;
    }
    const set = listeners.get(message.event);
    if (!set || set.size === 0) {
      return;
    }
    set.forEach((listener) => {
      try {
        listener(message.payload);
      } catch (err) {
        // Silence individual handler errors to keep the bus stable.
      }
    });
  } catch (err) {
    // Ignore malformed payloads to avoid cascading failures.
  }
}

/**
 * Close the websocket manually (useful for offline shells).
 */
export function close(): void {
  if (socket) {
    socket.close();
  }
  socket = null;
  socketReady = null;
}
