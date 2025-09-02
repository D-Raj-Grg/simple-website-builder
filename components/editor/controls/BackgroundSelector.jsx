'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { 
  Palette,
  Image as ImageIcon,
  Layers,
  Paintbrush,
  Upload,
  X
} from "lucide-react";

// Background type options
const backgroundTypes = [
  {
    value: 'none',
    label: 'None',
    description: 'Transparent background'
  },
  {
    value: 'color',
    label: 'Solid Color',
    description: 'Single color background'
  },
  {
    value: 'gradient',
    label: 'Gradient',
    description: 'Linear or radial gradient'
  },
  {
    value: 'image',
    label: 'Image',
    description: 'Background image'
  },
  {
    value: 'pattern',
    label: 'Pattern',
    description: 'Repeating pattern'
  }
];

// Gradient directions
const gradientDirections = [
  { value: 'to-r', label: 'Left to Right', css: 'to right' },
  { value: 'to-l', label: 'Right to Left', css: 'to left' },
  { value: 'to-t', label: 'Bottom to Top', css: 'to top' },
  { value: 'to-b', label: 'Top to Bottom', css: 'to bottom' },
  { value: 'to-tr', label: 'Bottom Left to Top Right', css: 'to top right' },
  { value: 'to-tl', label: 'Bottom Right to Top Left', css: 'to top left' },
  { value: 'to-br', label: 'Top Left to Bottom Right', css: 'to bottom right' },
  { value: 'to-bl', label: 'Top Right to Bottom Left', css: 'to bottom left' }
];

// Image positioning options
const imagePositions = [
  { value: 'center', label: 'Center' },
  { value: 'top', label: 'Top' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
  { value: 'top-left', label: 'Top Left' },
  { value: 'top-right', label: 'Top Right' },
  { value: 'bottom-left', label: 'Bottom Left' },
  { value: 'bottom-right', label: 'Bottom Right' }
];

// Image size options
const imageSizes = [
  { value: 'cover', label: 'Cover' },
  { value: 'contain', label: 'Contain' },
  { value: 'auto', label: 'Original' },
  { value: '100%', label: 'Stretch' }
];

export default function BackgroundSelector({ 
  value = {
    type: 'none',
    color: '#ffffff',
    gradient: {
      direction: 'to-r',
      colors: ['#3B82F6', '#8B5CF6']
    },
    image: {
      url: '',
      position: 'center',
      size: 'cover',
      repeat: 'no-repeat'
    },
    overlay: {
      enabled: false,
      color: '#000000',
      opacity: 50
    }
  },
  onChange,
  label = "Background Settings",
  className = ""
}) {
  const [activeTab, setActiveTab] = useState('type');

  const handleChange = (key, newValue) => {
    if (onChange) {
      onChange({
        ...value,
        [key]: newValue
      });
    }
  };

  const handleNestedChange = (parent, key, newValue) => {
    if (onChange) {
      onChange({
        ...value,
        [parent]: {
          ...value[parent],
          [key]: newValue
        }
      });
    }
  };

  const getBackgroundPreview = () => {
    switch (value.type) {
      case 'color':
        return { backgroundColor: value.color };
      case 'gradient':
        const gradientCSS = `linear-gradient(${value.gradient.direction.replace('to-', '').replace('-', ' ')}, ${value.gradient.colors.join(', ')})`;
        return { background: gradientCSS };
      case 'image':
        if (value.image.url) {
          return {
            backgroundImage: `url(${value.image.url})`,
            backgroundPosition: value.image.position,
            backgroundSize: value.image.size,
            backgroundRepeat: value.image.repeat
          };
        }
        return { backgroundColor: '#f3f4f6' };
      default:
        return { backgroundColor: 'transparent' };
    }
  };

  const getCurrentType = () => {
    return backgroundTypes.find(type => type.value === value.type) || backgroundTypes[0];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <Palette className="h-4 w-4" />
        {label}
      </Label>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="type">Type</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="overlay">Overlay</TabsTrigger>
        </TabsList>

        <TabsContent value="type" className="space-y-3">
          <div className="space-y-2">
            <Label>Background Type</Label>
            <Select 
              value={value.type} 
              onValueChange={(newValue) => handleChange('type', newValue)}
            >
              <SelectTrigger>
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <span>{getCurrentType().label}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {backgroundTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs text-gray-500">{type.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {value.type === 'color' && (
            <div className="space-y-2">
              <Label>Background Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="color"
                  value={value.color}
                  onChange={(e) => handleChange('color', e.target.value)}
                  className="w-12 h-8 border rounded cursor-pointer"
                />
                <Input
                  type="text"
                  value={value.color}
                  onChange={(e) => handleChange('color', e.target.value)}
                  placeholder="#ffffff"
                  className="font-mono text-sm"
                />
              </div>
            </div>
          )}

          {value.type === 'gradient' && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Gradient Direction</Label>
                <Select 
                  value={value.gradient.direction} 
                  onValueChange={(newValue) => handleNestedChange('gradient', 'direction', newValue)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {gradientDirections.map((direction) => (
                      <SelectItem key={direction.value} value={direction.value}>
                        {direction.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Gradient Colors</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={value.gradient.colors[0]}
                    onChange={(e) => {
                      const newColors = [...value.gradient.colors];
                      newColors[0] = e.target.value;
                      handleNestedChange('gradient', 'colors', newColors);
                    }}
                    className="w-12 h-8 border rounded cursor-pointer"
                  />
                  <Input
                    type="color"
                    value={value.gradient.colors[1]}
                    onChange={(e) => {
                      const newColors = [...value.gradient.colors];
                      newColors[1] = e.target.value;
                      handleNestedChange('gradient', 'colors', newColors);
                    }}
                    className="w-12 h-8 border rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {value.type === 'image' && (
            <div className="space-y-2">
              <Label>Background Image</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    type="url"
                    value={value.image.url}
                    onChange={(e) => handleNestedChange('image', 'url', e.target.value)}
                    placeholder="Enter image URL"
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                {value.image.url && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleNestedChange('image', 'url', '')}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remove Image
                  </Button>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-3">
          {value.type === 'image' && (
            <>
              <div className="space-y-2">
                <Label>Image Position</Label>
                <Select 
                  value={value.image.position} 
                  onValueChange={(newValue) => handleNestedChange('image', 'position', newValue)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {imagePositions.map((position) => (
                      <SelectItem key={position.value} value={position.value}>
                        {position.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Image Size</Label>
                <Select 
                  value={value.image.size} 
                  onValueChange={(newValue) => handleNestedChange('image', 'size', newValue)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {imageSizes.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Image Repeat</Label>
                <Select 
                  value={value.image.repeat} 
                  onValueChange={(newValue) => handleNestedChange('image', 'repeat', newValue)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-repeat">No Repeat</SelectItem>
                    <SelectItem value="repeat">Repeat</SelectItem>
                    <SelectItem value="repeat-x">Repeat Horizontally</SelectItem>
                    <SelectItem value="repeat-y">Repeat Vertically</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="overlay" className="space-y-3">
          <div className="flex items-center space-x-2">
            <Switch 
              id="overlay-enabled"
              checked={value.overlay.enabled}
              onCheckedChange={(checked) => handleNestedChange('overlay', 'enabled', checked)}
            />
            <Label htmlFor="overlay-enabled">Enable Overlay</Label>
          </div>

          {value.overlay.enabled && (
            <>
              <div className="space-y-2">
                <Label>Overlay Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={value.overlay.color}
                    onChange={(e) => handleNestedChange('overlay', 'color', e.target.value)}
                    className="w-12 h-8 border rounded cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={value.overlay.color}
                    onChange={(e) => handleNestedChange('overlay', 'color', e.target.value)}
                    placeholder="#000000"
                    className="font-mono text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Overlay Opacity</Label>
                <div className="flex items-center gap-3">
                  <Slider
                    value={[value.overlay.opacity]}
                    onValueChange={(values) => handleNestedChange('overlay', 'opacity', values[0])}
                    min={0}
                    max={100}
                    step={5}
                    className="flex-1"
                  />
                  <span className="text-sm font-mono w-12">{value.overlay.opacity}%</span>
                </div>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Preview */}
      <div className="space-y-2">
        <Label>Preview</Label>
        <div className="relative h-24 border rounded overflow-hidden">
          <div 
            className="w-full h-full"
            style={getBackgroundPreview()}
          />
          {value.overlay.enabled && (
            <div 
              className="absolute inset-0"
              style={{
                backgroundColor: value.overlay.color,
                opacity: value.overlay.opacity / 100
              }}
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white bg-opacity-80 px-2 py-1 rounded text-xs text-gray-600">
              Preview Content
            </div>
          </div>
        </div>
        <div className="text-center text-xs text-gray-500">
          {getCurrentType().label} 
          {value.overlay.enabled && ` • ${value.overlay.opacity}% Overlay`}
        </div>
      </div>
    </div>
  );
}