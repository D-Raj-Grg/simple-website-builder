# Contributing to QuickPage Builder

Thank you for your interest in contributing to QuickPage Builder! We welcome contributions from the community and are grateful for any help you can provide.

## 🎯 **Project Vision**

QuickPage Builder aims to be the **simplest, fastest, and most intuitive** homepage builder for store owners. Every feature must pass the "grandmother test" - if a non-technical person can't use it easily, it doesn't belong in the project.

### Core Principles
- **Simplicity First**: Maximum 3 clicks to any feature
- **Performance Focused**: Bundle size < 200KB, page load < 2s
- **Mobile-First**: All blocks responsive by default
- **Free Forever**: No premium features or paywalls

---

## 🚀 **Getting Started**

### Prerequisites
- Node.js 20+ LTS
- pnpm 8+ (required - we don't use npm/yarn)
- Basic knowledge of React/Next.js
- Familiarity with Tailwind CSS

### Development Setup

```bash
# Fork and clone the repository
git clone https://github.com/your-username/quickpage-builder.git
cd quickpage-builder

# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Open editor in browser
open http://localhost:3000/editor
```

### Project Structure Overview

```
├── app/
│   ├── editor/page.js          # Main editor interface
│   ├── preview/page.js         # Preview mode
│   └── layout.js               # Root layout
├── components/
│   ├── blocks/                 # 11 block components
│   ├── editor/                 # Editor UI components
│   └── ui/                     # shadcn/ui components
├── lib/
│   ├── store/                  # Zustand stores
│   ├── mockData/               # Sample data
│   └── hooks/                  # Custom React hooks
└── docs/                       # Documentation files
```

---

## 📝 **Coding Standards**

We follow strict coding standards to maintain code quality and consistency.

### JavaScript/JSX Standards

```jsx
// ✅ GOOD - Follow these patterns
import { useState, memo } from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ExampleBlock = memo(function ExampleBlock({ content, settings, isEditing }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleClick = () => {
    // Handle click logic
  };
  
  return (
    <div className={cn(
      "p-4 rounded-lg",
      isHovered && "bg-gray-50"
    )}>
      <h2 className="text-xl font-semibold">{content.heading}</h2>
    </div>
  );
});

export default ExampleBlock;
```

### DO's ✅

- **Use JavaScript/JSX** (NO TypeScript)
- **Keep components under 150 lines**
- **Use const for all functions**
- **Use React.memo for performance**
- **Follow Tailwind utility-first approach**
- **Add proper accessibility attributes**
- **Include error handling**
- **Use semantic HTML elements**
- **Add alt text to all images**
- **Implement loading states**

### DON'Ts ❌

- **Don't add TypeScript types**
- **Don't create custom CSS files**
- **Don't add complex animations**
- **Don't exceed 3-4 settings per block**
- **Don't add heavy dependencies**
- **Don't create deeply nested components**
- **Don't use inline styles**
- **Don't forget accessibility**

### Naming Conventions

```javascript
// Components: PascalCase
const HeroBlock = () => {};

// Functions: camelCase  
const handleDragEnd = () => {};

// Constants: UPPER_SNAKE_CASE
const MAX_BLOCKS = 50;

// CSS classes: kebab-case
className="block-hero hero-large"

// Files: kebab-case
hero-block.js
contact-form-editor.js
```

---

## 🧩 **How to Add a New Block**

Adding a new block involves several coordinated changes. Follow this checklist:

### 1. Create Block Component

```jsx
// components/blocks/NewBlock.js
import { memo } from 'react';
import { Card, CardContent } from "@/components/ui/card";

const NewBlock = memo(function NewBlock({ content, settings, isEditing }) {
  const { heading, description } = content;
  const { alignment, spacing } = settings;
  
  return (
    <Card className={`new-block ${alignment}`}>
      <CardContent className={`p-${spacing}`}>
        <h2 className="text-2xl font-bold">{heading}</h2>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
});

export default NewBlock;
```

### 2. Register Block

```javascript
// lib/blocks/registry.js
export const blockRegistry = {
  // ... existing blocks
  newblock: {
    id: 'newblock',
    name: 'New Block',
    description: 'A new block for amazing content',
    icon: NewIcon,
    category: 'content',
    defaultSettings: {
      alignment: 'left',
      spacing: '6'
    },
    defaultContent: {
      en: {
        heading: 'New Block Heading',
        description: 'This is a new block description.'
      }
    }
  }
};
```

### 3. Add to Block Registry

Update the imports in `BlockRenderer.js`:

```javascript
// components/editor/BlockRenderer.js
const NewBlock = lazy(() => import('@/components/blocks/NewBlock'));

const blockComponents = {
  // ... existing blocks
  newblock: NewBlock
};
```

### 4. Create Mock Data (if needed)

```javascript
// lib/mockData/newblock.js
export const mockNewBlockData = [
  {
    id: '1',
    heading: 'Sample Heading',
    description: 'Sample description text'
  }
];
```

### 5. Test Your Block

- [ ] Block renders correctly in editor
- [ ] Block renders correctly in preview
- [ ] Settings panel works
- [ ] Mobile responsive
- [ ] Passes accessibility tests
- [ ] Export functionality works

---

## 🧪 **Testing Guidelines**

### Manual Testing Checklist

Before submitting a PR, test the following:

#### Block Functionality
- [ ] Block adds correctly from sidebar
- [ ] Block edits inline text properly
- [ ] Block settings update in real-time
- [ ] Block duplicates correctly
- [ ] Block deletes correctly
- [ ] Block exports to HTML/JSX properly

#### Responsive Design  
- [ ] Desktop (1440px+) - Full functionality
- [ ] Tablet (768px) - Adapted layout
- [ ] Mobile (375px) - Touch-friendly

#### Cross-browser
- [ ] Chrome (latest)
- [ ] Firefox (latest) 
- [ ] Safari (latest)
- [ ] Edge (latest)

#### Performance
- [ ] Bundle size impact < 5KB
- [ ] No console errors
- [ ] Smooth animations (60fps)
- [ ] Fast interaction response (< 100ms)

### Test Commands

```bash
# Build and check bundle size
pnpm run build

# Run development server
pnpm run dev

# Check for accessibility issues
# (Use browser dev tools)
```

---

## 📦 **Pull Request Process**

### 1. Before You Start
- Check existing issues and PRs
- Discuss large changes in an issue first
- Follow our coding standards
- Write tests for new features

### 2. PR Guidelines

**Title Format:**
```
feat: add new hero block variation
fix: resolve drag and drop issue on mobile  
docs: update contributing guide
```

**PR Template:**
```markdown
## What does this PR do?
Brief description of changes

## Type of change
- [ ] Bug fix
- [ ] New feature  
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Manual testing completed
- [ ] Cross-browser testing done
- [ ] Mobile responsive verified
- [ ] Performance impact assessed

## Screenshots
[Add screenshots for UI changes]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] No console errors
- [ ] Bundle size impact < 5KB
```

### 3. Review Process
1. **Automated checks** must pass
2. **Manual review** by maintainers
3. **Performance check** (bundle size)
4. **Final approval** and merge

---

## 🎨 **UI/UX Guidelines**

### Design Principles
- **Clean and minimal** interface
- **Consistent spacing** using Tailwind scale
- **Clear visual hierarchy**
- **Accessible color contrast**
- **Touch-friendly** interactions (44px min)

### Component Patterns

```jsx
// Loading State
{isLoading ? (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="h-6 w-6 animate-spin" />
    <span className="ml-2">Loading...</span>
  </div>
) : (
  <Content />
)}

// Error State  
{error && (
  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
    <p className="text-red-800">{error.message}</p>
  </div>
)}

// Empty State
{items.length === 0 && (
  <div className="text-center py-12">
    <h3 className="text-lg font-medium text-gray-900">No items yet</h3>
    <p className="text-gray-500">Add your first item to get started</p>
  </div>
)}
```

---

## 🚫 **What We Don't Accept**

To maintain focus and quality, we don't accept:

### Features We Won't Add
- **Complex animations** or effects
- **Advanced code editing** capabilities  
- **Premium features** or paid tiers
- **Heavy dependencies** (> 50KB)
- **TypeScript** migrations
- **Custom CSS** features
- **Backend integrations** (keep it frontend-only)
- **User authentication** (planned for v2)

### Code We Won't Merge
- TypeScript files
- Custom CSS files
- Components > 150 lines
- Inline styles
- Heavy dependencies
- Breaking changes without discussion
- Code without proper accessibility
- Performance regressions

---

## 🐛 **Bug Reports**

### Bug Report Template

```markdown
**Describe the bug**
Clear description of the issue

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
What you expected to happen

**Screenshots**
Add screenshots if applicable

**Environment:**
- OS: [e.g. macOS, Windows]
- Browser: [e.g. Chrome, Safari]  
- Version: [e.g. 1.0.0]
- Device: [e.g. iPhone, Desktop]

**Additional context**
Any other context about the problem
```

---

## 💡 **Feature Requests**

Before suggesting a feature, ask yourself:

1. **Does it pass the "grandmother test"?** Can a non-technical person use it easily?
2. **Is it essential for homepage building?** We focus on core functionality only
3. **Does it align with our performance goals?** Bundle size impact must be minimal
4. **Is it mobile-first?** Must work great on mobile devices

### Feature Request Template

```markdown
**Feature Description**
Clear description of the feature

**Problem it Solves**
What user problem does this address?

**Proposed Solution**
How should this work?

**Alternatives Considered**
What other solutions did you consider?

**Impact Assessment**
- Bundle size impact: [estimate]
- Complexity level: [low/medium/high]
- Mobile compatibility: [yes/no]
```

---

## 🏆 **Recognition**

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Special recognition for:
- **First-time contributors**
- **Performance improvements**
- **Accessibility enhancements**
- **Documentation improvements**

---

## 📞 **Need Help?**

- 💬 **Questions**: Open a [Discussion](https://github.com/your-username/quickpage-builder/discussions)
- 🐛 **Bugs**: Create an [Issue](https://github.com/your-username/quickpage-builder/issues)
- 💡 **Ideas**: Start a [Feature Request](https://github.com/your-username/quickpage-builder/issues/new?template=feature_request.md)

---

## 📜 **License**

By contributing, you agree that your contributions will be licensed under the same **Free Forever** license as the project.

---

*Thank you for helping make QuickPage Builder better for store owners everywhere!* 🎉