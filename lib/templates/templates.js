// Template system for QuickPage Builder

export const TEMPLATE_CATEGORIES = {
  BUSINESS: 'business',
  ECOMMERCE: 'ecommerce', 
  PORTFOLIO: 'portfolio',
  LANDING: 'landing',
  BLOG: 'blog',
  RESTAURANT: 'restaurant'
};

// Predefined templates
export const TEMPLATES = [
  {
    id: 'modern-business',
    name: 'Modern Business',
    description: 'Professional business homepage with hero, features, and contact',
    category: TEMPLATE_CATEGORIES.BUSINESS,
    thumbnail: '/templates/modern-business.jpg',
    tags: ['professional', 'corporate', 'clean'],
    blocks: [
      {
        id: 'hero-1',
        type: 'hero',
        order: 0,
        settings: {
          textSize: 'L',
          alignment: 'center',
          imagePosition: 'center'
        },
        content: {
          en: {
            heading: 'Build Your Business Forward',
            subheading: 'We help companies scale with innovative solutions and expert guidance. Transform your vision into reality.',
            ctaButton: { text: 'Get Started', link: '#contact' }
          }
        }
      },
      {
        id: 'features-1', 
        type: 'features',
        order: 1,
        settings: {
          columns: 3,
          iconStyle: 'outlined',
          alignment: 'center'
        },
        content: {
          en: {
            heading: 'Why Choose Us',
            features: [
              {
                icon: 'rocket',
                title: 'Fast Results',
                description: 'Get your project up and running quickly with our streamlined process.'
              },
              {
                icon: 'shield',
                title: 'Secure & Reliable',
                description: 'Enterprise-grade security and 99.9% uptime guarantee.'
              },
              {
                icon: 'users',
                title: 'Expert Support',
                description: '24/7 support from our team of experienced professionals.'
              }
            ]
          }
        }
      },
      {
        id: 'cta-1',
        type: 'cta',
        order: 2,
        settings: {
          backgroundColor: 'bg-blue-600',
          buttonStyle: 'primary',
          layout: 'centered'
        },
        content: {
          en: {
            heading: 'Ready to Get Started?',
            description: 'Join thousands of satisfied customers who trust us with their business.',
            buttonText: 'Start Free Trial'
          }
        }
      },
      {
        id: 'contact-1',
        type: 'contactForm',
        order: 3,
        settings: {
          layout: 'single',
          showMap: false,
          fields: ['name', 'email', 'message']
        },
        content: {
          en: {
            heading: 'Get In Touch',
            description: 'Have questions? We\'d love to hear from you.'
          }
        }
      }
    ]
  },

  {
    id: 'ecommerce-store',
    name: 'E-commerce Store',
    description: 'Complete online store with product grid, testimonials, and features',
    category: TEMPLATE_CATEGORIES.ECOMMERCE,
    thumbnail: '/templates/ecommerce-store.jpg',
    tags: ['shop', 'products', 'sales'],
    blocks: [
      {
        id: 'hero-2',
        type: 'hero',
        order: 0,
        settings: {
          textSize: 'XL',
          alignment: 'left',
          imagePosition: 'right'
        },
        content: {
          en: {
            heading: 'Premium Products, Unbeatable Prices',
            subheading: 'Discover our curated collection of high-quality items. Free shipping on orders over $50.',
            ctaButton: { text: 'Shop Now', link: '#products' }
          }
        }
      },
      {
        id: 'product-grid-1',
        type: 'productGrid',
        order: 1,
        settings: {
          columns: 3,
          showPrice: true,
          cardStyle: 'modern'
        },
        content: {
          en: {
            heading: 'Featured Products',
            description: 'Check out our most popular items'
          }
        }
      },
      {
        id: 'testimonials-1',
        type: 'testimonials',
        order: 2,
        settings: {
          layout: 'grid',
          maxItems: 3,
          bgStyle: 'light'
        },
        content: {
          en: {
            heading: 'What Our Customers Say',
            quotes: [
              {
                text: 'Amazing quality and fast shipping! Will definitely order again.',
                author: 'Sarah Johnson',
                role: 'Verified Customer',
                rating: 5
              },
              {
                text: 'Best customer service I\'ve experienced. Highly recommended!',
                author: 'Mike Chen',
                role: 'Verified Customer', 
                rating: 5
              },
              {
                text: 'The products exceeded my expectations. Great value for money.',
                author: 'Emily Davis',
                role: 'Verified Customer',
                rating: 5
              }
            ]
          }
        }
      },
      {
        id: 'cta-2',
        type: 'cta',
        order: 3,
        settings: {
          backgroundColor: 'bg-green-600',
          buttonStyle: 'primary',
          layout: 'centered'
        },
        content: {
          en: {
            heading: 'Start Shopping Today',
            description: 'Free shipping on all orders over $50. 30-day money-back guarantee.',
            buttonText: 'Browse Products'
          }
        }
      }
    ]
  },

  {
    id: 'portfolio-creative',
    name: 'Creative Portfolio',
    description: 'Showcase your work with a stunning portfolio layout',
    category: TEMPLATE_CATEGORIES.PORTFOLIO,
    thumbnail: '/templates/portfolio-creative.jpg',
    tags: ['creative', 'gallery', 'showcase'],
    blocks: [
      {
        id: 'hero-3',
        type: 'hero',
        order: 0,
        settings: {
          textSize: 'L',
          alignment: 'center',
          imagePosition: 'center'
        },
        content: {
          en: {
            heading: 'Creative Designer & Developer',
            subheading: 'I create beautiful, functional designs that tell your story and engage your audience.',
            ctaButton: { text: 'View My Work', link: '#portfolio' }
          }
        }
      },
      {
        id: 'about-1',
        type: 'about',
        order: 1,
        settings: {
          imagePosition: 'left',
          columns: 2,
          bgColor: 'white'
        },
        content: {
          en: {
            heading: 'About Me',
            content: 'With over 5 years of experience in design and development, I specialize in creating digital experiences that combine aesthetics with functionality. I\'ve worked with clients ranging from startups to Fortune 500 companies.'
          }
        }
      },
      {
        id: 'gallery-1',
        type: 'gallery',
        order: 2,
        settings: {
          layout: 'masonry',
          spacing: 'comfortable',
          lightbox: true
        },
        content: {
          en: {
            heading: 'Recent Work',
            images: [
              { url: '/portfolio/project1.jpg', caption: 'Brand Identity Design' },
              { url: '/portfolio/project2.jpg', caption: 'Web Application UI' },
              { url: '/portfolio/project3.jpg', caption: 'Mobile App Design' },
              { url: '/portfolio/project4.jpg', caption: 'E-commerce Website' },
              { url: '/portfolio/project5.jpg', caption: 'Logo Design' },
              { url: '/portfolio/project6.jpg', caption: 'Print Design' }
            ]
          }
        }
      },
      {
        id: 'contact-2',
        type: 'contactForm',
        order: 3,
        settings: {
          layout: 'two-col',
          showMap: false,
          fields: ['name', 'email', 'project-type', 'budget', 'message']
        },
        content: {
          en: {
            heading: 'Let\'s Work Together',
            description: 'Ready to bring your project to life? Let\'s discuss your vision.'
          }
        }
      }
    ]
  },

  {
    id: 'landing-page',
    name: 'Product Landing Page',
    description: 'High-converting landing page for product launches',
    category: TEMPLATE_CATEGORIES.LANDING,
    thumbnail: '/templates/landing-page.jpg',
    tags: ['conversion', 'product', 'launch'],
    blocks: [
      {
        id: 'hero-4',
        type: 'hero',
        order: 0,
        settings: {
          textSize: 'XL',
          alignment: 'center',
          imagePosition: 'center'
        },
        content: {
          en: {
            heading: 'Revolutionary New Product',
            subheading: 'The game-changing solution you\'ve been waiting for. Pre-order now and save 30%.',
            ctaButton: { text: 'Pre-Order Now', link: '#pricing' }
          }
        }
      },
      {
        id: 'features-2',
        type: 'features',
        order: 1,
        settings: {
          columns: 2,
          iconStyle: 'filled',
          alignment: 'left'
        },
        content: {
          en: {
            heading: 'Powerful Features',
            features: [
              {
                icon: 'zap',
                title: 'Lightning Fast',
                description: '10x faster than traditional solutions with our cutting-edge technology.'
              },
              {
                icon: 'smartphone',
                title: 'Mobile Optimized',
                description: 'Works perfectly on all devices with responsive design.'
              },
              {
                icon: 'lock',
                title: 'Bank-Level Security',
                description: 'Your data is protected with enterprise-grade encryption.'
              },
              {
                icon: 'clock',
                title: 'Save Hours Daily',
                description: 'Automate repetitive tasks and focus on what matters most.'
              }
            ]
          }
        }
      },
      {
        id: 'pricing-1',
        type: 'pricing',
        order: 2,
        settings: {
          planCount: 3,
          highlightPlan: 2,
          currency: 'USD'
        },
        content: {
          en: {
            heading: 'Choose Your Plan',
            plans: [
              {
                name: 'Starter',
                price: 29,
                features: ['Basic features', '5 projects', 'Email support'],
                cta: 'Get Started'
              },
              {
                name: 'Professional',
                price: 79,
                features: ['All starter features', '25 projects', 'Priority support', 'Advanced analytics'],
                cta: 'Most Popular',
                highlighted: true
              },
              {
                name: 'Enterprise',
                price: 199,
                features: ['All professional features', 'Unlimited projects', '24/7 phone support', 'Custom integrations'],
                cta: 'Contact Sales'
              }
            ]
          }
        }
      }
    ]
  },

  {
    id: 'restaurant-menu',
    name: 'Restaurant & Menu',
    description: 'Elegant restaurant website with menu and contact info',
    category: TEMPLATE_CATEGORIES.RESTAURANT,
    thumbnail: '/templates/restaurant-menu.jpg',
    tags: ['food', 'menu', 'restaurant'],
    blocks: [
      {
        id: 'hero-5',
        type: 'hero',
        order: 0,
        settings: {
          textSize: 'L',
          alignment: 'center',
          imagePosition: 'center'
        },
        content: {
          en: {
            heading: 'Authentic Italian Cuisine',
            subheading: 'Experience the finest Italian dishes made with fresh, local ingredients in a warm, welcoming atmosphere.',
            ctaButton: { text: 'Make Reservation', link: '#contact' }
          }
        }
      },
      {
        id: 'about-2',
        type: 'about',
        order: 1,
        settings: {
          imagePosition: 'right',
          columns: 2,
          bgColor: 'cream'
        },
        content: {
          en: {
            heading: 'Our Story',
            content: 'Founded in 1982 by the Rossi family, our restaurant has been serving authentic Italian cuisine for over 40 years. We pride ourselves on using traditional recipes passed down through generations, combined with the freshest local ingredients.'
          }
        }
      },
      {
        id: 'team-1',
        type: 'team',
        order: 2,
        settings: {
          columns: 3,
          cardStyle: 'elegant',
          showSocial: false
        },
        content: {
          en: {
            heading: 'Meet Our Chefs',
            members: [
              {
                name: 'Marco Rossi',
                role: 'Head Chef',
                bio: 'Trained in Milan, Marco brings 25 years of culinary expertise.',
                photo: '/team/marco.jpg'
              },
              {
                name: 'Isabella Chen',
                role: 'Pastry Chef',
                bio: 'Specializing in traditional Italian desserts and modern twists.',
                photo: '/team/isabella.jpg'
              },
              {
                name: 'Giovanni Torres',
                role: 'Sous Chef',
                bio: 'Expert in seafood and regional Italian specialties.',
                photo: '/team/giovanni.jpg'
              }
            ]
          }
        }
      },
      {
        id: 'contact-3',
        type: 'contactForm',
        order: 3,
        settings: {
          layout: 'two-col',
          showMap: true,
          fields: ['name', 'email', 'phone', 'date', 'guests', 'message']
        },
        content: {
          en: {
            heading: 'Reservations',
            description: 'Book your table for an unforgettable dining experience.'
          }
        }
      }
    ]
  }
];

// Template utility functions
export class TemplateManager {
  static getAllTemplates() {
    return TEMPLATES;
  }

  static getTemplatesByCategory(category) {
    return TEMPLATES.filter(template => template.category === category);
  }

  static getTemplateById(id) {
    return TEMPLATES.find(template => template.id === id);
  }

  static searchTemplates(query) {
    const searchTerm = query.toLowerCase();
    return TEMPLATES.filter(template => 
      template.name.toLowerCase().includes(searchTerm) ||
      template.description.toLowerCase().includes(searchTerm) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  static applyTemplate(template, pageStore) {
    if (!template || !template.blocks) {
      throw new Error('Invalid template structure');
    }

    // Create a new page with template data
    const newPage = {
      id: `page-${Date.now()}`,
      title: template.name,
      defaultLanguage: 'en',
      languages: ['en'],
      blocks: template.blocks.map(block => ({
        ...block,
        id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      })),
      globalSettings: {
        primaryColor: '#3B82F6',
        font: 'sans',
        spacing: 'comfortable'
      }
    };

    return newPage;
  }

  static createCustomTemplate(page, metadata = {}) {
    const template = {
      id: `custom-${Date.now()}`,
      name: metadata.name || page.title,
      description: metadata.description || `Custom template created from ${page.title}`,
      category: metadata.category || 'custom',
      thumbnail: metadata.thumbnail || '/templates/custom.jpg',
      tags: metadata.tags || ['custom'],
      blocks: page.blocks.map(block => ({
        ...block,
        id: null // Will be regenerated when applied
      })),
      createdAt: new Date().toISOString(),
      isCustom: true
    };

    return template;
  }

  static exportTemplate(template) {
    return JSON.stringify(template, null, 2);
  }

  static importTemplate(templateJson) {
    try {
      const template = JSON.parse(templateJson);
      
      // Validate template structure
      if (!template.id || !template.name || !template.blocks) {
        throw new Error('Invalid template structure');
      }

      return template;
    } catch (error) {
      throw new Error(`Failed to import template: ${error.message}`);
    }
  }
}