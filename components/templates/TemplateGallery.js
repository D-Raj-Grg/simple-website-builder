'use client';

import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, 
  Eye, 
  Download, 
  Zap,
  Palette,
  Briefcase,
  ShoppingCart,
  User,
  Utensils,
  FileText
} from "lucide-react";
import { TEMPLATES, TEMPLATE_CATEGORIES, TemplateManager } from '@/lib/templates/templates';
import useEditorStore from '@/lib/store/editorStore';
import { toast } from 'sonner';

const CategoryIcons = {
  [TEMPLATE_CATEGORIES.BUSINESS]: Briefcase,
  [TEMPLATE_CATEGORIES.ECOMMERCE]: ShoppingCart,
  [TEMPLATE_CATEGORIES.PORTFOLIO]: User,
  [TEMPLATE_CATEGORIES.LANDING]: Zap,
  [TEMPLATE_CATEGORIES.BLOG]: FileText,
  [TEMPLATE_CATEGORIES.RESTAURANT]: Utensils
};

export default function TemplateGallery({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [previewTemplate, setPreviewTemplate] = useState(null);
  

  // Filter templates based on search and category
  const filteredTemplates = useMemo(() => {
    let filtered = TEMPLATES;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = TemplateManager.searchTemplates(searchQuery);
    }

    return filtered;
  }, [searchQuery, selectedCategory]);

  const applyTemplate = async (template) => {
    try {
      // Create new page from template
      const newPage = TemplateManager.applyTemplate(template, useEditorStore);
      
      // Apply the template to current page
      useEditorStore.setState(state => {
        state.page = newPage;
        state.selectedBlockId = null;
        state.hasUnsavedChanges = true;
      });

      // Initialize history with new page
      useEditorStore.getState().initializeHistory();

      toast.success(`Template "${template.name}" applied successfully!`);
      onClose();
    } catch (error) {
      console.error('Failed to apply template:', error);
      toast.error('Failed to apply template. Please try again.');
    }
  };

  const categories = [
    { id: 'all', name: 'All Templates', count: TEMPLATES.length },
    ...Object.values(TEMPLATE_CATEGORIES).map(category => ({
      id: category,
      name: category.charAt(0).toUpperCase() + category.slice(1),
      count: TEMPLATES.filter(t => t.category === category).length
    }))
  ];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl sm:max-w-[95vw] lg:max-w-6xl max-h-[90vh] p-0">
          <div className="flex flex-col h-full">
            <DialogHeader className="p-6 pb-4">
              <DialogTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Template Gallery
              </DialogTitle>
              <DialogDescription>
                Choose from our collection of professionally designed templates to get started quickly.
              </DialogDescription>
            </DialogHeader>

            {/* Search and filters */}
            <div className="px-6 pb-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="h-full flex flex-col">
                {/* Category tabs */}
                <div className="px-6">
                  <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-6">
                    {categories.map(category => (
                      <TabsTrigger
                        key={category.id}
                        value={category.id}
                        className="flex items-center gap-1 text-xs sm:text-sm"
                      >
                        {category.id !== 'all' && CategoryIcons[category.id] && (() => {
                          const IconComponent = CategoryIcons[category.id];
                          return <IconComponent className="h-3 w-3 sm:h-4 sm:w-4" />;
                        })()}
                        <span className="inline sm:inline truncate">
                          {category.id === 'all' ? 'All' : category.name}
                        </span>
                        <Badge variant="secondary" className="text-xs ml-1">
                          {category.count}
                        </Badge>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                {/* Template grid */}
                <div className="flex-1 px-6 pb-6">
                  <ScrollArea className="h-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                      {filteredTemplates.map(template => (
                        <TemplateCard
                          key={template.id}
                          template={template}
                          onApply={() => applyTemplate(template)}
                          onPreview={() => setPreviewTemplate(template)}
                        />
                      ))}
                    </div>
                    
                    {filteredTemplates.length === 0 && (
                      <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                          <Search className="h-12 w-12 mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No templates found
                        </h3>
                        <p className="text-gray-600">
                          Try adjusting your search or category filters.
                        </p>
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </Tabs>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Template preview modal */}
      {previewTemplate && (
        <TemplatePreviewModal
          template={previewTemplate}
          isOpen={!!previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onApply={() => {
            applyTemplate(previewTemplate);
            setPreviewTemplate(null);
          }}
        />
      )}
    </>
  );
}

function TemplateCard({ template, onApply, onPreview }) {
  // Generate mock preview image based on template category and id
  const getMockImage = (template) => {
    const colors = {
      business: 'from-blue-400 to-blue-600',
      ecommerce: 'from-green-400 to-green-600',
      portfolio: 'from-purple-400 to-purple-600',
      landing: 'from-orange-400 to-orange-600',
      blog: 'from-indigo-400 to-indigo-600',
      restaurant: 'from-red-400 to-red-600'
    };
    
    const patterns = [
      'bg-gradient-to-br',
      'bg-gradient-to-tr',
      'bg-gradient-to-bl',
      'bg-gradient-to-tl'
    ];
    
    const gradient = colors[template.category] || 'from-gray-400 to-gray-600';
    const pattern = patterns[template.id.length % patterns.length];
    
    return `${pattern} ${gradient}`;
  };

  return (
    <Card className="group cursor-pointer transition-all hover:shadow-lg border-2 hover:border-blue-200">
      <div className="relative">
        <div className={`aspect-[4/3] ${getMockImage(template)} rounded-t-lg flex items-center justify-center relative overflow-hidden`}>
          {/* Mock website layout overlay */}
          <div className="absolute inset-4 bg-white/90 rounded-sm shadow-sm">
            <div className="p-2 space-y-1">
              <div className="h-1 bg-gray-300 rounded w-full"></div>
              <div className="h-1 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded mt-2"></div>
              <div className="space-y-1 mt-2">
                <div className="h-1 bg-gray-200 rounded w-full"></div>
                <div className="h-1 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
          
          {/* Overlay buttons */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg flex items-center justify-center gap-2">
            <Button size="sm" variant="secondary" onClick={onPreview}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button size="sm" onClick={onApply}>
              <Download className="h-4 w-4 mr-2" />
              Use Template
            </Button>
          </div>
        </div>
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base font-semibold">
            {template.name}
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {template.category}
          </Badge>
        </div>
        <CardDescription className="text-sm line-clamp-2">
          {template.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-1">
          {template.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {template.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{template.tags.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function TemplatePreviewModal({ template, isOpen, onClose, onApply }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            {template.name}
          </DialogTitle>
          <DialogDescription>
            {template.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Template preview */}
          <div className={`aspect-[4/3] ${(() => {
            const colors = {
              business: 'from-blue-400 to-blue-600',
              ecommerce: 'from-green-400 to-green-600', 
              portfolio: 'from-purple-400 to-purple-600',
              landing: 'from-orange-400 to-orange-600',
              blog: 'from-indigo-400 to-indigo-600',
              restaurant: 'from-red-400 to-red-600'
            };
            const gradient = colors[template.category] || 'from-gray-400 to-gray-600';
            return `bg-gradient-to-br ${gradient}`;
          })()} rounded-lg flex items-center justify-center relative overflow-hidden`}>
            {/* Larger mock website layout */}
            <div className="absolute inset-8 bg-white/95 rounded shadow-lg">
              <div className="p-4 space-y-2">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="h-2 bg-gray-300 rounded w-20"></div>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-200 rounded"></div>
                    <div className="w-2 h-2 bg-gray-200 rounded"></div>
                    <div className="w-2 h-2 bg-gray-200 rounded"></div>
                  </div>
                </div>
                {/* Hero section */}
                <div className="bg-gray-50 rounded p-3 space-y-2">
                  <div className="h-2 bg-gray-300 rounded w-3/4 mx-auto"></div>
                  <div className="h-1 bg-gray-200 rounded w-1/2 mx-auto"></div>
                  <div className="h-4 bg-blue-100 rounded w-16 mx-auto mt-2"></div>
                </div>
                {/* Content sections */}
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div className="space-y-1">
                    <div className="h-3 bg-gray-100 rounded"></div>
                    <div className="h-1 bg-gray-100 rounded w-3/4"></div>
                  </div>
                  <div className="space-y-1">
                    <div className="h-3 bg-gray-100 rounded"></div>
                    <div className="h-1 bg-gray-100 rounded w-3/4"></div>
                  </div>
                  <div className="space-y-1">
                    <div className="h-3 bg-gray-100 rounded"></div>
                    <div className="h-1 bg-gray-100 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Template details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Blocks Included</h4>
              <div className="space-y-1">
                {template.blocks.map((block, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    <span className="capitalize">{block.type.replace(/([A-Z])/g, ' $1').trim()}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Tags</h4>
              <div className="flex flex-wrap gap-1">
                {template.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={onApply} className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Use This Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}