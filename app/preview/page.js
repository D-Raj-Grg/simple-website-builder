'use client';

import { useEffect, useState, Suspense, lazy } from 'react';
import useEditorStore from '@/lib/store/editorStore';
// Lazy load block components
const HeroBlock = lazy(() => import('@/components/blocks/HeroBlock'));
const FeaturesBlock = lazy(() => import('@/components/blocks/FeaturesBlock'));
const CTABlock = lazy(() => import('@/components/blocks/CTABlock'));
const TestimonialsBlock = lazy(() => import('@/components/blocks/TestimonialsBlock'));
const ContactFormBlock = lazy(() => import('@/components/blocks/ContactFormBlock'));
const ProductGridBlock = lazy(() => import('@/components/blocks/ProductGridBlock'));
const PricingBlock = lazy(() => import('@/components/blocks/PricingBlock'));
const LogoCloudBlock = lazy(() => import('@/components/blocks/LogoCloudBlock'));
const AboutBlock = lazy(() => import('@/components/blocks/AboutBlock'));
const GalleryBlock = lazy(() => import('@/components/blocks/GalleryBlock'));
const TeamBlock = lazy(() => import('@/components/blocks/TeamBlock'));
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, Monitor, Smartphone, Tablet, Download, Code, Share, Settings, Loader2 } from "lucide-react";
import Link from 'next/link';
const ExportModal = lazy(() => import('@/components/modals/ExportModal'));

const blockComponents = {
  hero: HeroBlock,
  features: FeaturesBlock,
  cta: CTABlock,
  testimonials: TestimonialsBlock,
  contactForm: ContactFormBlock,
  productGrid: ProductGridBlock,
  pricing: PricingBlock,
  logoCloud: LogoCloudBlock,
  about: AboutBlock,
  gallery: GalleryBlock,
  team: TeamBlock,
};

export default function PreviewPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [viewMode, setViewMode] = useState('desktop'); // desktop, tablet, mobile
  const [showExportModal, setShowExportModal] = useState(false);
  const { page, loadPage, currentLanguage } = useEditorStore();

  useEffect(() => {
    loadPage().then(() => setIsLoaded(true));
  }, [loadPage]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getViewportStyles = () => {
    switch (viewMode) {
      case 'mobile':
        return { maxWidth: '375px', margin: '0 auto' };
      case 'tablet':
        return { maxWidth: '768px', margin: '0 auto' };
      case 'desktop':
      default:
        return { width: '100%' };
    }
  };

  const exportToHTML = () => {
    // Generate HTML content
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${page.title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-white">
    ${page.blocks.map(block => {
      const BlockComponent = blockComponents[block.type];
      if (!BlockComponent) return '';
      // This would need server-side rendering or a more complex setup
      return `<div class="block-${block.type}"><!-- ${block.type} block content --></div>`;
    }).join('')}
</body>
</html>`;

    // Download file
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${page.title.toLowerCase().replace(/\s+/g, '-')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const sharePreview = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: page.title,
          text: 'Check out this page I created!',
          url: url,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url);
      alert('Preview URL copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Preview header */}
      <div className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/editor">
            <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Editor
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span className="font-medium">Preview Mode</span>
          </div>
        </div>

        {/* Device Toggle */}
        <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-1">
          <Button
            variant={viewMode === 'desktop' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('desktop')}
            className="h-8 px-3"
          >
            <Monitor className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'tablet' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('tablet')}
            className="h-8 px-3"
          >
            <Tablet className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'mobile' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('mobile')}
            className="h-8 px-3"
          >
            <Smartphone className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={sharePreview}
            className="text-white hover:bg-gray-800"
          >
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowExportModal(true)}
            className="text-white hover:bg-gray-800"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <div className="text-sm text-gray-300">
            {page.title}
          </div>
        </div>
      </div>

      {/* Page content with viewport frame */}
      <div className="p-6">
        <div 
          className="bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300"
          style={getViewportStyles()}
        >
          {/* Device frame indicator */}
          {viewMode !== 'desktop' && (
            <div className="bg-gray-200 text-center py-2 text-xs font-medium text-gray-600 border-b">
              {viewMode === 'mobile' ? '📱 Mobile View (375px)' : '📱 Tablet View (768px)'}
            </div>
          )}

          <main className={viewMode === 'mobile' ? 'text-sm' : ''}>
            {page.blocks.length === 0 ? (
              <div className="min-h-screen flex items-center justify-center text-center p-8">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    No Content Yet
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Start building your page by adding blocks in the editor.
                  </p>
                  <Link href="/editor">
                    <Button>
                      Go to Editor
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                {[...page.blocks]
                  .sort((a, b) => a.order - b.order)
                  .map((block) => {
                    const BlockComponent = blockComponents[block.type];
                    
                    if (!BlockComponent) {
                      return (
                        <div key={block.id} className="p-8 bg-red-50 text-center">
                          <p className="text-red-600">
                            Block type &quot;{block.type}&quot; not available in preview
                          </p>
                        </div>
                      );
                    }

                    return (
                      <Suspense
                        key={block.id}
                        fallback={
                          <div className="flex items-center justify-center p-8 bg-gray-50">
                            <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                            <span className="ml-2 text-gray-600">Loading {block.type}...</span>
                          </div>
                        }
                      >
                        <BlockComponent
                          content={block.content[currentLanguage] || block.content['en'] || {}}
                          settings={block.settings}
                          isEditing={false}
                          blockId={block.id}
                        />
                      </Suspense>
                    );
                  })}
              </div>
            )}
          </main>
        </div>

        {/* Viewport info */}
        <div className="text-center mt-4 text-sm text-gray-500">
          Current view: {viewMode} • {page.blocks.length} blocks
        </div>
      </div>

      {/* Export Modal */}
      <Suspense fallback={null}>
        <ExportModal 
          isOpen={showExportModal} 
          onClose={() => setShowExportModal(false)} 
        />
      </Suspense>
    </div>
  );
}