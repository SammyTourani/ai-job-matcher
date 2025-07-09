// Application Constants
export const APP_NAME = 'AI Job Matcher';
export const APP_DESCRIPTION = 'AI-powered job matching platform with semantic resume analysis';
export const APP_VERSION = '1.0.0';

// Pagination
export const JOBS_PER_PAGE = 10;
export const MATCHES_PER_PAGE = 10;

// File Upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

// Experience Levels
export const EXPERIENCE_LEVELS = [
  { value: 'entry', label: 'Entry Level (0-2 years)' },
  { value: 'mid', label: 'Mid Level (2-5 years)' },
  { value: 'senior', label: 'Senior Level (5-10 years)' },
  { value: 'executive', label: 'Executive Level (10+ years)' },
];

// Job Types
export const JOB_TYPES = [
  { value: 'full-time', label: 'Full Time' },
  { value: 'part-time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
];

// Salary Ranges
export const SALARY_RANGES = [
  { min: 0, max: 50000, label: 'Under $50K' },
  { min: 50000, max: 75000, label: '$50K - $75K' },
  { min: 75000, max: 100000, label: '$75K - $100K' },
  { min: 100000, max: 150000, label: '$100K - $150K' },
  { min: 150000, max: 200000, label: '$150K - $200K' },
  { min: 200000, max: null, label: '$200K+' },
];

// Common Skills
export const COMMON_SKILLS = [
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'Python',
  'Java',
  'C#',
  'HTML',
  'CSS',
  'SQL',
  'Git',
  'Docker',
  'AWS',
  'Azure',
  'MongoDB',
  'PostgreSQL',
  'Express.js',
  'Next.js',
  'Vue.js',
  'Angular',
  'Spring Boot',
  'Django',
  'Flask',
  'Laravel',
  'Ruby on Rails',
  'Go',
  'Rust',
  'PHP',
  'Swift',
  'Kotlin',
  'Flutter',
  'React Native',
  'Redux',
  'GraphQL',
  'REST API',
  'Microservices',
  'DevOps',
  'CI/CD',
  'Kubernetes',
  'Terraform',
  'Jenkins',
  'Git',
  'Linux',
  'Machine Learning',
  'Data Science',
  'Artificial Intelligence',
  'Deep Learning',
  'TensorFlow',
  'PyTorch',
  'Pandas',
  'NumPy',
  'Scikit-learn',
  'Elasticsearch',
  'Redis',
  'RabbitMQ',
  'Apache Kafka',
  'Apache Spark',
  'Hadoop',
  'Tableau',
  'Power BI',
  'Figma',
  'Adobe Creative Suite',
  'Sketch',
  'InVision',
  'Zeplin',
  'Agile',
  'Scrum',
  'Jira',
  'Confluence',
  'Slack',
  'Microsoft Office',
  'Google Workspace',
  'Salesforce',
  'HubSpot',
  'Shopify',
  'WordPress',
  'Webflow',
  'Notion',
  'Airtable',
];

// Job Categories
export const JOB_CATEGORIES = [
  'Software Development',
  'Data Science',
  'Product Management',
  'Design',
  'Marketing',
  'Sales',
  'Customer Success',
  'Human Resources',
  'Finance',
  'Operations',
  'Engineering',
  'Quality Assurance',
  'DevOps',
  'Security',
  'Analytics',
  'Consulting',
  'Project Management',
  'Business Development',
  'Legal',
  'Administrative',
];

// Popular Locations
export const POPULAR_LOCATIONS = [
  'San Francisco, CA',
  'New York, NY',
  'Seattle, WA',
  'Austin, TX',
  'Los Angeles, CA',
  'Chicago, IL',
  'Boston, MA',
  'Denver, CO',
  'Atlanta, GA',
  'Miami, FL',
  'Phoenix, AZ',
  'San Diego, CA',
  'Philadelphia, PA',
  'Dallas, TX',
  'Houston, TX',
  'Detroit, MI',
  'Portland, OR',
  'Nashville, TN',
  'Raleigh, NC',
  'Washington, DC',
  'Remote',
  'United States',
  'Worldwide',
];

// Match Score Weights
export const MATCH_WEIGHTS = {
  skills: 0.4,
  experience: 0.3,
  location: 0.2,
  title: 0.1,
};

// Match Score Thresholds
export const MATCH_THRESHOLDS = {
  excellent: 0.8,
  good: 0.6,
  fair: 0.4,
  poor: 0.2,
};

// Match Score Labels
export const MATCH_LABELS = {
  excellent: 'Excellent Match',
  good: 'Good Match',
  fair: 'Fair Match',
  poor: 'Poor Match',
};

// API Endpoints
export const API_ENDPOINTS = {
  jobs: '/api/jobs',
  matches: '/api/matches',
  resumes: '/api/resumes',
  auth: '/api/auth',
  upload: '/api/upload',
  profile: '/api/profile',
};

// Hugging Face Models
export const HUGGING_FACE_MODELS = {
  sentenceTransformer: 'sentence-transformers/all-MiniLM-L6-v2',
  textClassification: 'microsoft/DialoGPT-medium',
};

// Animation Durations
export const ANIMATION_DURATIONS = {
  fast: 150,
  normal: 300,
  slow: 500,
};

// Breakpoints
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

// Z-Index Layers
export const Z_INDEX = {
  dropdown: 1000,
  modal: 1050,
  popover: 1100,
  tooltip: 1200,
  toast: 1300,
};

// Error Messages
export const ERROR_MESSAGES = {
  generic: 'Something went wrong. Please try again.',
  network: 'Network error. Please check your connection.',
  auth: 'Authentication failed. Please log in again.',
  validation: 'Please check your input and try again.',
  fileSize: 'File size must be less than 5MB.',
  fileType: 'Please upload a PDF or Word document.',
  required: 'This field is required.',
  email: 'Please enter a valid email address.',
  password: 'Password must be at least 8 characters long.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  saved: 'Successfully saved!',
  uploaded: 'File uploaded successfully!',
  applied: 'Application submitted successfully!',
  updated: 'Profile updated successfully!',
  deleted: 'Successfully deleted!',
  signUp: 'Account created successfully!',
  signIn: 'Successfully signed in!',
  signOut: 'Successfully signed out!',
};

// Loading Messages
export const LOADING_MESSAGES = {
  loading: 'Loading...',
  saving: 'Saving...',
  uploading: 'Uploading...',
  processing: 'Processing...',
  analyzing: 'Analyzing...',
  matching: 'Finding matches...',
  searching: 'Searching...',
};