# PLANNING.md - QuickPage Builder Frontend Planning

## 🎯 Vision Statement

### Product Vision
**QuickPage Builder** empowers store owners to create stunning, performant homepages in minutes, not hours. We believe that every business deserves a professional web presence without the complexity, cost, or technical barriers of traditional website builders.

### Mission
Transform how small to medium businesses create their online presence by providing the simplest, fastest, and most intuitive homepage builder that seamlessly integrates with existing e-commerce platforms.

### Core Values
1. **Simplicity Over Features** - Every feature must pass the "grandmother test"
2. **Performance is Non-negotiable** - Fast sites win customers
3. **Accessibility for All** - Both for creators and their visitors
4. **Free Forever** - Democratizing web presence for all businesses

### Success Metrics
- **Time to First Publish**: < 15 minutes
- **User Success Rate**: > 80% complete their first page
- **Performance Score**: > 90 on mobile Lighthouse
- **Page Load Time**: < 2 seconds
- **Bundle Size**: < 200KB JavaScript

---

## 🏗️ Frontend Architecture

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────┐
│                   QuickPage Builder                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │                  Editor View                      │  │
│  │  ┌────────────┐ ┌─────────────┐ ┌────────────┐  │  │
│  │  │   Sidebar  │ │   Canvas    │ │  Settings  │  │  │
│  │  │   Blocks   │ │  (Editable) │ │   Panel    │  │  │
│  │  └────────────┘ └─────────────┘ └────────────┘  │  │
│  └──────────────────────────────────────────────────┘  │
│                           │                             │
│                           ▼                             │
│  ┌──────────────────────────────────────────────────┐  │
│  │                 State Layer                       │  │
│  │         (Zustand - Single Source of Truth)       │  │
│  │  ┌────────────┐ ┌─────────────┐ ┌────────────┐  │  │
│  │  │   Blocks   │ │   Settings  │ │    UI      │  │  │
│  │  │   State    │ │    State    │ │   State    │  │  │
│  │  └────────────┘ └─────────────┘ └────────────┘  │  │
│  └──────────────────────────────────────────────────┘  │
│                           │                             │
│                           ▼                             │
│  ┌──────────────────────────────────────────────────┐  │
│  │              Rendering Engine                     │  │
│  │  ┌────────────┐ ┌─────────────┐ ┌────────────┐  │  │
│  │  │   Preview  │ │   Export    │ │  Publish   │  │  │
│  │  │    Mode    │ │  HTML/JSX   │ │   Static   │  │  │
│  │  └────────────┘ └─────────────┘ └────────────┘  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Component Architecture
```
app/
├── editor/
│   ├── EditorShell.jsx        # Main editor container
│   ├── Sidebar.jsx            # Block library panel
│   ├── Canvas.jsx             # Visual editor area
│   ├── SettingsPanel.jsx      # Block settings
│   └── Toolbar.jsx            # Actions (save, preview, etc.)
│
├── blocks/
│   ├── registry.js            # Block definitions
│   ├── [BlockName]/
│   │   ├── Component.jsx      # Display component
│   │   ├── Editor.jsx         # Edit interface
│   │   ├── defaultData.js     # Mock/sample data
│   │   └── settings.js        # Configuration schema
│   └── ...
│
└── preview/
    └── PreviewPage.jsx        # Full page preview
```

### Data Flow (Frontend Only)
```
User Action → Component → Zustand Store → Re-render
     ↓            ↓            ↓             ↓
  Validate    Update      localStorage   Update UI
             Local State   (Persist)
```

---

## 💻 Technology Stack (Frontend Only)

### Core Technologies
```javascript
{
  "framework": "Next.js 14+ (App Router)",
  "language": "JavaScript (ES6+) / JSX",
  "ui": "shadcn/ui components",
  "styling": "Tailwind CSS 3.4+",
  "state": "Zustand 4.5+ with localStorage",
  "persistence": "localStorage / sessionStorage"
}
```

### NPM Dependencies
```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "tailwindcss": "^3.4.0",
    "zustand": "^4.5.0",
    "@dnd-kit/sortable": "^8.0.0",
    "@dnd-kit/core": "^6.1.0",
    "lucide-react": "^0.400.0",
    "nanoid": "^5.0.0",
    "clsx": "^2.1.0",
    "immer": "^10.1.0",
    
    // Required for shadcn/ui components
    "class-variance-authority": "^0.7.0",
    "tailwind-merge": "^2.3.0",
    "@radix-ui/react-accordion": "^1.1.2",
    "@radix-ui/react-alert-dialog": "^1.0.5",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-popover": "^1.0.7",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-separator": "^1.0.3",
    "@radix-ui/react-slider": "^1.1.2",
    "@radix-ui/react-switch": "^1.0.3",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "@radix-ui/react-tooltip": "^1.0.7",
    "sonner": "^1.5.0"
  },
  "devDependencies": {
    "eslint": "^8.57.0",
    "eslint-config-next": "^14.2.0",
    "prettier": "^3.3.0",
    "postcss": "^8.4.40",
    "autoprefixer": "^10.4.20"
  }
}
```

### Browser Support
```
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari 14+, Chrome Mobile)
```

---

## 🛠️ Required Tools & Setup

### Development Environment
```bash
# Node.js & Package Manager
- Node.js: v20.x LTS (required)
- pnpm: v8.x

# Code Editor
- VS Code (recommended) with extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - ES7+ React/Redux/React-Native snippets
  - Auto Rename Tag
  - Path Intellisense

# shadcn/ui Setup
- Run: npx shadcn-ui@latest init
- Select: Next.js, JavaScript (not TypeScript)
- Style: Default
- Base color: Blue
- CSS variables: Yes
```

### shadcn/ui Components to Install
```bash
# Essential UI Components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add popover
npx shadcn-ui@latest add select
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add slider
npx shadcn-ui@latest add switch
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add tooltip
npx shadcn-ui@latest add accordion
npx shadcn-ui@latest add alert-dialog
npx shadcn-ui@latest add sheet
npx shadcn-ui@latest add form
npx shadcn-ui@latest add scroll-area
```

### Development Scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write .",
    "analyze": "ANALYZE=true next build",
    "test:lighthouse": "lighthouse http://localhost:3000 --view"
  }
}
```

### Mock Data Structure
```javascript
// lib/mockData.js
export const mockProducts = [
  {
    id: '1',
    name: 'Premium Headphones',
    price: '$299',
    image: '/mock/product1.jpg',
    description: 'Noise-cancelling wireless headphones',
    inventory: 15
  },
  // ... more products
];

export const mockTestimonials = [
  {
    id: '1',
    text: 'This product changed my life!',
    author: 'Jane Doe',
    role: 'CEO, TechCorp',
    avatar: '/mock/avatar1.jpg',
    rating: 5
  },
  // ... more testimonials
];

export const mockTeamMembers = [
  {
    id: '1',
    name: 'John Smith',
    role: 'Founder & CEO',
    photo: '/mock/team1.jpg',
    bio: 'Passionate about building great products'
  },
  // ... more team members
];
```

---

## 📁 Project Structure (Frontend Focus)

### Directory Organization
```
quickpage-builder/
├── app/
│   ├── editor/
│   │   ├── page.jsx           # Main editor page
│   │   ├── layout.jsx         # Editor layout
│   │   └── components/        # Editor-specific components
│   ├── preview/
│   │   └── page.jsx           # Preview page
│   ├── export/
│   │   └── page.jsx           # Export functionality
│   └── layout.jsx             # Root layout
│
├── components/
│   ├── ui/                    # shadcn/ui components
│   │   ├── button.jsx
│   │   ├── card.jsx
│   │   ├── dialog.jsx
│   │   ├── dropdown-menu.jsx
│   │   ├── input.jsx
│   │   ├── select.jsx
│   │   ├── slider.jsx
│   │   ├── switch.jsx
│   │   ├── tabs.jsx
│   │   ├── toast.jsx
│   │   └── ... (other shadcn components)
│   │
│   ├── blocks/                # Block components
│   │   ├── HeroBlock.jsx
│   │   ├── FeaturesBlock.jsx
│   │   ├── TestimonialsBlock.jsx
│   │   ├── PricingBlock.jsx
│   │   ├── LogoCloudBlock.jsx
│   │   ├── AboutBlock.jsx
│   │   ├── GalleryBlock.jsx
│   │   ├── ProductGridBlock.jsx
│   │   ├── CTABlock.jsx
│   │   ├── ContactFormBlock.jsx
│   │   └── TeamBlock.jsx
│   │
│   └── editor/                # Editor components
│       ├── BlockLibrary.jsx
│       ├── DragHandle.jsx
│       ├── InlineEditor.jsx
│       └── SettingsForm.jsx
│
├── lib/
│   ├── utils.js               # cn() utility for shadcn
│   ├── store/
│   │   ├── editorStore.js     # Main Zustand store
│   │   └── persist.js         # localStorage helpers
│   │
│   ├── blocks/
│   │   ├── registry.js        # Block registry
│   │   └── defaults.js        # Default block data
│   │
│   ├── mockData/              # Mock data for development
│   │   ├── products.js
│   │   ├── testimonials.js
│   │   ├── team.js
│   │   └── images.js
│   │
│   └── hooks/                 # Custom React hooks
│       ├── useAutoSave.js
│       ├── useKeyboardShortcuts.js
│       └── useDragDrop.js
│
├── public/
│   ├── mock/                  # Mock images
│   │   ├── products/
│   │   ├── team/
│   │   ├── testimonials/
│   │   └── hero/
│   └── templates/             # Starter templates
│
└── styles/
    └── globals.css            # Tailwind imports + shadcn theme
```

---

## 🎨 UI/UX Implementation

### Editor Interface
```
┌─────────────────────────────────────────────────────┐
│  Toolbar (using shadcn Sheet for mobile)           │
│  [Button] [Button] [Select▼] [Switch]              │
├──────────┬──────────────────────────┬──────────────┤
│          │                          │              │
│  Blocks  │      Canvas              │  Settings   │
│  (Sheet) │  (ScrollArea)            │  (Tabs)     │
│          │                          │              │
│  Card[]  │  ┌──────────────────┐   │  Tab: Style │
│  Card[]  │  │   Hero Section    │   │  ┌────────┐│
│  Card[]  │  ├──────────────────┤   │  │ Input  ││
│  Card[]  │  │   Features        │   │  │ Select ││
│  ...     │  ├──────────────────┤   │  │ Slider ││
│          │  │   Testimonials    │   │  │ Switch ││
│          │  └──────────────────┘   │  └────────┘│
│          │                          │              │
└──────────┴──────────────────────────┴──────────────┘
```

### shadcn/ui Component Usage
```javascript
// Example: Settings Panel using shadcn components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

const SettingsPanel = ({ block, onUpdate }) => {
  return (
    <Tabs defaultValue="content" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="style">Style</TabsTrigger>
        <TabsTrigger value="advanced">Advanced</TabsTrigger>
      </TabsList>
      
      <TabsContent value="content" className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="heading">Heading</Label>
          <Input 
            id="heading"
            value={block.content.heading}
            onChange={(e) => onUpdate('heading', e.target.value)}
          />
        </div>
      </TabsContent>
      
      <TabsContent value="style" className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="position">Image Position</Label>
          <Select value={block.settings.imagePosition} onValueChange={(value) => onUpdate('imagePosition', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="right">Right</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="spacing">Spacing</Label>
          <Slider 
            id="spacing"
            min={0} 
            max={100} 
            step={10}
            value={[block.settings.spacing]}
            onValueChange={(value) => onUpdate('spacing', value[0])}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            id="fullWidth"
            checked={block.settings.fullWidth}
            onCheckedChange={(checked) => onUpdate('fullWidth', checked)}
          />
          <Label htmlFor="fullWidth">Full Width</Label>
        </div>
      </TabsContent>
    </Tabs>
  );
};

### State Management Structure
```javascript
// lib/store/editorStore.js
const useEditorStore = create((set, get) => ({
  // Page Data
  page: {
    id: 'draft-' + nanoid(),
    title: 'My Homepage',
    blocks: [],
    settings: {
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
  
  // Actions
  addBlock: (blockType) => {
    const newBlock = createBlockFromType(blockType);
    set(state => ({
      page: {
        ...state.page,
        blocks: [...state.page.blocks, newBlock]
      },
      hasUnsavedChanges: true
    }));
  },
  
  updateBlock: (blockId, updates) => {
    set(state => ({
      page: {
        ...state.page,
        blocks: state.page.blocks.map(block =>
          block.id === blockId ? { ...block, ...updates } : block
        )
      },
      hasUnsavedChanges: true
    }));
  },
  
  // ... more actions
}));
```

---

## 🚀 Frontend Development Phases

### Phase 1: Core Editor (2 weeks)
- [x] Project setup with Next.js
- [ ] Basic editor layout
- [ ] Zustand store setup
- [ ] Mock data structure
- [ ] Drag & drop implementation
- [ ] First 3 blocks (Hero, Features, CTA)

### Phase 2: Block Library (2 weeks)
- [ ] Remaining 8 blocks
- [ ] Block settings panels
- [ ] Inline text editing
- [ ] Image upload (local)
- [ ] Color customization

### Phase 3: Preview & Export (1 week)
- [ ] Preview mode
- [ ] Mobile/Desktop toggle
- [ ] Export as HTML
- [ ] Export as JSX components
- [ ] Copy to clipboard

### Phase 4: Polish & UX (1 week)
- [ ] Keyboard shortcuts
- [ ] Undo/Redo
- [ ] Auto-save to localStorage
- [ ] Templates gallery
- [ ] Onboarding tour
- [ ] Performance optimization

---

## 📊 Performance Targets

### Bundle Size Budget
```javascript
{
  "javascript": {
    "initial": "< 100KB",
    "lazy": "< 50KB per route"
  },
  "css": {
    "initial": "< 50KB",
    "unused": "< 10%"
  },
  "images": {
    "format": "WebP with fallback",
    "maxSize": "100KB per image"
  }
}
```

### Performance Metrics
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Cumulative Layout Shift: < 0.1
- Lighthouse Score: > 90

---

## 🎯 MVP Features Checklist

### Essential Features
- [ ] Drag & drop blocks
- [ ] 11 block types
- [ ] Inline text editing
- [ ] Basic customization (3-4 options per block)
- [ ] Mobile/Desktop preview
- [ ] Save to localStorage
- [ ] Load saved pages
- [ ] Export as HTML

### Nice to Have (Post-MVP)
- [ ] Multilingual support
- [ ] Keyboard shortcuts
- [ ] Undo/Redo history
- [ ] Templates library
- [ ] Dark mode
- [ ] Collaboration features

---

## 🧪 Testing Strategy (Frontend)

### Testing Approach
```javascript
// Manual Testing Checklist
- [ ] All blocks render correctly
- [ ] Drag & drop works smoothly
- [ ] Settings update in real-time
- [ ] Preview matches editor
- [ ] Export produces valid HTML
- [ ] Mobile responsive
- [ ] Cross-browser compatibility
- [ ] Accessibility (keyboard nav)
```

### Browser Testing Matrix
| Browser | Version | Desktop | Mobile |
|---------|---------|---------|--------|
| Chrome  | 90+     | ✅      | ✅     |
| Firefox | 88+     | ✅      | ✅     |
| Safari  | 14+     | ✅      | ✅     |
| Edge    | 90+     | ✅      | N/A    |

---

## 🎨 Design System

### Colors
```css
/* Tailwind Config */
{
  primary: 'blue-600',
  secondary: 'gray-600',
  success: 'green-600',
  warning: 'yellow-600',
  error: 'red-600',
  background: 'white',
  surface: 'gray-50',
  text: 'gray-900'
}
```

### Typography
```css
/* Font Sizes */
{
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem'
}
```

### Spacing
```css
/* Spacing Scale */
{
  compact: { gap: '1rem', padding: '1rem' },
  comfortable: { gap: '1.5rem', padding: '1.5rem' },
  spacious: { gap: '2rem', padding: '2rem' }
}
```

---

## 📝 Code Style Guidelines

### Component Template
```jsx
// components/blocks/ExampleBlock.jsx
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const ExampleBlock = ({ content, settings, isEditing }) => {
  const { heading, description, ctaText } = content;
  const { alignment, size } = settings;
  
  return (
    <Card className={cn(
      "block-example border-0 shadow-none",
      alignment === 'center' && "text-center",
      size === 'large' && "py-16"
    )}>
      <CardContent>
        {isEditing ? (
          <InlineEditor value={heading} onChange={updateHeading} />
        ) : (
          <h2 className="text-3xl font-bold">{heading}</h2>
        )}
        <p className="mt-4 text-muted-foreground">{description}</p>
        {ctaText && (
          <Button className="mt-6" size="lg">
            {ctaText}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ExampleBlock;
```

### Using shadcn Toasts
```jsx
// app/editor/page.jsx
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"

export default function EditorPage() {
  const { toast } = useToast();
  
  const handleSave = () => {
    // Save logic
    toast({
      title: "Page Saved",
      description: "Your changes have been saved successfully.",
    });
  };
  
  return (
    <>
      {/* Editor content */}
      <Toaster />
    </>
  );
}
```

### Naming Conventions
- Components: PascalCase (HeroBlock.jsx)
- Functions: camelCase (handleDragEnd)
- Constants: UPPER_SNAKE_CASE (MAX_BLOCKS)
- CSS classes: kebab-case (block-hero)

---

## ✅ Launch Readiness Checklist

### Frontend Complete
- [ ] All 11 blocks implemented
- [ ] Editor fully functional
- [ ] Preview mode works
- [ ] Export functionality tested
- [ ] Performance targets met
- [ ] Browser testing complete
- [ ] Accessibility verified
- [ ] Mock data comprehensive

### Documentation
- [ ] User guide written
- [ ] Block documentation
- [ ] Export format docs
- [ ] Video tutorials created

### Quality Assurance
- [ ] No console errors
- [ ] Smooth animations
- [ ] Responsive design verified
- [ ] Loading states implemented
- [ ] Error boundaries added
- [ ] 404 page designed

---

## 🚦 Success Metrics (Frontend)

### Technical Metrics
- Bundle size < 200KB
- Lighthouse score > 90
- 60fps drag & drop
- < 100ms interaction response

### User Experience Metrics
- Create first page < 5 minutes
- Zero crashes/errors
- Works on all target browsers
- Mobile editing functional

### Feature Completion
- 11/11 blocks working
- Settings panel complete
- Export formats working
- Preview accurate

---

*Document Version: 2.0 (Frontend Focus)*  
*Last Updated: August 2025*  
*Status: Frontend Development*