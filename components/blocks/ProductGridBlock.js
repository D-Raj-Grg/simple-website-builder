'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  Star,
  Filter,
  Grid,
  Heart,
  Eye,
  Package,
  Tag,
  TrendingUp
} from "lucide-react";
import useEditorStore from '@/lib/store/editorStore';
import { mockProducts, getFeaturedProducts, getProductsByCategory } from '@/lib/mockData/products';
import Image from 'next/image';

export default function ProductGridBlock({ content, settings, isEditing, blockId }) {
  const [isEditingText, setIsEditingText] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { updateBlock, currentLanguage } = useEditorStore();

  const handleContentChange = (key, value) => {
    updateBlock(blockId, {
      content: {
        ...content,
        [currentLanguage]: {
          ...content,
          [key]: value
        }
      }
    });
  };

  const {
    columns = 3,
    showPrice = true,
    cardStyle = 'elevated'
  } = settings;

  const {
    heading = 'Featured Products',
    description = 'Discover our most popular products',
    apiParams = {
      category: 'featured',
      limit: 6,
      sortBy: 'popularity'
    }
  } = content;

  // Fetch products based on API parameters
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let fetchedProducts = [];
        
        if (apiParams.category === 'featured') {
          fetchedProducts = getFeaturedProducts(apiParams.limit || 6);
        } else if (apiParams.category === 'all') {
          fetchedProducts = mockProducts.slice(0, apiParams.limit || 6);
        } else {
          fetchedProducts = getProductsByCategory(apiParams.category)
            .slice(0, apiParams.limit || 6);
        }

        // Sort products
        if (apiParams.sortBy === 'price-low') {
          fetchedProducts.sort((a, b) => a.price - b.price);
        } else if (apiParams.sortBy === 'price-high') {
          fetchedProducts.sort((a, b) => b.price - a.price);
        } else if (apiParams.sortBy === 'rating') {
          fetchedProducts.sort((a, b) => b.rating - a.rating);
        }

        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts(mockProducts.slice(0, 6)); // Fallback
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [apiParams]);

  const columnClasses = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4'
  };

  const cardStyles = {
    elevated: 'shadow-lg hover:shadow-xl',
    flat: 'border border-gray-200 hover:border-gray-300',
    minimal: 'hover:bg-gray-50'
  };

  const renderProductCard = (product) => (
    <Card key={product.id} className={`${cardStyles[cardStyle]} transition-all duration-200 group cursor-pointer`}>
      <CardContent className="p-0">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Product badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.featured && (
              <Badge className="bg-blue-600 text-white">
                <Star className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
            {product.originalPrice && (
              <Badge variant="destructive">
                <Tag className="h-3 w-3 mr-1" />
                Sale
              </Badge>
            )}
          </div>

          {/* Hover actions */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex gap-2">
              <Button size="icon" variant="secondary" className="rounded-full">
                <Eye className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="secondary" className="rounded-full">
                <Heart className="h-4 w-4" />
              </Button>
              <Button size="icon" className="rounded-full">
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
            {product.name}
          </h3>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              ({product.reviews})
            </span>
          </div>

          {/* Price */}
          {showPrice && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900">
                  {product.currency}{product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    {product.currency}{product.originalPrice}
                  </span>
                )}
              </div>
              
              {product.inventory < 10 && (
                <Badge variant="outline" className="text-orange-600">
                  Only {product.inventory} left
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <section className="py-16 px-6 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          {isEditing && isEditingText === 'heading' ? (
            <Input
              value={heading}
              onChange={(e) => handleContentChange('heading', e.target.value)}
              onBlur={(e) => {
                handleContentChange('heading', e.target.value);
                setIsEditingText(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleContentChange('heading', e.target.value);
                  setIsEditingText(null);
                }
              }}
              className="text-3xl font-bold border-2 border-blue-500 bg-white text-center"
              autoFocus
            />
          ) : (
            <h2 
              className={`text-3xl md:text-4xl font-bold text-gray-900 mb-4 ${
                isEditing ? 'cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors' : ''
              }`}
              onClick={() => isEditing && setIsEditingText('heading')}
            >
              {heading}
            </h2>
          )}

          {isEditing && isEditingText === 'description' ? (
            <Textarea
              value={description}
              onChange={(e) => handleContentChange('description', e.target.value)}
              onBlur={(e) => {
                handleContentChange('description', e.target.value);
                setIsEditingText(null);
              }}
              className="text-xl border-2 border-blue-500 bg-white resize-none text-center"
              rows={2}
              autoFocus
            />
          ) : (
            <p 
              className={`text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto ${
                isEditing ? 'cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors' : ''
              }`}
              onClick={() => isEditing && setIsEditingText('description')}
            >
              {description}
            </p>
          )}
        </div>

        {/* Filter/Category Info */}
        {isEditing && (
          <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Filter className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-900">Product Filter Settings</span>
            </div>
            <div className="text-sm text-blue-700 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <strong>Category:</strong> {apiParams.category}
              </div>
              <div>
                <strong>Limit:</strong> {apiParams.limit} products
              </div>
              <div>
                <strong>Sort by:</strong> {apiParams.sortBy}
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-0">
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Found</h3>
            <p className="text-gray-500">
              No products match the current filter criteria.
            </p>
            {isEditing && (
              <p className="text-sm text-blue-600 mt-2">
                Adjust the API parameters in the settings panel.
              </p>
            )}
          </div>
        ) : (
          <div className={`grid grid-cols-1 sm:grid-cols-2 ${columnClasses[columns]} gap-8`}>
            {products.map(renderProductCard)}
          </div>
        )}

        {/* View All Button */}
        {!isEditing && products.length > 0 && (
          <div className="text-center mt-12">
            <Button size="lg" variant="outline">
              <TrendingUp className="mr-2 h-5 w-5" />
              View All Products
            </Button>
          </div>
        )}
      </div>

      {/* Editing helper */}
      {isEditing && (
        <div className="fixed bottom-4 left-4 bg-green-600 text-white text-xs px-3 py-2 rounded-md shadow-lg z-50">
          Product Grid • Connected to mock data • Configure in settings
        </div>
      )}
    </section>
  );
}