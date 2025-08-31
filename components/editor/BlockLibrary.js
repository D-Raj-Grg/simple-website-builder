'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
  Plus
} from "lucide-react";
import { blockRegistry, getBlocksByCategory } from '@/lib/blocks/registry';
import useEditorStore from '@/lib/store/editorStore';
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
  
  const { addBlock } = useEditorStore();
  
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

  // Filter blocks based on search and category
  const filteredBlocks = Object.values(blockRegistry).filter(block => {
    const matchesSearch = block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         block.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || block.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Block Library
        </h2>
        
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
      <ScrollArea className="flex-1">
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
    </div>
  );
}