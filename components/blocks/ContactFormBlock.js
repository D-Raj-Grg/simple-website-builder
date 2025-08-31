'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send,
  Plus,
  Trash2,
  User,
  MessageSquare,
  Check
} from "lucide-react";
import useEditorStore from '@/lib/store/editorStore';

export default function ContactFormBlock({ content, settings, isEditing, blockId }) {
  const [isEditingText, setIsEditingText] = useState(null);
  const [formData, setFormData] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
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

  const handleFieldChange = (fieldId, property, value) => {
    const updatedFields = content.formFields?.map(field => 
      field.id === fieldId ? { ...field, [property]: value } : field
    ) || [];
    
    handleContentChange('formFields', updatedFields);
  };

  const addFormField = () => {
    const fieldTypes = ['text', 'email', 'textarea', 'phone'];
    const randomType = fieldTypes[Math.floor(Math.random() * fieldTypes.length)];
    
    const newField = {
      id: Date.now().toString(),
      type: randomType,
      label: `New ${randomType} field`,
      required: false
    };
    
    const updatedFields = [...(content.formFields || []), newField];
    handleContentChange('formFields', updatedFields);
  };

  const removeFormField = (fieldId) => {
    const updatedFields = content.formFields?.filter(field => field.id !== fieldId) || [];
    handleContentChange('formFields', updatedFields);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!isEditing) {
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  const handleInputChange = (fieldId, value) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const {
    layout = 'single',
    showMap = false,
    fields = ['name', 'email', 'message']
  } = settings;

  const {
    heading = 'Get In Touch',
    description = 'Have questions? We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.',
    submitText = 'Send Message',
    successMessage = 'Thank you! We\'ll get back to you soon.',
    formFields = [
      { id: 'name', type: 'text', label: 'Full Name', required: true },
      { id: 'email', type: 'email', label: 'Email Address', required: true },
      { id: 'message', type: 'textarea', label: 'Message', required: true }
    ]
  } = content;

  const renderFormField = (field) => {
    const fieldValue = formData[field.id] || '';
    
    return (
      <div key={field.id} className="space-y-2 group relative">
        {/* Field Label */}
        <div className="flex items-center gap-2">
          {isEditing && isEditingText === `label-${field.id}` ? (
            <Input
              value={field.label}
              onChange={(e) => handleFieldChange(field.id, 'label', e.target.value)}
              onBlur={() => setIsEditingText(null)}
              className="font-medium border-2 border-blue-500"
              autoFocus
            />
          ) : (
            <Label 
              htmlFor={field.id}
              className={`font-medium text-gray-700 ${
                isEditing ? 'cursor-pointer hover:bg-blue-50 p-1 rounded' : ''
              }`}
              onClick={() => isEditing && setIsEditingText(`label-${field.id}`)}
            >
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
          )}
          
          {isEditing && (
            <Switch
              checked={field.required}
              onCheckedChange={(checked) => handleFieldChange(field.id, 'required', checked)}
              className="ml-2"
            />
          )}
        </div>

        {/* Form Input */}
        {field.type === 'textarea' ? (
          <Textarea
            id={field.id}
            placeholder={isEditing ? `${field.label} placeholder` : `Enter your ${field.label.toLowerCase()}`}
            value={fieldValue}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            required={field.required}
            rows={4}
            className="resize-none"
          />
        ) : (
          <Input
            id={field.id}
            type={field.type}
            placeholder={isEditing ? `${field.label} placeholder` : `Enter your ${field.label.toLowerCase()}`}
            value={fieldValue}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            required={field.required}
          />
        )}

        {/* Field Controls */}
        {isEditing && (
          <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6 bg-red-600 text-white border-red-600 hover:bg-red-700"
              onClick={() => removeFormField(field.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="py-16 px-6 md:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Section Heading */}
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
              className="text-3xl font-bold border-2 border-blue-500 bg-white text-center"
              autoFocus
            />
          ) : (
            <h2 
              className={`text-3xl md:text-4xl font-bold text-gray-900 mb-4 ${
                isEditing ? 'cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors' : ''
              }`}
              onClick={() => isEditing && setIsEditingText('heading')}
            >
              {heading}
            </h2>
          )}

          {isEditing && isEditingText === 'description' ? (
            <Textarea
              value={description}
              onChange={(e) => handleContentChange('description', e.target.value)}
              onBlur={(e) => {
                handleContentChange('description', e.target.value);
                setIsEditingText(null);
              }}
              className="text-xl border-2 border-blue-500 bg-white resize-none text-center"
              rows={2}
              autoFocus
            />
          ) : (
            <p 
              className={`text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto ${
                isEditing ? 'cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors' : ''
              }`}
              onClick={() => isEditing && setIsEditingText('description')}
            >
              {description}
            </p>
          )}
        </div>

        <div className={`grid ${layout === 'two-col' ? 'md:grid-cols-2' : 'grid-cols-1'} gap-12`}>
          {/* Contact Form */}
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <form onSubmit={handleFormSubmit} className="space-y-6">
                {formFields.map(renderFormField)}

                {/* Add Field Button */}
                {isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-dashed border-gray-300 hover:border-blue-300 text-gray-500"
                    onClick={addFormField}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Form Field
                  </Button>
                )}

                {/* Submit Button */}
                <div>
                  {isEditing && isEditingText === 'submitText' ? (
                    <Input
                      value={submitText}
                      onChange={(e) => handleContentChange('submitText', e.target.value)}
                      onBlur={(e) => {
                        handleContentChange('submitText', e.target.value);
                        setIsEditingText(null);
                      }}
                      className="border-2 border-blue-500 text-center"
                      autoFocus
                    />
                  ) : (
                    <Button 
                      type="submit" 
                      className={`w-full py-3 text-lg font-semibold ${
                        isEditing ? 'cursor-pointer' : ''
                      }`}
                      onClick={() => isEditing ? setIsEditingText('submitText') : undefined}
                    >
                      <Send className="mr-2 h-5 w-5" />
                      {submitText}
                    </Button>
                  )}
                </div>

                {/* Success Message */}
                {isSubmitted && (
                  <div className="flex items-center justify-center p-4 bg-green-50 border border-green-200 rounded-lg">
                    <Check className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-green-600 font-medium">{successMessage}</span>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Contact Info / Map */}
          {layout === 'two-col' && (
            <div className="space-y-8">
              {/* Contact Information */}
              <Card className="shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-blue-600 mr-4" />
                      <span className="text-gray-600">contact@example.com</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-blue-600 mr-4" />
                      <span className="text-gray-600">+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-blue-600 mr-4" />
                      <span className="text-gray-600">123 Business Ave, Suite 100<br />City, State 12345</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Map Placeholder */}
              {showMap && (
                <Card className="shadow-lg">
                  <CardContent className="p-0">
                    <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <MapPin className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">Interactive Map</p>
                        <p className="text-xs">(Map integration placeholder)</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Editing helper */}
      {isEditing && (
        <div className="fixed bottom-4 right-1/4 bg-indigo-600 text-white text-xs px-3 py-2 rounded-md shadow-lg z-50">
          Contact Form • Click fields to edit • Toggle required fields
        </div>
      )}
    </section>
  );
}