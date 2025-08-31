'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Upload,
  ArrowRight,
  Users,
  Award,
  Target,
  Heart
} from "lucide-react";
import useEditorStore from '@/lib/store/editorStore';
import Image from 'next/image';

export default function AboutBlock({ content, settings, isEditing, blockId }) {
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

  const {
    imagePosition = 'right',
    columns = 1,
    bgColor = 'white',
    showStats = true
  } = settings;

  const {
    heading = 'About Our Company',
    content: textContent = 'We are passionate about creating tools that empower businesses to succeed online. Our team of experts has been building world-class software for over a decade, helping thousands of companies transform their digital presence.',
    image = '/mock/about/team.jpg',
    ctaButton = {
      text: 'Learn More',
      link: '#'
    },
    stats = [
      { label: 'Happy Customers', value: '10,000+', icon: 'Users' },
      { label: 'Years Experience', value: '12+', icon: 'Award' },
      { label: 'Projects Completed', value: '50,000+', icon: 'Target' },
      { label: 'Team Members', value: '25+', icon: 'Heart' }
    ]
  } = content;

  const getStatIcon = (iconName) => {
    const icons = {
      Users,
      Award,
      Target,
      Heart
    };
    return icons[iconName] || Users;
  };

  const bgColorClasses = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    blue: 'bg-blue-50',
    green: 'bg-green-50'
  };

  return (
    <section className={`py-16 px-6 md:px-8 ${bgColorClasses[bgColor]}`}>
      <div className="max-w-7xl mx-auto">
        <div className={`grid gap-12 items-center ${
          imagePosition === 'left' ? 'lg:grid-cols-2' :
          imagePosition === 'right' ? 'lg:grid-cols-2' :
          'grid-cols-1'
        } ${imagePosition === 'left' ? 'lg:grid-flow-col-dense' : ''}`}>
          
          {/* Text Content */}
          <div className={`${
            imagePosition === 'left' ? 'lg:col-start-2' : ''
          } ${columns === 2 ? 'lg:pr-8' : ''}`}>
            {/* Heading */}
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
                className="text-3xl font-bold border-2 border-blue-500 bg-white"
                autoFocus
              />
            ) : (
              <h2 
                className={`text-3xl md:text-4xl font-bold text-gray-900 mb-6 ${
                  isEditing ? 'cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors' : ''
                }`}
                onClick={() => isEditing && setIsEditingText('heading')}
              >
                {heading}
              </h2>
            )}

            {/* Content */}
            {isEditing && isEditingText === 'content' ? (
              <Textarea
                value={textContent}
                onChange={(e) => handleContentChange('content', e.target.value)}
                onBlur={(e) => {
                  handleContentChange('content', e.target.value);
                  setIsEditingText(null);
                }}
                className="text-lg border-2 border-blue-500 bg-white resize-none min-h-32"
                rows={6}
                autoFocus
              />
            ) : (
              <div 
                className={`text-lg text-gray-600 leading-relaxed mb-8 ${
                  columns === 2 ? 'columns-2 gap-8' : ''
                } ${
                  isEditing ? 'cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors' : ''
                }`}
                onClick={() => isEditing && setIsEditingText('content')}
              >
                {textContent.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}

            {/* CTA Button */}
            {ctaButton.text && (
              <div className="mb-8">
                {isEditing && isEditingText === 'cta' ? (
                  <Input
                    value={ctaButton.text}
                    onChange={(e) => handleContentChange('ctaButton', { ...ctaButton, text: e.target.value })}
                    onBlur={() => setIsEditingText(null)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setIsEditingText(null);
                    }}
                    className="border-2 border-blue-500 bg-white max-w-xs"
                    autoFocus
                  />
                ) : (
                  <Button 
                    size="lg"
                    className={`${
                      isEditing ? 'cursor-pointer hover:ring-2 hover:ring-blue-500' : ''
                    }`}
                    onClick={() => isEditing && setIsEditingText('cta')}
                  >
                    {ctaButton.text}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Image */}
          {imagePosition !== 'none' && (
            <div className={`${
              imagePosition === 'left' ? 'lg:col-start-1 lg:row-start-1' : ''
            }`}>
              <div className="relative">
                <div className="aspect-square lg:aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl">
                  <Image
                    src={image}
                    alt="About us"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Upload overlay for editing */}
                {isEditing && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center cursor-pointer">
                    <div className="text-center text-white">
                      <Upload className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">Click to change image</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Stats Section */}
        {showStats && stats.length > 0 && (
          <div className="mt-16 pt-12 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const IconComponent = getStatIcon(stat.icon);
                
                return (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-3">
                      <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                        <IconComponent className="h-6 w-6" />
                      </div>
                    </div>
                    
                    {isEditing && isEditingText === `stat-${index}-value` ? (
                      <Input
                        value={stat.value}
                        onChange={(e) => {
                          const updatedStats = [...stats];
                          updatedStats[index] = { ...stat, value: e.target.value };
                          handleContentChange('stats', updatedStats);
                        }}
                        onBlur={() => setIsEditingText(null)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') setIsEditingText(null);
                        }}
                        className="text-2xl font-bold text-center border-2 border-blue-500"
                        autoFocus
                      />
                    ) : (
                      <div 
                        className={`text-2xl md:text-3xl font-bold text-gray-900 mb-2 ${
                          isEditing ? 'cursor-pointer hover:bg-blue-50 p-1 rounded transition-colors' : ''
                        }`}
                        onClick={() => isEditing && setIsEditingText(`stat-${index}-value`)}
                      >
                        {stat.value}
                      </div>
                    )}
                    
                    {isEditing && isEditingText === `stat-${index}-label` ? (
                      <Input
                        value={stat.label}
                        onChange={(e) => {
                          const updatedStats = [...stats];
                          updatedStats[index] = { ...stat, label: e.target.value };
                          handleContentChange('stats', updatedStats);
                        }}
                        onBlur={() => setIsEditingText(null)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') setIsEditingText(null);
                        }}
                        className="text-center border-2 border-blue-500"
                        autoFocus
                      />
                    ) : (
                      <p 
                        className={`text-gray-600 ${
                          isEditing ? 'cursor-pointer hover:bg-blue-50 p-1 rounded transition-colors' : ''
                        }`}
                        onClick={() => isEditing && setIsEditingText(`stat-${index}-label`)}
                      >
                        {stat.label}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Editing helper */}
      {isEditing && (
        <div className="fixed bottom-4 left-4 bg-green-600 text-white text-xs px-3 py-2 rounded-md shadow-lg z-50">
          About Section • Click text to edit • Upload image to change
        </div>
      )}
    </section>
  );
}