'use client';

import { useState, useEffect, Suspense, lazy } from 'react';
import useEditorStore from '@/lib/store/editorStore';
import { useAutoSave, AutoSaveIndicator } from '@/lib/hooks/useAutoSave';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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

  // Auto-save functionality
  const autoSave = useAutoSave(
    page,
    async (pageData) => {
      return await saveChanges();
    },
    {
      delay: 30000, // 30 seconds
      enabled: hasUnsavedChanges, // Only auto-save if there are changes
      showToast: true
    }
  );

  // Load saved page on mount
  useEffect(() => {
    loadPage();
  }, [loadPage]);

  // Auto-save functionality
  useEffect(() => {
    if (!hasUnsavedChanges) return;
    
    const autoSaveInterval = setInterval(async () => {
      if (hasUnsavedChanges) {
        const result = await saveChanges();
        if (result.success) {
          toast.success('Auto-saved', { duration: 1000 });
        }
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [hasUnsavedChanges, saveChanges]);

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
          <div className="flex items-center gap-4">
            {/* Mobile menu trigger */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
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

            <h1 className="text-lg font-semibold text-gray-900">
              {page.title}
            </h1>
            
            <div className="flex items-center gap-3">
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

          <div className="flex items-center gap-2">
            {/* View mode toggles */}
            <div className="hidden md:flex items-center border border-gray-200 rounded-md">
              <Button
                variant={viewMode === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('desktop')}
                className="rounded-r-none border-r"
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

            <Separator orientation="vertical" className="h-6" />

            {/* Action buttons */}
            <Button
              variant={isPreviewMode ? 'default' : 'outline'}
              size="sm"
              onClick={handlePreview}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              disabled={!hasUnsavedChanges}
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setTemplatesOpen(true)}
            >
              <Layout className="h-4 w-4 mr-2" />
              Templates
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>

            {/* Test runner (development only) */}
            {process.env.NODE_ENV === 'development' && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setTestRunnerOpen(true)}
                title="Run Tests"
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
        <aside className="hidden lg:block w-80 bg-white border-r border-gray-200">
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