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

  // Enhanced Settings Destructuring
  const {
    // Layout Settings
    layout = { 
      columns: 3,
      gridGap: 'lg',
      alignment: 'center',
      maxWidth: '7xl',
      padding: { top: 16, bottom: 16, x: 6 }
    },
    
    // Header Settings
    header = {
      show: true,
      alignment: 'center',
      size: 'xl',
      weight: 'bold',
      spacing: 12,
      color: 'gray-900'
    },
    
    // Features Grid Settings
    featuresGrid = {
      cardStyle: 'elevated',
      iconStyle: 'filled',
      iconSize: 'md',
      iconColor: 'blue',
      titleSize: 'xl',
      titleWeight: 'semibold',
      descriptionSize: 'base',
      contentAlignment: 'center',
      spacing: 4
    },
    
    // Visual Enhancements
    background = { type: 'none', color: '#ffffff' },
    borderRadius = { preset: 'md' },
    shadow = { enabled: false, preset: 'none' },
    animation = { enabled: false, entrance: 'none', hover: 'none' },
    
    // Legacy settings for backward compatibility
    columns = 3,
    iconStyle = 'outlined',
    alignment = 'center'
  } = settings;

  // Use enhanced settings or fall back to legacy
  const actualColumns = layout?.columns || columns;
  const actualAlignment = layout?.alignment || alignment;
  const actualIconStyle = featuresGrid?.iconStyle || iconStyle;

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

  // Enhanced Dynamic Classes
  const getLayoutClasses = () => {
    const columnClasses = {
      1: 'grid-cols-1',
      2: 'sm:grid-cols-1 md:grid-cols-2',
      3: 'sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4',
      5: 'sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
      6: 'sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
    };
    
    const gapClasses = {
      sm: 'gap-4',
      md: 'gap-6',
      lg: 'gap-8',
      xl: 'gap-10'
    };
    
    const maxWidthClasses = {
      sm: 'max-w-2xl',
      md: 'max-w-4xl',
      lg: 'max-w-6xl',
      xl: 'max-w-7xl',
      '2xl': 'max-w-screen-2xl'
    };
    
    return `grid ${columnClasses[actualColumns]} ${gapClasses[layout.gridGap]} ${maxWidthClasses[layout.maxWidth]} mx-auto`;
  };

  const getAlignmentClasses = (align = actualAlignment) => {
    const classes = {
      left: 'text-left items-start',
      center: 'text-center items-center',
      right: 'text-right items-end'
    };
    return classes[align] || classes.center;
  };

  const getHeaderClasses = () => {
    const sizeClasses = {
      sm: 'text-2xl',
      md: 'text-3xl',
      lg: 'text-3xl md:text-4xl',
      xl: 'text-4xl md:text-5xl',
      '2xl': 'text-5xl md:text-6xl'
    };
    
    const weightClasses = {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
      extrabold: 'font-extrabold'
    };
    
    const spacingClasses = {
      4: 'mb-4',
      6: 'mb-6',
      8: 'mb-8',
      10: 'mb-10',
      12: 'mb-12',
      16: 'mb-16'
    };
    
    return `${sizeClasses[header.size]} ${weightClasses[header.weight]} text-${header.color} ${spacingClasses[header.spacing]}`;
  };

  const getCardClasses = () => {
    const styleClasses = {
      flat: 'border-0 shadow-none bg-transparent',
      outlined: 'border border-gray-200 shadow-none bg-white',
      elevated: 'border-0 shadow-sm bg-white hover:shadow-md',
      filled: 'border-0 shadow-none bg-gray-50 hover:bg-gray-100'
    };
    
    const radiusClass = borderRadius.preset !== 'none' ? `rounded-${borderRadius.preset}` : '';
    const shadowClass = shadow.enabled ? `shadow-${shadow.preset}` : '';
    const animationClass = animation.enabled ? `transition-all duration-300 ${animation.hover}` : 'transition-colors';
    
    return `${styleClasses[featuresGrid.cardStyle]} ${radiusClass} ${shadowClass} ${animationClass} group`;
  };

  const getIconClasses = () => {
    const sizeClasses = {
      sm: 'w-8 h-8',
      md: 'w-12 h-12',
      lg: 'w-16 h-16'
    };
    
    const colorClasses = {
      blue: 'bg-blue-100 text-blue-600 group-hover:bg-blue-200',
      green: 'bg-green-100 text-green-600 group-hover:bg-green-200',
      purple: 'bg-purple-100 text-purple-600 group-hover:bg-purple-200',
      orange: 'bg-orange-100 text-orange-600 group-hover:bg-orange-200',
      red: 'bg-red-100 text-red-600 group-hover:bg-red-200',
      gray: 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
    };
    
    const radiusClass = borderRadius.preset !== 'none' ? `rounded-${borderRadius.preset}` : 'rounded-lg';
    
    return `${sizeClasses[featuresGrid.iconSize]} ${colorClasses[featuresGrid.iconColor]} ${radiusClass} flex items-center justify-center transition-colors ${
      actualAlignment === 'center' ? 'mx-auto' : ''
    }`;
  };

  const getTitleClasses = () => {
    const sizeClasses = {
      sm: 'text-lg',
      md: 'text-xl',
      lg: 'text-xl',
      xl: 'text-xl',
      '2xl': 'text-2xl'
    };
    
    const weightClasses = {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold'
    };
    
    return `${sizeClasses[featuresGrid.titleSize]} ${weightClasses[featuresGrid.titleWeight]} text-gray-900`;
  };

  const getDescriptionClasses = () => {
    const sizeClasses = {
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg'
    };
    
    return `${sizeClasses[featuresGrid.descriptionSize]} text-gray-600 leading-relaxed`;
  };

  const getSectionClasses = () => {
    const paddingClass = `py-${layout.padding.top} px-${layout.padding.x} md:px-8`;
    
    let backgroundClass = '';
    if (background.type === 'color') {
      backgroundClass = `bg-[${background.color}]`;
    } else if (background.type === 'none') {
      backgroundClass = 'bg-white';
    }
    
    const animationClass = animation.enabled && animation.entrance !== 'none' 
      ? `animate-in ${animation.entrance} duration-${animation.duration}ms`
      : '';
      
    return `${paddingClass} ${backgroundClass} ${animationClass}`.trim();
  };

  const getSpacingClasses = () => {
    const spacingClasses = {
      1: 'space-y-1',
      2: 'space-y-2',
      3: 'space-y-3',
      4: 'space-y-4',
      6: 'space-y-6',
      8: 'space-y-8'
    };
    return spacingClasses[featuresGrid.spacing] || 'space-y-4';
  };

  return (
    <section className={getSectionClasses()}>
      <div className={layout.maxWidth ? `max-w-${layout.maxWidth} mx-auto` : 'max-w-7xl mx-auto'}>
        {/* Section Heading */}
        {header.show && (
          <div className={`${getAlignmentClasses(header.alignment)} ${getHeaderClasses()}`}>
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
                className={`${getHeaderClasses()} border-2 border-blue-500 bg-white ${getAlignmentClasses(header.alignment)}`}
                autoFocus
              />
            ) : (
              <h2 
                className={`${getHeaderClasses()} ${
                  isEditing ? 'cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors' : ''
                }`}
                onClick={() => isEditing && setIsEditingText('heading')}
              >
                {heading}
              </h2>
            )}
          </div>
        )}

        {/* Features Grid */}
        <div className={getLayoutClasses()}>
          {items.map((item, index) => {
            const IconComponent = iconMap[item.icon] || Star;
            
            return (
              <Card key={item.id} className={getCardClasses()}>
                <CardContent className="p-6">
                  <div className={`${getAlignmentClasses(featuresGrid.contentAlignment)} ${getSpacingClasses()}`}>
                    {/* Icon */}
                    <div className={getIconClasses()}>
                      <IconComponent className={`h-${featuresGrid.iconSize === 'sm' ? '4' : featuresGrid.iconSize === 'md' ? '6' : '8'} w-${featuresGrid.iconSize === 'sm' ? '4' : featuresGrid.iconSize === 'md' ? '6' : '8'} text-current`} />
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
                          className={`${getTitleClasses()} border-2 border-blue-500`}
                          autoFocus
                        />
                      ) : (
                        <h3 
                          className={`${getTitleClasses()} ${
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
                          className={`${getDescriptionClasses()} border-2 border-blue-500 resize-none`}
                          rows={3}
                          autoFocus
                        />
                      ) : (
                        <p 
                          className={`${getDescriptionClasses()} ${
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