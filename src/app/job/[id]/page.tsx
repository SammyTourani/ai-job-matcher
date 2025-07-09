import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Building, 
  MapPin, 
  Clock, 
  DollarSign, 
  Briefcase, 
  Users, 
  Globe,
  BookOpen,
  CheckCircle
} from 'lucide-react';
import { Job } from '@/types';
import { 
  formatSalary, 
  formatTimeAgo, 
  getExperienceLabel, 
  getJobTypeLabel 
} from '@/utils/helpers';

interface JobDetailPageProps {
  params: {
    id: string;
  };
}

async function getJob(id: string): Promise<Job | null> {
  try {
    // In a real app, this would be a database query
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/sample-jobs.json`);
    const jobs: Job[] = await response.json();
    return jobs.find(job => job.id === id) || null;
  } catch (error) {
    console.error('Error fetching job:', error);
    return null;
  }
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;
  const job = await getJob(id);
  
  if (!job) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Jobs
        </Link>

        {/* Job Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              
              <div className="flex items-center gap-2 mb-4">
                <Building className="w-5 h-5 text-gray-400" />
                <span className="text-lg text-gray-700">{job.company}</span>
              </div>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {job.location}
                </div>
                {job.remote_option && (
                  <div className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    Remote Available
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatTimeAgo(job.created_at)}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  <DollarSign className="w-4 h-4" />
                  {formatSalary(job.salary_min, job.salary_max)}
                </div>
                <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  <Briefcase className="w-4 h-4" />
                  {getJobTypeLabel(job.job_type)}
                </div>
                <div className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  <Users className="w-4 h-4" />
                  {getExperienceLabel(job.experience_level)}
                </div>
              </div>
            </div>
            
            <div className="mt-6 lg:mt-0 lg:ml-8">
              <button className="w-full lg:w-auto btn-primary btn-lg mb-3">
                Apply Now
              </button>
              <button className="w-full lg:w-auto btn-outline">
                Save Job
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Job Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  {job.description}
                </p>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Requirements
                </h3>
                <ul className="space-y-2 mb-6">
                  {job.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{requirement}</span>
                    </li>
                  ))}
                </ul>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  Required Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Information</h3>
              <div className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Company</dt>
                  <dd className="text-sm text-gray-900">{job.company}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Location</dt>
                  <dd className="text-sm text-gray-900">{job.location}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Employment Type</dt>
                  <dd className="text-sm text-gray-900">{getJobTypeLabel(job.job_type)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Experience Level</dt>
                  <dd className="text-sm text-gray-900">{getExperienceLabel(job.experience_level)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Salary Range</dt>
                  <dd className="text-sm text-gray-900">{formatSalary(job.salary_min, job.salary_max)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Remote Work</dt>
                  <dd className="text-sm text-gray-900">
                    {job.remote_option ? 'Available' : 'Not Available'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Posted</dt>
                  <dd className="text-sm text-gray-900">{formatTimeAgo(job.created_at)}</dd>
                </div>
              </div>
            </div>

            {/* Apply Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Apply for this Job</h3>
              <p className="text-sm text-gray-600 mb-4">
                Ready to take the next step? Click below to apply for this position.
              </p>
              <button className="w-full btn-primary mb-3">
                Apply Now
              </button>
              <button className="w-full btn-outline">
                Save for Later
              </button>
              <p className="text-xs text-gray-500 mt-3">
                You'll be able to upload your resume and write a cover letter on the next page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}