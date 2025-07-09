'use client';

import { useState, useEffect } from 'react';
import { Target, TrendingUp, Award, Users } from 'lucide-react';
import Navigation from '@/components/Navigation';
import JobCard from '@/components/JobCard';
import MatchScore from '@/components/MatchScore';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Job, JobMatch } from '@/types';
import { supabase } from '@/lib/supabase';

export default function MatchesPage() {
  const [user, setUser] = useState<any>(null);
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMatches();
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    } catch (error) {
      console.error('Error checking user:', error);
    }
  };

  const loadMatches = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load jobs first
      const jobsResponse = await fetch('/sample-jobs.json');
      const allJobs: Job[] = await jobsResponse.json();
      
      // Simulate AI matching results
      const mockMatches: JobMatch[] = [
        {
          id: '1',
          user_id: 'user-1',
          job_id: '1',
          resume_id: 'resume-1',
          match_score: 0.92,
          skills_match: 0.95,
          experience_match: 0.85,
          location_match: 0.90,
          title_match: 0.98,
          explanation: 'Excellent match! Your React and TypeScript skills align perfectly with this senior role. Your 5+ years of experience meets their requirements.',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          user_id: 'user-1',
          job_id: '3',
          resume_id: 'resume-1',
          match_score: 0.78,
          skills_match: 0.80,
          experience_match: 0.75,
          location_match: 0.85,
          title_match: 0.70,
          explanation: 'Good match! Your Python and machine learning background is valuable. Consider highlighting your data analysis experience.',
          created_at: new Date().toISOString()
        },
        {
          id: '3',
          user_id: 'user-1',
          job_id: '6',
          resume_id: 'resume-1',
          match_score: 0.85,
          skills_match: 0.90,
          experience_match: 0.80,
          location_match: 0.85,
          title_match: 0.85,
          explanation: 'Strong match! Your AWS and Docker experience is highly relevant. Your background in CI/CD makes you a great candidate.',
          created_at: new Date().toISOString()
        },
        {
          id: '4',
          user_id: 'user-1',
          job_id: '8',
          resume_id: 'resume-1',
          match_score: 0.72,
          skills_match: 0.75,
          experience_match: 0.70,
          location_match: 0.80,
          title_match: 0.65,
          explanation: 'Fair match! Your Python skills are a good fit. Consider building more experience with Django/Flask frameworks.',
          created_at: new Date().toISOString()
        },
        {
          id: '5',
          user_id: 'user-1',
          job_id: '10',
          resume_id: 'resume-1',
          match_score: 0.69,
          skills_match: 0.65,
          experience_match: 0.60,
          location_match: 0.85,
          title_match: 0.85,
          explanation: 'Decent match! Your technical foundation is solid. This role could help you transition into ML engineering.',
          created_at: new Date().toISOString()
        }
      ];
      
      // Sort matches by score (highest first)
      const sortedMatches = mockMatches.sort((a, b) => b.match_score - a.match_score);
      
      setMatches(sortedMatches);
      setJobs(allJobs);
      
    } catch (error) {
      console.error('Error loading matches:', error);
      setError('Failed to load job matches. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getJobById = (jobId: string) => {
    return jobs.find(job => job.id === jobId);
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMatchLabel = (score: number) => {
    if (score >= 0.8) return 'Excellent Match';
    if (score >= 0.6) return 'Good Match';
    return 'Fair Match';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user} onSignOut={handleSignOut} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Job Matches
          </h1>
          <p className="text-gray-600">
            AI-powered job recommendations based on your resume analysis
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg max-w-md mx-auto">
              <p className="text-red-700">{error}</p>
            </div>
            <button
              onClick={loadMatches}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No matches yet
            </h2>
            <p className="text-gray-600 mb-6">
              Upload your resume to get personalized job recommendations
            </p>
            <button
              onClick={() => window.location.href = '/upload'}
              className="btn-primary"
            >
              Upload Resume
            </button>
          </div>
        ) : (
          <>
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <Target className="w-8 h-8 text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Matches</p>
                    <p className="text-2xl font-bold text-gray-900">{matches.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <TrendingUp className="w-8 h-8 text-green-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Excellent</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {matches.filter(m => m.match_score >= 0.8).length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <Award className="w-8 h-8 text-yellow-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Good</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {matches.filter(m => m.match_score >= 0.6 && m.match_score < 0.8).length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-purple-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average Score</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.round((matches.reduce((sum, m) => sum + m.match_score, 0) / matches.length) * 100)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Match Results */}
            <div className="space-y-6">
              {matches.map((match) => {
                const job = getJobById(match.job_id);
                if (!job) return null;

                return (
                  <div key={match.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`text-lg font-bold ${getMatchScoreColor(match.match_score)}`}>
                          {Math.round(match.match_score * 100)}%
                        </div>
                        <div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            match.match_score >= 0.8 ? 'bg-green-100 text-green-800' :
                            match.match_score >= 0.6 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {getMatchLabel(match.match_score)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <JobCard job={job} matchScore={match.match_score} />
                      </div>
                      
                      <div>
                        <MatchScore 
                          score={match.match_score}
                          explanation={match.explanation}
                          breakdown={{
                            skills: match.skills_match,
                            experience: match.experience_match,
                            location: match.location_match,
                            title: match.title_match
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}