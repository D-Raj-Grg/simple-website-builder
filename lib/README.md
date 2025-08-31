# Library Directory

Core utilities, stores, and configurations for QuickPage Builder.

## Structure

```
lib/
├── store/                 # Zustand state management
│   ├── editorStore.js    # Main editor state
│   └── historyStore.js   # Undo/redo functionality
├── blocks/               # Block system configuration
│   └── registry.js       # Block definitions and defaults
├── mockData/            # Sample data for development
├── hooks/               # Custom React hooks
├── utils.js             # Utility functions
└── README.md            # This file
```

## State Management (`store/`)

### `editorStore.js`
Main Zustand store with Immer middleware for immutable updates.

**State Structure:**
```javascript
{
  page: {
    id: string,
    title: string,
    defaultLanguage: string,
    languages: string[],
    blocks: Block[],
    globalSettings: {
      primaryColor: string,
      font: string,
      spacing: string
    }
  },
  selectedBlockId: string | null,
  isDragging: boolean,
  currentLanguage: string,
  hasUnsavedChanges: boolean,
  isPreviewMode: boolean
}
```

**Key Actions:**
- `addBlock(blockType, position)` - Add new block
- `updateBlock(blockId, updates)` - Modify block
- `removeBlock(blockId)` - Delete block  
- `reorderBlocks(startIndex, endIndex)` - Drag & drop
- `selectBlock(blockId)` - Select for editing
- `undo() / redo()` - History navigation
- `saveChanges() / loadPage()` - Persistence

### `historyStore.js`
Manages undo/redo functionality with 50-entry limit.

**Features:**
- Action tracking with metadata
- Deep state cloning for safety
- History branching support
- Memory usage monitoring

## Block System (`blocks/`)

### `registry.js`
Central configuration for all block types.

**Exports:**
- `blockDefaults` - Default settings and content
- `blockRegistry` - Block metadata and configuration
- `createBlock(type, content, settings)` - Factory function
- `getBlocksByCategory()` - Categorized block list
- `validateBlock(block)` - Structure validation

**Block Structure:**
```javascript
{
  id: string,           // Unique identifier
  type: string,         // Block type (hero, features, etc.)
  order: number,        // Position in page
  settings: Object,     // Visual configuration
  content: {            // Multilingual content
    en: Object,
    es: Object,
    // ... other languages
  }
}
```

## Utilities (`utils.js`)

### `cn(...inputs)`
Merges CSS classes with Tailwind conflict resolution.

```javascript
import { cn } from '@/lib/utils';

// Combine classes safely
const className = cn(
  'px-4 py-2',           // Base classes
  'bg-blue-500',         // Background
  {
    'text-white': active, // Conditional
    'opacity-50': disabled
  }
);
```

## Mock Data (`mockData/`)

Sample data for development and testing:

- Block content examples
- Product data for e-commerce blocks
- User testimonials and reviews
- Team member profiles
- Gallery images

## Custom Hooks (`hooks/`)

Reusable React hooks for common patterns:

- `useLocalStorage` - Persistent state
- `useDebounce` - Debounced values
- `useKeyboard` - Keyboard shortcuts
- `useAutoSave` - Automatic saving

## Usage Examples

### Using the Editor Store

```javascript
import useEditorStore from '@/lib/store/editorStore';

function MyComponent() {
  const { 
    page, 
    selectedBlockId, 
    addBlock, 
    updateBlock 
  } = useEditorStore();

  const handleAddHero = () => {
    addBlock('hero');
  };

  const handleUpdateBlock = (updates) => {
    updateBlock(selectedBlockId, updates);
  };

  return (
    <div>
      <button onClick={handleAddHero}>
        Add Hero Block
      </button>
      {/* Component content */}
    </div>
  );
}
```

### Creating Custom Blocks

```javascript
import { createBlock, blockRegistry } from '@/lib/blocks/registry';

// Create block with defaults
const heroBlock = createBlock('hero');

// Create block with custom content
const customHero = createBlock('hero', {
  heading: 'Custom Heading',
  subheading: 'Custom description'
}, {
  textSize: 'XL',
  alignment: 'left'
});
```

### Using Utilities

```javascript
import { cn } from '@/lib/utils';

function Button({ variant, size, className, ...props }) {
  return (
    <button
      className={cn(
        // Base styles
        'inline-flex items-center justify-center rounded-md',
        
        // Variant styles
        {
          'bg-blue-600 text-white': variant === 'primary',
          'bg-gray-200 text-gray-900': variant === 'secondary',
        },
        
        // Size styles  
        {
          'px-3 py-2 text-sm': size === 'sm',
          'px-4 py-2 text-base': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
        },
        
        // Additional classes
        className
      )}
      {...props}
    />
  );
}
```

## Performance Considerations

- **State Selectors**: Use specific selectors to minimize re-renders
- **Immutability**: Immer handles immutable updates efficiently  
- **History Limit**: 50 entries maximum to prevent memory leaks
- **Deep Cloning**: Only when saving to history, not on every update
- **Lazy Loading**: Store actions are lazy-evaluated

## Best Practices

1. **Store Updates**: Always use provided actions, never mutate directly
2. **Block Creation**: Use `createBlock()` helper for consistency
3. **Validation**: Validate blocks before adding to page
4. **Error Handling**: Handle failed operations gracefully
5. **Memory Management**: Clear unused history entries periodically

## TypeScript Support

While the project uses JavaScript, types can be inferred from JSDoc comments:

```javascript
/**
 * @typedef {Object} Block
 * @property {string} id
 * @property {string} type  
 * @property {number} order
 * @property {Object} settings
 * @property {Object.<string, Object>} content
 */
```