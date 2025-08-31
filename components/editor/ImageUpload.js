'use client';

import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Upload, 
  X, 
  Image as ImageIcon,
  Link,
  Crop,
  RotateCw,
  Download,
  Eye,
  AlertCircle
} from "lucide-react";
import Image from 'next/image';

export default function ImageUpload({ 
  value, 
  onChange, 
  onRemove,
  placeholder = "Upload image",
  className = "",
  aspectRatio = "auto",
  maxSize = 5, // MB
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  showPreview = true,
  showControls = true
}) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (files) => {
    const file = files[0];
    if (!file) return;

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      setError(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`);
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File too large. Max size: ${maxSize}MB`);
      return;
    }

    setError(null);
    setUploading(true);

    try {
      // Create preview URL
      const url = URL.createObjectURL(file);
      
      // For now, just use the preview URL
      // In a real app, you'd upload to a server/CDN
      if (onChange) {
        onChange(url);
      }
      
      setUploading(false);
    } catch (err) {
      setError('Failed to process image');
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFileSelect(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    handleFileSelect(files);
  };

  const handleUrlSubmit = () => {
    if (imageUrl.trim()) {
      if (onChange) {
        onChange(imageUrl.trim());
      }
      setImageUrl('');
      setShowUrlInput(false);
    }
  };

  const aspectRatioClasses = {
    auto: '',
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
    wide: 'aspect-[16/9]'
  };

  return (
    <div className={`relative ${className}`}>
      {value ? (
        // Image Preview
        <div className="relative group">
          <div className={`relative overflow-hidden rounded-lg ${aspectRatioClasses[aspectRatio]}`}>
            <Image
              src={value}
              alt="Uploaded image"
              fill
              className="object-cover"
              onError={() => setError('Failed to load image')}
            />
            
            {/* Overlay Controls */}
            {showControls && (
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                  {showPreview && (
                    <Button
                      size="icon"
                      variant="secondary"
                      className="rounded-full"
                      onClick={() => window.open(value, '_blank')}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  
                  <Button
                    size="icon"
                    variant="secondary"
                    className="rounded-full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                  
                  {onRemove && (
                    <Button
                      size="icon"
                      variant="destructive"
                      className="rounded-full"
                      onClick={onRemove}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Image Info */}
          {showControls && (
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              Click to change image
            </div>
          )}
        </div>
      ) : (
        // Upload Area
        <Card 
          className={`border-2 border-dashed transition-colors cursor-pointer ${
            dragOver 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
          } ${aspectRatioClasses[aspectRatio]}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <CardContent className="flex flex-col items-center justify-center h-full p-8 text-center">
            {uploading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-sm text-gray-600">Uploading...</p>
              </div>
            ) : (
              <>
                <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{placeholder}</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Drag and drop or click to select
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Choose File
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowUrlInput(!showUrlInput);
                    }}
                  >
                    <Link className="mr-2 h-4 w-4" />
                    Add URL
                  </Button>
                </div>

                {/* URL Input */}
                {showUrlInput && (
                  <div className="mt-4 w-full max-w-xs" onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-2">
                      <Input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleUrlSubmit();
                          } else if (e.key === 'Escape') {
                            setShowUrlInput(false);
                            setImageUrl('');
                          }
                        }}
                        className="text-sm"
                      />
                      <Button size="sm" onClick={handleUrlSubmit}>
                        Add
                      </Button>
                    </div>
                  </div>
                )}

                <p className="text-xs text-gray-400 mt-4">
                  Max {maxSize}MB • {allowedTypes.map(type => type.split('/')[1]).join(', ')}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Error Message */}
      {error && (
        <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 ml-auto"
            onClick={() => setError(null)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={allowedTypes.join(',')}
        onChange={handleFileInputChange}
        className="hidden"
        multiple={false}
      />
    </div>
  );
}