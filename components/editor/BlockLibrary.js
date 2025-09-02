'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Star, 
  Grid, 
  MessageCircle, 
  ArrowRight, 
  Mail, 
  ShoppingBag,
  DollarSign,
  Building,
  Info,
  Image,
  Users,
  Plus,
  Upload,
  Folder,
  X,
  Eye
} from "lucide-react";
import { blockRegistry, getBlocksByCategory } from '@/lib/blocks/registry';
import useEditorStore from '@/lib/store/editorStore';
import { ImageUpload } from './controls';
import { toast } from "sonner";

// Icon mapping for blocks
const iconMap = {
  Star,
  Grid,
  MessageCircle,
  ArrowRight,
  Mail,
  ShoppingBag,
  DollarSign,
  Building,
  Info,
  Image,
  Users
};

export default function BlockLibrary({ onBlockSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [uploadedImages, setUploadedImages] = useState([
    // Mock uploaded images for demo
    { id: 1, url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop', name: 'hero-image-1.jpg' },
    { id: 2, url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop', name: 'team-photo.jpg' },
    { id: 3, url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop', name: 'office-space.jpg' },
  ]);
  
  const { addBlock, selectedBlockId, updateBlock, page } = useEditorStore();
  
  const categories = getBlocksByCategory();
  const categoryNames = Object.keys(categories);

  const handleAddBlock = (blockType) => {
    addBlock(blockType);
    toast.success(`${blockRegistry[blockType].name} block added!`);
    onBlockSelect?.();
  };

  const handleDragStart = (e, blockType) => {
    e.dataTransfer.setData('text/plain', blockType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleImageUpload = (url) => {
    const newImage = {
      id: Date.now(),
      url: url,
      name: `uploaded-image-${Date.now()}.jpg`
    };
    setUploadedImages(prev => [newImage, ...prev]);
    toast.success('Image uploaded successfully!');
  };

  const handleImageSelect = (imageUrl) => {
    if (selectedBlockId) {
      const selectedBlock = page.blocks.find(block => block.id === selectedBlockId);
      if (selectedBlock) {
        updateBlock(selectedBlockId, {
          content: {
            ...selectedBlock.content,
            en: {
              ...selectedBlock.content.en,
              image: imageUrl
            }
          }
        });
        toast.success('Image applied to selected block!');
      }
    } else {
      toast.info('Select a block first to apply this image');
    }
  };

  const handleRemoveImage = (imageId) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
    toast.success('Image removed from library');
  };

  // Filter blocks based on search and category
  const filteredBlocks = Object.values(blockRegistry).filter(block => {
    const matchesSearch = block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         block.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || block.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="blocks" className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Content Library
          </h2>
          
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="blocks" className="flex items-center gap-2">
              <Grid className="h-4 w-4" />
              Blocks
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Media
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="blocks" className="flex-1 flex flex-col mt-0">
          <div className="p-4 border-b border-gray-200">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search blocks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category tabs */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
              >
                All
              </Button>
              {categoryNames.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {category.replace('-', ' ')}
                </Button>
              ))}
            </div>
          </div>

          {/* Block list */}
          <ScrollArea className="flex-1 h-full">
            <div className="p-4 space-y-3">
              {filteredBlocks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No blocks found matching your search.</p>
                </div>
              ) : (
                filteredBlocks.map((block) => {
                  const IconComponent = iconMap[block.icon] || Grid;
                  
                  return (
                    <Card
                      key={block.id}
                      className="cursor-pointer hover:shadow-md transition-all duration-200 group"
                      onClick={() => handleAddBlock(block.id)}
                      draggable
                      onDragStart={(e) => handleDragStart(e, block.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                            <IconComponent className="h-5 w-5 text-blue-600" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-medium text-gray-900 truncate">
                                {block.name}
                              </h3>
                              <Plus className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                            </div>
                            
                            <p className="text-sm text-gray-500 line-clamp-2">
                              {block.description}
                            </p>
                            
                            <div className="mt-2">
                              <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md capitalize">
                                {block.category.replace('-', ' ')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-center">
              <p className="text-xs text-gray-500">
                {Object.keys(blockRegistry).length} blocks available
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="media" className="flex-1 flex flex-col mt-0">
          {/* Upload Section */}
          <div className="p-4 border-b border-gray-200">
            <ImageUpload
              value=""
              onChange={handleImageUpload}
              placeholder="Upload new image"
              className="w-full"
              showPreview={false}
              aspectRatio="auto"
            />
          </div>

          {/* Image Library */}
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">Image Library</h3>
                <span className="text-xs text-gray-500">{uploadedImages.length} images</span>
              </div>

              {uploadedImages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Folder className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No images uploaded yet</p>
                  <p className="text-xs">Upload images to use in your blocks</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {uploadedImages.map((image) => (
                    <Card
                      key={image.id}
                      className="cursor-pointer hover:shadow-md transition-all duration-200 group overflow-hidden"
                      onClick={() => handleImageSelect(image.url)}
                    >
                      <CardContent className="p-0 relative">
                        <div className="aspect-square bg-gray-100 flex items-center justify-center">
                          <img
                            src={image.url}
                            alt={image.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Overlay Controls */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                            <Button
                              size="icon"
                              variant="secondary"
                              className="rounded-full h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(image.url, '_blank');
                              }}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            
                            <Button
                              size="icon"
                              variant="destructive"
                              className="rounded-full h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveImage(image.id);
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Image Info */}
                        <div className="p-2">
                          <p className="text-xs text-gray-600 truncate" title={image.name}>
                            {image.name}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Instructions */}
          <div className="p-4 border-t border-gray-200 bg-blue-50">
            <div className="text-center">
              <p className="text-xs text-blue-600">
                💡 {selectedBlockId ? 'Click any image to apply it to the selected block' : 'Select a block first to apply images'}
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}