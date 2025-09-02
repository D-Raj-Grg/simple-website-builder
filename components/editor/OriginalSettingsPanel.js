'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Settings, 
  Type, 
  Palette, 
  Layout,
  Languages,
  Globe
} from "lucide-react";
import useEditorStore from '@/lib/store/editorStore';
import { blockRegistry } from '@/lib/blocks/registry';
import ColorPicker from './ColorPicker';

export default function SettingsPanel() {
  const { 
    page,
    selectedBlockId, 
    currentLanguage,
    updateBlock,
    updatePageSettings,
    setLanguage
  } = useEditorStore();

  const selectedBlock = page.blocks.find(block => block.id === selectedBlockId);

  const handleBlockSettingChange = (key, value) => {
    if (!selectedBlock) return;
    
    updateBlock(selectedBlock.id, {
      settings: {
        ...selectedBlock.settings,
        [key]: value
      }
    });
  };

  const handleBlockContentChange = (key, value) => {
    if (!selectedBlock) return;
    
    updateBlock(selectedBlock.id, {
      content: {
        ...selectedBlock.content,
        [currentLanguage]: {
          ...selectedBlock.content[currentLanguage],
          [key]: value
        }
      }
    });
  };

  const handlePageSettingChange = (key, value) => {
    updatePageSettings({ [key]: value });
  };

  if (!selectedBlock) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Page Settings
          </h2>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            {/* Page title */}
            <div className="space-y-2">
              <Label htmlFor="page-title">Page Title</Label>
              <Input
                id="page-title"
                value={page.title}
                onChange={(e) => updatePageSettings({ title: e.target.value })}
                placeholder="Enter page title"
              />
            </div>

            {/* Global settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Global Styling
                </CardTitle>
                <CardDescription>
                  These settings apply to the entire page
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ColorPicker
                  label="Primary Color"
                  value={page.globalSettings.primaryColor}
                  onChange={(color) => handlePageSettingChange('primaryColor', color)}
                  showGradients={true}
                />

                <div className="space-y-2">
                  <Label>Font Family</Label>
                  <Select 
                    value={page.globalSettings.font} 
                    onValueChange={(value) => handlePageSettingChange('font', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sans">Sans Serif</SelectItem>
                      <SelectItem value="serif">Serif</SelectItem>
                      <SelectItem value="mono">Monospace</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Spacing</Label>
                  <Select 
                    value={page.globalSettings.spacing} 
                    onValueChange={(value) => handlePageSettingChange('spacing', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="comfortable">Comfortable</SelectItem>
                      <SelectItem value="spacious">Spacious</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Language settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Languages className="h-4 w-4" />
                  Languages
                </CardTitle>
                <CardDescription>
                  Manage multilingual content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Language</Label>
                  <Select value={currentLanguage} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {page.languages.map(lang => (
                        <SelectItem key={lang} value={lang}>
                          {lang.toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button variant="outline" size="sm" className="w-full">
                  <Globe className="h-4 w-4 mr-2" />
                  Add Language
                </Button>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    );
  }

  const blockDef = blockRegistry[selectedBlock.type];
  const blockContent = selectedBlock.content[currentLanguage] || selectedBlock.content['en'] || {};

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Settings className="h-5 w-5" />
          {blockDef?.name || selectedBlock.type} Settings
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Customize this block&apos;s appearance and content
        </p>
      </div>

      <Tabs defaultValue="content" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 mx-4 mt-4">
          <TabsTrigger value="content" className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="style" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Style
          </TabsTrigger>
          <TabsTrigger value="layout" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Layout
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="content" className="p-4 space-y-4 mt-0">
            {/* Dynamic content fields based on block type */}
            {selectedBlock.type === 'hero' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="heading">Heading</Label>
                  <Input
                    id="heading"
                    value={blockContent.heading || ''}
                    onChange={(e) => handleBlockContentChange('heading', e.target.value)}
                    placeholder="Enter heading"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subheading">Subheading</Label>
                  <Textarea
                    id="subheading"
                    value={blockContent.subheading || ''}
                    onChange={(e) => handleBlockContentChange('subheading', e.target.value)}
                    placeholder="Enter subheading"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cta-text">Button Text</Label>
                  <Input
                    id="cta-text"
                    value={blockContent.ctaButton?.text || ''}
                    onChange={(e) => handleBlockContentChange('ctaButton', {
                      ...blockContent.ctaButton,
                      text: e.target.value
                    })}
                    placeholder="Enter button text"
                  />
                </div>
              </>
            )}

            {/* Add more block-specific content fields as needed */}
          </TabsContent>

          <TabsContent value="style" className="p-4 space-y-4 mt-0">
            {/* Dynamic style settings based on block type */}
            {selectedBlock.type === 'hero' && (
              <>
                <div className="space-y-2">
                  <Label>Text Size</Label>
                  <Select
                    value={selectedBlock.settings.textSize || 'L'}
                    onValueChange={(value) => handleBlockSettingChange('textSize', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="S">Small</SelectItem>
                      <SelectItem value="M">Medium</SelectItem>
                      <SelectItem value="L">Large</SelectItem>
                      <SelectItem value="XL">Extra Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Text Alignment</Label>
                  <Select
                    value={selectedBlock.settings.alignment || 'center'}
                    onValueChange={(value) => handleBlockSettingChange('alignment', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="layout" className="p-4 space-y-4 mt-0">
            {/* Dynamic layout settings based on block type */}
            {selectedBlock.type === 'hero' && (
              <>
                <div className="space-y-2">
                  <Label>Image Position</Label>
                  <Select
                    value={selectedBlock.settings.imagePosition || 'center'}
                    onValueChange={(value) => handleBlockSettingChange('imagePosition', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}