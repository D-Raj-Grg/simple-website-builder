'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Square, 
  Move,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Box
} from "lucide-react";

const presetSpacings = [
  { value: 'none', label: 'None', class: '0', px: '0px' },
  { value: 'xs', label: 'Extra Small', class: '1', px: '4px' },
  { value: 'sm', label: 'Small', class: '2', px: '8px' },
  { value: 'md', label: 'Medium', class: '4', px: '16px' },
  { value: 'lg', label: 'Large', class: '6', px: '24px' },
  { value: 'xl', label: 'Extra Large', class: '8', px: '32px' },
  { value: 'xxl', label: '2X Large', class: '12', px: '48px' },
  { value: 'xxxl', label: '3X Large', class: '16', px: '64px' }
];

const spacingTypes = [
  { value: 'all', label: 'All Sides', icon: Square },
  { value: 'vertical', label: 'Top & Bottom', icon: ArrowUp },
  { value: 'horizontal', label: 'Left & Right', icon: ArrowLeft },
  { value: 'individual', label: 'Individual', icon: Box }
];

export default function SpacingSelector({ 
  value = 'md',
  onChange,
  label = "Spacing",
  type = 'padding', // 'padding', 'margin', 'gap'
  mode = 'preset', // 'preset', 'individual'
  showCustom = true,
  className = ""
}) {
  const [customValues, setCustomValues] = useState({
    top: 16,
    right: 16,
    bottom: 16,
    left: 16
  });
  const [spacingType, setSpacingType] = useState('all');

  const handlePresetChange = (newValue) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleCustomChange = (side, newValue) => {
    const updated = { ...customValues, [side]: newValue };
    setCustomValues(updated);
    
    if (onChange) {
      onChange(updated);
    }
  };

  const handleAllSidesChange = (newValue) => {
    const updated = {
      top: newValue,
      right: newValue,
      bottom: newValue,
      left: newValue
    };
    setCustomValues(updated);
    
    if (onChange) {
      onChange(updated);
    }
  };

  const getCurrentSpacing = () => {
    return presetSpacings.find(spacing => spacing.value === value) || presetSpacings[3];
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'margin': return 'Margin';
      case 'gap': return 'Gap';
      case 'padding':
      default: return 'Padding';
    }
  };

  const currentSpacing = getCurrentSpacing();

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <Box className="h-4 w-4" />
        {label} ({getTypeLabel()})
      </label>

      <Tabs value={mode} onValueChange={(v) => onChange && onChange(v)} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="preset">Presets</TabsTrigger>
          {showCustom && <TabsTrigger value="individual">Custom</TabsTrigger>}
        </TabsList>

        <TabsContent value="preset" className="space-y-3">
          <Select value={value} onValueChange={handlePresetChange}>
            <SelectTrigger>
              <SelectValue>
                <div className="flex items-center justify-between w-full">
                  <span>{currentSpacing.label}</span>
                  <span className="text-xs text-gray-500">{currentSpacing.px}</span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {presetSpacings.map((spacing) => (
                <SelectItem key={spacing.value} value={spacing.value}>
                  <div className="flex items-center justify-between w-full">
                    <span>{spacing.label}</span>
                    <span className="text-xs text-gray-400 ml-4">{spacing.px}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Visual Preview */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-center">
                <div 
                  className={`bg-blue-50 border-2 border-dashed border-blue-300 ${
                    type === 'padding' ? `p-${currentSpacing.class}` : 
                    type === 'margin' ? `m-${currentSpacing.class}` : 
                    `gap-${currentSpacing.class}`
                  }`}
                >
                  <div className="w-16 h-16 bg-blue-200 rounded flex items-center justify-center">
                    <Square className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="text-center text-xs text-gray-500 mt-2">
                {currentSpacing.label} - {currentSpacing.px}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {showCustom && (
          <TabsContent value="individual" className="space-y-3">
            {/* Spacing Type Selector */}
            <div className="grid grid-cols-2 gap-2">
              {spacingTypes.slice(0, 2).map((sType) => {
                const IconComponent = sType.icon;
                return (
                  <Button
                    key={sType.value}
                    variant={spacingType === sType.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSpacingType(sType.value)}
                    className="flex items-center gap-2"
                  >
                    <IconComponent className="h-3 w-3" />
                    {sType.label}
                  </Button>
                );
              })}
            </div>

            {spacingType === 'all' && (
              <div className="space-y-2">
                <label className="text-sm text-gray-600">All Sides</label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[customValues.top]}
                    onValueChange={(values) => handleAllSidesChange(values[0])}
                    min={0}
                    max={128}
                    step={4}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={customValues.top}
                    onChange={(e) => handleAllSidesChange(parseInt(e.target.value) || 0)}
                    min={0}
                    max={128}
                    className="w-16 text-sm"
                  />
                  <span className="text-sm text-gray-500">px</span>
                </div>
              </div>
            )}

            {spacingType === 'vertical' && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="text-sm text-gray-600 flex items-center gap-1">
                    <ArrowUp className="h-3 w-3" />
                    Top & Bottom
                  </label>
                  <div className="flex items-center gap-2">
                    <Slider
                      value={[customValues.top]}
                      onValueChange={(values) => {
                        handleCustomChange('top', values[0]);
                        handleCustomChange('bottom', values[0]);
                      }}
                      min={0}
                      max={128}
                      step={4}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={customValues.top}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        handleCustomChange('top', val);
                        handleCustomChange('bottom', val);
                      }}
                      min={0}
                      max={128}
                      className="w-16 text-sm"
                    />
                    <span className="text-sm text-gray-500">px</span>
                  </div>
                </div>
              </div>
            )}

            {spacingType === 'horizontal' && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="text-sm text-gray-600 flex items-center gap-1">
                    <ArrowLeft className="h-3 w-3" />
                    Left & Right
                  </label>
                  <div className="flex items-center gap-2">
                    <Slider
                      value={[customValues.left]}
                      onValueChange={(values) => {
                        handleCustomChange('left', values[0]);
                        handleCustomChange('right', values[0]);
                      }}
                      min={0}
                      max={128}
                      step={4}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={customValues.left}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        handleCustomChange('left', val);
                        handleCustomChange('right', val);
                      }}
                      min={0}
                      max={128}
                      className="w-16 text-sm"
                    />
                    <span className="text-sm text-gray-500">px</span>
                  </div>
                </div>
              </div>
            )}

            {spacingType === 'individual' && (
              <div className="space-y-3">
                {/* Individual side controls */}
                {['top', 'right', 'bottom', 'left'].map((side) => {
                  const icons = {
                    top: ArrowUp,
                    right: ArrowRight,
                    bottom: ArrowDown,
                    left: ArrowLeft
                  };
                  const IconComponent = icons[side];
                  
                  return (
                    <div key={side} className="space-y-2">
                      <label className="text-sm text-gray-600 flex items-center gap-1 capitalize">
                        <IconComponent className="h-3 w-3" />
                        {side}
                      </label>
                      <div className="flex items-center gap-2">
                        <Slider
                          value={[customValues[side]]}
                          onValueChange={(values) => handleCustomChange(side, values[0])}
                          min={0}
                          max={128}
                          step={4}
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          value={customValues[side]}
                          onChange={(e) => handleCustomChange(side, parseInt(e.target.value) || 0)}
                          min={0}
                          max={128}
                          className="w-16 text-sm"
                        />
                        <span className="text-sm text-gray-500">px</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Visual Preview */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-center">
                  <div 
                    className="bg-blue-50 border-2 border-dashed border-blue-300"
                    style={{
                      padding: type === 'padding' ? 
                        `${customValues.top}px ${customValues.right}px ${customValues.bottom}px ${customValues.left}px` : 
                        undefined,
                      margin: type === 'margin' ? 
                        `${customValues.top}px ${customValues.right}px ${customValues.bottom}px ${customValues.left}px` : 
                        undefined
                    }}
                  >
                    <div className="w-16 h-16 bg-blue-200 rounded flex items-center justify-center">
                      <Square className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </div>
                <div className="text-center text-xs text-gray-500 mt-2">
                  T:{customValues.top} R:{customValues.right} B:{customValues.bottom} L:{customValues.left}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}