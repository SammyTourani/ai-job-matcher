import { useState, useEffect } from 'react';
import { Job, SearchFilters } from '@/types';
import { JOBS_PER_PAGE } from '@/utils/constants';

interface UseJobsReturn {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  searchJobs: (filters: SearchFilters) => void;
  setPage: (page: number) => void;
  refreshJobs: () => void;
}

export function useJobs(): UseJobsReturn {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<SearchFilters>({});

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In production, this would be an API call
      const response = await fetch('/sample-jobs.json');
      if (!response.ok) {
        throw new Error('Failed to load jobs');
      }
      
      const allJobs: Job[] = await response.json();
      
      // Apply filters
      let filteredJobs = allJobs;
      
      if (filters.query) {
        const query = filters.query.toLowerCase();
        filteredJobs = filteredJobs.filter(job =>
          job.title.toLowerCase().includes(query) ||
          job.company.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query) ||
          job.skills.some(skill => skill.toLowerCase().includes(query))
        );
      }
      
      if (filters.location) {
        filteredJobs = filteredJobs.filter(job =>
          job.location.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }
      
      if (filters.experienceLevel) {
        filteredJobs = filteredJobs.filter(job =>
          job.experience_level === filters.experienceLevel
        );
      }
      
      if (filters.jobType) {
        filteredJobs = filteredJobs.filter(job =>
          job.job_type === filters.jobType
        );
      }
      
      if (filters.remoteOnly) {
        filteredJobs = filteredJobs.filter(job => job.remote_option);
      }
      
      if (filters.salaryMin) {
        filteredJobs = filteredJobs.filter(job =>
          job.salary_min && job.salary_min >= filters.salaryMin!
        );
      }
      
      if (filters.salaryMax) {
        filteredJobs = filteredJobs.filter(job =>
          job.salary_max && job.salary_max <= filters.salaryMax!
        );
      }
      
      // Pagination
      const total = filteredJobs.length;
      const pages = Math.ceil(total / JOBS_PER_PAGE);
      const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
      const endIndex = startIndex + JOBS_PER_PAGE;
      const paginatedJobs = filteredJobs.slice(startIndex, endIndex);
      
      setJobs(paginatedJobs);
      setTotalPages(pages);
    } catch (error) {
      console.error('Error loading jobs:', error);
      setError('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const searchJobs = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const setPage = (page: number) => {
    setCurrentPage(page);
  };

  const refreshJobs = () => {
    loadJobs();
  };

  useEffect(() => {
    loadJobs();
  }, [currentPage, filters]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    jobs,
    loading,
    error,
    totalPages,
    currentPage,
    searchJobs,
    setPage,
    refreshJobs
  };
}

export function useJob(id: string) {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadJob = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/sample-jobs.json');
        if (!response.ok) {
          throw new Error('Failed to load job');
        }
        
        const jobs: Job[] = await response.json();
        const foundJob = jobs.find(job => job.id === id);
        
        if (!foundJob) {
          setError('Job not found');
          return;
        }
        
        setJob(foundJob);
      } catch (error) {
        console.error('Error loading job:', error);
        setError('Failed to load job. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadJob();
    }
  }, [id]);

  return { job, loading, error };
}