'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Zap, 
  Paintbrush, 
  Smartphone, 
  ArrowRight,
  Star,
  Grid,
  Eye
} from "lucide-react";
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Paintbrush className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">QuickPage Builder</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/preview">
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </Link>
            <Link href="/editor">
              <Button>
                <Paintbrush className="h-4 w-4 mr-2" />
                Start Building
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="h-4 w-4" />
            Website Builder MVP
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Build Beautiful Websites in
            <span className="text-blue-600"> Minutes</span>
          </h2>
          
          <p className="text-xl text-gray-600 leading-relaxed mb-8 max-w-3xl mx-auto">
            Create professional homepages with our intuitive drag-and-drop builder. 
            No technical expertise required—just drag, drop, and publish.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/editor">
              <Button size="lg" className="px-8 py-4 text-lg font-semibold">
                <Paintbrush className="mr-2 h-5 w-5" />
                Start Building
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/preview">
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg font-semibold">
                <Eye className="mr-2 h-5 w-5" />
                View Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center border-0 shadow-lg">
            <CardHeader>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">Lightning Fast</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Built for speed and performance with modern web technologies. 
                Create pages in under 15 minutes.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg">
            <CardHeader>
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Grid className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Drag & Drop</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Intuitive drag-and-drop interface with 11 professional blocks. 
                No coding required.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg">
            <CardHeader>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Mobile First</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                All blocks are responsive by default. Your pages look perfect 
                on every device.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gray-900 text-white rounded-2xl p-12">
          <h3 className="text-3xl font-bold mb-4">
            Ready to Build Your Website?
          </h3>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses already using QuickPage Builder 
            to create stunning websites without any technical hassle.
          </p>
          <Link href="/editor">
            <Button size="lg" variant="outline" className="border-white text-gray-900 bg-white hover:bg-gray-100">
              <Paintbrush className="mr-2 h-5 w-5" />
              Get Started Now
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 mt-16 border-t border-gray-200">
        <div className="text-center text-gray-600">
          <p>&copy; 2024 QuickPage Builder. Built with Next.js, Tailwind CSS, and shadcn/ui.</p>
        </div>
      </footer>
    </div>
  );
}
