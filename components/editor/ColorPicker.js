'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { 
  Palette,
  Pipette,
  Undo,
  Copy,
  Check,
  AlertCircle
} from "lucide-react";

const presetColors = [
  // Primary colors
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899',
  // Secondary colors  
  '#6B7280', '#374151', '#1F2937', '#111827', '#F3F4F6', '#E5E7EB',
  // Brand colors
  '#1D4ED8', '#DC2626', '#059669', '#D97706', '#7C3AED', '#DB2777',
  // Light colors
  '#DBEAFE', '#FEE2E2', '#D1FAE5', '#FEF3C7', '#E9D5FF', '#FCE7F3'
];

const gradientPresets = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  'linear-gradient(135deg, #ff8a80 0%, #ea80fc 100%)'
];

export default function ColorPicker({ 
  value = '#3B82F6', 
  onChange,
  label = "Color",
  showGradients = false,
  showOpacity = false,
  className = ""
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState(value);
  const [opacity, setOpacity] = useState(100);
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);

  const isGradient = value?.includes('gradient');

  const handleColorChange = (newColor) => {
    // Add to history
    if (value && !history.includes(value)) {
      setHistory(prev => [value, ...prev.slice(0, 9)]); // Keep last 10
    }
    
    setCustomColor(newColor);
    if (onChange) {
      onChange(newColor);
    }
  };

  const handleOpacityChange = (newOpacity) => {
    setOpacity(newOpacity[0]);
    
    // Apply opacity to current color
    if (customColor.startsWith('#')) {
      const hex = customColor.slice(1);
      const alpha = Math.round((newOpacity[0] / 100) * 255).toString(16).padStart(2, '0');
      const colorWithAlpha = `#${hex}${alpha}`;
      handleColorChange(colorWithAlpha);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy color:', err);
    }
  };

  const getColorPreview = () => {
    if (isGradient) {
      return { background: value };
    }
    return { backgroundColor: value };
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {value && (
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5"
            onClick={copyToClipboard}
          >
            {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
          </Button>
        )}
      </div>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full h-10 justify-start gap-3 px-3"
          >
            <div 
              className="w-6 h-6 rounded border border-gray-200 flex-shrink-0"
              style={getColorPreview()}
            />
            <span className="flex-1 text-left text-sm font-mono">
              {value || 'Select color'}
            </span>
            <Palette className="h-4 w-4 text-gray-400" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-80 p-0" align="start">
          <Tabs defaultValue="solid" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="solid">Solid</TabsTrigger>
              {showGradients && <TabsTrigger value="gradient">Gradient</TabsTrigger>}
            </TabsList>

            <TabsContent value="solid" className="p-4 space-y-4">
              {/* Preset Colors */}
              <div>
                <h4 className="text-sm font-medium mb-3">Preset Colors</h4>
                <div className="grid grid-cols-6 gap-2">
                  {presetColors.map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-md border-2 transition-all ${
                        value === color ? 'border-gray-900 scale-110' : 'border-gray-200 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleColorChange(color)}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              {/* Custom Color Input */}
              <div>
                <h4 className="text-sm font-medium mb-3">Custom Color</h4>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={customColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-12 h-10 p-1 border rounded"
                  />
                  <Input
                    type="text"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    onBlur={(e) => handleColorChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleColorChange(e.target.value);
                      }
                    }}
                    placeholder="#3B82F6"
                    className="flex-1 font-mono text-sm"
                  />
                </div>
              </div>

              {/* Opacity Slider */}
              {showOpacity && (
                <div>
                  <h4 className="text-sm font-medium mb-3">Opacity</h4>
                  <div className="space-y-2">
                    <Slider
                      value={[opacity]}
                      onValueChange={handleOpacityChange}
                      max={100}
                      min={0}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>0%</span>
                      <span>{opacity}%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Color History */}
              {history.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-3">Recent Colors</h4>
                  <div className="flex gap-2 flex-wrap">
                    {history.slice(0, 8).map((color, index) => (
                      <button
                        key={index}
                        className="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        onClick={() => handleColorChange(color)}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {showGradients && (
              <TabsContent value="gradient" className="p-4 space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-3">Gradient Presets</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {gradientPresets.map((gradient, index) => (
                      <button
                        key={index}
                        className={`h-12 rounded-md border-2 transition-all ${
                          value === gradient ? 'border-gray-900 scale-105' : 'border-gray-200 hover:scale-102'
                        }`}
                        style={{ background: gradient }}
                        onClick={() => handleColorChange(gradient)}
                        title={gradient}
                      />
                    ))}
                  </div>
                </div>

                {/* Custom Gradient Input */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Custom Gradient</h4>
                  <Input
                    type="text"
                    value={isGradient ? value : ''}
                    onChange={(e) => handleColorChange(e.target.value)}
                    placeholder="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter a CSS gradient value
                  </p>
                </div>
              </TabsContent>
            )}
          </Tabs>

          {/* Footer Actions */}
          <div className="border-t px-4 py-3 flex justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleColorChange('#3B82F6')}
            >
              <Undo className="mr-2 h-3 w-3" />
              Reset
            </Button>
            
            <Button
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              Done
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Error Display */}
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );
}