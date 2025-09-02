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
  Square,
  Shadow,
  Layers,
  Plus,
  Trash2
} from "lucide-react";

// Shadow presets
const shadowPresets = [
  { 
    value: 'none', 
    label: 'None',
    description: 'No shadow',
    css: 'shadow-none',
    boxShadow: 'none'
  },
  { 
    value: 'sm', 
    label: 'Small',
    description: 'Subtle shadow',
    css: 'shadow-sm',
    boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
  },
  { 
    value: 'md', 
    label: 'Medium',
    description: 'Default shadow',
    css: 'shadow-md',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
  },
  { 
    value: 'lg', 
    label: 'Large',
    description: 'Pronounced shadow',
    css: 'shadow-lg',
    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
  },
  { 
    value: 'xl', 
    label: 'Extra Large',
    description: 'Strong shadow',
    css: 'shadow-xl',
    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
  },
  { 
    value: '2xl', 
    label: '2X Large',
    description: 'Very strong shadow',
    css: 'shadow-2xl',
    boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)'
  },
  { 
    value: 'inner', 
    label: 'Inner',
    description: 'Inset shadow',
    css: 'shadow-inner',
    boxShadow: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)'
  }
];

export default function ShadowSelector({ 
  value = {
    preset: 'none',
    custom: false,
    shadows: [{
      x: 0,
      y: 4,
      blur: 6,
      spread: 0,
      color: '#00000040',
      inset: false
    }],
    enabled: false
  },
  onChange,
  label = "Shadow Settings",
  showCustom = true,
  maxShadows = 3,
  className = ""
}) {
  const [activeTab, setActiveTab] = useState('presets');

  const handleChange = (key, newValue) => {
    if (onChange) {
      onChange({
        ...value,
        [key]: newValue
      });
    }
  };

  const handleShadowChange = (shadowIndex, property, newValue) => {
    const newShadows = [...value.shadows];
    newShadows[shadowIndex] = {
      ...newShadows[shadowIndex],
      [property]: newValue
    };
    
    handleChange('shadows', newShadows);
    handleChange('custom', true);
    handleChange('preset', 'custom');
  };

  const addShadow = () => {
    if (value.shadows.length < maxShadows) {
      const newShadows = [...value.shadows, {
        x: 0,
        y: 4,
        blur: 6,
        spread: 0,
        color: '#00000040',
        inset: false
      }];
      handleChange('shadows', newShadows);
      handleChange('custom', true);
    }
  };

  const removeShadow = (shadowIndex) => {
    if (value.shadows.length > 1) {
      const newShadows = value.shadows.filter((_, index) => index !== shadowIndex);
      handleChange('shadows', newShadows);
    }
  };

  const getCurrentPreset = () => {
    return shadowPresets.find(preset => preset.value === value.preset) || shadowPresets[0];
  };

  const generateCustomShadowCSS = () => {
    return value.shadows.map(shadow => {
      const { x, y, blur, spread, color, inset } = shadow;
      return `${inset ? 'inset ' : ''}${x}px ${y}px ${blur}px ${spread}px ${color}`;
    }).join(', ');
  };

  const getPreviewStyle = () => {
    if (!value.enabled) {
      return { boxShadow: 'none' };
    }

    if (value.custom) {
      return { boxShadow: generateCustomShadowCSS() };
    }
    
    const preset = getCurrentPreset();
    return { boxShadow: preset.boxShadow };
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Shadow className="h-4 w-4" />
          {label}
        </Label>
        <Switch
          checked={value.enabled}
          onCheckedChange={(checked) => handleChange('enabled', checked)}
        />
      </div>

      {value.enabled && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="presets">Presets</TabsTrigger>
            {showCustom && <TabsTrigger value="custom">Custom</TabsTrigger>}
          </TabsList>

          <TabsContent value="presets" className="space-y-3">
            <div className="space-y-2">
              <Label>Shadow Presets</Label>
              <div className="grid grid-cols-2 gap-2">
                {shadowPresets.map((preset) => (
                  <Button
                    key={preset.value}
                    variant={value.preset === preset.value && !value.custom ? "default" : "outline"}
                    size="sm"
                    className="h-16 flex flex-col items-center justify-center gap-1 p-2"
                    onClick={() => {
                      handleChange('preset', preset.value);
                      handleChange('custom', false);
                    }}
                  >
                    <div 
                      className="w-4 h-4 bg-blue-500 rounded"
                      style={{ boxShadow: preset.boxShadow }}
                    />
                    <span className="text-xs">{preset.label}</span>
                  </Button>
                ))}
              </div>
              <div className="text-xs text-gray-500 text-center">
                {getCurrentPreset().description}
              </div>
            </div>
          </TabsContent>

          {showCustom && (
            <TabsContent value="custom" className="space-y-3">
              <div className="space-y-4">
                {value.shadows.map((shadow, index) => (
                  <div key={index} className="p-3 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Shadow {index + 1}</Label>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={shadow.inset}
                          onCheckedChange={(checked) => handleShadowChange(index, 'inset', checked)}
                        />
                        <Label className="text-xs">Inset</Label>
                        {value.shadows.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeShadow(index)}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">X Offset</Label>
                        <div className="flex items-center gap-2">
                          <Slider
                            value={[shadow.x]}
                            onValueChange={(values) => handleShadowChange(index, 'x', values[0])}
                            min={-20}
                            max={20}
                            step={1}
                            className="flex-1"
                          />
                          <span className="text-xs w-8">{shadow.x}px</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Y Offset</Label>
                        <div className="flex items-center gap-2">
                          <Slider
                            value={[shadow.y]}
                            onValueChange={(values) => handleShadowChange(index, 'y', values[0])}
                            min={-20}
                            max={20}
                            step={1}
                            className="flex-1"
                          />
                          <span className="text-xs w-8">{shadow.y}px</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Blur</Label>
                        <div className="flex items-center gap-2">
                          <Slider
                            value={[shadow.blur]}
                            onValueChange={(values) => handleShadowChange(index, 'blur', values[0])}
                            min={0}
                            max={50}
                            step={1}
                            className="flex-1"
                          />
                          <span className="text-xs w-8">{shadow.blur}px</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Spread</Label>
                        <div className="flex items-center gap-2">
                          <Slider
                            value={[shadow.spread]}
                            onValueChange={(values) => handleShadowChange(index, 'spread', values[0])}
                            min={-20}
                            max={20}
                            step={1}
                            className="flex-1"
                          />
                          <span className="text-xs w-8">{shadow.spread}px</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs">Color</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          value={shadow.color.substring(0, 7)}
                          onChange={(e) => {
                            const opacity = shadow.color.length > 7 ? shadow.color.substring(7) : '40';
                            handleShadowChange(index, 'color', e.target.value + opacity);
                          }}
                          className="w-12 h-8 border rounded cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={shadow.color}
                          onChange={(e) => handleShadowChange(index, 'color', e.target.value)}
                          placeholder="#00000040"
                          className="font-mono text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {value.shadows.length < maxShadows && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addShadow}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Shadow Layer
                  </Button>
                )}
              </div>
            </TabsContent>
          )}
        </Tabs>
      )}

      {/* Preview */}
      <div className="space-y-2">
        <Label>Preview</Label>
        <div className="flex justify-center p-8 bg-gray-50 rounded">
          <div 
            className="w-20 h-20 bg-white border rounded-lg"
            style={getPreviewStyle()}
          />
        </div>
        <div className="text-center text-xs text-gray-500">
          {!value.enabled 
            ? 'Shadow disabled'
            : value.custom 
              ? `Custom: ${value.shadows.length} layer${value.shadows.length > 1 ? 's' : ''}`
              : `${getCurrentPreset().label} • ${getCurrentPreset().description}`
          }
        </div>
      </div>

      {/* CSS Output */}
      {value.enabled && value.custom && showCustom && (
        <div className="p-3 bg-gray-50 rounded">
          <Label className="text-xs text-gray-600">CSS Output</Label>
          <code className="text-xs block mt-1 p-2 bg-white rounded border font-mono">
            box-shadow: {generateCustomShadowCSS()};
          </code>
        </div>
      )}
    </div>
  );
}