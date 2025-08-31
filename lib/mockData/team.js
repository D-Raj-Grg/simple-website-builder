// Mock team member data for development
export const mockTeamMembers = [
  {
    id: '1',
    name: 'Alex Rodriguez',
    role: 'Founder & CEO',
    photo: '/mock/team/alex.jpg',
    bio: 'Passionate entrepreneur with 15+ years in tech. Previously led engineering teams at major startups and built products used by millions.',
    email: 'alex@company.com',
    social: {
      linkedin: 'https://linkedin.com/in/alexrodriguez',
      twitter: 'https://twitter.com/alexr',
      github: 'https://github.com/alexr'
    },
    skills: ['Leadership', 'Product Strategy', 'Engineering'],
    location: 'San Francisco, CA',
    featured: true
  },
  {
    id: '2',
    name: 'Emma Thompson',
    role: 'Head of Design',
    photo: '/mock/team/emma.jpg',
    bio: 'Award-winning designer focused on user experience and visual storytelling. Passionate about creating intuitive interfaces that users love.',
    email: 'emma@company.com',
    social: {
      linkedin: 'https://linkedin.com/in/emmathompson',
      dribbble: 'https://dribbble.com/emmathompson',
      behance: 'https://behance.net/emmathompson'
    },
    skills: ['UX Design', 'Visual Design', 'Design Systems'],
    location: 'New York, NY',
    featured: true
  },
  {
    id: '3',
    name: 'Marcus Johnson',
    role: 'Lead Developer',
    photo: '/mock/team/marcus.jpg',
    bio: 'Full-stack engineer with expertise in modern web technologies. Loves building scalable systems and mentoring junior developers.',
    email: 'marcus@company.com',
    social: {
      linkedin: 'https://linkedin.com/in/marcusjohnson',
      github: 'https://github.com/marcusj',
      stackoverflow: 'https://stackoverflow.com/users/marcusj'
    },
    skills: ['React', 'Node.js', 'System Architecture'],
    location: 'Austin, TX',
    featured: true
  },
  {
    id: '4',
    name: 'Sarah Chen',
    role: 'Product Manager',
    photo: '/mock/team/sarah.jpg',
    bio: 'Data-driven product manager with a background in user research and analytics. Focused on building products that solve real problems.',
    email: 'sarah@company.com',
    social: {
      linkedin: 'https://linkedin.com/in/sarahchen',
      twitter: 'https://twitter.com/sarahc_pm',
      medium: 'https://medium.com/@sarahchen'
    },
    skills: ['Product Strategy', 'User Research', 'Data Analysis'],
    location: 'Seattle, WA',
    featured: true
  },
  {
    id: '5',
    name: 'James Wilson',
    role: 'Marketing Director',
    photo: '/mock/team/james.jpg',
    bio: 'Growth-focused marketer with experience across B2B and B2C. Specializes in content marketing and community building.',
    email: 'james@company.com',
    social: {
      linkedin: 'https://linkedin.com/in/jameswilson',
      twitter: 'https://twitter.com/jameswilson',
      instagram: 'https://instagram.com/jameswilsonmarketing'
    },
    skills: ['Content Marketing', 'SEO', 'Community Building'],
    location: 'Denver, CO',
    featured: false
  },
  {
    id: '6',
    name: 'Lisa Zhang',
    role: 'Customer Success Manager',
    photo: '/mock/team/lisa.jpg',
    bio: 'Customer-obsessed professional with a talent for turning users into advocates. Believes in the power of great customer experiences.',
    email: 'lisa@company.com',
    social: {
      linkedin: 'https://linkedin.com/in/lisazhang',
      twitter: 'https://twitter.com/lisa_cs'
    },
    skills: ['Customer Success', 'Support', 'Training'],
    location: 'Chicago, IL',
    featured: false
  },
  {
    id: '7',
    name: 'Tom Anderson',
    role: 'DevOps Engineer',
    photo: '/mock/team/tom.jpg',
    bio: 'Infrastructure expert passionate about automation and reliability. Ensures our platform runs smoothly at scale.',
    email: 'tom@company.com',
    social: {
      linkedin: 'https://linkedin.com/in/tomanderson',
      github: 'https://github.com/tomanderson'
    },
    skills: ['AWS', 'Docker', 'CI/CD', 'Monitoring'],
    location: 'Portland, OR',
    featured: false
  },
  {
    id: '8',
    name: 'Nina Patel',
    role: 'UI/UX Designer',
    photo: '/mock/team/nina.jpg',
    bio: 'Creative designer with a keen eye for detail and user-centered design approach. Loves crafting beautiful, functional interfaces.',
    email: 'nina@company.com',
    social: {
      linkedin: 'https://linkedin.com/in/ninapatel',
      dribbble: 'https://dribbble.com/ninapatel',
      figma: 'https://figma.com/@ninapatel'
    },
    skills: ['UI Design', 'Prototyping', 'Design Systems'],
    location: 'Los Angeles, CA',
    featured: true
  }
];

// Helper functions
export const getFeaturedTeamMembers = () => {
  return mockTeamMembers.filter(member => member.featured);
};

export const getTeamMemberById = (id) => {
  return mockTeamMembers.find(member => member.id === id);
};

export const getTeamMembersByRole = (role) => {
  return mockTeamMembers.filter(member => 
    member.role.toLowerCase().includes(role.toLowerCase())
  );
};

export const getTeamMembersByLocation = (location) => {
  return mockTeamMembers.filter(member => 
    member.location.toLowerCase().includes(location.toLowerCase())
  );
};

export const getTeamMembersBySkill = (skill) => {
  return mockTeamMembers.filter(member => 
    member.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
  );
};

export const getRandomTeamMembers = (count = 4) => {
  const shuffled = [...mockTeamMembers].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export default mockTeamMembers;