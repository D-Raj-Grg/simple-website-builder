import { create } from 'zustand';

/**
 * History actions for different operations
 * @readonly
 * @enum {string}
 */
export const HISTORY_ACTIONS = {
  ADD_BLOCK: 'ADD_BLOCK',
  UPDATE_BLOCK: 'UPDATE_BLOCK',
  DELETE_BLOCK: 'DELETE_BLOCK',
  REORDER_BLOCKS: 'REORDER_BLOCKS',
  UPDATE_PAGE_SETTINGS: 'UPDATE_PAGE_SETTINGS',
  DUPLICATE_BLOCK: 'DUPLICATE_BLOCK',
  BULK_UPDATE: 'BULK_UPDATE'
};

/** Maximum number of history entries to maintain */
const MAX_HISTORY_SIZE = 50;

/**
 * Zustand store for managing undo/redo functionality
 * Maintains a history of page states with action metadata
 * @typedef {Object} HistoryEntry
 * @property {string} id - Unique identifier for history entry
 * @property {string} timestamp - ISO timestamp when action occurred
 * @property {Object} pageState - Deep clone of page state
 * @property {string} action - Action type from HISTORY_ACTIONS
 * @property {Object} metadata - Additional action metadata
 */
const useHistoryStore = create((set, get) => ({
  // History state
  history: [], // Array of page states
  currentIndex: -1, // Current position in history
  isUndoing: false,
  isRedoing: false,

  // Action to save a new state to history
  /**
   * Save a new page state to history
   * @param {Object} pageState - Complete page state to save
   * @param {string|null} action - Action type from HISTORY_ACTIONS
   * @param {Object} metadata - Additional metadata about the action
   */
  saveToHistory: (pageState, action = null, metadata = {}) => {
    const { history, currentIndex, isUndoing, isRedoing } = get();
    
    // Don't save to history if we're currently undoing/redoing
    if (isUndoing || isRedoing) {
      return;
    }

    const newHistoryEntry = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      pageState: JSON.parse(JSON.stringify(pageState)), // Deep clone
      action,
      metadata: {
        description: getActionDescription(action, metadata),
        ...metadata
      }
    };

    // Remove any history after current index (when branching from middle)
    const newHistory = history.slice(0, currentIndex + 1);
    
    // Add new entry
    newHistory.push(newHistoryEntry);
    
    // Limit history size
    const trimmedHistory = newHistory.slice(-MAX_HISTORY_SIZE);
    const newIndex = trimmedHistory.length - 1;

    set({
      history: trimmedHistory,
      currentIndex: newIndex
    });
  },

  // Undo functionality
  /**
   * Undo the last action
   * @returns {Object|null} Previous state data or null if cannot undo
   */
  undo: () => {
    const { history, currentIndex } = get();
    
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      const previousState = history[newIndex];
      
      set({
        currentIndex: newIndex,
        isUndoing: true
      });

      // Return the previous state to be applied by the editor store
      return {
        pageState: previousState.pageState,
        action: previousState.action,
        callback: () => set({ isUndoing: false })
      };
    }
    
    return null;
  },

  // Redo functionality
  /**
   * Redo the next action
   * @returns {Object|null} Next state data or null if cannot redo
   */
  redo: () => {
    const { history, currentIndex } = get();
    
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1;
      const nextState = history[newIndex];
      
      set({
        currentIndex: newIndex,
        isRedoing: true
      });

      // Return the next state to be applied by the editor store
      return {
        pageState: nextState.pageState,
        action: nextState.action,
        callback: () => set({ isRedoing: false })
      };
    }
    
    return null;
  },

  // Get current history entry
  /**
   * Get the current history entry
   * @returns {HistoryEntry|null} Current history entry or null
   */
  getCurrentHistoryEntry: () => {
    const { history, currentIndex } = get();
    return currentIndex >= 0 ? history[currentIndex] : null;
  },

  // Check if undo is available
  /**
   * Check if undo operation is available
   * @returns {boolean} Whether undo can be performed
   */
  canUndo: () => {
    const { currentIndex } = get();
    return currentIndex > 0;
  },

  // Check if redo is available
  /**
   * Check if redo operation is available
   * @returns {boolean} Whether redo can be performed
   */
  canRedo: () => {
    const { history, currentIndex } = get();
    return currentIndex < history.length - 1;
  },

  // Get history for visualization
  getHistoryList: () => {
    const { history } = get();
    return history.map((entry, index) => ({
      id: entry.id,
      timestamp: entry.timestamp,
      description: entry.metadata.description,
      action: entry.action,
      index
    }));
  },

  // Jump to specific history entry
  jumpToHistory: (targetIndex) => {
    const { history } = get();
    
    if (targetIndex >= 0 && targetIndex < history.length) {
      const targetState = history[targetIndex];
      
      set({
        currentIndex: targetIndex,
        isUndoing: true // Use undo flag to prevent new history entry
      });

      return {
        pageState: targetState.pageState,
        action: targetState.action,
        callback: () => set({ isUndoing: false })
      };
    }
    
    return null;
  },

  // Clear all history
  clearHistory: () => {
    set({
      history: [],
      currentIndex: -1,
      isUndoing: false,
      isRedoing: false
    });
  },

  // Initialize history with initial state
  initializeHistory: (initialPageState) => {
    set({
      history: [{
        id: Date.now(),
        timestamp: new Date().toISOString(),
        pageState: JSON.parse(JSON.stringify(initialPageState)),
        action: 'INITIALIZE',
        metadata: { description: 'Initial state' }
      }],
      currentIndex: 0,
      isUndoing: false,
      isRedoing: false
    });
  },

  // Get history statistics
  getHistoryStats: () => {
    const { history, currentIndex } = get();
    return {
      totalEntries: history.length,
      currentPosition: currentIndex + 1,
      canUndo: currentIndex > 0,
      canRedo: currentIndex < history.length - 1,
      memoryUsage: JSON.stringify(history).length // Rough estimate in bytes
    };
  }
}));

// Helper function to generate action descriptions
function getActionDescription(action, metadata = {}) {
  switch (action) {
    case HISTORY_ACTIONS.ADD_BLOCK:
      return `Added ${metadata.blockType || 'block'}`;
    case HISTORY_ACTIONS.UPDATE_BLOCK:
      return `Updated ${metadata.blockType || 'block'} ${metadata.field ? `(${metadata.field})` : ''}`;
    case HISTORY_ACTIONS.DELETE_BLOCK:
      return `Deleted ${metadata.blockType || 'block'}`;
    case HISTORY_ACTIONS.REORDER_BLOCKS:
      return `Reordered blocks`;
    case HISTORY_ACTIONS.UPDATE_PAGE_SETTINGS:
      return `Updated page settings`;
    case HISTORY_ACTIONS.DUPLICATE_BLOCK:
      return `Duplicated ${metadata.blockType || 'block'}`;
    case HISTORY_ACTIONS.BULK_UPDATE:
      return `Bulk update (${metadata.count || 0} changes)`;
    default:
      return metadata.description || 'Unknown action';
  }
}

export default useHistoryStore;