# App Directory

Next.js 15 App Router structure for QuickPage Builder.

## Structure

```
app/
├── editor/               # Main editor interface
│   └── page.js          # Editor page component
├── preview/             # Preview mode
│   └── page.js          # Preview page component
├── api/                 # API routes (future)
│   ├── pages/           # Page CRUD operations
│   ├── products/        # Product integration
│   └── export/          # Export functionality  
├── layout.js            # Root layout with providers
├── page.js              # Homepage (redirects to editor)
├── globals.css          # Global styles and Tailwind
├── loading.js           # Global loading component
├── error.js             # Global error boundary
└── README.md            # This file
```

## Pages

### Editor (`editor/page.js`)

The main editing interface with three-panel layout:

**Layout:**
- **Left Panel**: Block library with drag & drop
- **Center Panel**: Canvas with live editing
- **Right Panel**: Settings for selected block

**Key Features:**
- Real-time visual editing
- Drag & drop block management
- Inline text editing
- Responsive preview toggle
- Auto-save functionality
- Undo/redo support
- Multi-language editing

**Code Structure:**
```jsx
export default function EditorPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="editor-layout h-screen flex">
        <BlockLibrary />        {/* Left panel */}
        <Canvas />              {/* Center panel */}
        <SettingsPanel />       {/* Right panel */}
      </div>
    </Suspense>
  );
}
```

### Preview (`preview/page.js`)

Clean preview mode without editing capabilities:

**Features:**
- Full-screen preview
- Responsive testing (desktop/mobile)
- Final review before export
- Share functionality
- Performance testing

### Homepage (`page.js`)

Landing page that redirects to editor:

```jsx
export default function HomePage() {
  redirect('/editor');
}
```

## Layout (`layout.js`)

Root layout with providers and global configuration:

**Providers:**
- Zustand store initialization
- Toast notification system
- Error boundary
- Loading states

**Global Setup:**
- Font configuration (Inter)
- Meta tags for SEO
- Viewport settings
- Theme provider

```jsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

## Styling (`globals.css`)

Global styles and Tailwind configuration:

```css
/* Tailwind imports */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom CSS variables */
:root {
  --primary: 222.2 84% 4.9%;
  --secondary: 210 40% 96%;
  /* ... other design tokens */
}

/* Global component styles */
.editor-layout { /* ... */ }
.block-wrapper { /* ... */ }
.settings-panel { /* ... */ }
```

## API Routes (Future)

Planned API structure for backend integration:

### Pages API (`api/pages/`)
```
GET    /api/pages          # List all pages
GET    /api/pages/[id]     # Get specific page
POST   /api/pages          # Create new page  
PUT    /api/pages/[id]     # Update page
DELETE /api/pages/[id]     # Delete page
```

### Products API (`api/products/`)
```
GET    /api/products       # List products (with filters)
GET    /api/products/[id]  # Get specific product
```

### Export API (`api/export/`)
```  
POST   /api/export/html    # Export as HTML
POST   /api/export/react   # Export as React components
POST   /api/export/pdf     # Export as PDF
```

## Error Handling

### Global Error Boundary (`error.js`)

```jsx
'use client';

export default function Error({ error, reset }) {
  return (
    <div className="error-container">
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}
```

### Loading States (`loading.js`)

```jsx
export default function Loading() {
  return (
    <div className="loading-container">
      <div className="spinner" />
      <p>Loading editor...</p>
    </div>
  );
}
```

## Performance Optimizations

### Code Splitting
- Editor components lazy-loaded with `React.lazy()`
- Block components split by type
- UI components loaded on demand

### Bundle Optimization
- Next.js automatic code splitting
- Dynamic imports for heavy components
- Image optimization with `next/image`

### Caching Strategy
- Static assets cached indefinitely
- API responses cached with SWR
- Page state persisted to localStorage

## Development Patterns

### Page Organization
```jsx
// Standard page structure
export default function PageName() {
  // 1. Hooks and state
  // 2. Event handlers  
  // 3. Effects
  // 4. Render logic
  
  return (
    <PageLayout>
      <ComponentA />
      <ComponentB />
    </PageLayout>
  );
}
```

### Data Fetching
```jsx
// Server components for static data
async function getData() {
  const res = await fetch('/api/data');
  return res.json();
}

export default async function Page() {
  const data = await getData();
  
  return <DataDisplay data={data} />;
}
```

### Client Components
```jsx
'use client';

import { useState, useEffect } from 'react';

export default function InteractiveComponent() {
  // Client-side state and effects
  
  return <InteractiveUI />;
}
```

## Metadata Configuration

Each page can define its metadata:

```jsx
export const metadata = {
  title: 'QuickPage Builder - Editor',
  description: 'Create beautiful homepages in minutes',
  keywords: 'website builder, page builder, drag drop',
  openGraph: {
    title: 'QuickPage Builder',
    description: 'Build stunning websites without code',
    images: ['/og-image.png'],
  },
};
```

## Environment Configuration

Different behavior per environment:

```javascript
// Development
if (process.env.NODE_ENV === 'development') {
  // Debug logging
  // Mock data
  // Development tools
}

// Production  
if (process.env.NODE_ENV === 'production') {
  // Analytics
  // Error reporting
  // Performance monitoring
}
```

## Deployment Considerations

- **Static Export**: Can be deployed as static site
- **Server Components**: Require Node.js runtime
- **API Routes**: Need serverless functions or server
- **Images**: Use CDN for production
- **Environment Variables**: Configure for each environment