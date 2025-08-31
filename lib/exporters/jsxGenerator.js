// JSX Component Generator for exporting pages as React/Next.js components

export class JSXGenerator {
  constructor(page, options = {}) {
    this.page = page;
    this.options = {
      framework: 'nextjs', // 'react' or 'nextjs'
      typescript: false,
      includeStyles: true,
      componentName: 'HomePage',
      ...options
    };
  }

  // Generate complete component code
  generateComponent() {
    const imports = this.generateImports();
    const componentCode = this.generateComponentCode();
    const styles = this.options.includeStyles ? this.generateStyles() : '';
    
    return {
      component: `${imports}\n\n${componentCode}`,
      styles: styles,
      dependencies: this.getDependencies()
    };
  }

  // Generate import statements
  generateImports() {
    const imports = [];
    
    if (this.options.framework === 'nextjs') {
      imports.push("import Image from 'next/image';");
      imports.push("import Link from 'next/link';");
    }
    
    // Add React imports if needed
    const needsReact = this.page.blocks.some(block => 
      ['contactForm', 'testimonials'].includes(block.type)
    );
    
    if (needsReact) {
      imports.push("import { useState } from 'react';");
    }
    
    return imports.join('\n');
  }

  // Generate main component code
  generateComponentCode() {
    const componentName = this.options.componentName;
    const blocksCode = this.page.blocks
      .sort((a, b) => a.order - b.order)
      .map(block => this.generateBlockCode(block))
      .join('\n\n');

    return `export default function ${componentName}() {
  return (
    <div className="min-h-screen bg-white">
      ${blocksCode}
    </div>
  );
}`;
  }

  // Generate code for individual blocks
  generateBlockCode(block) {
    const content = block.content[this.page.defaultLanguage] || block.content['en'] || {};
    const settings = block.settings || {};
    
    switch (block.type) {
      case 'hero':
        return this.generateHeroBlock(content, settings);
      case 'features':
        return this.generateFeaturesBlock(content, settings);
      case 'testimonials':
        return this.generateTestimonialsBlock(content, settings);
      case 'cta':
        return this.generateCTABlock(content, settings);
      case 'contactForm':
        return this.generateContactFormBlock(content, settings);
      case 'productGrid':
        return this.generateProductGridBlock(content, settings);
      case 'pricing':
        return this.generatePricingBlock(content, settings);
      case 'logoCloud':
        return this.generateLogoCloudBlock(content, settings);
      case 'about':
        return this.generateAboutBlock(content, settings);
      case 'gallery':
        return this.generateGalleryBlock(content, settings);
      case 'team':
        return this.generateTeamBlock(content, settings);
      default:
        return `      {/* ${block.type} block - Custom implementation needed */}`;
    }
  }

  // Hero block generator
  generateHeroBlock(content, settings) {
    const alignment = settings.alignment || 'center';
    const textSize = this.getTextSizeClass(settings.textSize || 'L');
    
    return `      <section className="relative bg-gray-900 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-${alignment}">
          <h1 className="${textSize} font-bold mb-6">
            ${this.escapeJSX(content.heading || 'Welcome to Our Site')}
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            ${this.escapeJSX(content.subheading || 'Build something amazing')}
          </p>
          ${content.ctaButton?.text ? `
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            ${this.escapeJSX(content.ctaButton.text)}
          </button>` : ''}
        </div>
      </section>`;
  }

  // Features block generator
  generateFeaturesBlock(content, settings) {
    const columns = settings.columns || 3;
    const colClass = this.getColumnClass(columns);
    const features = content.features || [];

    return `      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ${this.escapeJSX(content.heading || 'Our Features')}
            </h2>
          </div>
          <div className="grid ${colClass} gap-8">
            ${features.map(feature => `
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-xl">✨</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                ${this.escapeJSX(feature.title || 'Feature')}
              </h3>
              <p className="text-gray-600">
                ${this.escapeJSX(feature.description || 'Feature description')}
              </p>
            </div>`).join('')}
          </div>
        </div>
      </section>`;
  }

  // CTA block generator
  generateCTABlock(content, settings) {
    const bgColor = settings.backgroundColor || 'bg-blue-600';
    
    return `      <section className="${bgColor} py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            ${this.escapeJSX(content.heading || 'Ready to get started?')}
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            ${this.escapeJSX(content.description || 'Join thousands of satisfied customers')}
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
            ${this.escapeJSX(content.buttonText || 'Get Started')}
          </button>
        </div>
      </section>`;
  }

  // Contact form block generator
  generateContactFormBlock(content, settings) {
    return `      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ${this.escapeJSX(content.heading || 'Contact Us')}
            </h2>
          </div>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="First Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Last Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <input
              type="email"
              placeholder="Email Address"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <textarea
              placeholder="Your Message"
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>`;
  }

  // Product grid block generator
  generateProductGridBlock(content, settings) {
    const columns = settings.columns || 3;
    const colClass = this.getColumnClass(columns);

    return `      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ${this.escapeJSX(content.heading || 'Our Products')}
            </h2>
          </div>
          <div className="grid ${colClass} gap-8">
            {/* Products will be fetched from API */}
            {products?.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                ${this.options.framework === 'nextjs' ? `
                <Image
                  src={product.image}
                  alt={product.name}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />` : `
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />`}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">
                      \${product.price}
                    </span>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>`;
  }

  // Helper methods
  escapeJSX(text) {
    if (!text) return '';
    return text.replace(/'/g, "\\'").replace(/"/g, '\\"');
  }

  getTextSizeClass(size) {
    const sizes = {
      S: 'text-2xl',
      M: 'text-4xl', 
      L: 'text-5xl',
      XL: 'text-6xl'
    };
    return sizes[size] || sizes.L;
  }

  getColumnClass(columns) {
    const classes = {
      1: 'grid-cols-1',
      2: 'md:grid-cols-2',
      3: 'md:grid-cols-2 lg:grid-cols-3',
      4: 'md:grid-cols-2 lg:grid-cols-4'
    };
    return classes[columns] || classes[3];
  }

  // Generate CSS styles
  generateStyles() {
    return `/* Generated styles for ${this.page.title} */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom styles based on global settings */
:root {
  --primary-color: ${this.page.globalSettings.primaryColor || '#3B82F6'};
  --font-family: ${this.getFontFamily()};
}

body {
  font-family: var(--font-family);
}

.btn-primary {
  background-color: var(--primary-color);
}`;
  }

  getFontFamily() {
    const fonts = {
      sans: 'system-ui, -apple-system, sans-serif',
      serif: 'Georgia, serif',
      mono: 'Monaco, monospace'
    };
    return fonts[this.page.globalSettings.font] || fonts.sans;
  }

  // Get required dependencies
  getDependencies() {
    const deps = [];
    
    if (this.options.framework === 'nextjs') {
      deps.push('next');
    } else {
      deps.push('react', 'react-dom');
    }
    
    if (this.options.includeStyles) {
      deps.push('tailwindcss');
    }
    
    return deps;
  }

  // Generate additional block types (simplified versions for space)
  generateTestimonialsBlock(content, settings) {
    return `      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ${this.escapeJSX(content.heading || 'What Our Clients Say')}
            </h2>
          </div>
          {/* Testimonials grid */}
        </div>
      </section>`;
  }

  generatePricingBlock(content, settings) {
    return `      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ${this.escapeJSX(content.heading || 'Choose Your Plan')}
            </h2>
          </div>
          {/* Pricing cards */}
        </div>
      </section>`;
  }

  generateLogoCloudBlock(content, settings) {
    return `      <section className="py-12 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">
              ${this.escapeJSX(content.heading || 'Trusted by Industry Leaders')}
            </h2>
          </div>
          {/* Logo grid */}
        </div>
      </section>`;
  }

  generateAboutBlock(content, settings) {
    return `      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                ${this.escapeJSX(content.heading || 'About Us')}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                ${this.escapeJSX(content.content || 'Tell your story here...')}
              </p>
            </div>
            <div>
              {/* Image placeholder */}
            </div>
          </div>
        </div>
      </section>`;
  }

  generateGalleryBlock(content, settings) {
    return `      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ${this.escapeJSX(content.heading || 'Gallery')}
            </h2>
          </div>
          {/* Image gallery grid */}
        </div>
      </section>`;
  }

  generateTeamBlock(content, settings) {
    return `      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ${this.escapeJSX(content.heading || 'Meet Our Team')}
            </h2>
          </div>
          {/* Team member cards */}
        </div>
      </section>`;
  }
}

// Export utility function
export function generateJSXExport(page, options = {}) {
  const generator = new JSXGenerator(page, options);
  return generator.generateComponent();
}