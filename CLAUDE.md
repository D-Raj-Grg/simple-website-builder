# CLAUDE.md - Simple Website Builder Project Guide

## Project Overview
You are working on **QuickPage Builder**, a lightweight website builder for store integration. This tool enables store owners to create professional homepages in under 15 minutes without technical expertise.

## Core Principles
- **Simplicity First**: Maximum 3 clicks to any feature
- **Performance Focused**: Bundle size < 200KB, page load < 2s
- **Constrained Flexibility**: Limited but meaningful customization options
- **Mobile-First**: All blocks responsive by default

## Tech Stack
```javascript
// Framework & Core
- Next.js 15+ (App Router)
- JavaScript/JSX (NO TypeScript)
- Tailwind CSS
- Zustand for state management

// Libraries
- @dnd-kit/sortable (drag & drop)
- Lucide React (icons)
- Shadcn
- Magic UI
- No other heavy dependencies
```

## Project Structure
```
/app
  /editor
    /components
      /blocks        # Block components
      /editors       # Block editor panels
    /store          # Zustand store
    page.jsx        # Main editor page
  /preview
    page.jsx        # Preview mode
  /api
    /pages          # Page CRUD operations
    /products       # Product fetching
    /export         # Export functionality

/components
  /blocks           # Reusable block components
    HeroBlock.jsx
    FeaturesBlock.jsx
    TestimonialsBlock.jsx
    PricingBlock.jsx
    LogoCloudBlock.jsx
    AboutBlock.jsx
    GalleryBlock.jsx
    ProductGridBlock.jsx
    CTABlock.jsx
    ContactFormBlock.jsx
    TeamBlock.jsx

/lib
  /blockRegistry.js  # Block configuration
  /constants.js      # App constants
  /utils.js         # Helper functions

/styles
  globals.css       # Tailwind imports
```

## Available Blocks & Their Options

### Block Registry Pattern
```jsx
// Every block MUST follow this structure
const blockRegistry = {
  [blockType]: {
    id: String,
    type: String,
    render: (props) => JSX.Element,
    editor: (props) => JSX.Element,
    defaultSettings: Object,
    validate: (content) => Boolean
  }
}
```

### Block Specifications
| Block | Settings (Max 3-4) | Content Fields |
|-------|-------------------|----------------|
| **hero** | imagePosition (left/center/right), textSize (S/M/L/XL), alignment | heading, subheading, image, ctaButton |
| **features** | columns (2/3/4), iconStyle (outlined/filled), alignment | items[] with icon, title, description |
| **testimonials** | layout (carousel/grid), maxItems (1-6), bgStyle | quotes[] with text, author, role, avatar |
| **pricing** | planCount (2-4), highlightPlan, currency | plans[] with name, price, features[], cta |
| **logoCloud** | perRow (4-6), grayscale, animation (static/scroll) | logos[], heading |
| **about** | imagePosition (left/right), columns (1/2), bgColor | heading, content, image |
| **gallery** | layout (2x2/3x3/masonry), spacing, lightbox | images[] with url, caption |
| **productGrid** | columns (2/3/4), showPrice, cardStyle | API fetch params: category, limit, sortBy |
| **cta** | background (color/gradient/image), buttonStyle, layout | heading, description, buttons[] |
| **contactForm** | fields[], layout (single/two-col), showMap | formFields, submitEndpoint, mapCoords |
| **team** | columns (2/3/4), cardStyle, showSocial | members[] with photo, name, role, bio |

## State Management (Zustand)
```jsx
// Main editor store structure
const useEditorStore = create((set) => ({
  // State
  blocks: [],
  selectedBlock: null,
  isDragging: false,
  hasUnsavedChanges: false,
  currentLanguage: 'en',
  
  // Actions
  addBlock: (blockType) => {},
  updateBlock: (blockId, updates) => {},
  removeBlock: (blockId) => {},
  reorderBlocks: (startIndex, endIndex) => {},
  selectBlock: (blockId) => {},
  setLanguage: (lang) => {},
  saveChanges: async () => {},
  loadPage: async (pageId) => {}
}));
```

## Data Structure
```javascript
// Page data structure
{
  "page": {
    "id": "uuid",
    "title": "Homepage",
    "defaultLanguage": "en",
    "languages": ["en", "es", "fr", "ar"],
    "blocks": [
      {
        "id": "block-uuid",
        "type": "hero|features|testimonials|...",
        "order": 0,
        "settings": {
          // Block-specific settings (same across languages)
        },
        "content": {
          "en": { /* English content */ },
          "es": { /* Spanish content */ },
          "ar": { /* Arabic content */ }
        }
      }
    ],
    "globalSettings": {
      "primaryColor": "#hex",
      "font": "system|serif|sans",
      "spacing": "compact|comfortable|spacious"
    }
  }
}
```

## Product Integration
```jsx
// Products are fetched from store API
// Endpoint: /api/products

// Product Grid Block
const useProducts = ({ category, limit, sortBy }) => {
  // Fetches from store API
  // Returns: products array
};

// Single Product Block  
const useProduct = (productId) => {
  // Fetches single product
  // Returns: product object with name, price, image, description, inventory
};
```

## Multilingual Support
- Content stored per language in block.content[lang]
- Settings remain consistent across languages
- RTL languages (Arabic, Hebrew) auto-adjust layout
- Language switcher in editor header
- Each language saves independently

## Component Guidelines

### Block Component Template
```jsx
const [BlockName]Block = ({ content, settings, language = 'en' }) => {
  // Get localized content
  const localContent = content[language] || content['en'];
  
  // Destructure settings
  const { setting1, setting2 } = settings;
  
  // Render block
  return (
    <section className={`block-${blockName} ${setting1}`}>
      {/* Block content */}
    </section>
  );
};
```

### Editor Component Template
```jsx
const [BlockName]Editor = ({ block, onUpdate }) => {
  const handleSettingChange = (key, value) => {
    onUpdate(block.id, {
      settings: { ...block.settings, [key]: value }
    });
  };
  
  const handleContentChange = (key, value) => {
    onUpdate(block.id, {
      content: { ...block.content, [key]: value }
    });
  };
  
  return (
    <div className="editor-panel">
      {/* Setting controls */}
      {/* Content inputs */}
    </div>
  );
};
```

## Performance Requirements
- Initial JS bundle: < 100KB
- Total CSS: < 50KB  
- Time to Interactive: < 3s
- Lighthouse score: > 90
- All images auto-optimized (WebP)
- Lazy loading for below-fold content

## Coding Standards

### DO's
- Use semantic HTML elements
- Keep components under 150 lines
- Use Tailwind utility classes
- Implement proper loading states
- Add alt text to all images
- Use const for all functions
- Validate content before saving
- Handle API errors gracefully
- Mobile-first responsive design
- Use JSX, not TypeScript

### DON'Ts
- Don't add TypeScript types
- Don't create custom CSS files
- Don't add complex animations
- Don't exceed 3-4 settings per block
- Don't allow custom code injection
- Don't add dependencies without approval
- Don't create deeply nested components
- Don't forget accessibility (a11y)

## API Endpoints
```javascript
// Pages
GET    /api/pages          // List all pages
GET    /api/pages/:id      // Get single page
POST   /api/pages          // Create page
PUT    /api/pages/:id      // Update page
DELETE /api/pages/:id      // Delete page

// Products (Store Integration)
GET    /api/products       // List products (query: category, limit, sort)
GET    /api/products/:id   // Get single product

// Export
POST   /api/export/html    // Export as HTML
POST   /api/export/nextjs  // Export as Next.js components
```

## Editor Features Checklist
- [x] Drag & drop blocks
- [x] Inline text editing
- [x] Image upload with optimization
- [x] Mobile/Desktop preview toggle
- [x] Undo/Redo (Ctrl+Z/Ctrl+Y)
- [x] Auto-save every 30 seconds
- [x] One-click publish
- [x] Duplicate block
- [x] Delete block confirmation
- [x] Language switcher

## Current Implementations (v1.0 Complete)

### Completed Features
- ✅ **HeroBlock Enhancement**: Full granular control system implemented
  - Advanced settings panel with Components/Layout/Style tabs
  - Individual styling for heading, subheading, button, and image
  - Inline click-to-edit functionality with visual feedback
  - Enhanced control components (FontSizeSelector, ButtonStyleSelector, etc.)
  - Dynamic CSS generation with helper functions
  - Multilingual content support with proper state updates

### Current Project Structure Updates
```
/components/editor/controls/
  - FontSizeSelector.jsx     # Preset + custom font sizes with live preview
  - FontWeightSelector.jsx   # Font weight selection with visual samples
  - ButtonStyleSelector.jsx  # Comprehensive button styling controls
  - AlignmentSelector.jsx    # Text and layout alignment options
  - SpacingSelector.jsx      # Padding, margin controls with indicators
  - GradientColorPicker.jsx  # Advanced color and gradient selection
  - ColorPicker.jsx          # Basic color picker with hex input
  - ImageUpload.jsx          # Image management with optimization
  - index.js                 # Centralized control exports
```

### Enhanced Settings Panel
- **Components Tab**: Individual component styling with accordion sections
- **Layout Tab**: Overall block layout and positioning controls
- **Style Tab**: Visual appearance and background customization
- Real-time preview updates and visual feedback

### Performance Achievements
- Bundle size maintained under 200KB target
- Granular controls load efficiently without performance impact
- Dynamic CSS classes generated with optimal patterns
- State updates optimized to prevent unnecessary re-renders

## Upcoming Enhancements (v1.1 Roadmap)

### Enhanced Block System - Version 1.1
**Objective**: Extend the advanced granular control system from HeroBlock to all 11 blocks, creating a consistent, professional-grade editing experience across the entire platform.

#### Phase 1: Enhanced Control Library Expansion
**New Control Components to Create:**
```
/components/editor/controls/
  - IconStyleSelector.jsx    # Icon selection, styling, and color customization
  - LayoutSelector.jsx       # Grid layouts and positioning controls  
  - BackgroundSelector.jsx   # Section backgrounds, overlays, and effects
  - BorderRadiusSelector.jsx # Corner radius controls for images and cards
  - ShadowSelector.jsx       # Elevation and shadow effects
  - AnimationSelector.jsx    # Transitions and micro-interactions
```

#### Phase 2: Block Enhancement Implementation
**Priority Order & Timeline (10-15 days):**

1. **FeaturesBlock** (Days 1-2)
   - Enhanced icon styling with IconStyleSelector
   - Individual feature item text controls
   - Grid layout and alignment options
   - Hover effects and animations

2. **TestimonialsBlock** (Days 3-4)
   - Quote text styling (font, color, alignment)
   - Author information controls (name, role, avatar)
   - Rating display customization
   - Carousel vs grid layout enhancements

3. **CTABlock** (Days 5-6)
   - Multiple button styling options
   - Advanced background controls (gradients, images, overlays)
   - Text hierarchy controls
   - Call-to-action positioning

4. **PricingBlock** (Days 7-8)
   - Plan card styling and customization
   - Highlight and featured plan controls
   - Price display formatting
   - Feature list styling

5. **ContactFormBlock** (Days 9-10)
   - Field styling and validation display
   - Form layout options (single/multi-column)
   - Submit button customization
   - Success/error message styling

6. **ProductGridBlock** (Days 11-12)
   - Product card design controls
   - Grid layout and spacing options
   - Price and badge styling
   - Hover effects and interactions

7. **AboutBlock & Others** (Days 13-15)
   - Text section styling controls
   - Image positioning and effects
   - Logo cloud animation options
   - Gallery layout enhancements
   - Team member card styling

#### Phase 3: Settings Panel Integration
**Enhanced SettingsPanel.js Updates:**
- Add conditional rendering for all 11 block types
- Block-specific accordion sections for each component
- Proper state management for nested settings
- Visual feedback and real-time updates

#### Phase 4: Block Registry Modernization
**Comprehensive Default Settings:**
```javascript
const enhancedBlockDefaults = {
  [blockType]: {
    settings: {
      // Layout controls
      alignment: 'center',
      spacing: 'comfortable', 
      bgColor: 'white',
      
      // Component-specific granular controls
      headingSize: 'L',
      headingWeight: 'bold',
      headingColor: '#1F2937',
      headingAlignment: 'center',
      
      // Advanced styling options
      borderRadius: 'rounded',
      shadow: 'none',
      animation: 'none',
      
      // Block-specific settings
      // ...
    },
    content: {
      // Enhanced multi-language structure
    }
  }
};
```

#### Enhanced Block Architecture Pattern
**Standardized Implementation:**
```jsx
const EnhancedBlock = memo(function EnhancedBlock({ content, settings, isEditing, blockId }) {
  const [isEditingText, setIsEditingText] = useState(null);
  const { updateBlock, currentLanguage } = useEditorStore();

  // Enhanced settings with granular controls
  const {
    // Layout settings
    alignment, spacing, bgColor,
    // Component-specific settings
    headingSize, headingWeight, headingColor, headingAlignment,
    // Advanced styling
    borderRadius, shadow, animation
  } = settings;

  // Dynamic CSS helper functions
  const getComponentStyles = (component, settings) => { /* ... */ };
  
  // Enhanced content management
  const handleContentChange = (key, value) => { /* ... */ };
  const handleInlineEdit = (field, value) => { /* ... */ };

  return (
    <section className={`${getSpacingClass(spacing)}`}>
      {/* Enhanced inline editing */}
      {/* Granular component controls */}
      {/* Visual feedback system */}
    </section>
  );
});
```

#### Expected Outcomes
- **Consistent User Experience**: All 11 blocks will have professional-grade controls
- **Enhanced Flexibility**: Users can customize every visual aspect
- **Better Performance**: Optimized state management and rendering
- **Improved Accessibility**: WCAG compliant enhanced controls
- **Developer Efficiency**: Standardized patterns across all blocks

#### Performance Targets (Maintained)
- Bundle size: < 200KB (including all enhanced controls)
- Time to Interactive: < 3s
- Lighthouse Score: > 90
- Memory usage optimization for complex settings

#### Testing Strategy
- Comprehensive block testing in editor mode
- Cross-browser compatibility verification
- Mobile responsiveness testing
- Performance impact analysis
- Accessibility compliance audit

## Testing Checklist
- [ ] All blocks render correctly
- [ ] Drag & drop works smoothly
- [ ] Settings update in real-time
- [ ] Mobile preview accurate
- [ ] Page saves successfully
- [ ] Product API integration works
- [ ] Multilingual content switches properly
- [ ] Export functions work
- [ ] Performance metrics met
- [ ] Accessibility standards met

## Common Issues & Solutions

### Issue: Block not updating
```jsx
// Ensure proper state update
onUpdate(block.id, {
  ...block,
  settings: { ...block.settings, [key]: value }
});
```

### Issue: Drag & drop lag
```jsx
// Use React.memo for block components
const BlockComponent = React.memo(({ content, settings }) => {
  // Component code
});
```

### Issue: Image optimization
```jsx
// Use Next.js Image component
import Image from 'next/image';
<Image src={url} alt={alt} width={800} height={600} loading="lazy" />
```

## Quick Command Reference
```bash
# Development
pnpm run dev           # Start dev server
pnpm run build        # Build for production
pnpm run preview      # Preview production build

# Testing
pnpm run test         # Run tests
pnpm run lighthouse   # Check performance

# Database
pnpm run db:migrate   # Run migrations
pnpm run db:seed      # Seed sample data
```

## Important Notes
1. **No TypeScript** - Use pure JavaScript/JSX
2. **Keep it simple** - Reject feature requests that add complexity
3. **Performance first** - Every feature must meet performance budget
4. **Mobile matters** - Test on mobile before desktop
5. **Free forever** - No premium features or paywalls

## Contact for Questions
- Product decisions: Refer to PRD section 15
- Technical architecture: Follow this guide
- New features: Must align with "simplicity first" principle

---
*Last Updated: September 2025*
*Version: 1.0.0 (HeroBlock Enhanced) → 1.1.0 (All Blocks Enhancement Plan)*