'use client';

import { useState, memo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Upload, Play } from "lucide-react";
import useEditorStore from '@/lib/store/editorStore';
import Image from 'next/image';

/**
 * Hero block component for displaying main page header with CTA
 * Supports inline text editing, image positioning, and responsive design
 * @param {Object} props - Component properties
 * @param {Object} props.content - Block content data (multilingual)
 * @param {Object} props.settings - Block settings (imagePosition, textSize, alignment, bgColor)
 * @param {boolean} props.isEditing - Whether block is in edit mode
 * @param {string} props.blockId - Unique identifier for the block
 * @returns {JSX.Element} Hero block component
 */
const HeroBlock = memo(function HeroBlock({ content, settings, isEditing, blockId }) {
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

  const handleInlineEdit = (field, value) => {
    handleContentChange(field, value);
    setIsEditingText(null);
  };

  const {
    imagePosition = 'center',
    textSize = 'L',
    alignment = 'center',
    bgColor = 'white'
  } = settings;

  const {
    heading = 'Transform Your Business Today',
    subheading = 'Build beautiful, professional websites in minutes with our intuitive drag-and-drop builder.',
    ctaButton = { text: 'Get Started', link: '#' },
    image = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=600&fit=crop&auto=format'
  } = content;

  // Dynamic classes based on settings
  const textSizeClasses = {
    S: 'text-3xl md:text-4xl',
    M: 'text-4xl md:text-5xl',
    L: 'text-5xl md:text-6xl',
    XL: 'text-6xl md:text-7xl'
  };

  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  const imagePositionLayout = {
    left: 'md:flex-row',
    center: 'flex-col',
    right: 'md:flex-row-reverse'
  };

  return (
    <section className={`py-16 px-6 md:px-8 ${bgColor === 'gray' ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto">
        <div className={`flex flex-col gap-12 items-center ${imagePositionLayout[imagePosition]}`}>
          {/* Text Content */}
          <div className={`flex-1 space-y-6 ${alignmentClasses[alignment]}`}>
            {/* Heading */}
            <div>
              {isEditing && isEditingText === 'heading' ? (
                <Input
                  value={heading}
                  onChange={(e) => handleContentChange('heading', e.target.value)}
                  onBlur={(e) => handleInlineEdit('heading', e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleInlineEdit('heading', e.target.value);
                    }
                  }}
                  className="text-4xl font-bold border-2 border-blue-500 bg-white"
                  autoFocus
                />
              ) : (
                <h1 
                  className={`font-bold text-gray-900 leading-tight ${textSizeClasses[textSize]} ${
                    isEditing ? 'cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors' : ''
                  }`}
                  onClick={() => isEditing && setIsEditingText('heading')}
                >
                  {heading}
                </h1>
              )}
            </div>

            {/* Subheading */}
            <div>
              {isEditing && isEditingText === 'subheading' ? (
                <Textarea
                  value={subheading}
                  onChange={(e) => handleContentChange('subheading', e.target.value)}
                  onBlur={(e) => handleInlineEdit('subheading', e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey) {
                      handleInlineEdit('subheading', e.target.value);
                    }
                  }}
                  className="text-xl border-2 border-blue-500 bg-white resize-none"
                  rows={3}
                  autoFocus
                />
              ) : (
                <p 
                  className={`text-xl text-gray-600 leading-relaxed max-w-2xl ${
                    alignment === 'center' ? 'mx-auto' : ''
                  } ${
                    isEditing ? 'cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors' : ''
                  }`}
                  onClick={() => isEditing && setIsEditingText('subheading')}
                >
                  {subheading}
                </p>
              )}
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              {isEditing && isEditingText === 'ctaButton' ? (
                <div className="flex gap-2 max-w-md">
                  <Input
                    value={ctaButton.text}
                    onChange={(e) => handleContentChange('ctaButton', {
                      ...ctaButton,
                      text: e.target.value
                    })}
                    onBlur={() => setIsEditingText(null)}
                    className="border-2 border-blue-500"
                    placeholder="Button text"
                    autoFocus
                  />
                  <Input
                    value={ctaButton.link}
                    onChange={(e) => handleContentChange('ctaButton', {
                      ...ctaButton,
                      link: e.target.value
                    })}
                    onBlur={() => setIsEditingText(null)}
                    className="border-2 border-blue-500"
                    placeholder="Button link"
                  />
                </div>
              ) : (
                <Button 
                  size="lg" 
                  className={`px-8 py-4 text-lg font-semibold ${
                    isEditing ? 'cursor-pointer ring-2 ring-offset-2 ring-blue-500 ring-opacity-0 hover:ring-opacity-100 transition-all' : ''
                  }`}
                  onClick={() => isEditing ? setIsEditingText('ctaButton') : undefined}
                >
                  <Play className="mr-2 h-5 w-5" />
                  {ctaButton.text}
                </Button>
              )}
            </div>
          </div>

          {/* Image */}
          {imagePosition !== 'center' && (
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                {image ? (
                  <div className="relative w-full h-96 rounded-lg overflow-hidden">
                    <Image
                      src={image}
                      alt="Hero image"
                      fill
                      className="object-cover"
                      priority
                    />
                    {isEditing && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Button variant="secondary" size="sm">
                          <Upload className="mr-2 h-4 w-4" />
                          Change Image
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                    {isEditing ? (
                      <Button variant="outline">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Image
                      </Button>
                    ) : (
                      <span className="text-gray-400">No image</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Background Image for center position */}
        {imagePosition === 'center' && image && (
          <div className="relative -z-10">
            <div className="absolute inset-0 w-full h-full">
              <Image
                src={image}
                alt="Hero background"
                fill
                className="object-cover rounded-lg opacity-10"
                priority
              />
            </div>
          </div>
        )}
      </div>

      {/* Editing helpers */}
      {isEditing && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white text-xs px-3 py-2 rounded-md shadow-lg z-50">
          Click text to edit • Press Enter to save
        </div>
      )}
    </section>
  );
});

export default HeroBlock;