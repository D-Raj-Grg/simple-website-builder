'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Plus, 
  X, 
  Upload,
  ZoomIn,
  Edit3,
  Image as ImageIcon,
  Grid3X3,
  Maximize
} from "lucide-react";
import useEditorStore from '@/lib/store/editorStore';
import Image from 'next/image';

export default function GalleryBlock({ content, settings, isEditing, blockId }) {
  const [isEditingText, setIsEditingText] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
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

  const addImage = () => {
    const newImage = {
      id: Date.now().toString(),
      url: '/mock/gallery/placeholder.jpg',
      caption: 'New Image'
    };
    handleContentChange('images', [...images, newImage]);
  };

  const removeImage = (imageId) => {
    handleContentChange('images', images.filter(img => img.id !== imageId));
  };

  const updateImage = (imageId, key, value) => {
    const updatedImages = images.map(img =>
      img.id === imageId ? { ...img, [key]: value } : img
    );
    handleContentChange('images', updatedImages);
  };

  const {
    layout = '3x3',
    spacing = 'medium',
    lightbox = true,
    aspectRatio = 'square'
  } = settings;

  const {
    heading = 'Our Gallery',
    description = 'Explore our work and achievements',
    images = [
      { id: '1', url: '/mock/gallery/gallery1.jpg', caption: 'Beautiful Architecture' },
      { id: '2', url: '/mock/gallery/gallery2.jpg', caption: 'Modern Design' },
      { id: '3', url: '/mock/gallery/gallery3.jpg', caption: 'Creative Solutions' },
      { id: '4', url: '/mock/gallery/gallery4.jpg', caption: 'Innovation at Work' },
      { id: '5', url: '/mock/gallery/gallery5.jpg', caption: 'Team Collaboration' },
      { id: '6', url: '/mock/gallery/gallery6.jpg', caption: 'Success Stories' }
    ]
  } = content;

  const getLayoutClasses = () => {
    switch (layout) {
      case '2x2':
        return 'grid-cols-2 md:grid-cols-2';
      case '3x3':
        return 'grid-cols-2 md:grid-cols-3';
      case '4x4':
        return 'grid-cols-2 md:grid-cols-4';
      case 'masonry':
        return 'columns-2 md:columns-3 lg:columns-4 space-y-4';
      default:
        return 'grid-cols-2 md:grid-cols-3';
    }
  };

  const spacingClasses = {
    tight: 'gap-2',
    medium: 'gap-4',
    loose: 'gap-8'
  };

  const aspectRatioClasses = {
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
    wide: 'aspect-[16/9]'
  };

  const renderImage = (image, index) => (
    <Card 
      key={image.id+index}
      className={`group overflow-hidden ${
        layout === 'masonry' ? 'break-inside-avoid mb-4' : ''
      } hover:shadow-lg transition-all duration-300 cursor-pointer`}
      onClick={() => lightbox && !isEditing && setLightboxImage(image)}
    >
      <CardContent className="p-0 relative">
        <div className={`relative overflow-hidden ${
          layout === 'masonry' ? 'aspect-auto' : aspectRatioClasses[aspectRatio]
        }`}>
          <Image
            src={image.url}
            alt={image.caption}
            fill={layout !== 'masonry'}
            width={layout === 'masonry' ? 400 : undefined}
            height={layout === 'masonry' ? 300 : undefined}
            className={`${
              layout === 'masonry' ? 'w-full h-auto' : 'object-cover'
            } group-hover:scale-105 transition-transform duration-300`}
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
              {lightbox && !isEditing && (
                <Button size="icon" variant="secondary" className="rounded-full">
                  <ZoomIn className="h-4 w-4" />
                </Button>
              )}
              
              {isEditing && (
                <>
                  <Button 
                    size="icon" 
                    variant="secondary" 
                    className="rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditingText(`caption-${image.id}`);
                    }}
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    size="icon" 
                    variant="destructive" 
                    className="rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(image.id);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Caption */}
        {image.caption && (
          <div className="p-3">
            {isEditing && isEditingText === `caption-${image.id}` ? (
              <Input
                value={image.caption}
                onChange={(e) => updateImage(image.id, 'caption', e.target.value)}
                onBlur={() => setIsEditingText(null)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setIsEditingText(null);
                }}
                className="text-sm border-2 border-blue-500"
                autoFocus
              />
            ) : (
              <p 
                className={`text-sm text-gray-600 text-center ${
                  isEditing ? 'cursor-pointer hover:bg-blue-50 p-1 rounded transition-colors' : ''
                }`}
                onClick={() => isEditing && setIsEditingText(`caption-${image.id}`)}
              >
                {image.caption}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <section className="py-16 px-6 md:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        {(heading || description) && (
          <div className="text-center mb-12">
            {heading && (
              <>
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
              </>
            )}

            {description && (
              <>
                {isEditing && isEditingText === 'description' ? (
                  <Input
                    value={description}
                    onChange={(e) => handleContentChange('description', e.target.value)}
                    onBlur={(e) => {
                      handleContentChange('description', e.target.value);
                      setIsEditingText(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleContentChange('description', e.target.value);
                        setIsEditingText(null);
                      }
                    }}
                    className="text-lg border-2 border-blue-500 bg-white text-center"
                    autoFocus
                  />
                ) : (
                  <p 
                    className={`text-lg text-gray-600 max-w-2xl mx-auto ${
                      isEditing ? 'cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors' : ''
                    }`}
                    onClick={() => isEditing && setIsEditingText('description')}
                  >
                    {description}
                  </p>
                )}
              </>
            )}
          </div>
        )}

        {/* Images Grid */}
        {images.length === 0 && isEditing ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Images Yet</h3>
            <p className="text-gray-500 mb-4">Add images to create your gallery</p>
            <Button onClick={addImage}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Image
            </Button>
          </div>
        ) : (
          <div className={`${
            layout === 'masonry' 
              ? `${getLayoutClasses()} ${spacingClasses[spacing]}`
              : `grid ${getLayoutClasses()} ${spacingClasses[spacing]}`
          }`}>
            {images.map(renderImage)}
            
            {/* Add Image Button */}
            {isEditing && (
              <Card className="border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
                <CardContent className={`p-0 ${aspectRatioClasses[aspectRatio]} flex items-center justify-center`}>
                  <Button 
                    variant="ghost" 
                    className="h-full w-full flex-col gap-2 text-gray-500 hover:text-blue-600"
                    onClick={addImage}
                  >
                    <Plus className="h-8 w-8" />
                    <span className="text-sm">Add Image</span>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <Image
              src={lightboxImage.url}
              alt={lightboxImage.caption}
              width={800}
              height={600}
              className="object-contain max-h-[80vh] w-auto"
            />
            
            {lightboxImage.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-4 text-center">
                <p className="text-lg">{lightboxImage.caption}</p>
              </div>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20"
              onClick={() => setLightboxImage(null)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>
      )}

      {/* Editing helper */}
      {isEditing && (
        <div className="fixed bottom-4 left-4 bg-green-600 text-white text-xs px-3 py-2 rounded-md shadow-lg z-50">
          Gallery • Click images to edit • Use settings for layout options
        </div>
      )}
    </section>
  );
}