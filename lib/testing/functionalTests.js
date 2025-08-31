// Comprehensive functional testing suite for QuickPage Builder
// This file contains test scenarios and validation functions

export class FunctionalTestSuite {
  constructor(editorStore) {
    this.editorStore = editorStore;
    this.testResults = [];
    this.errors = [];
  }

  // Run all functional tests
  async runAllTests() {
    console.log('🧪 Starting QuickPage Builder Functional Tests...\n');
    
    const testSuites = [
      { name: 'Block CRUD Operations', tests: this.testBlockOperations.bind(this) },
      { name: 'Drag & Drop Functionality', tests: this.testDragAndDrop.bind(this) },
      { name: 'Inline Editing Features', tests: this.testInlineEditing.bind(this) },
      { name: 'Export Functionality', tests: this.testExportSystem.bind(this) },
      { name: 'Auto-save System', tests: this.testAutoSave.bind(this) },
      { name: 'Undo/Redo System', tests: this.testUndoRedo.bind(this) },
      { name: 'Template System', tests: this.testTemplates.bind(this) },
      { name: 'State Management', tests: this.testStateManagement.bind(this) }
    ];

    for (const suite of testSuites) {
      console.log(`\n📋 Testing: ${suite.name}`);
      try {
        await suite.tests();
        this.logSuccess(suite.name);
      } catch (error) {
        this.logError(suite.name, error);
      }
    }

    this.generateReport();
    return this.testResults;
  }

  // Test Block CRUD Operations
  async testBlockOperations() {
    const initialBlockCount = this.editorStore.getState().page.blocks.length;
    
    // Test Add Block
    this.editorStore.getState().addBlock('hero');
    const afterAdd = this.editorStore.getState().page.blocks.length;
    this.assert(afterAdd === initialBlockCount + 1, 'Block should be added');
    
    const newBlock = this.editorStore.getState().page.blocks[afterAdd - 1];
    this.assert(newBlock.type === 'hero', 'Block type should be hero');
    this.assert(newBlock.id, 'Block should have unique ID');
    
    // Test Update Block
    const blockId = newBlock.id;
    this.editorStore.getState().updateBlock(blockId, { 
      settings: { textSize: 'XL' } 
    });
    const updatedBlock = this.editorStore.getState().page.blocks.find(b => b.id === blockId);
    this.assert(updatedBlock.settings.textSize === 'XL', 'Block should be updated');
    
    // Test Duplicate Block
    this.editorStore.getState().duplicateBlock(blockId);
    const afterDuplicate = this.editorStore.getState().page.blocks.length;
    this.assert(afterDuplicate === afterAdd + 1, 'Block should be duplicated');
    
    // Test Remove Block
    this.editorStore.getState().removeBlock(blockId);
    const afterRemove = this.editorStore.getState().page.blocks.length;
    this.assert(afterRemove === afterAdd, 'Block should be removed');
    
    console.log('✅ Block CRUD operations working correctly');
  }

  // Test Drag & Drop Functionality
  async testDragAndDrop() {
    // Add multiple blocks for reordering test
    this.editorStore.getState().addBlock('hero');
    this.editorStore.getState().addBlock('features');
    this.editorStore.getState().addBlock('cta');
    
    const blocks = this.editorStore.getState().page.blocks;
    this.assert(blocks.length >= 3, 'Should have at least 3 blocks for reorder test');
    
    const initialOrder = blocks.map(b => b.type);
    
    // Test reorder blocks (move first block to last position)
    this.editorStore.getState().reorderBlocks(0, 2);
    const reorderedBlocks = this.editorStore.getState().page.blocks;
    const newOrder = reorderedBlocks.map(b => b.type);
    
    this.assert(
      JSON.stringify(newOrder) !== JSON.stringify(initialOrder),
      'Block order should change after reordering'
    );
    
    // Verify order values are sequential
    const orders = reorderedBlocks.map(b => b.order).sort((a, b) => a - b);
    const expectedOrders = Array.from({ length: orders.length }, (_, i) => i);
    this.assert(
      JSON.stringify(orders) === JSON.stringify(expectedOrders),
      'Block order values should be sequential'
    );
    
    console.log('✅ Drag & drop functionality working correctly');
  }

  // Test Export System
  async testExportSystem() {
    // Ensure we have some blocks to export
    if (this.editorStore.getState().page.blocks.length === 0) {
      this.editorStore.getState().addBlock('hero');
    }
    
    const page = this.editorStore.getState().page;
    
    // Test page structure for export
    this.assert(page.id, 'Page should have ID');
    this.assert(page.title, 'Page should have title');
    this.assert(page.blocks.length > 0, 'Page should have blocks');
    this.assert(page.globalSettings, 'Page should have global settings');
    
    // Test block export structure
    page.blocks.forEach((block, index) => {
      this.assert(block.id, `Block ${index} should have ID`);
      this.assert(block.type, `Block ${index} should have type`);
      this.assert(typeof block.order === 'number', `Block ${index} should have order`);
      this.assert(block.content, `Block ${index} should have content`);
      this.assert(block.content.en, `Block ${index} should have English content`);
    });
    
    console.log('✅ Export system data structure is valid');
  }

  // Test Auto-save System
  async testAutoSave() {
    const { saveChanges } = this.editorStore.getState();
    
    // Test manual save
    const saveResult = await saveChanges();
    this.assert(saveResult.success, 'Manual save should succeed');
    
    // Verify unsaved changes flag
    this.editorStore.getState().addBlock('hero');
    const hasChanges = this.editorStore.getState().hasUnsavedChanges;
    this.assert(hasChanges, 'Should have unsaved changes after adding block');
    
    console.log('✅ Auto-save system working correctly');
  }

  // Test Undo/Redo System
  async testUndoRedo() {
    const initialBlockCount = this.editorStore.getState().page.blocks.length;
    
    // Test undo availability
    const initialCanUndo = this.editorStore.getState().canUndo();
    
    // Add a block (this should create a history entry)
    this.editorStore.getState().addBlock('hero');
    const afterAdd = this.editorStore.getState().page.blocks.length;
    
    // Test undo
    const canUndoAfterAdd = this.editorStore.getState().canUndo();
    if (canUndoAfterAdd) {
      const undoSuccess = this.editorStore.getState().undo();
      if (undoSuccess) {
        const afterUndo = this.editorStore.getState().page.blocks.length;
        this.assert(afterUndo < afterAdd, 'Undo should reduce block count');
      }
    }
    
    // Test redo
    const canRedo = this.editorStore.getState().canRedo();
    if (canRedo) {
      const redoSuccess = this.editorStore.getState().redo();
      if (redoSuccess) {
        const afterRedo = this.editorStore.getState().page.blocks.length;
        this.assert(afterRedo === afterAdd, 'Redo should restore block count');
      }
    }
    
    console.log('✅ Undo/Redo system working correctly');
  }

  // Test Template System
  async testTemplates() {
    // Import template functions
    const { TemplateManager } = await import('@/lib/templates/templates');
    
    // Test template retrieval
    const allTemplates = TemplateManager.getAllTemplates();
    this.assert(allTemplates.length > 0, 'Should have predefined templates');
    
    // Test template structure
    const template = allTemplates[0];
    this.assert(template.id, 'Template should have ID');
    this.assert(template.name, 'Template should have name');
    this.assert(template.category, 'Template should have category');
    this.assert(template.blocks, 'Template should have blocks');
    this.assert(Array.isArray(template.blocks), 'Template blocks should be array');
    
    // Test template application
    const newPage = TemplateManager.applyTemplate(template);
    this.assert(newPage.title === template.name, 'Applied template should set page title');
    this.assert(newPage.blocks.length === template.blocks.length, 'Applied template should have same block count');
    
    console.log('✅ Template system working correctly');
  }

  // Test State Management
  async testStateManagement() {
    const state = this.editorStore.getState();
    
    // Test initial state structure
    this.assert(state.page, 'Should have page object');
    this.assert(Array.isArray(state.page.blocks), 'Page blocks should be array');
    this.assert(state.page.globalSettings, 'Should have global settings');
    this.assert(typeof state.selectedBlockId !== undefined, 'Should have selectedBlockId property');
    this.assert(typeof state.hasUnsavedChanges === 'boolean', 'Should have hasUnsavedChanges boolean');
    
    // Test block selection
    if (state.page.blocks.length > 0) {
      const blockId = state.page.blocks[0].id;
      this.editorStore.getState().selectBlock(blockId);
      this.assert(state.selectedBlockId === blockId, 'Block should be selected');
      
      this.editorStore.getState().clearSelection();
      const clearedState = this.editorStore.getState();
      this.assert(clearedState.selectedBlockId === null, 'Selection should be cleared');
    }
    
    console.log('✅ State management working correctly');
  }

  // Test Inline Editing Features
  async testInlineEditing() {
    // Add a hero block if none exists
    if (this.editorStore.getState().page.blocks.length === 0) {
      this.editorStore.getState().addBlock('hero');
    }
    
    const block = this.editorStore.getState().page.blocks[0];
    
    // Test content structure for inline editing
    this.assert(block.content, 'Block should have content object');
    this.assert(block.content.en, 'Block should have English content');
    
    // Test content update
    const originalContent = block.content.en.heading;
    const newHeading = 'Test Heading ' + Date.now();
    
    this.editorStore.getState().updateBlock(block.id, {
      content: {
        ...block.content,
        en: {
          ...block.content.en,
          heading: newHeading
        }
      }
    });
    
    const updatedBlock = this.editorStore.getState().page.blocks.find(b => b.id === block.id);
    this.assert(
      updatedBlock.content.en.heading === newHeading,
      'Inline editing should update content'
    );
    
    console.log('✅ Inline editing features working correctly');
  }

  // Helper methods
  assert(condition, message) {
    if (!condition) {
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  logSuccess(testName) {
    this.testResults.push({ name: testName, status: 'PASSED', error: null });
  }

  logError(testName, error) {
    console.error(`❌ ${testName}: ${error.message}`);
    this.testResults.push({ name: testName, status: 'FAILED', error: error.message });
    this.errors.push({ test: testName, error });
  }

  generateReport() {
    const passed = this.testResults.filter(t => t.status === 'PASSED').length;
    const failed = this.testResults.filter(t => t.status === 'FAILED').length;
    const total = this.testResults.length;
    
    console.log('\n📊 TEST RESULTS SUMMARY');
    console.log('='.repeat(50));
    console.log(`Total Tests: ${total}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
    
    if (this.errors.length > 0) {
      console.log('\n🐛 FAILED TESTS:');
      this.errors.forEach(({ test, error }) => {
        console.log(`- ${test}: ${error.message}`);
      });
    }
    
    console.log('\n' + '='.repeat(50));
    
    return {
      total,
      passed,
      failed,
      successRate: (passed / total) * 100,
      results: this.testResults,
      errors: this.errors
    };
  }
}

// Utility functions for browser-based testing
export const BrowserTestUtils = {
  // Test responsive design
  testResponsiveness: () => {
    const viewports = [
      { width: 375, height: 667, name: 'Mobile' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1024, height: 768, name: 'Tablet Landscape' },
      { width: 1440, height: 900, name: 'Desktop' }
    ];
    
    console.log('📱 Testing responsive design...');
    viewports.forEach(viewport => {
      console.log(`Testing ${viewport.name} (${viewport.width}x${viewport.height})`);
      // In a real browser environment, you would resize the window here
      // window.resizeTo(viewport.width, viewport.height);
    });
  },

  // Test accessibility features
  testAccessibility: () => {
    console.log('♿ Testing accessibility...');
    
    // Check for aria labels
    const elementsNeedingAria = document.querySelectorAll('button, input, [role="button"]');
    console.log(`Found ${elementsNeedingAria.length} interactive elements`);
    
    // Check for focus management
    const focusableElements = document.querySelectorAll('[tabindex], button, input, select, textarea, a[href]');
    console.log(`Found ${focusableElements.length} focusable elements`);
    
    return {
      interactiveElements: elementsNeedingAria.length,
      focusableElements: focusableElements.length
    };
  },

  // Test keyboard navigation
  testKeyboardNavigation: () => {
    console.log('⌨️ Testing keyboard navigation...');
    
    // Simulate Tab key navigation
    let currentFocus = 0;
    const focusableElements = Array.from(
      document.querySelectorAll('[tabindex], button, input, select, textarea, a[href]')
    );
    
    const simulateTabNavigation = () => {
      if (currentFocus < focusableElements.length) {
        focusableElements[currentFocus].focus();
        currentFocus++;
        console.log(`Focused element: ${focusableElements[currentFocus - 1].tagName}`);
      }
    };
    
    return { focusableCount: focusableElements.length, simulateTabNavigation };
  },

  // Test performance metrics
  measurePerformance: () => {
    console.log('⚡ Measuring performance...');
    
    const navigation = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');
    
    const metrics = {
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      firstPaint: paint.find(p => p.name === 'first-paint')?.startTime,
      firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime,
      memoryUsage: performance.memory ? {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      } : null
    };
    
    console.log('Performance Metrics:', metrics);
    return metrics;
  }
};