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
import Image from 'next/image';

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
    const newLogo = {
      id: Date.now().toString(),
      name: 'New Company',
      image: '/mock/logos/placeholder.svg'
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
      { id: '1', name: 'TechCorp', image: '/mock/logos/techcorp.svg' },
      { id: '2', name: 'InnovateLab', image: '/mock/logos/innovatelab.svg' },
      { id: '3', name: 'FutureWorks', image: '/mock/logos/futureworks.svg' },
      { id: '4', name: 'CloudVenture', image: '/mock/logos/cloudventure.svg' },
      { id: '5', name: 'DataFlow', image: '/mock/logos/dataflow.svg' }
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
              {/* Logo Image */}
              <div className="relative w-24 h-16 md:w-32 md:h-20">
                <Image
                  src={logo.image}
                  alt={logo.name}
                  fill
                  className={`object-contain transition-all duration-300 ${
                    grayscale ? 'grayscale opacity-60 hover:grayscale-0 hover:opacity-100' : ''
                  }`}
                />
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