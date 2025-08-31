'use client';

import { useEffect } from 'react';
import useEditorStore from '@/lib/store/editorStore';
import { toast } from 'sonner';

export default function KeyboardShortcuts() {
  const { 
    undo, 
    redo, 
    canUndo, 
    canRedo, 
    saveChanges, 
    selectedBlockId, 
    removeBlock, 
    duplicateBlock, 
    clearSelection 
  } = useEditorStore();

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if user is typing in an input/textarea/contenteditable
      const activeElement = document.activeElement;
      const isTyping = 
        activeElement?.tagName === 'INPUT' ||
        activeElement?.tagName === 'TEXTAREA' ||
        activeElement?.contentEditable === 'true';

      // Get modifier keys
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? event.metaKey : event.ctrlKey;

      // Handle shortcuts
      switch (event.key.toLowerCase()) {
        case 'z':
          if (cmdOrCtrl && !event.shiftKey) {
            event.preventDefault();
            if (canUndo()) {
              const success = undo();
              if (success) {
                toast.success('Undone');
              }
            } else {
              toast.info('Nothing to undo');
            }
          }
          break;

        case 'y':
          if (cmdOrCtrl || (cmdOrCtrl && event.shiftKey)) {
            event.preventDefault();
            if (canRedo()) {
              const success = redo();
              if (success) {
                toast.success('Redone');
              }
            } else {
              toast.info('Nothing to redo');
            }
          }
          break;

        case 'z':
          // Cmd/Ctrl + Shift + Z for redo (alternative)
          if (cmdOrCtrl && event.shiftKey) {
            event.preventDefault();
            if (canRedo()) {
              const success = redo();
              if (success) {
                toast.success('Redone');
              }
            } else {
              toast.info('Nothing to redo');
            }
          }
          break;

        case 's':
          if (cmdOrCtrl) {
            event.preventDefault();
            saveChanges().then(result => {
              if (result.success) {
                toast.success('Page saved');
              } else {
                toast.error('Failed to save');
              }
            });
          }
          break;

        case 'd':
          if (cmdOrCtrl && selectedBlockId) {
            event.preventDefault();
            duplicateBlock(selectedBlockId);
            toast.success('Block duplicated');
          }
          break;

        case 'delete':
        case 'backspace':
          if (!isTyping && selectedBlockId) {
            event.preventDefault();
            // Show confirmation for delete
            if (window.confirm('Are you sure you want to delete this block?')) {
              removeBlock(selectedBlockId);
              toast.success('Block deleted');
            }
          }
          break;

        case 'escape':
          if (!isTyping && selectedBlockId) {
            event.preventDefault();
            clearSelection();
            toast.info('Selection cleared');
          }
          break;

        case '/':
          if (!isTyping && !event.shiftKey) {
            event.preventDefault();
            // Show shortcuts help modal
            showShortcutsHelp();
          }
          break;

        default:
          break;
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [undo, redo, canUndo, canRedo, saveChanges, selectedBlockId, removeBlock, duplicateBlock, clearSelection]);

  return null; // This component doesn't render anything
}

// Helper function to show shortcuts help
function showShortcutsHelp() {
  const shortcuts = [
    { key: 'Cmd/Ctrl + Z', action: 'Undo' },
    { key: 'Cmd/Ctrl + Y', action: 'Redo' },
    { key: 'Cmd/Ctrl + Shift + Z', action: 'Redo (alternative)' },
    { key: 'Cmd/Ctrl + S', action: 'Save' },
    { key: 'Cmd/Ctrl + D', action: 'Duplicate selected block' },
    { key: 'Delete/Backspace', action: 'Delete selected block' },
    { key: 'Escape', action: 'Clear selection' },
    { key: '/', action: 'Show this help' }
  ];

  const shortcutsText = shortcuts
    .map(s => `${s.key}: ${s.action}`)
    .join('\n');

  alert(`Keyboard Shortcuts:\n\n${shortcutsText}`);
}

// Export keyboard shortcuts info for other components
export const KEYBOARD_SHORTCUTS = [
  {
    category: 'Editing',
    shortcuts: [
      { key: ['Cmd', 'Z'], description: 'Undo last action' },
      { key: ['Cmd', 'Y'], description: 'Redo last action' },
      { key: ['Cmd', 'S'], description: 'Save page' },
      { key: ['Cmd', 'D'], description: 'Duplicate selected block' }
    ]
  },
  {
    category: 'Selection',
    shortcuts: [
      { key: ['Delete'], description: 'Delete selected block' },
      { key: ['Escape'], description: 'Clear selection' }
    ]
  },
  {
    category: 'Help',
    shortcuts: [
      { key: ['/'], description: 'Show keyboard shortcuts' }
    ]
  }
];