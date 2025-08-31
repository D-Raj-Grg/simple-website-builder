'use client';

import { useState, useEffect, Suspense, lazy } from 'react';
import useEditorStore from '@/lib/store/editorStore';
import { useAutoSave, AutoSaveIndicator } from '@/lib/hooks/useAutoSave';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { 
  Menu, 
  Eye, 
  Save, 
  Download, 
  Smartphone, 
  Monitor,
  Languages,
  Settings,
  Layout,
  Bug,
  Loader2
} from "lucide-react";

// Lazy load components for better performance
const BlockLibrary = lazy(() => import('@/components/editor/BlockLibrary'));
const Canvas = lazy(() => import('@/components/editor/Canvas'));
const SettingsPanel = lazy(() => import('@/components/editor/SettingsPanel'));
const KeyboardShortcuts = lazy(() => import('@/components/editor/KeyboardShortcuts'));
const TemplateGallery = lazy(() => import('@/components/templates/TemplateGallery'));
const TestRunner = lazy(() => import('@/components/testing/TestRunner'));

export default function EditorPage() {
  const [viewMode, setViewMode] = useState('desktop'); // desktop, mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsPanelOpen, setSettingsPanelOpen] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [testRunnerOpen, setTestRunnerOpen] = useState(false);
  
  const { 
    page,
    selectedBlockId,
    hasUnsavedChanges,
    isPreviewMode,
    setPreviewMode,
    saveChanges,
    loadPage
  } = useEditorStore();

  // Auto-save functionality - temporarily disabled to prevent loops
  const autoSave = {
    isSaving: false,
    lastSaved: null,
    saveError: null
  };

  // Load saved page on mount
  useEffect(() => {
    loadPage();
  }, [loadPage]);


  const handleSave = async () => {
    const result = await saveChanges();
    if (result.success) {
      toast.success('Page saved successfully!');
    } else {
      toast.error('Failed to save page');
    }
  };

  const handlePreview = () => {
    setPreviewMode(!isPreviewMode);
    if (!isPreviewMode) {
      toast.info('Preview mode enabled');
    }
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    toast.info('Export functionality coming soon!');
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Toolbar */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
            {/* Mobile menu trigger */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="flex-shrink-0">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>Block Library</SheetTitle>
                  <SheetDescription>
                    Choose blocks to add to your page
                  </SheetDescription>
                </SheetHeader>
                <Suspense fallback={
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="ml-2">Loading blocks...</span>
                  </div>
                }>
                  <BlockLibrary onBlockSelect={() => setSidebarOpen(false)} />
                </Suspense>
              </SheetContent>
            </Sheet>

            <h1 className="text-sm md:text-lg font-semibold text-gray-900 truncate">
              {page.title}
            </h1>
            
            <div className="hidden md:flex items-center gap-3">
              {hasUnsavedChanges && !autoSave.isSaving && (
                <span className="text-xs text-amber-600 font-medium">
                  Unsaved changes
                </span>
              )}
              
              <AutoSaveIndicator 
                isSaving={autoSave.isSaving}
                lastSaved={autoSave.lastSaved}
                saveError={autoSave.saveError}
                className="text-xs"
              />
            </div>
          </div>

          <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
            {/* View mode toggles - Hidden on mobile */}
            <div className="hidden md:flex items-center border border-gray-200 rounded-md overflow-hidden">
              <Button
                variant={viewMode === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('desktop')}
                className="rounded-r-none border-r transition-all duration-200 hover:scale-105"
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('mobile')}
                className="rounded-l-none"
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6 hidden md:block" />

            {/* Essential buttons - always visible */}
            <Button
              variant={isPreviewMode ? 'default' : 'outline'}
              size="sm"
              onClick={handlePreview}
              className="hidden sm:flex"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>

            {/* Mobile-only preview button */}
            <Button
              variant={isPreviewMode ? 'default' : 'ghost'}
              size="icon"
              onClick={handlePreview}
              className="sm:hidden"
            >
              <Eye className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              disabled={!hasUnsavedChanges}
              className="hidden sm:flex"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>

            {/* Mobile-only save button */}
            <Button
              variant="outline"
              size="icon"
              onClick={handleSave}
              disabled={!hasUnsavedChanges}
              className="sm:hidden"
            >
              <Save className="h-4 w-4" />
            </Button>

            {/* Secondary buttons - hidden on mobile */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTemplatesOpen(true)}
              className="hidden lg:flex"
            >
              <Layout className="h-4 w-4 mr-2" />
              Templates
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="hidden lg:flex"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>

            {/* Test runner (development only) - hidden on mobile */}
            {process.env.NODE_ENV === 'development' && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setTestRunnerOpen(true)}
                title="Run Tests"
                className="hidden md:flex"
              >
                <Bug className="h-4 w-4" />
              </Button>
            )}

            {/* Settings panel trigger */}
            <Sheet open={settingsPanelOpen} onOpenChange={setSettingsPanelOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>Settings</SheetTitle>
                  <SheetDescription>
                    Customize your page and block settings
                  </SheetDescription>
                </SheetHeader>
                <Suspense fallback={
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="ml-2">Loading settings...</span>
                  </div>
                }>
                  <SettingsPanel />
                </Suspense>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main editor area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Hidden on mobile, shown in sheet */}
        <aside className="hidden lg:block w-80 bg-white border-r border-gray-200 h-full">
          <Suspense fallback={
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="ml-2">Loading blocks...</span>
            </div>
          }>
            <BlockLibrary />
          </Suspense>
        </aside>

        {/* Canvas area */}
        <main className="flex-1 overflow-hidden">
          <Suspense fallback={
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading canvas...</span>
            </div>
          }>
            <Canvas viewMode={viewMode} />
          </Suspense>
        </main>

        {/* Settings panel - Hidden, shown in sheet */}
        {selectedBlockId && (
          <aside className="hidden xl:block w-80 bg-white border-l border-gray-200">
            <Suspense fallback={
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="ml-2">Loading settings...</span>
              </div>
            }>
              <SettingsPanel />
            </Suspense>
          </aside>
        )}
      </div>

      {/* Keyboard shortcuts handler */}
      <Suspense fallback={null}>
        <KeyboardShortcuts />
      </Suspense>

      {/* Template gallery modal */}
      <Suspense fallback={null}>
        <TemplateGallery 
          isOpen={templatesOpen}
          onClose={() => setTemplatesOpen(false)}
        />
      </Suspense>

      {/* Test runner modal (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <Suspense fallback={null}>
          <TestRunner 
            isOpen={testRunnerOpen}
            onClose={() => setTestRunnerOpen(false)}
          />
        </Suspense>
      )}
    </div>
  );
}