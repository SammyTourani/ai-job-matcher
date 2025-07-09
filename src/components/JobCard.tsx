import Link from 'next/link';
import { MapPin, Building, Clock, DollarSign, Briefcase, Globe } from 'lucide-react';
import { Job } from '@/types';
import { formatSalary, formatTimeAgo, getExperienceLabel, getJobTypeLabel } from '@/utils/helpers';

interface JobCardProps {
  job: Job;
  matchScore?: number;
  onApply?: (jobId: string) => void;
}

export default function JobCard({ job, matchScore, onApply }: JobCardProps) {
  const handleApply = () => {
    if (onApply) {
      onApply(job.id);
    }
  };

  const getMatchBadge = (score: number) => {
    const percentage = Math.round(score * 100);
    let badgeClass = 'badge-outline';
    
    if (percentage >= 80) badgeClass = 'badge bg-green-100 text-green-800';
    else if (percentage >= 60) badgeClass = 'badge bg-blue-100 text-blue-800';
    else if (percentage >= 40) badgeClass = 'badge bg-yellow-100 text-yellow-800';
    else badgeClass = 'badge bg-red-100 text-red-800';
    
    return (
      <span className={badgeClass}>
        {percentage}% Match
      </span>
    );
  };

  return (
    <div className="job-card group">
      <div className="job-card-header">
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Link 
                href={`/job/${job.id}`}
                className="job-card-title hover:text-blue-600 transition-colors"
              >
                {job.title}
              </Link>
              <div className="job-card-company flex items-center gap-1">
                <Building className="w-4 h-4" />
                {job.company}
              </div>
            </div>
            {matchScore && (
              <div className="ml-4">
                {getMatchBadge(matchScore)}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {job.location}
            </div>
            {job.remote_option && (
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                Remote
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatTimeAgo(job.created_at)}
            </div>
          </div>
        </div>
      </div>
      
      <div className="job-card-description line-clamp-3">
        {job.description}
      </div>
      
      <div className="job-card-skills">
        {job.skills.slice(0, 6).map((skill, index) => (
          <span key={index} className="skill-tag">
            {skill}
          </span>
        ))}
        {job.skills.length > 6 && (
          <span className="skill-tag bg-gray-100 text-gray-600">
            +{job.skills.length - 6} more
          </span>
        )}
      </div>
      
      <div className="job-card-footer">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            {formatSalary(job.salary_min, job.salary_max)}
          </div>
          <div className="flex items-center gap-1">
            <Briefcase className="w-4 h-4" />
            {getJobTypeLabel(job.job_type)}
          </div>
          <div className="badge-outline">
            {getExperienceLabel(job.experience_level)}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Link
            href={`/job/${job.id}`}
            className="btn-ghost btn-sm"
          >
            View Details
          </Link>
          {onApply && (
            <button
              onClick={handleApply}
              className="btn-primary btn-sm"
            >
              Apply Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}