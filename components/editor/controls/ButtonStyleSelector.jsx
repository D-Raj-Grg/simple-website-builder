'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MousePointer2, 
  Square, 
  Circle,
  Zap,
  Play,
  ArrowRight,
  Download,
  Mail,
  Phone,
  ShoppingCart
} from "lucide-react";

const buttonSizes = [
  { value: 'sm', label: 'Small', class: 'px-3 py-1.5 text-sm' },
  { value: 'md', label: 'Medium', class: 'px-4 py-2' },
  { value: 'lg', label: 'Large', class: 'px-6 py-3 text-lg' },
  { value: 'xl', label: 'Extra Large', class: 'px-8 py-4 text-xl' }
];

const buttonVariants = [
  { value: 'primary', label: 'Primary', class: 'bg-blue-600 text-white hover:bg-blue-700' },
  { value: 'secondary', label: 'Secondary', class: 'bg-gray-600 text-white hover:bg-gray-700' },
  { value: 'outline', label: 'Outline', class: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white' },
  { value: 'ghost', label: 'Ghost', class: 'text-blue-600 hover:bg-blue-50' },
  { value: 'destructive', label: 'Destructive', class: 'bg-red-600 text-white hover:bg-red-700' }
];

const buttonIcons = [
  { value: 'none', label: 'No Icon', icon: null },
  { value: 'play', label: 'Play', icon: Play },
  { value: 'arrow-right', label: 'Arrow Right', icon: ArrowRight },
  { value: 'download', label: 'Download', icon: Download },
  { value: 'mail', label: 'Email', icon: Mail },
  { value: 'phone', label: 'Phone', icon: Phone },
  { value: 'cart', label: 'Shopping Cart', icon: ShoppingCart },
  { value: 'zap', label: 'Zap', icon: Zap }
];

const cornerStyles = [
  { value: 'rounded-none', label: 'Square', icon: Square },
  { value: 'rounded', label: 'Rounded', icon: 'rounded' },
  { value: 'rounded-full', label: 'Pill', icon: Circle }
];

export default function ButtonStyleSelector({ 
  value = {
    size: 'md',
    variant: 'primary',
    icon: 'none',
    iconPosition: 'left',
    corner: 'rounded'
  }, 
  onChange,
  label = "Button Style",
  showIcon = true,
  showCorners = true,
  className = ""
}) {
  const handleChange = (key, newValue) => {
    const updated = { ...value, [key]: newValue };
    if (onChange) {
      onChange(updated);
    }
  };

  const getButtonClasses = () => {
    const size = buttonSizes.find(s => s.value === value.size) || buttonSizes[1];
    const variant = buttonVariants.find(v => v.value === value.variant) || buttonVariants[0];
    const corner = value.corner || 'rounded';
    
    return `${size.class} ${variant.class} ${corner} inline-flex items-center gap-2 font-medium transition-colors`;
  };

  const getSelectedIcon = () => {
    const iconConfig = buttonIcons.find(i => i.value === value.icon);
    return iconConfig?.icon;
  };

  const IconComponent = getSelectedIcon();

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <MousePointer2 className="h-4 w-4" />
        {label}
      </label>

      {/* Button Preview */}
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <button className={getButtonClasses()}>
              {IconComponent && value.iconPosition === 'left' && <IconComponent className="h-4 w-4" />}
              Sample Button
              {IconComponent && value.iconPosition === 'right' && <IconComponent className="h-4 w-4" />}
            </button>
          </div>
          <div className="text-center text-xs text-gray-500 mt-2">
            {buttonSizes.find(s => s.value === value.size)?.label} • {buttonVariants.find(v => v.value === value.variant)?.label}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="style" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="style">Style</TabsTrigger>
          <TabsTrigger value="size">Size</TabsTrigger>
          {showIcon && <TabsTrigger value="icon">Icon</TabsTrigger>}
        </TabsList>

        <TabsContent value="style" className="space-y-3">
          {/* Button Variant */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Variant</label>
            <Select value={value.variant} onValueChange={(v) => handleChange('variant', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {buttonVariants.map((variant) => (
                  <SelectItem key={variant.value} value={variant.value}>
                    {variant.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Corner Style */}
          {showCorners && (
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Corners</label>
              <div className="grid grid-cols-3 gap-2">
                {cornerStyles.map((corner) => {
                  const IconComp = corner.icon === 'rounded' ? null : corner.icon;
                  return (
                    <Button
                      key={corner.value}
                      variant={value.corner === corner.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleChange('corner', corner.value)}
                      className="flex flex-col gap-1 h-auto py-3"
                    >
                      {IconComp && <IconComp className="h-3 w-3" />}
                      {corner.icon === 'rounded' && <div className="w-3 h-3 border border-gray-400 rounded" />}
                      <span className="text-xs">{corner.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="size" className="space-y-3">
          <div className="space-y-3">
            {buttonSizes.map((size) => (
              <Button
                key={size.value}
                variant={value.size === size.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleChange('size', size.value)}
                className="w-full justify-between"
              >
                <span>{size.label}</span>
                <div className={`px-2 py-1 rounded text-xs bg-gray-100 ${size.value === 'sm' ? 'text-xs' : size.value === 'lg' ? 'text-sm' : size.value === 'xl' ? 'text-base' : 'text-xs'}`}>
                  Sample
                </div>
              </Button>
            ))}
          </div>
        </TabsContent>

        {showIcon && (
          <TabsContent value="icon" className="space-y-3">
            {/* Icon Selection */}
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Icon</label>
              <Select value={value.icon} onValueChange={(v) => handleChange('icon', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {buttonIcons.map((icon) => {
                    const IconComp = icon.icon;
                    return (
                      <SelectItem key={icon.value} value={icon.value}>
                        <div className="flex items-center gap-2">
                          {IconComp && <IconComp className="h-4 w-4" />}
                          {icon.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Icon Position */}
            {value.icon !== 'none' && (
              <div className="space-y-2">
                <label className="text-sm text-gray-600">Icon Position</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={value.iconPosition === 'left' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleChange('iconPosition', 'left')}
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Left
                  </Button>
                  <Button
                    variant={value.iconPosition === 'right' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleChange('iconPosition', 'right')}
                  >
                    Right
                    <Play className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}