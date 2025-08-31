'use client';

import { useState, memo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Plus, 
  Trash2, 
  Star,
  Quote,
  User,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import useEditorStore from '@/lib/store/editorStore';
import Image from 'next/image';

const TestimonialsBlock = memo(function TestimonialsBlock({ content, settings, isEditing, blockId }) {
  const [isEditingText, setIsEditingText] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
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

  const handleTestimonialChange = (testimonialId, field, value) => {
    const updatedQuotes = content.quotes?.map(quote => 
      quote.id === testimonialId ? { ...quote, [field]: value } : quote
    ) || [];
    
    handleContentChange('quotes', updatedQuotes);
  };

  const addTestimonial = () => {
    const newTestimonial = {
      id: Date.now().toString(),
      text: 'This is an amazing product! It completely transformed how we do business.',
      author: 'New Customer',
      role: 'CEO, Company',
      avatar: 'https://picsum.photos/100/100?random=' + Date.now(),
      rating: 5
    };
    
    const updatedQuotes = [...(content.quotes || []), newTestimonial];
    handleContentChange('quotes', updatedQuotes);
  };

  const removeTestimonial = (testimonialId) => {
    const updatedQuotes = content.quotes?.filter(quote => quote.id !== testimonialId) || [];
    handleContentChange('quotes', updatedQuotes);
  };

  const {
    layout = 'grid',
    maxItems = 3,
    bgStyle = 'light'
  } = settings;

  const {
    heading = 'What Our Customers Say',
    quotes = [
      {
        id: '1',
        text: 'This platform completely transformed how we build our websites. The ease of use is incredible!',
        author: 'Sarah Johnson',
        role: 'CEO, TechCorp',
        avatar: 'https://picsum.photos/100/100?random=1',
        rating: 5
      },
      {
        id: '2',
        text: 'Amazing results in record time. Our conversion rates increased by 300% after the redesign.',
        author: 'Mike Chen',
        role: 'Marketing Director',
        avatar: 'https://picsum.photos/100/100?random=2',
        rating: 5
      },
      {
        id: '3',
        text: 'The customer support is outstanding. They helped us every step of the way.',
        author: 'Emily Rodriguez',
        role: 'Founder, StartupCo',
        avatar: 'https://picsum.photos/100/100?random=3',
        rating: 5
      }
    ]
  } = content;

  const visibleQuotes = quotes.slice(0, maxItems);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % visibleQuotes.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + visibleQuotes.length) % visibleQuotes.length);
  };

  const backgroundClasses = {
    light: 'bg-gray-50',
    white: 'bg-white',
    dark: 'bg-gray-900'
  };

  const textColors = {
    light: 'text-gray-900',
    white: 'text-gray-900',
    dark: 'text-white'
  };

  return (
    <section className={`py-16 px-6 md:px-8 ${backgroundClasses[bgStyle]}`}>
      <div className="max-w-7xl mx-auto">
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
              className={`text-3xl md:text-4xl font-bold ${textColors[bgStyle]} ${
                isEditing ? 'cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors' : ''
              }`}
              onClick={() => isEditing && setIsEditingText('heading')}
            >
              {heading}
            </h2>
          )}
        </div>

        {/* Testimonials */}
        {layout === 'carousel' ? (
          // Carousel Layout
          <div className="relative">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {visibleQuotes.map((testimonial) => (
                  <div key={testimonial.id} className="w-full flex-shrink-0">
                    <TestimonialCard 
                      testimonial={testimonial}
                      isEditing={isEditing}
                      isEditingText={isEditingText}
                      setIsEditingText={setIsEditingText}
                      onTestimonialChange={handleTestimonialChange}
                      onRemove={removeTestimonial}
                      bgStyle={bgStyle}
                      textColors={textColors}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Controls */}
            {visibleQuotes.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg"
                  onClick={prevSlide}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg"
                  onClick={nextSlide}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            {/* Dots indicator */}
            <div className="flex justify-center mt-8 space-x-2">
              {visibleQuotes.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        ) : (
          // Grid Layout
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleQuotes.map((testimonial) => (
              <TestimonialCard 
                key={testimonial.id}
                testimonial={testimonial}
                isEditing={isEditing}
                isEditingText={isEditingText}
                setIsEditingText={setIsEditingText}
                onTestimonialChange={handleTestimonialChange}
                onRemove={removeTestimonial}
                bgStyle={bgStyle}
                textColors={textColors}
              />
            ))}

            {/* Add New Testimonial Card */}
            {isEditing && (
              <Card className="border-2 border-dashed border-gray-300 hover:border-blue-300 transition-colors cursor-pointer" onClick={addTestimonial}>
                <CardContent className="p-6 flex items-center justify-center h-full min-h-[250px]">
                  <div className="text-center">
                    <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 font-medium">Add Testimonial</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Editing helper */}
      {isEditing && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-orange-600 text-white text-xs px-3 py-2 rounded-md shadow-lg z-50">
          Testimonials Block • Click to edit • Hover to manage
        </div>
      )}
    </section>
  );
});

export default TestimonialsBlock;

// Testimonial Card Component
function TestimonialCard({ 
  testimonial, 
  isEditing, 
  isEditingText, 
  setIsEditingText, 
  onTestimonialChange, 
  onRemove,
  bgStyle,
  textColors 
}) {
  return (
    <Card className={`${bgStyle === 'light' ? 'bg-white' : 'bg-gray-800'} shadow-lg group relative`}>
      <CardContent className="p-6">
        {/* Quote Icon */}
        <Quote className={`h-8 w-8 ${textColors[bgStyle]} opacity-20 mb-4`} />

        {/* Rating Stars */}
        <div className="flex mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Testimonial Text */}
        <div className="mb-6">
          {isEditing && isEditingText === `text-${testimonial.id}` ? (
            <Textarea
              value={testimonial.text}
              onChange={(e) => onTestimonialChange(testimonial.id, 'text', e.target.value)}
              onBlur={() => setIsEditingText(null)}
              className="border-2 border-blue-500 resize-none"
              rows={4}
              autoFocus
            />
          ) : (
            <p 
              className={`${textColors[bgStyle]} text-lg leading-relaxed ${
                isEditing ? 'cursor-pointer hover:bg-blue-50 p-2 rounded' : ''
              }`}
              onClick={() => isEditing && setIsEditingText(`text-${testimonial.id}`)}
            >
              &quot;{testimonial.text}&quot;
            </p>
          )}
        </div>

        {/* Author Info */}
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-gray-200 flex items-center justify-center">
            {testimonial.avatar ? (
              <Image
                src={testimonial.avatar}
                alt={testimonial.author}
                width={48}
                height={48}
                className="object-cover"
              />
            ) : (
              <User className="h-6 w-6 text-gray-400" />
            )}
          </div>
          <div className="flex-1">
            {/* Author Name */}
            {isEditing && isEditingText === `author-${testimonial.id}` ? (
              <Input
                value={testimonial.author}
                onChange={(e) => onTestimonialChange(testimonial.id, 'author', e.target.value)}
                onBlur={() => setIsEditingText(null)}
                className="font-semibold border-2 border-blue-500 mb-1"
                autoFocus
              />
            ) : (
              <h4 
                className={`font-semibold ${textColors[bgStyle]} ${
                  isEditing ? 'cursor-pointer hover:bg-blue-50 p-1 rounded' : ''
                }`}
                onClick={() => isEditing && setIsEditingText(`author-${testimonial.id}`)}
              >
                {testimonial.author}
              </h4>
            )}

            {/* Author Role */}
            {isEditing && isEditingText === `role-${testimonial.id}` ? (
              <Input
                value={testimonial.role}
                onChange={(e) => onTestimonialChange(testimonial.id, 'role', e.target.value)}
                onBlur={() => setIsEditingText(null)}
                className="text-sm border-2 border-blue-500"
                autoFocus
              />
            ) : (
              <p 
                className={`text-sm ${textColors[bgStyle]} opacity-70 ${
                  isEditing ? 'cursor-pointer hover:bg-blue-50 p-1 rounded' : ''
                }`}
                onClick={() => isEditing && setIsEditingText(`role-${testimonial.id}`)}
              >
                {testimonial.role}
              </p>
            )}
          </div>
        </div>

        {/* Edit controls */}
        {isEditing && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6 bg-red-600 text-white border-red-600 hover:bg-red-700"
              onClick={() => onRemove(testimonial.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}