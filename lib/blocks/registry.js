/**
 * Block Registry - Central configuration for all blocks
 * Defines default settings, content, and metadata for each block type
 * @fileoverview Core block system configuration
 */
import { nanoid } from 'nanoid';

/**
 * Default settings and content for each block type
 * @typedef {Object} BlockDefault
 * @property {Object} settings - Default settings for the block
 * @property {Object} content - Default content structure for the block
 */
export const blockDefaults = {
  hero: {
    settings: {
      // Layout settings
      imagePosition: 'center',
      alignment: 'center',
      bgColor: 'white',
      spacing: 'comfortable',
      
      // Heading settings
      headingSize: 'L',
      headingWeight: 'bold',
      headingColor: '#1F2937',
      headingAlignment: 'center',
      headingSpacing: 'md',
      
      // Subheading settings
      subheadingSize: 'M',
      subheadingWeight: 'normal',
      subheadingColor: '#6B7280',
      subheadingAlignment: 'center',
      subheadingSpacing: 'md',
      
      // Button settings
      buttonStyle: {
        size: 'lg',
        variant: 'primary',
        icon: 'play',
        iconPosition: 'left',
        corner: 'rounded'
      },
      buttonAlignment: 'center',
      buttonSpacing: 'lg',
      
      // Image settings
      imageSize: 'auto',
      imageRadius: 'rounded',
      imageOverlay: false,
      imageOpacity: 100
    },
    content: {
      heading: 'Transform Your Business Today',
      subheading: 'Build beautiful, professional websites in minutes with our intuitive drag-and-drop builder.',
      ctaButton: {
        text: 'Get Started',
        link: '#'
      },
      image: '/mock/hero/hero1.jpg'
    }
  },

  features: {
    settings: {
      columns: 3,
      iconStyle: 'outlined',
      alignment: 'center'
    },
    content: {
      heading: 'Why Choose Us',
      items: [
        {
          id: nanoid(),
          icon: 'Zap',
          title: 'Lightning Fast',
          description: 'Built for speed and performance with modern web technologies.'
        },
        {
          id: nanoid(),
          icon: 'Shield',
          title: 'Secure & Reliable',
          description: 'Enterprise-grade security with 99.9% uptime guarantee.'
        },
        {
          id: nanoid(),
          icon: 'Users',
          title: 'Expert Support',
          description: '24/7 customer support from our team of experts.'
        }
      ]
    }
  },

  testimonials: {
    settings: {
      layout: 'grid',
      maxItems: 3,
      bgStyle: 'light'
    },
    content: {
      heading: 'What Our Customers Say',
      quotes: [
        {
          id: nanoid(),
          text: 'This platform completely transformed how we build our websites. The ease of use is incredible!',
          author: 'Sarah Johnson',
          role: 'CEO, TechCorp',
          avatar: '/mock/testimonials/avatar1.jpg',
          rating: 5
        },
        {
          id: nanoid(),
          text: 'Amazing results in record time. Our conversion rates increased by 300% after the redesign.',
          author: 'Mike Chen',
          role: 'Marketing Director',
          avatar: '/mock/testimonials/avatar2.jpg',
          rating: 5
        }
      ]
    }
  },

  cta: {
    settings: {
      background: 'gradient',
      buttonStyle: 'primary',
      layout: 'centered'
    },
    content: {
      heading: 'Ready to Get Started?',
      description: 'Join thousands of businesses already using our platform to grow their online presence.',
      buttons: [
        {
          id: nanoid(),
          text: 'Start Free Trial',
          link: '#',
          style: 'primary'
        },
        {
          id: nanoid(),
          text: 'View Pricing',
          link: '#',
          style: 'secondary'
        }
      ]
    }
  },

  contactForm: {
    settings: {
      layout: 'single',
      showMap: false,
      fields: ['name', 'email', 'message']
    },
    content: {
      heading: 'Get In Touch',
      description: 'Have questions? We\'d love to hear from you.',
      submitText: 'Send Message',
      successMessage: 'Thank you! We\'ll get back to you soon.',
      formFields: [
        { id: 'name', type: 'text', label: 'Full Name', required: true },
        { id: 'email', type: 'email', label: 'Email Address', required: true },
        { id: 'message', type: 'textarea', label: 'Message', required: true }
      ]
    }
  },

  productGrid: {
    settings: {
      columns: 3,
      showPrice: true,
      cardStyle: 'elevated'
    },
    content: {
      heading: 'Featured Products',
      description: 'Discover our most popular products',
      apiParams: {
        category: 'featured',
        limit: 6,
        sortBy: 'popularity'
      }
    }
  },

  pricing: {
    settings: {
      planCount: 3,
      highlightPlan: 1,
      currency: '$'
    },
    content: {
      heading: 'Simple, Transparent Pricing',
      description: 'Choose the plan that works best for you',
      plans: [
        {
          id: nanoid(),
          name: 'Starter',
          price: 29,
          period: 'month',
          features: ['5 Pages', 'Basic Templates', 'Email Support'],
          cta: 'Start Free Trial',
          popular: false
        },
        {
          id: nanoid(),
          name: 'Professional',
          price: 79,
          period: 'month',
          features: ['Unlimited Pages', 'Premium Templates', 'Priority Support', 'Custom Domain'],
          cta: 'Get Started',
          popular: true
        },
        {
          id: nanoid(),
          name: 'Enterprise',
          price: 199,
          period: 'month',
          features: ['Everything in Pro', 'White Label', 'Dedicated Manager', 'SLA Guarantee'],
          cta: 'Contact Sales',
          popular: false
        }
      ]
    }
  },

  logoCloud: {
    settings: {
      perRow: 5,
      grayscale: true,
      animation: 'static'
    },
    content: {
      heading: 'Trusted by Industry Leaders',
      logos: [
        { id: nanoid(), name: 'Company 1', image: '/mock/logos/logo1.png' },
        { id: nanoid(), name: 'Company 2', image: '/mock/logos/logo2.png' },
        { id: nanoid(), name: 'Company 3', image: '/mock/logos/logo3.png' },
        { id: nanoid(), name: 'Company 4', image: '/mock/logos/logo4.png' },
        { id: nanoid(), name: 'Company 5', image: '/mock/logos/logo5.png' }
      ]
    }
  },

  about: {
    settings: {
      imagePosition: 'right',
      columns: 1,
      bgColor: 'white'
    },
    content: {
      heading: 'About Our Company',
      content: 'We are passionate about creating tools that empower businesses to succeed online. Our team of experts has been building world-class software for over a decade.',
      image: '/mock/about/team.jpg'
    }
  },

  gallery: {
    settings: {
      layout: '3x3',
      spacing: 'medium',
      lightbox: true
    },
    content: {
      heading: 'Our Work',
      images: [
        { id: nanoid(), url: '/mock/gallery/img1.jpg', caption: 'Project One' },
        { id: nanoid(), url: '/mock/gallery/img2.jpg', caption: 'Project Two' },
        { id: nanoid(), url: '/mock/gallery/img3.jpg', caption: 'Project Three' },
        { id: nanoid(), url: '/mock/gallery/img4.jpg', caption: 'Project Four' }
      ]
    }
  },

  team: {
    settings: {
      columns: 3,
      cardStyle: 'simple',
      showSocial: true
    },
    content: {
      heading: 'Meet Our Team',
      description: 'The talented people behind our success',
      members: [
        {
          id: nanoid(),
          name: 'Alex Rodriguez',
          role: 'Founder & CEO',
          photo: '/mock/team/person1.jpg',
          bio: 'Passionate entrepreneur with 15+ years in tech.',
          social: {
            linkedin: '#',
            twitter: '#'
          }
        },
        {
          id: nanoid(),
          name: 'Emma Thompson',
          role: 'Head of Design',
          photo: '/mock/team/person2.jpg',
          bio: 'Award-winning designer focused on user experience.',
          social: {
            linkedin: '#',
            dribbble: '#'
          }
        }
      ]
    }
  }
};

/**
 * Block metadata registry
 * Contains configuration for all available block types
 * @typedef {Object} BlockRegistryEntry
 * @property {string} id - Unique block type identifier
 * @property {string} name - Display name for the block
 * @property {string} category - Block category for organization
 * @property {string} description - Brief description of block functionality
 * @property {string} icon - Lucide icon name for the block
 * @property {Object} defaultSettings - Default settings object
 * @property {Object} defaultContent - Default content structure
 */
export const blockRegistry = {
  hero: {
    id: 'hero',
    name: 'Hero Section',
    category: 'marketing',
    description: 'Eye-catching header section with headline, subheading, and call-to-action',
    icon: 'Star',
    defaultSettings: blockDefaults.hero.settings,
    defaultContent: blockDefaults.hero.content
  },

  features: {
    id: 'features',
    name: 'Features',
    category: 'content',
    description: 'Showcase your product or service features in a grid layout',
    icon: 'Grid',
    defaultSettings: blockDefaults.features.settings,
    defaultContent: blockDefaults.features.content
  },

  testimonials: {
    id: 'testimonials',
    name: 'Testimonials',
    category: 'social-proof',
    description: 'Display customer reviews and testimonials',
    icon: 'MessageCircle',
    defaultSettings: blockDefaults.testimonials.settings,
    defaultContent: blockDefaults.testimonials.content
  },

  cta: {
    id: 'cta',
    name: 'Call to Action',
    category: 'marketing',
    description: 'Conversion-focused section with buttons and compelling copy',
    icon: 'ArrowRight',
    defaultSettings: blockDefaults.cta.settings,
    defaultContent: blockDefaults.cta.content
  },

  contactForm: {
    id: 'contactForm',
    name: 'Contact Form',
    category: 'forms',
    description: 'Customizable contact form with validation',
    icon: 'Mail',
    defaultSettings: blockDefaults.contactForm.settings,
    defaultContent: blockDefaults.contactForm.content
  },

  productGrid: {
    id: 'productGrid',
    name: 'Product Grid',
    category: 'ecommerce',
    description: 'Display products in a responsive grid layout',
    icon: 'ShoppingBag',
    defaultSettings: blockDefaults.productGrid.settings,
    defaultContent: blockDefaults.productGrid.content
  },

  pricing: {
    id: 'pricing',
    name: 'Pricing Table',
    category: 'marketing',
    description: 'Compare plans and pricing options',
    icon: 'DollarSign',
    defaultSettings: blockDefaults.pricing.settings,
    defaultContent: blockDefaults.pricing.content
  },

  logoCloud: {
    id: 'logoCloud',
    name: 'Logo Cloud',
    category: 'social-proof',
    description: 'Display client or partner logos',
    icon: 'Building',
    defaultSettings: blockDefaults.logoCloud.settings,
    defaultContent: blockDefaults.logoCloud.content
  },

  about: {
    id: 'about',
    name: 'About Section',
    category: 'content',
    description: 'Tell your story with text and images',
    icon: 'Info',
    defaultSettings: blockDefaults.about.settings,
    defaultContent: blockDefaults.about.content
  },

  gallery: {
    id: 'gallery',
    name: 'Image Gallery',
    category: 'media',
    description: 'Showcase images in various layouts',
    icon: 'Image',
    defaultSettings: blockDefaults.gallery.settings,
    defaultContent: blockDefaults.gallery.content
  },

  team: {
    id: 'team',
    name: 'Team Members',
    category: 'content',
    description: 'Introduce your team with photos and bios',
    icon: 'Users',
    defaultSettings: blockDefaults.team.settings,
    defaultContent: blockDefaults.team.content
  }
};

/**
 * Helper function to create a new block with default values
 * @param {string} blockType - Type of block to create
 * @param {Object} customContent - Custom content to override defaults
 * @param {Object} customSettings - Custom settings to override defaults
 * @returns {Object} New block instance with generated ID
 * @throws {Error} If blockType is not found in registry
 */
export const createBlock = (blockType, customContent = {}, customSettings = {}) => {
  const registry = blockRegistry[blockType];
  if (!registry) {
    throw new Error(`Block type "${blockType}" not found in registry`);
  }

  return {
    id: nanoid(),
    type: blockType,
    order: 0, // Will be set by store
    settings: {
      ...registry.defaultSettings,
      ...customSettings
    },
    content: {
      en: {
        ...registry.defaultContent,
        ...customContent
      }
    }
  };
};

/**
 * Get blocks organized by category
 * @returns {Object} Object with category names as keys and block arrays as values
 */
export const getBlocksByCategory = () => {
  const categories = {};
  
  Object.values(blockRegistry).forEach(block => {
    if (!categories[block.category]) {
      categories[block.category] = [];
    }
    categories[block.category].push(block);
  });
  
  return categories;
};

/**
 * Validate that a block has the required structure
 * @param {Object} block - Block object to validate
 * @returns {boolean} Whether the block is valid
 */
export const validateBlock = (block) => {
  const registry = blockRegistry[block.type];
  if (!registry) return false;
  
  // Basic validation - ensure block has required structure
  return (
    block.id &&
    block.type &&
    block.settings &&
    block.content &&
    typeof block.order === 'number'
  );
};

export default blockRegistry;