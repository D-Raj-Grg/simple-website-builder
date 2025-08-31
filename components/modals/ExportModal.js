'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Download, 
  Code, 
  FileText, 
  Smartphone, 
  Monitor, 
  Copy, 
  Check,
  ExternalLink,
  Settings,
  Zap
} from "lucide-react";
import useEditorStore from '@/lib/store/editorStore';
import { generateJSXExport } from '@/lib/exporters/jsxGenerator';

export default function ExportModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('html');
  const [exportOptions, setExportOptions] = useState({
    componentName: 'HomePage',
    framework: 'nextjs',
    typescript: false,
    includeStyles: true,
    minifyCode: false,
    responsive: true,
    includeComments: true
  });
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [exportResult, setExportResult] = useState(null);

  const { page } = useEditorStore();

  const handleExportHTML = () => {
    setIsExporting(true);
    
    // Generate HTML content
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${page.title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        /* Custom styles */
        :root {
            --primary-color: ${page.globalSettings.primaryColor || '#3B82F6'};
        }
        .btn-primary {
            background-color: var(--primary-color);
        }
    </style>
</head>
<body class="bg-white">
    ${generateStaticHTML()}
</body>
</html>`;

    // Download file
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${page.title.toLowerCase().replace(/\s+/g, '-')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setIsExporting(false);
  };

  const handleExportJSX = () => {
    setIsExporting(true);
    
    try {
      const result = generateJSXExport(page, exportOptions);
      setExportResult(result);
      
      // Create zip file with component and styles
      const componentContent = result.component;
      const stylesContent = result.styles;
      
      // For now, download as separate files
      downloadFile(
        componentContent, 
        `${exportOptions.componentName}.${exportOptions.typescript ? 'tsx' : 'jsx'}`,
        'text/javascript'
      );
      
      if (exportOptions.includeStyles && stylesContent) {
        downloadFile(stylesContent, 'globals.css', 'text/css');
      }
      
    } catch (error) {
      console.error('Export failed:', error);
    }
    
    setIsExporting(false);
  };

  const handleCopyCode = async () => {
    if (!exportResult) return;
    
    try {
      await navigator.clipboard.writeText(exportResult.component);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateStaticHTML = () => {
    return page.blocks
      .sort((a, b) => a.order - b.order)
      .map(block => {
        const content = block.content[page.defaultLanguage] || block.content['en'] || {};
        
        switch (block.type) {
          case 'hero':
            return `
    <section class="relative bg-gray-900 text-white py-20 px-6">
        <div class="max-w-7xl mx-auto text-center">
            <h1 class="text-5xl font-bold mb-6">${content.heading || 'Welcome'}</h1>
            <p class="text-xl text-gray-300 mb-8">${content.subheading || 'Build something amazing'}</p>
            ${content.ctaButton?.text ? `<button class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg">${content.ctaButton.text}</button>` : ''}
        </div>
    </section>`;
          
          case 'features':
            return `
    <section class="py-16 px-6 bg-white">
        <div class="max-w-7xl mx-auto">
            <h2 class="text-3xl font-bold text-center mb-12">${content.heading || 'Features'}</h2>
            <div class="grid md:grid-cols-3 gap-8">
                ${(content.features || []).map(feature => `
                <div class="text-center">
                    <h3 class="text-xl font-semibold mb-4">${feature.title || 'Feature'}</h3>
                    <p class="text-gray-600">${feature.description || 'Description'}</p>
                </div>`).join('')}
            </div>
        </div>
    </section>`;
          
          case 'cta':
            return `
    <section class="bg-blue-600 py-16 px-6">
        <div class="max-w-4xl mx-auto text-center">
            <h2 class="text-3xl font-bold text-white mb-4">${content.heading || 'Ready to start?'}</h2>
            <p class="text-xl text-blue-100 mb-8">${content.description || 'Join us today'}</p>
            <button class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold">${content.buttonText || 'Get Started'}</button>
        </div>
    </section>`;
          
          default:
            return `<!-- ${block.type} block -->`;
        }
      })
      .join('\n');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Your Page
          </DialogTitle>
          <DialogDescription>
            Choose how you&apos;d like to export your page. Select a format and customize the options.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="html" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              HTML
            </TabsTrigger>
            <TabsTrigger value="jsx" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              React/Next.js
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Share
            </TabsTrigger>
          </TabsList>

          {/* HTML Export */}
          <TabsContent value="html" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Static HTML Export
                </CardTitle>
                <CardDescription>
                  Export your page as a standalone HTML file with embedded CSS.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      Desktop Optimized
                    </Label>
                    <p className="text-sm text-gray-500">Includes responsive design</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      Mobile Friendly
                    </Label>
                    <p className="text-sm text-gray-500">Works on all devices</p>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    onClick={handleExportHTML}
                    disabled={isExporting}
                    className="w-full"
                    size="lg"
                  >
                    {isExporting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating HTML...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Download HTML File
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded">
                  <strong>What&apos;s included:</strong> Complete HTML file with Tailwind CSS, 
                  responsive layout, and all your page content.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* JSX Export */}
          <TabsContent value="jsx" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  React Component Export
                </CardTitle>
                <CardDescription>
                  Export your page as React/Next.js components for development.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Export Options */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="component-name">Component Name</Label>
                    <Input
                      id="component-name"
                      value={exportOptions.componentName}
                      onChange={(e) => setExportOptions(prev => ({
                        ...prev,
                        componentName: e.target.value
                      }))}
                      placeholder="HomePage"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Framework</Label>
                    <Select
                      value={exportOptions.framework}
                      onValueChange={(value) => setExportOptions(prev => ({
                        ...prev,
                        framework: value
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nextjs">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">Next.js</Badge>
                            <span>Recommended</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="react">React Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>TypeScript</Label>
                      <p className="text-sm text-gray-500">Export as .tsx files</p>
                    </div>
                    <Switch
                      checked={exportOptions.typescript}
                      onCheckedChange={(checked) => setExportOptions(prev => ({
                        ...prev,
                        typescript: checked
                      }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Include Styles</Label>
                      <p className="text-sm text-gray-500">Generate CSS file</p>
                    </div>
                    <Switch
                      checked={exportOptions.includeStyles}
                      onCheckedChange={(checked) => setExportOptions(prev => ({
                        ...prev,
                        includeStyles: checked
                      }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Include Comments</Label>
                      <p className="text-sm text-gray-500">Add helpful code comments</p>
                    </div>
                    <Switch
                      checked={exportOptions.includeComments}
                      onCheckedChange={(checked) => setExportOptions(prev => ({
                        ...prev,
                        includeComments: checked
                      }))}
                    />
                  </div>
                </div>

                <Separator />
                
                <div className="space-y-3">
                  <Button 
                    onClick={handleExportJSX}
                    disabled={isExporting}
                    className="w-full"
                    size="lg"
                  >
                    {isExporting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating Components...
                      </>
                    ) : (
                      <>
                        <Code className="h-4 w-4 mr-2" />
                        Export Components
                      </>
                    )}
                  </Button>
                  
                  {exportResult && (
                    <Button 
                      onClick={handleCopyCode}
                      variant="outline"
                      className="w-full"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 mr-2 text-green-600" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Component Code
                        </>
                      )}
                    </Button>
                  )}
                </div>

                <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded border-l-4 border-blue-200">
                  <strong>Dependencies:</strong> This export requires Tailwind CSS and 
                  {exportOptions.framework === 'nextjs' ? ' Next.js' : ' React'}. 
                  Install with: <code className="bg-white px-1 rounded">npm install tailwindcss{exportOptions.framework === 'nextjs' ? ' next' : ' react react-dom'}</code>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Share/Preview */}
          <TabsContent value="preview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ExternalLink className="h-5 w-5" />
                  Share Your Page
                </CardTitle>
                <CardDescription>
                  Share a live preview link or embed your page.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label>Preview URL</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={typeof window !== 'undefined' ? `${window.location.origin}/preview` : '/preview'}
                      readOnly
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          navigator.clipboard.writeText(`${window.location.origin}/preview`);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }
                      }}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <Button 
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.open('/preview', '_blank');
                    }
                  }}
                  variant="outline"
                  className="w-full"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Preview in New Tab
                </Button>
                
                <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded">
                  <strong>Note:</strong> The preview link shows your current page state. 
                  Save your changes to share the latest version.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}