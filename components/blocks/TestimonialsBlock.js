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

  // Enhanced Settings Destructuring
  const {
    // Layout Settings
    layout = { 
      type: 'grid',
      columns: 3,
      maxItems: 3,
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
    
    // Testimonial Card Settings
    testimonialCard = {
      style: 'elevated',
      quoteStyle: 'icon',
      showRating: true,
      ratingStyle: 'stars',
      authorLayout: 'horizontal',
      avatarStyle: 'circle',
      textSize: 'lg',
      spacing: 4
    },
    
    // Visual Enhancements
    background = { type: 'color', color: '#f9fafb' },
    borderRadius = { preset: 'lg' },
    shadow = { enabled: true, preset: 'lg' },
    animation = { enabled: false, entrance: 'none', hover: 'lift' },
    
    // Legacy settings for backward compatibility
    layout: legacyLayout = 'grid',
    maxItems = 3,
    bgStyle = 'light'
  } = settings;

  // Use enhanced settings or fall back to legacy
  const actualLayout = layout?.type || legacyLayout;
  const actualMaxItems = layout?.maxItems || maxItems;
  const actualBgStyle = background?.type === 'color' ? 
    (background.color === '#ffffff' ? 'white' : 
     background.color === '#111827' ? 'dark' : 'light') : bgStyle;

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

  const visibleQuotes = quotes.slice(0, actualMaxItems);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % visibleQuotes.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + visibleQuotes.length) % visibleQuotes.length);
  };

  // Enhanced Dynamic Classes
  const getLayoutClasses = () => {
    if (actualLayout === 'carousel') {
      return 'w-full';
    }
    
    const columnClasses = {
      1: 'grid-cols-1',
      2: 'sm:grid-cols-1 md:grid-cols-2',
      3: 'sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4'
    };
    
    const gapClasses = {
      sm: 'gap-4',
      md: 'gap-6',
      lg: 'gap-8',
      xl: 'gap-10'
    };
    
    return `grid ${columnClasses[layout.columns]} ${gapClasses[layout.gridGap]}`;
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
    
    const alignmentClasses = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right'
    };
    
    const spacingClasses = {
      4: 'mb-4',
      6: 'mb-6',
      8: 'mb-8',
      10: 'mb-10',
      12: 'mb-12',
      16: 'mb-16'
    };
    
    return `${sizeClasses[header.size]} ${weightClasses[header.weight]} text-${header.color} ${alignmentClasses[header.alignment]} ${spacingClasses[header.spacing]}`;
  };

  const getCardClasses = () => {
    const styleClasses = {
      flat: 'border-0 shadow-none bg-transparent',
      outlined: 'border border-gray-200 shadow-none',
      elevated: 'shadow-lg',
      glass: 'backdrop-blur-sm bg-white/80 border border-white/20'
    };
    
    let bgClass = '';
    if (actualBgStyle === 'light' || actualBgStyle === 'white') {
      bgClass = testimonialCard.style === 'flat' ? 'bg-transparent' : 'bg-white';
    } else if (actualBgStyle === 'dark') {
      bgClass = testimonialCard.style === 'flat' ? 'bg-transparent' : 'bg-gray-800';
    }
    
    const radiusClass = borderRadius.preset !== 'none' ? `rounded-${borderRadius.preset}` : '';
    const shadowClass = shadow.enabled ? `shadow-${shadow.preset}` : '';
    const animationClass = animation.enabled ? 
      `transition-all duration-300 ${animation.hover === 'lift' ? 'hover:-translate-y-1 hover:shadow-xl' : animation.hover}` : 
      'transition-all duration-200';
    
    return `${styleClasses[testimonialCard.style]} ${bgClass} ${radiusClass} ${shadowClass} ${animationClass} group relative`;
  };

  const getTextClasses = () => {
    const sizeClasses = {
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl'
    };
    
    const colorClasses = {
      light: 'text-gray-900',
      white: 'text-gray-900', 
      dark: 'text-white'
    };
    
    return `${sizeClasses[testimonialCard.textSize]} ${colorClasses[actualBgStyle]} leading-relaxed`;
  };

  const getAuthorClasses = () => {
    const colorClasses = {
      light: 'text-gray-900',
      white: 'text-gray-900',
      dark: 'text-white'
    };
    
    return {
      name: `font-semibold ${colorClasses[actualBgStyle]}`,
      role: `text-sm ${colorClasses[actualBgStyle]} opacity-70`
    };
  };

  const getSectionClasses = () => {
    const paddingClass = `py-${layout.padding.top} px-${layout.padding.x} md:px-8`;
    
    let backgroundClass = '';
    if (background.type === 'color') {
      backgroundClass = `bg-[${background.color}]`;
    } else if (background.type === 'gradient') {
      backgroundClass = `bg-gradient-to-r from-[${background.gradient.colors[0]}] to-[${background.gradient.colors[1]}]`;
    } else {
      // Fallback to legacy bg styles
      const backgroundClasses = {
        light: 'bg-gray-50',
        white: 'bg-white',
        dark: 'bg-gray-900'
      };
      backgroundClass = backgroundClasses[actualBgStyle];
    }
    
    const animationClass = animation.enabled && animation.entrance !== 'none' 
      ? `animate-in ${animation.entrance} duration-${animation.duration}ms`
      : '';
      
    return `${paddingClass} ${backgroundClass} ${animationClass}`.trim();
  };

  const getContainerClasses = () => {
    const maxWidthClasses = {
      sm: 'max-w-2xl',
      md: 'max-w-4xl',
      lg: 'max-w-6xl',
      xl: 'max-w-7xl',
      '2xl': 'max-w-screen-2xl'
    };
    
    return `${maxWidthClasses[layout.maxWidth]} mx-auto`;
  };

  return (
    <section className={getSectionClasses()}>
      <div className={getContainerClasses()}>
        {/* Section Heading */}
        {header.show && (
          <div className={getHeaderClasses()}>
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
                className={`${getHeaderClasses()} border-2 border-blue-500 bg-white`}
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

        {/* Testimonials */}
        {actualLayout === 'carousel' ? (
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
                      cardClasses={getCardClasses()}
                      textClasses={getTextClasses()}
                      authorClasses={getAuthorClasses()}
                      settings={testimonialCard}
                      bgStyle={actualBgStyle}
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
          <div className={getLayoutClasses()}>
            {visibleQuotes.map((testimonial) => (
              <TestimonialCard 
                key={testimonial.id}
                testimonial={testimonial}
                isEditing={isEditing}
                isEditingText={isEditingText}
                setIsEditingText={setIsEditingText}
                onTestimonialChange={handleTestimonialChange}
                onRemove={removeTestimonial}
                cardClasses={getCardClasses()}
                textClasses={getTextClasses()}
                authorClasses={getAuthorClasses()}
                settings={testimonialCard}
                bgStyle={actualBgStyle}
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

// Enhanced Testimonial Card Component
function TestimonialCard({ 
  testimonial, 
  isEditing, 
  isEditingText, 
  setIsEditingText, 
  onTestimonialChange, 
  onRemove,
  cardClasses,
  textClasses,
  authorClasses,
  settings,
  bgStyle
}) {
  const getQuoteIconClasses = () => {
    const colorClasses = {
      light: 'text-gray-900',
      white: 'text-gray-900',
      dark: 'text-white'
    };
    
    return `h-8 w-8 ${colorClasses[bgStyle]} opacity-20 mb-4`;
  };

  const getRatingClasses = () => {
    const spacingClasses = {
      1: 'mb-1',
      2: 'mb-2',
      3: 'mb-3',
      4: 'mb-4',
      6: 'mb-6'
    };
    
    return `flex ${spacingClasses[settings.spacing]}`;
  };

  const getAvatarClasses = () => {
    const sizeClasses = {
      sm: 'w-8 h-8',
      md: 'w-12 h-12',
      lg: 'w-16 h-16'
    };
    
    const styleClasses = {
      circle: 'rounded-full',
      square: 'rounded',
      rounded: 'rounded-lg'
    };
    
    return `${sizeClasses.md} ${styleClasses[settings.avatarStyle]} overflow-hidden mr-4 bg-gray-200 flex items-center justify-center`;
  };

  const getContentSpacing = () => {
    const spacingClasses = {
      1: 'space-y-1',
      2: 'space-y-2',
      3: 'space-y-3',
      4: 'space-y-4',
      6: 'space-y-6'
    };
    
    return spacingClasses[settings.spacing] || 'space-y-4';
  };

  return (
    <Card className={cardClasses}>
      <CardContent className="p-6">
        <div className={getContentSpacing()}>
          {/* Quote Icon */}
          {settings.quoteStyle === 'icon' && (
            <Quote className={getQuoteIconClasses()} />
          )}

          {/* Rating Stars */}
          {settings.showRating && settings.ratingStyle === 'stars' && (
            <div className={getRatingClasses()}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Testimonial Text */}
          <div>
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
                className={`${textClasses} ${
                  isEditing ? 'cursor-pointer hover:bg-blue-50 p-2 rounded' : ''
                }`}
                onClick={() => isEditing && setIsEditingText(`text-${testimonial.id}`)}
              >
                {settings.quoteStyle === 'quotes' ? `"${testimonial.text}"` : testimonial.text}
              </p>
            )}
          </div>

          {/* Author Info */}
          <div className={`flex ${settings.authorLayout === 'vertical' ? 'flex-col items-center text-center' : 'items-center'}`}>
            <div className={getAvatarClasses()}>
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
            <div className={`${settings.authorLayout === 'vertical' ? 'mt-2' : 'flex-1'}`}>
              {/* Author Name */}
              {isEditing && isEditingText === `author-${testimonial.id}` ? (
                <Input
                  value={testimonial.author}
                  onChange={(e) => onTestimonialChange(testimonial.id, 'author', e.target.value)}
                  onBlur={() => setIsEditingText(null)}
                  className={`${authorClasses.name} border-2 border-blue-500 mb-1`}
                  autoFocus
                />
              ) : (
                <h4 
                  className={`${authorClasses.name} ${
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
                  className={`${authorClasses.role} border-2 border-blue-500`}
                  autoFocus
                />
              ) : (
                <p 
                  className={`${authorClasses.role} ${
                    isEditing ? 'cursor-pointer hover:bg-blue-50 p-1 rounded' : ''
                  }`}
                  onClick={() => isEditing && setIsEditingText(`role-${testimonial.id}`)}
                >
                  {testimonial.role}
                </p>
              )}
            </div>
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