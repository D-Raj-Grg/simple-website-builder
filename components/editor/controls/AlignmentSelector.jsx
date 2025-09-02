'use client';

import { Button } from "@/components/ui/button";
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  MoveHorizontal,
  MoveVertical
} from "lucide-react";

const textAlignments = [
  { value: 'left', label: 'Left', icon: AlignLeft },
  { value: 'center', label: 'Center', icon: AlignCenter },
  { value: 'right', label: 'Right', icon: AlignRight },
  { value: 'justify', label: 'Justify', icon: AlignJustify }
];

const horizontalAlignments = [
  { value: 'left', label: 'Left', icon: AlignLeft, class: 'justify-start' },
  { value: 'center', label: 'Center', icon: AlignCenter, class: 'justify-center' },
  { value: 'right', label: 'Right', icon: AlignRight, class: 'justify-end' }
];

const verticalAlignments = [
  { value: 'flex-start', label: 'Top', icon: AlignLeft, class: 'items-start' },
  { value: 'center', label: 'Center', icon: AlignCenter, class: 'items-center' },
  { value: 'flex-end', label: 'Bottom', icon: AlignRight, class: 'items-end' },
  { value: 'stretch', label: 'Stretch', icon: MoveVertical, class: 'items-stretch' }
];

export default function AlignmentSelector({ 
  value = 'left',
  onChange,
  label = "Alignment",
  type = 'text', // 'text', 'horizontal', 'vertical'
  compact = false,
  className = ""
}) {
  const handleChange = (newValue) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  const getAlignmentOptions = () => {
    switch (type) {
      case 'horizontal':
        return horizontalAlignments;
      case 'vertical':
        return verticalAlignments;
      case 'text':
      default:
        return textAlignments;
    }
  };

  const alignmentOptions = getAlignmentOptions();

  if (compact) {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {alignmentOptions.map((alignment) => {
          const IconComponent = alignment.icon;
          return (
            <Button
              key={alignment.value}
              variant={value === alignment.value ? 'default' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => handleChange(alignment.value)}
              title={alignment.label}
            >
              <IconComponent className="h-3 w-3" />
            </Button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        {type === 'horizontal' && <MoveHorizontal className="h-4 w-4" />}
        {type === 'vertical' && <MoveVertical className="h-4 w-4" />}
        {type === 'text' && <AlignCenter className="h-4 w-4" />}
        {label}
      </label>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {alignmentOptions.map((alignment) => {
          const IconComponent = alignment.icon;
          return (
            <Button
              key={alignment.value}
              variant={value === alignment.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleChange(alignment.value)}
              className="flex flex-col gap-1 h-auto py-3"
            >
              <IconComponent className="h-4 w-4" />
              <span className="text-xs">{alignment.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Preview Area */}
      <div className="p-3 bg-gray-50 rounded border">
        <div 
          className={`flex ${
            type === 'horizontal' ? alignmentOptions.find(a => a.value === value)?.class : ''
          } ${
            type === 'vertical' ? `${alignmentOptions.find(a => a.value === value)?.class} h-16` : ''
          }`}
        >
          {type === 'text' ? (
            <div className="w-full">
              <div className={`text-${value}`}>
                Sample text alignment
              </div>
            </div>
          ) : type === 'horizontal' ? (
            <>
              <div className="w-8 h-8 bg-blue-200 rounded"></div>
              <div className="w-8 h-8 bg-blue-300 rounded"></div>
              <div className="w-8 h-8 bg-blue-400 rounded"></div>
            </>
          ) : (
            <div className="flex flex-col w-full h-full">
              <div className="w-full h-2 bg-blue-200 rounded mb-1"></div>
              <div className="w-full h-2 bg-blue-300 rounded mb-1"></div>
              <div className="w-full h-2 bg-blue-400 rounded"></div>
            </div>
          )}
        </div>
        <div className="text-center text-xs text-gray-500 mt-2">
          {alignmentOptions.find(a => a.value === value)?.label}
        </div>
      </div>
    </div>
  );
}