'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { 
  Play,
  Pause,
  RotateCw,
  Move,
  ZoomIn,
  Zap,
  Waves
} from "lucide-react";

// Animation presets
const animationPresets = [
  { 
    value: 'none', 
    label: 'None',
    icon: Pause,
    description: 'No animation',
    css: ''
  },
  { 
    value: 'fade-in', 
    label: 'Fade In',
    icon: ZoomIn,
    description: 'Smooth fade entrance',
    css: 'animate-in fade-in'
  },
  { 
    value: 'slide-up', 
    label: 'Slide Up',
    icon: Move,
    description: 'Slide from bottom',
    css: 'animate-in slide-in-from-bottom'
  },
  { 
    value: 'slide-down', 
    label: 'Slide Down',
    icon: Move,
    description: 'Slide from top',
    css: 'animate-in slide-in-from-top'
  },
  { 
    value: 'slide-left', 
    label: 'Slide Left',
    icon: Move,
    description: 'Slide from right',
    css: 'animate-in slide-in-from-right'
  },
  { 
    value: 'slide-right', 
    label: 'Slide Right',
    icon: Move,
    description: 'Slide from left',
    css: 'animate-in slide-in-from-left'
  },
  { 
    value: 'scale-up', 
    label: 'Scale Up',
    icon: ZoomIn,
    description: 'Scale from small',
    css: 'animate-in zoom-in'
  },
  { 
    value: 'bounce', 
    label: 'Bounce',
    icon: Waves,
    description: 'Bouncy entrance',
    css: 'animate-bounce'
  },
  { 
    value: 'pulse', 
    label: 'Pulse',
    icon: Zap,
    description: 'Pulsing effect',
    css: 'animate-pulse'
  }
];

// Hover animations
const hoverAnimations = [
  { value: 'none', label: 'None', css: '' },
  { value: 'scale', label: 'Scale', css: 'hover:scale-105' },
  { value: 'lift', label: 'Lift', css: 'hover:-translate-y-1 hover:shadow-lg' },
  { value: 'glow', label: 'Glow', css: 'hover:shadow-glow' },
  { value: 'rotate', label: 'Rotate', css: 'hover:rotate-3' },
  { value: 'tilt', label: 'Tilt', css: 'hover:rotate-1 hover:scale-105' }
];

// Timing functions
const easingFunctions = [
  { value: 'linear', label: 'Linear' },
  { value: 'ease', label: 'Ease' },
  { value: 'ease-in', label: 'Ease In' },
  { value: 'ease-out', label: 'Ease Out' },
  { value: 'ease-in-out', label: 'Ease In Out' },
  { value: 'bounce', label: 'Bounce' }
];

export default function AnimationSelector({ 
  value = {
    entrance: 'none',
    hover: 'none',
    duration: 300,
    delay: 0,
    easing: 'ease-out',
    infinite: false,
    enabled: false
  },
  onChange,
  label = "Animation Settings",
  showEntrance = true,
  showHover = true,
  className = ""
}) {
  const [activeTab, setActiveTab] = useState('entrance');
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);

  const handleChange = (key, newValue) => {
    if (onChange) {
      onChange({
        ...value,
        [key]: newValue
      });
    }
  };

  const getCurrentEntrance = () => {
    return animationPresets.find(preset => preset.value === value.entrance) || animationPresets[0];
  };

  const getCurrentHover = () => {
    return hoverAnimations.find(hover => hover.value === value.hover) || hoverAnimations[0];
  };

  const playPreviewAnimation = () => {
    setIsPreviewPlaying(true);
    setTimeout(() => setIsPreviewPlaying(false), value.duration + value.delay + 500);
  };

  const getPreviewClasses = () => {
    const entrance = getCurrentEntrance();
    const hover = getCurrentHover();
    
    let classes = 'transition-all duration-300 ';
    
    if (isPreviewPlaying && entrance.css) {
      classes += entrance.css + ' ';
    }
    
    if (hover.css) {
      classes += hover.css + ' ';
    }
    
    return classes.trim();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Play className="h-4 w-4" />
          {label}
        </Label>
        <Switch
          checked={value.enabled}
          onCheckedChange={(checked) => handleChange('enabled', checked)}
        />
      </div>

      {value.enabled && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            {showEntrance && <TabsTrigger value="entrance">Entrance</TabsTrigger>}
            {showHover && <TabsTrigger value="hover">Hover</TabsTrigger>}
            <TabsTrigger value="timing">Timing</TabsTrigger>
          </TabsList>

          {showEntrance && (
            <TabsContent value="entrance" className="space-y-3">
              <div className="space-y-2">
                <Label>Entrance Animation</Label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {animationPresets.map((preset) => {
                    const IconComponent = preset.icon;
                    return (
                      <Button
                        key={preset.value}
                        variant={value.entrance === preset.value ? "default" : "outline"}
                        size="sm"
                        className="h-16 flex flex-col items-center justify-center gap-1 p-2"
                        onClick={() => handleChange('entrance', preset.value)}
                      >
                        <IconComponent className="h-4 w-4" />
                        <span className="text-xs text-center">{preset.label}</span>
                      </Button>
                    );
                  })}
                </div>
                <div className="text-xs text-gray-500 text-center">
                  {getCurrentEntrance().description}
                </div>
              </div>
            </TabsContent>
          )}

          {showHover && (
            <TabsContent value="hover" className="space-y-3">
              <div className="space-y-2">
                <Label>Hover Animation</Label>
                <Select 
                  value={value.hover} 
                  onValueChange={(newValue) => handleChange('hover', newValue)}
                >
                  <SelectTrigger>
                    <SelectValue>
                      {getCurrentHover().label}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {hoverAnimations.map((hover) => (
                      <SelectItem key={hover.value} value={hover.value}>
                        {hover.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          )}

          <TabsContent value="timing" className="space-y-3">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Duration</Label>
                <div className="flex items-center gap-3">
                  <Slider
                    value={[value.duration]}
                    onValueChange={(values) => handleChange('duration', values[0])}
                    min={100}
                    max={2000}
                    step={50}
                    className="flex-1"
                  />
                  <span className="text-sm font-mono w-16">{value.duration}ms</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Delay</Label>
                <div className="flex items-center gap-3">
                  <Slider
                    value={[value.delay]}
                    onValueChange={(values) => handleChange('delay', values[0])}
                    min={0}
                    max={2000}
                    step={50}
                    className="flex-1"
                  />
                  <span className="text-sm font-mono w-16">{value.delay}ms</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Easing</Label>
                <Select 
                  value={value.easing} 
                  onValueChange={(newValue) => handleChange('easing', newValue)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {easingFunctions.map((easing) => (
                      <SelectItem key={easing.value} value={easing.value}>
                        {easing.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  id="infinite"
                  checked={value.infinite}
                  onCheckedChange={(checked) => handleChange('infinite', checked)}
                />
                <Label htmlFor="infinite" className="text-sm">Infinite Loop</Label>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Preview */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Preview</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={playPreviewAnimation}
            disabled={!value.enabled || value.entrance === 'none'}
          >
            <Play className="h-3 w-3 mr-1" />
            Play
          </Button>
        </div>
        
        <div className="flex justify-center p-8 bg-gray-50 rounded">
          <div 
            className={`w-16 h-16 bg-blue-500 rounded-lg cursor-pointer ${
              value.enabled ? getPreviewClasses() : ''
            }`}
            style={{
              animationDuration: `${value.duration}ms`,
              animationDelay: `${value.delay}ms`,
              animationTimingFunction: value.easing,
              animationIterationCount: value.infinite ? 'infinite' : '1'
            }}
            onMouseEnter={(e) => {
              if (value.enabled && value.hover !== 'none') {
                e.currentTarget.style.transform = 'scale(1.05)';
              }
            }}
            onMouseLeave={(e) => {
              if (value.enabled) {
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          />
        </div>
        
        <div className="text-center text-xs text-gray-500">
          {!value.enabled 
            ? 'Animation disabled'
            : `${getCurrentEntrance().label}${value.hover !== 'none' ? ` • ${getCurrentHover().label} on hover` : ''} • ${value.duration}ms`
          }
        </div>
      </div>

      {/* CSS Output */}
      {value.enabled && (value.entrance !== 'none' || value.hover !== 'none') && (
        <div className="p-3 bg-gray-50 rounded">
          <Label className="text-xs text-gray-600">CSS Classes</Label>
          <div className="mt-1 space-y-1">
            {value.entrance !== 'none' && (
              <code className="text-xs block p-2 bg-white rounded border font-mono">
                {getCurrentEntrance().css}
              </code>
            )}
            {value.hover !== 'none' && (
              <code className="text-xs block p-2 bg-white rounded border font-mono">
                {getCurrentHover().css}
              </code>
            )}
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Duration: {value.duration}ms • Delay: {value.delay}ms • Easing: {value.easing}
            {value.infinite && ' • Infinite'}
          </div>
        </div>
      )}
    </div>
  );
}