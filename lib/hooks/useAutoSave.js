import { useEffect, useRef, useState, useCallback } from 'react';
import { toast } from 'sonner';

// Auto-save hook with debouncing and conflict resolution
export function useAutoSave(
  data,
  saveFunction,
  options = {}
) {
  const {
    delay = 30000, // 30 seconds default
    enabled = true,
    onSave = () => {},
    onError = () => {},
    showToast = true
  } = options;

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [saveError, setSaveError] = useState(null);
  
  const timeoutRef = useRef(null);
  const lastDataRef = useRef(null);
  const saveInProgressRef = useRef(false);

  // Debounced save function
  const debouncedSave = useCallback(async () => {
    if (!enabled || saveInProgressRef.current) return;

    // Check if data has actually changed
    const currentDataString = JSON.stringify(data);
    if (currentDataString === lastDataRef.current) return;

    try {
      saveInProgressRef.current = true;
      setIsSaving(true);
      setSaveError(null);

      const result = await saveFunction(data);
      
      if (result.success) {
        setLastSaved(new Date());
        lastDataRef.current = currentDataString;
        
        if (showToast) {
          toast.success('Auto-saved', {
            duration: 2000,
            description: `Saved at ${new Date().toLocaleTimeString()}`
          });
        }
        
        onSave(result);
      } else {
        throw new Error(result.error || 'Save failed');
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
      setSaveError(error.message);
      
      if (showToast) {
        toast.error('Auto-save failed', {
          duration: 4000,
          description: error.message
        });
      }
      
      onError(error);
    } finally {
      setIsSaving(false);
      saveInProgressRef.current = false;
    }
  }, [data, enabled, saveFunction, showToast, onSave, onError]);

  // Set up auto-save timer
  useEffect(() => {
    if (!enabled || !data) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      debouncedSave();
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay, enabled, debouncedSave]);

  // Manual save function
  const save = async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    await debouncedSave();
  };

  // Force save without debouncing
  const forceSave = async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    saveInProgressRef.current = false; // Reset flag
    await debouncedSave();
  };

  return {
    isSaving,
    lastSaved,
    saveError,
    save,
    forceSave
  };
}

// Auto-save indicator component
export function AutoSaveIndicator({ 
  isSaving, 
  lastSaved, 
  saveError, 
  className = "" 
}) {
  if (saveError) {
    return (
      <div className={`flex items-center gap-2 text-red-600 text-sm ${className}`}>
        <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
        Save failed
      </div>
    );
  }

  if (isSaving) {
    return (
      <div className={`flex items-center gap-2 text-blue-600 text-sm ${className}`}>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
        Saving...
      </div>
    );
  }

  if (lastSaved) {
    return (
      <div className={`flex items-center gap-2 text-green-600 text-sm ${className}`}>
        <div className="w-2 h-2 bg-green-600 rounded-full" />
        Saved at {lastSaved.toLocaleTimeString()}
      </div>
    );
  }

  return null;
}

// Storage manager for handling save conflicts
export class SaveManager {
  constructor(storageKey) {
    this.storageKey = storageKey;
    this.saveInProgress = false;
  }

  async save(data) {
    if (this.saveInProgress) {
      throw new Error('Save already in progress');
    }

    try {
      this.saveInProgress = true;
      
      // Add timestamp
      const saveData = {
        ...data,
        lastModified: new Date().toISOString(),
        version: data.version || 1
      };

      // Save to localStorage
      localStorage.setItem(this.storageKey, JSON.stringify(saveData));
      
      return { success: true, data: saveData };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      this.saveInProgress = false;
    }
  }

  async load() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        return { success: true, data: JSON.parse(saved) };
      }
      return { success: false, error: 'No saved data found' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  hasUnsavedChanges(currentData, lastSavedData) {
    const current = JSON.stringify(currentData);
    const saved = JSON.stringify(lastSavedData);
    return current !== saved;
  }

  createBackup(data, suffix = '') {
    const backupKey = `${this.storageKey}_backup_${suffix || Date.now()}`;
    localStorage.setItem(backupKey, JSON.stringify({
      ...data,
      backedUpAt: new Date().toISOString()
    }));
    return backupKey;
  }

  getBackups() {
    const backups = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`${this.storageKey}_backup_`)) {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          backups.push({
            key,
            data,
            timestamp: data.backedUpAt
          });
        } catch (e) {
          console.error('Invalid backup data:', key);
        }
      }
    }
    return backups.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }
}