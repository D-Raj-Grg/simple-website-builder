import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { immer } from 'zustand/middleware/immer';
import useHistoryStore, { HISTORY_ACTIONS } from './historyStore';
import { blockRegistry } from '../blocks/registry';

/**
 * Main Zustand store for QuickPage Builder editor state and actions
 * Uses Immer middleware for immutable state updates and integrates with history store
 * @typedef {Object} EditorState
 * @property {Object} page - Current page data structure
 * @property {string|null} selectedBlockId - ID of currently selected block
 * @property {boolean} isDragging - Whether user is currently dragging blocks
 * @property {string} currentLanguage - Current language code (e.g., 'en', 'es')
 * @property {boolean} hasUnsavedChanges - Whether page has unsaved modifications
 * @property {boolean} isPreviewMode - Whether editor is in preview mode
 */
const useEditorStore = create(
  immer((set, get) => ({
    // Page Data
    page: {
      id: 'draft-' + nanoid(),
      title: 'My Homepage',
      defaultLanguage: 'en',
      languages: ['en'],
      blocks: [],
      globalSettings: {
        primaryColor: '#3B82F6',
        font: 'sans',
        spacing: 'comfortable'
      }
    },

    // Editor State
    selectedBlockId: null,
    isDragging: false,
    currentLanguage: 'en',
    hasUnsavedChanges: false,
    isPreviewMode: false,

    // Actions
    /**
     * Add a new block to the page
     * @param {string} blockType - Type of block to add (e.g., 'hero', 'features')
     * @param {number} position - Position to insert block (-1 for end)
     */
    addBlock: (blockType, position = -1) => {
      set((state) => {
        const registry = blockRegistry[blockType];
        const newBlock = {
          id: nanoid(),
          type: blockType,
          order: position === -1 ? state.page.blocks.length : position,
          settings: registry ? { ...registry.defaultSettings } : {},
          content: {
            en: registry ? { ...registry.defaultContent } : {}
          }
        };
        
        if (position === -1) {
          state.page.blocks.push(newBlock);
        } else {
          state.page.blocks.splice(position, 0, newBlock);
          // Update order for subsequent blocks
          state.page.blocks.forEach((block, index) => {
            block.order = index;
          });
        }
        
        state.hasUnsavedChanges = true;
        state.selectedBlockId = newBlock.id;
      });
      
      // Save to history
      const currentState = get();
      useHistoryStore.getState().saveToHistory(
        currentState.page, 
        HISTORY_ACTIONS.ADD_BLOCK, 
        { blockType, blockId: currentState.selectedBlockId }
      );
    },

    /**
     * Update an existing block's content or settings
     * @param {string} blockId - ID of block to update
     * @param {Object} updates - Object containing fields to update
     */
    updateBlock: (blockId, updates) => {
      const oldState = get();
      const block = oldState.page.blocks.find(b => b.id === blockId);
      
      set((state) => {
        const blockIndex = state.page.blocks.findIndex(block => block.id === blockId);
        if (blockIndex !== -1) {
          Object.assign(state.page.blocks[blockIndex], updates);
          state.hasUnsavedChanges = true;
        }
      });
      
      // Save to history
      const currentState = get();
      useHistoryStore.getState().saveToHistory(
        currentState.page, 
        HISTORY_ACTIONS.UPDATE_BLOCK, 
        { blockType: block?.type, blockId, field: Object.keys(updates)[0] }
      );
    },

    /**
     * Remove a block from the page
     * @param {string} blockId - ID of block to remove
     */
    removeBlock: (blockId) => set((state) => {
      state.page.blocks = state.page.blocks.filter(block => block.id !== blockId);
      // Update order
      state.page.blocks.forEach((block, index) => {
        block.order = index;
      });
      state.hasUnsavedChanges = true;
      if (state.selectedBlockId === blockId) {
        state.selectedBlockId = null;
      }
    }),

    /**
     * Duplicate an existing block
     * @param {string} blockId - ID of block to duplicate
     */
    duplicateBlock: (blockId) => set((state) => {
      const block = state.page.blocks.find(b => b.id === blockId);
      if (block) {
        const duplicatedBlock = {
          ...block,
          id: nanoid(),
          order: block.order + 1
        };
        
        const insertIndex = block.order + 1;
        state.page.blocks.splice(insertIndex, 0, duplicatedBlock);
        
        // Update order for subsequent blocks
        state.page.blocks.forEach((b, index) => {
          b.order = index;
        });
        
        state.hasUnsavedChanges = true;
        state.selectedBlockId = duplicatedBlock.id;
      }
    }),

    /**
     * Reorder blocks by moving from startIndex to endIndex
     * @param {number} startIndex - Current position of block
     * @param {number} endIndex - New position for block
     */
    reorderBlocks: (startIndex, endIndex) => set((state) => {
      const [removed] = state.page.blocks.splice(startIndex, 1);
      state.page.blocks.splice(endIndex, 0, removed);
      
      // Update order
      state.page.blocks.forEach((block, index) => {
        block.order = index;
      });
      
      state.hasUnsavedChanges = true;
    }),

    /**
     * Select a block for editing
     * @param {string} blockId - ID of block to select
     */
    selectBlock: (blockId) => set((state) => {
      state.selectedBlockId = blockId;
    }),

    /**
     * Clear current block selection
     */
    clearSelection: () => set((state) => {
      state.selectedBlockId = null;
    }),

    /**
     * Change the current editing language
     * @param {string} language - Language code (e.g., 'en', 'es', 'fr')
     */
    setLanguage: (language) => set((state) => {
      state.currentLanguage = language;
    }),

    /**
     * Toggle between edit and preview modes
     * @param {boolean} isPreview - Whether to enable preview mode
     */
    setPreviewMode: (isPreview) => set((state) => {
      state.isPreviewMode = isPreview;
      if (isPreview) {
        state.selectedBlockId = null;
      }
    }),

    /**
     * Update global page settings like colors, fonts, spacing
     * @param {Object} settings - Settings object to merge with current settings
     */
    updatePageSettings: (settings) => {
      set((state) => {
        Object.assign(state.page.globalSettings, settings);
        state.hasUnsavedChanges = true;
      });
      
      // Save to history
      const currentState = get();
      useHistoryStore.getState().saveToHistory(
        currentState.page, 
        HISTORY_ACTIONS.UPDATE_PAGE_SETTINGS, 
        { settings: Object.keys(settings) }
      );
    },

    // Undo/Redo functionality
    /**
     * Undo the last action
     * @returns {boolean} Whether undo was successful
     */
    undo: () => {
      const historyResult = useHistoryStore.getState().undo();
      if (historyResult) {
        set((state) => {
          state.page = historyResult.pageState;
          state.hasUnsavedChanges = true;
          // Maintain current selection if the block still exists
          if (state.selectedBlockId && !historyResult.pageState.blocks.find(b => b.id === state.selectedBlockId)) {
            state.selectedBlockId = null;
          }
        });
        historyResult.callback();
        return true;
      }
      return false;
    },

    /**
     * Redo the last undone action
     * @returns {boolean} Whether redo was successful
     */
    redo: () => {
      const historyResult = useHistoryStore.getState().redo();
      if (historyResult) {
        set((state) => {
          state.page = historyResult.pageState;
          state.hasUnsavedChanges = true;
          // Maintain current selection if the block still exists
          if (state.selectedBlockId && !historyResult.pageState.blocks.find(b => b.id === state.selectedBlockId)) {
            state.selectedBlockId = null;
          }
        });
        historyResult.callback();
        return true;
      }
      return false;
    },

    // Check if undo/redo is available
    /**
     * Check if undo is available
     * @returns {boolean} Whether undo can be performed
     */
    canUndo: () => useHistoryStore.getState().canUndo(),
    /**
     * Check if redo is available
     * @returns {boolean} Whether redo can be performed
     */
    canRedo: () => useHistoryStore.getState().canRedo(),

    // Initialize history when page loads
    /**
     * Initialize the history system with current page state
     */
    initializeHistory: () => {
      const currentState = get();
      useHistoryStore.getState().initializeHistory(currentState.page);
    },

    // Save/Load functionality (localStorage for now)
    /**
     * Save current page to localStorage
     * @returns {Promise<{success: boolean, error?: any}>} Save result
     */
    saveChanges: async () => {
      const state = get();
      try {
        localStorage.setItem('quickpage-draft', JSON.stringify(state.page));
        set((draft) => {
          draft.hasUnsavedChanges = false;
        });
        return { success: true };
      } catch (error) {
        console.error('Failed to save:', error);
        return { success: false, error };
      }
    },

    /**
     * Load a page from localStorage
     * @param {string} pageId - ID of page to load (defaults to draft)
     * @returns {Promise<{success: boolean, error?: any}>} Load result
     */
    loadPage: async (pageId = 'quickpage-draft') => {
      try {
        const saved = localStorage.getItem(pageId);
        if (saved) {
          const page = JSON.parse(saved);
          set((state) => {
            state.page = page;
            state.selectedBlockId = null;
            state.hasUnsavedChanges = false;
          });
          
          // Initialize history with loaded page
          const currentState = get();
          useHistoryStore.getState().initializeHistory(currentState.page);
          
          return { success: true };
        }
        
        // Initialize history even if no saved page
        const currentState = get();
        useHistoryStore.getState().initializeHistory(currentState.page);
        
        return { success: false, error: 'No saved page found' };
      } catch (error) {
        console.error('Failed to load:', error);
        return { success: false, error };
      }
    },

    /**
     * Reset page to initial empty state
     */
    resetPage: () => set((state) => {
      state.page = {
        id: 'draft-' + nanoid(),
        title: 'My Homepage',
        defaultLanguage: 'en',
        languages: ['en'],
        blocks: [],
        globalSettings: {
          primaryColor: '#3B82F6',
          font: 'sans',
          spacing: 'comfortable'
        }
      };
      state.selectedBlockId = null;
      state.hasUnsavedChanges = false;
    })
  }))
);

export default useEditorStore;