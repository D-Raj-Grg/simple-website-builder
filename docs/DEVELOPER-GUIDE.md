# QuickPage Builder - Developer Guide

> **Complete technical documentation for developers working with QuickPage Builder**

This guide provides comprehensive information for developers who want to understand, modify, or extend QuickPage Builder.

---

## 🏗️ **Architecture Overview**

### High-Level Architecture

```
┌─────────────────────────────────────────┐
│              Frontend Only               │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │         Presentation Layer       │   │
│  │  ┌─────────────┐ ┌─────────────┐│   │
│  │  │   Editor    │ │   Preview   ││   │
│  │  │     UI      │ │     Mode    ││   │
│  │  └─────────────┘ └─────────────┘│   │
│  └─────────────────────────────────┘   │
│                   │                     │
│                   ▼                     │
│  ┌─────────────────────────────────┐   │
│  │        Business Logic           │   │
│  │  ┌─────────────┐ ┌─────────────┐│   │
│  │  │   Block     │ │   Export    ││   │
│  │  │   System    │ │   Engine    ││   │
│  │  └─────────────┘ └─────────────┘│   │
│  └─────────────────────────────────┘   │
│                   │                     │
│                   ▼                     │
│  ┌─────────────────────────────────┐   │
│  │         State Layer             │   │
│  │         (Zustand)               │   │
│  │  ┌─────────────┐ ┌─────────────┐│   │
│  │  │    Page     │ │   History   ││   │
│  │  │    State    │ │    State    ││   │
│  │  └─────────────┘ └─────────────┘│   │
│  └─────────────────────────────────┘   │
│                   │                     │
│                   ▼                     │
│  ┌─────────────────────────────────┐   │
│  │         Persistence             │   │
│  │      (localStorage)             │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

### Technology Stack

```javascript
{
  "framework": "Next.js 15+ (App Router)",
  "language": "JavaScript/JSX (NO TypeScript)",
  "ui": "shadcn/ui + Tailwind CSS 4+",
  "state": "Zustand 5+ with Immer middleware",
  "persistence": "localStorage with compression",
  "bundler": "Next.js built-in (Turbopack/Webpack)",
  "icons": "Lucide React",
  "dragdrop": "@dnd-kit/sortable + @dnd-kit/core"
}
```

---

## 📁 **Project Structure**

### Directory Organization

```
quickpage-builder/
├── app/                        # Next.js App Router
│   ├── globals.css            # Global styles + Tailwind
│   ├── layout.js              # Root layout component
│   ├── page.js                # Landing page
│   ├── editor/
│   │   └── page.js            # Main editor interface
│   └── preview/
│       └── page.js            # Preview mode page
│
├── components/
│   ├── blocks/                # Block components (11 total)
│   │   ├── HeroBlock.js       # Hero section block
│   │   ├── FeaturesBlock.js   # Features showcase
│   │   ├── CTABlock.js        # Call-to-action
│   │   ├── TestimonialsBlock.js # Customer testimonials
│   │   ├── PricingBlock.js    # Pricing tables
│   │   ├── AboutBlock.js      # About/story section
│   │   ├── TeamBlock.js       # Team member profiles
│   │   ├── GalleryBlock.js    # Image galleries
│   │   ├── ContactFormBlock.js # Contact forms
│   │   ├── LogoCloudBlock.js  # Partner logos
│   │   └── ProductGridBlock.js # Product displays
│   │
│   ├── editor/                # Editor-specific components
│   │   ├── BlockLibrary.js    # Block sidebar
│   │   ├── Canvas.js          # Main editing canvas
│   │   ├── BlockRenderer.js   # Block rendering logic
│   │   ├── SettingsPanel.js   # Right panel settings
│   │   ├── InlineEditor.js    # Inline text editing
│   │   ├── ImageUpload.js     # Image upload component
│   │   ├── ColorPicker.js     # Color selection UI
│   │   ├── KeyboardShortcuts.js # Keyboard event handlers
│   │   └── SortableBlock.js   # Drag & drop wrapper
│   │
│   ├── templates/             # Template system
│   │   └── TemplateGallery.js # Template browser
│   │
│   ├── modals/                # Modal components
│   │   └── ExportModal.js     # Export functionality
│   │
│   ├── testing/               # Testing components
│   │   └── TestRunner.js      # Development test runner
│   │
│   └── ui/                    # shadcn/ui components
│       ├── button.jsx         # Button component
│       ├── card.jsx           # Card component
│       ├── dialog.jsx         # Dialog component
│       ├── input.jsx          # Input component
│       ├── tabs.jsx           # Tabs component
│       └── ... (other shadcn components)
│
├── lib/                       # Core logic and utilities
│   ├── store/                 # Zustand state management
│   │   ├── editorStore.js     # Main editor state
│   │   └── historyStore.js    # Undo/redo state
│   │
│   ├── blocks/                # Block system core
│   │   └── registry.js        # Block definitions & registry
│   │
│   ├── exporters/             # Export functionality
│   │   ├── htmlGenerator.js   # HTML export logic
│   │   └── jsxGenerator.js    # React/JSX export logic
│   │
│   ├── mockData/              # Sample/demo data
│   │   ├── products.js        # Mock product data
│   │   ├── testimonials.js    # Sample testimonials
│   │   └── team.js            # Team member examples
│   │
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAutoSave.js     # Auto-save functionality
│   │   └── useKeyboardShortcuts.js # Keyboard handlers
│   │
│   ├── templates/             # Template definitions
│   │   └── templates.js       # Pre-built page templates
│   │
│   ├── testing/               # Testing utilities
│   │   └── functionalTests.js # Automated test suite
│   │
│   └── utils.js               # Helper utilities + cn()
│
├── public/                    # Static assets
│   └── mock/                  # Sample images
│       ├── heroes/            # Hero section images
│       ├── products/          # Product photos
│       ├── team/              # Team member photos
│       ├── testimonials/      # Customer avatars
│       └── logos/             # Company logos
│
├── docs/                      # Documentation
│   ├── USER-GUIDE.md          # End-user documentation
│   ├── DEVELOPER-GUIDE.md     # This file
│   ├── API-REFERENCE.md       # API documentation
│   └── DEPLOYMENT.md          # Production deployment
│
├── CLAUDE.md                  # Project instructions
├── PLANNING.md                # Frontend planning document
├── TASKS.md                   # Development milestones
├── README.md                  # Main project readme
├── CONTRIBUTING.md            # Contribution guidelines
├── package.json               # Dependencies and scripts
└── next.config.js             # Next.js configuration
```

---

## 🧩 **Block System Architecture**

The block system is the core of QuickPage Builder. Understanding how it works is essential for development.

### Block Registry Pattern

```javascript
// lib/blocks/registry.js
export const blockRegistry = {
  [blockType]: {
    id: String,              // Unique identifier
    name: String,            // Display name
    description: String,     // User-friendly description  
    icon: LucideIcon,       // Icon component
    category: String,        // Organization category
    defaultSettings: {},     // Default configuration
    defaultContent: {},      // Default content (multilingual)
    settingsSchema: {},      // Validation schema
    exportable: Boolean      // Can be exported
  }
};
```

### Block Component Structure

Every block follows this exact pattern:

```javascript
// components/blocks/ExampleBlock.js
import { memo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import useEditorStore from '@/lib/store/editorStore';

const ExampleBlock = memo(function ExampleBlock({ 
  content,     // Localized content object
  settings,    // Block configuration object
  isEditing,   // Boolean: edit vs preview mode
  blockId      // Unique block identifier
}) {
  const { updateBlock, currentLanguage } = useEditorStore();
  
  // Get localized content
  const localContent = content[currentLanguage] || content['en'] || {};
  
  // Destructure settings with defaults
  const { 
    alignment = 'left',
    spacing = 'comfortable',
    backgroundColor = 'transparent'
  } = settings;
  
  // Update handler
  const handleContentUpdate = (key, value) => {
    updateBlock(blockId, {
      content: {
        ...content,
        [currentLanguage]: {
          ...localContent,
          [key]: value
        }
      }
    });
  };
  
  return (
    <section 
      className={cn(
        "example-block",
        `text-${alignment}`,
        `p-${spacing}`,
        backgroundColor !== 'transparent' && `bg-${backgroundColor}`
      )}
      data-block-type="example"
      data-block-id={blockId}
    >
      <Card>
        <CardContent>
          {/* Block content */}
          <h2>{localContent.heading || 'Default Heading'}</h2>
          <p>{localContent.description || 'Default description'}</p>
        </CardContent>
      </Card>
      
      {/* Development helper */}
      {isEditing && process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white text-xs px-2 py-1 rounded">
          Example Block • {blockId}
        </div>
      )}
    </section>
  );
});

export default ExampleBlock;
```

### Block Registration

```javascript
// lib/blocks/registry.js
import ExampleBlock from '@/components/blocks/ExampleBlock';
import { Settings } from 'lucide-react';

export const blockRegistry = {
  example: {
    id: 'example',
    name: 'Example Block',
    description: 'A sample block for demonstration',
    icon: Settings,
    category: 'content',
    component: ExampleBlock,
    defaultSettings: {
      alignment: 'left',
      spacing: 'comfortable',
      backgroundColor: 'transparent'
    },
    defaultContent: {
      en: {
        heading: 'Example Heading',
        description: 'This is an example block description.'
      }
    },
    settingsSchema: {
      alignment: ['left', 'center', 'right'],
      spacing: ['compact', 'comfortable', 'spacious'],
      backgroundColor: 'color'
    },
    exportable: true
  }
};
```

---

## 🗄️ **State Management**

QuickPage Builder uses Zustand for state management with Immer middleware for immutable updates.

### Main Editor Store

```javascript
// lib/store/editorStore.js
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { nanoid } from 'nanoid';

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
    isPreviewMode: false,
    currentLanguage: 'en',
    hasUnsavedChanges: false,
    lastSaved: null,
    
    // Actions
    addBlock: (blockType, position = -1) => set((state) => {
      const blockDef = blockRegistry[blockType];
      if (!blockDef) return;
      
      const newBlock = {
        id: nanoid(),
        type: blockType,
        order: position === -1 ? state.page.blocks.length : position,
        settings: { ...blockDef.defaultSettings },
        content: { ...blockDef.defaultContent }
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
    }),
    
    updateBlock: (blockId, updates) => set((state) => {
      const blockIndex = state.page.blocks.findIndex(b => b.id === blockId);
      if (blockIndex === -1) return;
      
      Object.assign(state.page.blocks[blockIndex], updates);
      state.hasUnsavedChanges = true;
    }),
    
    removeBlock: (blockId) => set((state) => {
      const blockIndex = state.page.blocks.findIndex(b => b.id === blockId);
      if (blockIndex === -1) return;
      
      state.page.blocks.splice(blockIndex, 1);
      // Update order for remaining blocks
      state.page.blocks.forEach((block, index) => {
        block.order = index;
      });
      
      state.hasUnsavedChanges = true;
      if (state.selectedBlockId === blockId) {
        state.selectedBlockId = null;
      }
    }),
    
    duplicateBlock: (blockId) => set((state) => {
      const block = state.page.blocks.find(b => b.id === blockId);
      if (!block) return;
      
      const duplicatedBlock = {
        ...block,
        id: nanoid(),
        order: block.order + 1
      };
      
      state.page.blocks.splice(block.order + 1, 0, duplicatedBlock);
      // Update order for subsequent blocks
      state.page.blocks.forEach((b, index) => {
        b.order = index;
      });
      
      state.hasUnsavedChanges = true;
      state.selectedBlockId = duplicatedBlock.id;
    }),
    
    reorderBlocks: (startIndex, endIndex) => set((state) => {
      const [removed] = state.page.blocks.splice(startIndex, 1);
      state.page.blocks.splice(endIndex, 0, removed);
      
      // Update order property for all blocks
      state.page.blocks.forEach((block, index) => {
        block.order = index;
      });
      
      state.hasUnsavedChanges = true;
    }),
    
    selectBlock: (blockId) => set((state) => {
      state.selectedBlockId = blockId;
    }),
    
    clearSelection: () => set((state) => {
      state.selectedBlockId = null;
    }),
    
    setPreviewMode: (isPreview) => set((state) => {
      state.isPreviewMode = isPreview;
      if (isPreview) {
        state.selectedBlockId = null;
      }
    }),
    
    updatePageSettings: (settings) => set((state) => {
      Object.assign(state.page.globalSettings, settings);
      state.hasUnsavedChanges = true;
    }),
    
    setLanguage: (language) => set((state) => {
      state.currentLanguage = language;
    }),
    
    saveChanges: async () => {
      const state = get();
      try {
        // Save to localStorage (or API in future)
        localStorage.setItem('quickpage-draft', JSON.stringify(state.page));
        
        set((draft) => {
          draft.hasUnsavedChanges = false;
          draft.lastSaved = new Date();
        });
        
        return { success: true };
      } catch (error) {
        console.error('Save failed:', error);
        return { success: false, error };
      }
    },
    
    loadPage: async (pageId = null) => {
      try {
        const saved = localStorage.getItem('quickpage-draft');
        if (saved) {
          const page = JSON.parse(saved);
          set((state) => {
            state.page = page;
            state.hasUnsavedChanges = false;
            state.lastSaved = new Date();
          });
        }
        return { success: true };
      } catch (error) {
        console.error('Load failed:', error);
        return { success: false, error };
      }
    }
  }))
);

export default useEditorStore;
```

### History Store (Undo/Redo)

```javascript
// lib/store/historyStore.js
import { create } from 'zustand';

export const HISTORY_ACTIONS = {
  ADD_BLOCK: 'ADD_BLOCK',
  UPDATE_BLOCK: 'UPDATE_BLOCK',
  REMOVE_BLOCK: 'REMOVE_BLOCK',
  REORDER_BLOCKS: 'REORDER_BLOCKS'
};

const useHistoryStore = create((set, get) => ({
  history: [],
  currentIndex: -1,
  maxHistory: 50,
  
  addAction: (action) => set((state) => {
    const newHistory = state.history.slice(0, state.currentIndex + 1);
    newHistory.push({
      ...action,
      timestamp: Date.now(),
      id: nanoid()
    });
    
    // Limit history size
    if (newHistory.length > state.maxHistory) {
      newHistory.shift();
    }
    
    return {
      history: newHistory,
      currentIndex: newHistory.length - 1
    };
  }),
  
  undo: () => {
    const { history, currentIndex } = get();
    if (currentIndex >= 0) {
      const action = history[currentIndex];
      set({ currentIndex: currentIndex - 1 });
      return action;
    }
    return null;
  },
  
  redo: () => {
    const { history, currentIndex } = get();
    if (currentIndex < history.length - 1) {
      const action = history[currentIndex + 1];
      set({ currentIndex: currentIndex + 1 });
      return action;
    }
    return null;
  },
  
  canUndo: () => get().currentIndex >= 0,
  canRedo: () => get().currentIndex < get().history.length - 1,
  
  clearHistory: () => set({ history: [], currentIndex: -1 })
}));

export default useHistoryStore;
```

---

## 🎨 **UI Components**

### Component Patterns

QuickPage Builder follows consistent patterns for all UI components:

#### Loading States

```jsx
// Loading pattern used throughout the app
{isLoading ? (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
    <span className="ml-2 text-gray-600">Loading...</span>
  </div>
) : (
  <Content />
)}
```

#### Error States

```jsx
// Error handling pattern
{error && (
  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
    <div className="flex items-center">
      <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
      <p className="text-red-800 font-medium">Error</p>
    </div>
    <p className="text-red-700 text-sm mt-1">{error.message}</p>
  </div>
)}
```

#### Empty States

```jsx
// Empty state pattern
{items.length === 0 && (
  <div className="text-center py-12">
    <div className="mx-auto h-12 w-12 text-gray-400">
      <EmptyIcon />
    </div>
    <h3 className="mt-2 text-sm font-medium text-gray-900">No items</h3>
    <p className="mt-1 text-sm text-gray-500">Get started by adding your first item.</p>
    <Button className="mt-6" onClick={onAdd}>
      Add Item
    </Button>
  </div>
)}
```

### Performance Optimizations

All components use React.memo and optimized patterns:

```jsx
import { memo, useCallback, useMemo } from 'react';

const OptimizedComponent = memo(function OptimizedComponent({ 
  data, 
  onUpdate 
}) {
  // Memoize expensive calculations
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      computed: expensiveCalculation(item)
    }));
  }, [data]);
  
  // Memoize event handlers
  const handleUpdate = useCallback((id, changes) => {
    onUpdate(id, changes);
  }, [onUpdate]);
  
  return (
    <div>
      {processedData.map(item => (
        <Item 
          key={item.id}
          data={item}
          onUpdate={handleUpdate}
        />
      ))}
    </div>
  );
});
```

---

## 📤 **Export System**

The export system generates clean, production-ready code from the visual editor.

### HTML Export

```javascript
// lib/exporters/htmlGenerator.js
export function generateHTML(page) {
  const { blocks, globalSettings } = page;
  
  // Generate CSS
  const css = generateCSS(globalSettings);
  
  // Generate HTML structure
  const html = blocks.map(block => {
    const BlockComponent = blockRegistry[block.type]?.component;
    if (!BlockComponent) return '';
    
    return renderBlockToHTML(block);
  }).join('');
  
  return {
    html: createHTMLDocument(html, css),
    css,
    meta: generateMetaTags(page)
  };
}

function createHTMLDocument(content, styles) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.title}</title>
  <style>${styles}</style>
</head>
<body>
  <main class="page-content">
    ${content}
  </main>
</body>
</html>`;
}
```

### React/JSX Export

```javascript
// lib/exporters/jsxGenerator.js
export function generateJSX(page) {
  const { blocks, globalSettings } = page;
  
  // Generate component imports
  const imports = new Set(['React']);
  blocks.forEach(block => {
    const blockDef = blockRegistry[block.type];
    if (blockDef) {
      imports.add(blockDef.name);
    }
  });
  
  // Generate JSX
  const jsx = blocks.map(block => {
    return renderBlockToJSX(block);
  }).join('\\n      ');
  
  return {
    component: `import React from 'react';
${Array.from(imports).map(imp => `import ${imp} from './components/${imp}';`).join('\\n')}
import './HomePage.css';

const HomePage = () => {
  return (
    <main className="homepage">
      ${jsx}
    </main>
  );
};

export default HomePage;`,
    css: generateCSS(globalSettings),
    components: generateBlockComponents(blocks)
  };
}
```

---

## 🧪 **Testing Architecture**

### Built-in Test Suite

QuickPage Builder includes a comprehensive testing system:

```javascript
// lib/testing/functionalTests.js
export class FunctionalTestSuite {
  constructor(editorStore) {
    this.store = editorStore;
    this.results = [];
  }
  
  async runAllTests() {
    const tests = [
      this.testBlockAddition,
      this.testBlockDuplication,
      this.testBlockDeletion,
      this.testBlockReordering,
      this.testStateManagement,
      this.testExportFunctionality,
      this.testUndoRedo
    ];
    
    for (const test of tests) {
      try {
        await test.call(this);
        this.results.push({ 
          name: test.name, 
          status: 'PASSED' 
        });
      } catch (error) {
        this.results.push({ 
          name: test.name, 
          status: 'FAILED', 
          error: error.message 
        });
      }
    }
    
    return {
      total: tests.length,
      passed: this.results.filter(r => r.status === 'PASSED').length,
      failed: this.results.filter(r => r.status === 'FAILED').length,
      results: this.results
    };
  }
  
  async testBlockAddition() {
    const initialCount = this.store.getState().page.blocks.length;
    
    // Add a hero block
    this.store.getState().addBlock('hero');
    
    const newCount = this.store.getState().page.blocks.length;
    if (newCount !== initialCount + 1) {
      throw new Error('Block was not added correctly');
    }
    
    // Verify block properties
    const addedBlock = this.store.getState().page.blocks[newCount - 1];
    if (!addedBlock.id || addedBlock.type !== 'hero') {
      throw new Error('Block properties are incorrect');
    }
  }
  
  // ... more test methods
}
```

### Performance Testing

```javascript
// lib/testing/performanceTests.js
export class PerformanceTestSuite {
  static measureLoadTime() {
    return {
      firstContentfulPaint: performance.getEntriesByType('paint')[0]?.startTime,
      domContentLoaded: performance.getEntriesByType('navigation')[0]?.domContentLoadedEventEnd,
      loadComplete: performance.getEntriesByType('navigation')[0]?.loadEventEnd
    };
  }
  
  static measureMemoryUsage() {
    if ('memory' in performance) {
      return {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      };
    }
    return null;
  }
  
  static measureBundleSize() {
    // This would integrate with webpack-bundle-analyzer
    // or similar tools in a real implementation
    return {
      total: '146KB',
      gzipped: '52KB',
      parsed: '198KB'
    };
  }
}
```

---

## 🔧 **Development Tools**

### Built-in Test Runner

The development build includes a test runner accessible from the editor:

```jsx
// components/testing/TestRunner.js
// Available in development mode only
// Provides real-time testing and debugging
```

### Performance Monitor

```jsx
// Performance monitoring in development
{process.env.NODE_ENV === 'development' && (
  <PerformanceMonitor />
)}
```

### Debug Helpers

```jsx
// Debug information for blocks in development
{isEditing && process.env.NODE_ENV === 'development' && (
  <div className="fixed bottom-4 right-4 bg-blue-600 text-white text-xs px-2 py-1 rounded">
    {block.type} Block • {block.id}
  </div>
)}
```

---

## 🚀 **Performance Optimizations**

### Code Splitting

All blocks are lazy-loaded for optimal bundle size:

```javascript
// components/editor/BlockRenderer.js
import { lazy, Suspense } from 'react';

// Lazy load all blocks
const HeroBlock = lazy(() => import('@/components/blocks/HeroBlock'));
const FeaturesBlock = lazy(() => import('@/components/blocks/FeaturesBlock'));
// ... other blocks

// Render with Suspense
<Suspense 
  fallback={
    <div className="flex items-center justify-center p-8">
      <Loader2 className="h-5 w-5 animate-spin" />
      <span className="ml-2">Loading {block.type}...</span>
    </div>
  }
>
  <BlockComponent {...props} />
</Suspense>
```

### Memoization

All components use React.memo to prevent unnecessary re-renders:

```javascript
const OptimizedBlock = memo(function OptimizedBlock(props) {
  // Component implementation
}, (prevProps, nextProps) => {
  // Custom comparison if needed
  return (
    prevProps.content === nextProps.content &&
    prevProps.settings === nextProps.settings &&
    prevProps.isEditing === nextProps.isEditing
  );
});
```

### Bundle Analysis

Development includes bundle analysis:

```javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // Next.js config
});
```

---

## 🎯 **API Reference**

### Store Actions

```javascript
// Main editor store actions
const {
  // Block Management
  addBlock,        // (type, position?) => void
  updateBlock,     // (id, updates) => void  
  removeBlock,     // (id) => void
  duplicateBlock,  // (id) => void
  reorderBlocks,   // (startIndex, endIndex) => void
  
  // Selection
  selectBlock,     // (id) => void
  clearSelection,  // () => void
  
  // Preview
  setPreviewMode,  // (boolean) => void
  
  // Persistence
  saveChanges,     // () => Promise<{success, error?}>
  loadPage,        // (id?) => Promise<{success, error?}>
  
  // Configuration
  updatePageSettings, // (settings) => void
  setLanguage,        // (lang) => void
} = useEditorStore();
```

### Block Props Interface

```javascript
// Standard props for all block components
interface BlockProps {
  content: {
    [language: string]: {
      [key: string]: any
    }
  },
  settings: {
    [key: string]: any
  },
  isEditing: boolean,
  blockId: string
}
```

### Registry Interface

```javascript
// Block registry entry interface
interface BlockRegistryEntry {
  id: string,
  name: string,
  description: string,
  icon: LucideIcon,
  category: 'layout' | 'content' | 'commerce' | 'social',
  component: ReactComponent,
  defaultSettings: object,
  defaultContent: object,
  settingsSchema: object,
  exportable: boolean
}
```

---

## 🔧 **Development Commands**

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production  
pnpm start            # Start production server
pnpm lint             # Run ESLint

# Bundle Analysis
ANALYZE=true pnpm build    # Analyze bundle size

# Performance Testing
pnpm run lighthouse        # Run Lighthouse audit
```

---

## 📚 **Further Reading**

- [Block Development Guide](BLOCK-DEVELOPMENT.md)
- [State Management Deep Dive](STATE-MANAGEMENT.md)
- [Performance Guidelines](PERFORMANCE.md)
- [Export System Architecture](EXPORT-SYSTEM.md)
- [Testing Strategy](TESTING-STRATEGY.md)

---

*This guide covers the core architecture. For specific implementation details, see the individual component files and their inline documentation.*