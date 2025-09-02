'use client';

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Bold, Italic, Type } from "lucide-react";

const fontWeights = [
  { value: 'light', label: 'Light', class: 'font-light', weight: '300' },
  { value: 'normal', label: 'Normal', class: 'font-normal', weight: '400' },
  { value: 'medium', label: 'Medium', class: 'font-medium', weight: '500' },
  { value: 'semibold', label: 'Semi Bold', class: 'font-semibold', weight: '600' },
  { value: 'bold', label: 'Bold', class: 'font-bold', weight: '700' },
  { value: 'extrabold', label: 'Extra Bold', class: 'font-extrabold', weight: '800' },
  { value: 'black', label: 'Black', class: 'font-black', weight: '900' }
];

export default function FontWeightSelector({ 
  value = 'normal', 
  onChange,
  label = "Font Weight",
  showPreview = true,
  compact = false,
  className = ""
}) {
  const handleChange = (newValue) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  const getCurrentWeight = () => {
    return fontWeights.find(weight => weight.value === value) || fontWeights[1];
  };

  const currentWeight = getCurrentWeight();

  if (compact) {
    return (
      <div className={`space-y-2 ${className}`}>
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <Select value={value} onValueChange={handleChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {fontWeights.map((weight) => (
              <SelectItem key={weight.value} value={weight.value}>
                <span className={weight.class}>{weight.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <Type className="h-4 w-4" />
        {label}
      </label>

      {/* Visual Preview */}
      {showPreview && (
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <span className={`text-lg ${currentWeight.class}`}>
                Sample Text
              </span>
            </div>
            <div className="text-center text-xs text-gray-500 mt-1">
              {currentWeight.label} ({currentWeight.weight})
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weight Grid */}
      <div className="grid grid-cols-2 gap-2">
        {fontWeights.map((weight) => (
          <Button
            key={weight.value}
            variant={value === weight.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleChange(weight.value)}
            className="justify-between"
          >
            <span className={weight.class}>{weight.label}</span>
            <span className="text-xs text-gray-500">{weight.weight}</span>
          </Button>
        ))}
      </div>

      {/* Alternative: Slider-style selector */}
      <div className="hidden"> {/* Hidden alternative implementation */}
        <div className="flex items-center justify-between p-2 border rounded">
          {fontWeights.map((weight, index) => (
            <button
              key={weight.value}
              onClick={() => handleChange(weight.value)}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                value === weight.value 
                  ? 'border-blue-500 bg-blue-50 scale-110' 
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              }`}
              title={weight.label}
            >
              <span className={`text-xs ${weight.class}`}>A</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}