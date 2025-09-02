'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Type, Sliders } from "lucide-react";

const presetSizes = [
  { value: 'XS', label: 'Extra Small', class: 'text-xs', px: '12px' },
  { value: 'S', label: 'Small', class: 'text-sm', px: '14px' },
  { value: 'M', label: 'Medium', class: 'text-base', px: '16px' },
  { value: 'L', label: 'Large', class: 'text-lg', px: '18px' },
  { value: 'XL', label: 'Extra Large', class: 'text-xl', px: '20px' },
  { value: 'XXL', label: '2X Large', class: 'text-2xl', px: '24px' },
  { value: 'XXXL', label: '3X Large', class: 'text-3xl', px: '30px' }
];

export default function FontSizeSelector({ 
  value = 'M', 
  onChange,
  label = "Font Size",
  showCustom = true,
  className = ""
}) {
  const [customSize, setCustomSize] = useState(16);
  const [mode, setMode] = useState('preset'); // 'preset' or 'custom'

  const handlePresetChange = (newValue) => {
    setMode('preset');
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleCustomChange = (newSize) => {
    setCustomSize(newSize);
    setMode('custom');
    if (onChange) {
      onChange(`${newSize}px`);
    }
  };

  const getCurrentSize = () => {
    const preset = presetSizes.find(size => size.value === value);
    return preset || { value: value, label: value, class: '', px: value };
  };

  const currentSize = getCurrentSize();

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <Type className="h-4 w-4" />
        {label}
      </label>

      <Tabs value={mode} onValueChange={setMode} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="preset">Presets</TabsTrigger>
          {showCustom && <TabsTrigger value="custom">Custom</TabsTrigger>}
        </TabsList>

        <TabsContent value="preset" className="space-y-3">
          <Select value={value} onValueChange={handlePresetChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select size">
                <div className="flex items-center justify-between w-full">
                  <span>{currentSize.label}</span>
                  <span className="text-xs text-gray-500">{currentSize.px}</span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {presetSizes.map((size) => (
                <SelectItem key={size.value} value={size.value}>
                  <div className="flex items-center justify-between w-full">
                    <span className={size.class}>{size.label}</span>
                    <span className="text-xs text-gray-400 ml-4">{size.px}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Visual Preview */}
          <div className="p-3 bg-gray-50 rounded border">
            <div className="text-center">
              <span className={currentSize.class} style={{ fontSize: currentSize.px }}>
                Sample Text
              </span>
            </div>
            <div className="text-center text-xs text-gray-500 mt-1">
              {currentSize.px}
            </div>
          </div>
        </TabsContent>

        {showCustom && (
          <TabsContent value="custom" className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Slider
                  value={[customSize]}
                  onValueChange={(values) => handleCustomChange(values[0])}
                  min={8}
                  max={72}
                  step={1}
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={customSize}
                  onChange={(e) => handleCustomChange(parseInt(e.target.value) || 16)}
                  min={8}
                  max={72}
                  className="w-16 text-sm"
                />
                <span className="text-sm text-gray-500">px</span>
              </div>
            </div>

            {/* Visual Preview */}
            <div className="p-3 bg-gray-50 rounded border">
              <div className="text-center">
                <span style={{ fontSize: `${customSize}px` }}>
                  Sample Text
                </span>
              </div>
              <div className="text-center text-xs text-gray-500 mt-1">
                {customSize}px
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}