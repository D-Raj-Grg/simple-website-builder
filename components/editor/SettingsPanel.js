'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Settings, 
  Type, 
  Palette, 
  Layout,
  Languages,
  Globe,
  MousePointer2,
  Image as ImageIcon,
  ChevronDown,
  Edit3
} from "lucide-react";
import useEditorStore from '@/lib/store/editorStore';
import { blockRegistry } from '@/lib/blocks/registry';
import {
  FontSizeSelector,
  FontWeightSelector,
  ButtonStyleSelector,
  AlignmentSelector,
  SpacingSelector,
  ColorPicker,
  GradientColorPicker,
  ImageUpload,
  IconStyleSelector,
  LayoutSelector,
  BackgroundSelector,
  BorderRadiusSelector,
  ShadowSelector,
  AnimationSelector
} from './controls';

export default function SettingsPanel() {
  const { 
    page,
    selectedBlockId, 
    currentLanguage,
    updateBlock,
    updatePageSettings,
    setLanguage
  } = useEditorStore();

  const [expandedSections, setExpandedSections] = useState(['heading', 'button']);

  const selectedBlock = page.blocks.find(block => block.id === selectedBlockId);
  
  // Debug logging
  console.log('🔍 SettingsPanel render:', {
    selectedBlockId,
    selectedBlock: selectedBlock ? {
      id: selectedBlock.id,
      type: selectedBlock.type,
      hasContent: !!selectedBlock.content,
      hasSettings: !!selectedBlock.settings,
      contentKeys: selectedBlock.content ? Object.keys(selectedBlock.content) : [],
      settingsKeys: selectedBlock.settings ? Object.keys(selectedBlock.settings) : []
    } : null,
    currentLanguage,
    pageBlocksCount: page.blocks.length
  });

  const handleBlockSettingChange = (key, value) => {
    if (!selectedBlock) {
      console.warn('⚠️ SettingsPanel: No selectedBlock when trying to change setting', { key, value });
      return;
    }
    
    console.log('🔄 SettingsPanel: Changing setting', { 
      blockId: selectedBlock.id, 
      key, 
      value, 
      currentSettings: selectedBlock.settings 
    });
    
    updateBlock(selectedBlock.id, {
      settings: {
        ...selectedBlock.settings,
        [key]: value
      }
    });
  };

  const handleNestedSettingChange = (parentKey, childKey, value) => {
    if (!selectedBlock) return;
    
    updateBlock(selectedBlock.id, {
      settings: {
        ...selectedBlock.settings,
        [parentKey]: {
          ...selectedBlock.settings[parentKey],
          [childKey]: value
        }
      }
    });
  };

  const handleBlockContentChange = (key, value) => {
    if (!selectedBlock) {
      console.warn('⚠️ SettingsPanel: No selectedBlock when trying to change content', { key, value });
      return;
    }
    
    console.log('🔄 SettingsPanel: Changing content', { 
      blockId: selectedBlock.id, 
      key, 
      value, 
      currentLanguage,
      currentContent: selectedBlock.content[currentLanguage] 
    });
    
    updateBlock(selectedBlock.id, {
      content: {
        ...selectedBlock.content,
        [currentLanguage]: {
          ...selectedBlock.content[currentLanguage],
          [key]: value
        }
      }
    });
  };

  const handleNestedContentChange = (parentKey, childKey, value) => {
    if (!selectedBlock) {
      console.warn('⚠️ SettingsPanel: No selectedBlock when trying to change nested content', { parentKey, childKey, value });
      return;
    }
    
    const currentContent = selectedBlock.content[currentLanguage] || {};
    const parentContent = currentContent[parentKey] || {};
    
    console.log('🔄 SettingsPanel: Changing nested content', { 
      blockId: selectedBlock.id, 
      parentKey, 
      childKey, 
      value, 
      currentLanguage,
      currentContent,
      parentContent 
    });
    
    updateBlock(selectedBlock.id, {
      content: {
        ...selectedBlock.content,
        [currentLanguage]: {
          ...currentContent,
          [parentKey]: {
            ...parentContent,
            [childKey]: value
          }
        }
      }
    });
  };

  const handlePageSettingChange = (key, value) => {
    updatePageSettings({ [key]: value });
  };

  if (!selectedBlock) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Page Settings
          </h2>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            {/* Page title */}
            <div className="space-y-2">
              <Label htmlFor="page-title">Page Title</Label>
              <Input
                id="page-title"
                value={page.title}
                onChange={(e) => updatePageSettings({ title: e.target.value })}
                placeholder="Enter page title"
              />
            </div>

            {/* Global settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Global Styling
                </CardTitle>
                <CardDescription>
                  These settings apply to the entire page
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ColorPicker
                  label="Primary Color"
                  value={page.globalSettings.primaryColor}
                  onChange={(color) => handlePageSettingChange('primaryColor', color)}
                  showGradients={true}
                />

                <FontSizeSelector
                  label="Base Font Size"
                  value={page.globalSettings.fontSize || 'M'}
                  onChange={(size) => handlePageSettingChange('fontSize', size)}
                />

                <SpacingSelector
                  label="Global Spacing"
                  value={page.globalSettings.spacing}
                  onChange={(spacing) => handlePageSettingChange('spacing', spacing)}
                  type="padding"
                />
              </CardContent>
            </Card>

            {/* Language settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Languages className="h-4 w-4" />
                  Languages
                </CardTitle>
                <CardDescription>
                  Manage multilingual content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Language</Label>
                  <select 
                    value={currentLanguage} 
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    {page.languages.map(lang => (
                      <option key={lang} value={lang}>
                        {lang.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
                
                <Button variant="outline" size="sm" className="w-full">
                  <Globe className="h-4 w-4 mr-2" />
                  Add Language
                </Button>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    );
  }

  const blockDef = blockRegistry[selectedBlock.type];
  const blockContent = selectedBlock.content[currentLanguage] || selectedBlock.content['en'] || {};
  
  console.log('🔍 SettingsPanel blockContent:', {
    blockType: selectedBlock.type,
    currentLanguage,
    availableLanguages: Object.keys(selectedBlock.content),
    blockContent,
    hasBlockDef: !!blockDef
  });

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Settings className="h-5 w-5" />
          {blockDef?.name || selectedBlock.type} Block
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Edit individual components and styling
        </p>
      </div>

      <Tabs defaultValue="components" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 mx-4 mt-4">
          <TabsTrigger value="components" className="flex items-center gap-2">
            <Edit3 className="h-4 w-4" />
            Components
          </TabsTrigger>
          <TabsTrigger value="layout" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Layout
          </TabsTrigger>
          <TabsTrigger value="style" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Style
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="components" className="p-4 space-y-4 mt-0">
            {selectedBlock.type === 'hero' && (
              <Accordion 
                type="multiple" 
                value={expandedSections} 
                onValueChange={setExpandedSections}
              >
                {/* Heading Component */}
                <AccordionItem value="heading">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Type className="h-4 w-4" />
                      <span>Heading</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="heading">Text Content</Label>
                      <Input
                        id="heading"
                        value={blockContent.heading || ''}
                        onChange={(e) => handleBlockContentChange('heading', e.target.value)}
                        placeholder="Enter heading"
                      />
                    </div>

                    <FontSizeSelector
                      label="Heading Size"
                      value={selectedBlock.settings.headingSize || 'L'}
                      onChange={(value) => handleBlockSettingChange('headingSize', value)}
                    />

                    <FontWeightSelector
                      label="Font Weight"
                      value={selectedBlock.settings.headingWeight || 'bold'}
                      onChange={(value) => handleBlockSettingChange('headingWeight', value)}
                      compact={true}
                    />

                    <ColorPicker
                      label="Text Color"
                      value={selectedBlock.settings.headingColor || '#1F2937'}
                      onChange={(value) => handleBlockSettingChange('headingColor', value)}
                    />

                    <AlignmentSelector
                      label="Text Alignment"
                      value={selectedBlock.settings.headingAlignment || 'center'}
                      onChange={(value) => handleBlockSettingChange('headingAlignment', value)}
                      type="text"
                      compact={true}
                    />
                  </AccordionContent>
                </AccordionItem>

                {/* Subheading Component */}
                <AccordionItem value="subheading">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Type className="h-4 w-4" />
                      <span>Subheading</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="subheading">Text Content</Label>
                      <Textarea
                        id="subheading"
                        value={blockContent.subheading || ''}
                        onChange={(e) => handleBlockContentChange('subheading', e.target.value)}
                        placeholder="Enter subheading"
                        rows={3}
                      />
                    </div>

                    <FontSizeSelector
                      label="Subheading Size"
                      value={selectedBlock.settings.subheadingSize || 'M'}
                      onChange={(value) => handleBlockSettingChange('subheadingSize', value)}
                    />

                    <FontWeightSelector
                      label="Font Weight"
                      value={selectedBlock.settings.subheadingWeight || 'normal'}
                      onChange={(value) => handleBlockSettingChange('subheadingWeight', value)}
                      compact={true}
                    />

                    <ColorPicker
                      label="Text Color"
                      value={selectedBlock.settings.subheadingColor || '#6B7280'}
                      onChange={(value) => handleBlockSettingChange('subheadingColor', value)}
                    />

                    <AlignmentSelector
                      label="Text Alignment"
                      value={selectedBlock.settings.subheadingAlignment || 'center'}
                      onChange={(value) => handleBlockSettingChange('subheadingAlignment', value)}
                      type="text"
                      compact={true}
                    />
                  </AccordionContent>
                </AccordionItem>

                {/* Button Component */}
                <AccordionItem value="button">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <MousePointer2 className="h-4 w-4" />
                      <span>Button</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="button-text">Button Text</Label>
                        <Input
                          id="button-text"
                          value={blockContent.ctaButton?.text || ''}
                          onChange={(e) => handleNestedContentChange('ctaButton', 'text', e.target.value)}
                          placeholder="Enter button text"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="button-link">Button Link</Label>
                        <Input
                          id="button-link"
                          value={blockContent.ctaButton?.link || ''}
                          onChange={(e) => handleNestedContentChange('ctaButton', 'link', e.target.value)}
                          placeholder="Enter link URL"
                        />
                      </div>
                    </div>

                    <ButtonStyleSelector
                      label="Button Style"
                      value={selectedBlock.settings.buttonStyle || {
                        size: 'lg',
                        variant: 'primary',
                        icon: 'play',
                        iconPosition: 'left',
                        corner: 'rounded'
                      }}
                      onChange={(value) => handleBlockSettingChange('buttonStyle', value)}
                    />

                    <AlignmentSelector
                      label="Button Alignment"
                      value={selectedBlock.settings.buttonAlignment || 'center'}
                      onChange={(value) => handleBlockSettingChange('buttonAlignment', value)}
                      type="horizontal"
                      compact={true}
                    />
                  </AccordionContent>
                </AccordionItem>

                {/* Image Component */}
                <AccordionItem value="image">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      <span>Image</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <ImageUpload
                      value={blockContent.image}
                      onChange={(url) => handleBlockContentChange('image', url)}
                      onRemove={() => handleBlockContentChange('image', '')}
                      placeholder="Upload hero image"
                      aspectRatio="landscape"
                      showPreview={true}
                    />

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Image Position</Label>
                        <AlignmentSelector
                          value={selectedBlock.settings.imagePosition || 'center'}
                          onChange={(value) => handleBlockSettingChange('imagePosition', value)}
                          type="horizontal"
                          compact={true}
                        />
                      </div>

                      <SpacingSelector
                        label="Image Spacing"
                        value={selectedBlock.settings.imageSpacing || 'md'}
                        onChange={(value) => handleBlockSettingChange('imageSpacing', value)}
                        type="margin"
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}

            {/* Features Block Components */}
            {selectedBlock.type === 'features' && (
              <Accordion 
                type="multiple" 
                value={expandedSections} 
                onValueChange={setExpandedSections}
              >
                {/* Header Component */}
                <AccordionItem value="header">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Type className="h-4 w-4" />
                      <span>Header</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="features-heading">Section Heading</Label>
                      <Input
                        id="features-heading"
                        value={blockContent.heading || ''}
                        onChange={(e) => handleBlockContentChange('heading', e.target.value)}
                        placeholder="Enter section heading"
                      />
                    </div>

                    <FontSizeSelector
                      label="Heading Size"
                      value={selectedBlock.settings.header?.size || 'xl'}
                      onChange={(value) => handleNestedSettingChange('header', 'size', value)}
                    />

                    <FontWeightSelector
                      label="Font Weight"
                      value={selectedBlock.settings.header?.weight || 'bold'}
                      onChange={(value) => handleNestedSettingChange('header', 'weight', value)}
                      compact={true}
                    />

                    <ColorPicker
                      label="Text Color"
                      value={selectedBlock.settings.header?.color || 'gray-900'}
                      onChange={(value) => handleNestedSettingChange('header', 'color', value)}
                    />

                    <AlignmentSelector
                      label="Header Alignment"
                      value={selectedBlock.settings.header?.alignment || 'center'}
                      onChange={(value) => handleNestedSettingChange('header', 'alignment', value)}
                      type="text"
                      compact={true}
                    />
                  </AccordionContent>
                </AccordionItem>

                {/* Features Grid Component */}
                <AccordionItem value="featuresGrid">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Layout className="h-4 w-4" />
                      <span>Features Grid</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <IconStyleSelector
                      label="Icon Style"
                      value={{
                        style: selectedBlock.settings.featuresGrid?.iconStyle || 'filled',
                        size: selectedBlock.settings.featuresGrid?.iconSize || 'md',
                        color: selectedBlock.settings.featuresGrid?.iconColor || 'blue'
                      }}
                      onChange={(value) => {
                        handleNestedSettingChange('featuresGrid', 'iconStyle', value.style);
                        handleNestedSettingChange('featuresGrid', 'iconSize', value.size);
                        handleNestedSettingChange('featuresGrid', 'iconColor', value.color);
                      }}
                    />

                    <div className="space-y-2">
                      <Label>Card Style</Label>
                      <select 
                        value={selectedBlock.settings.featuresGrid?.cardStyle || 'elevated'}
                        onChange={(e) => handleNestedSettingChange('featuresGrid', 'cardStyle', e.target.value)}
                        className="w-full p-2 border rounded"
                      >
                        <option value="flat">Flat</option>
                        <option value="outlined">Outlined</option>
                        <option value="elevated">Elevated</option>
                        <option value="filled">Filled</option>
                      </select>
                    </div>

                    <FontSizeSelector
                      label="Title Size"
                      value={selectedBlock.settings.featuresGrid?.titleSize || 'xl'}
                      onChange={(value) => handleNestedSettingChange('featuresGrid', 'titleSize', value)}
                    />

                    <FontWeightSelector
                      label="Title Weight"
                      value={selectedBlock.settings.featuresGrid?.titleWeight || 'semibold'}
                      onChange={(value) => handleNestedSettingChange('featuresGrid', 'titleWeight', value)}
                      compact={true}
                    />

                    <FontSizeSelector
                      label="Description Size"
                      value={selectedBlock.settings.featuresGrid?.descriptionSize || 'base'}
                      onChange={(value) => handleNestedSettingChange('featuresGrid', 'descriptionSize', value)}
                    />

                    <AlignmentSelector
                      label="Content Alignment"
                      value={selectedBlock.settings.featuresGrid?.contentAlignment || 'center'}
                      onChange={(value) => handleNestedSettingChange('featuresGrid', 'contentAlignment', value)}
                      type="text"
                      compact={true}
                    />

                    <SpacingSelector
                      label="Component Spacing"
                      value={selectedBlock.settings.featuresGrid?.spacing || 4}
                      onChange={(value) => handleNestedSettingChange('featuresGrid', 'spacing', value)}
                      type="margin"
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}

            {/* Testimonials Block Components */}
            {selectedBlock.type === 'testimonials' && (
              <Accordion 
                type="multiple" 
                value={expandedSections} 
                onValueChange={setExpandedSections}
              >
                {/* Header Component */}
                <AccordionItem value="header">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Type className="h-4 w-4" />
                      <span>Header</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="testimonials-heading">Section Heading</Label>
                      <Input
                        id="testimonials-heading"
                        value={blockContent.heading || ''}
                        onChange={(e) => handleBlockContentChange('heading', e.target.value)}
                        placeholder="Enter section heading"
                      />
                    </div>

                    <FontSizeSelector
                      label="Heading Size"
                      value={selectedBlock.settings.header?.size || 'xl'}
                      onChange={(value) => handleNestedSettingChange('header', 'size', value)}
                    />

                    <FontWeightSelector
                      label="Font Weight"
                      value={selectedBlock.settings.header?.weight || 'bold'}
                      onChange={(value) => handleNestedSettingChange('header', 'weight', value)}
                      compact={true}
                    />

                    <ColorPicker
                      label="Text Color"
                      value={selectedBlock.settings.header?.color || 'gray-900'}
                      onChange={(value) => handleNestedSettingChange('header', 'color', value)}
                    />

                    <AlignmentSelector
                      label="Header Alignment"
                      value={selectedBlock.settings.header?.alignment || 'center'}
                      onChange={(value) => handleNestedSettingChange('header', 'alignment', value)}
                      type="text"
                      compact={true}
                    />
                  </AccordionContent>
                </AccordionItem>

                {/* Testimonial Cards Component */}
                <AccordionItem value="testimonialCards">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Layout className="h-4 w-4" />
                      <span>Testimonial Cards</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>Card Style</Label>
                      <select 
                        value={selectedBlock.settings.testimonialCard?.style || 'elevated'}
                        onChange={(e) => handleNestedSettingChange('testimonialCard', 'style', e.target.value)}
                        className="w-full p-2 border rounded"
                      >
                        <option value="flat">Flat</option>
                        <option value="outlined">Outlined</option>
                        <option value="elevated">Elevated</option>
                        <option value="glass">Glass</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label>Quote Style</Label>
                      <select 
                        value={selectedBlock.settings.testimonialCard?.quoteStyle || 'icon'}
                        onChange={(e) => handleNestedSettingChange('testimonialCard', 'quoteStyle', e.target.value)}
                        className="w-full p-2 border rounded"
                      >
                        <option value="icon">Quote Icon</option>
                        <option value="quotes">Quote Marks</option>
                        <option value="none">None</option>
                      </select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="show-rating"
                        checked={selectedBlock.settings.testimonialCard?.showRating !== false}
                        onChange={(e) => handleNestedSettingChange('testimonialCard', 'showRating', e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor="show-rating">Show Rating Stars</Label>
                    </div>

                    <div className="space-y-2">
                      <Label>Author Layout</Label>
                      <select 
                        value={selectedBlock.settings.testimonialCard?.authorLayout || 'horizontal'}
                        onChange={(e) => handleNestedSettingChange('testimonialCard', 'authorLayout', e.target.value)}
                        className="w-full p-2 border rounded"
                      >
                        <option value="horizontal">Horizontal</option>
                        <option value="vertical">Vertical</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label>Avatar Style</Label>
                      <select 
                        value={selectedBlock.settings.testimonialCard?.avatarStyle || 'circle'}
                        onChange={(e) => handleNestedSettingChange('testimonialCard', 'avatarStyle', e.target.value)}
                        className="w-full p-2 border rounded"
                      >
                        <option value="circle">Circle</option>
                        <option value="square">Square</option>
                        <option value="rounded">Rounded</option>
                      </select>
                    </div>

                    <FontSizeSelector
                      label="Text Size"
                      value={selectedBlock.settings.testimonialCard?.textSize || 'lg'}
                      onChange={(value) => handleNestedSettingChange('testimonialCard', 'textSize', value)}
                    />

                    <SpacingSelector
                      label="Component Spacing"
                      value={selectedBlock.settings.testimonialCard?.spacing || 4}
                      onChange={(value) => handleNestedSettingChange('testimonialCard', 'spacing', value)}
                      type="margin"
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </TabsContent>

          <TabsContent value="layout" className="p-4 space-y-4 mt-0">
            {selectedBlock.type === 'hero' && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Layout Settings</CardTitle>
                    <CardDescription>
                      Control the overall layout and positioning
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <AlignmentSelector
                      label="Content Alignment"
                      value={selectedBlock.settings.alignment || 'center'}
                      onChange={(value) => handleBlockSettingChange('alignment', value)}
                      type="text"
                    />

                    <SpacingSelector
                      label="Section Spacing"
                      value={selectedBlock.settings.spacing || 'comfortable'}
                      onChange={(value) => handleBlockSettingChange('spacing', value)}
                      type="padding"
                    />
                  </CardContent>
                </Card>
              </>
            )}

            {/* Features Block Layout */}
            {selectedBlock.type === 'features' && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Grid Layout</CardTitle>
                    <CardDescription>
                      Control the features grid layout
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <LayoutSelector
                      label="Grid Settings"
                      value={{
                        columns: selectedBlock.settings.layout?.columns || 3,
                        gridGap: selectedBlock.settings.layout?.gridGap || 'lg',
                        alignment: selectedBlock.settings.layout?.alignment || 'center'
                      }}
                      onChange={(value) => {
                        handleNestedSettingChange('layout', 'columns', value.columns);
                        handleNestedSettingChange('layout', 'gridGap', value.gridGap);
                        handleNestedSettingChange('layout', 'alignment', value.alignment);
                      }}
                    />

                    <div className="space-y-2">
                      <Label>Max Width</Label>
                      <select 
                        value={selectedBlock.settings.layout?.maxWidth || '7xl'}
                        onChange={(e) => handleNestedSettingChange('layout', 'maxWidth', e.target.value)}
                        className="w-full p-2 border rounded"
                      >
                        <option value="sm">Small (640px)</option>
                        <option value="md">Medium (768px)</option>
                        <option value="lg">Large (1024px)</option>
                        <option value="xl">Extra Large (1280px)</option>
                        <option value="2xl">2X Large (1536px)</option>
                        <option value="7xl">7X Large (80rem)</option>
                      </select>
                    </div>

                    <SpacingSelector
                      label="Section Padding"
                      value={selectedBlock.settings.layout?.padding || { top: 16, bottom: 16, x: 6 }}
                      onChange={(value) => handleNestedSettingChange('layout', 'padding', value)}
                      type="padding"
                    />
                  </CardContent>
                </Card>
              </>
            )}

            {/* Testimonials Block Layout */}
            {selectedBlock.type === 'testimonials' && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Layout Settings</CardTitle>
                    <CardDescription>
                      Control the testimonials layout
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Layout Type</Label>
                      <select 
                        value={selectedBlock.settings.layout?.type || 'grid'}
                        onChange={(e) => handleNestedSettingChange('layout', 'type', e.target.value)}
                        className="w-full p-2 border rounded"
                      >
                        <option value="grid">Grid</option>
                        <option value="carousel">Carousel</option>
                      </select>
                    </div>

                    <LayoutSelector
                      label="Grid Settings"
                      value={{
                        columns: selectedBlock.settings.layout?.columns || 3,
                        gridGap: selectedBlock.settings.layout?.gridGap || 'lg',
                        alignment: selectedBlock.settings.layout?.alignment || 'center'
                      }}
                      onChange={(value) => {
                        handleNestedSettingChange('layout', 'columns', value.columns);
                        handleNestedSettingChange('layout', 'gridGap', value.gridGap);
                        handleNestedSettingChange('layout', 'alignment', value.alignment);
                      }}
                    />

                    <div className="space-y-2">
                      <Label>Max Items</Label>
                      <select 
                        value={selectedBlock.settings.layout?.maxItems || 3}
                        onChange={(e) => handleNestedSettingChange('layout', 'maxItems', parseInt(e.target.value))}
                        className="w-full p-2 border rounded"
                      >
                        <option value={1}>1 Testimonial</option>
                        <option value={2}>2 Testimonials</option>
                        <option value={3}>3 Testimonials</option>
                        <option value={4}>4 Testimonials</option>
                        <option value={6}>6 Testimonials</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label>Max Width</Label>
                      <select 
                        value={selectedBlock.settings.layout?.maxWidth || '7xl'}
                        onChange={(e) => handleNestedSettingChange('layout', 'maxWidth', e.target.value)}
                        className="w-full p-2 border rounded"
                      >
                        <option value="sm">Small (640px)</option>
                        <option value="md">Medium (768px)</option>
                        <option value="lg">Large (1024px)</option>
                        <option value="xl">Extra Large (1280px)</option>
                        <option value="2xl">2X Large (1536px)</option>
                        <option value="7xl">7X Large (80rem)</option>
                      </select>
                    </div>

                    <SpacingSelector
                      label="Section Padding"
                      value={selectedBlock.settings.layout?.padding || { top: 16, bottom: 16, x: 6 }}
                      onChange={(value) => handleNestedSettingChange('layout', 'padding', value)}
                      type="padding"
                    />
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="style" className="p-4 space-y-4 mt-0">
            {selectedBlock.type === 'hero' && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Background & Colors</CardTitle>
                    <CardDescription>
                      Customize the visual appearance
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <GradientColorPicker
                      label="Background Color"
                      value={selectedBlock.settings.bgColor || 'white'}
                      onChange={(value) => handleBlockSettingChange('bgColor', value)}
                    />
                  </CardContent>
                </Card>
              </>
            )}

            {/* Features Block Styling */}
            {selectedBlock.type === 'features' && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Background & Visual Effects</CardTitle>
                    <CardDescription>
                      Customize the visual appearance
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <BackgroundSelector
                      label="Section Background"
                      value={selectedBlock.settings.background || { type: 'none', color: '#ffffff' }}
                      onChange={(value) => handleBlockSettingChange('background', value)}
                    />

                    <BorderRadiusSelector
                      label="Border Radius"
                      value={selectedBlock.settings.borderRadius || { preset: 'md' }}
                      onChange={(value) => handleBlockSettingChange('borderRadius', value)}
                    />

                    <ShadowSelector
                      label="Card Shadows"
                      value={selectedBlock.settings.shadow || { enabled: false, preset: 'none' }}
                      onChange={(value) => handleBlockSettingChange('shadow', value)}
                    />

                    <AnimationSelector
                      label="Animations"
                      value={selectedBlock.settings.animation || { enabled: false, entrance: 'none', hover: 'none' }}
                      onChange={(value) => handleBlockSettingChange('animation', value)}
                    />
                  </CardContent>
                </Card>
              </>
            )}

            {/* Testimonials Block Styling */}
            {selectedBlock.type === 'testimonials' && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Background & Visual Effects</CardTitle>
                    <CardDescription>
                      Customize the visual appearance
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <BackgroundSelector
                      label="Section Background"
                      value={selectedBlock.settings.background || { type: 'color', color: '#f9fafb' }}
                      onChange={(value) => handleBlockSettingChange('background', value)}
                    />

                    <BorderRadiusSelector
                      label="Card Border Radius"
                      value={selectedBlock.settings.borderRadius || { preset: 'lg' }}
                      onChange={(value) => handleBlockSettingChange('borderRadius', value)}
                    />

                    <ShadowSelector
                      label="Card Shadows"
                      value={selectedBlock.settings.shadow || { enabled: true, preset: 'lg' }}
                      onChange={(value) => handleBlockSettingChange('shadow', value)}
                    />

                    <AnimationSelector
                      label="Animations"
                      value={selectedBlock.settings.animation || { enabled: false, entrance: 'none', hover: 'lift' }}
                      onChange={(value) => handleBlockSettingChange('animation', value)}
                    />
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}