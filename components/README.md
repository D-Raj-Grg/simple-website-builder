# Components Directory

This directory contains all React components organized by functionality.

## Structure

```
components/
├── blocks/                 # Block components (11 types)
├── editor/                # Editor UI components
├── ui/                    # shadcn/ui base components
└── README.md              # This file
```

## Block Components (`blocks/`)

Each block component follows the same pattern:

- **Functional**: Uses React.memo for performance
- **Prop Interface**: `{ content, settings, isEditing, blockId }`
- **Multilingual**: Content stored per language
- **Inline Editing**: Direct text editing capability

### Available Blocks

| Component | Purpose | Key Features |
|-----------|---------|-------------|
| `HeroBlock.js` | Page header | CTA, images, responsive text |
| `FeaturesBlock.js` | Feature showcase | Icons, grid layout, descriptions |
| `TestimonialsBlock.js` | Social proof | Reviews, ratings, avatars |
| `PricingBlock.js` | Pricing plans | Tiers, features, CTAs |
| `CTABlock.js` | Call-to-action | Buttons, backgrounds, conversions |
| `AboutBlock.js` | Company info | Text, images, storytelling |
| `TeamBlock.js` | Team profiles | Photos, bios, social links |
| `GalleryBlock.js` | Image showcase | Grids, lightbox, captions |
| `ContactFormBlock.js` | Contact forms | Validation, customizable fields |
| `LogoCloudBlock.js` | Partner logos | Grayscale, animations, credibility |
| `ProductGridBlock.js` | E-commerce | Product display, pricing, CTAs |

## Editor Components (`editor/`)

UI components for the editor interface:

- `BlockLibrary.js` - Draggable block palette
- `Canvas.js` - Main editing canvas 
- `SettingsPanel.js` - Block settings editor
- `Toolbar.js` - Top action bar
- `BlockRenderer.js` - Renders blocks with lazy loading

## UI Components (`ui/`)

Reusable UI components from shadcn/ui:

- Form elements (Button, Input, Textarea, Select)
- Layout components (Card, Dialog, Tabs)
- Feedback components (Toast, Alert)
- Data display (Table, Badge, Progress)

## Usage Examples

### Adding a New Block

```jsx
// 1. Create component in blocks/
const NewBlock = memo(function NewBlock({ content, settings, isEditing, blockId }) {
  const { updateBlock, currentLanguage } = useEditorStore();
  
  const handleContentChange = (key, value) => {
    updateBlock(blockId, {
      content: {
        ...content,
        [currentLanguage]: {
          ...content,
          [key]: value
        }
      }
    });
  };

  return (
    <section className="new-block">
      {/* Block content */}
    </section>
  );
});

// 2. Register in blockRegistry.js
// 3. Add to BlockRenderer.js lazy imports
```

### Using Editor Components

```jsx
import { Canvas } from '@/components/editor/Canvas';
import { BlockLibrary } from '@/components/editor/BlockLibrary';
import { SettingsPanel } from '@/components/editor/SettingsPanel';

function Editor() {
  return (
    <div className="editor-layout">
      <BlockLibrary />
      <Canvas />
      <SettingsPanel />
    </div>
  );
}
```

## Performance Notes

- All block components use `React.memo`
- Editor components are lazy-loaded
- Images use Next.js `Image` component
- Tailwind classes for consistent styling

## Accessibility

- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Focus management

## Code Standards

- Components under 150 lines
- PropTypes or JSDoc documentation
- Error boundaries for robustness
- Loading and error states
- Mobile-first responsive design