'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Bug,
  Smartphone,
  Monitor,
  Globe,
  Zap,
  Shield
} from "lucide-react";
import useEditorStore from '@/lib/store/editorStore';
import { FunctionalTestSuite, BrowserTestUtils } from '@/lib/testing/functionalTests';

export default function TestRunner({ isOpen, onClose }) {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [currentTest, setCurrentTest] = useState(null);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);
  const [accessibilityResults, setAccessibilityResults] = useState(null);

  const editorStore = useEditorStore();

  const runFunctionalTests = async () => {
    setIsRunning(true);
    setCurrentTest('Functional Tests');
    setTestResults(null);

    try {
      const testSuite = new FunctionalTestSuite(editorStore);
      const results = await testSuite.runAllTests();
      setTestResults(results);
    } catch (error) {
      console.error('Test execution failed:', error);
      setTestResults({
        total: 0,
        passed: 0,
        failed: 1,
        successRate: 0,
        errors: [{ test: 'Test Execution', error }]
      });
    }

    setCurrentTest(null);
    setIsRunning(false);
  };

  const runPerformanceTests = () => {
    setCurrentTest('Performance Tests');
    const metrics = BrowserTestUtils.measurePerformance();
    setPerformanceMetrics(metrics);
    setCurrentTest(null);
  };

  const runAccessibilityTests = () => {
    setCurrentTest('Accessibility Tests');
    const results = BrowserTestUtils.testAccessibility();
    setAccessibilityResults(results);
    setCurrentTest(null);
  };

  const runAllTests = async () => {
    await runFunctionalTests();
    runPerformanceTests();
    runAccessibilityTests();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PASSED':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'FAILED':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getPerformanceScore = (metrics) => {
    if (!metrics) return null;
    
    // Simple scoring based on common web performance thresholds
    let score = 100;
    if (metrics.firstContentfulPaint > 1800) score -= 20;
    if (metrics.domContentLoaded > 1500) score -= 15;
    if (metrics.loadComplete > 3000) score -= 25;
    
    return Math.max(0, score);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5" />
            QuickPage Builder Test Suite
          </DialogTitle>
          <DialogDescription>
            Comprehensive testing and quality assurance tools
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="functional" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="functional">Functional</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
            <TabsTrigger value="browser">Browser</TabsTrigger>
          </TabsList>

          {/* Functional Tests */}
          <TabsContent value="functional" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Functional Testing
                </CardTitle>
                <CardDescription>
                  Test core functionality including blocks, drag-and-drop, export, and state management
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button 
                    onClick={runFunctionalTests}
                    disabled={isRunning}
                    className="flex-1"
                  >
                    {isRunning && currentTest === 'Functional Tests' ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Running Tests...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Run Functional Tests
                      </>
                    )}
                  </Button>
                  <Button 
                    onClick={runAllTests}
                    disabled={isRunning}
                    variant="outline"
                  >
                    Run All Tests
                  </Button>
                </div>

                {testResults && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-4">
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {testResults.total}
                          </div>
                          <div className="text-sm text-gray-600">Total Tests</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {testResults.passed}
                          </div>
                          <div className="text-sm text-gray-600">Passed</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-red-600">
                            {testResults.failed}
                          </div>
                          <div className="text-sm text-gray-600">Failed</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {testResults.successRate.toFixed(1)}%
                          </div>
                          <div className="text-sm text-gray-600">Success Rate</div>
                        </CardContent>
                      </Card>
                    </div>

                    <ScrollArea className="h-64">
                      <div className="space-y-2">
                        {testResults.results?.map((result, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="flex items-center gap-2">
                              {getStatusIcon(result.status)}
                              <span className="font-medium">{result.name}</span>
                            </div>
                            <Badge 
                              variant={result.status === 'PASSED' ? 'default' : 'destructive'}
                            >
                              {result.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tests */}
          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Performance Testing
                </CardTitle>
                <CardDescription>
                  Measure load times, memory usage, and overall performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={runPerformanceTests}
                  disabled={isRunning}
                  className="w-full"
                >
                  {isRunning && currentTest === 'Performance Tests' ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Measuring Performance...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Run Performance Tests
                    </>
                  )}
                </Button>

                {performanceMetrics && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                      <div>
                        <div className="font-semibold text-lg">Performance Score</div>
                        <div className="text-sm text-gray-600">Based on web vitals</div>
                      </div>
                      <div className="text-3xl font-bold text-blue-600">
                        {getPerformanceScore(performanceMetrics) || 'N/A'}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-lg font-semibold">
                            {performanceMetrics.firstContentfulPaint ? 
                              `${performanceMetrics.firstContentfulPaint.toFixed(0)}ms` : 'N/A'}
                          </div>
                          <div className="text-sm text-gray-600">First Contentful Paint</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-lg font-semibold">
                            {performanceMetrics.domContentLoaded ? 
                              `${performanceMetrics.domContentLoaded.toFixed(0)}ms` : 'N/A'}
                          </div>
                          <div className="text-sm text-gray-600">DOM Content Loaded</div>
                        </CardContent>
                      </Card>
                    </div>

                    {performanceMetrics.memoryUsage && (
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-lg font-semibold mb-2">Memory Usage</div>
                          <div className="space-y-1 text-sm">
                            <div>Used: {(performanceMetrics.memoryUsage.used / 1024 / 1024).toFixed(1)} MB</div>
                            <div>Total: {(performanceMetrics.memoryUsage.total / 1024 / 1024).toFixed(1)} MB</div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Accessibility Tests */}
          <TabsContent value="accessibility" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Accessibility Testing
                </CardTitle>
                <CardDescription>
                  Check accessibility features and keyboard navigation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={runAccessibilityTests}
                  disabled={isRunning}
                  className="w-full"
                >
                  {isRunning && currentTest === 'Accessibility Tests' ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Checking Accessibility...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      Run Accessibility Tests
                    </>
                  )}
                </Button>

                {accessibilityResults && (
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {accessibilityResults.interactiveElements}
                        </div>
                        <div className="text-sm text-gray-600">Interactive Elements</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {accessibilityResults.focusableElements}
                        </div>
                        <div className="text-sm text-gray-600">Focusable Elements</div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Browser Tests */}
          <TabsContent value="browser" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Browser & Device Testing
                </CardTitle>
                <CardDescription>
                  Test responsive design and cross-browser compatibility
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Monitor className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <div className="font-semibold">Desktop</div>
                      <div className="text-sm text-gray-600">1440x900+</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Smartphone className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <div className="font-semibold">Mobile</div>
                      <div className="text-sm text-gray-600">375x667+</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Browser Compatibility</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Chrome 90+
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Firefox 88+
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Safari 14+
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Edge 90+
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}