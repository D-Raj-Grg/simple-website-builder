// Mock product data for development
export const mockProducts = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    price: 299,
    originalPrice: 399,
    currency: '$',
    image: '/mock/products/headphones1.jpg',
    description: 'High-quality wireless headphones with active noise cancellation and premium sound quality.',
    category: 'electronics',
    inventory: 15,
    rating: 4.8,
    reviews: 324,
    featured: true,
    tags: ['wireless', 'noise-cancelling', 'premium']
  },
  {
    id: '2',
    name: 'Ergonomic Office Chair',
    price: 549,
    currency: '$',
    image: '/mock/products/chair1.jpg',
    description: 'Comfortable ergonomic office chair with lumbar support and adjustable height.',
    category: 'furniture',
    inventory: 8,
    rating: 4.6,
    reviews: 156,
    featured: true,
    tags: ['ergonomic', 'office', 'comfort']
  },
  {
    id: '3',
    name: 'Smart Watch Series 5',
    price: 399,
    originalPrice: 499,
    currency: '$',
    image: '/mock/products/watch1.jpg',
    description: 'Latest smartwatch with health tracking, GPS, and 7-day battery life.',
    category: 'electronics',
    inventory: 23,
    rating: 4.9,
    reviews: 892,
    featured: true,
    tags: ['smartwatch', 'fitness', 'gps']
  },
  {
    id: '4',
    name: 'Minimalist Desk Lamp',
    price: 89,
    currency: '$',
    image: '/mock/products/lamp1.jpg',
    description: 'Sleek LED desk lamp with adjustable brightness and USB charging port.',
    category: 'lighting',
    inventory: 34,
    rating: 4.4,
    reviews: 67,
    featured: false,
    tags: ['led', 'minimalist', 'usb']
  },
  {
    id: '5',
    name: 'Organic Cotton T-Shirt',
    price: 29,
    currency: '$',
    image: '/mock/products/tshirt1.jpg',
    description: 'Sustainable organic cotton t-shirt in various colors and sizes.',
    category: 'clothing',
    inventory: 120,
    rating: 4.3,
    reviews: 234,
    featured: false,
    tags: ['organic', 'cotton', 'sustainable']
  },
  {
    id: '6',
    name: 'Professional Camera',
    price: 1299,
    originalPrice: 1499,
    currency: '$',
    image: '/mock/products/camera1.jpg',
    description: 'High-end mirrorless camera perfect for photography enthusiasts and professionals.',
    category: 'electronics',
    inventory: 5,
    rating: 4.9,
    reviews: 445,
    featured: true,
    tags: ['camera', 'professional', 'mirrorless']
  },
  {
    id: '7',
    name: 'Artisan Coffee Beans',
    price: 24,
    currency: '$',
    image: '/mock/products/coffee1.jpg',
    description: 'Premium single-origin coffee beans roasted to perfection.',
    category: 'food',
    inventory: 67,
    rating: 4.7,
    reviews: 189,
    featured: false,
    tags: ['coffee', 'artisan', 'single-origin']
  },
  {
    id: '8',
    name: 'Wireless Charging Pad',
    price: 49,
    currency: '$',
    image: '/mock/products/charger1.jpg',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
    category: 'electronics',
    inventory: 45,
    rating: 4.2,
    reviews: 78,
    featured: false,
    tags: ['wireless', 'charging', 'qi']
  }
];

// Helper functions
export const getProductsByCategory = (category) => {
  return mockProducts.filter(product => product.category === category);
};

export const getFeaturedProducts = (limit = 6) => {
  return mockProducts
    .filter(product => product.featured)
    .slice(0, limit);
};

export const getProductById = (id) => {
  return mockProducts.find(product => product.id === id);
};

export const searchProducts = (query) => {
  const searchTerm = query.toLowerCase();
  return mockProducts.filter(product => 
    product.name.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm) ||
    product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
};

export const getProductsByPriceRange = (min, max) => {
  return mockProducts.filter(product => 
    product.price >= min && product.price <= max
  );
};

export default mockProducts;