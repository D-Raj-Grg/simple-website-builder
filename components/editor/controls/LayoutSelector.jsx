'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { 
  Grid3X3, 
  LayoutGrid, 
  Columns2, 
  Columns3, 
  Columns4,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Layout
} from "lucide-react";

// Grid layout options
const gridLayouts = [
  { 
    value: '1', 
    label: '1 Column',
    icon: Columns2,
    description: 'Single column layout',
    className: 'grid-cols-1'
  },
  { 
    value: '2', 
    label: '2 Columns',
    icon: Columns2,
    description: 'Two column grid',
    className: 'grid-cols-1 md:grid-cols-2'
  },
  { 
    value: '3', 
    label: '3 Columns',
    icon: Columns3,
    description: 'Three column grid',
    className: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  },
  { 
    value: '4', 
    label: '4 Columns',
    icon: Columns4,
    description: 'Four column grid',
    className: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4'
  },
  { 
    value: 'auto', 
    label: 'Auto Fit',
    icon: LayoutGrid,
    description: 'Responsive auto-fit columns',
    className: 'grid-cols-[repeat(auto-fit,minmax(250px,1fr))]'
  }
];

// Content alignment options
const alignmentOptions = [
  {
    value: 'left',
    label: 'Left',
    icon: AlignLeft,
    className: 'justify-start text-left'
  },
  {
    value: 'center',
    label: 'Center',
    icon: AlignCenter,
    className: 'justify-center text-center'
  },
  {
    value: 'right',
    label: 'Right',
    icon: AlignRight,
    className: 'justify-end text-right'
  },
  {
    value: 'justify',
    label: 'Justify',
    icon: AlignJustify,
    className: 'justify-between text-justify'
  }
];

// Gap/spacing options
const gapOptions = [
  { value: '0', label: 'None', className: 'gap-0' },
  { value: '1', label: 'Small', className: 'gap-1' },
  { value: '2', label: 'Medium', className: 'gap-2' },
  { value: '4', label: 'Large', className: 'gap-4' },
  { value: '6', label: 'Extra Large', className: 'gap-6' },
  { value: '8', label: 'XXL', className: 'gap-8' }
];

export default function LayoutSelector({ 
  value = {
    columns: '3',
    alignment: 'center',
    gap: '4',
    aspectRatio: 'auto',
    itemAlignment: 'start'
  },
  onChange,
  label = "Layout Settings",
  showColumns = true,
  showAlignment = true,
  showGap = true,
  className = ""
}) {
  const [activeTab, setActiveTab] = useState('grid');

  const handleChange = (key, newValue) => {
    if (onChange) {
      onChange({
        ...value,
        [key]: newValue
      });
    }
  };

  const getCurrentGrid = () => {
    return gridLayouts.find(layout => layout.value === value.columns) || gridLayouts[2];
  };

  const getCurrentAlignment = () => {
    return alignmentOptions.find(align => align.value === value.alignment) || alignmentOptions[1];
  };

  const getCurrentGap = () => {
    return gapOptions.find(gap => gap.value === value.gap) || gapOptions[3];
  };

  const currentGrid = getCurrentGrid();
  const currentAlignment = getCurrentAlignment();
  const currentGap = getCurrentGap();

  return (
    <div className={`space-y-4 ${className}`}>
      <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <Layout className="h-4 w-4" />
        {label}
      </Label>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="grid">Grid</TabsTrigger>
          <TabsTrigger value="alignment">Alignment</TabsTrigger>
          <TabsTrigger value="spacing">Spacing</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-3">
          {showColumns && (
            <div className="space-y-2">
              <Label>Grid Columns</Label>
              <div className="grid grid-cols-2 gap-2">
                {gridLayouts.map((layout) => {
                  const IconComponent = layout.icon;
                  return (
                    <Button
                      key={layout.value}
                      variant={value.columns === layout.value ? "default" : "outline"}
                      size="sm"
                      className="h-16 flex flex-col items-center justify-center gap-1 p-2"
                      onClick={() => handleChange('columns', layout.value)}
                    >
                      <IconComponent className="h-4 w-4" />
                      <span className="text-xs">{layout.label}</span>
                    </Button>
                  );
                })}
              </div>
              <div className="text-xs text-gray-500">
                {currentGrid.description}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Aspect Ratio</Label>
            <Select 
              value={value.aspectRatio} 
              onValueChange={(newValue) => handleChange('aspectRatio', newValue)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto</SelectItem>
                <SelectItem value="square">Square (1:1)</SelectItem>
                <SelectItem value="landscape">Landscape (4:3)</SelectItem>
                <SelectItem value="portrait">Portrait (3:4)</SelectItem>
                <SelectItem value="wide">Wide (16:9)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        <TabsContent value="alignment" className="space-y-3">
          {showAlignment && (
            <div className="space-y-2">
              <Label>Content Alignment</Label>
              <div className="grid grid-cols-2 gap-2">
                {alignmentOptions.map((align) => {
                  const IconComponent = align.icon;
                  return (
                    <Button
                      key={align.value}
                      variant={value.alignment === align.value ? "default" : "outline"}
                      size="sm"
                      className="h-12 flex items-center justify-center gap-2"
                      onClick={() => handleChange('alignment', align.value)}
                    >
                      <IconComponent className="h-4 w-4" />
                      <span className="text-xs">{align.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Item Alignment</Label>
            <Select 
              value={value.itemAlignment} 
              onValueChange={(newValue) => handleChange('itemAlignment', newValue)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="start">Top</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="end">Bottom</SelectItem>
                <SelectItem value="stretch">Stretch</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        <TabsContent value="spacing" className="space-y-3">
          {showGap && (
            <div className="space-y-2">
              <Label>Grid Gap</Label>
              <Select 
                value={value.gap} 
                onValueChange={(newValue) => handleChange('gap', newValue)}
              >
                <SelectTrigger>
                  <SelectValue>
                    <div className="flex items-center justify-between w-full">
                      <span>{currentGap.label}</span>
                      <span className="text-xs text-gray-500">{currentGap.className}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {gapOptions.map((gap) => (
                    <SelectItem key={gap.value} value={gap.value}>
                      <div className="flex items-center justify-between w-full">
                        <span>{gap.label}</span>
                        <span className="text-xs text-gray-400 ml-4">{gap.className}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label>Container Max Width</Label>
            <Select 
              value={value.maxWidth || 'full'} 
              onValueChange={(newValue) => handleChange('maxWidth', newValue)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sm">Small (640px)</SelectItem>
                <SelectItem value="md">Medium (768px)</SelectItem>
                <SelectItem value="lg">Large (1024px)</SelectItem>
                <SelectItem value="xl">Extra Large (1280px)</SelectItem>
                <SelectItem value="2xl">2X Large (1536px)</SelectItem>
                <SelectItem value="full">Full Width</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
      </Tabs>

      {/* Preview */}
      <div className="p-4 bg-gray-50 rounded border">
        <div className="text-center text-xs text-gray-500 mb-3">Layout Preview</div>
        <div className={`grid ${currentGrid.className} ${currentGap.className} ${currentAlignment.className}`}>
          {Array.from({ length: parseInt(value.columns) === 0 ? 3 : Math.min(parseInt(value.columns) || 3, 4) }, (_, i) => (
            <div 
              key={i}
              className="bg-gray-200 rounded h-8 flex items-center justify-center"
            >
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
        <div className="text-center text-xs text-gray-500 mt-2">
          {currentGrid.label} • {currentAlignment.label} • {currentGap.label} Gap
        </div>
      </div>
    </div>
  );
}