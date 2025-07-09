'use client';

import { useState, useEffect } from 'react';
import { Job, SearchFilters } from '@/types';
import Navigation from '@/components/Navigation';
import JobCard from '@/components/JobCard';
import SearchBar from '@/components/SearchBar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { supabase } from '@/lib/supabase';
import { JOBS_PER_PAGE } from '@/utils/constants';

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<SearchFilters>({});

  useEffect(() => {
    loadJobs();
    checkUser();
  }, [currentPage, filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    } catch (error) {
      console.error('Error checking user:', error);
    }
  };

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // For now, load from static JSON file
      // In production, this would be replaced with Supabase queries
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

  const handleSearch = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user} onSignOut={handleSignOut} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find Your Dream Job
          </h1>
          <p className="text-gray-600">
            Discover opportunities that match your skills and career goals
          </p>
        </div>
        
        <SearchBar onSearch={handleSearch} />
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            <div className="mb-6 text-sm text-gray-600">
              {jobs.length === 0 ? (
                'No jobs found matching your criteria.'
              ) : (
                `Showing ${jobs.length} job${jobs.length !== 1 ? 's' : ''} on page ${currentPage} of ${totalPages}`
              )}
            </div>
            
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        page === currentPage
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}