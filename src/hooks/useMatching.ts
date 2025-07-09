import { useState, useEffect } from 'react';
import { JobMatch, Job, ParsedResumeData } from '@/types';
import { AIJobMatcher } from '@/lib/ai-matcher';
import { MATCHES_PER_PAGE } from '@/utils/constants';

interface UseMatchingReturn {
  matches: JobMatch[];
  loading: boolean;
  error: string | null;
  generateMatches: (resumeData: ParsedResumeData) => Promise<void>;
  refreshMatches: () => void;
  getMatchStats: () => MatchStats;
}

interface MatchStats {
  totalMatches: number;
  excellentMatches: number;
  goodMatches: number;
  averageScore: number;
}

export function useMatching(userId?: string): UseMatchingReturn {
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateMatches = async (resumeData: ParsedResumeData) => {
    try {
      setLoading(true);
      setError(null);

      // Load available jobs
      const response = await fetch('/sample-jobs.json');
      if (!response.ok) {
        throw new Error('Failed to load jobs');
      }
      
      const jobs: Job[] = await response.json();
      
      // Generate matches for each job
      const newMatches: JobMatch[] = [];
      
      for (const job of jobs) {
        const similarity = AIJobMatcher.calculateMatch(resumeData, job);
        
        // Only include matches with score > 0.5
        if (similarity.score > 0.5) {
          const explanation = AIJobMatcher.generateMatchExplanation(
            similarity,
            resumeData,
            job
          );
          
          const match: JobMatch = {
            id: `match-${Date.now()}-${job.id}`,
            user_id: userId || 'demo-user',
            job_id: job.id,
            resume_id: 'demo-resume',
            match_score: similarity.score,
            skills_match: similarity.details.skills,
            experience_match: similarity.details.experience,
            location_match: similarity.details.location,
            title_match: similarity.details.title,
            explanation,
            created_at: new Date().toISOString()
          };
          
          newMatches.push(match);
        }
      }
      
      // Sort by match score (highest first)
      newMatches.sort((a, b) => b.match_score - a.match_score);
      
      setMatches(newMatches);
    } catch (error) {
      console.error('Error generating matches:', error);
      setError('Failed to generate job matches. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const refreshMatches = () => {
    // In a real app, this would reload from the database
    // For now, we'll just keep existing matches
    console.log('Refreshing matches...');
  };

  const getMatchStats = (): MatchStats => {
    const totalMatches = matches.length;
    const excellentMatches = matches.filter(m => m.match_score >= 0.8).length;
    const goodMatches = matches.filter(m => m.match_score >= 0.6 && m.match_score < 0.8).length;
    const averageScore = totalMatches > 0 
      ? matches.reduce((sum, m) => sum + m.match_score, 0) / totalMatches 
      : 0;

    return {
      totalMatches,
      excellentMatches,
      goodMatches,
      averageScore
    };
  };

  return {
    matches,
    loading,
    error,
    generateMatches,
    refreshMatches,
    getMatchStats
  };
}

// Hook for getting matches for a specific job
export function useJobMatches(jobId: string) {
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [explanation, setExplanation] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const calculateMatchForJob = async (resumeData: ParsedResumeData) => {
    try {
      setLoading(true);
      
      // Load the specific job
      const response = await fetch('/sample-jobs.json');
      const jobs: Job[] = await response.json();
      const job = jobs.find(j => j.id === jobId);
      
      if (!job) {
        throw new Error('Job not found');
      }
      
      // Calculate match
      const similarity = AIJobMatcher.calculateMatch(resumeData, job);
      const explanationText = AIJobMatcher.generateMatchExplanation(
        similarity,
        resumeData,
        job
      );
      
      setMatchScore(similarity.score);
      setExplanation(explanationText);
    } catch (error) {
      console.error('Error calculating job match:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    matchScore,
    explanation,
    loading,
    calculateMatchForJob
  };
}

// Hook for match analytics
export function useMatchAnalytics(userId?: string) {
  const [analytics, setAnalytics] = useState({
    totalApplications: 0,
    responseRate: 0,
    averageMatchScore: 0,
    topSkills: [] as string[],
    applicationsByStatus: {
      pending: 0,
      applied: 0,
      interview: 0,
      rejected: 0,
      accepted: 0
    }
  });
  const [loading, setLoading] = useState(false);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      // Mock analytics data
      // In a real app, this would come from the database
      setAnalytics({
        totalApplications: 12,
        responseRate: 0.35,
        averageMatchScore: 0.78,
        topSkills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS'],
        applicationsByStatus: {
          pending: 3,
          applied: 7,
          interview: 1,
          rejected: 1,
          accepted: 0
        }
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      loadAnalytics();
    }
  }, [userId]);

  return {
    analytics,
    loading,
    refreshAnalytics: loadAnalytics
  };
}

// Hook for real-time match updates
export function useRealtimeMatches(userId?: string) {
  const [newMatchCount, setNewMatchCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    if (!userId) return;

    // Simulate real-time updates
    const interval = setInterval(() => {
      // Randomly add new matches (simulation)
      if (Math.random() > 0.95) { // 5% chance every interval
        setNewMatchCount(prev => prev + 1);
        setLastUpdate(new Date());
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [userId]);

  const markAsRead = () => {
    setNewMatchCount(0);
  };

  return {
    newMatchCount,
    lastUpdate,
    markAsRead
  };
}