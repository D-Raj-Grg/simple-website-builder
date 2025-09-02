'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { 
  Square,
  RoundedCorner,
  Circle,
  RectangleHorizontal
} from "lucide-react";

// Border radius presets
const radiusPresets = [
  { 
    value: 'none', 
    label: 'None',
    icon: Square,
    className: 'rounded-none',
    description: 'Sharp corners'
  },
  { 
    value: 'sm', 
    label: 'Small',
    icon: RoundedCorner,
    className: 'rounded-sm',
    description: '2px radius'
  },
  { 
    value: 'md', 
    label: 'Medium',
    icon: RoundedCorner,
    className: 'rounded-md',
    description: '6px radius'
  },
  { 
    value: 'lg', 
    label: 'Large',
    icon: RoundedCorner,
    className: 'rounded-lg',
    description: '8px radius'
  },
  { 
    value: 'xl', 
    label: 'Extra Large',
    icon: RoundedCorner,
    className: 'rounded-xl',
    description: '12px radius'
  },
  { 
    value: '2xl', 
    label: '2X Large',
    icon: RoundedCorner,
    className: 'rounded-2xl',
    description: '16px radius'
  },
  { 
    value: 'full', 
    label: 'Full',
    icon: Circle,
    className: 'rounded-full',
    description: 'Fully rounded'
  }
];

export default function BorderRadiusSelector({ 
  value = {
    preset: 'md',
    custom: false,
    topLeft: 8,
    topRight: 8,
    bottomLeft: 8,
    bottomRight: 8,
    unit: 'px'
  },
  onChange,
  label = "Border Radius",
  showCustom = true,
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

  const handleUniformChange = (newRadius) => {
    if (onChange) {
      onChange({
        ...value,
        topLeft: newRadius,
        topRight: newRadius,
        bottomLeft: newRadius,
        bottomRight: newRadius,
        custom: true,
        preset: 'custom'
      });
    }
  };

  const getCurrentPreset = () => {
    return radiusPresets.find(preset => preset.value === value.preset) || radiusPresets[2];
  };

  const getPreviewStyle = () => {
    if (value.custom) {
      return {
        borderTopLeftRadius: `${value.topLeft}${value.unit}`,
        borderTopRightRadius: `${value.topRight}${value.unit}`,
        borderBottomLeftRadius: `${value.bottomLeft}${value.unit}`,
        borderBottomRightRadius: `${value.bottomRight}${value.unit}`
      };
    }
    
    const preset = getCurrentPreset();
    return { className: preset.className };
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <RoundedCorner className="h-4 w-4" />
        {label}
      </Label>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="presets">Presets</TabsTrigger>
          {showCustom && <TabsTrigger value="custom">Custom</TabsTrigger>}
        </TabsList>

        <TabsContent value="presets" className="space-y-3">
          <div className="space-y-2">
            <Label>Border Radius Presets</Label>
            <div className="grid grid-cols-2 gap-2">
              {radiusPresets.map((preset) => {
                const IconComponent = preset.icon;
                return (
                  <Button
                    key={preset.value}
                    variant={value.preset === preset.value ? "default" : "outline"}
                    size="sm"
                    className="h-16 flex flex-col items-center justify-center gap-1 p-2"
                    onClick={() => {
                      handleChange('preset', preset.value);
                      handleChange('custom', false);
                    }}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span className="text-xs">{preset.label}</span>
                  </Button>
                );
              })}
            </div>
            <div className="text-xs text-gray-500 text-center">
              {getCurrentPreset().description}
            </div>
          </div>
        </TabsContent>

        {showCustom && (
          <TabsContent value="custom" className="space-y-3">
            <div className="space-y-2">
              <Label>Uniform Radius</Label>
              <div className="flex items-center gap-3">
                <Slider
                  value={[value.topLeft]}
                  onValueChange={(values) => handleUniformChange(values[0])}
                  min={0}
                  max={50}
                  step={1}
                  className="flex-1"
                />
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    value={value.topLeft}
                    onChange={(e) => handleUniformChange(parseInt(e.target.value) || 0)}
                    min={0}
                    max={100}
                    className="w-16 text-sm"
                  />
                  <span className="text-sm text-gray-500">{value.unit}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Individual Corners</Label>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Top Left</Label>
                  <Input
                    type="number"
                    value={value.topLeft}
                    onChange={(e) => {
                      handleChange('topLeft', parseInt(e.target.value) || 0);
                      handleChange('custom', true);
                      handleChange('preset', 'custom');
                    }}
                    min={0}
                    max={100}
                    className="text-sm"
                  />
                </div>
                
                <div className="space-y-1">
                  <Label className="text-xs">Top Right</Label>
                  <Input
                    type="number"
                    value={value.topRight}
                    onChange={(e) => {
                      handleChange('topRight', parseInt(e.target.value) || 0);
                      handleChange('custom', true);
                      handleChange('preset', 'custom');
                    }}
                    min={0}
                    max={100}
                    className="text-sm"
                  />
                </div>
                
                <div className="space-y-1">
                  <Label className="text-xs">Bottom Left</Label>
                  <Input
                    type="number"
                    value={value.bottomLeft}
                    onChange={(e) => {
                      handleChange('bottomLeft', parseInt(e.target.value) || 0);
                      handleChange('custom', true);
                      handleChange('preset', 'custom');
                    }}
                    min={0}
                    max={100}
                    className="text-sm"
                  />
                </div>
                
                <div className="space-y-1">
                  <Label className="text-xs">Bottom Right</Label>
                  <Input
                    type="number"
                    value={value.bottomRight}
                    onChange={(e) => {
                      handleChange('bottomRight', parseInt(e.target.value) || 0);
                      handleChange('custom', true);
                      handleChange('preset', 'custom');
                    }}
                    min={0}
                    max={100}
                    className="text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Unit</Label>
              <Select 
                value={value.unit} 
                onValueChange={(newValue) => handleChange('unit', newValue)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="px">Pixels (px)</SelectItem>
                  <SelectItem value="rem">REM</SelectItem>
                  <SelectItem value="%">Percentage (%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        )}
      </Tabs>

      {/* Preview */}
      <div className="space-y-2">
        <Label>Preview</Label>
        <div className="flex justify-center p-4 bg-gray-50 rounded">
          <div 
            className={`w-20 h-20 bg-blue-500 border-2 border-blue-600 ${
              !value.custom ? getCurrentPreset().className : ''
            }`}
            style={value.custom ? getPreviewStyle() : {}}
          />
        </div>
        <div className="text-center text-xs text-gray-500">
          {value.custom 
            ? `Custom: ${value.topLeft}${value.unit} ${value.topRight}${value.unit} ${value.bottomRight}${value.unit} ${value.bottomLeft}${value.unit}`
            : `${getCurrentPreset().label} • ${getCurrentPreset().description}`
          }
        </div>
      </div>

      {/* Visual Corner Guide */}
      {showCustom && activeTab === 'custom' && (
        <div className="p-3 bg-gray-50 rounded">
          <div className="text-xs text-gray-600 mb-2 text-center">Corner Guide</div>
          <div className="relative w-16 h-16 mx-auto border-2 border-dashed border-gray-300">
            <div className="absolute -top-2 -left-2 w-3 h-3 bg-blue-500 rounded-full"></div>
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-green-500 rounded-full"></div>
            <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-orange-500 rounded-full"></div>
            <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-red-500 rounded-full"></div>
            
            <div className="absolute -top-6 -left-6 text-xs text-blue-600">TL</div>
            <div className="absolute -top-6 -right-6 text-xs text-green-600">TR</div>
            <div className="absolute -bottom-6 -left-6 text-xs text-orange-600">BL</div>
            <div className="absolute -bottom-6 -right-6 text-xs text-red-600">BR</div>
          </div>
        </div>
      )}
    </div>
  );
}