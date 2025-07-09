import { Job } from '@/types';
import { generateId } from '@/utils/helpers';

/**
 * Job data generator for creating realistic sample job postings
 */
export class JobGenerator {
  private static jobTemplates = [
    {
      title: 'Senior Frontend Developer',
      company: 'TechFlow Solutions',
      location: 'San Francisco, CA',
      description: 'Join our dynamic team to build cutting-edge user interfaces using React and modern web technologies. You\'ll work on high-traffic applications serving millions of users.',
      requirements: [
        '5+ years of frontend development experience',
        'Expert knowledge of React, TypeScript, and modern JavaScript',
        'Experience with state management (Redux, Context API)',
        'Strong understanding of responsive design and CSS',
        'Experience with testing frameworks (Jest, Cypress)'
      ],
      skills: ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Redux', 'Webpack', 'Jest', 'Git'],
      experience_level: 'senior' as const,
      job_type: 'full-time' as const,
      salary_min: 130000,
      salary_max: 180000,
      remote_option: true
    },
    {
      title: 'Backend Python Engineer',
      company: 'DataCore Systems',
      location: 'Seattle, WA',
      description: 'Design and implement scalable backend services using Python and modern frameworks. Work with large datasets and build APIs that power our machine learning platform.',
      requirements: [
        'Bachelor\'s degree in Computer Science or related field',
        '4+ years of Python development experience',
        'Experience with Django or Flask frameworks',
        'Knowledge of database design and optimization',
        'Familiarity with cloud platforms (AWS, GCP)'
      ],
      skills: ['Python', 'Django', 'Flask', 'PostgreSQL', 'Redis', 'AWS', 'Docker', 'REST API', 'Git'],
      experience_level: 'mid' as const,
      job_type: 'full-time' as const,
      salary_min: 110000,
      salary_max: 150000,
      remote_option: true
    },
    {
      title: 'DevOps Engineer',
      company: 'CloudFirst Technologies',
      location: 'Austin, TX',
      description: 'Build and maintain scalable infrastructure for our microservices architecture. Implement CI/CD pipelines and ensure high availability of our cloud-native applications.',
      requirements: [
        '3+ years of DevOps or infrastructure experience',
        'Experience with containerization (Docker, Kubernetes)',
        'Knowledge of cloud platforms (AWS, Azure, GCP)',
        'Familiarity with Infrastructure as Code (Terraform, Ansible)',
        'Strong scripting skills (Bash, Python)'
      ],
      skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'Jenkins', 'Python', 'Bash', 'CI/CD', 'Ansible'],
      experience_level: 'mid' as const,
      job_type: 'full-time' as const,
      salary_min: 100000,
      salary_max: 140000,
      remote_option: true
    },
    {
      title: 'Mobile App Developer',
      company: 'InnovateMobile Inc.',
      location: 'Los Angeles, CA',
      description: 'Develop cross-platform mobile applications using React Native and Flutter. Create engaging user experiences for iOS and Android platforms.',
      requirements: [
        'Bachelor\'s degree in Computer Science or equivalent experience',
        '3+ years of mobile development experience',
        'Proficiency in React Native or Flutter',
        'Understanding of mobile UI/UX principles',
        'Experience with app store deployment processes'
      ],
      skills: ['React Native', 'Flutter', 'JavaScript', 'TypeScript', 'Swift', 'Kotlin', 'Firebase', 'REST API'],
      experience_level: 'mid' as const,
      job_type: 'full-time' as const,
      salary_min: 95000,
      salary_max: 135000,
      remote_option: false
    },
    {
      title: 'Data Scientist',
      company: 'Analytics Pro',
      location: 'New York, NY',
      description: 'Analyze complex datasets to derive actionable business insights. Build machine learning models and create data visualizations to support strategic decision-making.',
      requirements: [
        'Master\'s degree in Data Science, Statistics, or related field',
        '4+ years of data science experience',
        'Proficiency in Python and R',
        'Experience with machine learning frameworks',
        'Strong statistical analysis and modeling skills'
      ],
      skills: ['Python', 'R', 'Machine Learning', 'TensorFlow', 'Pandas', 'NumPy', 'Scikit-learn', 'SQL', 'Tableau'],
      experience_level: 'mid' as const,
      job_type: 'full-time' as const,
      salary_min: 120000,
      salary_max: 160000,
      remote_option: true
    },
    {
      title: 'Junior Software Engineer',
      company: 'StartupHub',
      location: 'Denver, CO',
      description: 'Perfect entry-level opportunity for recent graduates. Work on various projects, learn from experienced developers, and contribute to our growing codebase.',
      requirements: [
        'Bachelor\'s degree in Computer Science or related field',
        '0-2 years of professional development experience',
        'Knowledge of at least one programming language',
        'Understanding of software development principles',
        'Strong problem-solving skills and eagerness to learn'
      ],
      skills: ['JavaScript', 'Python', 'Java', 'Git', 'HTML', 'CSS', 'SQL', 'React'],
      experience_level: 'entry' as const,
      job_type: 'full-time' as const,
      salary_min: 70000,
      salary_max: 90000,
      remote_option: true
    },
    {
      title: 'Principal Software Architect',
      company: 'Enterprise Solutions Corp',
      location: 'Chicago, IL',
      description: 'Lead architectural decisions for large-scale enterprise systems. Mentor development teams and drive technical strategy across multiple product lines.',
      requirements: [
        'Master\'s degree in Computer Science or equivalent experience',
        '10+ years of software development experience',
        'Proven experience in system architecture and design',
        'Leadership experience with development teams',
        'Deep knowledge of scalable system design patterns'
      ],
      skills: ['System Architecture', 'Java', 'Spring Boot', 'Microservices', 'AWS', 'Kubernetes', 'Leadership', 'Mentoring'],
      experience_level: 'executive' as const,
      job_type: 'full-time' as const,
      salary_min: 180000,
      salary_max: 250000,
      remote_option: false
    },
    {
      title: 'UX/UI Designer',
      company: 'DesignStudio Pro',
      location: 'Portland, OR',
      description: 'Create intuitive and beautiful user experiences for web and mobile applications. Conduct user research and collaborate with development teams to implement designs.',
      requirements: [
        'Bachelor\'s degree in Design, HCI, or related field',
        '3+ years of UX/UI design experience',
        'Proficiency in design tools (Figma, Sketch, Adobe Creative Suite)',
        'Strong portfolio showcasing design process',
        'Understanding of user-centered design principles'
      ],
      skills: ['Figma', 'Sketch', 'Adobe XD', 'Photoshop', 'Illustrator', 'User Research', 'Wireframing', 'Prototyping'],
      experience_level: 'mid' as const,
      job_type: 'full-time' as const,
      salary_min: 85000,
      salary_max: 120000,
      remote_option: false
    },
    {
      title: 'Machine Learning Engineer',
      company: 'AI Innovations Lab',
      location: 'Boston, MA',
      description: 'Design and implement machine learning models and systems. Work on cutting-edge AI projects and deploy ML solutions to production environments.',
      requirements: [
        'Master\'s degree in Computer Science, ML, or related field',
        '5+ years of machine learning experience',
        'Experience with ML frameworks (TensorFlow, PyTorch)',
        'Strong mathematical and statistical background',
        'Experience with model deployment and MLOps'
      ],
      skills: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'Kubernetes', 'Docker', 'AWS'],
      experience_level: 'senior' as const,
      job_type: 'full-time' as const,
      salary_min: 140000,
      salary_max: 190000,
      remote_option: true
    },
    {
      title: 'Product Manager',
      company: 'InnovateCorp',
      location: 'Miami, FL',
      description: 'Drive product strategy and roadmap for our SaaS platform. Work closely with engineering, design, and marketing teams to deliver exceptional user experiences.',
      requirements: [
        'Bachelor\'s degree in Business, Engineering, or related field',
        '4+ years of product management experience',
        'Experience with agile development methodologies',
        'Strong analytical and data-driven decision making skills',
        'Excellent communication and leadership abilities'
      ],
      skills: ['Product Management', 'Agile', 'Scrum', 'Analytics', 'User Research', 'Roadmapping', 'Jira', 'Confluence'],
      experience_level: 'mid' as const,
      job_type: 'full-time' as const,
      salary_min: 115000,
      salary_max: 155000,
      remote_option: false
    }
  ];

  /**
   * Generate a diverse set of job postings
   */
  static generateJobs(count: number = 20): Job[] {
    const jobs: Job[] = [];
    
    for (let i = 0; i < count; i++) {
      const template = this.jobTemplates[i % this.jobTemplates.length];
      const job = this.createJobFromTemplate(template, i);
      jobs.push(job);
    }

    return jobs;
  }

  /**
   * Create a job from a template with variations
   */
  private static createJobFromTemplate(template: any, index: number): Job {
    const variations = this.getVariations(index);
    
    return {
      id: generateId(),
      title: this.varyTitle(template.title, variations),
      company: this.varyCompany(template.company, variations),
      location: this.varyLocation(template.location, variations),
      salary_min: this.varySalary(template.salary_min, variations),
      salary_max: this.varySalary(template.salary_max, variations),
      description: template.description,
      requirements: template.requirements,
      skills: this.varySkills(template.skills, variations),
      experience_level: template.experience_level,
      job_type: template.job_type,
      remote_option: this.varyRemoteOption(template.remote_option, variations),
      created_at: this.generateRecentDate(index),
      updated_at: this.generateRecentDate(index)
    };
  }

  /**
   * Get variation parameters based on index
   */
  private static getVariations(index: number) {
    return {
      titleVariation: index % 3,
      companyVariation: index % 4,
      locationVariation: index % 5,
      salaryVariation: (index % 3) - 1, // -1, 0, 1
      skillsVariation: index % 2,
      remoteVariation: index % 3
    };
  }

  /**
   * Create title variations
   */
  private static varyTitle(baseTitle: string, variations: any): string {
    const prefixes = ['', 'Senior ', 'Lead '];
    const suffixes = ['', ' - Remote', ' (Hybrid)'];
    
    if (variations.titleVariation === 1 && !baseTitle.includes('Senior')) {
      return prefixes[1] + baseTitle;
    } else if (variations.titleVariation === 2) {
      return baseTitle + suffixes[variations.titleVariation];
    }
    
    return baseTitle;
  }

  /**
   * Create company variations
   */
  private static varyCompany(baseCompany: string, variations: any): string {
    const suffixes = ['', ' LLC', ' Corp', ' Inc.'];
    const prefixes = ['', 'Global ', 'Advanced ', 'Next-Gen '];
    
    if (variations.companyVariation === 1) {
      return prefixes[1] + baseCompany;
    } else if (variations.companyVariation === 2) {
      return baseCompany + suffixes[2];
    } else if (variations.companyVariation === 3) {
      return baseCompany + suffixes[3];
    }
    
    return baseCompany;
  }

  /**
   * Create location variations
   */
  private static varyLocation(baseLocation: string, variations: any): string {
    const remoteOptions = ['Remote', 'Remote - US', 'Remote - Global'];
    const cities = [
      'San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Austin, TX',
      'Los Angeles, CA', 'Chicago, IL', 'Boston, MA', 'Denver, CO',
      'Atlanta, GA', 'Miami, FL', 'Phoenix, AZ', 'San Diego, CA'
    ];
    
    if (variations.locationVariation === 0) {
      return remoteOptions[variations.locationVariation % remoteOptions.length];
    } else if (variations.locationVariation === 4) {
      return cities[variations.locationVariation % cities.length];
    }
    
    return baseLocation;
  }

  /**
   * Vary salary ranges
   */
  private static varySalary(baseSalary: number, variations: any): number {
    const adjustment = variations.salaryVariation * 0.1; // ±10%
    return Math.round(baseSalary * (1 + adjustment));
  }

  /**
   * Create skill variations
   */
  private static varySkills(baseSkills: string[], variations: any): string[] {
    const additionalSkills = [
      'Agile', 'Scrum', 'CI/CD', 'Testing', 'MongoDB', 'Redis',
      'Elasticsearch', 'GraphQL', 'WebSockets', 'OAuth'
    ];
    
    const skills = [...baseSkills];
    
    if (variations.skillsVariation === 1) {
      // Add 1-2 additional skills
      const toAdd = additionalSkills
        .filter(skill => !skills.includes(skill))
        .slice(0, 2);
      skills.push(...toAdd);
    }
    
    return skills;
  }

  /**
   * Vary remote options
   */
  private static varyRemoteOption(baseRemote: boolean, variations: any): boolean {
    if (variations.remoteVariation === 0) return true;
    if (variations.remoteVariation === 1) return false;
    return baseRemote;
  }

  /**
   * Generate recent dates for job postings
   */
  private static generateRecentDate(index: number): string {
    const now = new Date();
    const daysAgo = Math.floor(Math.random() * 30) + (index * 2); // Vary posting dates
    const date = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
    return date.toISOString();
  }

  /**
   * Generate a specific job by ID for testing
   */
  static generateJobById(id: string): Job | null {
    const template = this.jobTemplates[0]; // Use first template
    return {
      id,
      title: template.title,
      company: template.company,
      location: template.location,
      salary_min: template.salary_min,
      salary_max: template.salary_max,
      description: template.description,
      requirements: template.requirements,
      skills: template.skills,
      experience_level: template.experience_level,
      job_type: template.job_type,
      remote_option: template.remote_option,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  /**
   * Search jobs by filters
   */
  static searchJobs(
    jobs: Job[], 
    query?: string, 
    location?: string, 
    experienceLevel?: string,
    jobType?: string,
    remoteOnly?: boolean
  ): Job[] {
    return jobs.filter(job => {
      // Query filter
      if (query) {
        const searchQuery = query.toLowerCase();
        const searchableText = [
          job.title,
          job.company,
          job.description,
          ...job.skills,
          ...job.requirements
        ].join(' ').toLowerCase();
        
        if (!searchableText.includes(searchQuery)) {
          return false;
        }
      }

      // Location filter
      if (location && !job.location.toLowerCase().includes(location.toLowerCase())) {
        return false;
      }

      // Experience level filter
      if (experienceLevel && job.experience_level !== experienceLevel) {
        return false;
      }

      // Job type filter
      if (jobType && job.job_type !== jobType) {
        return false;
      }

      // Remote filter
      if (remoteOnly && !job.remote_option) {
        return false;
      }

      return true;
    });
  }
}