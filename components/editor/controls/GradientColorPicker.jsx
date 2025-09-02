'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Palette,
  Copy,
  Check,
  Undo
} from "lucide-react";

const presetGradients = [
  { name: 'Ocean Blue', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { name: 'Sunset', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { name: 'Fresh', value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { name: 'Green', value: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  { name: 'Warm', value: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
  { name: 'Soft', value: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }
];

const presetColors = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899',
  '#6B7280', '#374151', '#1F2937', '#111827', '#F3F4F6', '#E5E7EB'
];

export default function GradientColorPicker({ 
  value = '#3B82F6', 
  onChange,
  label = "Background Color",
  className = ""
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // For custom gradient
  const [color1, setColor1] = useState('#667eea');
  const [color2, setColor2] = useState('#764ba2');
  const [opacity, setOpacity] = useState(100);
  const [direction, setDirection] = useState(135);

  const isGradient = value?.includes('gradient');
  const isSolidColor = !isGradient;

  const handleSolidColorChange = (color) => {
    if (onChange) {
      onChange(color);
    }
  };

  const handleGradientChange = (gradient) => {
    if (onChange) {
      onChange(gradient);
    }
  };

  const buildCustomGradient = () => {
    const gradientValue = `linear-gradient(${direction}deg, ${color1} 0%, ${color2} 100%)`;
    handleGradientChange(gradientValue);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
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
        <Label>{label}</Label>
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
            <span className="flex-1 text-left text-sm font-mono truncate">
              {value || 'Select color'}
            </span>
            <Palette className="h-4 w-4 text-gray-400" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-80 p-0" align="start">
          <Tabs defaultValue={isGradient ? "gradient" : "solid"} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="solid">Solid Color</TabsTrigger>
              <TabsTrigger value="gradient">Gradient</TabsTrigger>
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
                      onClick={() => handleSolidColorChange(color)}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              {/* Custom Color */}
              <div>
                <h4 className="text-sm font-medium mb-3">Custom Color</h4>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={isSolidColor ? value : '#3B82F6'}
                    onChange={(e) => handleSolidColorChange(e.target.value)}
                    className="w-12 h-10 p-1 border rounded"
                  />
                  <Input
                    type="text"
                    value={isSolidColor ? value : '#3B82F6'}
                    onChange={(e) => handleSolidColorChange(e.target.value)}
                    placeholder="#3B82F6"
                    className="flex-1 font-mono text-sm"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="gradient" className="p-4 space-y-4">
              {/* Preset Gradients */}
              <div>
                <h4 className="text-sm font-medium mb-3">Preset Gradients</h4>
                <div className="grid grid-cols-2 gap-2">
                  {presetGradients.map((gradient) => (
                    <button
                      key={gradient.name}
                      className={`h-12 rounded-md border-2 transition-all ${
                        value === gradient.value ? 'border-gray-900 scale-105' : 'border-gray-200 hover:scale-102'
                      }`}
                      style={{ background: gradient.value }}
                      onClick={() => handleGradientChange(gradient.value)}
                      title={gradient.name}
                    />
                  ))}
                </div>
              </div>

              {/* Custom Gradient Builder */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Custom Gradient</h4>
                
                {/* Color Stops */}
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Label className="text-xs">First Color</Label>
                      <div className="flex gap-1 mt-1">
                        <Input
                          type="color"
                          value={color1}
                          onChange={(e) => setColor1(e.target.value)}
                          className="w-8 h-8 p-0 border rounded"
                        />
                        <Input
                          type="text"
                          value={color1}
                          onChange={(e) => setColor1(e.target.value)}
                          className="flex-1 text-xs font-mono"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <Label className="text-xs">Second Color</Label>
                      <div className="flex gap-1 mt-1">
                        <Input
                          type="color"
                          value={color2}
                          onChange={(e) => setColor2(e.target.value)}
                          className="w-8 h-8 p-0 border rounded"
                        />
                        <Input
                          type="text"
                          value={color2}
                          onChange={(e) => setColor2(e.target.value)}
                          className="flex-1 text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Direction */}
                  <div>
                    <Label className="text-xs">Direction: {direction}°</Label>
                    <Slider
                      value={[direction]}
                      onValueChange={(value) => setDirection(value[0])}
                      max={360}
                      min={0}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  {/* Opacity */}
                  <div>
                    <Label className="text-xs">Opacity: {opacity}%</Label>
                    <Slider
                      value={[opacity]}
                      onValueChange={(value) => setOpacity(value[0])}
                      max={100}
                      min={0}
                      step={5}
                      className="mt-2"
                    />
                  </div>

                  {/* Preview and Apply */}
                  <div className="space-y-2">
                    <div 
                      className="w-full h-12 rounded border"
                      style={{ 
                        background: `linear-gradient(${direction}deg, ${color1} 0%, ${color2} 100%)`,
                        opacity: opacity / 100
                      }}
                    />
                    <Button
                      size="sm"
                      onClick={buildCustomGradient}
                      className="w-full"
                    >
                      Apply Gradient
                    </Button>
                  </div>
                </div>
              </div>

              {/* Manual CSS Input */}
              <div>
                <Label className="text-xs">Or enter CSS gradient manually:</Label>
                <Input
                  type="text"
                  value={isGradient ? value : ''}
                  onChange={(e) => handleGradientChange(e.target.value)}
                  placeholder="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  className="font-mono text-xs mt-1"
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Footer */}
          <div className="border-t px-4 py-3 flex justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSolidColorChange('#3B82F6')}
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
    </div>
  );
}