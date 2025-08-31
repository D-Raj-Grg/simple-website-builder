'use client';

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Plus, 
  X, 
  Building,
  Upload
} from "lucide-react";
import useEditorStore from '@/lib/store/editorStore';

// Logo Design Component
function LogoDesign({ logo, grayscale }) {
  const { shortName, fullName, color, type, style } = logo;
  
  const baseClasses = `transition-all duration-300 ${grayscale ? 'grayscale' : ''}`;
  
  if (type === 'text') {
    const textStyles = {
      modern: 'font-light tracking-wider text-lg md:text-xl',
      bold: 'font-black text-base md:text-lg uppercase tracking-tight',
      tech: 'font-mono text-sm md:text-base tracking-widest'
    };
    
    return (
      <div className={`${baseClasses} text-center`} style={{ color }}>
        <div className={textStyles[style]}>
          {fullName}
        </div>
      </div>
    );
  }
  
  if (type === 'icon-text') {
    const containerStyles = {
      circle: 'rounded-full',
      square: 'rounded-md',
      minimal: 'rounded-none'
    };
    
    return (
      <div className={`${baseClasses} flex items-center gap-2`}>
        <div 
          className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-white font-bold text-xs md:text-sm ${containerStyles[style]}`}
          style={{ backgroundColor: color }}
        >
          {shortName}
        </div>
        <span className="font-semibold text-sm md:text-base text-gray-700">
          {fullName.split(/[\s&]+/)[0]}
        </span>
      </div>
    );
  }
  
  return null;
}

export default function LogoCloudBlock({ content, settings, isEditing, blockId }) {
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

  const addLogo = () => {
    const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#EC4899'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newLogo = {
      id: Date.now().toString(),
      name: 'New Company',
      image: null,
      color: randomColor,
      type: 'text'
    };
    handleContentChange('logos', [...logos, newLogo]);
  };

  const removeLogo = (logoId) => {
    handleContentChange('logos', logos.filter(logo => logo.id !== logoId));
  };

  const updateLogo = (logoId, key, value) => {
    const updatedLogos = logos.map(logo =>
      logo.id === logoId ? { ...logo, [key]: value } : logo
    );
    handleContentChange('logos', updatedLogos);
  };

  const {
    perRow = 5,
    grayscale = true,
    animation = 'static',
    spacing = 'medium'
  } = settings;

  const {
    heading = 'Trusted by Industry Leaders',
    logos = [
      { id: '1', name: 'TechCorp', image: null, color: '#3B82F6', type: 'text' },
      { id: '2', name: 'InnovateLab', image: null, color: '#10B981', type: 'text' },
      { id: '3', name: 'FutureWorks', image: null, color: '#8B5CF6', type: 'text' },
      { id: '4', name: 'CloudVenture', image: null, color: '#F59E0B', type: 'text' },
      { id: '5', name: 'DataFlow', image: null, color: '#EF4444', type: 'text' },
      { id: '6', name: 'NexusAI', image: null, color: '#06B6D4', type: 'text' }
    ]
  } = content;

  const gridClasses = {
    4: 'grid-cols-2 md:grid-cols-4',
    5: 'grid-cols-3 md:grid-cols-5',
    6: 'grid-cols-3 md:grid-cols-6'
  };

  const spacingClasses = {
    tight: 'gap-4',
    medium: 'gap-6',
    loose: 'gap-8'
  };

  const animationClasses = {
    static: '',
    scroll: 'animate-scroll',
    float: 'animate-float'
  };

  // Generate realistic logo designs
  const generateLogoDesign = (logo) => {
    const designs = [
      // Text-based logos with different styles
      { type: 'text', style: 'modern' },
      { type: 'text', style: 'bold' },
      { type: 'text', style: 'tech' },
      { type: 'icon-text', style: 'circle' },
      { type: 'icon-text', style: 'square' },
      { type: 'icon-text', style: 'minimal' }
    ];
    
    const design = designs[parseInt(logo.id) % designs.length];
    const shortName = logo.name.split(/[\s&]+/).map(word => word.charAt(0)).join('').slice(0, 2);
    
    return {
      shortName,
      fullName: logo.name,
      color: logo.color || '#3B82F6',
      ...design
    };
  };

  return (
    <section className="py-16 px-6 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        {heading && (
          <div className="text-center mb-12">
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
                className="text-2xl font-semibold border-2 border-blue-500 bg-white text-center"
                autoFocus
              />
            ) : (
              <h2 
                className={`text-2xl md:text-3xl font-semibold text-gray-900 ${
                  isEditing ? 'cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors' : ''
                }`}
                onClick={() => isEditing && setIsEditingText('heading')}
              >
                {heading}
              </h2>
            )}
          </div>
        )}

        {/* Logos Grid */}
        <div className={`grid ${gridClasses[perRow]} ${spacingClasses[spacing]} items-center justify-items-center`}>
          {logos.map((logo, index) => (
            <div 
              key={logo.id}
              className={`relative group flex items-center justify-center p-4 ${animationClasses[animation]}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Logo Design */}
              <div className={`relative w-24 h-16 md:w-32 md:h-20 flex items-center justify-center transition-all duration-300 ${
                grayscale ? 'opacity-60 hover:opacity-100' : ''
              }`}>
                <LogoDesign logo={generateLogoDesign(logo)} grayscale={grayscale} />
              </div>

              {/* Edit Controls */}
              {isEditing && (
                <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => removeLogo(logo.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}

              {/* Logo Name (hidden by default, shown on hover in editing mode) */}
              {isEditing && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  {logo.name}
                </div>
              )}
            </div>
          ))}

          {/* Add Logo Button */}
          {isEditing && (
            <div className="flex items-center justify-center p-4">
              <Button
                variant="outline"
                size="icon"
                className="h-16 w-24 md:h-20 md:w-32 border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors"
                onClick={addLogo}
              >
                <div className="text-center">
                  <Plus className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                  <span className="text-xs text-gray-500">Add Logo</span>
                </div>
              </Button>
            </div>
          )}
        </div>

        {/* Stats (optional - shown only if not editing) */}
        {!isEditing && logos.length >= 4 && (
          <div className="text-center mt-12">
            <p className="text-sm text-gray-500">
              Trusted by {logos.length}+ leading companies worldwide
            </p>
          </div>
        )}
      </div>

      {/* Editing helper */}
      {isEditing && (
        <div className="fixed bottom-4 left-4 bg-green-600 text-white text-xs px-3 py-2 rounded-md shadow-lg z-50">
          Logo Cloud • Click heading to edit • Use settings for layout
        </div>
      )}

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}