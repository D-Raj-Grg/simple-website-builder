'use client';

import { useState, Suspense, lazy, memo } from 'react';
import { Button } from "@/components/ui/button";
import { 
  GripVertical, 
  Copy, 
  Trash2, 
  Settings, 
  Eye,
  EyeOff,
  Loader2
} from "lucide-react";
import useEditorStore from '@/lib/store/editorStore';
import { toast } from "sonner";

// Lazy load block components for code splitting
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

const BlockRenderer = memo(function BlockRenderer({ 
  block, 
  isSelected, 
  isPreviewMode, 
  onSelect, 
  dragHandleProps,
  isDragging = false
}) {
  const [isHovered, setIsHovered] = useState(false);
  
  const { 
    removeBlock, 
    duplicateBlock,
    currentLanguage 
  } = useEditorStore();

  const handleDelete = (e) => {
    e.stopPropagation();
    removeBlock(block.id);
    toast.success('Block deleted');
  };

  const handleDuplicate = (e) => {
    e.stopPropagation();
    duplicateBlock(block.id);
    toast.success('Block duplicated');
  };

  const BlockComponent = blockComponents[block.type];

  if (!BlockComponent) {
    return (
      <div className="p-8 border border-red-200 bg-red-50 text-center">
        <p className="text-red-600">Block type &quot;{block.type}&quot; not found</p>
        <p className="text-sm text-red-500 mt-1">
          Component needs to be implemented
        </p>
      </div>
    );
  }

  return (
    <div
      className={`relative group ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
      } ${isPreviewMode ? '' : 'cursor-pointer'} ${
        isDragging ? 'opacity-50 transform rotate-1 scale-105' : ''
      }`}
      onClick={!isPreviewMode ? onSelect : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Block controls - only show in edit mode */}
      {!isPreviewMode && (isHovered || isSelected) && (
        <>
          {/* Top toolbar */}
          <div className="absolute top-2 left-2 bg-white border border-gray-200 rounded-md shadow-sm z-10 flex">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 cursor-grab active:cursor-grabbing touch-none"
              {...dragHandleProps}
            >
              <GripVertical className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleDuplicate}
            >
              <Copy className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Block type indicator */}
          <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-md z-10">
            {block.type}
          </div>

          {/* Selection overlay */}
          {isSelected && (
            <div className="absolute inset-0 bg-blue-500 bg-opacity-5 pointer-events-none z-0" />
          )}
        </>
      )}

      {/* Block content */}
      <div className="relative">
        <Suspense 
          fallback={
            <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
              <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
              <span className="ml-2 text-gray-600">Loading {block.type} block...</span>
            </div>
          }
        >
          <BlockComponent
            content={block.content[currentLanguage] || block.content['en'] || {}}
            settings={block.settings}
            isEditing={!isPreviewMode}
            blockId={block.id}
          />
        </Suspense>
      </div>

      {/* Drop zones for reordering (TODO: implement drag & drop) */}
      {!isPreviewMode && isHovered && (
        <>
          <div className="absolute -top-2 left-0 right-0 h-4 bg-blue-500 bg-opacity-0 hover:bg-opacity-20 transition-colors" />
          <div className="absolute -bottom-2 left-0 right-0 h-4 bg-blue-500 bg-opacity-0 hover:bg-opacity-20 transition-colors" />
        </>
      )}
    </div>
  );
});

export default BlockRenderer;