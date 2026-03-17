/**
 * Sync Queue Utility
 * 
 * Acting as Agent 3 (Sprint 4)
 * Responsible for managing real-time data persistence offline.
 * 
 * Concept:
 * - We wrap all standard mutations (ADD, TOGGLE, REMOVE) in optimistic updates.
 * - Under the hood, this queue traps the intended server calls.
 * - If offline, actions are queued. If online, they are mapped to the network.
 * - When online is restored, the queue is flushed.
 */

export type SyncActionType = 'ADD_SHOPPING_ITEM' | 'TOGGLE_SHOPPING_ITEM' | 'REMOVE_SHOPPING_ITEM' | 'CONVERT_TO_EXPENSE';

export interface SyncAction {
  id: string; // Unique action ID
  type: SyncActionType;
  payload: any;
  timestamp: number;
}

class SyncQueue {
  private queue: SyncAction[] = [];
  private isOnline: boolean = true; // Pretend it's online by default
  private subscribers: Array<(count: number) => void> = [];

  /**
   * Listen to queue length changes (useful to show a "Syncing X items..." badge)
   */
  subscribe(callback: (count: number) => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  private notify() {
    this.subscribers.forEach(cb => cb(this.queue.length));
  }

  /**
   * Manually toggle network state for simulation purposes
   */
  setOnlineStatus(status: boolean) {
    this.isOnline = status;
    if (this.isOnline) {
      this.flushQueue();
    }
  }

  getOnlineStatus() {
    return this.isOnline;
  }

  /**
   * Adds an action to the queue and processes it if online.
   */
  enqueue(type: SyncActionType, payload: any) {
    const action: SyncAction = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      payload,
      timestamp: Date.now()
    };
    
    this.queue.push(action);
    this.notify();
    
    // Auto-process if internet is connected
    if (this.isOnline) {
      this.flushQueue();
    }
  }

  /**
   * In a real Firebase app, this would iterate and perform `db.collection().add/update()`.
   * For the Local MVP, we merely simulate a 500ms network delay before resolving.
   */
  private async flushQueue() {
    if (this.queue.length === 0) return;

    console.log(`[SyncQueue] Flushing ${this.queue.length} actions to the server...`);

    // Create a copy of the queue to process
    const pendingActions = [...this.queue];
    
    for (const action of pendingActions) {
      try {
        // Simulate Network Latency
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Pseudo-Server Resolution
        console.log(`[Backend] Resolved action: ${action.type}`);
        
        // Remove from queue upon success
        this.queue = this.queue.filter(a => a.id !== action.id);
        this.notify();
      } catch (e) {
        console.error(`[Backend] Failed to resolve action: ${action.type}`, e);
        // Break out of loop on failure; wait for connection to resume
        this.isOnline = false;
        break; 
      }
    }
  }
}

export const syncQueue = new SyncQueue();
