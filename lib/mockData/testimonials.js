// Mock testimonial data for development
export const mockTestimonials = [
  {
    id: '1',
    text: 'This platform completely transformed how we build our websites. The drag-and-drop interface is intuitive and the results are professional-grade. Our team productivity increased by 400%!',
    author: 'Sarah Johnson',
    role: 'CEO & Founder',
    company: 'TechCorp Solutions',
    avatar: '/mock/testimonials/sarah.jpg',
    rating: 5,
    featured: true,
    date: '2024-08-15'
  },
  {
    id: '2',
    text: 'Amazing results in record time. Our conversion rates increased by 300% after redesigning our homepage with this tool. The built-in optimization features are a game-changer.',
    author: 'Mike Chen',
    role: 'Marketing Director',
    company: 'GrowthLab Inc',
    avatar: '/mock/testimonials/mike.jpg',
    rating: 5,
    featured: true,
    date: '2024-08-12'
  },
  {
    id: '3',
    text: 'Finally, a website builder that doesn\'t compromise on design quality. Our clients are impressed with the professional look and feel of every page we create.',
    author: 'Emily Rodriguez',
    role: 'Creative Director',
    company: 'Design Studio Pro',
    avatar: '/mock/testimonials/emily.jpg',
    rating: 5,
    featured: true,
    date: '2024-08-08'
  },
  {
    id: '4',
    text: 'The multilingual support is fantastic. We were able to create versions of our site in 5 different languages without any technical headaches. Customer support is top-notch too.',
    author: 'Hans Mueller',
    role: 'International Sales Manager',
    company: 'Global Ventures Ltd',
    avatar: '/mock/testimonials/hans.jpg',
    rating: 5,
    featured: false,
    date: '2024-08-05'
  },
  {
    id: '5',
    text: 'As a non-technical founder, I was worried about building our company website. This tool made it so easy that I had a professional site live in just 2 hours!',
    author: 'Jessica Park',
    role: 'Founder',
    company: 'EcoStart',
    avatar: '/mock/testimonials/jessica.jpg',
    rating: 5,
    featured: true,
    date: '2024-08-03'
  },
  {
    id: '6',
    text: 'The performance optimization is incredible. Our site loads 3x faster than our old website, and Google PageSpeed scores are consistently above 95.',
    author: 'David Thompson',
    role: 'Technical Lead',
    company: 'FastTrack Digital',
    avatar: '/mock/testimonials/david.jpg',
    rating: 5,
    featured: false,
    date: '2024-07-30'
  },
  {
    id: '7',
    text: 'Perfect for agencies! We can create beautiful client websites in a fraction of the time. The white-label options are exactly what we needed.',
    author: 'Maria Santos',
    role: 'Agency Owner',
    company: 'Digital Spark Agency',
    avatar: '/mock/testimonials/maria.jpg',
    rating: 4,
    featured: false,
    date: '2024-07-28'
  },
  {
    id: '8',
    text: 'The block library is extensive and the customization options are perfect. We never feel limited in our design choices, yet it remains simple to use.',
    author: 'Alex Kim',
    role: 'UX Designer',
    company: 'Pixel Perfect Co',
    avatar: '/mock/testimonials/alex.jpg',
    rating: 5,
    featured: true,
    date: '2024-07-25'
  }
];

// Helper functions
export const getFeaturedTestimonials = (limit = 3) => {
  return mockTestimonials
    .filter(testimonial => testimonial.featured)
    .slice(0, limit);
};

export const getTestimonialsByRating = (rating) => {
  return mockTestimonials.filter(testimonial => testimonial.rating === rating);
};

export const getRecentTestimonials = (limit = 5) => {
  return mockTestimonials
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);
};

export const getTestimonialById = (id) => {
  return mockTestimonials.find(testimonial => testimonial.id === id);
};

export const getRandomTestimonials = (count = 3) => {
  const shuffled = [...mockTestimonials].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export default mockTestimonials;