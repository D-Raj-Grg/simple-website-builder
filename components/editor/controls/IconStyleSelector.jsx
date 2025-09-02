'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Star, 
  Shield, 
  Users, 
  Zap, 
  Heart, 
  Grid, 
  Smartphone, 
  Globe, 
  Clock,
  Settings,
  Palette,
  CheckCircle,
  Award,
  Target,
  Lightbulb,
  Rocket,
  Gem
} from "lucide-react";

// Available icons for features and other blocks
const availableIcons = {
  'Star': Star,
  'Shield': Shield,
  'Users': Users,
  'Zap': Zap,
  'Heart': Heart,
  'Grid': Grid,
  'Smartphone': Smartphone,
  'Globe': Globe,
  'Clock': Clock,
  'Settings': Settings,
  'Palette': Palette,
  'CheckCircle': CheckCircle,
  'Award': Award,
  'Target': Target,
  'Lightbulb': Lightbulb,
  'Rocket': Rocket,
  'Gem': Gem
};

// Icon style presets
const iconStyles = [
  { 
    value: 'outlined', 
    label: 'Outlined',
    className: 'border-2',
    bgColor: 'transparent'
  },
  { 
    value: 'filled', 
    label: 'Filled',
    className: 'border-0',
    bgColor: '#EBF8FF'
  },
  { 
    value: 'minimal', 
    label: 'Minimal',
    className: 'border-0',
    bgColor: 'transparent'
  },
  { 
    value: 'shadow', 
    label: 'With Shadow',
    className: 'border-0 shadow-lg',
    bgColor: '#ffffff'
  }
];

// Icon sizes
const iconSizes = [
  { value: 'sm', label: 'Small', size: 'h-4 w-4', container: 'h-8 w-8', px: '32px' },
  { value: 'md', label: 'Medium', size: 'h-5 w-5', container: 'h-10 w-10', px: '40px' },
  { value: 'lg', label: 'Large', size: 'h-6 w-6', container: 'h-12 w-12', px: '48px' },
  { value: 'xl', label: 'Extra Large', size: 'h-8 w-8', container: 'h-16 w-16', px: '64px' }
];

export default function IconStyleSelector({ 
  value = {
    icon: 'Star',
    style: 'filled',
    size: 'lg',
    color: '#3B82F6',
    backgroundColor: '#EBF8FF'
  },
  onChange,
  label = "Icon Settings",
  showIconPicker = true,
  className = ""
}) {
  const [activeTab, setActiveTab] = useState('icon');

  const handleChange = (key, newValue) => {
    if (onChange) {
      onChange({
        ...value,
        [key]: newValue
      });
    }
  };

  const getCurrentSize = () => {
    return iconSizes.find(size => size.value === value.size) || iconSizes[2];
  };

  const getCurrentStyle = () => {
    return iconStyles.find(style => style.value === value.style) || iconStyles[1];
  };

  const SelectedIcon = availableIcons[value.icon] || Star;
  const currentSize = getCurrentSize();
  const currentStyle = getCurrentStyle();

  return (
    <div className={`space-y-4 ${className}`}>
      <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <Settings className="h-4 w-4" />
        {label}
      </Label>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {showIconPicker && <TabsTrigger value="icon">Icon</TabsTrigger>}
          <TabsTrigger value="style">Style</TabsTrigger>
          <TabsTrigger value="color">Color</TabsTrigger>
        </TabsList>

        {showIconPicker && (
          <TabsContent value="icon" className="space-y-3">
            <div className="space-y-2">
              <Label>Choose Icon</Label>
              <div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto">
                {Object.entries(availableIcons).map(([iconName, IconComponent]) => (
                  <Button
                    key={iconName}
                    variant={value.icon === iconName ? "default" : "outline"}
                    size="sm"
                    className="h-8 w-8 p-1"
                    onClick={() => handleChange('icon', iconName)}
                    title={iconName}
                  >
                    <IconComponent className="h-4 w-4" />
                  </Button>
                ))}
              </div>
              <div className="text-xs text-gray-500 text-center mt-2">
                Selected: {value.icon}
              </div>
            </div>
          </TabsContent>
        )}

        <TabsContent value="style" className="space-y-3">
          <div className="space-y-2">
            <Label>Icon Style</Label>
            <Select value={value.style} onValueChange={(newValue) => handleChange('style', newValue)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {iconStyles.map((style) => (
                  <SelectItem key={style.value} value={style.value}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Icon Size</Label>
            <Select value={value.size} onValueChange={(newValue) => handleChange('size', newValue)}>
              <SelectTrigger>
                <SelectValue>
                  <div className="flex items-center justify-between w-full">
                    <span>{currentSize.label}</span>
                    <span className="text-xs text-gray-500">{currentSize.px}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {iconSizes.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    <div className="flex items-center justify-between w-full">
                      <span>{size.label}</span>
                      <span className="text-xs text-gray-400 ml-4">{size.px}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        <TabsContent value="color" className="space-y-3">
          <div className="space-y-2">
            <Label>Icon Color</Label>
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
                placeholder="#3B82F6"
                className="font-mono text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Background Color</Label>
            <div className="flex items-center gap-2">
              <Input
                type="color"
                value={value.backgroundColor}
                onChange={(e) => handleChange('backgroundColor', e.target.value)}
                className="w-12 h-8 border rounded cursor-pointer"
              />
              <Input
                type="text"
                value={value.backgroundColor}
                onChange={(e) => handleChange('backgroundColor', e.target.value)}
                placeholder="#EBF8FF"
                className="font-mono text-sm"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Preview */}
      <div className="p-4 bg-gray-50 rounded border">
        <div className="flex items-center justify-center">
          <div 
            className={`${currentSize.container} ${currentStyle.className} rounded-lg flex items-center justify-center transition-colors`}
            style={{ 
              backgroundColor: value.style === 'filled' ? value.backgroundColor : 
                             value.style === 'outlined' ? 'transparent' : 
                             value.style === 'shadow' ? '#ffffff' : 'transparent',
              borderColor: value.style === 'outlined' ? value.color : 'transparent'
            }}
          >
            <SelectedIcon 
              className={`${currentSize.size}`} 
              style={{ color: value.color }}
            />
          </div>
        </div>
        <div className="text-center text-xs text-gray-500 mt-2">
          Preview: {value.icon} • {currentStyle.label} • {currentSize.label}
        </div>
      </div>
    </div>
  );
}