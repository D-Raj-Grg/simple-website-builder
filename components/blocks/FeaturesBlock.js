'use client';

import { useState, memo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Plus, 
  Trash2, 
  Zap, 
  Shield, 
  Users, 
  Star,
  Grid,
  Heart,
  Smartphone,
  Globe,
  Clock
} from "lucide-react";
import useEditorStore from '@/lib/store/editorStore';

// Icon mapping
const iconMap = {
  Zap, Shield, Users, Star, Grid, Heart, Smartphone, Globe, Clock
};

const FeaturesBlock = memo(function FeaturesBlock({ content, settings, isEditing, blockId }) {
  const [isEditingText, setIsEditingText] = useState(null);
  const { updateBlock, currentLanguage } = useEditorStore();

  const handleContentChange = (key, value) => {
    updateBlock(blockId, {
      content: {
        ...content,
        [currentLanguage]: {
          ...content,
          [key]: value
        }
      }
    });
  };

  const handleItemChange = (itemId, field, value) => {
    const updatedItems = content.items?.map(item => 
      item.id === itemId ? { ...item, [field]: value } : item
    ) || [];
    
    handleContentChange('items', updatedItems);
  };

  const addFeatureItem = () => {
    const newItem = {
      id: Date.now().toString(),
      icon: 'Star',
      title: 'New Feature',
      description: 'Feature description'
    };
    
    const updatedItems = [...(content.items || []), newItem];
    handleContentChange('items', updatedItems);
  };

  const removeFeatureItem = (itemId) => {
    const updatedItems = content.items?.filter(item => item.id !== itemId) || [];
    handleContentChange('items', updatedItems);
  };

  const {
    columns = 3,
    iconStyle = 'outlined',
    alignment = 'center'
  } = settings;

  const {
    heading = 'Why Choose Us',
    items = [
      {
        id: '1',
        icon: 'Zap',
        title: 'Lightning Fast',
        description: 'Built for speed and performance with modern web technologies.'
      },
      {
        id: '2',
        icon: 'Shield',
        title: 'Secure & Reliable',
        description: 'Enterprise-grade security with 99.9% uptime guarantee.'
      },
      {
        id: '3',
        icon: 'Users',
        title: 'Expert Support',
        description: '24/7 customer support from our team of experts.'
      }
    ]
  } = content;

  const columnClasses = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4'
  };

  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  return (
    <section className="py-16 px-6 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className={`mb-12 ${alignmentClasses[alignment]}`}>
          {isEditing && isEditingText === 'heading' ? (
            <Input
              value={heading}
              onChange={(e) => handleContentChange('heading', e.target.value)}
              onBlur={(e) => {
                handleContentChange('heading', e.target.value);
                setIsEditingText(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleContentChange('heading', e.target.value);
                  setIsEditingText(null);
                }
              }}
              className="text-3xl font-bold border-2 border-blue-500 bg-white text-center"
              autoFocus
            />
          ) : (
            <h2 
              className={`text-3xl md:text-4xl font-bold text-gray-900 ${
                isEditing ? 'cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors' : ''
              }`}
              onClick={() => isEditing && setIsEditingText('heading')}
            >
              {heading}
            </h2>
          )}
        </div>

        {/* Features Grid */}
        <div className={`grid grid-cols-1 ${columnClasses[columns]} gap-8`}>
          {items.map((item, index) => {
            const IconComponent = iconMap[item.icon] || Star;
            
            return (
              <Card key={item.id} className="border-0 shadow-none bg-gray-50 hover:bg-gray-100 transition-colors group">
                <CardContent className="p-6">
                  <div className={`${alignmentClasses[alignment]} space-y-4`}>
                    {/* Icon */}
                    <div className={`${alignment === 'center' ? 'mx-auto' : ''} w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors`}>
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>

                    {/* Title */}
                    <div>
                      {isEditing && isEditingText === `title-${item.id}` ? (
                        <Input
                          value={item.title}
                          onChange={(e) => handleItemChange(item.id, 'title', e.target.value)}
                          onBlur={() => setIsEditingText(null)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') setIsEditingText(null);
                          }}
                          className="font-semibold border-2 border-blue-500"
                          autoFocus
                        />
                      ) : (
                        <h3 
                          className={`text-xl font-semibold text-gray-900 ${
                            isEditing ? 'cursor-pointer hover:bg-blue-50 p-1 rounded' : ''
                          }`}
                          onClick={() => isEditing && setIsEditingText(`title-${item.id}`)}
                        >
                          {item.title}
                        </h3>
                      )}
                    </div>

                    {/* Description */}
                    <div>
                      {isEditing && isEditingText === `description-${item.id}` ? (
                        <Textarea
                          value={item.description}
                          onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                          onBlur={() => setIsEditingText(null)}
                          className="border-2 border-blue-500 resize-none"
                          rows={3}
                          autoFocus
                        />
                      ) : (
                        <p 
                          className={`text-gray-600 leading-relaxed ${
                            isEditing ? 'cursor-pointer hover:bg-blue-50 p-1 rounded' : ''
                          }`}
                          onClick={() => isEditing && setIsEditingText(`description-${item.id}`)}
                        >
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Edit controls */}
                    {isEditing && (
                      <div className="pt-2 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFeatureItem(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Add New Feature Card */}
          {isEditing && (
            <Card className="border-2 border-dashed border-gray-300 hover:border-blue-300 transition-colors cursor-pointer" onClick={addFeatureItem}>
              <CardContent className="p-6 flex items-center justify-center h-full min-h-[200px]">
                <div className="text-center">
                  <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 font-medium">Add Feature</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Editing helper */}
      {isEditing && (
        <div className="fixed bottom-4 left-4 bg-green-600 text-white text-xs px-3 py-2 rounded-md shadow-lg z-50">
          Features Block • Click to edit • Hover to manage
        </div>
      )}
    </section>
  );
});

export default FeaturesBlock;