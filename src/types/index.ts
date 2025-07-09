// Database Types
export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary_min?: number;
  salary_max?: number;
  description: string;
  requirements: string[];
  skills: string[];
  experience_level: 'entry' | 'mid' | 'senior' | 'executive';
  job_type: 'full-time' | 'part-time' | 'contract' | 'internship';
  remote_option: boolean;
  created_at: string;
  updated_at: string;
}

export interface Resume {
  id: string;
  user_id: string;
  filename: string;
  file_url: string;
  extracted_text: string;
  parsed_data: ParsedResumeData;
  created_at: string;
  updated_at: string;
}

export interface ParsedResumeData {
  skills: string[];
  experience_years: number;
  education: Education[];
  job_titles: string[];
  summary?: string;
}

export interface Education {
  degree: string;
  school: string;
  year?: number;
  field?: string;
}

export interface JobMatch {
  id: string;
  user_id: string;
  job_id: string;
  resume_id: string;
  match_score: number;
  skills_match: number;
  experience_match: number;
  location_match: number;
  title_match: number;
  explanation: string;
  created_at: string;
}

export interface JobApplication {
  id: string;
  user_id: string;
  job_id: string;
  resume_id: string;
  status: 'pending' | 'applied' | 'interview' | 'rejected' | 'accepted';
  applied_at: string;
  updated_at: string;
}

// Component Props
export interface JobCardProps {
  job: Job;
  matchScore?: number;
  onApply?: (jobId: string) => void;
}

export interface ResumeUploadProps {
  onUpload: (file: File) => Promise<void>;
  loading?: boolean;
}

export interface MatchScoreProps {
  score: number;
  explanation: string;
  breakdown: {
    skills: number;
    experience: number;
    location: number;
    title: number;
  };
}

export interface SearchFilters {
  query?: string;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  experienceLevel?: string;
  jobType?: string;
  remoteOnly?: boolean;
  skills?: string[];
}

// API Response Types
export interface JobSearchResponse {
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface MatchingResponse {
  matches: JobMatch[];
  total: number;
}

// Utility Types
export interface ApiResponse<T> {
  data: T;
  error?: string;
  success: boolean;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

// AI/ML Types
export interface SimilarityScore {
  score: number;
  details: {
    skills: number;
    experience: number;
    location: number;
    title: number;
  };
}

export interface HuggingFaceResponse {
  embeddings: number[][];
  error?: string;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignUpFormData {
  email: string;
  password: string;
  fullName: string;
}

export interface ProfileFormData {
  fullName: string;
  email: string;
  location?: string;
  bio?: string;
}