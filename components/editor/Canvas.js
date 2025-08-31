'use client';

import { useState, useCallback } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Plus, 
  MousePointer2, 
  Smartphone, 
  Monitor,
  Eye,
  EyeOff,
  Download,
  Undo,
  Redo
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import useEditorStore from '@/lib/store/editorStore';
import { blockRegistry } from '@/lib/blocks/registry';
import BlockRenderer from '@/components/editor/BlockRenderer';
import SortableBlock from '@/components/editor/SortableBlock';
import ExportModal from '@/components/modals/ExportModal';

export default function Canvas({ viewMode }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  
  const { 
    page, 
    selectedBlockId,
    isPreviewMode,
    addBlock,
    selectBlock,
    setPreviewMode,
    reorderBlocks,
    undo,
    redo,
    canUndo,
    canRedo
  } = useEditorStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (active.id !== over?.id) {
      const oldIndex = page.blocks.findIndex(block => block.id === active.id);
      const newIndex = page.blocks.findIndex(block => block.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        reorderBlocks(oldIndex, newIndex);
      }
    }
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const blockType = e.dataTransfer.getData('text/plain');
    if (blockType && blockRegistry[blockType]) {
      addBlock(blockType);
    }
  }, [addBlock]);

  const handleCanvasClick = () => {
    if (selectedBlockId) {
      selectBlock(null);
    }
  };

  const handleAddFirstBlock = () => {
    addBlock('hero'); // Add a hero block as the first block
  };

  // Calculate canvas width based on view mode
  const canvasWidth = viewMode === 'mobile' ? 'max-w-sm' : 'max-w-4xl';
  
  // Get the active block for drag overlay
  const activeBlock = page.blocks.find(block => block.id === activeId);

  return (
    <div className="h-full bg-gray-100 relative">
      {/* Canvas header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {viewMode === 'mobile' ? (
              <>
                <Smartphone className="h-4 w-4" />
                Mobile View
              </>
            ) : (
              <>
                <Monitor className="h-4 w-4" />
                Desktop View
              </>
            )}
          </div>
          
          {isPreviewMode && (
            <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
              <Eye className="h-4 w-4" />
              Preview Mode
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Undo/Redo buttons */}
          <div className="flex items-center border border-gray-200 rounded-md">
            <Button
              variant="ghost"
              size="sm"
              onClick={undo}
              disabled={!canUndo()}
              className="rounded-r-none border-r px-2"
              title="Undo (Ctrl+Z)"
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={redo}
              disabled={!canRedo()}
              className="rounded-l-none px-2"
              title="Redo (Ctrl+Y)"
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowExportModal(true)}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewMode(!isPreviewMode)}
          >
            {isPreviewMode ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Edit Mode
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Canvas area */}
      <ScrollArea className="h-full">
        <div className="min-h-full p-6">
          <div 
            className={`mx-auto bg-white min-h-screen shadow-lg transition-all duration-200 ${canvasWidth}`}
            onClick={handleCanvasClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {page.blocks.length === 0 ? (
              // Empty state
              <div className="h-screen flex flex-col items-center justify-center p-8 text-center">
                <div className={`max-w-md ${isDragOver ? 'animate-pulse' : ''}`}>
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    {isDragOver ? (
                      <Plus className="h-8 w-8 text-blue-600" />
                    ) : (
                      <MousePointer2 className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {isDragOver ? 'Drop to add block' : 'Start building your page'}
                  </h3>
                  
                  <p className="text-gray-600 mb-6">
                    {isDragOver 
                      ? 'Release to add the block to your page'
                      : 'Drag blocks from the sidebar or click the button below to get started.'
                    }
                  </p>
                  
                  {!isDragOver && (
                    <Button onClick={handleAddFirstBlock} size="lg">
                      <Plus className="h-5 w-5 mr-2" />
                      Add Your First Block
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              // Render blocks with drag & drop
              <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext 
                  items={page.blocks.map(block => block.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-0">
                    {[...page.blocks]
                      .sort((a, b) => a.order - b.order)
                      .map((block) => (
                        <SortableBlock
                          key={block.id}
                          block={block}
                          isSelected={selectedBlockId === block.id}
                          isPreviewMode={isPreviewMode}
                          onSelect={() => selectBlock(block.id)}
                        />
                      ))}
                    
                    {/* Drop zone at bottom */}
                    {isDragOver && (
                      <div className="h-20 border-2 border-dashed border-blue-300 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Plus className="h-6 w-6 text-blue-600 mr-2" />
                        <span className="text-blue-600 font-medium">
                          Drop here to add block
                        </span>
                      </div>
                    )}
                  </div>
                </SortableContext>

                <DragOverlay>
                  {activeBlock && (
                    <div className="opacity-75 transform rotate-2">
                      <BlockRenderer
                        block={activeBlock}
                        isSelected={false}
                        isPreviewMode={false}
                        onSelect={() => {}}
                        isDragging={true}
                      />
                    </div>
                  )}
                </DragOverlay>
              </DndContext>
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Export Modal */}
      <ExportModal 
        isOpen={showExportModal} 
        onClose={() => setShowExportModal(false)} 
      />
    </div>
  );
}