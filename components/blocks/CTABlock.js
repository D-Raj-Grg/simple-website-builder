'use client';

import { useState, memo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ArrowRight, Play, Download, Plus, Trash2 } from "lucide-react";
import useEditorStore from '@/lib/store/editorStore';

const CTABlock = memo(function CTABlock({ content, settings, isEditing, blockId }) {
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

  const handleButtonChange = (buttonId, field, value) => {
    const updatedButtons = content.buttons?.map(btn => 
      btn.id === buttonId ? { ...btn, [field]: value } : btn
    ) || [];
    
    handleContentChange('buttons', updatedButtons);
  };

  const addButton = () => {
    const newButton = {
      id: Date.now().toString(),
      text: 'New Button',
      link: '#',
      style: 'secondary'
    };
    
    const updatedButtons = [...(content.buttons || []), newButton];
    handleContentChange('buttons', updatedButtons);
  };

  const removeButton = (buttonId) => {
    const updatedButtons = content.buttons?.filter(btn => btn.id !== buttonId) || [];
    handleContentChange('buttons', updatedButtons);
  };

  const {
    background = 'gradient',
    buttonStyle = 'primary',
    layout = 'centered'
  } = settings;

  const {
    heading = 'Ready to Get Started?',
    description = 'Join thousands of businesses already using our platform to grow their online presence.',
    buttons = [
      {
        id: '1',
        text: 'Start Free Trial',
        link: '#',
        style: 'primary'
      },
      {
        id: '2',
        text: 'View Pricing',
        link: '#',
        style: 'secondary'
      }
    ]
  } = content;

  // Background styles
  const backgroundClasses = {
    color: 'bg-blue-600',
    gradient: 'bg-gradient-to-r from-blue-600 to-purple-700',
    image: 'bg-gray-900 bg-cover bg-center'
  };

  return (
    <section className={`py-20 px-6 md:px-8 ${backgroundClasses[background]}`}>
      <div className="max-w-4xl mx-auto text-center">
        {/* Heading */}
        <div className="mb-6">
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
              className="text-3xl font-bold border-2 border-blue-500 bg-white text-center text-gray-900"
              autoFocus
            />
          ) : (
            <h2 
              className={`text-3xl md:text-4xl font-bold text-white mb-4 ${
                isEditing ? 'cursor-pointer hover:bg-white hover:bg-opacity-10 p-2 rounded transition-colors' : ''
              }`}
              onClick={() => isEditing && setIsEditingText('heading')}
            >
              {heading}
            </h2>
          )}
        </div>

        {/* Description */}
        <div className="mb-8">
          {isEditing && isEditingText === 'description' ? (
            <Textarea
              value={description}
              onChange={(e) => handleContentChange('description', e.target.value)}
              onBlur={(e) => {
                handleContentChange('description', e.target.value);
                setIsEditingText(null);
              }}
              className="text-xl border-2 border-blue-500 bg-white resize-none text-center text-gray-700"
              rows={3}
              autoFocus
            />
          ) : (
            <p 
              className={`text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto ${
                isEditing ? 'cursor-pointer hover:bg-white hover:bg-opacity-10 p-2 rounded transition-colors' : ''
              }`}
              onClick={() => isEditing && setIsEditingText('description')}
            >
              {description}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap">
          {buttons.map((button, index) => {
            const buttonVariant = button.style === 'primary' ? 'default' : 'outline';
            const buttonClasses = button.style === 'primary' 
              ? 'bg-white text-blue-600 hover:bg-gray-100 border-white' 
              : 'border-white text-white hover:bg-white hover:text-blue-600';

            return (
              <div key={button.id} className="relative group">
                {isEditing && isEditingText === `button-${button.id}` ? (
                  <div className="flex gap-2">
                    <Input
                      value={button.text}
                      onChange={(e) => handleButtonChange(button.id, 'text', e.target.value)}
                      onBlur={() => setIsEditingText(null)}
                      className="border-2 border-blue-500"
                      placeholder="Button text"
                      autoFocus
                    />
                    <Input
                      value={button.link}
                      onChange={(e) => handleButtonChange(button.id, 'link', e.target.value)}
                      onBlur={() => setIsEditingText(null)}
                      className="border-2 border-blue-500"
                      placeholder="Button link"
                    />
                  </div>
                ) : (
                  <>
                    <Button 
                      size="lg" 
                      variant={buttonVariant}
                      className={`px-8 py-4 text-lg font-semibold ${buttonClasses} ${
                        isEditing ? 'cursor-pointer' : ''
                      }`}
                      onClick={() => isEditing ? setIsEditingText(`button-${button.id}`) : undefined}
                    >
                      {button.style === 'primary' && <ArrowRight className="mr-2 h-5 w-5" />}
                      {button.text}
                    </Button>
                    
                    {/* Edit controls */}
                    {isEditing && (
                      <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6 bg-red-600 text-white border-red-600 hover:bg-red-700"
                          onClick={() => removeButton(button.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}

          {/* Add Button */}
          {isEditing && buttons.length < 3 && (
            <Button
              variant="outline"
              size="lg"
              className="border-white border-dashed text-white hover:bg-white hover:text-blue-600 px-8 py-4"
              onClick={addButton}
            >
              <Plus className="mr-2 h-5 w-5" />
              Add Button
            </Button>
          )}
        </div>
      </div>

      {/* Editing helper */}
      {isEditing && (
        <div className="fixed bottom-4 right-4 bg-purple-600 text-white text-xs px-3 py-2 rounded-md shadow-lg z-50">
          CTA Block • Click to edit • Hover buttons to manage
        </div>
      )}
    </section>
  );
});

export default CTABlock;